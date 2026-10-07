"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { TujarHeader } from "./TujarHeader";
import { TujarBreadcrumb } from "./TujarBreadcrumb";
import { TujarStepper } from "./TujarStepper";
import {
  TujarVerificationResultCard,
  TujarDocumentDetails,
} from "./TujarVerificationResultCard";
import { TujarSearchCard } from "./TujarSearchCard";
import { TujarFooter } from "./TujarFooter";
import { TujarLoader } from "./TujarLoader";
import { usePortalConfig } from "@/hooks/usePortalConfig";
import { useFileDownload } from "@/hooks/useFileDownload";
import { DownloadAnimationOverlay } from "@/components/portal/DownloadAnimationOverlay";
import { sanitizeDocNumber } from "@/constants/defaults";
import { TujarSupportChatIcon } from "@/lib/tujar-icons";
import "@/app/tujar.css";

export function TujarVerificationView() {
  const searchParams = useSearchParams();
  const rawQueryDoc =
    searchParams?.get("documentNumber") ||
    searchParams?.get("DocumentNumber") ||
    searchParams?.get("doc") ||
    "";
  const rawQuerySub =
    searchParams?.get("subscriptionNumber") ||
    searchParams?.get("SubscriptionNumber") ||
    searchParams?.get("sub") ||
    searchParams?.get("serial") ||
    "";
  const queryDoc = sanitizeDocNumber(rawQueryDoc);
  const querySub = sanitizeDocNumber(rawQuerySub);
  const { config } = usePortalConfig();
  const { isDownloading, downloadLoaderActive, downloadFileWithAnimation } = useFileDownload();

  // Extract initial parameters from query params or DocumentVerify URL hash/path
  const parseUrlParams = useCallback(() => {
    if (typeof window === "undefined") {
      return { doc: queryDoc || "", sub: querySub || "", req: "" };
    }
    const fullHref = (window.location.href || "").trim().toLowerCase();
    const hash = (window.location.hash || "").trim().toLowerCase();
    const pathname = (window.location.pathname || "").trim().toLowerCase();
    const search = (window.location.search || "").trim().toLowerCase();

    // Instant redirect to Admin Panel if /admin or #admin is detected
    if (
      pathname !== "/admin" &&
      (
        hash.includes("admin") ||
        pathname.includes("/admin") ||
        pathname.endsWith("/admin") ||
        search.includes("/admin") ||
        search.includes("=admin") ||
        search.includes("&admin") ||
        search.endsWith("admin") ||
        fullHref.includes("/admin") ||
        fullHref.endsWith("/admin") ||
        fullHref.endsWith("/admin/") ||
        fullHref.includes("#admin")
      )
    ) {
      window.location.href = "/admin";
      return { doc: "", sub: "", req: "" };
    }

    const source = hash.toLowerCase().includes("documentverify")
      ? hash
      : pathname.toLowerCase().includes("documentverify")
      ? pathname
      : hash || pathname;

    let req = "";
    let s = "";
    if (source) {
      const clean = source.replace(/^[#/]+/, "").split("?")[0];
      const parts = clean
        .split("/")
        .map((p) => decodeURIComponent(p).trim())
        .filter((p) => Boolean(p) && p !== "." && p !== "#");

      const dvIndex = parts.findIndex((p) => p.toLowerCase() === "documentverify");
      if (dvIndex !== -1) {
        const after = parts.slice(dvIndex + 1);
        req = sanitizeDocNumber(after[0]) || "";
        if (after[1]?.toLowerCase() === "mem") {
          s = sanitizeDocNumber(after[2]) || "";
        } else {
          s = sanitizeDocNumber(after[1]) || "";
        }
      } else if (parts.length > 0) {
        const nonReserved = parts.filter(
          (p) => !["sa", "admin", "api", "documentverify"].includes(p.toLowerCase())
        );
        if (nonReserved.length >= 1) s = sanitizeDocNumber(nonReserved[0]);
      }
    }

    return {
      doc: sanitizeDocNumber(queryDoc || ""),
      sub: sanitizeDocNumber(querySub || s || ""),
      req: sanitizeDocNumber(req || ""),
    };
  }, [queryDoc, querySub]);

  const initialParams = parseUrlParams();
  const [documentNumber, setDocumentNumber] = useState(
    sanitizeDocNumber(config?.documentNumber) || initialParams.doc || "205-178"
  );
  const [subscriptionNumber, setSubscriptionNumber] = useState(initialParams.sub || "205001150789");
  const [orderNumber, setOrderNumber] = useState(initialParams.req || "205-154");
  const [searchedDoc, setSearchedDoc] = useState<string | null>(null);

  // Step state: 1: Search Form, 2: Verification Result Card
  const [step, setStep] = useState<number>(2);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Sync state if query params or URL changes
  useEffect(() => {
    const p = parseUrlParams();
    if (p.doc) setDocumentNumber(p.doc);
    if (p.sub) setSubscriptionNumber(p.sub);
    if (p.req) setOrderNumber(p.req);
    if (p.doc && p.sub) setStep(2);
  }, [queryDoc, querySub, parseUrlParams]);

  // Sync documentNumber state and update browser URL when config.documentNumber loads from Firebase / Drive
  useEffect(() => {
    const cleanDoc = sanitizeDocNumber(config?.documentNumber);
    if (!cleanDoc) return;

    if (!searchedDoc) {
      setDocumentNumber(cleanDoc);
    }

    if (typeof window !== "undefined") {
      try {
        const currentUrl = new URL(window.location.href);
        const currentDocParam =
          currentUrl.searchParams.get("documentNumber") ||
          currentUrl.searchParams.get("DocumentNumber");
        if (currentDocParam !== cleanDoc) {
          currentUrl.searchParams.set("documentNumber", cleanDoc);
          currentUrl.searchParams.delete("DocumentNumber");
          window.history.replaceState(null, "", currentUrl.toString());
        }
      } catch {
        // ignore
      }
    }
  }, [config?.documentNumber, searchedDoc]);

  // Instant redirect to Admin Panel if /admin or #admin is typed in URL bar, query, or hash
  useEffect(() => {
    const checkAdminRedirect = () => {
      if (typeof window === "undefined") return;
      const fullHref = (window.location.href || "").trim().toLowerCase();
      const hash = (window.location.hash || "").trim().toLowerCase();
      const pathname = (window.location.pathname || "").trim().toLowerCase();
      const search = (window.location.search || "").trim().toLowerCase();

      if (pathname === "/admin") return;

      const isAdminTarget =
        hash.includes("admin") ||
        pathname.includes("/admin") ||
        pathname.endsWith("/admin") ||
        search.includes("/admin") ||
        search.includes("=admin") ||
        search.includes("&admin") ||
        search.endsWith("admin") ||
        fullHref.includes("/admin") ||
        fullHref.endsWith("/admin") ||
        fullHref.endsWith("/admin/") ||
        fullHref.includes("#admin");

      if (isAdminTarget) {
        window.location.href = "/admin";
      }
    };

    checkAdminRedirect();
    window.addEventListener("hashchange", checkAdminRedirect);
    window.addEventListener("popstate", checkAdminRedirect);
    return () => {
      window.removeEventListener("hashchange", checkAdminRedirect);
      window.removeEventListener("popstate", checkAdminRedirect);
    };
  }, []);

  const handleLoaderDone = useCallback(() => {
    setInitialLoading(false);
  }, []);

  const handleSearch = (docOrOrderNo: string, subOrUnifiedNo: string, searchField: number) => {
    setSearchLoading(true);
    setSearchedDoc(docOrOrderNo);
    setDocumentNumber(docOrOrderNo);
    setSubscriptionNumber(subOrUnifiedNo);

    setTimeout(() => {
      setSearchLoading(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const handleRevalidate = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Download Action
  const handleDownload = () => {
    if (isDownloading) return;
    const btn = config?.downloadButton;

    if (btn?.fileUrl && btn.fileUrl.trim() !== "") {
      downloadFileWithAnimation(btn.fileUrl.trim(), btn.fileName || `document-${documentNumber}.pdf`);
      return;
    }

    // Default: print document
    window.print();
  };

  // Build document details dynamically from config (updated in real-time from Admin Panel / Firebase)
  const cleanSerial = sanitizeDocNumber(config?.serialNumber);
  const cleanDoc = sanitizeDocNumber(config?.documentNumber);
  const cleanReq = sanitizeDocNumber(config?.requestNumber);
  const cleanUnified = sanitizeDocNumber(config?.unifiedNumber);
  const cleanComm = sanitizeDocNumber(config?.commercialRegNo);
  const cleanFacility = config?.facilityName
    ? (config.facilitySubName ? `${config.facilityName} ${config.facilitySubName}` : config.facilityName)
    : "";

  const docNo =
    searchedDoc ||
    cleanDoc ||
    (queryDoc && queryDoc !== cleanReq && queryDoc !== "13255887" && queryDoc !== "205-178" ? queryDoc : undefined) ||
    documentNumber ||
    "205-178";

  const orderNo =
    initialParams.req ||
    cleanReq ||
    orderNumber ||
    "205-154";

  const subNo =
    querySub ||
    initialParams.sub ||
    cleanSerial ||
    cleanComm ||
    cleanUnified ||
    subscriptionNumber ||
    "205001150789";

  const is205Sample =
    (docNo === "205-178" && (subNo === "205001150709" || subNo === "205001150789")) ||
    (!queryDoc && !initialParams.doc && !cleanSerial && !cleanReq && !cleanDoc);

  const details: TujarDocumentDetails = {
    chamberName: config?.chamberName || "ينبع",
    serviceName: is205Sample && !config?.requestType
      ? "تصديق المطبوعات الرسمية"
      : (config?.requestType || "تصديق المطبوعات الرسمية"),
    documentNumber: docNo,
    orderNumber: orderNo,
    requestSubmitter: is205Sample && !config?.applicantName
      ? "محمدايوب"
      : (config?.applicantName || "محمدايوب"),
    entityName: is205Sample && !cleanFacility
      ? "شركة سيفيل إليكتريكال آند مينتينانس"
      : (cleanFacility || "شركة سيفيل إليكتريكال آند مينتينانس"),
    subscriptionNumber: subNo,
    unifiedNumber: is205Sample && !cleanUnified
      ? "7053747403"
      : (cleanUnified || subNo || "7053747403"),
    creationDateTime: is205Sample && !config?.creationDate
      ? "2026/10/04 - 11:35 AM"
      : config?.creationDate
      ? `${config.creationDate}${config.creationTime ? ` - ${config.creationTime}` : ""}`
      : "2026/10/04 - 11:35 AM",
    serviceValidUntil: config?.expiryDate || "2027/10/04",
    documentStatus: config?.requestStatus
      ? (config.requestStatus.includes("مقبول") ? "مقبول" : config.requestStatus)
      : "مقبول",
    isValid: true,
  };

  return (
    <div className="tujar-wrapper" suppressHydrationWarning dir="rtl">
      {/* 1. Initial Tujar Dual-Ring Loader */}
      {initialLoading && <TujarLoader onDone={handleLoaderDone} durationMs={1200} />}

      {/* 2. Global Header with Mobile Nav & Clean Branding */}
      <TujarHeader />

      {/* 3. Main Verification Body: Result Card on Right, Stepper on Left (Matches Screenshot) */}
      <main className="Document-Verify-layout">
        <div className="verification-grid">
          {/* Main Card on Right (Child 1 in RTL = Right Side) */}
          <div className="verification-main-card-col">
            {step === 2 ? (
              <TujarVerificationResultCard
                details={details}
                onDownload={handleDownload}
                onRevalidate={handleRevalidate}
                isDownloading={isDownloading}
              />
            ) : (
              <TujarSearchCard
                initialDocumentNumber={documentNumber}
                initialSubscriptionNumber={subscriptionNumber}
                onSearch={handleSearch}
                isLoading={searchLoading}
              />
            )}
          </div>

          {/* Stepper Card on Left (Child 2 in RTL = Left Side) */}
          <div className="verification-stepper-col">
            <TujarStepper currentStep={step} />
          </div>
        </div>
      </main>

      {/* 4. Full-Width Saudi City Skyline Illustration at Bottom of Page */}
      <div className="tujar-page-skyline-footer">
        <img
          src="/assets/imgs/auth-portal-bg.svg"
          alt="Saudi City Skyline"
          className="tujar-skyline-full-img"
        />
      </div>

      {/* 5. Official Tujar Footer (Matches User Screenshot) */}
      <TujarFooter />

      {/* 6. Floating Google reCAPTCHA Badge on Bottom-Right (Matches Screenshot) */}
      <div className="tujar-recaptcha-badge" title="محمي بواسطة reCAPTCHA">
        <div className="tujar-recaptcha-inner">
          <div className="tujar-recaptcha-logo">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z" fill="#fff" />
              <path d="M38 24c0-7.73-6.27-14-14-14-2.14 0-4.14.48-5.94 1.34L21.4 16.5c1.47-.64 3.09-1 4.8-1 6.35 0 11.5 5.15 11.5 11.5H38z" fill="#1A73E8" />
              <path d="M10 24c0 7.73 6.27 14 14 14 2.14 0 4.14-.48 5.94-1.34L26.6 31.5c-1.47.64-3.09 1-4.8 1-6.35 0-11.5-5.15-11.5-11.5H10z" fill="#4285F4" />
            </svg>
          </div>
          <div className="tujar-recaptcha-text">
            <span className="tujar-recaptcha-title">محمي بواسطة</span>
            <span className="tujar-recaptcha-brand">reCAPTCHA</span>
            <div className="tujar-recaptcha-links">
              <span>الخصوصية</span> - <span>البنود</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Floating Tujar Support / Chat Button on Bottom-Right (Matches Screenshot) */}
      <button
        type="button"
        className="tujar-floating-chat-btn"
        aria-label="الدعم والمساعدة"
        title="الدعم والمساعدة"
        onClick={() => {}}
      >
        <div className="tujar-floating-chat-halo" />
        <div className="tujar-floating-chat-inner">
          <TujarSupportChatIcon className="w-7 h-7 text-white" />
        </div>
      </button>

      {/* Download In-Progress Animation */}
      <DownloadAnimationOverlay
        active={downloadLoaderActive}
        buttonLoaderGifUrl={config?.buttonLoaderGifUrl}
      />
    </div>
  );
}
