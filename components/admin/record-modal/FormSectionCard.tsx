import React from "react";

export interface FormSectionCardProps {
  dotColorClass: string;
  title: string;
  children: React.ReactNode;
}

export function FormSectionCard({ dotColorClass, title, children }: FormSectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{title}</h4>
      </div>
      {children}
    </div>
  );
}
