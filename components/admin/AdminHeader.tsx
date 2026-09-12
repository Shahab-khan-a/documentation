"use client";

import React from "react";
import Link from "next/link";
import { AdminLanguage, TranslationStrings } from "@/constants/translations";
import { IconPreview, IconCheck } from "@/components/icons/AdminIcons";

export interface AdminHeaderProps {
  lang: AdminLanguage;
  onLanguageChange: (lang: AdminLanguage) => void;
  activeTab: "buttons" | "document" | "preview" | "footer" | "settings";
  onOpenDrawer: () => void;
  onQuickPreview: () => void;
  hasUnsavedChanges: boolean;
  onDiscardChanges: () => void;
  onSave: () => void;
  saving: boolean;
  savedRecordsCount: number;
  onOpenFirebaseRecords: () => void;
  publicLink: string;
  t: TranslationStrings;
}

export function AdminHeader({
  lang,
  onLanguageChange,
  activeTab,
  onOpenDrawer,
  onQuickPreview,
  hasUnsavedChanges,
  onDiscardChanges,
  onSave,
  saving,
  savedRecordsCount,
  onOpenFirebaseRecords,
  publicLink,
  t,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all select-none">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
        {/* Left: Brand Identity & Drawer Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          {/* Main Drawer Menu Toggle */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0 active:scale-95 group ring-2 ring-blue-500/20"
            title={
              lang === "en"
                ? "Open Navigation Menu (Escape to close)"
                : lang === "ur"
                ? "مینیو دراز کھولیں"
                : "فتح القائمة"
            }
          >
            <div className="w-4 h-4 flex flex-col justify-center gap-1">
              <span className="h-0.5 w-4 bg-white rounded-full transition-all duration-300 group-hover:w-2.5" />
              <span className="h-0.5 w-4 bg-white rounded-full" />
              <span className="h-0.5 w-3 bg-white rounded-full transition-all duration-300 group-hover:w-4" />
            </div>
            <span className="hidden sm:inline">
              {lang === "en" ? "Menu" : lang === "ur" ? "مینیو" : "القائمة"}
            </span>
          </button>

          {/* Glowing Brand Icon */}
          <div className="relative group shrink-0 hidden xs:flex">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs sm:text-sm shadow-xs border border-slate-800 transition-transform group-hover:scale-105">
              ⚡
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* Portal Title & Active Section Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight truncate min-w-0">
              {/* On small mobile (< sm): clean concise title, on desktop: full title */}
              <span className="sm:hidden">
                {lang === "en" ? "Portal Admin" : lang === "ur" ? "ایڈمن پینل" : "لوحة التحكم"}
              </span>
              <span className="hidden sm:inline">{t.title}</span>
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeTab === "buttons" && t.tab_buttons}
              {activeTab === "document" && t.tab_document}
              {activeTab === "preview" && t.tab_preview}
              {activeTab === "footer" && t.tab_footer}
              {activeTab === "settings" && t.tab_settings}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher, Preview, and Save Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => onLanguageChange("ar")}
              className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                lang === "ar"
                  ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              title="العربية (Arabic)"
            >
              <span>🇸🇦</span>
              <span className="hidden md:inline text-[11px]">عربية</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                lang === "en"
                  ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              title="English (English)"
            >
              <span>🇬🇧</span>
              <span className="hidden md:inline text-[11px]">EN</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("ur")}
              className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                lang === "ur"
                  ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
              title="اردو (Urdu)"
            >
              <span>🇵🇰</span>
              <span className="hidden md:inline text-[11px]">اردو</span>
            </button>
          </div>

          {/* Discard Unsaved Changes (Only when dirty) */}
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onDiscardChanges}
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-2xl text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs active:scale-95"
              title={t.undo_changes}
            >
              <span className="text-xs font-black">✕</span>
              <span className="hidden sm:inline">{t.undo_changes}</span>
            </button>
          )}

          {/* Preview & Portal Link Controls */}
          <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={onQuickPreview}
              className="h-7 sm:h-8 w-7 sm:w-8 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-white transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:shadow-xs"
              title={t.quick_preview}
            >
              <IconPreview className="w-3.5 h-3.5" />
            </button>
            <Link
              href={publicLink}
              target="_blank"
              className="h-7 sm:h-8 w-7 sm:w-8 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-white transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:shadow-xs group"
              title={t.preview_btn}
            >
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
            </Link>
          </div>

          {/* Firebase Saved Records Header Shortcut Button */}
          <button
            type="button"
            onClick={onOpenFirebaseRecords}
            className="h-8 sm:h-9 md:h-10 px-2.5 sm:px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 hover:text-amber-800 border border-amber-300/80 transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs shrink-0 active:scale-95 shadow-2xs"
            title={t.firebase_records_title}
          >
            <span className="text-sm">🔥</span>
            <span className="hidden lg:inline font-black">{t.firebase_records_btn}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs leading-none">
              {savedRecordsCount}
            </span>
          </button>

          {/* Primary Save Button (100% visible on all viewports, never cut off) */}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={`h-8 sm:h-9 md:h-10 px-2.5 sm:px-4 md:px-5 rounded-2xl text-xs font-black text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0 ${
              hasUnsavedChanges
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
            }`}
            title={t.shortcut_hint}
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="hidden xs:inline">{t.saving_btn}</span>
              </>
            ) : (
              <>
                <IconCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">
                  {lang === "en" ? "Save" : lang === "ur" ? "محفوظ" : "حفظ"}
                </span>
                <span className="hidden sm:inline">{t.save_btn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
