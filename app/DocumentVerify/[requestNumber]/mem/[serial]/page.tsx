"use client";

import DocumentVerificationPage from "@/app/page";

/**
 * Dynamic route: /DocumentVerify/[requestNumber]/mem/[serial]
 * e.g., http://localhost:3000/DocumentVerify/13255887/mem/7032840279
 */
export default function DocumentVerifySerialPage() {
  return <DocumentVerificationPage />;
}
