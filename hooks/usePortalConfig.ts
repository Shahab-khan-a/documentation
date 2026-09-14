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

export function usePortalConfig() {
  const params = useParams();
  const [config, setConfig] = useState<PortalConfig>(() => ({ ...DEFAULT_PORTAL_CONFIG }));

  // 1. Fetch live config from server & listen to Admin updates
  useEffect(() => {
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

    const serialParam = rawSerial ? decodeURIComponent(rawSerial).trim() : undefined;
    const unifiedParam = rawUnified ? decodeURIComponent(rawUnified).trim() : undefined;
    const reqParam = rawReq ? decodeURIComponent(rawReq).trim() : undefined;

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

    return () => {
      isMounted = false;
      if (unsubscribeFirebase) unsubscribeFirebase();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [params]);

  // Synchronize browser URL bar to display '/DocumentVerify/[requestNumber]/mem/[serialNumber]' (without unified number)
  useEffect(() => {
    const cleanSerial = config.serialNumber?.trim();
    const cleanReq = config.requestNumber?.trim();
    if (!cleanSerial) return;

    const targetPath = `/DocumentVerify/${encodeURIComponent(cleanReq || "13255887")}/mem/${encodeURIComponent(cleanSerial)}`;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // Do not rewrite if inside admin or api
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/api")) {
        return;
      }
      try {
        if (decodeURIComponent(currentPath) !== decodeURIComponent(targetPath)) {
          window.history.replaceState(null, "", targetPath);
        }
      } catch {
        window.history.replaceState(null, "", targetPath);
      }
    }
  }, [config.serialNumber, config.requestNumber]);

  return { config, setConfig };
}
