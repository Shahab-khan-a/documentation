"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DEFAULT_PORTAL_CONFIG } from "@/constants/defaults";
import { PortalConfig, PortalRecord } from "@/types/portal";
import { ADMIN_TRANSLATIONS, AdminLanguage } from "@/constants/translations";
import {
  saveConfigToFirebase,
  savePortalRecordToFirebase,
  deletePortalRecordFromFirebase,
  getAllPortalRecordsFromFirebase,
  sanitizeFirestoreData,
} from "@/lib/firebase";
import { DriveItem } from "@/hooks/useGoogleDrive";
import { ToastNotification } from "@/components/ui/ToastNotification";
import { FirebaseRecordsModal } from "@/components/FirebaseRecordsModal";
import { UploadProgressModal } from "@/components/UploadProgressModal";
import { UploadSuccessModal } from "@/components/UploadSuccessModal";
import { GoogleDriveManagerModal } from "@/components/admin/GoogleDriveManagerModal";
import { QuickPreviewModal } from "@/components/admin/QuickPreviewModal";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebarDrawer } from "@/components/admin/AdminSidebarDrawer";
import { ButtonsAndFilesTab } from "@/components/admin/ButtonsAndFilesTab";
import { DocumentDetailsTab } from "@/components/admin/DocumentDetailsTab";
import { PublicPreviewPane } from "@/components/admin/PublicPreviewPane";
import { FooterAndSocialTab } from "@/components/admin/FooterAndSocialTab";
import { SettingsAndTimersTab } from "@/components/admin/SettingsAndTimersTab";
import { FloatingUnsavedDock } from "@/components/admin/FloatingUnsavedDock";
import { AdminPasswordScreen } from "@/components/admin/AdminPasswordScreen";

export default function AdminDashboard() {
  // Password protection for admin panel ("swati")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem("admin_auth");
      const localAuth = localStorage.getItem("admin_auth");
      if (sessionAuth === "swati" || localAuth === "swati") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      sessionStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_auth");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  }, []);

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

  // Language for admin panel (persisted in localStorage)
  const [lang, setLang] = useState<AdminLanguage>("ar");
  const [activeTab, setActiveTab] = useState<
    "buttons" | "document" | "preview" | "footer" | "settings"
  >("document");
  const [lastUploadedButton, setLastUploadedButton] = useState<
    "backButton" | "verifyAgainButton" | "downloadButton"
  >("downloadButton");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isDragOverBtn, setIsDragOverBtn] = useState<string | null>(null);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [serialError, setSerialError] = useState(false);
  const [unifiedError, setUnifiedError] = useState<string | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // ─── FIREBASE SAVED RECORDS & LINKS STATE ───
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [savedRecords, setSavedRecords] = useState<PortalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [copiedRecordId, setCopiedRecordId] = useState<string | null>(null);

  // ─── GOOGLE DRIVE FILE PICKER & CLOUD MANAGER STATE ───
  const [drivePickerTarget, setDrivePickerTarget] = useState<
    "backButton" | "verifyAgainButton" | "downloadButton" | null
  >(null);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDriveFiles, setLoadingDriveFiles] = useState(false);
  const [driveConfigured, setDriveConfigured] = useState(true);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveItem | null>(null);
  const [updatingFileId, setUpdatingFileId] = useState<string | null>(null);

  // ─── UPLOAD PROGRESS & CELEBRATION SUCCESS POPUP MODALS STATE ───
  const [uploadProgressModalOpen, setUploadProgressModalOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadProgressFileName, setUploadProgressFileName] = useState("");
  const [uploadProgressFileSize, setUploadProgressFileSize] = useState<number | undefined>(
    undefined
  );
  const [uploadProgressButtonTitle, setUploadProgressButtonTitle] = useState("");
  const [uploadProgressStatus, setUploadProgressStatus] = useState<string | undefined>(undefined);
  const [uploadSuccessModalOpen, setUploadSuccessModalOpen] = useState(false);
  const [savedSuccessDetails, setSavedSuccessDetails] = useState<{
    fileName: string;
    fileSize?: number;
    fileUrl?: string;
    driveViewLink?: string;
    buttonTitle?: string;
  } | null>(null);

  const fetchDriveFiles = useCallback(async () => {
    setLoadingDriveFiles(true);
    try {
      const res = await fetch("/api/drive");
      const data = await res.json();
      if (data.configured !== undefined) {
        setDriveConfigured(Boolean(data.configured));
      }
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
      // 1. Fetch direct from Firestore on client
      try {
        const fbRecs = await getAllPortalRecordsFromFirebase();
        if (Array.isArray(fbRecs)) {
          setSavedRecords(fbRecs);
        }
      } catch (fbErr) {
        console.warn("Direct Firestore fetch records notice:", fbErr);
      }

      // 2. Fetch from API endpoint
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

  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const fileInputVerifyRef = useRef<HTMLInputElement>(null);
  const fileInputDownloadRef = useRef<HTMLInputElement>(null);
  const fieldCounterRef = useRef(1);

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
        if (
          active &&
          savedLang &&
          (savedLang === "ar" || savedLang === "en" || savedLang === "ur")
        ) {
          setLang(savedLang);
        }
        const savedEditingId = localStorage.getItem("admin_editing_record_id");
        if (active && savedEditingId) {
          setEditingRecordId(savedEditingId);
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
          if (driveData.configured !== undefined) {
            setDriveConfigured(Boolean(driveData.configured));
          }
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

  // Helper to compute public URL with dynamic requestNumber and serial numbers (without unified number)
  const getPublicLink = useCallback((conf: PortalConfig | PortalRecord) => {
    const req = conf.requestNumber?.trim() || "13255887";
    const s = conf.serialNumber?.trim();
    const recId = (conf as any).id;
    const query = recId && typeof recId === "string" && recId.startsWith("rec_") ? `?id=${encodeURIComponent(recId)}` : "";
    if (s) {
      return `/sa/#/DocumentVerify/${encodeURIComponent(req)}/mem/${encodeURIComponent(s)}${query}`;
    }
    return `/sa/#/DocumentVerify/${encodeURIComponent(req)}/mem${query}`;
  }, []);

  const handleDeleteRecord = async (record: PortalRecord) => {
    const cleanId = (record.id || "").trim();
    const cleanSerial = (record.serialNumber || "").trim();
    const cleanUnified = (record.unifiedNumber || "").trim();
    const cleanReq = (record.requestNumber || "").trim();

    setDeletingRecordId(cleanId);

    // Instant Optimistic UI Update: Remove ONLY this exact card from UI immediately!
    setSavedRecords((prev) =>
      prev.filter((r) => {
        if (cleanId && (r.id === cleanId || r.currentRecordId === cleanId)) return false;
        return true;
      })
    );

    // If currently loaded in editor, clear editingRecordId
    if (editingRecordId && (editingRecordId === cleanId || editingRecordId === cleanSerial)) {
      setEditingRecordId(null);
      try {
        localStorage.removeItem("admin_editing_record_id");
      } catch {}
    }

    try {
      // 1. Delete all Firestore document variations (id, serial, composite) directly on client
      try {
        await deletePortalRecordFromFirebase(record, cleanSerial, cleanUnified, cleanReq);
      } catch (fbErr) {
        console.warn("Client delete warning:", fbErr);
      }

      // 2. Delete from server API & memory
      const queryParams = new URLSearchParams();
      if (cleanId) queryParams.set("id", cleanId);
      if (cleanSerial) queryParams.set("serial", cleanSerial);
      if (cleanUnified) queryParams.set("unified", cleanUnified);
      if (cleanReq) queryParams.set("req", cleanReq);

      await fetch(`/api/records?${queryParams.toString()}`, {
        method: "DELETE",
      }).catch((err) => {
        console.warn("Server delete warning:", err);
      });

      // 3. Re-fetch from Firebase to ensure full verification
      await fetchSavedRecords();

      showToast(
        lang === "en"
          ? "Record deleted successfully from Firebase!"
          : lang === "ur"
          ? "ریکارڈ Firebase سے کامیابی سے ڈیلیٹ کر دیا گیا!"
          : "تم حذف السجل بنجاح ونهائياً من Firebase!",
        "success"
      );
    } catch (err) {
      console.warn("Delete record handled error:", err);
    } finally {
      setDeletingRecordId(null);
    }
  };

  const handleCopyRecordLink = (record: PortalRecord) => {
    if (typeof window === "undefined") return;
    const path = getPublicLink(record);
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
    try {
      localStorage.setItem("admin_editing_record_id", record.id);
    } catch {}
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

  const handleCreateSampleRecord = useCallback(async () => {
    const randomSerial = String(Math.floor(100000 + Math.random() * 900000));
    const randomUnified = `70${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newSample: PortalConfig = {
      ...DEFAULT_PORTAL_CONFIG,
      chamberName: "ينبع",
      facilityName: "",
      facilitySubName: "",
      serialNumber: randomSerial,
      unifiedNumber: randomUnified,
      requestNumber: "",
      requestType: "طلب مفتوح ملف",
      applicantName: "",
      commercialRegNo: "",
      requestStatus: "تم قبول الطلب وساري",
      statusColor: "#32c5cb",
    };

    try {
      setLoadingRecords(true);

      // Direct Firebase save on client
      try {
        await savePortalRecordToFirebase(newSample);
      } catch (fbErr) {
        console.warn("Direct Firebase sample save notice:", fbErr);
      }

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
  }, [fetchSavedRecords, lang, showToast]);

  const confirmDeleteDriveFile = async (file: DriveItem) => {
    setDeletingFileId(file.id);
    try {
      const res = await fetch(
        `/api/drive?fileId=${encodeURIComponent(file.id)}&fileName=${encodeURIComponent(
          file.name
        )}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));

        setConfig((prev) => {
          let hasChange = false;
          const updated = { ...prev };
          const keys: ("backButton" | "verifyAgainButton" | "downloadButton")[] = [
            "backButton",
            "verifyAgainButton",
            "downloadButton",
          ];
          for (const k of keys) {
            if (updated[k]?.fileName === file.name || updated[k]?.fileUrl?.includes(file.id)) {
              hasChange = true;
              const updatedBtn = { ...updated[k] };
              delete updatedBtn.fileUrl;
              delete updatedBtn.fileName;
              delete updatedBtn.fileSize;
              updatedBtn.actionType = "link";
              updated[k] = updatedBtn;
            }
          }
          return hasChange ? updated : prev;
        });

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
          data.error ||
            (lang === "en"
              ? "Failed to delete file from Google Drive"
              : "فائل ڈیلیٹ نہیں ہو سکی"),
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

  // Helper to persist updated configuration immediately to server & disk & Firebase
  const autoSaveConfig = useCallback(async (newConfig: PortalConfig) => {
    const sanitized = sanitizeFirestoreData(newConfig);
    setConfig(sanitized);
    setInitialConfig(sanitized);
    const cleanSerial = (sanitized.serialNumber || "").trim();
    const cleanUnified = (sanitized.unifiedNumber || "").trim();
    const recId = cleanSerial && cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;
    try {
      localStorage.setItem("portal_config_cache", JSON.stringify(sanitized));
      if (cleanSerial) {
        saveConfigToFirebase(sanitized).catch(() => {});
        savePortalRecordToFirebase(sanitized, recId).catch(() => {});
      }
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });
    } catch (err) {
      console.error("autoSaveConfig failed:", err);
    }
  }, []);

  const handleUpdateDriveFile = async (fileToUpdate: DriveItem, newFile: File) => {
    setUpdatingFileId(fileToUpdate.id);
    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("replaceFileId", fileToUpdate.id);

    showToast(
      lang === "en"
        ? `Updating "${fileToUpdate.name}" in Google Drive...`
        : lang === "ur"
        ? `گوگل ڈرائیو میں "${fileToUpdate.name}" اپ ڈیٹ ہو رہی ہے...`
        : `جاري تحديث "${fileToUpdate.name}" في Google Drive...`,
      "info"
    );

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig((prev) => {
          let hasChange = false;
          const updated = { ...prev };
          const keys: ("backButton" | "verifyAgainButton" | "downloadButton")[] = [
            "backButton",
            "verifyAgainButton",
            "downloadButton",
          ];
          for (const k of keys) {
            if (
              updated[k]?.fileUrl?.includes(fileToUpdate.id) ||
              updated[k]?.fileName === fileToUpdate.name
            ) {
              hasChange = true;
              updated[k] = {
                ...updated[k],
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
              };
            }
          }
          if (hasChange) {
            autoSaveConfig(updated);
            return updated;
          }
          return prev;
        });

        showToast(
          lang === "en"
            ? `File "${data.fileName}" updated successfully in Google Drive!`
            : lang === "ur"
            ? `فائل "${data.fileName}" گوگل ڈرائیو میں کامیابی سے اپ ڈیٹ ہو گئی!`
            : `تم تحديث الملف "${data.fileName}" بنجاح في Google Drive!`,
          "success"
        );
        fetchDriveFiles();
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch (err) {
      console.error("Update drive file error:", err);
      showToast(
        lang === "en" ? "Failed to update file in Google Drive" : "فائل اپ ڈیٹ کرنے میں ناکامی",
        "error"
      );
    } finally {
      setUpdatingFileId(null);
    }
  };

  const getButtonDisplayTitle = useCallback(
    (key: "backButton" | "verifyAgainButton" | "downloadButton") => {
      if (key === "downloadButton") {
        return lang === "en"
          ? "Button #3 - Download"
          : lang === "ur"
          ? "بٹن #3 - ڈاؤن لوڈ"
          : "زر التحميل (الزر 3)";
      }
      if (key === "verifyAgainButton") {
        return lang === "en"
          ? "Button #2 - Verify Again"
          : lang === "ur"
          ? "بٹن #2 - دوبارہ تصدیق"
          : "زر إعادة التحقق (الزر 2)";
      }
      return lang === "en"
        ? "Button #1 - Back"
        : lang === "ur"
        ? "بٹن #1 - رجوع"
        : "زر العودة (الزر 1)";
    },
    [lang]
  );

  const handleUploadDirectToDrive = async (file: File) => {
    const btnTitle =
      lang === "en"
        ? "Google Drive Cloud (website file)"
        : lang === "ur"
        ? "گوگل ڈرائیو کلاؤڈ (website file)"
        : "سحابة Google Drive (website file)";

    setUploadProgressFileName(file.name);
    setUploadProgressFileSize(file.size);
    setUploadProgressButtonTitle(btnTitle);
    setUploadProgressStatus(undefined);
    setUploadPercentage(5);
    setUploadProgressModalOpen(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 75) + 10;
        setUploadPercentage(Math.min(percent, 85));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadPercentage(95);
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            setUploadPercentage(100);
            fetchDriveFiles();
            setSavedSuccessDetails({
              fileName: data.fileName || file.name,
              fileSize: data.fileSize || file.size,
              fileUrl: data.fileUrl,
              driveViewLink:
                data.driveViewLink ||
                (data.driveFileId
                  ? `https://drive.google.com/file/d/${data.driveFileId}/view`
                  : "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl"),
              buttonTitle: btnTitle,
            });

            setTimeout(() => {
              setUploadProgressModalOpen(false);
              setUploadSuccessModalOpen(true);
            }, 600);
          } else {
            setUploadProgressModalOpen(false);
            showToast(data.error || "Upload failed", "error");
          }
        } catch {
          setUploadProgressModalOpen(false);
          showToast("Upload response parse error", "error");
        }
      } else {
        setUploadProgressModalOpen(false);
        showToast("Upload failed with status " + xhr.status, "error");
      }
    };

    xhr.onerror = () => {
      setUploadProgressModalOpen(false);
      showToast("Network error uploading file", "error");
    };

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  };

  const handleAssignFileToButton = async (
    btnKey: "backButton" | "verifyAgainButton" | "downloadButton",
    file: DriveItem
  ) => {
    setLastUploadedButton(btnKey);
    const updatedBtn = {
      ...config[btnKey],
      actionType: "file" as const,
      fileUrl: file.downloadUrl,
      fileName: file.name,
    };
    if (file.size && parseInt(file.size) > 0) {
      updatedBtn.fileSize = parseInt(file.size);
    } else {
      delete updatedBtn.fileSize;
    }
    const updated: PortalConfig = {
      ...config,
      [btnKey]: updatedBtn,
    };
    await autoSaveConfig(updated);
    const btnLabel =
      btnKey === "downloadButton"
        ? lang === "en"
          ? "Download Button"
          : lang === "ur"
          ? "ڈاؤن لوڈ بٹن"
          : "زر التحميل"
        : btnKey === "verifyAgainButton"
        ? lang === "en"
          ? "Verify Again Button"
          : lang === "ur"
          ? "التحقق مرة آخرى بٹن"
          : "زر التحقق مرة آخرى"
        : lang === "en"
        ? "Back Button"
        : lang === "ur"
        ? "العودة بٹن"
        : "زر العودة";

    showToast(
      lang === "en"
        ? `Linked "${file.name}" to ${btnLabel}!`
        : lang === "ur"
        ? `فائل "${file.name}" کو ${btnLabel} سے منسلک کر دیا گیا!`
        : `تم ربط "${file.name}" بـ ${btnLabel} بنجاح!`,
      "success"
    );
  };

  const handleSave = useCallback(async () => {
    const isFooterOrSettings = activeTab === "footer" || activeTab === "settings";
    let cleanSerial = (config.serialNumber || "").trim();
    let cleanUnified = (config.unifiedNumber || "").trim();

    if (!cleanSerial && isFooterOrSettings) {
      cleanSerial = (initialConfig.serialNumber || "").trim() || "11111112773fdgc";
    }

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

    if (!cleanUnified && isFooterOrSettings) {
      cleanUnified = (initialConfig.unifiedNumber || "").trim() || "7025562547";
    }

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

    setUnifiedError(null);
    setSaving(true);

    const isButtonsTab = activeTab === "buttons";
    const attachedButtonKey: ("downloadButton" | "verifyAgainButton" | "backButton") | null =
      config[lastUploadedButton]?.actionType === "file" && config[lastUploadedButton]?.fileName
        ? lastUploadedButton
        : config.downloadButton?.actionType === "file" && config.downloadButton?.fileName
        ? "downloadButton"
        : config.verifyAgainButton?.actionType === "file" && config.verifyAgainButton?.fileName
        ? "verifyAgainButton"
        : config.backButton?.actionType === "file" && config.backButton?.fileName
        ? "backButton"
        : null;

    if (isButtonsTab && attachedButtonKey) {
      const activeBtn = config[attachedButtonKey];
      setUploadProgressFileName(activeBtn?.fileName || "document.pdf");
      setUploadProgressFileSize(activeBtn?.fileSize);
      setUploadProgressButtonTitle(getButtonDisplayTitle(attachedButtonKey));
      setUploadProgressStatus(undefined);
      setUploadPercentage(15);
      setUploadProgressModalOpen(true);
    }

    const cleanReq = (config.requestNumber || "").trim();
    const isRecRecord = Boolean(editingRecordId && editingRecordId.startsWith("rec_"));
    const effectiveRecordId = isRecRecord
      ? editingRecordId!
      : cleanUnified
      ? `${cleanSerial}_${cleanUnified}`
      : cleanSerial;

    try {
      // 1. If editing an existing standard record and the ID changed, clean up previous document from Firebase
      if (editingRecordId && editingRecordId !== effectiveRecordId && !isRecRecord) {
        try {
          await deletePortalRecordFromFirebase(
            editingRecordId,
            initialConfig.serialNumber,
            initialConfig.unifiedNumber,
            initialConfig.requestNumber
          );
          const delParams = new URLSearchParams();
          delParams.set("id", editingRecordId);
          if (initialConfig.serialNumber) delParams.set("serial", initialConfig.serialNumber);
          await fetch(`/api/records?${delParams.toString()}`, { method: "DELETE" }).catch(() => {});
        } catch (cleanupErr) {
          console.warn("Cleanup old record ID notice:", cleanupErr);
        }
      }

      const payload: PortalRecord = {
        ...config,
        id: effectiveRecordId,
        serialNumber: cleanSerial,
        unifiedNumber: cleanUnified,
        requestNumber: cleanReq,
        currentRecordId: effectiveRecordId,
        updatedAt: new Date().toISOString(),
        createdAt: (config as any).createdAt || (initialConfig as any).createdAt || new Date().toISOString(),
      };

      // 2. Direct Firebase Cloud Firestore save from client
      try {
        if (!isRecRecord) {
          await saveConfigToFirebase(payload);
        }
        await savePortalRecordToFirebase(payload, editingRecordId || effectiveRecordId);
      } catch (fbErr: unknown) {
        console.warn("Direct Firebase client save notice:", fbErr);
      }

      if (isButtonsTab && attachedButtonKey) {
        setUploadPercentage(55);
      }

      // 3. Server API route saves (syncs both /api/config and /api/records)
      const [res] = await Promise.all([
        fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          console.warn("Server records save warning:", err);
          return null;
        }),
      ]);

      if (isButtonsTab && attachedButtonKey) {
        setUploadPercentage(85);
      }

      if (res.ok) {
        const result = await res.json();
        const savedData = result.data || payload;
        setConfig(savedData);
        setInitialConfig(savedData);
        setEditingRecordId(effectiveRecordId);
        try {
          localStorage.setItem("admin_editing_record_id", effectiveRecordId);
          localStorage.setItem("portal_config_cache", JSON.stringify(savedData));
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "portal_config_cache",
              newValue: JSON.stringify(savedData),
            })
          );
        } catch {
          // ignore
        }

        // Instant Optimistic Update to savedRecords state for immediate modal reflect
        const recordForState: PortalRecord = {
          ...savedData,
          id: effectiveRecordId,
          serialNumber: cleanSerial,
          unifiedNumber: cleanUnified,
          requestNumber: cleanReq,
          updatedAt: new Date().toISOString(),
        };

        setSavedRecords((prev) => {
          const matchPredicate = (r: PortalRecord) =>
            r.id === effectiveRecordId ||
            (editingRecordId && (r.id === editingRecordId || r.currentRecordId === editingRecordId));

          const exists = prev.some(matchPredicate);
          if (exists) {
            return prev.map((r) => (matchPredicate(r) ? { ...r, ...recordForState } : r));
          } else {
            return [recordForState, ...prev];
          }
        });

        // Re-fetch from Firebase to verify
        fetchSavedRecords();

        const targetPath = getPublicLink(result.data);
        const fullLink =
          typeof window !== "undefined" ? `${window.location.origin}${targetPath}` : targetPath;

        showToast(
          lang === "en"
            ? `Form #${cleanSerial} saved successfully!`
            : lang === "ur"
            ? `فارم #${cleanSerial} کامیابی سے محفوظ ہو گیا!`
            : `تم حفظ النموذج #${cleanSerial} بنجاح!`,
          "success",
          fullLink,
          lang === "en"
            ? "View Live Form ↗"
            : lang === "ur"
            ? "لائیو فارم دیکھیں ↗"
            : "عرض النموذج ↗"
        );

        // WORKFLOW TRANSITION 1: If saving from Document Detail, switch directly to Buttons & Files
        if (activeTab === "document") {
          setActiveTab("buttons");
          setDrawerOpen(false);
        }

        // WORKFLOW TRANSITION 2: If saving from Buttons & Files with file, show celebration success modal!
        if (isButtonsTab && attachedButtonKey) {
          setUploadPercentage(100);
          const activeBtn = result.data[attachedButtonKey] || config[attachedButtonKey];
          const targetDriveUrl = activeBtn?.fileUrl?.includes("fileId=")
            ? `https://drive.google.com/file/d/${new URLSearchParams(
                activeBtn.fileUrl.split("?")[1] || ""
              ).get("fileId")}/view`
            : "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

          setSavedSuccessDetails({
            fileName: activeBtn?.fileName || "certificate.pdf",
            fileSize: activeBtn?.fileSize,
            fileUrl: activeBtn?.fileUrl,
            driveViewLink: targetDriveUrl,
            buttonTitle: getButtonDisplayTitle(attachedButtonKey),
          });

          setTimeout(() => {
            setUploadProgressModalOpen(false);
            setUploadSuccessModalOpen(true);
          }, 600);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setUploadProgressModalOpen(false);
        showToast(errJson.error || t.save_error, "error");
      }
    } catch (err) {
      console.error(err);
      setUploadProgressModalOpen(false);
      showToast(t.save_error, "error");
    } finally {
      setSaving(false);
    }
  }, [
    config,
    initialConfig,
    t,
    showToast,
    fetchSavedRecords,
    editingRecordId,
    getPublicLink,
    lang,
    activeTab,
    lastUploadedButton,
    getButtonDisplayTitle,
  ]);

  const handleDiscardChanges = () => {
    setConfig(initialConfig);
    showToast(
      lang === "en"
        ? "Changes discarded"
        : lang === "ur"
        ? "تبدیلیاں واپس لے لی گئیں"
        : "تم التراجع عن التعديلات",
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
        setQuickPreviewOpen(false);
        setDrivePickerTarget(null);
        setDriveModalOpen(false);
        setUploadSuccessModalOpen(false);
        setUploadProgressModalOpen(false);
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

  // Upload file handler for any button with percentage progress popup & celebration modal
  const handleFileUpload = async (
    buttonKey: "backButton" | "verifyAgainButton" | "downloadButton",
    file?: File | null
  ) => {
    if (!file) return;
    setLastUploadedButton(buttonKey);
    setUploadingBtn(buttonKey);

    const btnTitle = getButtonDisplayTitle(buttonKey);
    setUploadProgressFileName(file.name);
    setUploadProgressFileSize(file.size);
    setUploadProgressButtonTitle(btnTitle);
    setUploadProgressStatus(undefined);
    setUploadPercentage(5);
    setUploadProgressModalOpen(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 75) + 10;
        setUploadPercentage(Math.min(percent, 85));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadPercentage(95);
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            setUploadPercentage(100);

            const updated: PortalConfig = {
              ...config,
              [buttonKey]: {
                ...config[buttonKey],
                actionType: "file",
                fileUrl: data.fileUrl,
                fileName: data.fileName || file.name,
                fileSize: data.fileSize || file.size,
              },
            };
            await autoSaveConfig(updated);
            fetchDriveFiles();

            const targetDriveUrl =
              data.driveViewLink ||
              (data.driveFileId
                ? `https://drive.google.com/file/d/${data.driveFileId}/view`
                : "https://drive.google.com/drive/folders/1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl");

            setSavedSuccessDetails({
              fileName: data.fileName || file.name,
              fileSize: data.fileSize || file.size,
              fileUrl: data.fileUrl,
              driveViewLink: targetDriveUrl,
              buttonTitle: btnTitle,
            });

            setTimeout(() => {
              setUploadProgressModalOpen(false);
              setUploadSuccessModalOpen(true);
            }, 600);
          } else {
            setUploadProgressModalOpen(false);
            showToast(data.error || "Upload failed", "error");
          }
        } catch {
          setUploadProgressModalOpen(false);
          showToast("Upload response parse error", "error");
        }
      } else {
        setUploadProgressModalOpen(false);
        showToast("Upload failed with status " + xhr.status, "error");
      }
      setUploadingBtn(null);
    };

    xhr.onerror = () => {
      setUploadProgressModalOpen(false);
      setUploadingBtn(null);
      showToast("Network error uploading file", "error");
    };

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  };

  const updateButtonMode = async (
    buttonKey: "backButton" | "verifyAgainButton" | "downloadButton",
    actionType: "link" | "file" | "animation"
  ) => {
    const updatedBtn = { ...config[buttonKey], actionType };
    if (updatedBtn.fileSize === undefined) {
      delete updatedBtn.fileSize;
    }
    const updated: PortalConfig = {
      ...config,
      [buttonKey]: updatedBtn,
    };
    await autoSaveConfig(updated);
  };

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
    const updatedBtn = { ...config[buttonKey] };
    delete updatedBtn.fileSize;
    updatedBtn.actionType = "link";
    updatedBtn.fileUrl = "";
    updatedBtn.fileName = "";

    const updated: PortalConfig = {
      ...config,
      [buttonKey]: updatedBtn,
    };
    await autoSaveConfig(updated);
    showToast(
      lang === "en"
        ? "File removed from button"
        : lang === "ur"
        ? "فائل بٹن سے ہٹا دی گئی"
        : "تم حذف الملف من الزر",
      "info"
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0)
      return "0 " + (lang === "en" ? "KB" : lang === "ur" ? "کے بی" : "كيلوبايت");
    if (bytes < 1024) return bytes + (lang === "en" ? " B" : lang === "ur" ? " بائٹس" : " بايت");
    if (bytes < 1024 * 1024)
      return (
        (bytes / 1024).toFixed(1) +
        (lang === "en" ? " KB" : lang === "ur" ? " کے بی" : " كيلوبايت")
      );
    if (bytes < 1024 * 1024 * 1024)
      return (
        (bytes / (1024 * 1024)).toFixed(2) +
        (lang === "en" ? " MB" : lang === "ur" ? " ایم بی" : " ميجابايت")
      );
    if (bytes < 1024 * 1024 * 1024 * 1024)
      return (
        (bytes / (1024 * 1024 * 1024)).toFixed(2) +
        (lang === "en" ? " GB" : lang === "ur" ? " جی بی" : " جيجابايت")
      );
    return (
      (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) +
      (lang === "en" ? " TB" : lang === "ur" ? " ٹی بی" : " تيرابايت")
    );
  };

  if (isAuthenticated === null) {
    return (
      <div
        className="min-h-screen bg-slate-950 flex items-center justify-center text-white"
        dir="rtl"
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400" suppressHydrationWarning>
            التحقق من الصلاحيات...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <AdminPasswordScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-900 flex items-center justify-center"
        dir="rtl"
        suppressHydrationWarning
      >
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
      <ToastNotification toast={toast} onClose={() => setToast(null)} lang={lang} />

      {/* ═══════════════ QUICK MODAL PREVIEW OVERLAY ═══════════════ */}
      <QuickPreviewModal
        open={quickPreviewOpen}
        onClose={() => setQuickPreviewOpen(false)}
        config={config}
        publicLink={getPublicLink(config)}
        lang={lang}
        t={t}
      />

      {/* ═══════════════ GOOGLE DRIVE FILE PICKER & MANAGER MODAL ═══════════════ */}
      <GoogleDriveManagerModal
        open={Boolean(drivePickerTarget || driveModalOpen)}
        drivePickerTarget={drivePickerTarget}
        driveFiles={driveFiles}
        loadingDriveFiles={loadingDriveFiles}
        updatingFileId={updatingFileId}
        fileToDelete={fileToDelete}
        deletingFileId={deletingFileId}
        lang={lang}
        isRtl={isRtl}
        isConfigured={driveConfigured}
        onClose={() => {
          setDrivePickerTarget(null);
          setDriveModalOpen(false);
        }}
        onRefresh={fetchDriveFiles}
        onUploadDirect={handleUploadDirectToDrive}
        onUpdateFile={handleUpdateDriveFile}
        onSelectForTarget={async (target, file) => {
          setLastUploadedButton(target);
          const updatedBtn = {
            ...config[target],
            actionType: "file" as const,
            fileUrl: file.downloadUrl,
            fileName: file.name,
          };
          if (file.size && parseInt(file.size) > 0) {
            updatedBtn.fileSize = parseInt(file.size);
          } else {
            delete updatedBtn.fileSize;
          }
          const updated: PortalConfig = {
            ...config,
            [target]: updatedBtn,
          };
          await autoSaveConfig(updated);
          setDrivePickerTarget(null);
          setDriveModalOpen(false);
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
        }}
        onAssignToButton={handleAssignFileToButton}
        onRequestDelete={(file) => setFileToDelete(file)}
        onConfirmDelete={confirmDeleteDriveFile}
        onCancelDelete={() => setFileToDelete(null)}
        formatFileSize={formatFileSize}
      />

      {/* ═══════════════ UPLOAD PERCENTAGE PROGRESS POPUP MODAL ═══════════════ */}
      <UploadProgressModal
        open={uploadProgressModalOpen}
        percentage={uploadPercentage}
        fileName={uploadProgressFileName}
        fileSize={uploadProgressFileSize}
        targetButtonTitle={uploadProgressButtonTitle}
        lang={lang}
        statusText={uploadProgressStatus}
        onCancel={() => {
          setUploadProgressModalOpen(false);
          setUploadingBtn(null);
        }}
      />

      {/* ═══════════════ UPLOAD CELEBRATION SUCCESS POPUP MODAL ═══════════════ */}
      <UploadSuccessModal
        open={uploadSuccessModalOpen}
        onClose={() => setUploadSuccessModalOpen(false)}
        fileName={savedSuccessDetails?.fileName || "certificate.pdf"}
        fileSize={savedSuccessDetails?.fileSize}
        fileUrl={savedSuccessDetails?.fileUrl}
        driveViewLink={savedSuccessDetails?.driveViewLink}
        targetButtonTitle={savedSuccessDetails?.buttonTitle}
        lang={lang}
        mainPageUrl={getPublicLink(config)}
        onOpenDriveManager={() => {
          setDriveModalOpen(true);
          fetchDriveFiles();
        }}
      />

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

      {/* ═══════════════ SLIDE-OUT NAVIGATION DRAWER ═══════════════ */}
      <AdminSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        lang={lang}
        isRtl={isRtl}
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        onReset={handleReset}
        onQuickPreview={() => setQuickPreviewOpen(true)}
        publicLink={getPublicLink(config)}
        t={t}
      />

      {/* ═══════════════ STICKY HEADER ═══════════════ */}
      <AdminHeader
        lang={lang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onOpenDrawer={() => setDrawerOpen(true)}
        onQuickPreview={() => setQuickPreviewOpen(true)}
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={handleDiscardChanges}
        onSave={handleSave}
        saving={saving}
        savedRecordsCount={savedRecords.length}
        onOpenFirebaseRecords={() => {
          fetchSavedRecords();
          setFirebaseModalOpen(true);
        }}
        publicLink={getPublicLink(config)}
        t={t}
        onLogout={handleLogout}
      />

      {/* ═══════════════ MAIN CONTENT BODY ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: BUTTONS & FILES */}
        {activeTab === "buttons" && (
          <ButtonsAndFilesTab
            config={config}
            setConfig={setConfig}
            lang={lang}
            t={t}
            isDragOverBtn={isDragOverBtn}
            setIsDragOverBtn={setIsDragOverBtn}
            uploadingBtn={uploadingBtn}
            fileInputBackRef={fileInputBackRef}
            fileInputVerifyRef={fileInputVerifyRef}
            fileInputDownloadRef={fileInputDownloadRef}
            updateButtonMode={updateButtonMode}
            handleFileUpload={handleFileUpload}
            handleButtonLinkSave={handleButtonLinkSave}
            removeFile={removeFile}
            formatFileSize={formatFileSize}
            onOpenDriveForButton={(btn) => {
              setDrivePickerTarget(btn);
              fetchDriveFiles();
            }}
            onOpenDriveManager={() => {
              setDriveModalOpen(true);
              fetchDriveFiles();
            }}
          />
        )}

        {/* TAB 2: EDIT DOCUMENT DATA */}
        {activeTab === "document" && (
          <DocumentDetailsTab
            config={config}
            setConfig={setConfig}
            lang={lang}
            t={t}
            saving={saving}
            onSave={handleSave}
            serialError={serialError}
            setSerialError={setSerialError}
            unifiedError={unifiedError}
            setUnifiedError={setUnifiedError}
            onOpenFirebaseModal={() => {
              fetchSavedRecords();
              setFirebaseModalOpen(true);
            }}
            savedRecordsCount={savedRecords.length}
            handleAddCustomField={handleAddCustomField}
            handleAddPresetField={handleAddPresetField}
            handleUpdateCustomField={handleUpdateCustomField}
            handleRemoveCustomField={handleRemoveCustomField}
          />
        )}

        {/* TAB 3: LIVE PREVIEW */}
        {activeTab === "preview" && (
          <PublicPreviewPane
            config={config}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
            publicLink={getPublicLink(config)}
            t={t}
          />
        )}

        {/* TAB 4: FOOTER & SUPPORT */}
        {activeTab === "footer" && (
          <FooterAndSocialTab
            config={config}
            setConfig={setConfig}
            initialConfig={initialConfig}
            t={t}
            saving={saving}
            onSave={handleSave}
            lang={lang}
          />
        )}

        {/* TAB 5: TIMERS & SETTINGS */}
        {activeTab === "settings" && (
          <SettingsAndTimersTab
            config={config}
            setConfig={setConfig}
            t={t}
            saving={saving}
            onSave={handleSave}
            lang={lang}
          />
        )}
      </main>

      {/* ═══════════════ FLOATING BOTTOM UNSAVED CHANGES DOCK ═══════════════ */}
      <FloatingUnsavedDock
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onDiscard={handleDiscardChanges}
        onSave={handleSave}
        t={t}
      />
    </div>
  );
}
