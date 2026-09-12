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
  if (!toast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] shadow-2xl transition-all duration-300 max-w-xl w-full px-4 animate-in fade-in slide-in-from-top-4">
      <div
        onClick={() => {
          if (toast.link) {
            window.open(toast.link, "_blank", "noopener,noreferrer");
          }
        }}
        className={`px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 border text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-all ${
          toast.link ? "cursor-pointer hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]" : ""
        } ${
          toast.type === "success"
            ? "bg-emerald-600/95 text-white border-emerald-400/80 shadow-emerald-500/20"
            : toast.type === "error"
            ? "bg-rose-600/95 text-white border-rose-400/80 shadow-rose-500/20"
            : "bg-blue-600/95 text-white border-blue-400/80 shadow-blue-500/20"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-black shadow-inner">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          <div className="truncate min-w-0">
            <span className="block truncate font-bold">{toast.message}</span>
            {toast.link && (
              <span className="text-[10px] text-white/90 font-medium block truncate">
                {lang === "en"
                  ? "Click anywhere on notification to view in Google Drive"
                  : lang === "ur"
                  ? "گوگل ڈرائیو میں فائل کی لوکیشن دیکھنے کیلئے نوٹیفکیشن پر کلک کریں"
                  : "انقر هنا للذهاب إلى موقع الملف في Google Drive"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.link && (
            <a
              href={toast.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-slate-900 hover:bg-slate-100 active:scale-95 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md no-underline transition-all"
            >
              <span className="text-sm">☁️</span>
              <span>
                {toast.linkLabel ||
                  (lang === "en" ? "Open Drive ↗" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں ↗" : "عرض في Drive ↗")}
              </span>
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 rounded-full hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
