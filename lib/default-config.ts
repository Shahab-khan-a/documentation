import { PortalConfig } from "./portal-types";

/**
 * Formats a Date in the portal's Gregorian MM/DD/YYYY- format (e.g. "11/10/2026-").
 * Uses browser local date on the client and Asia/Riyadh timezone on the server so
 * the default Creation Date updates automatically every day without UTC drift.
 */
export function getCurrentPortalDate(dateInput?: Date): string {
  const d = dateInput || new Date();
  if (typeof window !== "undefined") {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}-`;
  }
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const month = parts.find((p) => p.type === "month")?.value || String(d.getMonth() + 1).padStart(2, "0");
    const day = parts.find((p) => p.type === "day")?.value || String(d.getDate()).padStart(2, "0");
    const year = parts.find((p) => p.type === "year")?.value || String(d.getFullYear());
    return `${month}/${day}/${year}-`;
  } catch {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}-`;
  }
}

export const DEFAULT_PORTAL_CONFIG: PortalConfig = {
  portalTitle: "بوابة خدمات الغرفة",
  pageTitle: "التحقق من الوثائق",
  
  serialNumber: "7032840279",
  documentNumber: "205-178",
  chamberName: "ينبع",
  facilityName: "مؤسسة العنود سلمان شوعان",
  facilitySubName: "القحطاني للمقاولات العامة",
  unifiedNumber: "7032840279",
  requestNumber: "13255887",
  requestType: "تصديق المطبوعات الرسمية",
  applicantName: "العنود سلمان شوعان",
  creationDate: "11/10/2026-",
  creationTime: "8:12م",
  amount: "35 ريال",
  expiryDate: "09/06/2027-",
  expiryTime: "6:00م",
  commercialRegNo: "7032840279",
  requestStatus: "قبول",
  statusColor: "#32c5cb",

  // Custom dynamically added fields
  customFields: [],

  backButton: {
    label: "العودة",
    actionType: "link",
    url: "#",
    openInNewTab: false,
    showLoader: false,
  },
  verifyAgainButton: {
    label: "التحقق مرة آخرى",
    actionType: "animation",
    url: "#",
    openInNewTab: false,
    showLoader: true,
  },
  downloadButton: {
    label: "تحميل",
    actionType: "animation",
    url: "#",
    fileUrl: "",
    fileName: "",
    openInNewTab: false,
    showLoader: true,
  },

  devLabel: "تطوير وتشغيل",
  companyNameAr: "عالم النظم و البرامج",
  companyNameEn: "World of Systems & Software",
  supportPhone: "00966112641362",
  socialLinks: {
    skype: "#skype",
    instagram: "#instagram",
    youtube: "#youtube",
    twitter: "#twitter",
    facebook: "#facebook",
  },
  copyrightText: "جميع الحقوق محفوظة الغرفة التجارية بينبع © 2026",

  loaderGifUrl: "/loader.gif",
  buttonLoaderGifUrl: "/button-loader.gif",
  loaderDurationMs: 10000,
  buttonLoaderDurationMs: 4000,
  enableInitialLoader: true,
};

