"use client";

import DocumentVerificationView from "@/components/portal/DocumentVerificationView";

/**
 * Dynamic route: /DocumentVerify/[requestNumber]/mem/[serial]/[unified]
 * e.g., http://localhost:3000/DocumentVerify/13255887/mem/7032840279/7032840279
 * Official Chamber of Commerce document verification URL.
 */
export default function DocumentVerifyFullPage() {
  return <DocumentVerificationView />;
}
