"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalConfig } from "@/types/portal";
import { AdminLanguage, TranslationStrings } from "@/constants/translations";
import { ADMIN_DRAWER_TABS } from "@/constants/navigation";
import { IconCheck, IconPreview } from "@/components/icons/AdminIcons";

export interface AdminSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  lang: AdminLanguage;
  isRtl: boolean;
  config: PortalConfig;
  activeTab: "buttons" | "document" | "preview" | "footer" | "settings";
  setActiveTab: (tab: "buttons" | "document" | "preview" | "footer" | "settings") => void;
  onLanguageChange: (lang: AdminLanguage) => void;
  onSave: () => void;
  saving: boolean;
  hasUnsavedChanges: boolean;
  onReset: () => void;
  onQuickPreview: () => void;
  publicLink: string;
  t: TranslationStrings;
}

export function AdminSidebarDrawer({
  open,
  onClose,
  lang,
  isRtl,
  config,
  activeTab,
  setActiveTab,
  onLanguageChange,
  onSave,
  saving,
  hasUnsavedChanges,
  onReset,
  onQuickPreview,
  publicLink,
  t,
}: AdminSidebarDrawerProps) {
  const [drawerSearch, setDrawerSearch] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity cursor-pointer drawer-backdrop-anim"
        onClick={() => {
          onClose();
          setDrawerSearch("");
        }}
      />

      {/* Drawer Panel */}
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`fixed inset-y-0 ${
          isRtl ? "right-0 drawer-panel-rtl border-l" : "left-0 drawer-panel-ltr border-r"
        } w-full max-w-[400px] sm:max-w-[450px] bg-white shadow-2xl flex flex-col z-[100000] border-slate-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header with Gradient & Ambient Background */}
        <div className="relative p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shrink-0 shadow-lg overflow-hidden">
          {/* Decorative radial orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/30 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/30 shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                    {lang === "en"
                      ? "Control Panel Menu"
                      : lang === "ur"
                      ? "کنٹرول پینل مینیو"
                      : "قائمة لوحة التحكم"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/30 border border-blue-400/40 text-blue-200 uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 font-medium mt-0.5">
                  {lang === "en"
                    ? "Quick access & instant screen navigation"
                    : lang === "ur"
                    ? "تمام ترتیبات اور اسکرینز تک فوری رسائی"
                    : "انتقال فوري وتعديل مباشر لجميع الأقسام"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                setDrawerSearch("");
              }}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer hover:rotate-90"
              title={lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
            >
              ✕
            </button>
          </div>

          {/* Mini Status Card inside header */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100/90 font-medium">
            <div className="flex items-center gap-2 truncate max-w-[240px]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                style={{ backgroundColor: config.statusColor || "#32c5cb" }}
              />
              <span className="truncate font-bold text-white">{config.facilityName}</span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/10 font-bold shrink-0">
              #{config.requestNumber}
            </span>
          </div>
        </div>

        {/* Interactive Search Bar inside Drawer */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <div className="relative">
            <span className="absolute inset-y-0 start-3 flex items-center text-slate-400 pointer-events-none text-xs">
              🔍
            </span>
            <input
              type="text"
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              placeholder={
                lang === "en"
                  ? "Search section or field..."
                  : lang === "ur"
                  ? "سیکشن یا فیلڈ تلاش کریں..."
                  : "ابحث عن أي قسم أو بيان..."
              }
              className="w-full ps-8 pe-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
            />
            {drawerSearch && (
              <button
                type="button"
                onClick={() => setDrawerSearch("")}
                className="absolute inset-y-0 end-2.5 flex items-center text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-slate-50/30">
          {/* Category 1: Main Sections */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-2">
              {lang === "en" ? "Main Sections" : lang === "ur" ? "اہم اسکرینز" : "الأقسام الرئيسية"}
            </span>

            <div className="space-y-1.5">
              {ADMIN_DRAWER_TABS.filter((item) => {
                if (!drawerSearch.trim()) return true;
                const q = drawerSearch.toLowerCase();
                const titleStr = t[item.titleKey] || item.id;
                const descStr = item.desc[lang] || item.desc.ar || "";
                return titleStr.toLowerCase().includes(q) || descStr.toLowerCase().includes(q);
              }).map((item) => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as typeof activeTab);
                      onClose();
                      setDrawerSearch("");
                    }}
                    className={`w-full p-3 rounded-2xl text-start transition-all cursor-pointer flex items-center justify-between gap-3 group border active:scale-[0.99] ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0 transition-transform group-hover:scale-105 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-blue-500/30"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4
                            className={`text-xs font-black truncate ${
                              isSelected ? "text-blue-900" : "text-slate-800"
                            }`}
                          >
                            {t[item.titleKey]}
                          </h4>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.desc[lang] || item.desc.ar}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                      {isRtl ? "←" : "→"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category 2: Direct Jump Grid with Live Snippets */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-2">
              {lang === "en"
                ? "Quick Field Jump"
                : lang === "ur"
                ? "فیلڈز تک فوری رسائی"
                : "الانتقال المباشر للحقول"}
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Jump 0: Serial & Unified Number */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                  setTimeout(() => {
                    const el = document.getElementById("serial-number-input");
                    if (el) {
                      el.focus();
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }, 100);
                }}
                className="p-3 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/70 hover:border-blue-400 hover:bg-blue-100/60 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95 col-span-2"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                      🔢
                    </span>
                    <span className="font-black text-xs text-blue-950 group-hover:text-blue-700 truncate">
                      {lang === "en"
                        ? "Serial & Unified Number (Link)"
                        : lang === "ur"
                        ? "سیریل اور یونیفائیڈ نمبر (لنک)"
                        : "الرقم التسلسلي والموحد (رابط البوابة)"}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md"
                    dir="ltr"
                  >
                    /{config.serialNumber?.trim() || "..."}/{config.unifiedNumber?.trim() || "..."}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate block text-right font-sans">
                  {lang === "en"
                    ? `Serial: ${config.serialNumber || "—"} | Unified: ${
                        config.unifiedNumber || "—"
                      }`
                    : lang === "ur"
                    ? `سیریل: ${config.serialNumber || "—"} | قومی نمبر: ${
                        config.unifiedNumber || "—"
                      }`
                    : `التسلسلي: ${config.serialNumber || "—"} | الموحد: ${
                        config.unifiedNumber || "—"
                      }`}
                </span>
              </button>

              {/* Jump 1: Chamber */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-sm">
                    🏛️
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                    {lang === "en"
                      ? "Chamber & Facility"
                      : lang === "ur"
                      ? "کمرہ اور ادارہ"
                      : "اسم الغرفة والمنشأة"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate block">
                  {config.facilityName}
                </span>
              </button>

              {/* Jump 2: Request Number */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-sm">
                    🔢
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 truncate">
                    {lang === "en" ? "Request #" : lang === "ur" ? "درخواست نمبر" : "رقم الطلب والموحد"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate block">
                  #{config.requestNumber}
                </span>
              </button>

              {/* Jump 3: Dates */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-sm">
                    📅
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-amber-700 truncate">
                    {lang === "en"
                      ? "Dates & Times"
                      : lang === "ur"
                      ? "تاریخ اور اوقات"
                      : "التواريخ والأوقات"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate block">
                  {config.creationDate}
                </span>
              </button>

              {/* Jump 4: Status */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: config.statusColor || "#32c5cb" }}
                  />
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 truncate">
                    {lang === "en"
                      ? "Status & Color"
                      : lang === "ur"
                      ? "حالت اور رنگ"
                      : "حالة الطلب ولونه"}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold truncate block"
                  style={{ color: config.statusColor || "#32c5cb" }}
                >
                  {config.requestStatus}
                </span>
              </button>

              {/* Jump 5: Custom Fields */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("document");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-sm">
                    ✨
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 truncate">
                    {lang === "en" ? "Custom Fields" : lang === "ur" ? "اضافی فیلڈز" : "الحقول المخصصة"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate block">
                  {config.customFields?.length || 0}{" "}
                  {lang === "en" ? "fields" : lang === "ur" ? "فیلڈز" : "حقول"}
                </span>
              </button>

              {/* Jump 6: Attached PDF Files */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("buttons");
                  onClose();
                  setDrawerSearch("");
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-sm">
                    📁
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                    {lang === "en"
                      ? "Cloud Files"
                      : lang === "ur"
                      ? "پی ڈی ایف فائلز"
                      : "ملفات الأزرار والـ PDF"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate block">
                  {config.downloadButton.fileName || "Google Drive"}
                </span>
              </button>
            </div>
          </div>

          {/* Category 3: Quick Action Hub inside Drawer */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-2">
              {lang === "en" ? "Quick Actions Hub" : lang === "ur" ? "فوری کنٹرولز" : "مركز الإجراءات السريعة"}
            </span>

            <div className="space-y-2.5">
              {/* Save button inside drawer */}
              <button
                type="button"
                onClick={() => {
                  onSave();
                  onClose();
                  setDrawerSearch("");
                }}
                disabled={saving}
                className={`w-full py-3 px-4 rounded-2xl text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 ${
                  hasUnsavedChanges
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25 ring-2 ring-emerald-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
                }`}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconCheck className="w-4 h-4" />
                )}
                <span>{t.save_btn}</span>
                {hasUnsavedChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Open live site in new tab */}
                <Link
                  href={publicLink}
                  target="_blank"
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5 no-underline transition-colors shadow-2xs"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="truncate">{t.preview_btn}</span>
                </Link>

                {/* Quick Modal Preview */}
                <button
                  type="button"
                  onClick={() => {
                    onQuickPreview();
                    onClose();
                    setDrawerSearch("");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-bold text-xs border border-purple-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <IconPreview className="w-3.5 h-3.5" />
                  <span className="truncate">{t.quick_preview}</span>
                </button>
              </div>

              {/* Reset defaults inside drawer */}
              <button
                type="button"
                onClick={() => {
                  onReset();
                  onClose();
                  setDrawerSearch("");
                }}
                className="w-full py-2 px-3 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold border border-rose-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🔄</span>
                <span>{t.reset_btn}</span>
              </button>

              {/* Language switch inside drawer */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                <span className="font-bold text-slate-600 text-[11px]">
                  {lang === "en"
                    ? "Language"
                    : lang === "ur"
                    ? "زبان منتخب کریں"
                    : "لغة اللوحة"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onLanguageChange("ar")}
                    className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      lang === "ar"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🇸🇦 عربية
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange("en")}
                    className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      lang === "en"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange("ur")}
                    className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      lang === "ur"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🇵🇰 اردو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Quick Shortcuts */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">
              Esc
            </span>
            <span>{lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}</span>
            <span className="text-slate-300">•</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">
              Ctrl+S
            </span>
            <span>{lang === "en" ? "Save" : lang === "ur" ? "محفوظ کریں" : "حفظ"}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setDrawerSearch("");
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black cursor-pointer transition-colors shadow-2xs"
          >
            {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
          </button>
        </div>
      </div>
    </div>
  );
}
