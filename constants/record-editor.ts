/**
 * Static Data & Constants for Record Modal & Creation
 */

export interface ColorPreset {
  color: string;
  label: string;
  nameEn: string;
}

export const CHAMBER_QUICK_OPTIONS = [
  "ينبع",
  "الرياض",
  "جدة",
  "الشرقية",
  "مكة المكرمة",
  "المدينة المنورة",
] as const;

export const STATUS_COLOR_PRESETS: ColorPreset[] = [
  { color: "#32c5cb", label: "ينبع", nameEn: "Yanbu Cyan" },
  { color: "#10b981", label: "أخضر", nameEn: "Emerald Active" },
  { color: "#3b82f6", label: "أزرق", nameEn: "Blue Process" },
  { color: "#f59e0b", label: "برتقالي", nameEn: "Amber Pending" },
  { color: "#8b5cf6", label: "بنفسجي", nameEn: "Purple Verified" },
];

export const DEFAULT_RECORD_REQUEST_NUMBER = "13255887";

export const DEFAULT_STATUS_COLOR = "#32c5cb";
