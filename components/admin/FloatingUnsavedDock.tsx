"use client";

import React from "react";
import { TranslationStrings } from "@/constants/translations";
import { IconCheck } from "@/components/icons/AdminIcons";

export interface FloatingUnsavedDockProps {
  hasUnsavedChanges: boolean;
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
  t: TranslationStrings;
}

export function FloatingUnsavedDock({
  hasUnsavedChanges,
  saving,
  onDiscard,
  onSave,
  t,
}: FloatingUnsavedDockProps) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="fixed bottom-8 sm:bottom-6 left-1/2 -translate-x-1/2 z-[99999] w-[calc(100%-3rem)] sm:w-auto max-w-xl pointer-events-auto">
      <div className="bg-slate-900/95 text-white backdrop-blur-2xl px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-white/15 ring-1 ring-black/40 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
            {t.unsaved_banner}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDiscard}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400/40 border border-white/15 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
          >
            ✕ {t.undo_changes}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/30 ring-1 ring-white/20 transition-all cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5 active:scale-95"
          >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.saving_btn}</span>
              </>
            ) : (
              <>
                <IconCheck className="w-3.5 h-3.5" />
                <span>{t.save_btn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
