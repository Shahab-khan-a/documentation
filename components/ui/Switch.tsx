"use client";

import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
          checked
            ? "bg-blue-600 shadow-md shadow-blue-500/30"
            : "bg-slate-300/80 group-hover:bg-slate-400"
        }`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${
            checked ? "translate-x-5.5" : "translate-x-1"
          }`}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
