"use client";

import React from "react";
import { AdminLanguage } from "@/constants/translations";

export interface ToastData {
  message: string;
  type: "success" | "error" | "info";
  link?: string;
  linkLabel?: string;
}

export interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
  lang?: AdminLanguage;
}

export function ToastNotification({ toast, onClose, lang = "ar" }: ToastNotificationProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCopied(false);
  }, [toast?.link]);

  if (!toast) return null;

  const isDriveLink = Boolean(toast.link && toast.link.includes("drive.google.com"));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!toast.link) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(toast.link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] shadow-2xl transition-all duration-300 max-w-2xl w-full px-4 animate-in fade-in slide-in-from-top-4">
      <div
        onClick={() => {
          if (toast.link) {
            window.open(toast.link, "_blank", "noopener,noreferrer");
          }
        }}
        className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl flex items-center justify-between gap-2.5 sm:gap-3 border text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-all ${
          toast.link ? "cursor-pointer hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]" : ""
        } ${
          toast.type === "success"
            ? "bg-emerald-600/95 text-white border-emerald-400/80 shadow-emerald-500/20"
            : toast.type === "error"
            ? "bg-rose-600/95 text-white border-rose-400/80 shadow-rose-500/20"
            : "bg-blue-600/95 text-white border-blue-400/80 shadow-blue-500/20"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-black shadow-inner">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          <div className="truncate min-w-0">
            <span className="block truncate font-bold">{toast.message}</span>
            {toast.link && (
              <span className="text-[10px] text-white/90 font-medium block truncate">
                {isDriveLink
                  ? lang === "en"
                    ? "Click anywhere on notification to view in Google Drive"
                    : lang === "ur"
                    ? "گوگل ڈرائیو میں فائل کی لوکیشن دیکھنے کیلئے نوٹیفکیشن پر کلک کریں"
                    : "انقر هنا للذهاب إلى موقع الملف في Google Drive"
                  : lang === "en"
                  ? "Click to open live form or use copy button"
                  : lang === "ur"
                  ? "لائیو فارم کھولنے یا لنک کاپی کرنے کیلئے کلک کریں"
                  : "انقر لفتح النموذج أو استخدم زر النسخ"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {toast.link && (
            <>
              {/* 1. 🌟 BEAUTIFUL COPY LINK BUTTON WITH COPIED FEEDBACK 🌟 */}
              <button
                type="button"
                onClick={handleCopy}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border ${
                  copied
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 shadow-emerald-600/20"
                    : "bg-white text-slate-800 hover:bg-slate-100 border-white/60 hover:border-white"
                }`}
                title={
                  copied
                    ? lang === "en" ? "Copied to clipboard! ✓" : lang === "ur" ? "کلپ بورڈ پر کاپی ہو گیا! ✓" : "تم النسخ إلى الحافظة! ✓"
                    : lang === "en" ? "Copy Link" : lang === "ur" ? "لنک کاپی کریں" : "نسخ الرابط"
                }
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-700 animate-in zoom-in-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      {lang === "en" ? "Copied! ✓" : lang === "ur" ? "کاپی ہو گیا! ✓" : "تم النسخ! ✓"}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {lang === "en" ? "Copy Link" : lang === "ur" ? "لنک کاپی" : "نسخ الرابط"}
                    </span>
                  </>
                )}
              </button>

              {/* 2. VIEW LIVE FORM / OPEN DRIVE BUTTON */}
              <a
                href={toast.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-slate-900 hover:bg-slate-100 active:scale-95 px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md no-underline transition-all border border-white/60 hover:border-white"
              >
                {isDriveLink ? (
                  <span className="text-sm">☁️</span>
                ) : (
                  <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
                <span>
                  {toast.linkLabel ||
                    (lang === "en"
                      ? "View Live Form ↗"
                      : lang === "ur"
                      ? "لائیو فارم دیکھیں ↗"
                      : "عرض النموذج ↗")}
                </span>
              </a>
            </>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 rounded-full hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer text-xs shrink-0"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
