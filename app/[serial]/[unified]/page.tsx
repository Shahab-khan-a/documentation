"use client";

import DocumentVerificationPage from "../../page";

/**
 * Dynamic route: /[serial]/[unified]
 * e.g., http://localhost:3000/12345/7032840279
 * Renders the official Document Verification Page with the URL preserved.
 */
export default function DynamicSerialUnifiedVerificationPage() {
  return <DocumentVerificationPage />;
}
