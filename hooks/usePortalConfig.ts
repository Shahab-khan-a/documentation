"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DEFAULT_PORTAL_CONFIG, normalizePortalConfig } from "@/constants/defaults";
import { PortalConfig } from "@/types/portal";
import {
  getPortalRecordBySerialUnified,
  getConfigFromFirebase,
  subscribeToPortalConfig,
} from "@/lib/firebase";

function extractParamsFromUrl(params?: ReturnType<typeof useParams>): {
  serial?: string;
  unified?: string;
  requestNumber?: string;
} {
  const rawSerial =
    typeof params?.serial === "string"
      ? params.serial
      : Array.isArray(params?.serial)
      ? params.serial[0]
      : undefined;
  const rawUnified =
    typeof params?.unified === "string"
      ? params.unified
      : Array.isArray(params?.unified)
      ? params.unified[0]
      : undefined;
  const rawReq =
    typeof params?.requestNumber === "string"
      ? params.requestNumber
      : Array.isArray(params?.requestNumber)
      ? params.requestNumber[0]
      : undefined;

  let serial = rawSerial ? decodeURIComponent(rawSerial).trim() : undefined;
  let unified = rawUnified ? decodeURIComponent(rawUnified).trim() : undefined;
  let requestNumber = rawReq ? decodeURIComponent(rawReq).trim() : undefined;

  if (typeof window !== "undefined") {
    const hash = window.location.hash || "";
    const pathname = window.location.pathname || "";

    const hashLower = hash.trim().toLowerCase();
    const pathLower = pathname.trim().toLowerCase();

    // Check if user navigated to /admin at the end of the URL or hash
    if (
      hashLower.endsWith("/admin") ||
      hashLower.endsWith("/admin/") ||
      hashLower === "#admin" ||
      hashLower === "#/admin" ||
      pathLower.endsWith("/admin") ||
      pathLower.endsWith("/admin/")
    ) {
      window.location.href = "/admin";
      return { serial: undefined, unified: undefined, requestNumber: undefined };
    }

    const source = hash.toLowerCase().includes("documentverify")
      ? hash
      : pathname.toLowerCase().includes("documentverify")
      ? pathname
      : hash || pathname;

    if (source) {
      const clean = source.replace(/^[#/]+/, "").split("?")[0];
      const parts = clean
        .split("/")
        .map((p) => decodeURIComponent(p).trim())
        .filter(Boolean);

      // Check if any segment is "admin"
      if (parts.some((p) => p.toLowerCase() === "admin")) {
        window.location.href = "/admin";
        return { serial: undefined, unified: undefined, requestNumber: undefined };
      }

      const dvIndex = parts.findIndex((p) => p.toLowerCase() === "documentverify");
      if (dvIndex !== -1) {
        const after = parts.slice(dvIndex + 1);
        if (!requestNumber && after[0]) {
          requestNumber = after[0];
        }
        if (after[1]?.toLowerCase() === "mem") {
          if (!serial && after[2]) serial = after[2];
          if (!unified && after[3]) unified = after[3];
        } else {
          if (!serial && after[1]) serial = after[1];
          if (!unified && after[2]) unified = after[2];
        }
      } else if (parts.length > 0) {
        const nonReserved = parts.filter(
          (p) => !["sa", "admin", "api", "documentverify"].includes(p.toLowerCase())
        );
        if (!serial && nonReserved.length >= 1) {
          serial = nonReserved[0];
          if (!unified && nonReserved.length >= 2) {
            unified = nonReserved[1];
          }
        }
      }
    }
  }

  if (serial?.toLowerCase() === "admin" || unified?.toLowerCase() === "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
    return { serial: undefined, unified: undefined, requestNumber: undefined };
  }

  return { serial, unified, requestNumber };
}

export function usePortalConfig() {
  const params = useParams();
  const [config, setConfig] = useState<PortalConfig>(() => ({ ...DEFAULT_PORTAL_CONFIG }));

  // 1. Fetch live config from server & listen to Admin updates
  useEffect(() => {
    const { serial: serialParam, unified: unifiedParam, requestNumber: reqParam } =
      extractParamsFromUrl(params);

    let isMounted = true;

    async function fetchLiveConfig() {
      // 1. Check client local cache
      try {
        const cached = localStorage.getItem("portal_config_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!serialParam || parsed.serialNumber === serialParam) {
            if (isMounted) {
              setConfig(normalizePortalConfig(parsed));
            }
          }
        }
      } catch {
        // ignore
      }

      // 2. Query Firebase directly on the client first
      try {
        let fbConfig: PortalConfig | null = null;
        if (serialParam) {
          fbConfig = await getPortalRecordBySerialUnified(serialParam, unifiedParam, reqParam);
        } else {
          fbConfig = await getConfigFromFirebase(serialParam, unifiedParam, reqParam);
        }

        if (fbConfig && isMounted) {
          const safeConfig = normalizePortalConfig(fbConfig);
          setConfig(safeConfig);
          try {
            localStorage.setItem("portal_config_cache", JSON.stringify(safeConfig));
          } catch {
            // ignore
          }
        }
      } catch (fbErr) {
        console.warn("Direct Firebase fetch notice:", fbErr);
      }

      // 3. Concurrent fetch via API route
      try {
        const query = new URLSearchParams();
        if (serialParam) query.set("serial", serialParam);
        if (unifiedParam) query.set("unified", unifiedParam);
        if (reqParam) query.set("req", reqParam);
        query.set("_t", Date.now().toString());

        const res = await fetch(`/api/config?${query.toString()}`, { cache: "no-store" });
        if (res.ok && isMounted) {
          const data: PortalConfig = await res.json();
          const safeConfig = normalizePortalConfig(data);
          setConfig(safeConfig);
          try {
            localStorage.setItem("portal_config_cache", JSON.stringify(safeConfig));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error("Error fetching live config from API:", err);
      }
    }

    fetchLiveConfig();

    // 4. Real-time Firebase Firestore live subscription
    const unsubscribeFirebase = subscribeToPortalConfig(serialParam, unifiedParam, (updatedConfig) => {
      if (!isMounted) return;
      const safeConfig = normalizePortalConfig(updatedConfig);
      setConfig(safeConfig);
      try {
        localStorage.setItem("portal_config_cache", JSON.stringify(safeConfig));
      } catch {
        // ignore
      }
    });

    // 5. Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portal_config_cache" && e.newValue && isMounted) {
        try {
          const updated = JSON.parse(e.newValue);
          if (!serialParam || updated.serialNumber === serialParam) {
            setConfig(normalizePortalConfig(updated));
          } else {
            // Even if viewing a specific serial record, sync global footer & organization branding
            setConfig((prev) =>
              normalizePortalConfig({
                ...prev,
                copyrightText: updated.copyrightText,
                supportPhone: updated.supportPhone || prev.supportPhone,
                devLabel: updated.devLabel || prev.devLabel,
                companyNameAr: updated.companyNameAr || prev.companyNameAr,
                companyNameEn: updated.companyNameEn || prev.companyNameEn,
                socialLinks: { ...(prev.socialLinks || {}), ...(updated.socialLinks || {}) },
              })
            );
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 6. Handle client-side hash navigation
    const handleHashChange = () => {
      fetchLiveConfig();
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      isMounted = false;
      if (unsubscribeFirebase) unsubscribeFirebase();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [params]);

  // Synchronize browser URL bar to display '/sa/#/DocumentVerify/[requestNumber]/mem/[serialNumber]' (without unified number)
  useEffect(() => {
    const cleanSerial = config.serialNumber?.trim();
    const cleanReq = config.requestNumber?.trim() || "13255887";
    if (!cleanSerial) return;

    const targetPath = `/sa/#/DocumentVerify/${encodeURIComponent(cleanReq)}/mem/${encodeURIComponent(cleanSerial)}`;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // Do not rewrite if inside admin or api
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/api")) {
        return;
      }
      const currentFull = `${window.location.pathname}${window.location.hash}`;
      try {
        if (
          decodeURIComponent(currentFull) !== decodeURIComponent(targetPath) &&
          decodeURIComponent(currentFull) !== decodeURIComponent(`/sa${targetPath.replace("/sa", "")}`)
        ) {
          window.history.replaceState(null, "", targetPath);
        }
      } catch {
        window.history.replaceState(null, "", targetPath);
      }
    }
  }, [config.serialNumber, config.requestNumber]);

  return { config, setConfig };
}
