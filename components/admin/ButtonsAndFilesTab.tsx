"use client";

import React from "react";
import { PortalConfig } from "@/types/portal";
import { AdminLanguage, TranslationStrings } from "@/constants/translations";
import { Switch } from "@/components/ui/Switch";
import {
  IconDrive,
  IconLink,
  IconDocument,
  IconDownload,
  IconCloudUpload,
} from "@/components/icons/AdminIcons";

export interface ButtonsAndFilesTabProps {
  config: PortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortalConfig>>;
  lang: AdminLanguage;
  t: TranslationStrings;
  isDragOverBtn: string | null;
  setIsDragOverBtn: (v: string | null) => void;
  uploadingBtn: string | null;
  fileInputBackRef: React.RefObject<HTMLInputElement | null>;
  fileInputVerifyRef: React.RefObject<HTMLInputElement | null>;
  fileInputDownloadRef: React.RefObject<HTMLInputElement | null>;
  updateButtonMode: (
    btn: "backButton" | "verifyAgainButton" | "downloadButton",
    mode: "link" | "file" | "animation"
  ) => void;
  handleFileUpload: (
    btn: "backButton" | "verifyAgainButton" | "downloadButton",
    file?: File | null
  ) => void;
  handleButtonLinkSave: (btn: "backButton" | "verifyAgainButton" | "downloadButton") => void;
  removeFile: (btn: "backButton" | "verifyAgainButton" | "downloadButton") => void;
  formatFileSize: (bytes?: number) => string;
  onOpenDriveForButton: (btn: "backButton" | "verifyAgainButton" | "downloadButton") => void;
  onOpenDriveManager: () => void;
}

export function ButtonsAndFilesTab({
  config,
  setConfig,
  lang,
  t,
  isDragOverBtn,
  setIsDragOverBtn,
  uploadingBtn,
  fileInputBackRef,
  fileInputVerifyRef,
  fileInputDownloadRef,
  updateButtonMode,
  handleFileUpload,
  handleButtonLinkSave,
  removeFile,
  formatFileSize,
  onOpenDriveForButton,
  onOpenDriveManager,
}: ButtonsAndFilesTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Bar for Buttons & Files: Google Drive Quick Access */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-800/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <IconDrive className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black">
              {lang === "en"
                ? "Google Drive Cloud File Storage"
                : lang === "ur"
                ? "گوگل ڈرائیو کلاؤڈ فائل اسٹوریج"
                : "تخزين الملفات السحابي عبر Google Drive"}
            </h4>
            <p className="text-xs text-blue-200/80 font-medium">
              {lang === "en"
                ? "Files attached to buttons are uploaded directly to Google Drive"
                : lang === "ur"
                ? "بٹنوں سے منسلک فائلیں براہ راست گوگل ڈرائیو پر محفوظ ہوتی ہیں"
                : "الملفات المرفقة بالأزرار يتم حفظها وتخزينها مباشرة في Google Drive"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDriveManager}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-slate-900 text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          <IconDrive className="w-4 h-4 text-blue-600" />
          <span>
            {lang === "en"
              ? "Manage Google Drive Files"
              : lang === "ur"
              ? "گوگل ڈرائیو فائلیں دیکھیں"
              : "عرض وإدارة ملفات Drive"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BUTTON 1: رجوع (Back) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-100">
                {t.btn1_badge}
              </span>
              <span className="text-xs text-slate-400 font-bold">1/3</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">{t.btn1_title}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">{t.btn1_desc}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.btn_label}</label>
                <input
                  type="text"
                  value={config.backButton.label}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      backButton: { ...config.backButton, label: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.btn_action_mode}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateButtonMode("backButton", "link")}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.backButton.actionType === "link"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconLink className="w-3.5 h-3.5" />
                    <span>{t.mode_link}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonMode("backButton", "file")}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.backButton.actionType === "file"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconDocument className="w-3.5 h-3.5" />
                    <span>{t.mode_file}</span>
                  </button>
                </div>
              </div>

              {config.backButton.actionType === "link" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.paste_url}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.url_placeholder}
                      dir="ltr"
                      value={config.backButton.url}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          backButton: { ...config.backButton, url: e.target.value },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleButtonLinkSave("backButton");
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-left transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleButtonLinkSave("backButton")}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer transition-all"
                      title={
                        lang === "en"
                          ? "Attach link and view in Google Drive"
                          : lang === "ur"
                          ? "لنک منسلک کریں اور ڈرائیو دیکھیں"
                          : "تطبيق الرابط والعرض في Drive"
                      }
                    >
                      <span>✓</span>
                      <span className="hidden sm:inline">
                        {lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}
                      </span>
                    </button>
                    {config.backButton.url && config.backButton.url !== "#" && (
                      <a
                        href={config.backButton.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        title="Test link"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{t.url_hint}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.file_attached}
                  </label>
                  {config.backButton.fileUrl ? (
                    <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-xl">📄</span>
                          <div className="truncate">
                            {config.backButton.fileUrl.includes("drive") && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1">
                                <IconDrive className="w-3 h-3" />
                                <span>Google Drive</span>
                              </span>
                            )}
                            <p className="text-xs font-bold text-blue-950 truncate">
                              {config.backButton.fileName || "document.pdf"}
                            </p>
                            <p className="text-[10px] text-blue-700 font-medium">
                              {formatFileSize(config.backButton.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("backButton")}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1 cursor-pointer"
                        >
                          {t.remove_file}
                        </button>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-blue-200/80 flex items-center justify-between">
                        <a
                          href={config.backButton.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-700 font-bold hover:underline"
                        >
                          {t.test_preview_file}
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDriveForButton("backButton")}
                            className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <IconDrive className="w-3 h-3" />
                            <span>من Google Drive</span>
                          </button>
                          <label
                            htmlFor="file-input-back"
                            className="text-[11px] text-slate-600 font-bold hover:underline cursor-pointer"
                          >
                            {t.replace_file}
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="file-input-back"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn("back");
                        }}
                        onDragLeave={() => setIsDragOverBtn(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn(null);
                          if (e.dataTransfer.files?.[0]) {
                            handleFileUpload("backButton", e.dataTransfer.files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all block relative select-none active:scale-[0.99] ${
                          isDragOverBtn === "back"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40"
                        }`}
                      >
                        <input
                          id="file-input-back"
                          ref={fileInputBackRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload("backButton", e.target.files[0]);
                            }
                            e.target.value = "";
                          }}
                        />
                        <IconCloudUpload className="w-8 h-8 mx-auto text-blue-500 mb-1.5" />
                        <span className="text-xs font-bold text-slate-800 block">
                          {uploadingBtn === "backButton"
                            ? lang === "en"
                              ? "Uploading to Google Drive..."
                              : lang === "ur"
                              ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..."
                              : "جاري الرفع إلى Google Drive..."
                            : t.file_upload_title}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {t.file_upload_sub}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDriveForButton("backButton");
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <IconDrive className="w-4 h-4" />
                        <span>
                          {lang === "en"
                            ? "Choose from Google Drive"
                            : lang === "ur"
                            ? "گوگل ڈرائیو سے فائل منتخب کریں"
                            : "اختيار ملف من Google Drive"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <Switch
                  checked={config.backButton.openInNewTab || false}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      backButton: {
                        ...config.backButton,
                        openInNewTab: v,
                      },
                    })
                  }
                  label={t.open_new_tab}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Status:</span>
            <span className="font-black text-blue-600">
              {config.backButton.actionType === "file" && config.backButton.fileUrl
                ? t.status_file
                : config.backButton.url && config.backButton.url !== "#"
                ? t.status_link
                : t.status_default}
            </span>
          </div>
        </div>

        {/* BUTTON 2: إعادة التحقق (Verify Again) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-xl border border-indigo-100">
                {t.btn2_badge}
              </span>
              <span className="text-xs text-slate-400 font-bold">2/3</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">{t.btn2_title}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">{t.btn2_desc}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.btn_label}</label>
                <input
                  type="text"
                  value={config.verifyAgainButton.label}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      verifyAgainButton: {
                        ...config.verifyAgainButton,
                        label: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.btn_action_mode}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateButtonMode("verifyAgainButton", "animation")}
                    className={`py-2 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      config.verifyAgainButton.actionType === "animation"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.mode_animation}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonMode("verifyAgainButton", "link")}
                    className={`py-2 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      config.verifyAgainButton.actionType === "link"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconLink className="w-3 h-3" />
                    <span>{t.mode_link}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonMode("verifyAgainButton", "file")}
                    className={`py-2 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      config.verifyAgainButton.actionType === "file"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconDocument className="w-3 h-3" />
                    <span>{t.mode_file}</span>
                  </button>
                </div>
              </div>

              {config.verifyAgainButton.actionType === "link" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.paste_url}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.url_placeholder}
                      dir="ltr"
                      value={config.verifyAgainButton.url}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          verifyAgainButton: {
                            ...config.verifyAgainButton,
                            url: e.target.value,
                          },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleButtonLinkSave("verifyAgainButton");
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-left transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleButtonLinkSave("verifyAgainButton")}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer transition-all"
                      title={
                        lang === "en"
                          ? "Attach link and view in Google Drive"
                          : lang === "ur"
                          ? "لنک منسلک کریں اور ڈرائیو دیکھیں"
                          : "تطبيق الرابط والعرض في Drive"
                      }
                    >
                      <span>✓</span>
                      <span className="hidden sm:inline">
                        {lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}
                      </span>
                    </button>
                    {config.verifyAgainButton.url && config.verifyAgainButton.url !== "#" && (
                      <a
                        href={config.verifyAgainButton.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        title="Test link"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{t.url_hint}</p>
                </div>
              )}

              {config.verifyAgainButton.actionType === "file" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.file_attached}
                  </label>
                  {config.verifyAgainButton.fileUrl ? (
                    <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-xl">📄</span>
                          <div className="truncate">
                            {config.verifyAgainButton.fileUrl.includes("drive") && (
                              <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1">
                                <IconDrive className="w-3 h-3" />
                                <span>Google Drive</span>
                              </span>
                            )}
                            <p className="text-xs font-bold text-indigo-950 truncate">
                              {config.verifyAgainButton.fileName || "document.pdf"}
                            </p>
                            <p className="text-[10px] text-indigo-700 font-medium">
                              {formatFileSize(config.verifyAgainButton.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("verifyAgainButton")}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1 cursor-pointer"
                        >
                          {t.remove_file}
                        </button>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-indigo-200/80 flex items-center justify-between">
                        <a
                          href={config.verifyAgainButton.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-700 font-bold hover:underline"
                        >
                          {t.test_preview_file}
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDriveForButton("verifyAgainButton")}
                            className="text-[11px] text-indigo-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <IconDrive className="w-3 h-3" />
                            <span>من Google Drive</span>
                          </button>
                          <label
                            htmlFor="file-input-verify"
                            className="text-[11px] text-slate-600 font-bold hover:underline cursor-pointer"
                          >
                            {t.replace_file}
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="file-input-verify"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn("verify");
                        }}
                        onDragLeave={() => setIsDragOverBtn(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn(null);
                          if (e.dataTransfer.files?.[0]) {
                            handleFileUpload("verifyAgainButton", e.dataTransfer.files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all block relative select-none active:scale-[0.99] ${
                          isDragOverBtn === "verify"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/40"
                        }`}
                      >
                        <input
                          id="file-input-verify"
                          ref={fileInputVerifyRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload("verifyAgainButton", e.target.files[0]);
                            }
                            e.target.value = "";
                          }}
                        />
                        <IconCloudUpload className="w-8 h-8 mx-auto text-indigo-500 mb-1.5" />
                        <span className="text-xs font-bold text-slate-800 block">
                          {uploadingBtn === "verifyAgainButton"
                            ? lang === "en"
                              ? "Uploading to Google Drive..."
                              : lang === "ur"
                              ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..."
                              : "جاري الرفع إلى Google Drive..."
                            : t.file_upload_title}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {t.file_upload_sub}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDriveForButton("verifyAgainButton");
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <IconDrive className="w-4 h-4" />
                        <span>
                          {lang === "en"
                            ? "Choose from Google Drive"
                            : lang === "ur"
                            ? "گوگل ڈرائیو سے فائل منتخب کریں"
                            : "اختيار ملف من Google Drive"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 space-y-3">
                <div>
                  <Switch
                    checked={config.verifyAgainButton.showLoader ?? true}
                    onChange={(v) =>
                      setConfig({
                        ...config,
                        verifyAgainButton: {
                          ...config.verifyAgainButton,
                          showLoader: v,
                        },
                      })
                    }
                    label={t.show_loader}
                  />
                </div>
                <div>
                  <Switch
                    checked={config.verifyAgainButton.openInNewTab || false}
                    onChange={(v) =>
                      setConfig({
                        ...config,
                        verifyAgainButton: {
                          ...config.verifyAgainButton,
                          openInNewTab: v,
                        },
                      })
                    }
                    label={t.open_new_tab}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Status:</span>
            <span className="font-black text-indigo-600">
              {config.verifyAgainButton.actionType === "file"
                ? t.status_file
                : config.verifyAgainButton.actionType === "link"
                ? t.status_link
                : t.status_animation}
            </span>
          </div>
        </div>

        {/* BUTTON 3: تحميل (Download) */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs">
                {t.btn3_badge}
              </span>
              <span className="text-xs text-emerald-700 font-bold">3/3</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">{t.btn3_title}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">{t.btn3_desc}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.btn_label}</label>
                <input
                  type="text"
                  value={config.downloadButton.label}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      downloadButton: {
                        ...config.downloadButton,
                        label: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.btn_action_mode}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateButtonMode("downloadButton", "file")}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.downloadButton.actionType === "file"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span>{t.mode_file}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateButtonMode("downloadButton", "link")}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      config.downloadButton.actionType === "link"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <IconLink className="w-3.5 h-3.5" />
                    <span>{t.mode_link}</span>
                  </button>
                </div>
              </div>

              {config.downloadButton.actionType === "file" ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.file_attached}
                  </label>
                  {config.downloadButton.fileUrl ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-2xl">📑</span>
                          <div className="truncate">
                            {config.downloadButton.fileUrl.includes("drive") && (
                              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1 border border-emerald-200">
                                <IconDrive className="w-3 h-3" />
                                <span>Google Drive</span>
                              </span>
                            )}
                            <p className="text-xs font-black text-emerald-950 truncate">
                              {config.downloadButton.fileName || "certificate.pdf"}
                            </p>
                            <p className="text-[11px] text-emerald-700 font-bold">
                              {formatFileSize(config.downloadButton.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("downloadButton")}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1 cursor-pointer"
                        >
                          {t.remove_file}
                        </button>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-emerald-200 flex items-center justify-between">
                        <a
                          href={config.downloadButton.fileUrl}
                          download={config.downloadButton.fileName || "certificate.pdf"}
                          className="text-xs text-emerald-800 font-black hover:underline flex items-center gap-1"
                        >
                          <IconDownload className="w-3.5 h-3.5" />
                          <span>{t.test_download_file}</span>
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDriveForButton("downloadButton")}
                            className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <IconDrive className="w-3 h-3" />
                            <span>من Google Drive</span>
                          </button>
                          <label
                            htmlFor="file-input-download"
                            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            {t.replace_file}
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="file-input-download"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn("download");
                        }}
                        onDragLeave={() => setIsDragOverBtn(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOverBtn(null);
                          if (e.dataTransfer.files?.[0]) {
                            handleFileUpload("downloadButton", e.dataTransfer.files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all block relative select-none active:scale-[0.99] ${
                          isDragOverBtn === "download"
                            ? "border-emerald-600 bg-emerald-100"
                            : "border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50"
                        }`}
                      >
                        <input
                          id="file-input-download"
                          ref={fileInputDownloadRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload("downloadButton", e.target.files[0]);
                            }
                            e.target.value = "";
                          }}
                        />
                        <IconCloudUpload className="w-9 h-9 mx-auto text-emerald-600 mb-2" />
                        <span className="text-xs font-black text-emerald-950 block">
                          {uploadingBtn === "downloadButton"
                            ? lang === "en"
                              ? "Uploading to Google Drive..."
                              : lang === "ur"
                              ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..."
                              : "جاري الرفع إلى Google Drive..."
                            : t.file_upload_title}
                        </span>
                        <span className="text-[11px] text-emerald-800 mt-1 block">
                          {t.file_download_hint}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDriveForButton("downloadButton");
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <IconDrive className="w-4 h-4" />
                        <span>
                          {lang === "en"
                            ? "Choose from Google Drive"
                            : lang === "ur"
                            ? "گوگل ڈرائیو سے فائل منتخب کریں"
                            : "اختيار ملف من Google Drive"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.paste_url}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.url_placeholder}
                      dir="ltr"
                      value={config.downloadButton.url}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          downloadButton: {
                            ...config.downloadButton,
                            url: e.target.value,
                          },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleButtonLinkSave("downloadButton");
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleButtonLinkSave("downloadButton")}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer transition-all"
                      title={
                        lang === "en"
                          ? "Attach link and view in Google Drive"
                          : lang === "ur"
                          ? "لنک منسلک کریں اور ڈرائیو دیکھیں"
                          : "تطبيق الرابط والعرض في Drive"
                      }
                    >
                      <span>✓</span>
                      <span className="hidden sm:inline">
                        {lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}
                      </span>
                    </button>
                    {config.downloadButton.url && config.downloadButton.url !== "#" && (
                      <a
                        href={config.downloadButton.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        title="Test link"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{t.url_hint}</p>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <div>
                  <Switch
                    checked={config.downloadButton.showLoader ?? true}
                    onChange={(v) =>
                      setConfig({
                        ...config,
                        downloadButton: {
                          ...config.downloadButton,
                          showLoader: v,
                        },
                      })
                    }
                    label={t.show_loader}
                  />
                </div>
                <div>
                  <Switch
                    checked={config.downloadButton.openInNewTab || false}
                    onChange={(v) =>
                      setConfig({
                        ...config,
                        downloadButton: {
                          ...config.downloadButton,
                          openInNewTab: v,
                        },
                      })
                    }
                    label={t.open_new_tab}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Status:</span>
            <span className="font-black text-emerald-600">
              {config.downloadButton.actionType === "file" && config.downloadButton.fileUrl
                ? t.status_file
                : config.downloadButton.url && config.downloadButton.url !== "#"
                ? t.status_link
                : t.status_default}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
