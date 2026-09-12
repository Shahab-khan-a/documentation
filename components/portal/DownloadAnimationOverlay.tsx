"use client";

import React, { useState, useEffect } from "react";
import { IconDrive } from "@/components/icons/AdminIcons";

export interface DownloadAnimationOverlayProps {
  active: boolean;
  buttonLoaderGifUrl?: string;
}

export function DownloadAnimationOverlay({
  active,
  buttonLoaderGifUrl,
}: DownloadAnimationOverlayProps) {
  const [cacheBustKey, setCacheBustKey] = useState<number>(() => Date.now());

  useEffect(() => {
    if (active) {
      setCacheBustKey(Date.now());
    }
  }, [active]);

  if (!active) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center font-sans animate-in fade-in duration-200 select-none"
    >
      {buttonLoaderGifUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${buttonLoaderGifUrl}?t=${cacheBustKey}`}
          alt="جاري التحميل..."
          className="w-full h-screen object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
          <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconDrive className="w-10 h-10" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
            جاري تنزيل الملف من Google Drive...
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
            يرجى الانتظار حتى يكتمل تنزيل الوثيقة الرسمية من Google Drive بنجاح...
          </p>
          <div className="w-52 h-2.5 bg-slate-100 rounded-full overflow-hidden mt-4 border border-slate-200 shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
