"use client";

import React, { useState, useEffect } from "react";
import DocumentVerificationView from "@/components/portal/DocumentVerificationView";
import ModernEnglishPortal from "@/components/portal/ModernEnglishPortal";

export default function RootPage() {
  const [isVerificationMode, setIsVerificationMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const href = (window.location.href || "").toLowerCase();
    const pathname = (window.location.pathname || "").toLowerCase();
    const search = (window.location.search || "").toLowerCase();
    const hash = (window.location.hash || "").toLowerCase();

    return Boolean(
      search.includes("id=") ||
      search.includes("serial=") ||
      search.includes("subscriptionnumber=") ||
      search.includes("documentnumber=") ||
      search.includes("req=") ||
      search.includes("ordernumber=") ||
      search.includes("unified=") ||
      hash.includes("documentverify") ||
      hash.includes("/mem/") ||
      hash.includes("tujar") ||
      pathname.includes("document-verification") ||
      pathname.includes("/.") ||
      hash.includes("/.")
    );
  });

  useEffect(() => {
    const evaluateUrl = () => {
      if (typeof window === "undefined") return;

      const fullHref = (window.location.href || "").trim().toLowerCase();
      const hash = (window.location.hash || "").trim().toLowerCase();
      const pathname = (window.location.pathname || "").trim().toLowerCase();
      const search = (window.location.search || "").trim().toLowerCase();

      // 1. Instant redirect to Admin Panel if /admin is in URL
      if (
        pathname === "/admin" ||
        pathname.includes("/admin") ||
        pathname.endsWith("/admin") ||
        hash.includes("admin") ||
        search.includes("/admin") ||
        search.includes("=admin") ||
        search.includes("&admin") ||
        search.endsWith("admin") ||
        fullHref.includes("/admin") ||
        fullHref.endsWith("/admin") ||
        fullHref.endsWith("/admin/") ||
        fullHref.includes("#admin")
      ) {
        window.location.href = "/admin";
        return;
      }

      // 2. Check if this is a shared verification link with parameters or hash
      const hasVerification = Boolean(
        search.includes("id=") ||
        search.includes("serial=") ||
        search.includes("subscriptionnumber=") ||
        search.includes("documentnumber=") ||
        search.includes("req=") ||
        search.includes("ordernumber=") ||
        search.includes("unified=") ||
        hash.includes("documentverify") ||
        hash.includes("/mem/") ||
        hash.includes("tujar") ||
        pathname.includes("document-verification") ||
        pathname.includes("/.") ||
        hash.includes("/.")
      );

      setIsVerificationMode(hasVerification);
    };

    evaluateUrl();
    window.addEventListener("hashchange", evaluateUrl);
    window.addEventListener("popstate", evaluateUrl);
    return () => {
      window.removeEventListener("hashchange", evaluateUrl);
      window.removeEventListener("popstate", evaluateUrl);
    };
  }, []);

  // If URL has verification parameters or hash -> Render the full original Verification View with loaders and animations
  if (isVerificationMode) {
    return <DocumentVerificationView />;
  }

  // Otherwise, render the brand new modern English Portal UI
  return <ModernEnglishPortal />;
}

// Re-export original DocumentVerificationView as DocumentVerificationPage for backward compatibility
export { DocumentVerificationView as DocumentVerificationPage };
