import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans"
    >
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-md space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
          🔍
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-white">
            الصفحة غير موجودة (404)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            الرابط المطلوب غير متوفر أو تم نقله. يمكنك العودة للصفحة الرئيسية أو لوحة التحكم.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold text-center no-underline shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            الرئيسية / Home
          </Link>
          <Link
            href="/admin"
            className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs sm:text-sm font-bold text-center no-underline transition-all active:scale-95"
          >
            لوحة التحكم / Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
