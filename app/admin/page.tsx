"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig } from "@/lib/portal-types";
import { ADMIN_TRANSLATIONS, AdminLanguage } from "@/lib/admin-translations";

// ─────────────────────────────────────────────────────────
//  CRISP MODERN SVG ICONS
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
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

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconDeviceMobile({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function IconDeviceDesktop({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconTrash({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconDrive({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="currentColor">
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l16.3-28.2H0C0 50.7 1.3 52.8 2.6 55l4 6.85z" fill="#0066DA" />
      <path d="M43.65 25L27.35 53.2h32.7l16.3-28.2h-32.7z" fill="#00AC47" />
      <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7c1.3-2.2 2.6-4.3 2.6-6.4H57.25l16.3 23.4z" fill="#EA4335" />
      <path d="M43.65 25L59.95 0H27.35l-7.9 13.7c-1.3 2.2-2.6 4.3-2.6 6.4h32.7l-5.9 4.9z" fill="#00832D" />
      <path d="M59.95 0h-32.6l16.3 28.2 16.3-28.2z" fill="#2684FC" />
      <path d="M84.65 59.8L70.95 36.1 57.25 53.2 73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l7.9-13.7z" fill="#FFBA00" />
    </svg>
  );
}

function IconDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IconRefresh({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconEye({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

type DriveItem = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  downloadUrl: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  iconLink?: string;
};

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

// ─────────────────────────────────────────────────────────
//  MAIN ADMIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [config, setConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);
  const [initialConfig, setInitialConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBtn, setUploadingBtn] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    link?: string;
    linkLabel?: string;
  } | null>(null);

  // Language for admin panel (persisted in localStorage)
  const [lang, setLang] = useState<AdminLanguage>("ar");
  const [activeTab, setActiveTab] = useState<"dashboard" | "buttons" | "document" | "preview" | "footer" | "settings">("dashboard");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isDragOverBtn, setIsDragOverBtn] = useState<string | null>(null);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");

  // ─── GOOGLE DRIVE FILE PICKER & MANAGER STATE ───
  const [drivePickerTarget, setDrivePickerTarget] = useState<"backButton" | "verifyAgainButton" | "downloadButton" | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDriveFiles, setLoadingDriveFiles] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<DriveItem | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [driveSearchQuery, setDriveSearchQuery] = useState("");
  const [driveFileFilter, setDriveFileFilter] = useState<"all" | "pdf" | "images" | "docs">("all");
  const [driveViewMode, setDriveViewMode] = useState<"grid" | "list">("grid");
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveQuotaGB, setDriveQuotaGB] = useState<number>(15);
  const [driveSortBy, setDriveSortBy] = useState<"newest" | "oldest" | "size_desc" | "size_asc" | "name_asc">("newest");
  const [isDragOverDashboard, setIsDragOverDashboard] = useState<boolean>(false);
  const [quotaDropdownOpen, setQuotaDropdownOpen] = useState<boolean>(false);
  const dashboardUploadInputRef = useRef<HTMLInputElement>(null);

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
      const savedQuota = localStorage.getItem("admin_drive_quota_gb");
      if (savedQuota && !isNaN(parseFloat(savedQuota))) {
        setDriveQuotaGB(parseFloat(savedQuota));
      }
      const savedSort = localStorage.getItem("admin_drive_sort_by") as any;
      if (savedSort) {
        setDriveSortBy(savedSort);
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
    fetchDriveFiles();
  }, [fetchDriveFiles]);

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
    showToast(
      lang === "en" ? "Changes discarded" : lang === "ur" ? "تبدیلیاں واپس لے لی گئیں" : "تم التراجع عن التعديلات",
      "info"
    );
  };

  // Keyboard shortcut Ctrl+S & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setDrawerSearch("");
        setQuickPreviewOpen(false);
        setDrivePickerTarget(null);
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

  // Dynamic custom document fields handlers
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
    showToast(
      lang === "en" ? "File removed" : lang === "ur" ? "فائل ہٹا دی گئی" : "تم حذف الملف",
      "info"
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "0 " + (lang === "en" ? "KB" : lang === "ur" ? "کے بی" : "كيلوبايت");
    if (bytes < 1024) return bytes + (lang === "en" ? " B" : lang === "ur" ? " بائٹس" : " بايت");
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + (lang === "en" ? " KB" : lang === "ur" ? " کے بی" : " كيلوبايت");
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + (lang === "en" ? " MB" : lang === "ur" ? " ایم بی" : " ميجابايت");
    if (bytes < 1024 * 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + (lang === "en" ? " GB" : lang === "ur" ? " جی بی" : " جيجابايت");
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + (lang === "en" ? " TB" : lang === "ur" ? " ٹی بی" : " تيرابايت");
  };

  // Upload file directly to Google Drive
  const uploadFileToDrive = async (file: File) => {
    setDriveUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          lang === "en"
            ? `File "${file.name}" uploaded to Google Drive successfully!`
            : lang === "ur"
            ? `فائل "${file.name}" گوگل ڈرائیو پر اپلوڈ ہو گئی!`
            : `تم رفع الملف "${file.name}" إلى Google Drive بنجاح!`,
          "success"
        );
        await fetchDriveFiles();
      } else {
        showToast(data.error || t.save_error, "error");
      }
    } catch (err) {
      console.error("Dashboard upload error:", err);
      showToast(t.save_error, "error");
    } finally {
      setDriveUploading(false);
    }
  };

  const handleDashboardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFileToDrive(file);
    if (e.target) e.target.value = "";
  };

  const handleDashboardDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverDashboard(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFileToDrive(file);
    }
  };

  const handleDriveQuotaChange = (newQuota: number) => {
    setDriveQuotaGB(newQuota);
    setQuotaDropdownOpen(false);
    try {
      localStorage.setItem("admin_drive_quota_gb", String(newQuota));
    } catch {
      // ignore
    }
    showToast(
      lang === "en"
        ? `Cloud quota set to ${newQuota} GB`
        : lang === "ur"
        ? `کلاؤڈ گنجائش ${newQuota} جی بی منتخب کی گئی`
        : `تم تحديد سعة السحابة إلى ${newQuota} جيجابايت`,
      "info"
    );
  };

  const handleDriveSortChange = (newSort: "newest" | "oldest" | "size_desc" | "size_asc" | "name_asc") => {
    setDriveSortBy(newSort);
    try {
      localStorage.setItem("admin_drive_sort_by", newSort);
    } catch {
      // ignore
    }
  };

  // Delete file permanently from Google Drive
  const handleDeleteDriveFile = async (file: DriveItem) => {
    setDeletingFileId(file.id);
    try {
      const res = await fetch(
        `/api/drive?fileId=${file.id}&fileName=${encodeURIComponent(file.name)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));
        setFileToDelete(null);
        showToast(t.drive_delete_success, "success");
      } else {
        showToast(data.error || t.drive_delete_error, "error");
      }
    } catch (err) {
      console.error("Delete drive file error:", err);
      showToast(t.drive_delete_error, "error");
    } finally {
      setDeletingFileId(null);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(t.drive_copied, "success");
    } catch {
      showToast(url, "info");
    }
  };

  // Assign to portal download button
  const handleAssignToDownloadButton = (file: DriveItem) => {
    setConfig((prev) => ({
      ...prev,
      downloadButton: {
        ...prev.downloadButton,
        actionType: "file",
        fileUrl: file.downloadUrl,
        fileName: file.name,
        fileSize: file.size ? parseInt(file.size, 10) : undefined,
      },
    }));
    showToast(t.drive_file_used_success, "success");
  };

  // ─── STORAGE AND METRIC CALCULATIONS ───
  const totalStorageBytes = useMemo(() => {
    return driveFiles.reduce((acc, f) => acc + (f.size ? parseInt(f.size, 10) || 0 : 0), 0);
  }, [driveFiles]);

  const totalQuotaBytes = useMemo(() => {
    return driveQuotaGB * 1024 * 1024 * 1024;
  }, [driveQuotaGB]);

  const freeStorageBytes = useMemo(() => {
    return Math.max(0, totalQuotaBytes - totalStorageBytes);
  }, [totalQuotaBytes, totalStorageBytes]);

  const usedPercentage = useMemo(() => {
    if (totalQuotaBytes <= 0) return 0;
    return Math.min(100, (totalStorageBytes / totalQuotaBytes) * 100);
  }, [totalStorageBytes, totalQuotaBytes]);

  const freePercentage = useMemo(() => {
    return Math.max(0, 100 - usedPercentage);
  }, [usedPercentage]);

  // Breakdown by file types
  const storageBreakdown = useMemo(() => {
    let pdfBytes = 0, pdfCount = 0;
    let imgBytes = 0, imgCount = 0;
    let docBytes = 0, docCount = 0;

    driveFiles.forEach((f) => {
      const size = f.size ? parseInt(f.size, 10) || 0 : 0;
      const isPdf = f.mimeType.includes("pdf") || f.name.toLowerCase().endsWith(".pdf");
      const isImg = f.mimeType.includes("image") || /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(f.name);

      if (isPdf) {
        pdfBytes += size;
        pdfCount += 1;
      } else if (isImg) {
        imgBytes += size;
        imgCount += 1;
      } else {
        docBytes += size;
        docCount += 1;
      }
    });

    return {
      pdfBytes,
      pdfCount,
      imgBytes,
      imgCount,
      docBytes,
      docCount,
    };
  }, [driveFiles]);

  // Sorted and filtered files list
  const filteredDriveFiles = useMemo(() => {
    const list = driveFiles.filter((f) => {
      const matchesSearch =
        !driveSearchQuery ||
        f.name.toLowerCase().includes(driveSearchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (driveFileFilter === "all") return true;
      if (driveFileFilter === "pdf")
        return f.mimeType.includes("pdf") || f.name.toLowerCase().endsWith(".pdf");
      if (driveFileFilter === "images")
        return (
          f.mimeType.includes("image") ||
          /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(f.name)
        );
      if (driveFileFilter === "docs")
        return (
          !f.mimeType.includes("pdf") &&
          !f.mimeType.includes("image") &&
          !f.name.toLowerCase().endsWith(".pdf")
        );
      return true;
    });

    return [...list].sort((a, b) => {
      if (driveSortBy === "newest") {
        const timeA = a.createdTime ? new Date(a.createdTime).getTime() : 0;
        const timeB = b.createdTime ? new Date(b.createdTime).getTime() : 0;
        return timeB - timeA;
      }
      if (driveSortBy === "oldest") {
        const timeA = a.createdTime ? new Date(a.createdTime).getTime() : 0;
        const timeB = b.createdTime ? new Date(b.createdTime).getTime() : 0;
        return timeA - timeB;
      }
      if (driveSortBy === "size_desc") {
        const sizeA = a.size ? parseInt(a.size, 10) || 0 : 0;
        const sizeB = b.size ? parseInt(b.size, 10) || 0 : 0;
        return sizeB - sizeA;
      }
      if (driveSortBy === "size_asc") {
        const sizeA = a.size ? parseInt(a.size, 10) || 0 : 0;
        const sizeB = b.size ? parseInt(b.size, 10) || 0 : 0;
        return sizeA - sizeB;
      }
      if (driveSortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [driveFiles, driveSearchQuery, driveFileFilter, driveSortBy]);

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
      className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] text-slate-800 font-sans pb-32 selection:bg-blue-600 selection:text-white antialiased"
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
            className={`px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 border text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-all ${
              toast.link ? "cursor-pointer hover:scale-[1.01]" : ""
            } ${
              toast.type === "success"
                ? "bg-emerald-600/95 text-white border-emerald-400/80"
                : toast.type === "error"
                ? "bg-rose-600/95 text-white border-rose-400/80"
                : "bg-blue-600/95 text-white border-blue-400/80"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs">
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
                <span>
                  {toast.linkLabel ||
                    (lang === "en" ? "Open Drive ↗" : lang === "ur" ? "گوگل ڈرائیو کھولیں ↗" : "فتح Google Drive ↗")}
                </span>
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

            <div className="p-6 overflow-y-auto font-sans bg-slate-50/50">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl mx-auto">
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
                    <strong style={{ color: config.statusColor || "#32c5cb" }}>{config.requestStatus}</strong>
                  </p>
                  {/* Dynamic custom fields */}
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
                className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 cursor-pointer"
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
          className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setDrivePickerTarget(null)}
        >
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4.5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <IconDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    {lang === "en" ? "Google Drive Cloud Files" : lang === "ur" ? "گوگل ڈرائیو کلاؤڈ فائلیں" : "ملفات Google Drive السحابية"}
                  </h3>
                  <p className="text-xs text-blue-200/90 font-medium">
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
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="تحديث قائمة الملفات"
                >
                  <span className={loadingDriveFiles ? "animate-spin inline-block" : ""}>🔄</span>
                  <span>{lang === "en" ? "Refresh" : lang === "ur" ? "ریفریش" : "تحديث"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrivePickerTarget(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans bg-slate-50/50">
              {loadingDriveFiles ? (
                <div className="py-14 text-center text-slate-500">
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold">
                    {lang === "en"
                      ? "Fetching files from Google Drive..."
                      : lang === "ur"
                      ? "گوگل ڈرائیو سے فائلیں لائی جا رہی ہیں..."
                      : "جاري استرداد الملفات من Google Drive..."}
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
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
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
                      ? `Found ${driveFiles.length} file(s) in Google Drive folder:`
                      : lang === "ur"
                      ? `گوگل ڈرائیو میں ${driveFiles.length} فائلیں موجود ہیں:`
                      : `تم العثور على ${driveFiles.length} ملف في Google Drive:`}
                  </div>
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3 bg-white shadow-2xs"
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
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
              >
                {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ GOOGLE DRIVE FILE DELETE CONFIRMATION MODAL ═══════════════ */}
      {fileToDelete && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => !deletingFileId && setFileToDelete(null)}
          />

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden z-10 animate-fade-in"
          >
            <div className="p-6 sm:p-7 text-center">
              {/* Warning Danger Icon */}
              <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
                ⚠️
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                {t.drive_delete_confirm_title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t.drive_delete_confirm_desc}
              </p>

              {/* Target File Info Box */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-start flex items-center gap-3 mb-6">
                <span className="text-2xl">
                  {fileToDelete.mimeType.includes("pdf") ? "📄" : fileToDelete.mimeType.includes("image") ? "🖼️" : "📁"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {fileToDelete.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {fileToDelete.size ? formatFileSize(parseInt(fileToDelete.size, 10)) : "Google Drive File"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!!deletingFileId}
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t.drive_delete_cancel_btn}
                </button>

                <button
                  type="button"
                  disabled={!!deletingFileId}
                  onClick={() => handleDeleteDriveFile(fileToDelete)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs shadow-lg shadow-rose-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingFileId ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === "en" ? "Deleting..." : lang === "ur" ? "ڈیلیٹ ہو رہا ہے..." : "جاري الحذف..."}</span>
                    </>
                  ) : (
                    <>
                      <IconTrash className="w-4 h-4" />
                      <span>{t.drive_delete_confirm_btn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SLIDE-OUT NAVIGATION DRAWER (INTERACTIVE & ATTRACTIVE) ═══════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999]">
          {/* Backdrop with soft blur */}
          <div
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity cursor-pointer drawer-backdrop-anim"
            onClick={() => {
              setDrawerOpen(false);
              setDrawerSearch("");
            }}
          />

          {/* Drawer Panel */}
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed inset-y-0 ${
              isRtl ? "right-0 drawer-panel-rtl border-l" : "left-0 drawer-panel-ltr border-r"
            } w-full max-w-[400px] sm:max-w-[450px] bg-white shadow-2xl flex flex-col z-[100000] border-slate-200 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Gradient & Ambient Background */}
            <div className="relative p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shrink-0 shadow-lg overflow-hidden">
              {/* Decorative radial orbs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/30 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/30 shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                        {lang === "en" ? "Control Panel Menu" : lang === "ur" ? "کنٹرول پینل مینیو" : "قائمة لوحة التحكم"}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/30 border border-blue-400/40 text-blue-200 uppercase">
                        PRO
                      </span>
                    </div>
                    <p className="text-xs text-blue-200/80 font-medium mt-0.5">
                      {lang === "en"
                        ? "Quick access & instant screen navigation"
                        : lang === "ur"
                        ? "تمام ترتیبات اور اسکرینز تک فوری رسائی"
                        : "انتقال فوري وتعديل مباشر لجميع الأقسام"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setDrawerSearch("");
                  }}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer hover:rotate-90"
                  title={lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
                >
                  ✕
                </button>
              </div>

              {/* Mini Status Card inside header */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100/90 font-medium">
                <div className="flex items-center gap-2 truncate max-w-[240px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: config.statusColor || "#32c5cb" }}
                  />
                  <span className="truncate font-bold text-white">
                    {config.facilityName}
                  </span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/10 font-bold shrink-0">
                  #{config.requestNumber}
                </span>
              </div>
            </div>

            {/* Interactive Search Bar inside Drawer */}
            <div className="p-3 bg-slate-50 border-b border-slate-200/80 shrink-0">
              <div className="relative">
                <span className="absolute inset-y-0 start-3 flex items-center text-slate-400 pointer-events-none text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder={
                    lang === "en"
                      ? "Search section or field..."
                      : lang === "ur"
                      ? "سیکشن یا فیلڈ تلاش کریں..."
                      : "ابحث عن أي قسم أو بيان..."
                  }
                  className="w-full ps-8 pe-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                />
                {drawerSearch && (
                  <button
                    type="button"
                    onClick={() => setDrawerSearch("")}
                    className="absolute inset-y-0 end-2.5 flex items-center text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-slate-50/30">
              {/* Category 1: Main Sections */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {lang === "en" ? "Main Sections" : lang === "ur" ? "بنیادی سیکشنز" : "الأقسام والشاشات الرئيسية"}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    6 {lang === "en" ? "Sections" : lang === "ur" ? "سیکشنز" : "شاشات"}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Tab 0: Main Dashboard & Google Drive Files */}
                  {(!drawerSearch ||
                    t.tab_dashboard.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "رئيسية درايف لوحة تحكم dashboard drive files storage google".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("dashboard");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "dashboard"
                          ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-blue-400 text-blue-950 font-black shadow-xs ring-1 ring-blue-500"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "dashboard"
                              ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <IconDrive className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_dashboard}</span>
                            {activeTab === "dashboard" ? (
                              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            ) : (
                              <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded-full font-mono">
                                {driveFiles.length} {lang === "en" ? "files" : lang === "ur" ? "فائلیں" : "ملفات"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "Google Drive cloud files, upload, preview & deletion"
                              : lang === "ur"
                              ? "گوگل ڈرائیو فائل منیجر، اپلوڈ، پریویو اور ڈیلیٹ"
                              : "إدارة واستعراض وحذف ملفات Google Drive السحابية"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}

                  {/* Tab 1: Buttons & Files */}
                  {(!drawerSearch ||
                    t.tab_buttons.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "أزرار ملفات buttons files back verify download".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("buttons");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "buttons"
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-950 font-black shadow-xs ring-1 ring-blue-400"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "buttons"
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <IconButtons className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_buttons}</span>
                            {activeTab === "buttons" && (
                              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "Back, Verify Again, and Download buttons & files"
                              : lang === "ur"
                              ? "واپسی، دوبارہ تصدیق اور ڈاؤن لوڈ بٹن اور فائلیں"
                              : "أزرار العودة، التحقق، وزر التحميل وربط الملفات"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}

                  {/* Tab 2: Document Details */}
                  {(!drawerSearch ||
                    t.tab_document.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "وثيقة بيانات document data facility chamber".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("document");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "document"
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-400"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "document"
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          <IconDocument className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_document}</span>
                            {activeTab === "document" && (
                              <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "Chamber, facility, request #, dates, status"
                              : lang === "ur"
                              ? "کمرہ، ادارہ، درخواست نمبر، تاریخیں اور حالت"
                              : "اسم الغرفة، المنشأة، الأرقام، التواريخ، والحالة"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}

                  {/* Tab 3: Live Preview */}
                  {(!drawerSearch ||
                    t.tab_preview.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "معاينة preview live mobile desktop".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("preview");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "preview"
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-950 font-black shadow-xs ring-1 ring-purple-400"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "preview"
                              ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          <IconPreview className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_preview}</span>
                            {activeTab === "preview" && (
                              <span className="text-[9px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "Interactive live portal preview screen"
                              : lang === "ur"
                              ? "پورٹل کی براہ راست انٹرایکٹو اسکرین"
                              : "معاينة شكل البوابة الحية بشكل تفاعلي ومباشر"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}

                  {/* Tab 4: Footer & Support */}
                  {(!drawerSearch ||
                    t.tab_footer.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "دعم تواصل فوتر support footer phone social".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("footer");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "footer"
                          ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950 font-black shadow-xs ring-1 ring-amber-400"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "footer"
                              ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <IconSupport className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_footer}</span>
                            {activeTab === "footer" && (
                              <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "Company name, phone number, social links"
                              : lang === "ur"
                              ? "کمپنی کا نام، فون نمبر اور سوشل لنکس"
                              : "اسم الشركة، رقم الهاتف، وروابط التواصل"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}

                  {/* Tab 5: Settings & Timers */}
                  {(!drawerSearch ||
                    t.tab_settings.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "إعدادات تحميل settings timers animation loader".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("settings");
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] ${
                        activeTab === "settings"
                          ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 text-indigo-950 font-black shadow-xs ring-1 ring-indigo-400"
                          : "bg-white hover:bg-slate-50/80 hover:border-slate-300 border-slate-200/80 text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            activeTab === "settings"
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          <IconSettings className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.tab_settings}</span>
                            {activeTab === "settings" && (
                              <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                                {lang === "en" ? "Active" : lang === "ur" ? "کھلا ہوا" : "نشط"}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "GIF loaders, animation durations, timers"
                              : lang === "ur"
                              ? "لوڈر اینیمیشن، انتظار کا وقت اور ترتیبات"
                              : "شاشات التحميل المتحركة، فترات الانتظار، والإعدادات"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                        {isRtl ? "←" : "→"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Category 2: Direct Jump Grid with Live Snippets */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-2">
                  {lang === "en" ? "Quick Field Jump" : lang === "ur" ? "فیلڈز تک فوری رسائی" : "الانتقال المباشر للحقول"}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Jump 0: Google Drive Files */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("dashboard");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-blue-200 bg-blue-50/40 hover:border-blue-500 hover:bg-blue-100/50 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95 col-span-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <IconDrive className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-xs text-blue-950 group-hover:text-blue-700 truncate">
                          {t.tab_dashboard}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                        {driveFiles.length} {lang === "en" ? "Files" : lang === "ur" ? "فائلیں" : "ملفات"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {formatFileSize(totalStorageBytes)} {t.drive_storage_used} • Google Drive Cloud
                    </span>
                  </button>

                  {/* Jump 1: Chamber */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-sm">
                        🏛️
                      </span>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                        {lang === "en" ? "Chamber & Facility" : lang === "ur" ? "کمرہ اور ادارہ" : "اسم الغرفة والمنشأة"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {config.facilityName}
                    </span>
                  </button>

                  {/* Jump 2: Request Number */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-sm">
                        🔢
                      </span>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 truncate">
                        {lang === "en" ? "Request #" : lang === "ur" ? "درخواست نمبر" : "رقم الطلب والموحد"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate block">
                      #{config.requestNumber}
                    </span>
                  </button>

                  {/* Jump 3: Dates */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-sm">
                        📅
                      </span>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-700 truncate">
                        {lang === "en" ? "Dates & Times" : lang === "ur" ? "تاریخ اور اوقات" : "التواريخ والأوقات"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate block">
                      {config.creationDate}
                    </span>
                  </button>

                  {/* Jump 4: Status */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: config.statusColor || "#32c5cb" }}
                      />
                      <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 truncate">
                        {lang === "en" ? "Status & Color" : lang === "ur" ? "حالت اور رنگ" : "حالة الطلب ولونه"}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-bold truncate block"
                      style={{ color: config.statusColor || "#32c5cb" }}
                    >
                      {config.requestStatus}
                    </span>
                  </button>

                  {/* Jump 5: Custom Fields */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-sm">
                        ✨
                      </span>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 truncate">
                        {lang === "en" ? "Custom Fields" : lang === "ur" ? "اضافی فیلڈز" : "الحقول المخصصة"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {config.customFields?.length || 0} {lang === "en" ? "fields" : lang === "ur" ? "فیلڈز" : "حقول"}
                    </span>
                  </button>

                  {/* Jump 6: Attached PDF Files */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("buttons");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-sm">
                        📁
                      </span>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                        {lang === "en" ? "Cloud Files" : lang === "ur" ? "پی ڈی ایف فائلز" : "ملفات الأزرار والـ PDF"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {config.downloadButton.fileName || "Google Drive"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Category 3: Quick Action Hub inside Drawer */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-2">
                  {lang === "en" ? "Quick Actions Hub" : lang === "ur" ? "فوری کنٹرولز" : "مركز الإجراءات السريعة"}
                </span>

                <div className="space-y-2.5">
                  {/* Save button inside drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSave();
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    disabled={saving}
                    className={`w-full py-3 px-4 rounded-2xl text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 ${
                      hasUnsavedChanges
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25 ring-2 ring-emerald-400"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
                    }`}
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IconCheck className="w-4 h-4" />
                    )}
                    <span>{t.save_btn}</span>
                    {hasUnsavedChanges && (
                      <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Open live site in new tab */}
                    <Link
                      href="/"
                      target="_blank"
                      className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5 no-underline transition-colors shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="truncate">{t.preview_btn}</span>
                    </Link>

                    {/* Quick Modal Preview */}
                    <button
                      type="button"
                      onClick={() => {
                        setQuickPreviewOpen(true);
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-bold text-xs border border-purple-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      <IconPreview className="w-3.5 h-3.5" />
                      <span className="truncate">{t.quick_preview}</span>
                    </button>
                  </div>

                  {/* Reset defaults inside drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setDrawerOpen(false);
                      setDrawerSearch("");
                    }}
                    className="w-full py-2 px-3 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold border border-rose-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>{t.reset_btn}</span>
                  </button>

                  {/* Language switch inside drawer */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <span className="font-bold text-slate-600 text-[11px]">
                      {lang === "en" ? "Language" : lang === "ur" ? "زبان منتخب کریں" : "لغة اللوحة"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("ar")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          lang === "ar" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        🇸🇦 عربية
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("en")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          lang === "en" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        🇬🇧 EN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("ur")}
                        className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          lang === "ur" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        🇵🇰 اردو
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer with Quick Shortcuts */}
            <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">
                  Esc
                </span>
                <span>{lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}</span>
                <span className="text-slate-300">•</span>
                <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">
                  Ctrl+S
                </span>
                <span>{lang === "en" ? "Save" : lang === "ur" ? "محفوظ کریں" : "حفظ"}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setDrawerSearch("");
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black cursor-pointer transition-colors shadow-2xs"
              >
                {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🌟 ULTRA-CLEAN MODERN STICKY HEADER                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & System Status */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Main Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ring-2 ring-blue-400/30"
              title={lang === "en" ? "Open Navigation Drawer" : lang === "ur" ? "مینیو دراز کھولیں" : "فتح القائمة الجانبية (دراز)"}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>
                {lang === "en" ? "Menu (Drawer)" : lang === "ur" ? "مینیو (دراز)" : "القائمة (دراز)"}
              </span>
            </button>

            {/* Active Screen Indicator (Clickable to open Drawer) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-all shadow-2xs"
              title={lang === "en" ? "Current screen - Click to change via drawer" : lang === "ur" ? "موجودہ اسکرین - دراز کھولنے کیلئے کلک کریں" : "القسم المعروض - انقر للتغيير من القائمة"}
            >
              <span className="text-slate-400 font-medium">
                {lang === "en" ? "Screen:" : lang === "ur" ? "سیکشن:" : "القسم:"}
              </span>
              <span className="font-black text-blue-700 flex items-center gap-1.5">
                {activeTab === "dashboard" && (
                  <>
                    <IconDrive className="w-4 h-4 text-blue-600" />
                    <span>{t.tab_dashboard}</span>
                  </>
                )}
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
            <div className="relative group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-base shrink-0">
                ⚡
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-slate-900 truncate tracking-tight">
                  {t.title}
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  {t.badge}
                </span>

                {/* Live server pill */}
                <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.system_active}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 truncate font-medium mt-0.5">
                <span className="font-bold text-slate-700 truncate max-w-[180px] sm:max-w-[240px]">
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
            {/* Interactive Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleLanguageChange("ar")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
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
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  lang === "en"
                    ? "bg-white text-blue-700 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">EN</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("ur")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
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

            {/* Unsaved changes status indicator */}
            {hasUnsavedChanges ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="hidden md:inline">{t.unsaved_changes}</span>
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="text-[11px] underline text-amber-900 hover:text-rose-700 font-bold mr-1 cursor-pointer"
                >
                  {t.undo_changes}
                </button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{t.all_saved}</span>
              </div>
            )}

            {/* Quick Modal Preview */}
            <button
              type="button"
              onClick={() => setQuickPreviewOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 transition-all border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title={t.quick_preview}
            >
              <IconPreview className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">{t.quick_preview}</span>
            </button>

            {/* View Live Portal Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-all border border-blue-200/80 shadow-2xs flex items-center gap-1.5"
              title="Open public portal in new tab"
            >
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">{t.preview_btn}</span>
            </Link>

            {/* Primary Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 ${
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
                  <IconCheck className="w-4 h-4" />
                  <span>{t.save_btn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ MAIN CONTENT BODY ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ─── QUICK METRIC OVERVIEW CARDS (CLICKABLE JUMP) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Metric 1: Facility Info */}
          <div
            onClick={() => setActiveTab("document")}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
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

          {/* Metric 2: Google Drive Storage & Files */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className={`p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all cursor-pointer group ${
              activeTab === "dashboard"
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 ring-2 ring-blue-300"
                : "bg-white border-slate-200/80 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.tab_dashboard}</span>
              <span className="text-xs text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                {isRtl ? "←" : "→"}
              </span>
            </div>
            <p className="text-sm font-black text-slate-900 truncate flex items-center gap-1.5">
              <IconDrive className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{driveFiles.length} {lang === "en" ? "Files in Drive" : lang === "ur" ? "ڈرائیو فائلز" : "ملفات Drive"}</span>
            </p>
            <div className="flex items-center justify-between text-xs font-mono mt-1 gap-1">
              <span className="text-indigo-600 font-bold truncate">
                {formatFileSize(totalStorageBytes)} {lang === "en" ? "used" : lang === "ur" ? "کور ہوا" : "مستخدم"}
              </span>
              <span className="text-emerald-600 font-bold truncate">
                {formatFileSize(freeStorageBytes)} {lang === "en" ? "free" : lang === "ur" ? "باقی" : "متبقي"}
              </span>
            </div>
          </div>

          {/* Metric 3: Button 2 Status */}
          <div
            onClick={() => setActiveTab("buttons")}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
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

          {/* Metric 4: Button 3 Status */}
          <div
            onClick={() => setActiveTab("buttons")}
            className="bg-gradient-to-br from-emerald-50 to-teal-50/80 p-4 rounded-2xl border border-emerald-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
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
        {/* TAB 0: MAIN DASHBOARD & GOOGLE DRIVE FILE MANAGER         */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 1. Hero Cloud Status & Management Header */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
              {/* Ambient Glowing Radial Orbs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl -mr-28 -mt-28 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-white/15 flex items-center justify-center shrink-0 shadow-lg">
                    <IconDrive className="w-9 h-9" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                        {t.dashboard_title}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/25 border border-blue-400/30 text-blue-200">
                        CLOUD v3
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
                      {t.dashboard_desc}
                    </p>

                    <div className="flex items-center gap-3 mt-3 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {t.drive_cloud_status}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        Folder: 1x_l6AuXh...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  {/* Hidden file input for dashboard upload */}
                  <input
                    ref={dashboardUploadInputRef}
                    type="file"
                    onChange={handleDashboardUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx,.xml"
                  />

                  {/* Refresh Files Button */}
                  <button
                    type="button"
                    onClick={fetchDriveFiles}
                    disabled={loadingDriveFiles}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
                    title={t.drive_refresh_btn}
                  >
                    <IconRefresh className={`w-4 h-4 ${loadingDriveFiles ? "animate-spin text-blue-400" : ""}`} />
                    <span>{t.drive_refresh_btn}</span>
                  </button>

                  {/* Upload File to Drive Button */}
                  <button
                    type="button"
                    onClick={() => dashboardUploadInputRef.current?.click()}
                    disabled={driveUploading}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95 ring-2 ring-white/20"
                  >
                    {driveUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t.drive_uploading}</span>
                      </>
                    ) : (
                      <>
                        <IconCloudUpload className="w-4 h-4" />
                        <span>{t.drive_upload_btn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Interactive Storage & Cloud Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Covered / Used Storage */}
              <div className="bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 rounded-2xl border border-indigo-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    {t.drive_storage_used_label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {usedPercentage < 0.01 && usedPercentage > 0 ? "< 0.01%" : `${usedPercentage.toFixed(2)}%`}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                  {formatFileSize(totalStorageBytes)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2">
                  <span>
                    {driveFiles.length} {lang === "en" ? "Files Stored" : lang === "ur" ? "فائلیں کلاؤڈ میں محفوظ" : "ملف مخزن في السحابة"}
                  </span>
                  <span className="font-mono text-indigo-600 font-bold">
                    {usedPercentage.toFixed(1)}% {t.drive_storage_percent_used}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, Math.min(100, usedPercentage))}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Available / Free Storage */}
              <div className="bg-gradient-to-br from-emerald-50/90 via-white to-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t.drive_storage_free_label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {freePercentage.toFixed(1)}% {lang === "en" ? "Free" : lang === "ur" ? "باقی" : "شاغر"}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {formatFileSize(freeStorageBytes)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2">
                  <span className="text-emerald-700 font-bold truncate">
                    ✓ {lang === "en" ? "Plenty of Space" : lang === "ur" ? "کافی گنجائش دستیاب ہے" : "سعة ممتازة متاحة"}
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {freePercentage.toFixed(1)}% {t.drive_storage_percent_free}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, Math.min(100, freePercentage))}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Total Cloud Quota & Plan Selector */}
              <div className="bg-gradient-to-br from-blue-50/90 via-white to-white p-5 rounded-2xl border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {t.drive_storage_total_label}
                  </span>

                  {/* Interactive Quota Selector Dropdown Toggle */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setQuotaDropdownOpen(!quotaDropdownOpen)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                      title={t.drive_storage_plan_select}
                    >
                      <span>{driveQuotaGB} GB</span>
                      <span>▾</span>
                    </button>

                    {quotaDropdownOpen && (
                      <div className="absolute end-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-bold text-slate-700">
                        <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                          {t.drive_storage_plan_select}
                        </div>
                        {[
                          { gb: 15, label: "15 GB (Google Free)" },
                          { gb: 100, label: "100 GB (Google One)" },
                          { gb: 200, label: "200 GB (Google One)" },
                          { gb: 2048, label: "2 TB (Google One)" },
                        ].map((plan) => (
                          <button
                            key={plan.gb}
                            type="button"
                            onClick={() => handleDriveQuotaChange(plan.gb)}
                            className={`w-full text-start px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between cursor-pointer ${
                              driveQuotaGB === plan.gb ? "bg-blue-50 text-blue-700 font-black" : ""
                            }`}
                          >
                            <span>{plan.label}</span>
                            {driveQuotaGB === plan.gb && <span className="text-blue-600">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                  {formatFileSize(totalQuotaBytes)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2">
                  <span>Google Cloud Storage</span>
                  <span className="font-mono text-blue-700 font-bold">100%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full w-full" />
                </div>
              </div>

              {/* Card 4: Active Certificate Download File */}
              <div
                onClick={() => setActiveTab("buttons")}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      {lang === "en" ? "Certificate Download File" : lang === "ur" ? "ڈاؤن لوڈ بٹن کی فائل" : "ملف شهادة التحميل"}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      {isRtl ? "←" : "→"}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {config.downloadButton.fileName || "Google Drive File"}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-600 font-bold mt-2 truncate flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {config.downloadButton.actionType === "file" ? t.status_file : "Ready to Link"}
                </p>
              </div>
            </div>

            {/* 3. Interactive Storage Breakdown Meter & Drag-and-Drop Dropzone */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>📊</span>
                    <span>{t.drive_storage_breakdown}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en"
                      ? "Visual distribution of documents, certificates, media, and available free space in Google Drive"
                      : lang === "ur"
                      ? "گوگل ڈرائیو میں پی ڈی ایف سرٹیفکیٹس، تصاویر اور بقیہ گنجائش کا تفصیلی نقشہ"
                      : "توزيع ملفات الـ PDF والشهادات والوسائط والمساحة المتاحة في السحابة"}
                  </p>
                </div>

                {/* Storage Health Pill */}
                <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{t.drive_storage_status_good}</span>
                </div>
              </div>

              {/* Segmented Progress Track Bar */}
              <div className="w-full bg-slate-100 rounded-xl h-3.5 flex overflow-hidden shadow-inner p-0.5 gap-0.5">
                {/* PDF Segment */}
                {storageBreakdown.pdfBytes > 0 && (
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-l-lg transition-all duration-500"
                    style={{
                      width: `${Math.max(1.5, (storageBreakdown.pdfBytes / totalQuotaBytes) * 100)}%`,
                    }}
                    title={`PDFs: ${formatFileSize(storageBreakdown.pdfBytes)}`}
                  />
                )}
                {/* Image Segment */}
                {storageBreakdown.imgBytes > 0 && (
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(1.5, (storageBreakdown.imgBytes / totalQuotaBytes) * 100)}%`,
                    }}
                    title={`Images: ${formatFileSize(storageBreakdown.imgBytes)}`}
                  />
                )}
                {/* Other Docs Segment */}
                {storageBreakdown.docBytes > 0 && (
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500"
                    style={{
                      width: `${Math.max(1.5, (storageBreakdown.docBytes / totalQuotaBytes) * 100)}%`,
                    }}
                    title={`Other Docs: ${formatFileSize(storageBreakdown.docBytes)}`}
                  />
                )}
                {/* Free Remaining Track */}
                <div className="bg-slate-200/60 h-full flex-1 rounded-r-lg" title={`Free: ${formatFileSize(freeStorageBytes)}`} />
              </div>

              {/* Category Pills (Clickable to Quick Filter) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* PDF Pill */}
                <button
                  type="button"
                  onClick={() => setDriveFileFilter("pdf")}
                  className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    driveFileFilter === "pdf"
                      ? "bg-purple-50 border-purple-300 ring-2 ring-purple-200"
                      : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span className="text-xs font-black text-slate-800">{t.drive_filter_pdf}</span>
                  </div>
                  <p className="text-xs font-bold text-purple-700 mt-1">
                    {formatFileSize(storageBreakdown.pdfBytes)} ({storageBreakdown.pdfCount})
                  </p>
                </button>

                {/* Images Pill */}
                <button
                  type="button"
                  onClick={() => setDriveFileFilter("images")}
                  className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    driveFileFilter === "images"
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-black text-slate-800">{t.drive_filter_images}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-700 mt-1">
                    {formatFileSize(storageBreakdown.imgBytes)} ({storageBreakdown.imgCount})
                  </p>
                </button>

                {/* Other Docs Pill */}
                <button
                  type="button"
                  onClick={() => setDriveFileFilter("docs")}
                  className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    driveFileFilter === "docs"
                      ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
                      : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-black text-slate-800">{t.drive_filter_docs}</span>
                  </div>
                  <p className="text-xs font-bold text-amber-700 mt-1">
                    {formatFileSize(storageBreakdown.docBytes)} ({storageBreakdown.docCount})
                  </p>
                </button>

                {/* Free Space Pill */}
                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-start">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-slate-800">{t.drive_storage_free_label}</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-800 mt-1">
                    {formatFileSize(freeStorageBytes)} ({freePercentage.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Interactive Drag & Drop Direct Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverDashboard(true);
                }}
                onDragLeave={() => setIsDragOverDashboard(false)}
                onDrop={handleDashboardDrop}
                onClick={() => dashboardUploadInputRef.current?.click()}
                className={`mt-4 rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer relative overflow-hidden ${
                  isDragOverDashboard
                    ? "border-blue-500 bg-blue-50/80 scale-[1.01] shadow-lg ring-4 ring-blue-300/40"
                    : "border-slate-300 hover:border-blue-400 bg-gradient-to-b from-slate-50/50 to-white hover:bg-blue-50/20 shadow-2xs"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mx-auto mb-2 shadow-xs group-hover:scale-110 transition-transform">
                  ☁️
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800">
                  {t.drive_dropzone_title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                  {t.drive_dropzone_sub}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-bold text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100">PDF</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">PNG / JPG</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">DOCX</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">XLSX</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100">XML</span>
                </div>
              </div>
            </div>

            {/* 4. Search, Filter, Sort & View Mode Controls Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 start-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={driveSearchQuery}
                  onChange={(e) => setDriveSearchQuery(e.target.value)}
                  placeholder={t.drive_search_placeholder}
                  className="w-full ps-9 pe-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                />
                {driveSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDriveSearchQuery("")}
                    className="absolute inset-y-0 end-2.5 flex items-center text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Pills, Sort Dropdown & View Mode Switcher */}
              <div className="flex items-center gap-2.5 flex-wrap justify-between lg:justify-end">
                {/* Filter Pills */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setDriveFileFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveFileFilter === "all"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.drive_filter_all} ({driveFiles.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriveFileFilter("pdf")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveFileFilter === "pdf"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.drive_filter_pdf} ({storageBreakdown.pdfCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriveFileFilter("images")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveFileFilter === "images"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.drive_filter_images} ({storageBreakdown.imgCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriveFileFilter("docs")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveFileFilter === "docs"
                        ? "bg-white text-blue-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.drive_filter_docs} ({storageBreakdown.docCount})
                  </button>
                </div>

                {/* Sort Selector Dropdown */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                  <span className="px-2 text-[11px] text-slate-400">⇅</span>
                  <select
                    value={driveSortBy}
                    onChange={(e) => handleDriveSortChange(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-slate-700 pe-2 py-1 outline-none cursor-pointer"
                    title={t.drive_sort_by}
                  >
                    <option value="newest">{t.drive_sort_newest}</option>
                    <option value="oldest">{t.drive_sort_oldest}</option>
                    <option value="size_desc">{t.drive_sort_size_desc}</option>
                    <option value="size_asc">{t.drive_sort_size_asc}</option>
                    <option value="name_asc">{t.drive_sort_name_asc}</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setDriveViewMode("grid")}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveViewMode === "grid"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={t.drive_view_grid}
                  >
                    ⊞
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriveViewMode("list")}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      driveViewMode === "list"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={t.drive_view_list}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Files Display (Grid or List) */}
            {loadingDriveFiles ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-600">
                  {lang === "en" ? "Loading Google Drive files..." : lang === "ur" ? "گوگل ڈرائیو فائلز لوڈ ہو رہی ہیں..." : "جاري جلب ملفات Google Drive..."}
                </p>
              </div>
            ) : filteredDriveFiles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-3">
                  📂
                </div>
                <h3 className="text-sm font-black text-slate-800">
                  {t.drive_empty_state}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {t.drive_empty_state_sub}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => dashboardUploadInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    {t.drive_upload_btn}
                  </button>
                </div>
              </div>
            ) : driveViewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDriveFiles.map((file) => {
                  const isPdf = file.mimeType.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
                  const isImage = file.mimeType.includes("image") || /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(file.name);
                  const isAssigned = config.downloadButton.fileUrl === file.downloadUrl;

                  return (
                    <div
                      key={file.id}
                      className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-2xs hover:shadow-md group relative overflow-hidden ${
                        isAssigned ? "border-emerald-400 ring-2 ring-emerald-300/40" : "border-slate-200/90 hover:border-blue-400"
                      }`}
                    >
                      {/* Top Assigned Pill */}
                      {isAssigned && (
                        <div className="absolute top-3 end-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ★ {lang === "en" ? "Portal File" : lang === "ur" ? "پورٹل فائل" : "ملف البوابة"}
                          </span>
                        </div>
                      )}

                      <div>
                        {/* File Icon & Name */}
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                              isPdf
                                ? "bg-rose-50 text-rose-600 border border-rose-100"
                                : isImage
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "bg-purple-50 text-purple-600 border border-purple-100"
                            }`}
                          >
                            {isPdf ? "📄" : isImage ? "🖼️" : "📁"}
                          </div>

                          <div className="min-w-0 flex-1 pe-12">
                            <h4
                              className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors"
                              title={file.name}
                            >
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                              <span className="font-mono text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                {file.size ? formatFileSize(parseInt(file.size, 10)) : "Drive File"}
                              </span>
                              <span>•</span>
                              <span>
                                {file.createdTime
                                  ? new Date(file.createdTime).toLocaleDateString(
                                      lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en-US",
                                      { month: "short", day: "numeric", year: "numeric" }
                                    )
                                  : "Google Drive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Toolbar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          {/* Preview Link */}
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title={lang === "en" ? "Preview on Drive" : "معاينة"}
                            >
                              <IconEye className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Direct Download */}
                          <a
                            href={file.downloadUrl}
                            download={file.name}
                            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title={lang === "en" ? "Download" : "تحميل"}
                          >
                            <IconDownload className="w-3.5 h-3.5" />
                          </a>

                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(file.webViewLink || file.downloadUrl)}
                            className="p-2 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title={t.drive_copy_link}
                          >
                            <IconCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Assign to Portal Download Button */}
                          <button
                            type="button"
                            onClick={() => handleAssignToDownloadButton(file)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                              isAssigned
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                            }`}
                            title={t.drive_use_as_download}
                          >
                            {isAssigned ? "✓ " + (lang === "en" ? "Active" : lang === "ur" ? "فعال" : "نشط") : t.drive_use_as_download}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            disabled={deletingFileId === file.id}
                            className="p-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer border border-rose-200 hover:border-rose-600 shadow-2xs"
                            title={t.drive_delete_btn}
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black">
                      <tr>
                        <th className="p-3.5">{lang === "en" ? "File Name" : lang === "ur" ? "فائل کا نام" : "اسم الملف"}</th>
                        <th className="p-3.5">{lang === "en" ? "Size" : lang === "ur" ? "سائز" : "الحجم"}</th>
                        <th className="p-3.5">{lang === "en" ? "Upload Date" : lang === "ur" ? "تاریخ" : "تاريخ الرفع"}</th>
                        <th className="p-3.5 text-center">{lang === "en" ? "Actions" : lang === "ur" ? "ایکشنز" : "الإجراءات"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDriveFiles.map((file) => {
                        const isAssigned = config.downloadButton.fileUrl === file.downloadUrl;
                        return (
                          <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                              <span>{file.mimeType.includes("pdf") ? "📄" : "📁"}</span>
                              <span className="truncate max-w-xs">{file.name}</span>
                              {isAssigned && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ★
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-500 font-mono">
                              {file.size ? formatFileSize(parseInt(file.size, 10)) : "Drive"}
                            </td>
                            <td className="p-3.5 text-slate-400">
                              {file.createdTime
                                ? new Date(file.createdTime).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                                    title="View"
                                  >
                                    <IconEye className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <a
                                  href={file.downloadUrl}
                                  download={file.name}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  title="Download"
                                >
                                  <IconDownload className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleAssignToDownloadButton(file)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                    isAssigned
                                      ? "bg-emerald-600 text-white border-emerald-600"
                                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {isAssigned ? "✓" : t.drive_use_as_download}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFileToDelete(file)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-400 cursor-pointer"
                                  title={t.drive_delete_btn}
                                >
                                  <IconTrash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 1: BUTTONS & FILES                                    */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "buttons" && (
          <div className="space-y-6">
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
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-left transition-all"
                          />
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
                                  onClick={() => {
                                    setDrivePickerTarget("backButton");
                                    fetchDriveFiles();
                                  }}
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
                              className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <IconDrive className="w-4 h-4" />
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
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-xl border border-indigo-100">
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
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-left transition-all"
                        />
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
                                  onClick={() => {
                                    setDrivePickerTarget("verifyAgainButton");
                                    fetchDriveFiles();
                                  }}
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
                              className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <IconDrive className="w-4 h-4" />
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
              <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs">
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
                                  onClick={() => {
                                    setDrivePickerTarget("downloadButton");
                                    fetchDriveFiles();
                                  }}
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
                              className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <IconDrive className="w-4 h-4" />
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
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left transition-all"
                          />
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
          <div className="space-y-6">
            {/* Header description banner */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <IconDocument className="w-5 h-5 text-emerald-600" />
                  <span>{t.doc_title}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">{t.doc_desc}</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <IconCheck className="w-4 h-4" />
                <span>{saving ? t.saving_btn : t.save_btn}</span>
              </button>
            </div>

            {/* Sub-Card 1: معلومات الغرفة والمنشأة */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h3 className="text-sm font-black text-slate-800">
                  {lang === "en" ? "Chamber & Facility Details" : lang === "ur" ? "کمرہ اور ادارہ کی معلومات" : "بيانات الغرفة والمنشأة"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.chamber_name}
                  </label>
                  <input
                    type="text"
                    value={config.chamberName}
                    onChange={(e) => setConfig({ ...config, chamberName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.facility_name}
                  </label>
                  <input
                    type="text"
                    value={config.facilityName}
                    onChange={(e) => setConfig({ ...config, facilityName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.facility_sub_name}
                  </label>
                  <input
                    type="text"
                    value={config.facilitySubName || ""}
                    onChange={(e) => setConfig({ ...config, facilitySubName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Card 2: أرقام ومواصفات الطلب */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h3 className="text-sm font-black text-slate-800">
                  {lang === "en" ? "Request Numbers & Identifiers" : lang === "ur" ? "درخواست اور شناختی نمبرز" : "أرقام المعاملة والطلب"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.unified_number}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.unifiedNumber}
                    onChange={(e) => setConfig({ ...config, unifiedNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.request_number}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.requestNumber}
                    onChange={(e) => setConfig({ ...config, requestNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.commercial_reg_no}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.commercialRegNo}
                    onChange={(e) => setConfig({ ...config, commercialRegNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.request_type}
                  </label>
                  <input
                    type="text"
                    value={config.requestType}
                    onChange={(e) => setConfig({ ...config, requestType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.applicant_name}
                  </label>
                  <input
                    type="text"
                    value={config.applicantName}
                    onChange={(e) => setConfig({ ...config, applicantName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.amount}
                  </label>
                  <input
                    type="text"
                    value={config.amount}
                    onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Card 3: التواريخ والأوقات */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-black text-slate-800">
                  {lang === "en" ? "Dates & Timestamps" : lang === "ur" ? "تاریخ اور اوقات" : "التواريخ ومواعيد الصلاحية"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <span className="text-xs font-black text-slate-800 block mb-3">
                    {lang === "en" ? "Creation Date & Time" : lang === "ur" ? "تاريخ اور وقتِ تخلیق" : "تاريخ ووقت الإنشاء"}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        {t.creation_date}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={config.creationDate}
                        onChange={(e) => setConfig({ ...config, creationDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        {t.creation_time}
                      </label>
                      <input
                        type="text"
                        value={config.creationTime}
                        onChange={(e) => setConfig({ ...config, creationTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <span className="text-xs font-black text-slate-800 block mb-3">
                    {lang === "en" ? "Expiry Date & Time" : lang === "ur" ? "تاريخ اور وقتِ میعاد" : "تاريخ ووقت الصلاحية"}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        {t.expiry_date}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={config.expiryDate}
                        onChange={(e) => setConfig({ ...config, expiryDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        {t.expiry_time}
                      </label>
                      <input
                        type="text"
                        value={config.expiryTime}
                        onChange={(e) => setConfig({ ...config, expiryTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Card 4: حالة الطلب ومظهر الشارة مع اقتراحات الألوان */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-black text-slate-800">
                  {lang === "en" ? "Request Status & Color Badge" : lang === "ur" ? "درخواست کی حالت اور رنگ" : "حالة الطلب ومظهر الشارة"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.request_status}
                    </label>
                    <input
                      type="text"
                      value={config.requestStatus}
                      onChange={(e) => setConfig({ ...config, requestStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.status_color}
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={config.statusColor || "#32c5cb"}
                        onChange={(e) => setConfig({ ...config, statusColor: e.target.value })}
                        className="w-12 h-10 p-1 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                        title={t.status_color}
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={config.statusColor || "#32c5cb"}
                        onChange={(e) => setConfig({ ...config, statusColor: e.target.value })}
                        className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono font-bold uppercase focus:bg-white focus:outline-none"
                      />

                      {/* Quick Palette Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { color: "#32c5cb", label: "Cyan" },
                          { color: "#10b981", label: "Green" },
                          { color: "#3b82f6", label: "Blue" },
                          { color: "#f59e0b", label: "Amber" },
                          { color: "#ef4444", label: "Red" },
                          { color: "#8b5cf6", label: "Purple" },
                        ].map((swatch) => (
                          <button
                            key={swatch.color}
                            type="button"
                            onClick={() => setConfig({ ...config, statusColor: swatch.color })}
                            className={`w-6 h-6 rounded-lg cursor-pointer transition-transform hover:scale-110 border ${
                              config.statusColor === swatch.color ? "ring-2 ring-slate-800 scale-110" : "border-slate-300"
                            }`}
                            style={{ backgroundColor: swatch.color }}
                            title={swatch.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Badge Preview Preview */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === "en" ? "Live Status Preview" : lang === "ur" ? "لائیو اسٹیٹس کا نمونہ" : "معاينة شارة الحالة"}
                  </span>
                  <div className="py-2">
                    <span
                      className="text-base sm:text-lg font-black tracking-wide transition-colors"
                      style={{ color: config.statusColor || "#32c5cb" }}
                    >
                      {config.requestStatus || "تم قبول الطلب وساري"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {lang === "en"
                      ? "This is exactly how the status badge text will appear on the public page."
                      : lang === "ur"
                      ? "یہ بالکل اسی طرح پبلک پیج پر ظاہر ہوگا۔"
                      : "هكذا ستظهر حالة الطلب واللون تماماً للزوار على الصفحة الرئيسية."}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-Card 5: الحقول الإضافية المخصصة */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>{t.custom_fields_title}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{t.custom_fields_desc}</p>
                  </div>
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
              <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs">
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
              {!config.customFields || config.customFields.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-500 mb-3">{t.no_custom_fields}</p>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    {t.add_field_btn}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {config.customFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all hover:bg-slate-100/60 shadow-2xs"
                    >
                      <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={t.field_label_placeholder}
                          value={field.label}
                          onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={t.field_value_placeholder}
                          value={field.value}
                          onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                        title="Remove Field"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 3: LIVE PREVIEW (WITH DESKTOP / MOBILE SWITCHER)       */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <IconPreview className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{t.preview_title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.preview_desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Device Selector Pill */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === "desktop"
                        ? "bg-white text-purple-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconDeviceDesktop className="w-4 h-4" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === "mobile"
                        ? "bg-white text-purple-700 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <IconDeviceMobile className="w-4 h-4" />
                    <span>Mobile</span>
                  </button>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>{t.preview_btn}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Device Container Frame */}
            <div className="flex justify-center py-4">
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === "mobile"
                    ? "max-w-[390px] border-8 border-slate-800 rounded-[45px] shadow-2xl overflow-hidden bg-white p-2"
                    : "max-w-3xl"
                }`}
              >
                {previewDevice === "mobile" && (
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0"></div>
                )}

                {/* Arabic Document Card Replica */}
                <div
                  dir="rtl"
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-md font-sans"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-sm"></span>
                      <h4 className="font-bold text-base sm:text-lg text-slate-900">
                        {config.pageTitle}
                      </h4>
                    </div>
                    <span className="px-4 py-1 bg-[#6ea8fe] text-white rounded text-xs font-bold">
                      {config.backButton.label || "رجوع"}
                    </span>
                  </div>

                  <div className="py-6 max-w-md mx-auto text-center space-y-2.5 text-sm sm:text-base text-slate-800 leading-relaxed">
                    <p>
                      <strong className="font-bold">اسم الغرفة : </strong>
                      <span>{config.chamberName}</span>
                    </p>
                    <p>
                      <strong className="font-bold">اسم المنشأة : </strong>
                      <span>{config.facilityName}</span>
                    </p>
                    {config.facilitySubName && (
                      <p>
                        <span>{config.facilitySubName}</span>
                      </p>
                    )}
                    <p>
                      <strong className="font-bold">الرقم الموحد (700) : </strong>
                      <span className="font-mono">{config.unifiedNumber}</span>
                    </p>
                    <p>
                      <strong className="font-bold">رقم الطلب : </strong>
                      <span className="font-mono font-bold text-lg text-slate-900">
                        {config.requestNumber}
                      </span>
                    </p>
                    <p>
                      <strong className="font-bold">نوع الطلب : </strong>
                      <span>{config.requestType}</span>
                    </p>
                    <p>
                      <strong className="font-bold">اسم مقدم الطلب : </strong>
                      <span>{config.applicantName}</span>
                    </p>
                    <p>
                      <strong className="font-bold">تاريخ ووقت الإنشاء : </strong>
                      <span className="font-mono">
                        {config.creationDate} {config.creationTime}
                      </span>
                    </p>
                    <p>
                      <strong className="font-bold">مبلغ الطلب : </strong>
                      <span>{config.amount}</span>
                    </p>
                    <p>
                      <strong className="font-bold">تاريخ الصلاحية : </strong>
                      <span className="font-mono">
                        {config.expiryDate} {config.expiryTime}
                      </span>
                    </p>
                    <p>
                      <strong className="font-bold">رقم السجل التجاري : </strong>
                      <span className="font-mono">{config.commercialRegNo}</span>
                    </p>
                    <p className="pt-2 text-lg">
                      <strong className="font-bold">حالة الطلب : </strong>
                      <strong style={{ color: config.statusColor || "#32c5cb" }}>
                        {config.requestStatus}
                      </strong>
                    </p>

                    {/* Dynamically added custom fields */}
                    {config.customFields && config.customFields.length > 0 &&
                      config.customFields.map((f) => (
                        <p key={f.id} className="m-0">
                          <strong className="font-bold">{f.label} : </strong>
                          <span>{f.value}</span>
                        </p>
                      ))}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-4 pb-2 border-t border-slate-100">
                    <span className="px-5 py-2 bg-[#6ea8fe] text-white rounded font-bold text-xs shadow-xs">
                      {config.verifyAgainButton.label || "إعادة التحقق"}
                    </span>
                    <span className="px-6 py-2 bg-[#6ea8fe] text-white rounded font-bold text-xs shadow-xs">
                      {config.downloadButton.label || "تحميل"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 4: FOOTER & SOCIAL                                    */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <IconSupport className="w-5 h-5 text-amber-600" />
                  <span>{t.footer_title}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">{t.footer_desc}</p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <IconCheck className="w-4 h-4" />
                <span>{saving ? t.saving_btn : t.save_btn}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Official Corporate & Support Info */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-black text-slate-800">
                    {lang === "en" ? "Support & Operating Organization" : lang === "ur" ? "ڈعم اور آپریٹنگ ادارہ" : "بيانات الدعم والتشغيل"}
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.support_phone}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.supportPhone}
                    onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Card 2: Social Media Platform URLs */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h3 className="text-sm font-black text-slate-800">
                    {t.social_title}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {Object.entries({
                    skype: { label: "Skype", icon: "💬" },
                    instagram: { label: "Instagram", icon: "📸" },
                    youtube: { label: "YouTube", icon: "▶️" },
                    twitter: { label: "Twitter / X", icon: "𝕏" },
                    facebook: { label: "Facebook", icon: "📘" },
                  }).map(([key, item]) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.label} URL</span>
                      </label>
                      <div className="flex gap-2">
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
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          placeholder={`https://${key}.com/...`}
                        />
                        {(config.socialLinks as Record<string, string>)[key] && (
                          <a
                            href={(config.socialLinks as Record<string, string>)[key]}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center shrink-0"
                            title="Open Link"
                          >
                            ↗
                          </a>
                        )}
                      </div>
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
                onClick={handleSave}
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
                    {lang === "en" ? "Browser & Page Titles" : lang === "ur" ? "صفحہ اور پورٹل عنوانات" : "عناوين الصفحة والبوابة"}
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.portal_title}
                  </label>
                  <input
                    type="text"
                    value={config.portalTitle}
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
                    onChange={(v) =>
                      setConfig({ ...config, enableInitialLoader: v })
                    }
                    label={t.initial_loader_toggle}
                  />
                </div>
              </div>

              {/* Loaders & Timers */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <h3 className="text-sm font-black text-slate-800">
                    {lang === "en" ? "Animation Timers (Milliseconds)" : lang === "ur" ? "انتظار کا وقت اور اینیمیشن" : "فترات الانتظار والأنيميشن"}
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
        )}
      </main>

      {/* ═══════════════ FLOATING BOTTOM UNSAVED CHANGES DOCK ═══════════════ */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] sm:w-auto">
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
