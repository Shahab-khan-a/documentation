import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig } from "@/types/portal";

export { DEFAULT_PORTAL_CONFIG };
export const DEFAULT_FALLBACK_GIF = "/loader.gif";
export const DEFAULT_BUTTON_LOADER_GIF = "/button-loader.gif";
export const DEFAULT_ONLINE_FALLBACK_GIF =
  "https://lottie.host/73358927-6e0d-453a-9a9f-e0607ae61ad8/9sISJeaK1n.gif";

/**
 * Bulletproof normalizer ensuring that all nested properties, action buttons,
 * social links, and fields are guaranteed to exist, preventing any runtime render crashes.
 */
export function normalizePortalConfig(raw?: Partial<PortalConfig> | null): PortalConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_PORTAL_CONFIG };
  }

  return {
    ...DEFAULT_PORTAL_CONFIG,
    ...raw,
    portalTitle:
      raw.portalTitle &&
      !/^[A-Za-z0-9\s._\-:/]+$/.test(raw.portalTitle.trim()) &&
      !raw.portalTitle.toLowerCase().includes("eservices") &&
      !raw.portalTitle.toLowerCase().includes("ynbcci")
        ? raw.portalTitle
        : DEFAULT_PORTAL_CONFIG.portalTitle,
    pageTitle: raw.pageTitle || DEFAULT_PORTAL_CONFIG.pageTitle,
    chamberName: raw.chamberName || DEFAULT_PORTAL_CONFIG.chamberName,
    facilityName: raw.facilityName || DEFAULT_PORTAL_CONFIG.facilityName,
    facilitySubName:
      raw.facilitySubName !== undefined
        ? raw.facilitySubName
        : DEFAULT_PORTAL_CONFIG.facilitySubName,
    serialNumber: raw.serialNumber || DEFAULT_PORTAL_CONFIG.serialNumber,
    unifiedNumber: raw.unifiedNumber || DEFAULT_PORTAL_CONFIG.unifiedNumber,
    requestNumber: raw.requestNumber || DEFAULT_PORTAL_CONFIG.requestNumber,
    requestType: raw.requestType || DEFAULT_PORTAL_CONFIG.requestType,
    applicantName: raw.applicantName || DEFAULT_PORTAL_CONFIG.applicantName,
    creationDate: raw.creationDate || DEFAULT_PORTAL_CONFIG.creationDate,
    creationTime: raw.creationTime || DEFAULT_PORTAL_CONFIG.creationTime,
    amount: raw.amount || DEFAULT_PORTAL_CONFIG.amount,
    expiryDate: raw.expiryDate || DEFAULT_PORTAL_CONFIG.expiryDate,
    expiryTime: raw.expiryTime || DEFAULT_PORTAL_CONFIG.expiryTime,
    commercialRegNo: raw.commercialRegNo || DEFAULT_PORTAL_CONFIG.commercialRegNo,
    requestStatus: raw.requestStatus || DEFAULT_PORTAL_CONFIG.requestStatus,
    statusColor: raw.statusColor || DEFAULT_PORTAL_CONFIG.statusColor,
    devLabel: raw.devLabel || DEFAULT_PORTAL_CONFIG.devLabel,
    companyNameAr: raw.companyNameAr || DEFAULT_PORTAL_CONFIG.companyNameAr,
    companyNameEn: raw.companyNameEn || DEFAULT_PORTAL_CONFIG.companyNameEn,
    supportPhone: raw.supportPhone || DEFAULT_PORTAL_CONFIG.supportPhone,
    copyrightText:
      raw.copyrightText !== undefined
        ? raw.copyrightText
        : (DEFAULT_PORTAL_CONFIG.copyrightText || "جميع الحقوق محفوظة الغرفة التجارية بينبع © 2026"),
    loaderGifUrl: raw.loaderGifUrl || DEFAULT_PORTAL_CONFIG.loaderGifUrl,
    buttonLoaderGifUrl: raw.buttonLoaderGifUrl || DEFAULT_PORTAL_CONFIG.buttonLoaderGifUrl,
    loaderDurationMs:
      typeof raw.loaderDurationMs === "number"
        ? raw.loaderDurationMs
        : DEFAULT_PORTAL_CONFIG.loaderDurationMs,
    buttonLoaderDurationMs:
      typeof raw.buttonLoaderDurationMs === "number"
        ? raw.buttonLoaderDurationMs
        : DEFAULT_PORTAL_CONFIG.buttonLoaderDurationMs,
    enableInitialLoader:
      raw.enableInitialLoader !== undefined ? Boolean(raw.enableInitialLoader) : true,
    customFields: Array.isArray(raw.customFields)
      ? raw.customFields.filter((f) => f && typeof f === "object" && typeof f.label === "string")
      : [],
    backButton: {
      ...DEFAULT_PORTAL_CONFIG.backButton,
      ...(raw.backButton && typeof raw.backButton === "object" ? raw.backButton : {}),
      label: raw.backButton?.label || DEFAULT_PORTAL_CONFIG.backButton.label,
      actionType: raw.backButton?.actionType || DEFAULT_PORTAL_CONFIG.backButton.actionType,
      url: raw.backButton?.url || DEFAULT_PORTAL_CONFIG.backButton.url,
      fileUrl: raw.backButton?.fileUrl || "",
      fileName: raw.backButton?.fileName || "",
      openInNewTab: Boolean(raw.backButton?.openInNewTab),
      showLoader: Boolean(raw.backButton?.showLoader),
    },
    verifyAgainButton: {
      ...DEFAULT_PORTAL_CONFIG.verifyAgainButton,
      ...(raw.verifyAgainButton && typeof raw.verifyAgainButton === "object"
        ? raw.verifyAgainButton
        : {}),
      label: raw.verifyAgainButton?.label || DEFAULT_PORTAL_CONFIG.verifyAgainButton.label,
      actionType:
        raw.verifyAgainButton?.actionType || DEFAULT_PORTAL_CONFIG.verifyAgainButton.actionType,
      url: raw.verifyAgainButton?.url || DEFAULT_PORTAL_CONFIG.verifyAgainButton.url,
      fileUrl: raw.verifyAgainButton?.fileUrl || "",
      fileName: raw.verifyAgainButton?.fileName || "",
      openInNewTab: Boolean(raw.verifyAgainButton?.openInNewTab),
      showLoader: Boolean(raw.verifyAgainButton?.showLoader),
    },
    downloadButton: {
      ...DEFAULT_PORTAL_CONFIG.downloadButton,
      ...(raw.downloadButton && typeof raw.downloadButton === "object"
        ? raw.downloadButton
        : {}),
      label: raw.downloadButton?.label || DEFAULT_PORTAL_CONFIG.downloadButton.label,
      actionType:
        raw.downloadButton?.actionType || DEFAULT_PORTAL_CONFIG.downloadButton.actionType,
      url: raw.downloadButton?.url || DEFAULT_PORTAL_CONFIG.downloadButton.url,
      fileUrl: raw.downloadButton?.fileUrl || "",
      fileName: raw.downloadButton?.fileName || "",
      openInNewTab: Boolean(raw.downloadButton?.openInNewTab),
      showLoader: Boolean(raw.downloadButton?.showLoader),
    },
    socialLinks: {
      ...DEFAULT_PORTAL_CONFIG.socialLinks,
      ...(raw.socialLinks && typeof raw.socialLinks === "object" ? raw.socialLinks : {}),
    },
  };
}
