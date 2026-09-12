export interface ChamberInfo {
  name: string;
  enName: string;
  logoUrl?: string;
  themeColor?: string;
}

export const SAMPLE_CHAMBERS: string[] = [
  "الرياض",
  "جدة",
  "ينبع",
  "الشرقية",
  "مكة المكرمة",
  "المدينة المنورة",
  "أبها",
  "القصيم",
  "تبوك",
  "حائل",
  "نجران",
  "جازان",
];

export const PREDEFINED_CHAMBERS: ChamberInfo[] = [
  { name: "الرياض", enName: "Riyadh", themeColor: "#32c5cb" },
  { name: "جدة", enName: "Jeddah", themeColor: "#3b82f6" },
  { name: "ينبع", enName: "Yanbu", themeColor: "#059669" },
  { name: "الشرقية", enName: "Eastern Province", themeColor: "#6366f1" },
  { name: "مكة المكرمة", enName: "Makkah", themeColor: "#d97706" },
  { name: "المدينة المنورة", enName: "Madinah", themeColor: "#10b981" },
];
