import React from "react";
import { AdminLanguage } from "@/lib/admin-translations";

export interface LivePreviewBoxProps {
  url: string;
  lang: AdminLanguage;
}

export function LivePreviewBox({ url, lang }: LivePreviewBoxProps) {
  return (
    <div className="bg-indigo-50/80 rounded-2xl p-3.5 sm:p-4 border border-indigo-200/90 shadow-2xs space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
        <span className="flex items-center gap-1.5">
          <span>🔗</span>
          <span>
            {lang === "en"
              ? "Live Preview of New Shareable Link"
              : "معاينة الرابط المباشر الجديد للوثيقة"}
          </span>
        </span>
        <span className="text-[10px] text-indigo-600 font-mono bg-white px-2 py-0.5 rounded-full border border-indigo-200">
          100% Unique Link
        </span>
      </div>
      <div
        className="p-2.5 bg-white rounded-xl border border-indigo-200/80 font-mono text-[11px] text-blue-700 font-bold truncate select-all shadow-2xs"
        dir="ltr"
      >
        {url}
      </div>
    </div>
  );
}
