"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig, PortalRecord } from "@/lib/portal-types";
import { ADMIN_TRANSLATIONS, AdminLanguage } from "@/lib/admin-translations";
import {
  saveConfigToFirebase,
  savePortalRecordToFirebase,
  deletePortalRecordFromFirebase,
} from "@/lib/firebase";
import { FirebaseRecordsModal } from "@/components/FirebaseRecordsModal";

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
  const [activeTab, setActiveTab] = useState<"buttons" | "document" | "preview" | "footer" | "settings">("buttons");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isDragOverBtn, setIsDragOverBtn] = useState<string | null>(null);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [serialError, setSerialError] = useState(false);
  const [unifiedError, setUnifiedError] = useState<string | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // ─── FIREBASE SAVED RECORDS & LINKS STATE ───
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [savedRecords, setSavedRecords] = useState<PortalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [copiedRecordId, setCopiedRecordId] = useState<string | null>(null);

  // ─── GOOGLE DRIVE FILE PICKER STATE (FOR BUTTONS) ───
  const [drivePickerTarget, setDrivePickerTarget] = useState<"backButton" | "verifyAgainButton" | "downloadButton" | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDriveFiles, setLoadingDriveFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveItem | null>(null);

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

  // ─── FETCH SAVED RECORDS FROM FIREBASE & SERVER ───
  const fetchSavedRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch(`/api/records?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setSavedRecords(data.records);
      }
    } catch (err) {
      console.error("Error loading records:", err);
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  const handleDeleteRecord = async (record: PortalRecord) => {
    setDeletingRecordId(record.id);
    try {
      // 1. Delete from Firestore directly on client
      try {
        await deletePortalRecordFromFirebase(record.id);
      } catch (fbErr) {
        console.warn("Client delete warning:", fbErr);
      }

      // 2. Delete from server API & local disk
      const res = await fetch(`/api/records?id=${encodeURIComponent(record.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSavedRecords((prev) => prev.filter((r) => r.id !== record.id));
        showToast(t.record_deleted_success, "success");
      } else {
        showToast(t.save_error, "error");
      }
    } catch (err) {
      console.error(err);
      showToast(t.save_error, "error");
    } finally {
      setDeletingRecordId(null);
    }
  };

  const handleCopyRecordLink = (record: PortalRecord) => {
    if (typeof window === "undefined") return;
    const s = (record.serialNumber || "").trim();
    const u = (record.unifiedNumber || "").trim();
    const path = u ? `/${encodeURIComponent(s)}/${encodeURIComponent(u)}` : `/${encodeURIComponent(s)}`;
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedRecordId(record.id);
    setTimeout(() => setCopiedRecordId(null), 2500);
    showToast(t.link_copied, "success", fullUrl, t.open_link_btn);
  };

  const handleLoadRecordIntoEditor = (record: PortalRecord) => {
    setConfig(record);
    setInitialConfig(record);
    setEditingRecordId(record.id);
    setUnifiedError(null);
    setSerialError(false);
    setFirebaseModalOpen(false);
    setActiveTab("document");
    showToast(
      lang === "en"
        ? `Loaded record #${record.serialNumber}`
        : lang === "ur"
        ? `ریکارڈ #${record.serialNumber} لوڈ ہو گیا`
        : `تم تحميل بيانات السجل #${record.serialNumber}`,
      "info"
    );
  };

  // Handler to quickly generate an authentic sample certificate to test multiple records
  const handleCreateSampleRecord = async () => {
    const sampleChambers = ["الرياض", "جدة", "ينبع", "الشرقية", "مكة المكرمة", "المدينة المنورة"];
    const randomChamber = sampleChambers[Math.floor(Math.random() * sampleChambers.length)];
    const randomSerial = String(Math.floor(100000 + Math.random() * 900000));
    const randomUnified = `70${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomReq = String(Math.floor(10000000 + Math.random() * 90000000));

    const newSample: PortalConfig = {
      ...DEFAULT_PORTAL_CONFIG,
      chamberName: randomChamber,
      facilityName: `مؤسسة ${randomChamber} لتقنية المعلومات والحلول الرقمية`,
      facilitySubName: "فرع الاستشارات وتطوير الأنظمة",
      serialNumber: randomSerial,
      unifiedNumber: randomUnified,
      requestNumber: randomReq,
      requestType: "تصديق إلكتروني فوري",
      applicantName: "محمد ناصر القحطاني",
      creationDate: "15/09/2026-",
      creationTime: "11:20ص",
      amount: "100.00 ريال",
      expiryDate: "15/09/2027-",
      expiryTime: "11:20ص",
      commercialRegNo: `1010${randomSerial.slice(0, 4)}`,
      requestStatus: "تم قبول الطلب وساري",
      statusColor: "#10b981",
    };

    try {
      setLoadingRecords(true);
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSample),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          lang === "en"
            ? `Sample certificate #${randomSerial} added successfully!`
            : lang === "ur"
            ? `نمونہ سرٹیفکیٹ #${randomSerial} شامل کر دیا گیا!`
            : `تم إضافة شهادة تجريبية جديدة #${randomSerial} بنجاح!`,
          "success"
        );
        fetchSavedRecords();
      }
    } catch (err) {
      console.error("Error creating sample record:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  // ─── PERMANENT DELETE FROM GOOGLE DRIVE (TRIGGERED FROM NOTIFICATION) ───
  const confirmDeleteDriveFile = async (file: DriveItem) => {
    setDeletingFileId(file.id);
    try {
      const res = await fetch(`/api/drive?fileId=${encodeURIComponent(file.id)}&fileName=${encodeURIComponent(file.name)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Remove from local list immediately
        setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));

        // If any button has this file assigned, cleanly reset it
        setConfig((prev) => {
          let hasChange = false;
          const updated = { ...prev };
          const keys: ("backButton" | "verifyAgainButton" | "downloadButton")[] = ["backButton", "verifyAgainButton", "downloadButton"];
          for (const k of keys) {
            if (updated[k]?.fileName === file.name || updated[k]?.fileUrl?.includes(file.id)) {
              hasChange = true;
              updated[k] = {
                ...updated[k],
                actionType: "link",
                fileUrl: undefined,
                fileName: undefined,
                fileSize: undefined,
              };
            }
          }
          return hasChange ? updated : prev;
        });

        // Close the delete notification modal
        setFileToDelete(null);

        showToast(
          lang === "en"
            ? `File "${file.name}" has been permanently deleted from Google Drive.`
            : lang === "ur"
            ? `فائل "${file.name}" گوگل ڈرائیو سے کامیابی کے ساتھ ڈیلیٹ کر دی گئی۔`
            : `تم حذف الملف "${file.name}" بنجاح ونهائياً من Google Drive.`,
          "success"
        );
      } else {
        showToast(
          data.error || (lang === "en" ? "Failed to delete file from Google Drive" : "فائل ڈیلیٹ نہیں ہو سکی"),
          "error"
        );
      }
    } catch (err) {
      console.error("Delete drive file error:", err);
      showToast(
        lang === "en" ? "Network error deleting file" : "فائل ڈیلیٹ کرتے وقت خرابی پیش آئی",
        "error"
      );
    } finally {
      setDeletingFileId(null);
    }
  };

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

  // Load stored config & drive files on mount
  useEffect(() => {
    let active = true;
    async function init() {
      // Restore client-saved language after hydration
      try {
        const savedLang = localStorage.getItem("admin_portal_lang") as AdminLanguage | null;
        if (active && savedLang && (savedLang === "ar" || savedLang === "en" || savedLang === "ur")) {
          setLang(savedLang);
        }
      } catch {
        // ignore
      }

      try {
        const [configRes, driveRes, recordsRes] = await Promise.all([
          fetch("/api/config", { cache: "no-store" }),
          fetch("/api/drive"),
          fetch("/api/records", { cache: "no-store" }),
        ]);
        if (active && configRes.ok) {
          const cfg = await configRes.json();
          setConfig(cfg);
          setInitialConfig(cfg);
        }
        if (active && driveRes.ok) {
          const driveData = await driveRes.json();
          if (driveData.success && Array.isArray(driveData.files)) {
            setDriveFiles(driveData.files);
          }
        }
        if (active && recordsRes.ok) {
          const recData = await recordsRes.json();
          if (recData.success && Array.isArray(recData.records)) {
            setSavedRecords(recData.records);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        if (active) {
          setLoading(false);
          setLoadingDriveFiles(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
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

  // Helper to compute public URL with dynamic serial and unified numbers
  const getPublicLink = useCallback((conf: PortalConfig) => {
    const s = conf.serialNumber?.trim();
    const u = conf.unifiedNumber?.trim();
    if (s && u) return `/${encodeURIComponent(s)}/${encodeURIComponent(u)}`;
    if (s) return `/${encodeURIComponent(s)}`;
    return "/";
  }, []);

  const handleSave = useCallback(async () => {
    const cleanSerial = (config.serialNumber || "").trim();
    const cleanUnified = (config.unifiedNumber || "").trim();

    if (!cleanSerial) {
      setSerialError(true);
      setActiveTab("document");
      showToast(t.serial_number_required_error, "error");
      setTimeout(() => {
        const el = document.getElementById("serial-number-input");
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }
    setSerialError(false);

    // ─── STRICT VALIDATION: UNIFIED NUMBER MUST BE CHANGED BEFORE SAVING ───
    const initialUnified = (initialConfig.unifiedNumber || "").trim();

    if (!cleanUnified) {
      const errMsg =
        lang === "en"
          ? "Unified Number (700) is required!"
          : lang === "ur"
          ? "یونیفائیڈ نمبر (700) درج کرنا لازمی ہے!"
          : "الرقم الموحد (700) إجباري لحفظ التعديلات!";
      setUnifiedError(errMsg);
      setActiveTab("document");
      showToast(errMsg, "error");
      setTimeout(() => {
        const el = document.getElementById("unified-number-input");
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    // Must be changed from the previously loaded/initial unified number
    if (initialUnified && cleanUnified === initialUnified) {
      const errMsg = t.unified_number_change_required_error;
      setUnifiedError(errMsg);
      setActiveTab("document");
      showToast(errMsg, "error");
      setTimeout(() => {
        const el = document.getElementById("unified-number-input");
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    // ─── STRICT VALIDATION: UNIFIED NUMBER DUPLICATION IN FIREBASE ───
    // Re-using serial numbers is 100% fine.
    // Re-using an existing unified number that is already in Firebase is strictly forbidden!
    const existingDup = savedRecords.find(
      (r) =>
        (r.unifiedNumber || "").trim() === cleanUnified &&
        r.id !== editingRecordId &&
        r.id !== `${cleanSerial}_${cleanUnified}`
    );

    if (existingDup) {
      const errMsg =
        lang === "en"
          ? `This Unified Number (${cleanUnified}) already exists in Firebase (under serial #${existingDup.serialNumber})! Please use a different unified number.`
          : lang === "ur"
          ? `یہ یونیفائیڈ نمبر (${cleanUnified}) پہلے سے Firebase میں محفوظ ہے (سیریل نمبر #${existingDup.serialNumber} کے تحت)! ایک ہی یونیفائیڈ نمبر دوبارہ استعمال نہیں کیا جا سکتا۔`
          : `الرقم الموحد (${cleanUnified}) مسجل مسبقاً في Firebase (تحت السجل #${existingDup.serialNumber})! يرجى إدخال رقم موحد آخر.`;

      setUnifiedError(errMsg);
      setActiveTab("document");
      showToast(errMsg, "error");
      setTimeout(() => {
        const el = document.getElementById("unified-number-input");
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }
    setUnifiedError(null);

    setSaving(true);
    try {
      const payload: PortalConfig & { currentRecordId?: string } = {
        ...config,
        serialNumber: cleanSerial,
        unifiedNumber: cleanUnified,
        currentRecordId: editingRecordId || undefined,
      };

      // 1. Direct Firebase Cloud Firestore save from client
      try {
        await saveConfigToFirebase(payload);
        await savePortalRecordToFirebase(payload, editingRecordId || `${cleanSerial}_${cleanUnified}`);
      } catch (fbErr: any) {
        if (fbErr?.message?.includes("DUPLICATE_UNIFIED_NUMBER")) {
          const errMsg = t.unified_number_duplicate_error;
          setUnifiedError(errMsg);
          setActiveTab("document");
          showToast(errMsg, "error");
          setSaving(false);
          return;
        }
        console.warn("Direct Firebase client save notice:", fbErr);
      }

      // 2. Server API route save (also syncs Firebase, disk & memory)
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const result = await res.json();
        setConfig(result.data);
        setInitialConfig(result.data);
        setEditingRecordId(result.data.id || `${cleanSerial}_${cleanUnified}`);
        try {
          localStorage.setItem("portal_config_cache", JSON.stringify(result.data));
        } catch {
          // ignore
        }
        showToast(t.saved_success, "success");
        // Refresh saved records list
        fetchSavedRecords();
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.code === "DUPLICATE_UNIFIED_NUMBER") {
          const errMsg = errJson.error || t.unified_number_duplicate_error;
          setUnifiedError(errMsg);
          setActiveTab("document");
          showToast(errMsg, "error");
          setTimeout(() => {
            const el = document.getElementById("unified-number-input");
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        } else {
          showToast(errJson.error || t.save_error, "error");
        }
      }
    } catch (err) {
      console.error(err);
      showToast(t.save_error, "error");
    } finally {
      setSaving(false);
    }
  }, [config, initialConfig, t, showToast, fetchSavedRecords, savedRecords, editingRecordId, lang]);

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
  const fieldCounterRef = useRef(1);
  const handleAddCustomField = () => {
    fieldCounterRef.current += 1;
    const newField = {
      id: `field_${fieldCounterRef.current}`,
      label: "",
      value: "",
    };
    setConfig((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };

  const handleAddPresetField = (presetLabel: string) => {
    fieldCounterRef.current += 1;
    const newField = {
      id: `field_${fieldCounterRef.current}`,
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
        const updated: PortalConfig = {
          ...config,
          [buttonKey]: {
            ...config[buttonKey],
            actionType: "file",
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
          },
        };
        await autoSaveConfig(updated);

        const targetDriveUrl =
          data.driveViewLink ||
          (data.driveFileId
            ? `https://drive.google.com/file/d/${data.driveFileId}/view`
            : "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl");

        showToast(
          lang === "en"
            ? `File "${data.fileName}" uploaded & applied to main page! Click notification to view in Google Drive.`
            : lang === "ur"
            ? `فائل "${data.fileName}" اپلوڈ ہو گئی اور مین پیج پر لاگو ہو گئی! ڈرائیو کیلئے کلک کریں۔`
            : `تم رفع "${data.fileName}" وتطبيقه على الصفحة الرئيسية! انقر للعرض في Google Drive.`,
          "success",
          targetDriveUrl,
          lang === "en" ? "Open in Drive ↗" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں ↗" : "عرض في Drive ↗"
        );
        fetchDriveFiles();
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

  // Helper to persist updated configuration immediately to server & disk
  const autoSaveConfig = useCallback(async (newConfig: PortalConfig) => {
    setConfig(newConfig);
    setInitialConfig(newConfig);
    try {
      localStorage.setItem("portal_config_cache", JSON.stringify(newConfig));
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
    } catch (err) {
      console.error("autoSaveConfig failed:", err);
    }
  }, []);

  // Update button action mode (link, file, or animation) and auto-save
  const updateButtonMode = async (
    buttonKey: "backButton" | "verifyAgainButton" | "downloadButton",
    actionType: "link" | "file" | "animation"
  ) => {
    const updated: PortalConfig = {
      ...config,
      [buttonKey]: {
        ...config[buttonKey],
        actionType,
      },
    };
    await autoSaveConfig(updated);
  };

  // Attach / save URL link for any button
  const handleButtonLinkSave = async (
    buttonKey: "backButton" | "verifyAgainButton" | "downloadButton"
  ) => {
    const rawUrl = (config[buttonKey]?.url || "").trim();
    if (!rawUrl || rawUrl === "#") {
      showToast(
        lang === "en"
          ? "Please enter a valid URL or Google Drive link."
          : lang === "ur"
          ? "براہ کرم درست لنک یا گوگل ڈرائیو یو آر ایل درج کریں۔"
          : "يرجى إدخال رابط صالح أو رابط Google Drive.",
        "info"
      );
      return;
    }

    // Auto-normalize URL (e.g. google.com -> https://google.com)
    let formattedUrl = rawUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("/") &&
      !formattedUrl.startsWith("mailto:") &&
      !formattedUrl.startsWith("tel:")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const updated: PortalConfig = {
      ...config,
      [buttonKey]: {
        ...config[buttonKey],
        actionType: "link",
        url: formattedUrl,
      },
    };
    await autoSaveConfig(updated);

    const isDriveUrl =
      formattedUrl.includes("drive.google.com") || formattedUrl.includes("docs.google.com");
    const targetDriveUrl = isDriveUrl
      ? formattedUrl
      : "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

    showToast(
      lang === "en"
        ? `Link saved & applied to main page! Click notification to view in Google Drive.`
        : lang === "ur"
        ? `لنک محفوظ ہو گیا اور مین پیج پر لاگو ہو گیا! گوگل ڈرائیو میں دیکھنے کیلئے کلک کریں۔`
        : `تم حفظ الرابط وتطبيقه على الصفحة الرئيسية بنجاح! انقر هنا للعرض في Google Drive.`,
      "success",
      targetDriveUrl,
      lang === "en" ? "Open in Drive ↗" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں ↗" : "عرض في Drive ↗"
    );
  };

  const removeFile = async (buttonKey: "backButton" | "verifyAgainButton" | "downloadButton") => {
    const updated: PortalConfig = {
      ...config,
      [buttonKey]: {
        ...config[buttonKey],
        actionType: "link",
        fileUrl: "",
        fileName: "",
        fileSize: undefined,
      },
    };
    await autoSaveConfig(updated);
    showToast(
      lang === "en" ? "File removed from button" : lang === "ur" ? "فائل بٹن سے ہٹا دی گئی" : "تم حذف الملف من الزر",
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





  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir="rtl" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-sm tracking-wide text-slate-300" suppressHydrationWarning>
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] text-slate-800 font-sans pb-32 selection:bg-blue-600 selection:text-white antialiased"
    >
      {/* ═══════════════ TOAST NOTIFICATION WITH GOOGLE DRIVE LINK ═══════════════ */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] shadow-2xl transition-all duration-300 max-w-xl w-full px-4 animate-in fade-in slide-in-from-top-4">
          <div
            onClick={() => {
              if (toast.link) {
                window.open(toast.link, "_blank", "noopener,noreferrer");
              }
            }}
            className={`px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 border text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-all ${
              toast.link ? "cursor-pointer hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]" : ""
            } ${
              toast.type === "success"
                ? "bg-emerald-600/95 text-white border-emerald-400/80 shadow-emerald-500/20"
                : toast.type === "error"
                ? "bg-rose-600/95 text-white border-rose-400/80 shadow-rose-500/20"
                : "bg-blue-600/95 text-white border-blue-400/80 shadow-blue-500/20"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-black shadow-inner">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
              </span>
              <div className="truncate min-w-0">
                <span className="block truncate font-bold">{toast.message}</span>
                {toast.link && (
                  <span className="text-[10px] text-white/90 font-medium block truncate">
                    {lang === "en"
                      ? "Click anywhere on notification to view in Google Drive"
                      : lang === "ur"
                      ? "گوگل ڈرائیو میں فائل کی لوکیشن دیکھنے کیلئے نوٹیفکیشن پر کلک کریں"
                      : "انقر هنا للذهاب إلى موقع الملف في Google Drive"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.link && (
                <a
                  href={toast.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white text-slate-900 hover:bg-slate-100 active:scale-95 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md no-underline transition-all"
                >
                  <span className="text-sm">☁️</span>
                  <span>
                    {toast.linkLabel ||
                      (lang === "en" ? "Open Drive ↗" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں ↗" : "عرض في Drive ↗")}
                  </span>
                </a>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setToast(null);
                }}
                className="w-6 h-6 rounded-full hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
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
                href={getPublicLink(config)}
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
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-2xl shrink-0">
                          {file.mimeType.includes("pdf") ? "📄" : file.mimeType.includes("image") ? "🖼️" : "📁"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {file.size ? formatFileSize(parseInt(file.size)) : "Google Drive"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-500 hover:text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                            title={lang === "en" ? "Preview in Google Drive" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں" : "معاينة في Drive"}
                          >
                            {lang === "en" ? "Preview ↗" : lang === "ur" ? "معائنہ ↗" : "معاينة ↗"}
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            if (drivePickerTarget) {
                              const updated: PortalConfig = {
                                ...config,
                                [drivePickerTarget]: {
                                  ...config[drivePickerTarget],
                                  actionType: "file",
                                  fileUrl: file.downloadUrl,
                                  fileName: file.name,
                                  fileSize: file.size ? parseInt(file.size) : undefined,
                                },
                              };
                              await autoSaveConfig(updated);
                              setDrivePickerTarget(null);
                              const targetDriveUrl =
                                file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;
                              showToast(
                                lang === "en"
                                  ? `File "${file.name}" linked & applied to main page! Click notification to view in Google Drive.`
                                  : lang === "ur"
                                  ? `فائل "${file.name}" منسلک ہو کر مین پیج پر لاگو ہو گئی! گوگل ڈرائیو کیلئے کلک کریں۔`
                                  : `تم ربط "${file.name}" وتطبيقه على الصفحة الرئيسية بنجاح! انقر هنا للعرض في Google Drive.`,
                                "success",
                                targetDriveUrl,
                                lang === "en" ? "Open in Drive ↗" : lang === "ur" ? "گوگل ڈرائیو میں دیکھیں ↗" : "عرض في Drive ↗"
                              );
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          {lang === "en" ? "Select File" : lang === "ur" ? "منتخب کریں" : "اختيار هذا الملف"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFileToDelete(file);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 group active:scale-95"
                          title={
                            lang === "en"
                              ? "Delete permanently from Google Drive"
                              : lang === "ur"
                              ? "گوگل ڈرائیو سے مستقل ڈیلیٹ کریں"
                              : "حذف نهائي من Google Drive"
                          }
                        >
                          <IconTrash className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                          <span>
                            {lang === "en" ? "Delete" : lang === "ur" ? "ڈیلیٹ" : "حذف"}
                          </span>
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

      {/* ─── GOOGLE DRIVE DELETE CONFIRMATION NOTIFICATION MODAL ─── */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[100005] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !deletingFileId && setFileToDelete(null)}
        >
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-md w-full overflow-hidden p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <IconTrash className="w-7 h-7 text-rose-600" />
            </div>
            <h3 className="text-center font-black text-slate-900 text-base sm:text-lg mb-1">
              {lang === "en"
                ? "Delete file from Google Drive?"
                : lang === "ur"
                ? "کیا آپ یہ فائل گوگل ڈرائیو سے ڈیلیٹ کرنا چاہتے ہیں؟"
                : "هل تريد حذف هذا الملف نهائياً من Google Drive؟"}
            </h3>
            <p className="text-center text-xs text-slate-500 mb-4 px-2 leading-relaxed">
              {lang === "en"
                ? "This file will be permanently deleted from your Google Drive storage. This action cannot be undone."
                : lang === "ur"
                ? "یہ فائل آپ کے منسلک گوگل ڈرائیو سے ہمیشہ کیلئے ڈیلیٹ کر دی جائے گی۔ یہ عمل واپس نہیں ہو سکتا۔"
                : "سيتم حذف هذا الملف نهائياً من مساحة Google Drive المتصلة. لا يمكن التراجع عن هذا الإجراء."}
            </p>

            {/* File info card inside notification */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3 mb-5">
              <span className="text-2xl shrink-0">
                {fileToDelete.mimeType.includes("pdf") ? "📄" : fileToDelete.mimeType.includes("image") ? "🖼️" : "📁"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate" title={fileToDelete.name}>
                  {fileToDelete.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {fileToDelete.size ? formatFileSize(parseInt(fileToDelete.size)) : "Google Drive"}
                </p>
              </div>
            </div>

            {/* Action buttons inside notification */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={Boolean(deletingFileId)}
                onClick={() => setFileToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 text-center"
              >
                {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
              </button>
              <button
                type="button"
                disabled={Boolean(deletingFileId)}
                onClick={() => confirmDeleteDriveFile(fileToDelete)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
              >
                {deletingFileId === fileToDelete.id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === "en" ? "Deleting..." : lang === "ur" ? "ڈیلیٹ ہو رہا ہے..." : "جاري الحذف..."}</span>
                  </>
                ) : (
                  <>
                    <IconTrash className="w-4 h-4" />
                    <span>{lang === "en" ? "Delete File" : lang === "ur" ? "ڈیلیٹ کریں" : "حذف الملف"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ═══════════════ FIREBASE RECORDS & GENERATED LINKS MODAL ═══════════════ */}
      <FirebaseRecordsModal
        open={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        savedRecords={savedRecords}
        loadingRecords={loadingRecords}
        onRefresh={fetchSavedRecords}
        onDeleteRecord={handleDeleteRecord}
        onCopyRecordLink={handleCopyRecordLink}
        onLoadRecordIntoEditor={handleLoadRecordIntoEditor}
        onCreateSampleRecord={handleCreateSampleRecord}
        deletingRecordId={deletingRecordId}
        copiedRecordId={copiedRecordId}
        lang={lang}
        t={t}
      />

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
                    5 {lang === "en" ? "Sections" : lang === "ur" ? "سیکشنز" : "شاشات"}
                  </span>
                </div>

                <div className="space-y-2">

                  {/* 🔥 FEATURED FIREBASE SERIAL NUMBER SAVED RECORDS BUTTON */}
                  {(!drawerSearch ||
                    t.firebase_records_btn.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                    "firebase records links حفظ سجلات روابط سیرین نمبر".includes(drawerSearch.toLowerCase())) && (
                    <button
                      type="button"
                      onClick={() => {
                        fetchSavedRecords();
                        setFirebaseModalOpen(true);
                        setDrawerOpen(false);
                        setDrawerSearch("");
                      }}
                      className="w-full text-right p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border group active:scale-[0.98] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/25 border-orange-400/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-xl shadow-inner group-hover:scale-110 transition-transform">
                          🔥
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{t.firebase_records_btn}</span>
                            <span className="text-[10px] bg-black/30 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-black border border-white/20">
                              {savedRecords.length} {lang === "en" ? "links" : lang === "ur" ? "لنکس" : "روابط"}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/90 font-medium mt-0.5 line-clamp-1">
                            {lang === "en"
                              ? "View, copy shareable links & delete saved records"
                              : lang === "ur"
                              ? "محفوظ شدہ لنکس دیکھیں، کاپی کریں اور ڈیلیٹ کریں"
                              : "عرض ونسخ الروابط العامة وحذف السجلات المحفوظة"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-white/80 font-bold group-hover:translate-x-[-2px] transition-transform">
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

                  {/* Jump 0: Serial & Unified Number (Public Link) */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("document");
                      setDrawerOpen(false);
                      setDrawerSearch("");
                      setTimeout(() => {
                        const el = document.getElementById("serial-number-input");
                        if (el) {
                          el.focus();
                          el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }, 100);
                    }}
                    className="p-3 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/70 hover:border-blue-400 hover:bg-blue-100/60 text-slate-700 transition-all text-right cursor-pointer flex flex-col justify-between group shadow-2xs active:scale-95 col-span-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                          🔢
                        </span>
                        <span className="font-black text-xs text-blue-950 group-hover:text-blue-700 truncate">
                          {lang === "en"
                            ? "Serial & Unified Number (Link)"
                            : lang === "ur"
                            ? "سیریل اور یونیفائیڈ نمبر (لنک)"
                            : "الرقم التسلسلي والموحد (رابط البوابة)"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md" dir="ltr">
                        /{config.serialNumber?.trim() || "..."}/{config.unifiedNumber?.trim() || "..."}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block text-right font-sans">
                      {lang === "en"
                        ? `Serial: ${config.serialNumber || "—"} | Unified: ${config.unifiedNumber || "—"}`
                        : lang === "ur"
                        ? `سیریل: ${config.serialNumber || "—"} | قومی نمبر: ${config.unifiedNumber || "—"}`
                        : `التسلسلي: ${config.serialNumber || "—"} | الموحد: ${config.unifiedNumber || "—"}`}
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
                      href={getPublicLink(config)}
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
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🌟 ULTRA-PREMIUM, BALANCED, 100% RESPONSIVE STICKY HEADER  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all select-none">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
          {/* Left: Brand Identity & Drawer Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            {/* Main Drawer Menu Toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0 active:scale-95 group ring-2 ring-blue-500/20"
              title={lang === "en" ? "Open Navigation Menu (Escape to close)" : lang === "ur" ? "مینیو دراز کھولیں" : "فتح القائمة"}
            >
              <div className="w-4 h-4 flex flex-col justify-center gap-1">
                <span className="h-0.5 w-4 bg-white rounded-full transition-all duration-300 group-hover:w-2.5" />
                <span className="h-0.5 w-4 bg-white rounded-full" />
                <span className="h-0.5 w-3 bg-white rounded-full transition-all duration-300 group-hover:w-4" />
              </div>
              <span className="hidden sm:inline">
                {lang === "en" ? "Menu" : lang === "ur" ? "مینیو" : "القائمة"}
              </span>
            </button>

            {/* Glowing Brand Icon */}
            <div className="relative group shrink-0 hidden xs:flex">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs sm:text-sm shadow-xs border border-slate-800 transition-transform group-hover:scale-105">
                ⚡
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {/* Portal Title & Active Section Badge */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight truncate min-w-0">
                {/* On small mobile (< sm): clean concise title, on desktop: full title */}
                <span className="sm:hidden">
                  {lang === "en" ? "Portal Admin" : lang === "ur" ? "ایڈمن پینل" : "لوحة التحكم"}
                </span>
                <span className="hidden sm:inline">
                  {t.title}
                </span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeTab === "buttons" && t.tab_buttons}
                {activeTab === "document" && t.tab_document}
                {activeTab === "preview" && t.tab_preview}
                {activeTab === "footer" && t.tab_footer}
                {activeTab === "settings" && t.tab_settings}
              </span>
            </div>
          </div>

          {/* Right: Language Switcher, Preview, and Save Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => handleLanguageChange("ar")}
                className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                  lang === "ar"
                    ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
                title="العربية (Arabic)"
              >
                <span>🇸🇦</span>
                <span className="hidden md:inline text-[11px]">عربية</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                  lang === "en"
                    ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
                title="English (English)"
              >
                <span>🇬🇧</span>
                <span className="hidden md:inline text-[11px]">EN</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("ur")}
                className={`h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs active:scale-95 ${
                  lang === "ur"
                    ? "bg-white text-blue-700 shadow-xs font-black ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
                title="اردو (Urdu)"
              >
                <span>🇵🇰</span>
                <span className="hidden md:inline text-[11px]">اردو</span>
              </button>
            </div>

            {/* Discard Unsaved Changes (Only when dirty) */}
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="h-8 sm:h-9 px-2 sm:px-3 rounded-2xl text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs active:scale-95"
                title={t.undo_changes}
              >
                <span className="text-xs font-black">✕</span>
                <span className="hidden sm:inline">{t.undo_changes}</span>
              </button>
            )}

            {/* Preview & Portal Link Controls */}
            <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuickPreviewOpen(true)}
                className="h-7 sm:h-8 w-7 sm:w-8 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-white transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:shadow-xs"
                title={t.quick_preview}
              >
                <IconPreview className="w-3.5 h-3.5" />
              </button>
              <Link
                href={getPublicLink(config)}
                target="_blank"
                className="h-7 sm:h-8 w-7 sm:w-8 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-white transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:shadow-xs group"
                title={t.preview_btn}
              >
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            {/* Firebase Saved Records Header Shortcut Button */}
            <button
              type="button"
              onClick={() => {
                fetchSavedRecords();
                setFirebaseModalOpen(true);
              }}
              className="h-8 sm:h-9 md:h-10 px-2.5 sm:px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 hover:text-amber-800 border border-amber-300/80 transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs shrink-0 active:scale-95 shadow-2xs"
              title={t.firebase_records_title}
            >
              <span className="text-sm">🔥</span>
              <span className="hidden lg:inline font-black">{t.firebase_records_btn}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs leading-none">
                {savedRecords.length}
              </span>
            </button>

            {/* Primary Save Button (100% visible on all viewports, never cut off) */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`h-8 sm:h-9 md:h-10 px-2.5 sm:px-4 md:px-5 rounded-2xl text-xs font-black text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0 ${
                hasUnsavedChanges
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
              }`}
              title={t.shortcut_hint}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="hidden xs:inline">{t.saving_btn}</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">
                    {lang === "en" ? "Save" : lang === "ur" ? "محفوظ" : "حفظ"}
                  </span>
                  <span className="hidden sm:inline">
                    {t.save_btn}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ MAIN CONTENT BODY ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">


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
                            title={lang === "en" ? "Attach link and view in Google Drive" : lang === "ur" ? "لنک منسلک کریں اور ڈرائیو دیکھیں" : "تطبيق الرابط والعرض في Drive"}
                          >
                            <span>✓</span>
                            <span className="hidden sm:inline">{lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}</span>
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
                            title={lang === "en" ? "Attach link and view in Google Drive" : lang === "ur" ? "لنک منسلک کریں اور ڈرائیو دیکھیں" : "تطبيق الرابط والعرض في Drive"}
                          >
                            <span>✓</span>
                            <span className="hidden sm:inline">{lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}</span>
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
                            title={lang === "en" ? "Attach link and view in Google Drive" : lang === "ur" ? "لنک منسلک کریں اور ڈرائیو دیکھیں" : "تطبيق الرابط والعرض في Drive"}
                          >
                            <span>✓</span>
                            <span className="hidden sm:inline">{lang === "en" ? "Link" : lang === "ur" ? "لنک کریں" : "ربط"}</span>
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

            {/* 🌟 Dedicated Option Card: الرقم التسلسلي (Serial Number) */}
            <div
              className={`rounded-3xl border p-6 sm:p-7 shadow-sm transition-all ${
                serialError
                  ? "bg-rose-50/60 border-rose-400 ring-2 ring-rose-300"
                  : "bg-white border-slate-200/90 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    🔢
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>{t.serial_number}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                        {lang === "en" ? "Required to Save" : lang === "ur" ? "سیو کیلئے لازمی" : "إجباري للحفظ"}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Direct Shortcut to Firebase Saved Records Modal */}
                <button
                  type="button"
                  onClick={() => {
                    fetchSavedRecords();
                    setFirebaseModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  title={t.firebase_records_title}
                >
                  <span>🔥</span>
                  <span>{t.firebase_records_btn}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-black/20 text-white">
                    {savedRecords.length}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t.serial_number_hint}
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute inset-y-0 start-3.5 flex items-center text-slate-400 font-mono text-sm pointer-events-none">
                    /
                  </span>
                  <input
                    id="serial-number-input"
                    type="text"
                    dir="ltr"
                    value={config.serialNumber || ""}
                    onChange={(e) => {
                      setSerialError(false);
                      setConfig({ ...config, serialNumber: e.target.value });
                    }}
                    placeholder={
                      lang === "en"
                        ? "Enter Serial Number (e.g. 7032840279 or 13255887)"
                        : lang === "ur"
                        ? "سیریل نمبر درج کریں (مثال: 7032840279 یا 13255887)"
                        : "أدخل الرقم التسلسلي هنا (مثال: 7032840279 أو 13255887)"
                    }
                    className={`w-full ps-8 pe-4 py-3 rounded-2xl border text-sm font-mono font-bold transition-all focus:outline-none ${
                      serialError
                        ? "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400 focus:ring-rose-500"
                        : "border-slate-200 bg-slate-50/60 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                </div>

                {serialError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 animate-bounce">
                    <span>⚠️</span>
                    <span>{t.serial_number_required_error}</span>
                  </p>
                )}

                {/* Dynamic Live URL Output Preview: /{serialNumber}/{unifiedNumber} */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-blue-50/80 border border-blue-200/90 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <span className="text-blue-600 font-bold text-sm shrink-0">🔗</span>
                    <span className="font-bold text-slate-700 shrink-0">
                      {lang === "en" ? "Public Link:" : lang === "ur" ? "پبلک لنک:" : "رابط البوابة الرئيسي:"}
                    </span>
                    <span className="font-mono font-black text-blue-800 truncate" dir="ltr">
                      /{config.serialNumber?.trim() || (lang === "en" ? "[serial]" : lang === "ur" ? "[سیریل]" : "[الرقم-التسلسلي]")}
                      /{config.unifiedNumber?.trim() || (lang === "en" ? "[unified]" : lang === "ur" ? "[یونیفائیڈ]" : "[الرقم-الموحد]")}
                    </span>
                  </div>

                  {config.serialNumber?.trim() && (
                    <Link
                      href={getPublicLink(config)}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] no-underline shadow-xs transition-all flex items-center gap-1 shrink-0 active:scale-95"
                    >
                      <span>{lang === "en" ? "Test Link ↗" : lang === "ur" ? "لنک چیک کریں ↗" : "تجربة الرابط ↗"}</span>
                    </Link>
                  )}
                </div>
              </div>
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      {t.unified_number}
                    </label>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                      {lang === "en" ? "Change required to save" : lang === "ur" ? "سیو کیلئے تبدیل کرنا لازمی" : "يلزم تغييره لحفظ التعديلات"}
                    </span>
                  </div>
                  <input
                    id="unified-number-input"
                    type="text"
                    dir="ltr"
                    value={config.unifiedNumber}
                    onChange={(e) => {
                      setUnifiedError(null);
                      setConfig({ ...config, unifiedNumber: e.target.value });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none transition-all ${
                      unifiedError
                        ? "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400 focus:ring-rose-500"
                        : "border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    }`}
                  />
                  {unifiedError && (
                    <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-1.5 animate-bounce">
                      <span>⚠️</span>
                      <span>{unifiedError}</span>
                    </p>
                  )}
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
                onClick={handleDiscardChanges}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400/40 border border-white/15 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
              >
                ✕ {t.undo_changes}
              </button>
              <button
                type="button"
                onClick={handleSave}
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
      )}
    </div>
  );
}
