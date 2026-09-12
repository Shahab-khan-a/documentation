"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary caught error:", error?.message, error?.stack);
    try {
      // Purge any corrupted localStorage cache that could have caused the crash
      localStorage.removeItem("portal_config_cache");
    } catch {
      // ignore
    }
  }, [error]);

  const handleCleanReload = () => {
    try {
      localStorage.removeItem("portal_config_cache");
      sessionStorage.clear();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      reset();
    }
  };

  const handleGoHome = () => {
    try {
      localStorage.removeItem("portal_config_cache");
      sessionStorage.clear();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center p-4 font-sans"
    >
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-md space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
          ⚠️
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white">
            حدث خطأ أثناء تحميل الصفحة
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            تعذر تحميل بعض البيانات في الوقت الحالي. يرجى إعادة المحاولة أو العودة للصفحة الرئيسية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCleanReload}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
          >
            إعادة المحاولة / Reload
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-bold text-center no-underline transition-all active:scale-95 cursor-pointer"
          >
            الرئيسية / Home
          </button>
        </div>
      </div>
    </div>
  );
}
