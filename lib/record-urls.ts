/**
 * Multi-Domain URL Generator for Portal Records
 *
 * Configured Domains:
 * - .ORG Domain: https://www.eservices-ynbcci.org
 * - .COM Domain: https://eservices-ynbcci-org-sa.com
 * - .ORG (Tujar FSC) Domain: https://www.tujar-fsc.org
 */

import { sanitizeDocNumber } from "@/constants/defaults";

export const DEFAULT_ORG_DOMAIN = "https://www.eservices-ynbcci.org";
export const DEFAULT_COM_DOMAIN = "https://eservices-ynbcci-org-sa.com";
export const DEFAULT_TUJAR_FSC_DOMAIN = "https://www.tujar-fsc.org";

export interface DualDomainUrls {
  orgUrl: string;
  comUrl: string;
  dotUrl: string;
  tujarUrl: string;
  path: string;
}

/**
 * Computes the dedicated TUJAR-FSC path for any Portal Record:
 * /document-verification?documentNumber=...&&subscriptionNumber=...
 */
export function getRecordTujarPath(record: {
  documentNumber?: string | null;
  serialNumber?: string | null;
  id?: string | null;
}): string {
  const cleanDoc = sanitizeDocNumber(record.documentNumber) || "205-178";
  const cleanSerial = sanitizeDocNumber(record.serialNumber) || "206322599666";
  const isCloned = Boolean(record.id && record.id.startsWith("rec_"));
  const cloneParam = isCloned ? `&&id=${encodeURIComponent(record.id!)}` : "";
  return `/document-verification?documentNumber=${encodeURIComponent(cleanDoc)}&&subscriptionNumber=${encodeURIComponent(cleanSerial)}${cloneParam}`;
}

/**
 * Computes .org, .com, /., and tujar-fsc.org URLs based on the given path.
 * - .ORG URL:       https://www.eservices-ynbcci.org/...
 * - .COM URL:       https://eservices-ynbcci-org-sa.com/...
 * - /. URL:         https://eservices-ynbcci-org-sa.com/.../.
 * - TUJAR-FSC URL:  https://www.tujar-fsc.org/...
 */
export function getDualDomainUrls(
  path: string,
  options?: {
    tujarPath?: string;
  }
): DualDomainUrls {
  const orgBase = DEFAULT_ORG_DOMAIN;
  const comBase = DEFAULT_COM_DOMAIN;
  const tujarBase = DEFAULT_TUJAR_FSC_DOMAIN;

  // Dot path: identical to path, but ends with "/."
  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const dotPath = `${cleanPath}/.`;

  const tujarFinalPath = options?.tujarPath || path;

  return {
    orgUrl: `${orgBase}${path}`,
    comUrl: `${comBase}${path}`,
    dotUrl: `${comBase}${dotPath}`,
    tujarUrl: `${tujarBase}${tujarFinalPath}`,
    path,
  };
}

/**
 * Rock-solid clipboard copy function with fallback support for all browsers and devices.
 * 1. Tries modern navigator.clipboard.writeText.
 * 2. If blocked or unavailable, falls back to temporary textarea with document.execCommand('copy').
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || typeof window === "undefined") return false;

  // 1. Try modern navigator.clipboard
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }

  // 2. Reliable textarea fallback for older browsers, iframes, or non-HTTPS contexts
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch {
    // ignore
  }

  return false;
}
