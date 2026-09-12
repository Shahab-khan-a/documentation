"use client";

import React, { useEffect } from "react";
import { AdminLanguage } from "@/lib/admin-translations";

interface UploadSuccessModalProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  driveViewLink?: string;
  targetButtonTitle?: string;
  lang: AdminLanguage;
  mainPageUrl?: string;
  onOpenDriveManager?: () => void;
}

function formatSize(bytes?: number, lang: AdminLanguage = "ar"): string {
  if (!bytes || bytes <= 0) return "0 " + (lang === "en" ? "KB" : lang === "ur" ? "کے بی" : "كيلوبايت");
  if (bytes < 1024) return bytes + (lang === "en" ? " B" : lang === "ur" ? " بائٹس" : " بايت");
  if (bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(1) + (lang === "en" ? " KB" : lang === "ur" ? " کے بی" : " كيلوبايت");
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + (lang === "en" ? " MB" : lang === "ur" ? " ایم بی" : " ميجابايت");
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + (lang === "en" ? " GB" : lang === "ur" ? " جی بی" : " جيجابايت");
}

export function UploadSuccessModal({
  open,
  onClose,
  fileName,
  fileSize,
  fileUrl,
  driveViewLink,
  targetButtonTitle,
  lang,
  mainPageUrl,
  onOpenDriveManager,
}: UploadSuccessModalProps) {
  const isRtl = lang === "ar" || lang === "ur";

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const targetDriveUrl =
    driveViewLink ||
    "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

  const targetMainPageUrl = mainPageUrl || "/";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100010] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-lg w-full overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Close Button in corner */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 ${
            isRtl ? "left-5" : "right-5"
          } w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-all cursor-pointer z-20 active:scale-95`}
          title={lang === "en" ? "Close (Esc)" : "إغلاق"}
        >
          ✕
        </button>

        {/* Ambient celebration glow effects */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Celebration Header Icon */}
        <div className="relative z-10 flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-500/15 mb-3 animate-bounce">
            ✓
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black mb-2">
            <span>🎉</span>
            <span>100% {lang === "en" ? "Saved & Synced" : lang === "ur" ? "محفوظ و مکمل" : "تم الحفظ بنجاح"}</span>
          </div>

          <h3 className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight">
            {lang === "en"
              ? "File Saved to Google Drive!"
              : lang === "ur"
              ? "فائل گوگل ڈرائیو میں محفوظ ہو گئی!"
              : "تم حفظ الملف بنجاح في Google Drive!"}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-md leading-relaxed">
            {lang === "en"
              ? "The file is permanently saved in your Google Drive cloud folder and connected for instantaneous direct downloading on the verification portal."
              : lang === "ur"
              ? "فائل آپ کے گوگل ڈرائیو میں محفوظ ہو چکی ہے اور تصدیقی پورٹل پر بغیر کسی رکاوٹ کے فوری ڈاؤن لوڈ کیلئے تیار ہے۔"
              : "تم تخزين الملف في مجلد Google Drive وربطه بالزر المخصص ليعمل بالتحميل المباشر الفوري على بوابة التحقق بدون أي مشاكل."}
          </p>
        </div>

        {/* File Detail Highlights Card */}
        <div className="relative z-10 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-3 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-600/20 shrink-0">
              {fileName.toLowerCase().endsWith(".pdf") ? "📄" : fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? "🖼️" : "📁"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate" title={fileName}>
                {fileName || "certificate.pdf"}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mt-0.5">
                <span className="text-emerald-700">{formatSize(fileSize, lang)}</span>
                <span>•</span>
                <span className="text-slate-600">Google Drive Cloud</span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-emerald-200/70 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px] font-bold">
                {lang === "en" ? "Linked Button:" : lang === "ur" ? "منسلک بٹن:" : "الزر المتصل:"}
              </span>
              <span className="font-black text-slate-800 truncate block mt-0.5">
                {targetButtonTitle || (lang === "en" ? "Download Button" : "زر التحميل")}
              </span>
            </div>
            <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px] font-bold">
                {lang === "en" ? "Cloud Folder:" : lang === "ur" ? "کلاؤڈ فولڈر:" : "المجلد السحابي:"}
              </span>
              <span className="font-black text-emerald-700 truncate block mt-0.5">
                website file
              </span>
            </div>
          </div>

          {/* Direct Download Guarantee Notice */}
          <div className="bg-emerald-100/60 text-emerald-900 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center gap-2">
            <span className="text-emerald-700 text-sm shrink-0">⚡</span>
            <span>
              {lang === "en"
                ? "Direct download ready: Users can click and download immediately with zero popup blocks."
                : lang === "ur"
                ? "براہ راست ڈاؤن لوڈ فعال: صارف کے کلک کرتے ہی فائل فوراً ڈاؤن لوڈ ہو جائے گی۔"
                : "التحميل المباشر جاهز: عند نقر الزر في البوابة سيتم التحميل فوراً بدون حظر النوافذ."}
            </span>
          </div>
        </div>

        {/* ═══════════════ THE 3 ACTION BUTTONS ═══════════════ */}
        <div className="relative z-10 space-y-2.5">
          {/* 1. BUTTON 1: Open with Main Page */}
          <a
            href={targetMainPageUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 no-underline transition-all active:scale-[0.98] text-center group ring-2 ring-blue-500/20"
          >
            <span className="text-base group-hover:scale-110 transition-transform">🌐</span>
            <span>
              {lang === "en"
                ? "Open with Main Page ↗"
                : lang === "ur"
                ? "مین پیج پر جائیں ↗"
                : "فتح عبر الصفحة الرئيسية ↗"}
            </span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 2. BUTTON 2: Open with Google Drive */}
            <a
              href={targetDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs flex items-center justify-center gap-2 no-underline transition-all active:scale-[0.98] text-center"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
                <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l16.3-28.2H0C0 50.7 1.3 52.8 2.6 55l4 6.85z" fill="#0066DA" />
                <path d="M43.65 25L27.35 53.2h32.7l16.3-28.2h-32.7z" fill="#00AC47" />
                <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7c1.3-2.2 2.6-4.3 2.6-6.4H57.25l16.3 23.4z" fill="#EA4335" />
                <path d="M43.65 25L59.95 0H27.35l-7.9 13.7c-1.3 2.2-2.6 4.3-2.6 6.4h32.7l-5.9 4.9z" fill="#00832D" />
                <path d="M59.95 0h-32.6l16.3 28.2 16.3-28.2z" fill="#2684FC" />
                <path d="M84.65 59.8L70.95 36.1 57.25 53.2 73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7z" fill="#FFBA00" />
              </svg>
              <span>
                {lang === "en"
                  ? "Open with Google Drive ↗"
                  : lang === "ur"
                  ? "گوگل ڈرائیو میں کھولیں ↗"
                  : "فتح عبر Google Drive ↗"}
              </span>
            </a>

            {/* 3. BUTTON 3: Manage All Drive Files */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenDriveManager) onOpenDriveManager();
              }}
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <span className="text-sm">📁</span>
              <span>
                {lang === "en"
                  ? "Manage All Drive Files"
                  : lang === "ur"
                  ? "ڈرائیو کی تمام فائلیں 📁"
                  : "إدارة جميع ملفات Drive"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
