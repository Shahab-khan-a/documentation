"use client";

import DocumentVerificationView from "@/components/portal/DocumentVerificationView";

/**
 * Dynamic route: /DocumentVerify/[requestNumber]/mem/[serial]
 * e.g., http://localhost:3000/DocumentVerify/13255887/mem/7032840279
 */
export default function DocumentVerifySerialPage() {
  return <DocumentVerificationView />;
}
