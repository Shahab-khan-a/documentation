"use client";

import React from "react";
import { PortalRecord } from "@/types/portal";
import { AdminLanguage, TranslationStrings } from "@/lib/admin-translations";
import { useCreateRecordFromSource } from "@/hooks/useCreateRecordFromSource";
import { CHAMBER_QUICK_OPTIONS } from "@/constants/record-editor";
import {
  FormSectionCard,
  RecordInputField,
  ColorPickerGroup,
  LivePreviewBox,
} from "./record-modal";

export interface CreateNewFromRecordModalProps {
  open: boolean;
  onClose: () => void;
  sourceRecord: PortalRecord | null;
  onSaveAsNew: (newRecord: PortalRecord) => Promise<boolean | void> | boolean | void;
  lang: AdminLanguage;
  t: TranslationStrings;
}

export function CreateNewFromRecordModal({
  open,
  onClose,
  sourceRecord,
  onSaveAsNew,
  lang,
  t,
}: CreateNewFromRecordModalProps) {
  const {
    isRtl,
    formData,
    isSaving,
    serialError,
    livePreviewUrl,
    handleFieldChange,
    handleRandomizeSerial,
    handleSubmit,
  } = useCreateRecordFromSource({
    sourceRecord,
    open,
    lang,
    onSaveAsNew,
    onClose,
  });

  if (!open || !sourceRecord || !formData) return null;

  return (
    <div
      className="fixed inset-0 z-[100003] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 1. HEADER (STUNNING MODERN GRADIENT)                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white px-5 sm:px-6 py-4 shrink-0 shadow-md border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md shadow-indigo-500/25 shrink-0 border border-indigo-300/30">
              ✨
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                  {lang === "en"
                    ? "Create New Certificate from Record"
                    : lang === "ur"
                    ? "اس ریکارڈ سے نیا سرٹیفکیٹ بنائیں"
                    : "إنشاء وثيقة جديدة من هذا السجل"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-indigo-500/25 text-indigo-300 border border-indigo-400/40 shrink-0">
                  {lang === "en" ? "Clone & Branch" : "نسخ وتعديل"}
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80 font-medium truncate">
                {lang === "en"
                  ? `Source: #${sourceRecord.serialNumber} (Original card stays 100% untouched)`
                  : lang === "ur"
                  ? `اصل کارڈ #${sourceRecord.serialNumber} اپنی جگہ محفوظ رہے گا، بغیر کسی تبدیلی کے`
                  : `البطاقة الأصلية #${sourceRecord.serialNumber} ستبقى كما هي تماماً دون أي مساس بها`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer transition-all border border-white/10 hover:rotate-90 active:scale-95 shrink-0"
            title={lang === "en" ? "Close" : "إغلاق"}
          >
            ✕
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 2. FORM BODY (ORGANIZED, COLORFUL, BEAUTIFUL SECTIONS)         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5 bg-slate-50/70 custom-scrollbar"
        >
          {/* Reassurance Notice */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-xs text-emerald-900 shadow-2xs">
            <span className="text-lg shrink-0">🛡️</span>
            <div className="leading-relaxed">
              <span className="font-black">
                {lang === "en"
                  ? "Safe Duplicate Guarantee: "
                  : lang === "ur"
                  ? "محفوظ کاپی کی ضمانت: "
                  : "ضمان الحفظ المستقل: "}
              </span>
              <span>
                {lang === "en"
                  ? "Editing and saving will create a brand new card with its own shareable link. The original card (#" +
                    sourceRecord.serialNumber +
                    ") will NOT be changed."
                  : lang === "ur"
                  ? "تعدیل اور سیو کرنے پر ایک نیا کارڈ اور نیا شیئر لنک بنے گا۔ پرانا کارڈ (#" +
                    sourceRecord.serialNumber +
                    ") بالکل تبدیل نہیں ہوگا!"
                  : "أي تعديل وحفظ هنا سينشئ بطاقة جديدة ورابط مستقل خاص بها، بينما سيبقى السجل الأصلي (#" +
                    sourceRecord.serialNumber +
                    ") محفوظاً كما هو تماماً!"}
              </span>
            </div>
          </div>

          {/* Section 1: Numbers & Verification (Blue / Indigo Accent) */}
          <FormSectionCard
            dotColorClass="bg-blue-500"
            title={
              lang === "en"
                ? "1. Document Identification & Serial Numbers"
                : "1. أرقام الوثيقة والتحقق الرسمية"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Serial Number (with Randomize Button) */}
              <RecordInputField
                label={lang === "en" ? "New Serial Number *" : "الرقم التسلسلي الجديد *"}
                value={formData.serialNumber}
                onChange={(val) => handleFieldChange("serialNumber", val)}
                required
                dir="ltr"
                isMono
                error={serialError}
                focusColorClass="focus:ring-blue-500 focus:border-blue-500"
                action={
                  <button
                    type="button"
                    onClick={handleRandomizeSerial}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer border border-blue-200 flex items-center gap-1"
                    title="توليد رقم تسلسلي عشوائي جديد"
                  >
                    <span>🎲</span>
                    <span>{lang === "en" ? "Randomize" : "توليد جديد"}</span>
                  </button>
                }
              />

              {/* Unified Number 700 */}
              <RecordInputField
                label={lang === "en" ? "Unified Number (700)" : "الرقم الموحد (700)"}
                value={formData.unifiedNumber}
                onChange={(val) => handleFieldChange("unifiedNumber", val)}
                dir="ltr"
                isMono
                placeholder="e.g. 7025899080"
                focusColorClass="focus:ring-purple-500 focus:border-purple-500"
              />

              {/* Request Number */}
              <RecordInputField
                label={lang === "en" ? "Request Number" : "رقم الطلب"}
                value={formData.requestNumber || ""}
                onChange={(val) => handleFieldChange("requestNumber", val)}
                dir="ltr"
                isMono
                placeholder="e.g. 13255887"
                focusColorClass="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </FormSectionCard>

          {/* Section 2: Facility & Chamber (Teal / Cyan Accent) */}
          <FormSectionCard
            dotColorClass="bg-teal-500"
            title={
              lang === "en"
                ? "2. Chamber & Facility Details"
                : "2. بيانات المنشأة والغرفة التجارية"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Chamber Name */}
              <RecordInputField
                label={lang === "en" ? "Chamber Name" : "إسم الغرفة"}
                value={formData.chamberName || ""}
                onChange={(val) => handleFieldChange("chamberName", val)}
                placeholder="e.g. ينبع"
                focusColorClass="focus:ring-teal-500 focus:border-teal-500"
                action={
                  <div className="flex items-center gap-1">
                    {CHAMBER_QUICK_OPTIONS.slice(0, 3).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleFieldChange("chamberName", c)}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          formData.chamberName === c
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                }
              />

              {/* Request Type */}
              <RecordInputField
                label={lang === "en" ? "Request Type" : "نوع الطلب"}
                value={formData.requestType || ""}
                onChange={(val) => handleFieldChange("requestType", val)}
                placeholder="e.g. طلب مفتوح ملف"
                focusColorClass="focus:ring-teal-500 focus:border-teal-500"
              />

              {/* Facility Name */}
              <RecordInputField
                label={lang === "en" ? "Facility Name" : "إسم المنشأة"}
                value={formData.facilityName || ""}
                onChange={(val) => handleFieldChange("facilityName", val)}
                placeholder="e.g. بدون اسم منشأة أو شركة المقاولات"
                focusColorClass="focus:ring-teal-500 focus:border-teal-500"
              />

              {/* Facility Sub Name */}
              <RecordInputField
                label={
                  lang === "en"
                    ? "Branch / Sub Name (optional)"
                    : "الفرع / التوصيف (اختياري)"
                }
                value={formData.facilitySubName || ""}
                onChange={(val) => handleFieldChange("facilitySubName", val)}
                placeholder="e.g. فرع المقاولات"
                focusColorClass="focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </FormSectionCard>

          {/* Section 3: Applicant & Registration (Purple / Indigo Accent) */}
          <FormSectionCard
            dotColorClass="bg-purple-500"
            title={
              lang === "en"
                ? "3. Applicant & Commercial Registration"
                : "3. بيانات مقدم الطلب والسجل التجاري"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Applicant Name */}
              <RecordInputField
                label={lang === "en" ? "Applicant Name" : "إسم مقدم الطلب"}
                value={formData.applicantName || ""}
                onChange={(val) => handleFieldChange("applicantName", val)}
                placeholder="e.g. العنود سلمان شوعان"
                focusColorClass="focus:ring-purple-500 focus:border-purple-500"
              />

              {/* Commercial Reg No */}
              <RecordInputField
                label={
                  lang === "en"
                    ? "Commercial Registration No (CR)"
                    : "رقم السجل التجاري"
                }
                value={formData.commercialRegNo || ""}
                onChange={(val) => handleFieldChange("commercialRegNo", val)}
                dir="ltr"
                isMono
                placeholder="e.g. 7032840279"
                focusColorClass="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </FormSectionCard>

          {/* Section 4: Dates, Fees & Request Status (Amber / Orange Accent) */}
          <FormSectionCard
            dotColorClass="bg-amber-500"
            title={
              lang === "en"
                ? "4. Dates, Amount & Status"
                : "4. التواريخ، الرسوم وحالة الطلب"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Creation Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === "en" ? "Creation Date & Time" : "تاريخ ووقت الإنشاء"}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.creationDate || ""}
                    onChange={(e) => handleFieldChange("creationDate", e.target.value)}
                    placeholder="09/06/2026-"
                    className="w-2/3 px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.creationTime || ""}
                    onChange={(e) => handleFieldChange("creationTime", e.target.value)}
                    placeholder="6:12م"
                    className="w-1/3 px-2 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Expiry Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === "en" ? "Expiry Date & Time" : "تاريخ ووقت الانتهاء"}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.expiryDate || ""}
                    onChange={(e) => handleFieldChange("expiryDate", e.target.value)}
                    placeholder="09/06/2027-"
                    className="w-2/3 px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.expiryTime || ""}
                    onChange={(e) => handleFieldChange("expiryTime", e.target.value)}
                    placeholder="6:00م"
                    className="w-1/3 px-2 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Amount */}
              <RecordInputField
                label={lang === "en" ? "Amount (SAR)" : "مبلغ الطلب"}
                value={formData.amount || ""}
                onChange={(val) => handleFieldChange("amount", val)}
                placeholder="e.g. 35 ريال"
                focusColorClass="focus:ring-amber-500 focus:border-amber-500"
              />

              {/* Request Status */}
              <RecordInputField
                label={lang === "en" ? "Request Status Text" : "نص حالة الطلب"}
                value={formData.requestStatus || ""}
                onChange={(val) => handleFieldChange("requestStatus", val)}
                placeholder="e.g. تم قبول الطلب وساري"
                focusColorClass="focus:ring-emerald-500 focus:border-emerald-500"
                className="sm:col-span-2"
              />

              {/* Status Color */}
              <ColorPickerGroup
                label={lang === "en" ? "Status Badge Color" : "لون شارة الحالة"}
                value={formData.statusColor || "#32c5cb"}
                onChange={(col) => handleFieldChange("statusColor", col)}
              />
            </div>
          </FormSectionCard>

          {/* Section 5: Dynamic Live Preview of New Shareable Link */}
          <LivePreviewBox url={livePreviewUrl} lang={lang} />
        </form>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3. FOOTER ACTIONS                                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/90 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {lang === "en" ? "Cancel" : "إلغاء"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 border border-indigo-400/30"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {lang === "en"
                    ? "Saving as New Certificate..."
                    : lang === "ur"
                    ? "نیا سرٹیفکیٹ سیو ہو رہا ہے..."
                    : "جاري حفظ وإنشاء الوثيقة الجديدة..."}
                </span>
              </>
            ) : (
              <>
                <span className="text-base">✨</span>
                <span>
                  {lang === "en"
                    ? "Save Changes & Create New Card"
                    : lang === "ur"
                    ? "تبدیلیاں محفوظ کریں اور نیا کارڈ بنائیں"
                    : "حفظ التعديلات وإنشاء بطاقة جديدة"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
