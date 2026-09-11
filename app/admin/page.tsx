"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig } from "@/lib/portal-types";
import { ADMIN_TRANSLATIONS, AdminLanguage } from "@/lib/admin-translations";

// ─────────────────────────────────────────────────────────
//  MODERN SVG ICONS (Crisp, High-Resolution, No Emojis)
// ─────────────────────────────────────────────────────────
function IconButtons({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );
}

function IconDocument({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconPreview({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconSupport({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function IconSettings({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

function IconCloudUpload({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function IconDownload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconLink({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  IOS STYLE TOGGLE SWITCH COMPONENT
// ─────────────────────────────────────────────────────────
function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
            checked ? "translate-x-4.5" : "translate-x-1"
          }`}
        />
      </div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </label>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [config, setConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);
  const [initialConfig, setInitialConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBtn, setUploadingBtn] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; link?: string; linkLabel?: string } | null>(null);
  
  // Language for admin panel only (persisted in localStorage)
  const [lang, setLang] = useState<AdminLanguage>("ar");
  const [activeTab, setActiveTab] = useState<"buttons" | "document" | "preview" | "footer" | "settings">("buttons");
  const [isDragOverBtn, setIsDragOverBtn] = useState<string | null>(null);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ─── GOOGLE DRIVE FILE PICKER STATE ───
  const [drivePickerTarget, setDrivePickerTarget] = useState<"backButton" | "verifyAgainButton" | "downloadButton" | null>(null);
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string; mimeType: string; size?: string; downloadUrl: string; webViewLink?: string; createdTime?: string }>>([]);
  const [loadingDriveFiles, setLoadingDriveFiles] = useState(false);

  const fetchDriveFiles = useCallback(async () => {
    setLoadingDriveFiles(true);
    try {
      const res = await fetch("/api/drive");
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setDriveFiles(data.files);
      }
    } catch (err) {
      console.error("Error loading drive files:", err);
    } finally {
      setLoadingDriveFiles(false);
    }
  }, []);

  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const fileInputVerifyRef = useRef<HTMLInputElement>(null);
  const fileInputDownloadRef = useRef<HTMLInputElement>(null);

  // Translation strings
  const t = useMemo(() => ADMIN_TRANSLATIONS[lang] || ADMIN_TRANSLATIONS.ar, [lang]);
  const isRtl = lang === "ar" || lang === "ur";

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(initialConfig);
  }, [config, initialConfig]);

  // Load stored language preference & config on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("admin_portal_lang") as AdminLanguage | null;
      if (savedLang && (savedLang === "ar" || savedLang === "en" || savedLang === "ur")) {
        setLang(savedLang);
      }
    } catch {
      // ignore
    }

    async function loadConfig() {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
          setInitialConfig(data);
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Language switch handler
  const handleLanguageChange = (newLang: AdminLanguage) => {
    setLang(newLang);
    try {
      localStorage.setItem("admin_portal_lang", newLang);
    } catch {
      // ignore
    }
  };

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "success",
      link?: string,
      linkLabel?: string
    ) => {
      setToast({ message, type, link, linkLabel });
      const timer = setTimeout(() => {
        setToast(null);
      }, link ? 8000 : 4000);
      return () => clearTimeout(timer);
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const result = await res.json();
        setConfig(result.data);
        setInitialConfig(result.data);
        try {
          localStorage.setItem("portal_config_cache", JSON.stringify(result.data));
        } catch {
          // ignore
        }
        showToast(t.saved_success, "success");
      } else {
        showToast(t.save_error, "error");
      }
    } catch (err) {
      console.error(err);
      showToast(t.save_error, "error");
    } finally {
      setSaving(false);
    }
  }, [config, t, showToast]);

  const handleDiscardChanges = () => {
    setConfig(initialConfig);
    showToast(lang === "en" ? "Changes discarded" : lang === "ur" ? "تبدیلیاں واپس لے لی گئیں" : "تم التراجع عن التعديلات", "info");
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setQuickPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const handleReset = () => {
    if (confirm(t.reset_confirm)) {
      setConfig(DEFAULT_PORTAL_CONFIG);
      showToast(t.reset_success, "info");
    }
  };

  // Custom document fields handlers
  const handleAddCustomField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: "",
      value: "",
    };
    setConfig((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };

  const handleAddPresetField = (presetLabel: string) => {
    const newField = {
      id: `field_${Date.now()}`,
      label: presetLabel,
      value: "",
    };
    setConfig((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };

  const handleUpdateCustomField = (id: string, key: "label" | "value", val: string) => {
    setConfig((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).map((f) =>
        f.id === id ? { ...f, [key]: val } : f
      ),
    }));
  };

  const handleRemoveCustomField = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((f) => f.id !== id),
    }));
  };

  // Upload file handler for any button
  const handleFileUpload = async (
    buttonKey: "backButton" | "verifyAgainButton" | "downloadButton",
    file?: File | null
  ) => {
    if (!file) return;
    setUploadingBtn(buttonKey);
    const formData = new FormData();
    formData.append("file", file);

    showToast(
      lang === "en"
        ? `Uploading "${file.name}" to Google Drive...`
        : lang === "ur"
        ? `فائل "${file.name}" گوگل ڈرائیو پر اپلوڈ ہو رہی ہے...`
        : `جاري رفع "${file.name}" إلى Google Drive...`,
      "info"
    );

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig((prev) => ({
          ...prev,
          [buttonKey]: {
            ...prev[buttonKey],
            actionType: "file",
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
          },
        }));
        showToast(
          lang === "en"
            ? `File "${data.fileName}" linked! Click notification to open Google Drive folder.`
            : lang === "ur"
            ? `فائل "${data.fileName}" لنک ہو گئی۔ گوگل ڈرائیو پر دیکھنے کیلئے یہاں کلک کریں!`
            : `تم ربط الملف "${data.fileName}" بنجاح! انقر هنا لفتح مجلد Google Drive.`,
          "success",
          "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl",
          lang === "en" ? "Open Drive ↗" : lang === "ur" ? "گوگل ڈرائیو کھولیں ↗" : "فتح Google Drive ↗"
        );
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Upload failed", "error");
    } finally {
      setUploadingBtn(null);
    }
  };

  const removeFile = (buttonKey: "backButton" | "verifyAgainButton" | "downloadButton") => {
    setConfig((prev) => ({
      ...prev,
      [buttonKey]: {
        ...prev[buttonKey],
        actionType: "link",
        fileUrl: "",
        fileName: "",
        fileSize: undefined,
      },
    }));
    showToast(lang === "en" ? "File removed" : lang === "ur" ? "فائل ہٹا دی گئی" : "تم حذف الملف", "info");
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + (lang === "en" ? " bytes" : " بايت");
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + (lang === "en" ? " KB" : " كيلوبايت");
    return (bytes / (1024 * 1024)).toFixed(2) + (lang === "en" ? " MB" : " ميجابايت");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-sm tracking-wide">
            {lang === "en" ? "Loading Admin Dashboard..." : "جاري تحميل لوحة التحكم..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f3f6fa] text-slate-800 font-sans pb-32 selection:bg-blue-500 selection:text-white"
    >
      {/* ═══════════════ TOAST NOTIFICATION WITH GOOGLE DRIVE LINK ═══════════════ */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] shadow-2xl transition-all duration-300 max-w-xl w-full px-4">
          <div
            onClick={() => {
              if (toast.link) {
                window.open(toast.link, "_blank");
              }
            }}
            className={`px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 border text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md transition-all ${
              toast.link ? "cursor-pointer hover:scale-[1.01]" : ""
            } ${
              toast.type === "success"
                ? "bg-emerald-600/95 text-white border-emerald-400"
                : toast.type === "error"
                ? "bg-rose-600/95 text-white border-rose-400"
                : "bg-blue-600/95 text-white border-blue-400"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-base shrink-0">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
              </span>
              <span className="truncate">{toast.message}</span>
            </div>

            {toast.link && (
              <a
                href={toast.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md no-underline transition-all"
              >
                <span>☁️</span>
                <span>{toast.linkLabel || (lang === "en" ? "Open Drive ↗" : lang === "ur" ? "گوگل ڈرائیو کھولیں ↗" : "فتح Google Drive ↗")}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ QUICK MODAL PREVIEW OVERLAY ═══════════════ */}
      {quickPreviewOpen && (
        <div
          className="fixed inset-0 z-[99998] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setQuickPreviewOpen(false)}
        >
          <div
            dir="rtl"
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IconPreview className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">{t.preview_title}</h3>
                  <p className="text-xs text-slate-400">{t.preview_desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickPreviewOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-sans">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-sm"></span>
                    <h4 className="font-bold text-base text-slate-900">{config.pageTitle}</h4>
                  </div>
                  <span className="px-4 py-1 bg-[#6ea8fe] text-white rounded text-xs font-bold">
                    {config.backButton.label || "رجوع"}
                  </span>
                </div>

                <div className="py-5 max-w-md mx-auto text-center space-y-2 text-sm text-slate-800 leading-loose">
                  <p><strong>اسم الغرفة : </strong><span>{config.chamberName}</span></p>
                  <p><strong>اسم المنشأة : </strong><span>{config.facilityName}</span></p>
                  {config.facilitySubName && <p><span>{config.facilitySubName}</span></p>}
                  <p><strong>الرقم الموحد (700) : </strong><span className="font-mono">{config.unifiedNumber}</span></p>
                  <p><strong>رقم الطلب : </strong><span className="font-mono text-base font-bold">{config.requestNumber}</span></p>
                  <p><strong>نوع الطلب : </strong><span>{config.requestType}</span></p>
                  <p><strong>اسم مقدم الطلب : </strong><span>{config.applicantName}</span></p>
                  <p><strong>تاريخ ووقت الإنشاء : </strong><span className="font-mono">{config.creationDate} {config.creationTime}</span></p>
                  <p><strong>مبلغ الطلب : </strong><span>{config.amount}</span></p>
                  <p><strong>تاريخ الصلاحية : </strong><span className="font-mono">{config.expiryDate} {config.expiryTime}</span></p>
                  <p><strong>رقم السجل التجاري : </strong><span className="font-mono">{config.commercialRegNo}</span></p>
                  <p className="pt-2 text-base">
                    <strong>حالة الطلب : </strong>
                    <strong style={{ color: config.statusColor || "#55dbdd" }}>{config.requestStatus}</strong>
                  </p>
                  {/* Dynamically added custom fields in Arabic */}
                  {config.customFields && config.customFields.length > 0 && config.customFields.map((f) => (
                    <p key={f.id} className="m-0">
                      <strong>{f.label} : </strong>
                      <span>{f.value}</span>
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 pt-3 pb-2">
                  <span className="px-5 py-1.5 bg-[#6ea8fe] text-white rounded font-bold text-xs">
                    {config.verifyAgainButton.label || "إعادة التحقق"}
                  </span>
                  <span className="px-6 py-1.5 bg-[#6ea8fe] text-white rounded font-bold text-xs">
                    {config.downloadButton.label || "تحميل"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <Link
                href="/"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-bold underline flex items-center gap-1"
              >
                <span>{t.preview_btn}</span>
                <span className="text-xs">↗</span>
              </Link>
              <button
                type="button"
                onClick={() => setQuickPreviewOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 cursor-pointer"
              >
                {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ GOOGLE DRIVE FILE PICKER MODAL ═══════════════ */}
      {drivePickerTarget && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setDrivePickerTarget(null)}
        >
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-xl shrink-0">
                  📁
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {lang === "en" ? "Google Drive Cloud Files" : lang === "ur" ? "گوگل ڈرائیو فائلز" : "ملفات Google Drive السحابية"}
                  </h3>
                  <p className="text-xs text-blue-200/80">
                    {lang === "en"
                      ? "Folder: website file • Select any file to link directly"
                      : lang === "ur"
                      ? "فولڈر: website file • ڈاؤن لوڈ کیلئے براہ راست لنک کریں"
                      : "المجلد المتصل: website file • اختر أي ملف للربط والتحميل المباشر"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDriveFiles}
                  disabled={loadingDriveFiles}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="تحديث قائمة الملفات"
                >
                  <span className={loadingDriveFiles ? "animate-spin inline-block" : ""}>🔄</span>
                  <span>{lang === "en" ? "Refresh" : lang === "ur" ? "ریفریش" : "تحديث"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrivePickerTarget(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans">
              {loadingDriveFiles ? (
                <div className="py-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold">
                    {lang === "en" ? "Fetching files from Google Drive..." : lang === "ur" ? "گوگل ڈرائیو سے فائلیں لائی جا رہی ہیں..." : "جاري استرداد الملفات من Google Drive..."}
                  </p>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 text-3xl flex items-center justify-center mx-auto shadow-inner">
                    📂
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {lang === "en"
                        ? "No files found in Google Drive folder 'website file'"
                        : lang === "ur"
                        ? "گوگل ڈرائیو فولڈر 'website file' میں کوئی فائل نہیں ملی"
                        : "لم يتم العثور على ملفات داخل مجلد website file في Google Drive"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      {lang === "en"
                        ? "You can upload files directly here or drag files into your Google Drive 'website file' folder."
                        : lang === "ur"
                        ? "آپ یہاں سے فائل اپلوڈ کر سکتے ہیں یا اپنے گوگل ڈرائیو میں فائل شامل کر کے ریفریش کریں۔"
                        : "يمكنك رفع ملف مباشرة من هنا، أو وضع الملفات داخل مجلد website file في Google Drive ثم النقر على تحديث."}
                    </p>
                  </div>
                  <div className="pt-2">
                    <label
                      htmlFor={
                        drivePickerTarget === "backButton"
                          ? "file-input-back"
                          : drivePickerTarget === "verifyAgainButton"
                          ? "file-input-verify"
                          : "file-input-download"
                      }
                      onClick={() => setDrivePickerTarget(null)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2 select-none active:scale-95"
                    >
                      <span>⬆️</span>
                      <span>
                        {lang === "en" ? "Upload File Now" : lang === "ur" ? "فائل ابھی اپلوڈ کریں" : "رفع ملف جديد الآن"}
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    {lang === "en"
                      ? `Found ${driveFiles.length} file(s) in Google Drive:`
                      : lang === "ur"
                      ? `گوگل ڈرائیو میں ${driveFiles.length} فائلیں موجود ہیں:`
                      : `تم العثور على ${driveFiles.length} ملف في Google Drive:`}
                  </div>
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-2xl">
                          {file.mimeType.includes("pdf") ? "📄" : file.mimeType.includes("image") ? "🖼️" : "📁"}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {file.size ? formatFileSize(parseInt(file.size)) : "Google Drive"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-500 hover:text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100"
                            title="معاينة في Drive"
                          >
                            معاينة ↗
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (drivePickerTarget) {
                              setConfig((prev) => ({
                                ...prev,
                                [drivePickerTarget]: {
                                  ...prev[drivePickerTarget],
                                  actionType: "file",
                                  fileUrl: file.downloadUrl,
                                  fileName: file.name,
                                  fileSize: file.size ? parseInt(file.size) : undefined,
                                },
                              }));
                              setDrivePickerTarget(null);
                              showToast(
                                lang === "en"
                                  ? `Linked Google Drive file "${file.name}"! Click Save to apply.`
                                  : lang === "ur"
                                  ? `گوگل ڈرائیو فائل "${file.name}" منسلک کر دی گئی۔ سیو پر کلک کریں!`
                                  : `تم ربط ملف Google Drive "${file.name}" بنجاح! اضغط حفظ للاعتماد.`,
                                "success"
                              );
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                        >
                          {lang === "en" ? "Select File" : lang === "ur" ? "یہ فائل منتخب کریں" : "اختيار هذا الملف"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-400 font-medium">
                Google Drive Storage • Connected to Service Account
              </span>
              <button
                type="button"
                onClick={() => setDrivePickerTarget(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer"
              >
                {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SLIDE-OUT NAVIGATION DRAWER (SIDE LIST) ═══════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999]">
          {/* Backdrop overlay with blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer drawer-backdrop-anim"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel: Slides in smoothly from right in RTL, or left in LTR */}
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed inset-y-0 ${
              isRtl ? "right-0 drawer-panel-rtl border-l" : "left-0 drawer-panel-ltr border-r"
            } w-full max-w-[380px] sm:max-w-[430px] bg-white shadow-2xl flex flex-col z-[100000] border-slate-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-lg shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    {lang === "en" ? "Control Panel Menu" : lang === "ur" ? "کنٹرول پینل مینیو (دراز)" : "قائمة لوحة التحكم"}
                  </h3>
                  <p className="text-[11px] text-blue-200/80">
                    {lang === "en"
                      ? "Click any item to open that screen and edit"
                      : lang === "ur"
                      ? "کسی بھی سیکشن پر کلک کریں، اسکرین کھل جائے گی اور تبدیلی ہوگی"
                      : "اختر أي قسم للانتقال المباشر وتعديل البيانات"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                title={lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
              >
                ✕
              </button>
            </div>

            {/* Drawer Content List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
              {/* Category 1: Main Screens (الاقسام الرئيسية) */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  {lang === "en" ? "Main Sections" : lang === "ur" ? "بنیادی سیکشنز" : "الأقسام والشاشات الرئيسية"}
                </span>
                <div className="space-y-1.5">
                  {/* Item 1: Buttons & Files */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("buttons");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === "buttons"
                        ? "bg-blue-50 border-blue-300 text-blue-900 font-black shadow-xs ring-1 ring-blue-400"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <IconButtons className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">{t.tab_buttons}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {lang === "en"
                            ? "Back, Verify Again, and Download buttons & files"
                            : lang === "ur"
                            ? "واپسی، دوبارہ تصدیق اور ڈاؤن لوڈ بٹن اور فائلیں"
                            : "أزرار العودة، التحقق، وزر التحميل وربط الملفات"}
                        </div>
                      </div>
                    </div>
                    {activeTab === "buttons" && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                        {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا ہے" : "نشط"}
                      </span>
                    )}
                  </button>

                  {/* Item 2: Document Details */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === "document"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-black shadow-xs ring-1 ring-emerald-400"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <IconDocument className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">{t.tab_document}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {lang === "en"
                            ? "Chamber, facility, request #, dates, status"
                            : lang === "ur"
                            ? "کمرہ، ادارہ، درخواست نمبر، تاریخیں اور حالت"
                            : "اسم الغرفة، المنشأة، الأرقام، التواريخ، والحالة"}
                        </div>
                      </div>
                    </div>
                    {activeTab === "document" && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                        {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا ہے" : "نشط"}
                      </span>
                    )}
                  </button>

                  {/* Item 3: Live Preview */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("preview");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === "preview"
                        ? "bg-purple-50 border-purple-300 text-purple-900 font-black shadow-xs ring-1 ring-purple-400"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <IconPreview className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">{t.tab_preview}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {lang === "en"
                            ? "Interactive live portal preview screen"
                            : lang === "ur"
                            ? "پورٹل کی براہ راست انٹرایکٹو اسکرین"
                            : "معاينة شكل البوابة الحية بشكل تفاعلي ومباشر"}
                        </div>
                      </div>
                    </div>
                    {activeTab === "preview" && (
                      <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                        {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا ہے" : "نشط"}
                      </span>
                    )}
                  </button>

                  {/* Item 4: Footer & Support */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("footer");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === "footer"
                        ? "bg-amber-50 border-amber-300 text-amber-900 font-black shadow-xs ring-1 ring-amber-400"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <IconSupport className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">{t.tab_footer}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {lang === "en"
                            ? "Company name, phone number, social links"
                            : lang === "ur"
                            ? "کمپنی کا نام، فون نمبر اور سوشل لنکس"
                            : "اسم الشركة، رقم الهاتف، وروابط التواصل"}
                        </div>
                      </div>
                    </div>
                    {activeTab === "footer" && (
                      <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                        {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا ہے" : "نشط"}
                      </span>
                    )}
                  </button>

                  {/* Item 5: Settings & Timers */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("settings");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                      activeTab === "settings"
                        ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-black shadow-xs ring-1 ring-indigo-400"
                        : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <IconSettings className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">{t.tab_settings}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {lang === "en"
                            ? "GIF loaders, animation durations, timers"
                            : lang === "ur"
                            ? "لوڈر اینیمیشن، انتظار کا وقت اور ترتیبات"
                            : "شاشات التحميل المتحركة، فترات الانتظار، والإعدادات"}
                        </div>
                      </div>
                    </div>
                    {activeTab === "settings" && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                        {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا ہے" : "نشط"}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Category 2: Direct Sub-Section Jumps (انتقال سريع ومباشر للحقول) */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  {lang === "en" ? "Quick Field Jump" : lang === "ur" ? "فیلڈز تک فوری رسائی" : "الانتقال السريع للحقول"}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>🏛️</span>
                    <span className="truncate">
                      {lang === "en" ? "Chamber & Facility" : lang === "ur" ? "کمرہ اور ادارہ" : "اسم الغرفة والمنشأة"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔢</span>
                    <span className="truncate">
                      {lang === "en" ? "Request & Unified #" : lang === "ur" ? "درخواست اور موحد نمبر" : "أرقام الطلب والموحد"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>📅</span>
                    <span className="truncate">
                      {lang === "en" ? "Dates & Times" : lang === "ur" ? "تاریخ اور اوقات" : "التواريخ والأوقات"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>🟢</span>
                    <span className="truncate">
                      {lang === "en" ? "Status & Color" : lang === "ur" ? "حالت اور رنگ" : "حالة الطلب والألوان"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>➕</span>
                    <span className="truncate">
                      {lang === "en" ? "Custom Fields" : lang === "ur" ? "اضافی فیلڈز" : "الحقول المخصصة"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("buttons");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>📁</span>
                    <span className="truncate">
                      {lang === "en" ? "Upload PDF File" : lang === "ur" ? "پی ڈی ایف فائل اپلوڈ" : "رفع ملف PDF للأزرار"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("footer");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>📞</span>
                    <span className="truncate">
                      {lang === "en" ? "Support Phone" : lang === "ur" ? "ڈعم فون نمبر" : "هاتف الدعم الفني"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("settings");
                      setDrawerOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 font-bold transition-all text-right flex items-center gap-2 cursor-pointer"
                  >
                    <span>🎬</span>
                    <span className="truncate">
                      {lang === "en" ? "GIF Loaders" : lang === "ur" ? "GIF اینیمیشن" : "شاشات GIF للتحميل"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Category 3: Quick Controls inside Drawer */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  {lang === "en" ? "Quick Controls" : lang === "ur" ? "فوری کنٹرولز" : "الإجراءات السريعة"}
                </span>

                <div className="space-y-2">
                  {/* Save button inside drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSave();
                      setDrawerOpen(false);
                    }}
                    disabled={saving}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t.save_btn}</span>
                  </button>

                  {/* Open live site in new tab */}
                  <Link
                    href="/"
                    target="_blank"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-2 no-underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>{t.preview_btn} ( / )</span>
                  </Link>

                  {/* Reset defaults inside drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setDrawerOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>{t.reset_btn}</span>
                  </button>

                  {/* Language switch inside drawer */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-600">
                      {lang === "en" ? "Language" : lang === "ur" ? "زبان منتخب کریں" : "لغة اللوحة"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("ar")}
                        className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                          lang === "ar" ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                        }`}
                      >
                        🇸🇦 عربية
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("en")}
                        className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                          lang === "en" ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                        }`}
                      >
                        🇬🇧 En
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("ur")}
                        className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                          lang === "ur" ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                        }`}
                      >
                        🇵🇰 اردو
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <div className="text-slate-500 text-[11px] font-bold">
                بوابة خدمات الغرفة • Admin v2.0
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer"
              >
                {lang === "en" ? "Close Drawer" : lang === "ur" ? "بند کریں" : "إغلاق القائمة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🌟 ULTRA-CLEAN, MODERN, PROFESSIONAL HEADER (WITH DRAWER) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-xs">
        {/* Tier 1: Main Control Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & System Status */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* ─── PROMINENT MAIN DRAWER TOGGLE BUTTON ─── */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
              title={lang === "en" ? "Open Navigation Drawer" : lang === "ur" ? "مینیو دراز کھولیں" : "فتح القائمة الجانبية (دراز)"}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>
                {lang === "en" ? "Menu (Drawer)" : lang === "ur" ? "القائمة (دراز)" : "القائمة (دراز)"}
              </span>
            </button>

            {/* Active Screen Indicator (Clickable to open Drawer) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-all"
              title={lang === "en" ? "Current screen - Click to change via drawer" : lang === "ur" ? "موجودہ اسکرین - دراز کھولنے کے لئے کلک کریں" : "القسم المعروض حالياً - انقر للفتح من القائمة"}
            >
              <span className="text-slate-400 font-medium">
                {lang === "en" ? "Screen:" : lang === "ur" ? "سیکشن:" : "القسم:"}
              </span>
              <span className="font-black text-blue-700 flex items-center gap-1.5">
                {activeTab === "buttons" && (
                  <>
                    <IconButtons className="w-4 h-4 text-blue-600" />
                    <span>{t.tab_buttons}</span>
                  </>
                )}
                {activeTab === "document" && (
                  <>
                    <IconDocument className="w-4 h-4 text-emerald-600" />
                    <span>{t.tab_document}</span>
                  </>
                )}
                {activeTab === "preview" && (
                  <>
                    <IconPreview className="w-4 h-4 text-purple-600" />
                    <span>{t.tab_preview}</span>
                  </>
                )}
                {activeTab === "footer" && (
                  <>
                    <IconSupport className="w-4 h-4 text-amber-600" />
                    <span>{t.tab_footer}</span>
                  </>
                )}
                {activeTab === "settings" && (
                  <>
                    <IconSettings className="w-4 h-4 text-indigo-600" />
                    <span>{t.tab_settings}</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-blue-600 bg-white px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs font-black">
                {isRtl ? "تغيير ☰" : "Change ☰"}
              </span>
            </button>

            {/* Logo Badge */}
            <div className="relative group hidden sm:block">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg shrink-0 transition-transform group-hover:scale-105">
                ⚡
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
                  {t.title}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200/80 uppercase">
                  {t.badge}
                </span>

                {/* Online Status Pill */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {t.system_active}
                </span>
              </div>

              {/* Current Active Organization Label */}
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate font-medium mt-0.5">
                <span className="font-bold text-slate-700 truncate max-w-[200px] sm:max-w-[280px]">
                  {config.facilityName}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-slate-400 truncate">
                  #{config.requestNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
            {/* ─── INTERACTIVE LANGUAGE SWITCHER ─── */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleLanguageChange("ar")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lang === "ar"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="العربية"
              >
                <span>🇸🇦</span>
                <span className="hidden sm:inline">عربية</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lang === "en"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("ur")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lang === "ur"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="اردو"
              >
                <span>🇵🇰</span>
                <span className="hidden sm:inline">اردو</span>
              </button>
            </div>

            {/* ─── LIVE STATUS PILL ─── */}
            {hasUnsavedChanges ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{t.unsaved_changes}</span>
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="text-[11px] underline text-amber-900 hover:text-rose-700 font-bold mr-1 cursor-pointer"
                >
                  {t.undo_changes}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{t.all_saved}</span>
              </div>
            )}

            {/* ─── QUICK MODAL PREVIEW BUTTON ─── */}
            <button
              type="button"
              onClick={() => setQuickPreviewOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-all border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
              title={t.quick_preview}
            >
              <IconPreview className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">{t.quick_preview}</span>
            </button>

            {/* ─── VIEW LIVE MAIN PORTAL BUTTON ─── */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-all border border-blue-200/80 shadow-xs flex items-center gap-1.5"
              title="Open the main Arabic verification portal in a new tab"
            >
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">{t.preview_btn}</span>
            </Link>

            {/* ─── PRIMARY SAVE BUTTON WITH HOTKEY ─── */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`px-4.5 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                hasUnsavedChanges
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 ring-2 ring-emerald-400"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
              }`}
              title={t.shortcut_hint}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.saving_btn}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t.save_btn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ MAIN CONTENT BODY ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── QUICK METRIC OVERVIEW CARDS ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Metric 1: Facility Info */}
          <div
            onClick={() => setActiveTab("document")}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.stats_document}</span>
              <span className="text-xs text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                {isRtl ? "←" : "→"}
              </span>
            </div>
            <p className="text-sm font-black text-slate-900 truncate">
              {config.facilityName}
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">
              #{config.requestNumber}
            </p>
          </div>

          {/* Metric 2: Button 1 Status */}
          <div
            onClick={() => setActiveTab("buttons")}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-400 block mb-2">{t.stats_btn1}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <p className="text-xs font-black text-slate-800 truncate">
                {config.backButton.actionType === "file" && config.backButton.fileUrl
                  ? t.status_file
                  : config.backButton.url && config.backButton.url !== "#"
                  ? t.status_link
                  : t.status_default}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {config.backButton.label || "رجوع"}
            </p>
          </div>

          {/* Metric 3: Button 2 Status */}
          <div
            onClick={() => setActiveTab("buttons")}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-400 block mb-2">{t.stats_btn2}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <p className="text-xs font-black text-slate-800 truncate">
                {config.verifyAgainButton.actionType === "file"
                  ? t.status_file
                  : config.verifyAgainButton.actionType === "link"
                  ? t.status_link
                  : t.status_animation}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {config.verifyAgainButton.label || "إعادة التحقق"}
            </p>
          </div>

          {/* Metric 4: Button 3 (Download) Status */}
          <div
            onClick={() => setActiveTab("buttons")}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-emerald-800 block mb-2">{t.stats_btn3}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <p className="text-xs font-black text-emerald-950 truncate">
                {config.downloadButton.actionType === "file" && config.downloadButton.fileUrl
                  ? `${t.status_file} (${formatFileSize(config.downloadButton.fileSize)})`
                  : config.downloadButton.url && config.downloadButton.url !== "#"
                  ? t.status_link
                  : t.status_default}
              </p>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 truncate">
              {config.downloadButton.fileName || config.downloadButton.label || "تحميل"}
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 1: BUTTONS & FILES                                    */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "buttons" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* BUTTON 1: رجوع (Back) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-cyan-400" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-100">
                      {t.btn1_badge}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">1/3</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {t.btn1_title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    {t.btn1_desc}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_label}
                      </label>
                      <input
                        type="text"
                        value={config.backButton.label}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            backButton: { ...config.backButton, label: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_action_mode}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              backButton: { ...config.backButton, actionType: "link" },
                            })
                          }
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
                          onClick={() =>
                            setConfig({
                              ...config,
                              backButton: { ...config.backButton, actionType: "file" },
                            })
                          }
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
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                          />
                          {config.backButton.url && config.backButton.url !== "#" && (
                            <a
                              href={config.backButton.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0"
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
                          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <span className="text-xl">📄</span>
                                <div className="truncate">
                                  {config.backButton.fileUrl.includes("drive") && (
                                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1">
                                      <span>☁️</span>
                                      <span>Google Drive</span>
                                    </span>
                                  )}
                                  <p className="text-xs font-bold text-blue-950 truncate">
                                    {config.backButton.fileName || "document.pdf"}
                                  </p>
                                  <p className="text-[10px] text-blue-700">
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
                                  onClick={() => {
                                    setDrivePickerTarget("backButton");
                                    fetchDriveFiles();
                                  }}
                                  className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                                >
                                  📁 من Google Drive
                                </button>
                                <label htmlFor="file-input-back" className="text-[11px] text-slate-600 font-bold hover:underline cursor-pointer">{t.replace_file}</label>
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
                                  ? (lang === "en" ? "Uploading to Google Drive..." : lang === "ur" ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..." : "جاري الرفع إلى Google Drive...")
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
                                setDrivePickerTarget("backButton");
                                fetchDriveFiles();
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>☁️</span>
                              <span>{lang === "en" ? "Choose from Google Drive" : lang === "ur" ? "گوگل ڈرائیو سے فائل منتخب کریں" : "اختيار ملف من Google Drive"}</span>
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
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-100">
                      {t.btn2_badge}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">2/3</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {t.btn2_title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    {t.btn2_desc}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_label}
                      </label>
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_action_mode}
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              verifyAgainButton: {
                                ...config.verifyAgainButton,
                                actionType: "animation",
                              },
                            })
                          }
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
                          onClick={() =>
                            setConfig({
                              ...config,
                              verifyAgainButton: {
                                ...config.verifyAgainButton,
                                actionType: "link",
                              },
                            })
                          }
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
                          onClick={() =>
                            setConfig({
                              ...config,
                              verifyAgainButton: {
                                ...config.verifyAgainButton,
                                actionType: "file",
                              },
                            })
                          }
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
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none text-left"
                        />
                      </div>
                    )}

                    {config.verifyAgainButton.actionType === "file" && (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {t.file_attached}
                        </label>
                        {config.verifyAgainButton.fileUrl ? (
                          <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <span className="text-xl">📄</span>
                                <div className="truncate">
                                  {config.verifyAgainButton.fileUrl.includes("drive") && (
                                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1">
                                      <span>☁️</span>
                                      <span>Google Drive</span>
                                    </span>
                                  )}
                                  <p className="text-xs font-bold text-indigo-950 truncate">
                                    {config.verifyAgainButton.fileName || "document.pdf"}
                                  </p>
                                  <p className="text-[10px] text-indigo-700">
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
                                  onClick={() => {
                                    setDrivePickerTarget("verifyAgainButton");
                                    fetchDriveFiles();
                                  }}
                                  className="text-[11px] text-indigo-700 font-bold hover:underline cursor-pointer"
                                >
                                  📁 من Google Drive
                                </button>
                                <label htmlFor="file-input-verify" className="text-[11px] text-slate-600 font-bold hover:underline cursor-pointer">{t.replace_file}</label>
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
                                  ? (lang === "en" ? "Uploading to Google Drive..." : lang === "ur" ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..." : "جاري الرفع إلى Google Drive...")
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
                                setDrivePickerTarget("verifyAgainButton");
                                fetchDriveFiles();
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>☁️</span>
                              <span>{lang === "en" ? "Choose from Google Drive" : lang === "ur" ? "گوگل ڈرائیو سے فائل منتخب کریں" : "اختيار ملف من Google Drive"}</span>
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
              <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-7 shadow-lg shadow-emerald-500/5 flex flex-col justify-between relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-lg shadow-xs">
                      {t.btn3_badge}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">3/3</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">
                    {t.btn3_title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    {t.btn3_desc}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_label}
                      </label>
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.btn_action_mode}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              downloadButton: {
                                ...config.downloadButton,
                                actionType: "file",
                              },
                            })
                          }
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
                          onClick={() =>
                            setConfig({
                              ...config,
                              downloadButton: {
                                ...config.downloadButton,
                                actionType: "link",
                              },
                            })
                          }
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
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-2xl">📑</span>
                                <div className="truncate">
                                  {config.downloadButton.fileUrl.includes("drive") && (
                                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1 border border-emerald-200">
                                      <span>☁️</span>
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
                                  onClick={() => {
                                    setDrivePickerTarget("downloadButton");
                                    fetchDriveFiles();
                                  }}
                                  className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                                >
                                  📁 من Google Drive
                                </button>
                                <label htmlFor="file-input-download" className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">{t.replace_file}</label>
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
                                  ? (lang === "en" ? "Uploading to Google Drive..." : lang === "ur" ? "گوگل ڈرائیو پر اپلوڈ ہو رہا ہے..." : "جاري الرفع إلى Google Drive...")
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
                                setDrivePickerTarget("downloadButton");
                                fetchDriveFiles();
                              }}
                              className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>☁️</span>
                              <span>{lang === "en" ? "Choose from Google Drive" : lang === "ur" ? "گوگل ڈرائیو سے فائل منتخب کریں" : "اختيار ملف من Google Drive"}</span>
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
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left"
                          />
                          {config.downloadButton.url && config.downloadButton.url !== "#" && (
                            <a
                              href={config.downloadButton.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0"
                              title="Test link"
                            >
                              ↗
                            </a>
                          )}
                        </div>
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
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 2: EDIT DOCUMENT DATA                                 */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "document" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">{t.doc_title}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.doc_desc}</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
              >
                {saving ? t.saving_btn : t.save_btn}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Chamber Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.chamber_name}
                </label>
                <input
                  type="text"
                  value={config.chamberName}
                  onChange={(e) => setConfig({ ...config, chamberName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Facility Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.facility_name}
                </label>
                <input
                  type="text"
                  value={config.facilityName}
                  onChange={(e) => setConfig({ ...config, facilityName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Facility SubName */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.facility_sub_name}
                </label>
                <input
                  type="text"
                  value={config.facilitySubName || ""}
                  onChange={(e) => setConfig({ ...config, facilitySubName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Unified Number (700) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.unified_number}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.unifiedNumber}
                  onChange={(e) => setConfig({ ...config, unifiedNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Request Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.request_number}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.requestNumber}
                  onChange={(e) => setConfig({ ...config, requestNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.request_type}
                </label>
                <input
                  type="text"
                  value={config.requestType}
                  onChange={(e) => setConfig({ ...config, requestType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.applicant_name}
                </label>
                <input
                  type="text"
                  value={config.applicantName}
                  onChange={(e) => setConfig({ ...config, applicantName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.amount}
                </label>
                <input
                  type="text"
                  value={config.amount}
                  onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Creation Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.creation_date}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.creationDate}
                    onChange={(e) => setConfig({ ...config, creationDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.creation_time}
                  </label>
                  <input
                    type="text"
                    value={config.creationTime}
                    onChange={(e) => setConfig({ ...config, creationTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.expiry_date}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.expiryDate}
                    onChange={(e) => setConfig({ ...config, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.expiry_time}
                  </label>
                  <input
                    type="text"
                    value={config.expiryTime}
                    onChange={(e) => setConfig({ ...config, expiryTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Commercial Reg No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.commercial_reg_no}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.commercialRegNo}
                  onChange={(e) => setConfig({ ...config, commercialRegNo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Request Status & Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.request_status}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.requestStatus}
                    onChange={(e) => setConfig({ ...config, requestStatus: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="color"
                    value={config.statusColor || "#55dbdd"}
                    onChange={(e) => setConfig({ ...config, statusColor: e.target.value })}
                    className="w-12 h-11 p-1 rounded-xl border border-slate-200 cursor-pointer"
                    title={t.status_color}
                  />
                </div>
              </div>
            </div>

            {/* ─── DYNAMIC CUSTOM FIELDS SECTION ─── */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600 font-bold">✨</span>
                    <span>{t.custom_fields_title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.custom_fields_desc}</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <span>{t.add_field_btn}</span>
                </button>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
                <span className="font-bold text-slate-500 text-[11px]">{t.quick_presets}</span>
                {["المدينة", "رقم الآيبان (IBAN)", "البريد الإلكتروني", "رقم الهوية الوطنية", "الفرع التجاري", "حالة الدفع"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddPresetField(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-bold border border-slate-200/80 text-[11px] transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Custom fields list */}
              {(!config.customFields || config.customFields.length === 0) ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-500 mb-3">{t.no_custom_fields}</p>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-xs"
                  >
                    {t.add_field_btn}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {config.customFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all hover:bg-slate-100/60"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={t.field_label_placeholder}
                          value={field.label}
                          onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={t.field_value_placeholder}
                          value={field.value}
                          onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                        title="Remove Field"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 3: LIVE PREVIEW (عربي - EXACT VISITOR VIEW)            */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconPreview className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-black text-purple-950">{t.preview_title}</h3>
                  <p className="text-xs text-purple-800 mt-0.5">{t.preview_desc}</p>
                </div>
              </div>
              <Link
                href="/"
                target="_blank"
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 flex items-center gap-1.5"
              >
                <span>{t.preview_btn}</span>
                <span>↗</span>
              </Link>
            </div>

            {/* Arabic Document Card Replica */}
            <div dir="rtl" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg font-sans max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-7 bg-blue-600 rounded-sm"></span>
                  <h3 className="font-bold text-lg text-slate-800">{config.pageTitle}</h3>
                </div>
                <span className="px-5 py-1.5 bg-[#6ea8fe] text-white rounded text-xs font-bold">
                  {config.backButton.label || "رجوع"}
                </span>
              </div>

              <div className="text-center py-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-200">
                <p>خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونياً عبر بوابة الغرف</p>
              </div>

              <div className="py-6 max-w-md mx-auto text-center space-y-2 text-sm text-slate-800 leading-loose">
                <p><strong>اسم الغرفة : </strong><span>{config.chamberName}</span></p>
                <p><strong>اسم المنشأة : </strong><span>{config.facilityName}</span></p>
                {config.facilitySubName && <p><span>{config.facilitySubName}</span></p>}
                <p><strong>الرقم الموحد (700) : </strong><span className="font-mono">{config.unifiedNumber}</span></p>
                <p><strong>رقم الطلب : </strong><span className="font-mono text-base font-bold">{config.requestNumber}</span></p>
                <p><strong>نوع الطلب : </strong><span>{config.requestType}</span></p>
                <p><strong>اسم مقدم الطلب : </strong><span>{config.applicantName}</span></p>
                <p><strong>تاريخ ووقت الإنشاء : </strong><span className="font-mono">{config.creationDate} {config.creationTime}</span></p>
                <p><strong>مبلغ الطلب : </strong><span>{config.amount}</span></p>
                <p><strong>تاريخ الصلاحية : </strong><span className="font-mono">{config.expiryDate} {config.expiryTime}</span></p>
                <p><strong>رقم السجل التجاري : </strong><span className="font-mono">{config.commercialRegNo}</span></p>
                <p className="pt-2 text-base">
                  <strong>حالة الطلب : </strong>
                  <strong style={{ color: config.statusColor || "#55dbdd" }}>{config.requestStatus}</strong>
                </p>
                {/* Dynamically added custom fields in Arabic */}
                {config.customFields && config.customFields.length > 0 && config.customFields.map((f) => (
                  <p key={f.id} className="m-0" style={{ fontSize: "14.5px" }}>
                    <strong>{f.label} : </strong>
                    <span>{f.value}</span>
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 pb-6">
                <span className="px-6 py-2 bg-[#6ea8fe] text-white rounded font-bold text-xs">
                  {config.verifyAgainButton.label || "إعادة التحقق"}
                </span>
                <span className="px-8 py-2 bg-[#6ea8fe] text-white rounded font-bold text-xs">
                  {config.downloadButton.label || "تحميل"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 4: FOOTER & SOCIAL                                    */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">{t.footer_title}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.footer_desc}</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
              >
                {saving ? t.saving_btn : t.save_btn}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.support_phone}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.supportPhone}
                  onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.dev_label}
                </label>
                <input
                  type="text"
                  value={config.devLabel}
                  onChange={(e) => setConfig({ ...config, devLabel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.company_ar}
                </label>
                <input
                  type="text"
                  value={config.companyNameAr}
                  onChange={(e) => setConfig({ ...config, companyNameAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.company_en}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.companyNameEn}
                  onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 mb-3">
                  {t.social_title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({
                    skype: "Skype",
                    instagram: "Instagram",
                    youtube: "YouTube",
                    twitter: "Twitter / X",
                    facebook: "Facebook",
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {label} URL
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={(config.socialLinks as Record<string, string>)[key] || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            socialLinks: {
                              ...config.socialLinks,
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`https://${key}.com/...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 5: TIMERS & EFFECTS                                   */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">{t.settings_title}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.settings_desc}</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
              >
                {saving ? t.saving_btn : t.save_btn}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.portal_title}
                </label>
                <input
                  type="text"
                  value={config.portalTitle}
                  onChange={(e) => setConfig({ ...config, portalTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.loader_initial_ms}
                </label>
                <input
                  type="number"
                  step="500"
                  value={config.loaderDurationMs}
                  onChange={(e) =>
                    setConfig({ ...config, loaderDurationMs: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">{t.seconds_hint}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.loader_button_ms}
                </label>
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">{t.seconds_hint}</p>
              </div>

              <div className="col-span-1 md:col-span-2 pt-2">
                <Switch
                  checked={config.enableInitialLoader ?? true}
                  onChange={(v) =>
                    setConfig({ ...config, enableInitialLoader: v })
                  }
                  label={t.initial_loader_toggle}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════ FLOATING BOTTOM UNSAVED CHANGES DOCK ═══════════════ */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-slow max-w-xl w-[92%] sm:w-auto">
          <div className="bg-slate-900/95 text-white backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs sm:text-sm font-bold truncate">
                {t.unsaved_banner}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {t.undo_changes}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? t.saving_btn : t.save_btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
