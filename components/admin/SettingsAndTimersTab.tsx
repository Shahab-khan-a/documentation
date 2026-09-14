"use client";

import React from "react";
import { PortalConfig } from "@/types/portal";
import { TranslationStrings } from "@/constants/translations";
import { Switch } from "@/components/ui/Switch";
import { IconSettings, IconCheck } from "@/components/icons/AdminIcons";

export interface SettingsAndTimersTabProps {
  config: PortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortalConfig>>;
  t: TranslationStrings;
  saving: boolean;
  onSave: () => void;
  lang: string;
}

export function SettingsAndTimersTab({
  config,
  setConfig,
  t,
  saving,
  onSave,
  lang,
}: SettingsAndTimersTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <IconSettings className="w-5 h-5 text-indigo-600" />
            <span>{t.settings_title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.settings_desc}</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <IconCheck className="w-4 h-4" />
          <span>{saving ? t.saving_btn : t.save_btn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titles & Branding */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <h3 className="text-sm font-black text-slate-800">
              {lang === "en"
                ? "Browser & Page Titles"
                : lang === "ur"
                ? "صفحہ اور پورٹل عنوانات"
                : "عناوين الصفحة والبوابة"}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.portal_title}
            </label>
            <input
              type="text"
              value={config.portalTitle}
              placeholder="بوابة خدمات الغرفة"
              onChange={(e) => setConfig({ ...config, portalTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.page_title}
            </label>
            <input
              type="text"
              value={config.pageTitle}
              onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-3">
            <Switch
              checked={config.enableInitialLoader ?? true}
              onChange={(v) => setConfig({ ...config, enableInitialLoader: v })}
              label={t.initial_loader_toggle}
            />
          </div>
        </div>

        {/* Loaders & Timers */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <h3 className="text-sm font-black text-slate-800">
              {lang === "en"
                ? "Animation Timers (Milliseconds)"
                : lang === "ur"
                ? "انتظار کا وقت اور اینیمیشن"
                : "فترات الانتظار والأنيميشن"}
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t.loader_initial_ms}
              </label>
              <span className="text-xs font-mono font-black text-indigo-600">
                {(config.loaderDurationMs / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="500"
                value={config.loaderDurationMs}
                onChange={(e) =>
                  setConfig({ ...config, loaderDurationMs: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex gap-1 shrink-0">
                {[1500, 3000, 5000, 10000].map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setConfig({ ...config, loaderDurationMs: ms })}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      config.loaderDurationMs === ms
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {ms / 1000}s
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{t.seconds_hint}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t.loader_button_ms}
              </label>
              <span className="text-xs font-mono font-black text-indigo-600">
                {(config.buttonLoaderDurationMs / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="500"
                value={config.buttonLoaderDurationMs}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    buttonLoaderDurationMs: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex gap-1 shrink-0">
                {[2000, 4000, 6000].map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setConfig({ ...config, buttonLoaderDurationMs: ms })}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      config.buttonLoaderDurationMs === ms
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {ms / 1000}s
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{t.seconds_hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
