import React from "react";
import { STATUS_COLOR_PRESETS, ColorPreset } from "@/constants/record-editor";

export interface ColorPickerGroupProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: ColorPreset[];
}

export function ColorPickerGroup({
  label,
  value,
  onChange,
  presets = STATUS_COLOR_PRESETS,
}: ColorPickerGroupProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#32c5cb"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0"
        />
        <div className="flex items-center gap-1">
          {presets.map((item) => (
            <button
              key={item.color}
              type="button"
              onClick={() => onChange(item.color)}
              className="w-5 h-5 rounded-full border border-white shadow-xs cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: item.color }}
              title={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
