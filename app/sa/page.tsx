"use client";

import DocumentVerificationView from "@/components/portal/DocumentVerificationView";

/**
 * Saudi Chamber Verification Route with Hash URL support
 * e.g., https://www.eservices-ynbcci.org/sa/#/DocumentVerify/13585599/mem/205001150723
 * or    https://eservices-ynbcci-org-sa.com/sa/#/DocumentVerify/13585599/mem/205001150723
 */
export default function SARootPage() {
  return <DocumentVerificationView />;
}
