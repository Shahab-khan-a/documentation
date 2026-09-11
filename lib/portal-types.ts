export interface ActionButtonConfig {
  label: string;
  actionType: "link" | "file" | "animation";
  url: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  openInNewTab?: boolean;
  showLoader?: boolean;
}

export interface SocialLinksConfig {
  skype?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
}

export interface CustomDocumentField {
  id: string;
  label: string; // e.g. "المدينة"
  value: string; // e.g. "ينبع الصناعية"
}

export interface PortalConfig {
  portalTitle: string;
  pageTitle: string;
  
  // Document standard fields
  chamberName: string;
  facilityName: string;
  facilitySubName?: string;
  unifiedNumber: string;
  requestNumber: string;
  requestType: string;
  applicantName: string;
  creationDate: string;
  creationTime: string;
  amount: string;
  expiryDate: string;
  expiryTime: string;
  commercialRegNo: string;
  requestStatus: string;
  statusColor?: string;

  // Custom dynamically added fields
  customFields?: CustomDocumentField[];

  // The 3 main buttons
  backButton: ActionButtonConfig;
  verifyAgainButton: ActionButtonConfig;
  downloadButton: ActionButtonConfig;

  // Footer & branding
  devLabel: string;
  companyNameAr: string;
  companyNameEn: string;
  supportPhone: string;
  socialLinks: SocialLinksConfig;

  // Loaders
  loaderGifUrl: string;
  buttonLoaderGifUrl: string;
  loaderDurationMs: number;
  buttonLoaderDurationMs: number;
  enableInitialLoader: boolean;
}
