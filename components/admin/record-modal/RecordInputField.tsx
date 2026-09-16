import React from "react";

export interface RecordInputFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  isMono?: boolean;
  error?: string;
  action?: React.ReactNode;
  focusColorClass?: string;
  className?: string;
}

export function RecordInputField({
  label,
  value = "",
  onChange,
  placeholder,
  required = false,
  dir,
  isMono = false,
  error,
  action,
  focusColorClass = "focus:ring-blue-500 focus:border-blue-500",
  className = "",
}: RecordInputFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        {action}
      </div>
      <input
        type="text"
        required={required}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all ${
          isMono ? "font-mono" : ""
        } ${
          error
            ? "border-rose-400 focus:ring-rose-400"
            : `border-slate-300 ${focusColorClass}`
        }`}
      />
      {error && <p className="text-[10px] font-bold text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
