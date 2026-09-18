"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PortalRecord } from "@/lib/portal-types";
import { AdminLanguage, TranslationStrings } from "@/lib/admin-translations";
import { getDualDomainUrls } from "@/lib/record-urls";

// ─────────────────────────────────────────────────────────────────
// CRISP MODERN SVG ICONS (CRYSTAL CLEAR ON ALL PLATFORMS & SCREENS)
// ─────────────────────────────────────────────────────────────────
function IconTrash({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
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

function IconExternalLink({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function IconEdit({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function IconSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function IconLinkChain({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

export interface FirebaseRecordsModalProps {
  open: boolean;
  onClose: () => void;
  savedRecords: PortalRecord[];
  loadingRecords: boolean;
  onRefresh: () => void;
  onDeleteRecord: (record: PortalRecord) => Promise<void> | void;
  onCopyRecordLink: (record: PortalRecord, domainType?: "org" | "com", url?: string) => void;
  onLoadRecordIntoEditor: (record: PortalRecord) => void;
  onCreateSampleRecord?: () => Promise<void> | void;
  deletingRecordId?: string | null;
  copiedRecordId?: string | null;
  lang: AdminLanguage;
  t: TranslationStrings;
}

export function FirebaseRecordsModal({
  open,
  onClose,
  savedRecords,
  loadingRecords,
  onRefresh,
  onDeleteRecord,
  onCopyRecordLink,
  onLoadRecordIntoEditor,
  onCreateSampleRecord,
  deletingRecordId,
  copiedRecordId,
  lang,
  t,
}: FirebaseRecordsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChamber, setSelectedChamber] = useState("ALL");
  const [recordToDelete, setRecordToDelete] = useState<PortalRecord | null>(null);
  const [isCreatingSample, setIsCreatingSample] = useState(false);
  const [internalCopiedKey, setInternalCopiedKey] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);


  const isRtl = lang === "ar" || lang === "ur";

  // Distinct chambers with counts
  const chamberStats = useMemo(() => {
    const map = new Map<string, number>();
    savedRecords.forEach((r) => {
      const ch = (r.chamberName || "").trim();
      if (ch) {
        map.set(ch, (map.get(ch) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [savedRecords]);

  // Multi-field filtered records
  const filteredRecords = useMemo(() => {
    return savedRecords.filter((record) => {
      if (selectedChamber !== "ALL" && (record.chamberName || "").trim() !== selectedChamber) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();

      const serial = (record.serialNumber || "").toLowerCase();
      const unified = (record.unifiedNumber || "").toLowerCase();
      const facility = (record.facilityName || "").toLowerCase();
      const facilitySub = (record.facilitySubName || "").toLowerCase();
      const chamber = (record.chamberName || "").toLowerCase();
      const applicant = (record.applicantName || "").toLowerCase();
      const reqNum = (record.requestNumber || "").toLowerCase();
      const reqType = (record.requestType || "").toLowerCase();
      const commReg = (record.commercialRegNo || "").toLowerCase();

      return (
        serial.includes(q) ||
        unified.includes(q) ||
        facility.includes(q) ||
        facilitySub.includes(q) ||
        chamber.includes(q) ||
        applicant.includes(q) ||
        reqNum.includes(q) ||
        reqType.includes(q) ||
        commReg.includes(q)
      );
    });
  }, [savedRecords, selectedChamber, searchQuery]);

  // Format date cleanly
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleTriggerSample = async () => {
    if (!onCreateSampleRecord) return;
    setIsCreatingSample(true);
    try {
      await onCreateSampleRecord();
    } finally {
      setIsCreatingSample(false);
    }
  };

  const handleBackupToDrive = async () => {
    setIsBackingUp(true);
    setBackupSuccessMsg(null);
    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const count = data.data?.totalRecords || savedRecords.length;
        const msg =
          lang === "en"
            ? `Backed up ${count} records to Primary & Secondary Google Drive!`
            : lang === "ur"
            ? `${count} ریکارڈز گوگل ڈرائیو میں محفوظ کر دیے گئے!`
            : `تم نسخ ${count} سجل احتياطياً إلى Google Drive بنجاح!`;
        setBackupSuccessMsg(msg);
        setTimeout(() => setBackupSuccessMsg(null), 5000);
      } else {
        alert(data.error || "Backup failed");
      }
    } catch {
      alert("Error triggering Drive backup");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await onDeleteRecord(recordToDelete);
    } finally {
      setRecordToDelete(null);
    }
  };

  const handleCopyUrl = (url: string, key: string, record: PortalRecord, domainType: "org" | "com") => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setInternalCopiedKey(key);
    setTimeout(() => {
      setInternalCopiedKey((prev) => (prev === key ? null : prev));
    }, 2500);

    if (onCopyRecordLink) {
      onCopyRecordLink(record, domainType, url);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100002] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 1. ULTRA-SLEEK MODERN HEADER (COMPACT, ATTRACTIVE, SINGLE ROW)  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-4 sm:px-6 py-3.5 sm:py-4 shrink-0 shadow-md border-b border-white/10">
          <div className="flex items-center justify-between gap-2.5">
            {/* Title Section */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-lg sm:text-xl shadow-md shadow-orange-500/25 shrink-0 border border-orange-300/30">
                🔥
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                    {t.firebase_records_title || "سجلات وروابط Firebase"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-orange-500/25 text-amber-300 border border-orange-400/40 shrink-0">
                    {savedRecords.length} {lang === "en" ? "Links" : lang === "ur" ? "لنکس" : "روابط"}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firestore Live
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/80 font-medium truncate hidden sm:block">
                  {t.firebase_records_desc}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {onCreateSampleRecord && (
                <button
                  type="button"
                  onClick={handleTriggerSample}
                  disabled={isCreatingSample || loadingRecords}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-blue-400/30"
                  title={lang === "en" ? "Add Sample Certificate" : lang === "ur" ? "نمونہ سرٹیفکیٹ شامل کریں" : "إضافة شهادة تجريبية"}
                >
                  <span className="text-sm leading-none">{isCreatingSample ? "⏳" : "+"}</span>
                  <span className="hidden sm:inline">
                    {lang === "en" ? "Sample" : lang === "ur" ? "نمونہ" : "شهادة تجريبية"}
                  </span>
                </button>
              )}

              {/* 🌟 Google Drive Master Backup Button */}
              <button
                type="button"
                onClick={handleBackupToDrive}
                disabled={isBackingUp || loadingRecords}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-emerald-400/30"
                title={
                  lang === "en"
                    ? "Backup all Firebase records to Google Drive"
                    : lang === "ur"
                    ? "گوگل ڈرائیو میں تمام ریکارڈز بیک اپ کریں"
                    : "نسخ احتياطي لكل السجلات إلى Google Drive"
                }
              >
                <span className={`text-sm leading-none ${isBackingUp ? "animate-spin" : ""}`}>
                  {isBackingUp ? "⏳" : "💾"}
                </span>
                <span className="hidden sm:inline">
                  {isBackingUp
                    ? lang === "en"
                      ? "Backing up..."
                      : lang === "ur"
                      ? "بیک اپ ہو رہا ہے..."
                      : "جاري النسخ..."
                    : lang === "en"
                    ? "Drive Backup"
                    : lang === "ur"
                    ? "ڈرائیو بیک اپ"
                    : "نسخ احتياطي"}
                </span>
              </button>

              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingRecords}
                className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-white/10 active:scale-95"
                title={lang === "en" ? "Refresh records" : lang === "ur" ? "تازہ کریں" : "تحديث القائمة"}
              >
                <svg
                  className={`w-3.5 h-3.5 ${loadingRecords ? "animate-spin text-orange-400" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden md:inline">
                  {lang === "en" ? "Refresh" : lang === "ur" ? "ریفریش" : "تحديث"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer transition-all border border-white/10 hover:rotate-90 active:scale-95"
                title={lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* 🌟 Backup Success Notification Banner */}
        {backupSuccessMsg && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200 shadow-inner shrink-0">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>{backupSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setBackupSuccessMsg(null)}
              className="text-white/80 hover:text-white text-sm cursor-pointer ps-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 2. SEARCH & CHAMBER FILTER TOOLBAR                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200/80 shrink-0 space-y-2.5">
          {/* Search Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 start-3 flex items-center text-slate-400 pointer-events-none">
                <IconSearch className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  t.search_records_placeholder ||
                  (lang === "en"
                    ? "Search serial, unified number, facility, chamber..."
                    : lang === "ur"
                    ? "سیریل نمبر، یونیفائیڈ، یا منشأة سے تلاش کریں..."
                    : "ابحث بالرقم التسلسلي، الرقم الموحد، أو اسم المنشأة...")
                }
                className="w-full ps-9 pe-8 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 end-2.5 flex items-center text-slate-400 hover:text-slate-700 text-xs font-black cursor-pointer px-1"
                  title="مسح البحث"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Match Counter Badge */}
            <div className="text-[11px] sm:text-xs font-black text-slate-600 bg-white px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs font-mono">
              <span className="text-blue-600">{filteredRecords.length}</span> / {savedRecords.length}
            </div>
          </div>

          {/* Chamber Quick Filter Chips */}
          {chamberStats.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold text-slate-600 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => setSelectedChamber("ALL")}
                className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 text-xs ${
                  selectedChamber === "ALL"
                    ? "bg-slate-900 text-white shadow-xs font-black"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span>{lang === "en" ? "All" : lang === "ur" ? "سب" : "الكل"}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedChamber === "ALL" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {savedRecords.length}
                </span>
              </button>

              {chamberStats.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedChamber(item.name)}
                  className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 text-xs ${
                    selectedChamber === item.name
                      ? "bg-blue-600 text-white shadow-xs font-black"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span>🏛️ {item.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      selectedChamber === item.name ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3. SCROLLABLE CARDS GRID (CLEAN, POLISHED, CLEAR ACTIONS)       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 bg-slate-50/60 custom-scrollbar overscroll-contain">
          {/* Loading State */}
          {loadingRecords && savedRecords.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-9 h-9 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {lang === "en" ? "Fetching records from Firebase..." : "جاري جلب السجلات من قاعدة بيانات Firebase..."}
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            /* Empty State */
            <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6 shadow-2xs max-w-md mx-auto">
              <span className="text-4xl block mb-2.5">📭</span>
              <p className="text-sm font-black text-slate-800 mb-1">
                {t.no_records_found}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-4">
                {searchQuery || selectedChamber !== "ALL"
                  ? lang === "en"
                    ? "No certificates match your search query."
                    : "لم يتم العثور على شهادات مطابقة للبحث."
                  : lang === "en"
                  ? "Enter a Serial Number in Document Details and click 'Save Changes' to create a link."
                  : "أدخل الرقم التسلسلي في تفاصيل الوثيقة واضغط حفظ التعديلات ليظهر الرابط هنا."}
              </p>
              <div className="flex items-center justify-center gap-2">
                {(searchQuery || selectedChamber !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedChamber("ALL");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === "en" ? "Clear Filters" : "مسح التصفية"}
                  </button>
                )}
                {onCreateSampleRecord && (
                  <button
                    type="button"
                    onClick={handleTriggerSample}
                    disabled={isCreatingSample}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingSample ? "⏳ جاري الإضافة..." : "➕ إضافة شهادة نموذجية"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Multi-Record Responsive Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredRecords.map((record) => {
                const cleanSerial = (record.serialNumber || "").trim();
                const cleanUnified = (record.unifiedNumber || "").trim();
                const cleanReq = (record.requestNumber || "").trim() || "13255887";
                const isCloned = Boolean(record.id && record.id.startsWith("rec_"));
                const queryParam = isCloned ? `?id=${encodeURIComponent(record.id)}` : "";
                const path = cleanSerial
                  ? `/sa/#/DocumentVerify/${encodeURIComponent(cleanReq)}/mem/${encodeURIComponent(cleanSerial)}${queryParam}`
                  : `/sa/#/DocumentVerify/${encodeURIComponent(cleanReq)}/mem${queryParam}`;
                const { orgUrl, comUrl } = getDualDomainUrls(path);
                const isOrgCopied =
                  internalCopiedKey === `${record.id}_org` ||
                  (copiedRecordId === record.id && !internalCopiedKey);
                const isComCopied = internalCopiedKey === `${record.id}_com`;
                const isDeleting = deletingRecordId === record.id;

                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all p-4 flex flex-col justify-between shadow-2xs gap-3 group relative overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div
                      className="absolute top-0 inset-x-0 h-1"
                      style={{ backgroundColor: record.statusColor || "#32c5cb" }}
                    />

                    <div>
                      {/* Top Badges Row: Serial, Unified, Status, Date */}
                      <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          {/* Serial Pill */}
                          <span
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-black text-[11px] border border-blue-200/80"
                            title="الرقم التسلسلي"
                          >
                            #{cleanSerial}
                          </span>

                          {/* Unified Pill */}
                          {cleanUnified && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono font-bold text-[11px] border border-purple-200/80"
                              title="الرقم الموحد"
                            >
                              700: {cleanUnified}
                            </span>
                          )}

                          {/* Status Pill */}
                          <span
                            className="font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 border shrink-0"
                            style={{
                              backgroundColor: `${record.statusColor || "#32c5cb"}15`,
                              color: record.statusColor || "#32c5cb",
                              borderColor: `${record.statusColor || "#32c5cb"}30`,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ backgroundColor: record.statusColor || "#32c5cb" }}
                            />
                            <span>{record.requestStatus || "ساري"}</span>
                          </span>
                        </div>

                        {/* Date */}
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>

                      {/* Facility & Chamber Details */}
                      <div className="space-y-0.5 mb-2.5">
                        <h4
                          className="font-black text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
                          title={record.facilityName}
                        >
                          {record.facilityName || "بدون اسم منشأة"}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                          <span className="font-bold text-slate-700 shrink-0">
                            🏛️ {record.chamberName || "الغرفة"}
                          </span>
                          {record.facilitySubName && (
                            <span className="text-slate-400 truncate">
                              • {record.facilitySubName}
                            </span>
                          )}
                        </div>

                        {/* Request & Commercial Reg Info (BiDi Isolated) */}
                        <div className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between gap-1 flex-wrap">
                          <span className="font-medium truncate">
                            📄 #{record.requestNumber} ({record.requestType || "توثيق"})
                          </span>
                          {record.commercialRegNo && (
                            <span className="text-slate-400 font-mono" dir="ltr">
                              CR: {record.commercialRegNo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ═══════════════════════════════════════════════════════════ */}
                      {/* DUAL DOMAIN PUBLIC URLS (.ORG AND .COM)                      */}
                      {/* ═══════════════════════════════════════════════════════════ */}
                      <div className="space-y-1.5">
                        {/* 1. .ORG URL Strip */}
                        <div
                          onClick={() => handleCopyUrl(orgUrl, `${record.id}_org`, record, "org")}
                          className={`p-2 rounded-xl border font-mono text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isOrgCopied
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                              : "bg-slate-50/90 hover:bg-indigo-50/70 border-slate-200/90 hover:border-indigo-300 text-slate-700"
                          }`}
                          title={
                            lang === "en"
                              ? "Click to copy .org link"
                              : lang === "ur"
                              ? ".org لنک کاپی کرنے کے لیے کلک کریں"
                              : "انقر لنسخ رابط .org"
                          }
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200/90 shrink-0">
                              .ORG
                            </span>
                            <span className="truncate text-indigo-900 font-bold" dir="ltr">
                              {orgUrl}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={orgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-indigo-600 transition-colors"
                              title={t.open_link_btn || "Open link"}
                            >
                              <IconExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors flex items-center gap-1 ${
                                isOrgCopied
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-slate-600 border border-slate-200 group-hover:text-indigo-600"
                              }`}
                            >
                              {isOrgCopied ? (
                                <>
                                  <IconCheck className="w-3 h-3" />
                                  <span>{lang === "en" ? "Copied! ✓" : lang === "ur" ? "کاپی ہو گیا! ✓" : "تم النسخ! ✓"}</span>
                                </>
                              ) : (
                                <>
                                  <IconCopy className="w-3 h-3" />
                                  <span>{lang === "en" ? "Copy" : lang === "ur" ? "کاپی" : "نسخ"}</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* 2. .COM URL Strip (Right below .ORG) */}
                        <div
                          onClick={() => handleCopyUrl(comUrl, `${record.id}_com`, record, "com")}
                          className={`p-2 rounded-xl border font-mono text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isComCopied
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                              : "bg-slate-50/90 hover:bg-cyan-50/70 border-slate-200/90 hover:border-cyan-300 text-slate-700"
                          }`}
                          title={
                            lang === "en"
                              ? "Click to copy .com link"
                              : lang === "ur"
                              ? ".com لنک کاپی کرنے کے لیے کلک کریں"
                              : "انقر لنسخ رابط .com"
                          }
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-cyan-100 text-cyan-800 border border-cyan-200/90 shrink-0">
                              .COM
                            </span>
                            <span className="truncate text-cyan-950 font-bold" dir="ltr">
                              {comUrl}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <a
                              href={comUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-cyan-700 transition-colors"
                              title={t.open_link_btn || "Open link"}
                            >
                              <IconExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors flex items-center gap-1 ${
                                isComCopied
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-slate-600 border border-slate-200 group-hover:text-cyan-700"
                              }`}
                            >
                              {isComCopied ? (
                                <>
                                  <IconCheck className="w-3 h-3" />
                                  <span>{lang === "en" ? "Copied! ✓" : lang === "ur" ? "کاپی ہو گیا! ✓" : "تم النسخ! ✓"}</span>
                                </>
                              ) : (
                                <>
                                  <IconCopy className="w-3 h-3" />
                                  <span>{lang === "en" ? "Copy" : lang === "ur" ? "کاپی" : "نسخ"}</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. Copy .ORG Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(orgUrl, `${record.id}_org`, record, "org")}
                          className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs text-xs ${
                            isOrgCopied
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80"
                          }`}
                          title="Copy .org Link"
                        >
                          {isOrgCopied ? (
                            <IconCheck className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <IconCopy className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                          <span>
                            {isOrgCopied
                              ? (lang === "en" ? "Copied .ORG" : lang === "ur" ? ".ORG کاپی ہو گیا" : "تم نسخ .ORG")
                              : (lang === "en" ? "Copy .ORG" : lang === "ur" ? "کاپی .ORG" : "نسخ .ORG")}
                          </span>
                        </button>

                        {/* 2. Copy .COM Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(comUrl, `${record.id}_com`, record, "com")}
                          className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs text-xs ${
                            isComCopied
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/80"
                          }`}
                          title="Copy .com Link"
                        >
                          {isComCopied ? (
                            <IconCheck className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <IconCopy className="w-3.5 h-3.5 text-cyan-700" />
                          )}
                          <span>
                            {isComCopied
                              ? (lang === "en" ? "Copied .COM" : lang === "ur" ? ".COM کاپی ہو گیا" : "تم نسخ .COM")
                              : (lang === "en" ? "Copy .COM" : lang === "ur" ? "کاپی .COM" : "نسخ .COM")}
                          </span>
                        </button>

                        {/* 3. Load into Editor Button */}
                        <button
                          type="button"
                          onClick={() => onLoadRecordIntoEditor(record)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 text-xs border border-slate-200/60"
                          title={t.edit_in_editor}
                        >
                          <IconEdit className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">{t.edit_in_editor || "تعديل"}</span>
                        </button>

                        {/* 4. Open Public Link Button */}
                        <Link
                          href={path}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 no-underline active:scale-95 text-xs border border-slate-200/60"
                          title={t.open_link_btn}
                        >
                          <IconExternalLink className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">{t.open_link_btn || "فتح"}</span>
                        </Link>
                      </div>

                      {/* 4. 🌟 CRYSTAL-CLEAR VIBRANT DIRECT DELETE BUTTON 🌟 */}
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onDeleteRecord(record);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 text-xs shadow-xs group/del"
                        title={lang === "en" ? "Delete permanently from Firebase" : lang === "ur" ? "Firebase سے مستقل ڈیلیٹ کریں" : "حذف السجل نهائياً من Firebase"}
                      >
                        {isDeleting ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <IconTrash className="w-4 h-4 text-rose-600 group-hover/del:text-white transition-colors shrink-0" />
                        )}
                        <span className="text-[11px] group-hover/del:text-white transition-colors">
                          {isDeleting
                            ? (lang === "en" ? "Deleting..." : lang === "ur" ? "ڈیلیٹ ہو رہا ہے..." : "جاري الحذف...")
                            : (lang === "en" ? "Delete" : lang === "ur" ? "ڈیلیٹ" : "حذف")}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 4. DEDICATED DELETE CONFIRMATION DIALOG (CLEAR & SAFE)          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {recordToDelete && (
          <div className="fixed inset-0 z-[100005] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              dir={isRtl ? "rtl" : "ltr"}
              className="bg-white rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Alert Header */}
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200 text-rose-600">
                  <IconTrash className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {lang === "en"
                      ? "Delete Record Permanently?"
                      : lang === "ur"
                      ? "کیا آپ یہ ریکارڈ مستقل ڈیلیٹ کرنا چاہتے ہیں؟"
                      : "تأكيد حذف الوثيقة نهائياً من Firebase"}
                  </h4>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    {lang === "en"
                      ? "This will be deleted directly from Cloud Firestore."
                      : "سيتم حذف هذا السجل نهائياً ومباشرة من قاعدة بيانات Firebase."}
                  </p>
                </div>
              </div>

              {/* Record Summary Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-semibold text-slate-700">
                <p className="font-extrabold text-slate-900 text-sm truncate">
                  🏢 {recordToDelete.facilityName}
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 flex-wrap">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                    #{recordToDelete.serialNumber}
                  </span>
                  {recordToDelete.unifiedNumber && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">
                      700: {recordToDelete.unifiedNumber}
                    </span>
                  )}
                  <span>• 🏛️ {recordToDelete.chamberName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={Boolean(deletingRecordId)}
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 text-center"
                >
                  {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
                </button>

                <button
                  type="button"
                  disabled={Boolean(deletingRecordId)}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {deletingRecordId === recordToDelete.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === "en" ? "Deleting..." : "جاري الحذف..."}</span>
                    </>
                  ) : (
                    <>
                      <IconTrash className="w-4 h-4 text-white" />
                      <span>
                        {lang === "en" ? "Yes, Delete" : lang === "ur" ? "ہاں، ڈیلیٹ کریں" : "نعم، حذف نهائي"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 5. MODAL FOOTER (CLEAN ALIGNMENT)                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0 gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium truncate min-w-0">
            <span className="text-orange-500 font-bold shrink-0">🔥</span>
            <span className="truncate text-[11px] sm:text-xs">
              Firebase Firestore • <code className="text-blue-700 font-bold font-mono">portal_configs</code>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 text-[11px] font-bold font-mono hidden sm:inline">
              {filteredRecords.length} / {savedRecords.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer transition-colors text-xs"
            >
              {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

