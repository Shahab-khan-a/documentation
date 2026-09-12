import { AdminLanguage } from "@/constants/translations";

export type AdminTab = "buttons" | "document" | "preview" | "footer" | "settings";

export interface DrawerTabItem {
  id: AdminTab;
  titleKey: "tab_buttons" | "tab_document" | "tab_preview" | "tab_footer" | "tab_settings";
  desc: Record<AdminLanguage, string>;
  icon: string;
  badge?: string;
}

export const ADMIN_DRAWER_TABS: DrawerTabItem[] = [
  {
    id: "buttons",
    titleKey: "tab_buttons",
    desc: {
      ar: "ربط الأزرار بالملفات والسحابة والتحميل الفوري",
      en: "Link buttons to files, Drive cloud & downloads",
      ur: "بٹنوں کو فائلوں، کلاؤڈ اور ڈاؤن لوڈ سے منسلک کریں",
    },
    icon: "🔘",
    badge: "Cloud Drive",
  },
  {
    id: "document",
    titleKey: "tab_document",
    desc: {
      ar: "تعديل بيانات الشهادة، الأرقام والتواريخ",
      en: "Edit certificate data, numbers & dates",
      ur: "سرٹیفکیٹ ڈیٹا، نمبرز اور تاریخیں تبدیل کریں",
    },
    icon: "📄",
    badge: "Form & Data",
  },
  {
    id: "preview",
    titleKey: "tab_preview",
    desc: {
      ar: "معاينة حية متجاوبة للجوال والكمبيوتر",
      en: "Live responsive mobile & desktop preview",
      ur: "موبائل اور ڈیسک ٹاپ کا لائیو جائزہ",
    },
    icon: "👁️",
  },
  {
    id: "footer",
    titleKey: "tab_footer",
    desc: {
      ar: "بيانات الدعم، اسم الشركة وروابط التواصل",
      en: "Support phone, company & social media",
      ur: "سپورٹ فون، کمپنی کا نام اور سوشل میڈیا لنکس",
    },
    icon: "🌐",
  },
  {
    id: "settings",
    titleKey: "tab_settings",
    desc: {
      ar: "توقيت اللودر وعناوين الصفحة والمؤثرات",
      en: "Loader timers, page titles & animations",
      ur: "لوڈر کا وقت، صفحہ کے عنوانات اور اینیمیشنز",
    },
    icon: "⚙️",
  },
];
