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
  const [subscriptionNumber, setSubscriptionNumber] = useState(initialParams.sub || "205001150789");
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
    (queryDoc === "205-178" && querySub === "205001150789") ||
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
      "205001150789",
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
    <div className="tujar-wrapper" suppressHydrationWarning>
      {/* 1. Initial Tujar Dual-Ring Loader */}
      {initialLoading && <TujarLoader onDone={handleLoaderDone} durationMs={1200} />}

      {/* 2. Global Header with Mobile Nav & Full Drawer */}
      <TujarHeader />

      {/* 3. Green Hero Breadcrumb (Desktop Only) */}
      <TujarBreadcrumb />

      {/* 4. Main Verification Body */}
      <main className="Document-Verify-layout">
        <div className="verification-grid">
          {/* Main Card (Verification Result or Search Form) */}
          <div>
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

          {/* Stepper on Right (or below card on mobile) */}
          <div>
            <TujarStepper currentStep={step} />
          </div>
        </div>
      </main>

      {/* 5. Global Footer */}
      <TujarFooter />

      {/* Download In-Progress Animation */}
      <DownloadAnimationOverlay
        active={downloadLoaderActive}
        buttonLoaderGifUrl={config?.buttonLoaderGifUrl}
      />
    </div>
  );
}
