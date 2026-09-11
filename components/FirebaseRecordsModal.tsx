"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PortalRecord } from "@/lib/portal-types";
import { AdminLanguage, TranslationStrings } from "@/lib/admin-translations";

export interface FirebaseRecordsModalProps {
  open: boolean;
  onClose: () => void;
  savedRecords: PortalRecord[];
  loadingRecords: boolean;
  onRefresh: () => void;
  onDeleteRecord: (record: PortalRecord) => Promise<void> | void;
  onCopyRecordLink: (record: PortalRecord) => void;
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
      // 1. Chamber filter
      if (selectedChamber !== "ALL" && (record.chamberName || "").trim() !== selectedChamber) {
        return false;
      }

      // 2. Search query across all major fields
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

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Sample record trigger wrapper
  const handleTriggerSample = async () => {
    if (!onCreateSampleRecord) return;
    setIsCreatingSample(true);
    try {
      await onCreateSampleRecord();
    } finally {
      setIsCreatingSample(false);
    }
  };

  // Delete confirm handler
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await onDeleteRecord(recordToDelete);
    } finally {
      setRecordToDelete(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100002] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL HEADER WITH MODERN GRADIENT & AMBIENT GLOW                */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-5 sm:px-7 py-5 shrink-0 shadow-lg border-b border-white/10 overflow-hidden">
          {/* Subtle background glow orbs */}
          <div className="absolute top-0 right-1/4 w-72 h-36 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-1/3 w-64 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            {/* Title & Brand */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 shrink-0 border border-orange-300/40">
                🔥
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-black text-base sm:text-xl text-white tracking-tight">
                    {t.firebase_records_title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-amber-300 border border-orange-400/40 shadow-xs">
                    {savedRecords.length} {lang === "en" ? "Certificates" : lang === "ur" ? "سرٹیفکیٹس" : "شهادات وروابط"}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firestore Live
                  </span>
                </div>
                <p className="text-xs text-indigo-200/90 font-medium mt-0.5 truncate max-w-xl">
                  {t.firebase_records_desc}
                </p>
              </div>
            </div>

            {/* Action buttons on header */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Add Sample Certificate Button */}
              {onCreateSampleRecord && (
                <button
                  type="button"
                  onClick={handleTriggerSample}
                  disabled={isCreatingSample || loadingRecords}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-blue-400/30"
                  title={lang === "en" ? "Add Sample Certificate" : lang === "ur" ? "نمونہ سرٹیفکیٹ شامل کریں" : "إضافة شهادة تجريبية"}
                >
                  <span>{isCreatingSample ? "⏳" : "➕"}</span>
                  <span className="hidden md:inline">
                    {lang === "en" ? "Add Sample" : lang === "ur" ? "نمونہ سرٹیفکیٹ" : "إضافة شهادة"}
                  </span>
                </button>
              )}

              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingRecords}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-white/10 active:scale-95"
                title={lang === "en" ? "Refresh records" : lang === "ur" ? "تازہ کریں" : "تحديث القائمة من السيرفر"}
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
                <span className="hidden sm:inline">
                  {lang === "en" ? "Refresh" : lang === "ur" ? "ریفریش" : "تحديث"}
                </span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all border border-white/10 hover:rotate-90 active:scale-95"
                title={lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* INTERACTIVE SEARCH & CHAMBER FILTER TOOLBAR                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200/90 shrink-0 space-y-2.5">
          {/* Main search bar */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 start-3.5 flex items-center text-slate-400 pointer-events-none text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_records_placeholder}
                className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-slate-700 text-xs font-black cursor-pointer px-1"
                  title="مسح البحث"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results count pill */}
            <div className="text-xs font-black text-slate-600 bg-white px-3 py-2.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
              <span className="text-blue-600 font-mono">{filteredRecords.length}</span> / {savedRecords.length}{" "}
              <span className="hidden sm:inline">
                {lang === "en" ? "shown" : lang === "ur" ? "ظاہر" : "معروض"}
              </span>
            </div>
          </div>

          {/* Chamber Quick Filter Chips */}
          {chamberStats.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs font-bold text-slate-600 pt-0.5">
              <span className="text-[11px] text-slate-400 font-bold shrink-0 ps-0.5">
                {lang === "en" ? "Filter by Chamber:" : lang === "ur" ? "غرفة کے لحاظ سے:" : "تصفية حسب الغرفة:"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedChamber("ALL")}
                className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
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
                  className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
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
        {/* SCROLLABLE RECORDS BODY (SMOOTH SCROLL, DIVERSE DATA DISPLAY)    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/70 custom-scrollbar overscroll-contain">
          {/* Loading state */}
          {loadingRecords && savedRecords.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3.5" />
              <p className="text-sm font-bold text-slate-700">
                {lang === "en" ? "Fetching records from Firebase..." : "جاري جلب السجلات من قاعدة بيانات Firebase..."}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">يرجى الانتظار بضع ثوانٍ</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            /* Empty state */
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-2xs max-w-lg mx-auto">
              <span className="text-5xl block mb-3">📭</span>
              <p className="text-base font-black text-slate-800 mb-1.5">
                {t.no_records_found}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto mb-5">
                {searchQuery || selectedChamber !== "ALL"
                  ? lang === "en"
                    ? "No certificates match your search query. Try clearing filters."
                    : lang === "ur"
                    ? "تلاش کے نتائج میں کوئی سرٹیفکیٹ نہیں ملا۔ فلٹر صاف کر کے دوبارہ چیک کریں۔"
                    : "لم يتم العثور على شهادات مطابقة للبحث. جرب مسح حقل البحث أو تصفية الغرف."
                  : lang === "en"
                  ? "To create a public link, enter a Serial Number in Document Details and click 'Save Changes'. It will appear here automatically."
                  : lang === "ur"
                  ? "نیا شیئر لنک بنانے کیلئے دستاویز کی تفصیلات میں سیریل نمبر درج کر کے محفوظ کریں، وہ یہاں نظر آئے گا۔"
                  : "لإنشاء رابط جديد، أدخل الرقم التسلسلي في تفاصيل الوثيقة واضغط حفظ التعديلات ليظهر الرابط هنا تلقائياً."}
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                {searchQuery || selectedChamber !== "ALL" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedChamber("ALL");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === "en" ? "Clear Filter" : lang === "ur" ? "فلٹر صاف کریں" : "مسح التصفية والبحث"}
                  </button>
                ) : null}

                {onCreateSampleRecord && (
                  <button
                    type="button"
                    onClick={handleTriggerSample}
                    disabled={isCreatingSample}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingSample ? "⏳ جاري الإضافة..." : "➕ إضافة شهادة نموذجية للتجربة"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Multi-Record Responsive Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecords.map((record) => {
                const cleanSerial = (record.serialNumber || "").trim();
                const cleanUnified = (record.unifiedNumber || "").trim();
                const path = cleanUnified
                  ? `/${encodeURIComponent(cleanSerial)}/${encodeURIComponent(cleanUnified)}`
                  : `/${encodeURIComponent(cleanSerial)}`;
                const fullUrl =
                  typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
                const isCopied = copiedRecordId === record.id;
                const isDeleting = deletingRecordId === record.id;

                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs gap-3 group relative overflow-hidden"
                  >
                    {/* Top Decorative accent bar */}
                    <div
                      className="absolute top-0 inset-x-0 h-1 transition-colors"
                      style={{ backgroundColor: record.statusColor || "#32c5cb" }}
                    />

                    <div>
                      {/* Top Badges: Serial, Unified, Status, Timestamp */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 flex-wrap">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Serial Badge */}
                          <span
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-mono font-black text-xs border border-blue-200/80 shadow-2xs"
                            title="الرقم التسلسلي"
                          >
                            #{cleanSerial}
                          </span>

                          {/* Unified Number Badge */}
                          {cleanUnified && (
                            <span
                              className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-mono font-black text-xs border border-purple-200/80 shadow-2xs"
                              title="الرقم الموحد"
                            >
                              700: {cleanUnified}
                            </span>
                          )}

                          {/* Status Badge */}
                          <span
                            className="font-black px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 border"
                            style={{
                              backgroundColor: `${record.statusColor || "#32c5cb"}12`,
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

                        {/* Timestamp */}
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>

                      {/* Facility Name & Chamber Information */}
                      <div className="space-y-1 mb-3">
                        <h4
                          className="font-black text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
                          title={record.facilityName}
                        >
                          {record.facilityName || "بدون اسم منشأة"}
                        </h4>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-bold text-slate-700">
                            🏛️ {record.chamberName || "الغرفة التجارية"}
                          </span>
                          {record.facilitySubName && (
                            <span className="text-slate-400 truncate max-w-[200px]">
                              • {record.facilitySubName}
                            </span>
                          )}
                        </div>

                        {/* Extra Details Row: Request #, Type, Commercial Reg */}
                        <div className="text-[11px] text-slate-500 pt-1 flex flex-wrap items-center justify-between gap-1">
                          <span className="font-medium">
                            📄 #{record.requestNumber} ({record.requestType || "توثيق"})
                          </span>
                          {record.commercialRegNo && (
                            <span className="text-slate-400 font-mono text-[10px]">
                              س.ت: {record.commercialRegNo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shareable Public Link Box with Click-to-Copy */}
                      <div
                        onClick={() => onCopyRecordLink(record)}
                        className={`p-2.5 rounded-xl border font-mono text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isCopied
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                            : "bg-slate-50/90 hover:bg-blue-50/60 border-slate-200/90 hover:border-blue-300 text-slate-700"
                        }`}
                        title="انقر لنسخ الرابط المباشر"
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <span className="text-xs shrink-0">
                            {isCopied ? "✅" : "🔗"}
                          </span>
                          <span className="truncate text-blue-700 font-bold" dir="ltr">
                            {fullUrl}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-slate-500 border border-slate-200 group-hover:text-blue-600"
                          }`}
                        >
                          {isCopied ? "تم النسخ! ✓" : "نسخ 📋"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. Copy Link Button */}
                        <button
                          type="button"
                          onClick={() => onCopyRecordLink(record)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs text-xs ${
                            isCopied
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80"
                          }`}
                        >
                          <span>{isCopied ? "✅" : "📋"}</span>
                          <span>{isCopied ? t.link_copied : t.copy_link_btn}</span>
                        </button>

                        {/* 2. Open Page Button */}
                        <Link
                          href={path}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 no-underline active:scale-95 text-xs"
                          title={t.open_link_btn}
                        >
                          <span>↗️</span>
                          <span className="hidden sm:inline">{t.open_link_btn}</span>
                        </Link>

                        {/* 3. Load in Editor Button */}
                        <button
                          type="button"
                          onClick={() => onLoadRecordIntoEditor(record)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 text-xs"
                          title={t.edit_in_editor}
                        >
                          <span>✏️</span>
                          <span className="hidden sm:inline">{t.edit_in_editor}</span>
                        </button>
                      </div>

                      {/* 4. Delete Record from Firebase */}
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setRecordToDelete(record)}
                        className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 active:scale-95 text-xs"
                        title={t.delete_record_btn}
                      >
                        {isDeleting ? (
                          <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>🗑️</span>
                        )}
                        <span className="hidden sm:inline">{t.delete_record_btn}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DELETE CONFIRMATION DIALOG OVERLAY                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {recordToDelete && (
          <div className="fixed inset-0 z-[100005] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              dir={isRtl ? "rtl" : "ltr"}
              className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl shrink-0">
                  ⚠️
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    {lang === "en" ? "Delete Record Permanently?" : lang === "ur" ? "ریکارڈ مستقل ڈیلیٹ کریں؟" : "تأكيد حذف الوثيقة نهائياً"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en" ? "This will be removed from Firebase Cloud Firestore." : "سيتم حذف هذا السجل نهائياً من Firebase وقاعدة البيانات"}
                  </p>
                </div>
              </div>

              {/* Record Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-semibold text-slate-700">
                <p className="font-bold text-slate-900 truncate">
                  🏢 {recordToDelete.facilityName}
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                  <span>#{recordToDelete.serialNumber}</span>
                  {recordToDelete.unifiedNumber && <span>• 700: {recordToDelete.unifiedNumber}</span>}
                  <span>• 🏛️ {recordToDelete.chamberName}</span>
                </div>
              </div>

              {/* Confirmation Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={Boolean(deletingRecordId)}
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
                </button>
                <button
                  type="button"
                  disabled={Boolean(deletingRecordId)}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {deletingRecordId === recordToDelete.id ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === "en" ? "Deleting..." : "جاري الحذف..."}</span>
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      <span>{lang === "en" ? "Confirm Delete" : lang === "ur" ? "ہاں، ڈیلیٹ کریں" : "نعم، حذف نهائي"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL FOOTER                                                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="text-orange-500 font-bold">🔥</span>
            <span>
              Firebase Cloud Firestore • collection: <code className="text-blue-700 font-bold font-mono">portal_records</code>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] font-bold hidden sm:inline">
              {filteredRecords.length} {lang === "en" ? "active records" : lang === "ur" ? "فعال ریکارڈز" : "سجلات فعالة"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer transition-colors"
            >
              {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
