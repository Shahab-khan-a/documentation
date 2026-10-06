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
import "@/app/tujar.css";

export function TujarVerificationView() {
  const searchParams = useSearchParams();
  const queryDoc = searchParams?.get("documentNumber") || "";
  const querySub = searchParams?.get("subscriptionNumber") || "";
  const { config } = usePortalConfig();
  const { isDownloading, downloadLoaderActive, downloadFileWithAnimation } = useFileDownload();

  // Extract initial parameters from query params or DocumentVerify URL hash/path
  const parseUrlParams = useCallback(() => {
    if (typeof window === "undefined") {
      return { doc: queryDoc || "", sub: querySub || "", req: "" };
    }
    const hash = window.location.hash || "";
    const pathname = window.location.pathname || "";
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
        req = after[0] || "";
        if (after[1]?.toLowerCase() === "mem") {
          s = after[2] || "";
        } else {
          s = after[1] || "";
        }
      } else if (parts.length > 0) {
        const nonReserved = parts.filter(
          (p) => !["sa", "admin", "api", "documentverify"].includes(p.toLowerCase())
        );
        if (nonReserved.length >= 1) s = nonReserved[0];
      }
    }

    return {
      doc: queryDoc || s || "",
      sub: querySub || s || "",
      req: req || "",
    };
  }, [queryDoc, querySub]);

  const initialParams = parseUrlParams();
  const [documentNumber, setDocumentNumber] = useState(initialParams.doc || "205-178");
  const [subscriptionNumber, setSubscriptionNumber] = useState(initialParams.sub || "205001150709");
  const [orderNumber, setOrderNumber] = useState(initialParams.req || "205-154");

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

  const handleLoaderDone = useCallback(() => {
    setInitialLoading(false);
  }, []);

  const handleSearch = (docOrOrderNo: string, subOrUnifiedNo: string, searchField: number) => {
    setSearchLoading(true);
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
  const isSampleQuery =
    (queryDoc === "205-178" && querySub === "205001150709") ||
    (!queryDoc && !initialParams.doc && !config?.serialNumber);

  const details: TujarDocumentDetails = {
    chamberName: config?.chamberName || "ينبع",
    serviceName: isSampleQuery
      ? "تصديق المطبوعات الرسمية"
      : (config?.requestType || "تصديق المطبوعات الرسمية"),
    documentNumber:
      queryDoc ||
      initialParams.doc ||
      config?.serialNumber ||
      documentNumber ||
      "205-178",
    orderNumber: isSampleQuery
      ? "205-154"
      : (initialParams.req || config?.requestNumber || orderNumber || "205-154"),
    requestSubmitter: isSampleQuery
      ? "محمدايوب"
      : (config?.applicantName || "محمدايوب"),
    entityName: isSampleQuery
      ? "شركة سيفيل إليكتريكال آند مينتينانس"
      : (config?.facilityName || "شركة سيفيل إليكتريكال آند مينتينانس"),
    subscriptionNumber:
      querySub ||
      initialParams.sub ||
      config?.commercialRegNo ||
      config?.serialNumber ||
      subscriptionNumber ||
      "205001150709",
    unifiedNumber: isSampleQuery
      ? "7053747403"
      : (config?.unifiedNumber || "7053747403"),
    creationDateTime: isSampleQuery
      ? "2026/10/04 - 11:35 AM"
      : config?.creationDate
      ? `${config.creationDate} - ${config.creationTime || "11:35 AM"}`
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

      {/* 5. Floating WhatsApp Button on Bottom-Left */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="tujar-floating-whatsapp-btn"
        aria-label="WhatsApp Support"
        title="تواصل عبر واتساب"
      >
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.003-.47-1.579-.653-2.618-2.28-2.697-2.385-.078-.105-.639-.851-.639-1.624 0-.773.405-1.154.55-1.309.144-.155.314-.194.419-.194.105 0 .209.002.301.006.098.005.228-.037.357.272.131.314.446 1.087.485 1.166.039.078.065.17.013.274-.052.105-.078.17-.157.261-.078.092-.165.204-.236.274-.078.079-.16.165-.069.322.091.157.406.67 871 1.085.599.534 1.104.7 1.261.778.157.079.249.066.341-.039.092-.105.393-.458.498-.615.105-.157.209-.131.353-.078.144.052.916.432 1.073.511.157.078.262.118.301.183.039.066.039.38-.105.785z"/>
          <path d="M12 2C6.486 2 2 6.486 2 12c0 1.846.505 3.578 1.382 5.064L2.057 22l5.053-1.326C8.547 21.523 10.224 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.61 0-3.116-.499-4.372-1.355l-.313-.213-3.003.788.801-2.928-.233-.371C3.963 14.62 3.5 13.344 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
        </svg>
      </a>

      {/* 6. Floating Recaptcha / Security Badge on Bottom-Right */}
      <div className="tujar-floating-security-badge" title="محمي ومتحقق منه">
        <svg className="w-5 h-5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
      </div>

      {/* Download In-Progress Animation */}
      <DownloadAnimationOverlay
        active={downloadLoaderActive}
        buttonLoaderGifUrl={config?.buttonLoaderGifUrl}
      />
    </div>
  );
}
