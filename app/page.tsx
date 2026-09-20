"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalConfig } from "@/types/portal";
import { DEFAULT_PORTAL_CONFIG } from "@/constants/defaults";
import { usePortalConfig } from "@/hooks/usePortalConfig";
import { useFileDownload } from "@/hooks/useFileDownload";
import { LoaderScreen } from "@/components/portal/LoaderScreen";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { DocumentDetailsCard } from "@/components/portal/DocumentDetailsCard";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { DownloadAnimationOverlay } from "@/components/portal/DownloadAnimationOverlay";

// ─────────────────────────────────────────────────────────
//  VERIFICATION RESULTS PAGE
// ─────────────────────────────────────────────────────────
function ResultsPage({
  config,
  revealed,
  isDownloading = false,
  onDownload,
  onVerifyAgain,
  onBack,
}: {
  config: PortalConfig;
  revealed: boolean;
  isDownloading?: boolean;
  onDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVerifyAgain: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBack: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div
      suppressHydrationWarning
      dir="rtl"
      className="min-h-screen bg-white text-[#212529] relative selection:bg-blue-100"
      style={{
        fontFamily: "var(--font-cairo), 'Cairo', 'Segoe UI', Arial, sans-serif",
        opacity: revealed ? 1 : 0,
        visibility: revealed ? "visible" : "hidden",
        pointerEvents: revealed ? "auto" : "none",
      }}
    >
      <div
        style={{
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        <PublicHeader portalTitle={config.portalTitle} />
        <DocumentDetailsCard
          config={config}
          isDownloading={isDownloading}
          onDownload={onDownload}
          onVerifyAgain={onVerifyAgain}
          onBack={onBack}
        />
        <PublicFooter config={config} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN ROOT COMPONENT
// ─────────────────────────────────────────────────────────
export default function DocumentVerificationPage() {
  const router = useRouter();
  const { config } = usePortalConfig();
  const {
    isDownloading,
    downloadLoaderActive,
    downloadFileWithAnimation,
  } = useFileDownload();

  // Instant redirect to Admin Panel if /admin is typed at the end of the URL or hash
  useEffect(() => {
    const checkAdminRedirect = () => {
      if (typeof window === "undefined") return;
      const hash = (window.location.hash || "").trim().toLowerCase();
      const pathname = (window.location.pathname || "").trim().toLowerCase();
      if (
        hash.endsWith("/admin") ||
        hash.endsWith("/admin/") ||
        hash === "#admin" ||
        hash === "#/admin" ||
        pathname.endsWith("/admin") ||
        pathname.endsWith("/admin/")
      ) {
        window.location.href = "/admin";
      }
    };

    checkAdminRedirect();
    window.addEventListener("hashchange", checkAdminRedirect);
    return () => window.removeEventListener("hashchange", checkAdminRedirect);
  }, []);

  // FIRST SHOW THE LOADER: initialLoaderDone starts false
  const [initialLoaderDone, setInitialLoaderDone] = useState(false);
  const [buttonLoaderKey, setButtonLoaderKey] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleLoaderDone = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setInitialLoaderDone(true);
  }, []);

  // Helper to normalize URLs (adds https:// if protocol is missing)
  const normalizeUrl = (raw?: string): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "#") return null;
    if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Universal button action executor
  const executeButtonAction = (
    btn: {
      actionType?: string;
      url?: string;
      fileUrl?: string;
      fileName?: string;
      openInNewTab?: boolean;
    } | undefined,
    defaultFallback: () => void
  ) => {
    if (!btn) {
      defaultFallback();
      return;
    }

    // 1. If file attached (actionType === "file" OR fileUrl exists) -> DOWNLOAD FILE
    if (btn.fileUrl && btn.fileUrl.trim() !== "") {
      downloadFileWithAnimation(btn.fileUrl.trim(), btn.fileName || "document.pdf");
      return;
    }

    // 2. If URL configured (url exists and not "#") -> GO TO LINK
    const targetUrl = normalizeUrl(btn.url);
    if (targetUrl) {
      if (btn.openInNewTab) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = targetUrl;
      }
      return;
    }

    // 3. Default fallback
    defaultFallback();
  };

  const handleButtonLoaderDone = useCallback(() => {
    setButtonLoaderKey(null);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  // Action: Button 1 (العودة / Back)
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    const btn = config?.backButton || DEFAULT_PORTAL_CONFIG.backButton;
    // Direct download with animation if a file is attached
    if (btn?.fileUrl && btn.fileUrl.trim() !== "") {
      downloadFileWithAnimation(btn.fileUrl.trim(), btn.fileName || "document.pdf");
      return;
    }
    executeButtonAction(btn, () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push("/");
      }
    });
  };

  // Action: Button 2 (التحقق مرة آخرى / Verify Again)
  const handleVerifyAgainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    const btn = config?.verifyAgainButton || DEFAULT_PORTAL_CONFIG.verifyAgainButton;

    // Direct download with animation if a file is attached
    if (btn?.fileUrl && btn.fileUrl.trim() !== "") {
      downloadFileWithAnimation(btn.fileUrl.trim(), btn.fileName || "document.pdf");
      return;
    }

    const action = () => {
      executeButtonAction(btn, () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };

    if (btn?.showLoader) {
      setPendingAction(() => action);
      setButtonLoaderKey(Date.now());
    } else {
      action();
    }
  };

  // Action: Button 3 (تحميل / Download)
  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    const btn = config?.downloadButton || DEFAULT_PORTAL_CONFIG.downloadButton;

    // Direct download from Google Drive with active animation until download finishes
    if (btn?.fileUrl && btn.fileUrl.trim() !== "") {
      downloadFileWithAnimation(btn.fileUrl.trim(), btn.fileName || "document.pdf");
      return;
    }

    const action = () => {
      executeButtonAction(btn, () => {
        window.print();
      });
    };

    if (btn.showLoader) {
      setPendingAction(() => action);
      setButtonLoaderKey(Date.now());
    } else {
      action();
    }
  };

  return (
    <>
      {/* 1. Scrollable background canvas during initial loader: only the faint background picture scrolls */}
      {!initialLoaderDone && (
        <div
          className="min-h-[250vh] w-full relative select-none"
          style={{
            backgroundImage: "url('/full-background.png')",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
            backgroundSize: "1440px auto",
            backgroundColor: "#f9f8ff",
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. Results page - only revealed AFTER the initial loader finishes */}
      {initialLoaderDone && (
        <ResultsPage
          config={config}
          revealed={initialLoaderDone}
          isDownloading={isDownloading}
          onDownload={handleDownloadClick}
          onVerifyAgain={handleVerifyAgainClick}
          onBack={handleBackClick}
        />
      )}

      {/* 1. FIRST: Show loader for 10 seconds */}
      {!initialLoaderDone && (
        <LoaderScreen
          onDone={handleLoaderDone}
          durationMs={config.loaderDurationMs || 10000}
          gifUrl={config.loaderGifUrl || "/loader.gif"}
        />
      )}

      {/* 2. Button click loader animation */}
      {buttonLoaderKey !== null && (
        <LoaderScreen
          key={buttonLoaderKey}
          restartKey={buttonLoaderKey}
          gifUrl={config.buttonLoaderGifUrl || "/button-loader.gif"}
          onDone={handleButtonLoaderDone}
          durationMs={config.buttonLoaderDurationMs || 4000}
        />
      )}

      {/* 3. Google Drive Download In-Progress Animation (Active until file finishes downloading) */}
      <DownloadAnimationOverlay
        active={downloadLoaderActive}
        buttonLoaderGifUrl={config.buttonLoaderGifUrl}
      />
    </>
  );
}
