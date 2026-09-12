"use client";

import React, { useEffect } from "react";
import { AdminLanguage } from "@/lib/admin-translations";

interface UploadProgressModalProps {
  open: boolean;
  percentage: number;
  fileName: string;
  fileSize?: number;
  targetButtonTitle?: string;
  lang: AdminLanguage;
  statusText?: string;
  onCancel?: () => void;
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

export function UploadProgressModal({
  open,
  percentage,
  fileName,
  fileSize,
  targetButtonTitle,
  lang,
  statusText,
  onCancel,
}: UploadProgressModalProps) {
  const isRtl = lang === "ar" || lang === "ur";
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percentage)));

  // Escape listener only if onCancel provided
  useEffect(() => {
    if (!open || !onCancel) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  // Dynamic status text based on progress percentage
  const getDynamicStatus = () => {
    if (statusText) return statusText;
    if (clampedPercent < 25) {
      return lang === "en"
        ? "Preparing file & establishing connection to Google Drive..."
        : lang === "ur"
        ? "فائل تیار ہو رہی ہے اور گوگل ڈرائیو سے رابطہ قائم کیا جا رہا ہے..."
        : "جاري تهيئة الملف والاتصال السحابي بـ Google Drive...";
    }
    if (clampedPercent < 85) {
      return lang === "en"
        ? `Uploading data to Google Drive folder 'website file' (${clampedPercent}%)...`
        : lang === "ur"
        ? `گوگل ڈرائیو کے فولڈر 'website file' میں ڈیٹا منتقل ہو رہا ہے (${clampedPercent}%)...`
        : `جاري رفع البيانات إلى مجلد website file في Google Drive (${clampedPercent}%)...`;
    }
    if (clampedPercent < 100) {
      return lang === "en"
        ? "Securing cloud file and generating direct download link..."
        : lang === "ur"
        ? "گوگل ڈرائیو میں محفوظ اور براہ راست ڈاؤن لوڈ لنک تیار ہو رہا ہے..."
        : "جاري معالجة وتأمين الرابط المباشر الفوري في السحابة...";
    }
    return lang === "en"
      ? "Upload 100% complete! Finalizing and saving changes..."
      : lang === "ur"
      ? "اپلوڈ 100% مکمل! تمام ترتیبات محفوظ ہو رہی ہیں..."
      : "اكتمل الرفع بنجاح 100%! جاري تثبيت وحفظ التعديلات...";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100010] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-lg w-full overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative"
      >
        {/* Ambient decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Top Header: Google Drive Icon & Badge */}
        <div className="relative z-10 flex flex-col items-center text-center mb-5">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10 flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <svg className="w-9 h-9" viewBox="0 0 87.3 78" fill="currentColor">
                  <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l16.3-28.2H0C0 50.7 1.3 52.8 2.6 55l4 6.85z" fill="#0066DA" />
                  <path d="M43.65 25L27.35 53.2h32.7l16.3-28.2h-32.7z" fill="#00AC47" />
                  <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7c1.3-2.2 2.6-4.3 2.6-6.4H57.25l16.3 23.4z" fill="#EA4335" />
                  <path d="M43.65 25L59.95 0H27.35l-7.9 13.7c-1.3 2.2-2.6 4.3-2.6 6.4h32.7l-5.9 4.9z" fill="#00832D" />
                  <path d="M59.95 0h-32.6l16.3 28.2 16.3-28.2z" fill="#2684FC" />
                  <path d="M84.65 59.8L70.95 36.1 57.25 53.2 73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7z" fill="#FFBA00" />
                </svg>
              </div>
            </div>
            {/* Spinning ring around badge */}
            <div className="absolute -inset-1 rounded-2xl border-2 border-blue-500/30 border-t-blue-600 animate-spin pointer-events-none" />
          </div>

          <h3 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
            {lang === "en"
              ? "Uploading to Google Drive Cloud"
              : lang === "ur"
              ? "گوگل ڈرائیو کلاؤڈ پر فائل محفوظ ہو رہی ہے"
              : "جاري رفع الملف إلى Google Drive"}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
            {lang === "en"
              ? "Please wait while your document is securely uploaded and synced..."
              : lang === "ur"
              ? "براہ کرم انتظار فرمائیں، فائل کلاؤڈ پر محفوظ کی جا رہی ہے..."
              : "يرجى الانتظار، جاري نقل البيانات وحفظ الملف في التخزين السحابي..."}
          </p>
        </div>

        {/* Big Percentage Display */}
        <div className="relative z-10 flex items-baseline justify-center gap-1.5 my-3">
          <span className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent font-mono">
            {clampedPercent}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
            %
          </span>
        </div>

        {/* Modern Animated Progress Bar */}
        <div className="relative z-10 my-4">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300 ease-out relative shadow-sm"
              style={{ width: `${clampedPercent}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mt-1.5 px-1">
            <span>0%</span>
            <span>{getDynamicStatus()}</span>
            <span>100%</span>
          </div>
        </div>

        {/* File Information Card */}
        <div className="relative z-10 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3 my-4 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">
              {fileName.toLowerCase().endsWith(".pdf") ? "📄" : fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? "🖼️" : "📁"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate" title={fileName}>
                {fileName || "document.pdf"}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                <span>{formatSize(fileSize, lang)}</span>
                {targetButtonTitle && (
                  <>
                    <span>•</span>
                    <span className="text-blue-700 font-bold truncate">
                      {targetButtonTitle}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-blue-100/80 text-blue-700 font-black text-[11px] shrink-0">
            {clampedPercent === 100
              ? (lang === "en" ? "Done ✓" : lang === "ur" ? "مکمل ✓" : "جاهز ✓")
              : (lang === "en" ? "Syncing..." : lang === "ur" ? "جاری ہے..." : "جاري النقل...")}
          </span>
        </div>

        {/* 3 Steps Timeline Indicator */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-[10px] font-bold">
          <div className={`p-2 rounded-xl border ${clampedPercent >= 10 ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
            <div className="mb-0.5">1. {lang === "en" ? "Read File" : lang === "ur" ? "فائل ریڈ" : "تجهيز الملف"}</div>
            <span>✓</span>
          </div>
          <div className={`p-2 rounded-xl border ${clampedPercent >= 20 && clampedPercent < 100 ? "bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse" : clampedPercent >= 100 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
            <div className="mb-0.5">2. {lang === "en" ? "Google Drive" : lang === "ur" ? "گوگل ڈرائیو" : "رفع السحابة"}</div>
            <span>{clampedPercent >= 100 ? "✓" : clampedPercent >= 20 ? "⏳" : "○"}</span>
          </div>
          <div className={`p-2 rounded-xl border ${clampedPercent >= 100 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
            <div className="mb-0.5">3. {lang === "en" ? "Public Link" : lang === "ur" ? "لنک ایکٹیو" : "الربط المباشر"}</div>
            <span>{clampedPercent >= 100 ? "✓" : "○"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
