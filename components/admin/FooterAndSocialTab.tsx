"use client";

import React from "react";
import { PortalConfig } from "@/types/portal";
import { TranslationStrings } from "@/constants/translations";
import { IconSupport, IconCheck } from "@/components/icons/AdminIcons";

export interface FooterAndSocialTabProps {
  config: PortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortalConfig>>;
  initialConfig?: PortalConfig;
  t: TranslationStrings;
  saving: boolean;
  onSave: () => void;
  lang: string;
}

export function FooterAndSocialTab({
  config,
  setConfig,
  initialConfig,
  t,
  saving,
  onSave,
  lang,
}: FooterAndSocialTabProps) {
  const isOrgDirty = React.useMemo(() => {
    if (!initialConfig) return false;
    return (
      (config.supportPhone ?? "") !== (initialConfig.supportPhone ?? "") ||
      (config.devLabel ?? "") !== (initialConfig.devLabel ?? "") ||
      (config.companyNameAr ?? "") !== (initialConfig.companyNameAr ?? "") ||
      (config.companyNameEn ?? "") !== (initialConfig.companyNameEn ?? "") ||
      (config.copyrightText ?? "") !== (initialConfig.copyrightText ?? "")
    );
  }, [
    config.supportPhone,
    config.devLabel,
    config.companyNameAr,
    config.companyNameEn,
    config.copyrightText,
    initialConfig,
  ]);

  const handleRevertOrg = () => {
    if (!initialConfig) return;
    setConfig((prev) => ({
      ...prev,
      supportPhone: initialConfig.supportPhone,
      devLabel: initialConfig.devLabel,
      companyNameAr: initialConfig.companyNameAr,
      companyNameEn: initialConfig.companyNameEn,
      copyrightText: initialConfig.copyrightText,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <IconSupport className="w-5 h-5 text-amber-600" />
            <span>{t.footer_title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.footer_desc}</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <IconCheck className="w-4 h-4" />
          <span>{saving ? t.saving_btn : t.save_btn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Official Corporate & Support Info */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-black text-slate-800">
                {lang === "en"
                  ? "Support & Operating Organization"
                  : lang === "ur"
                  ? "ڈعم اور آپریٹنگ ادارہ"
                  : "بيانات الدعم والتشغيل"}
              </h3>
            </div>
            {isOrgDirty && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse active:scale-95"
                title={lang === "en" ? "Save changes now" : lang === "ur" ? "ابھی محفوظ کریں" : "حفظ التعديلات الآن"}
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.saving_btn}</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Save" : lang === "ur" ? "محفوظ کریں" : "حفظ"}</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.support_phone}
            </label>
            <input
              type="text"
              dir="ltr"
              value={config.supportPhone}
              onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.dev_label}
            </label>
            <input
              type="text"
              value={config.devLabel}
              onChange={(e) => setConfig({ ...config, devLabel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.company_ar}
            </label>
            <input
              type="text"
              value={config.companyNameAr}
              onChange={(e) => setConfig({ ...config, companyNameAr: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.company_en}
            </label>
            <input
              type="text"
              dir="ltr"
              value={config.companyNameEn}
              onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
          </div>

          {/* Copyright notice text below footer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {lang === "en"
                ? "Copyright Text (Under Footer)"
                : lang === "ur"
                ? "کاپی رائٹ تحریر (فوٹر کے نیچے)"
                : "حقوق النشر (أسفل الفوتر)"}
            </label>
            <input
              type="text"
              dir="rtl"
              value={config.copyrightText || ""}
              placeholder="جميع الحقوق محفوظة الغرفة التجارية بينبع © 2026"
              onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {lang === "en"
                ? "Displayed under the main blue footer card on the public page."
                : lang === "ur"
                ? "مین پیج پر نیلے فوٹر کارڈ کے بالکل نیچے ظاہر ہوتی ہے۔"
                : "يظهر أسفل كارد الفوتر الأزرق في الصفحة الرئيسية."}
            </span>
          </div>

          {/* Direct Save Action Bar for Support & Operating Organization */}
          <div
            className={`transition-all duration-300 rounded-2xl p-4 border mt-4 ${
              isOrgDirty
                ? "bg-gradient-to-r from-amber-50/70 via-emerald-50/70 to-teal-50/70 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
                : "bg-slate-50/80 border-slate-200/80"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isOrgDirty ? "bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" : "bg-slate-300"
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {isOrgDirty
                      ? lang === "en"
                        ? "Unsaved changes in Organization & Copyright"
                        : lang === "ur"
                        ? "آرگنائزیشن اور کاپی رائٹ میں غیر محفوظ تبدیلیاں موجود ہیں"
                        : "يوجد تعديلات جديدة في بيانات الدعم وحقوق النشر"
                      : lang === "en"
                      ? "Organization & Copyright settings are synchronized"
                      : lang === "ur"
                      ? "آرگنائزیشن اور کاپی رائٹ کی تمام تفصیلات محفوظ ہیں"
                      : "بيانات الدعم وحقوق النشر محفوظة ومتطابقة"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isOrgDirty
                      ? lang === "en"
                        ? "Click Save to apply immediately to the main screen."
                        : lang === "ur"
                        ? "مین اسکرین پر فوری لاگو کرنے کے لیے محفوظ کریں۔"
                        : "اضغط حفظ لتطبيق التعديل فوراً على الصفحة الرئيسية."
                      : lang === "en"
                      ? "Edit any input above to update live values."
                      : lang === "ur"
                      ? "کسی بھی انپٹ میں تبدیلی کریں اور پھر محفوظ کریں۔"
                      : "عدّل أي حقل أعلاه ثم اضغط حفظ لتطبيقه."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                {isOrgDirty && (
                  <button
                    type="button"
                    onClick={handleRevertOrg}
                    disabled={saving}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-200/70 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === "en" ? "Undo" : lang === "ur" ? "تراجع" : "تراجع"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving || !isOrgDirty}
                  className={`px-5 py-2 rounded-xl text-xs font-black text-white transition-all flex items-center justify-center gap-1.5 ${
                    isOrgDirty
                      ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.saving_btn}</span>
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>
                        {lang === "en"
                          ? "Save Changes"
                          : lang === "ur"
                          ? "تبدیلیاں محفوظ کریں"
                          : "حفظ التعديلات"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Social Media Platform URLs */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h3 className="text-sm font-black text-slate-800">{t.social_title}</h3>
          </div>

          <div className="space-y-3.5">
            {Object.entries({
              skype: { label: "Skype", icon: "💬" },
              instagram: { label: "Instagram", icon: "📸" },
              youtube: { label: "YouTube", icon: "▶️" },
              twitter: { label: "Twitter / X", icon: "𝕏" },
              facebook: { label: "Facebook", icon: "📘" },
            }).map(([key, item]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  <span>{item.label} URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={(config.socialLinks as Record<string, string>)[key] || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder={`https://${key}.com/...`}
                  />
                  {(config.socialLinks as Record<string, string>)[key] && (
                    <a
                      href={(config.socialLinks as Record<string, string>)[key]}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0"
                      title="Open Link"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
