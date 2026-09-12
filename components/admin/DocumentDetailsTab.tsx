"use client";

import React from "react";
import { PortalConfig } from "@/types/portal";
import { AdminLanguage, TranslationStrings } from "@/constants/translations";
import { IconDocument, IconCheck, IconTrash } from "@/components/icons/AdminIcons";

export interface DocumentDetailsTabProps {
  config: PortalConfig;
  setConfig: React.Dispatch<React.SetStateAction<PortalConfig>>;
  lang: AdminLanguage;
  t: TranslationStrings;
  saving: boolean;
  onSave: () => void;
  serialError: boolean;
  setSerialError: (v: boolean) => void;
  unifiedError: string | null;
  setUnifiedError: (v: string | null) => void;
  onOpenFirebaseModal: () => void;
  savedRecordsCount: number;
  handleAddCustomField: () => void;
  handleAddPresetField: (preset: string) => void;
  handleUpdateCustomField: (id: string, key: "label" | "value", val: string) => void;
  handleRemoveCustomField: (id: string) => void;
}

export function DocumentDetailsTab({
  config,
  setConfig,
  lang,
  t,
  saving,
  onSave,
  serialError,
  setSerialError,
  unifiedError,
  setUnifiedError,
  onOpenFirebaseModal,
  savedRecordsCount,
  handleAddCustomField,
  handleAddPresetField,
  handleUpdateCustomField,
  handleRemoveCustomField,
}: DocumentDetailsTabProps) {
  return (
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
          onClick={onSave}
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
            onClick={onOpenFirebaseModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            title={t.firebase_records_title}
          >
            <span>🔥</span>
            <span>{t.firebase_records_btn}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-black/20 text-white">
              {savedRecordsCount}
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.serial_number_hint}</p>

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
        </div>
      </div>

      {/* Sub-Card 1: معلومات الغرفة والمنشأة */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <h3 className="text-sm font-black text-slate-800">
            {lang === "en"
              ? "Chamber & Facility Details"
              : lang === "ur"
              ? "کمرہ اور ادارہ کی معلومات"
              : "بيانات الغرفة والمنشأة"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.chamber_name}</label>
            <input
              type="text"
              value={config.chamberName}
              onChange={(e) => setConfig({ ...config, chamberName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.facility_name}</label>
            <input
              type="text"
              value={config.facilityName}
              onChange={(e) => setConfig({ ...config, facilityName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.facility_sub_name}</label>
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
            {lang === "en"
              ? "Request Numbers & Identifiers"
              : lang === "ur"
              ? "درخواست اور شناختی نمبرز"
              : "أرقام المعاملة والطلب"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">{t.unified_number}</label>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                {lang === "en" ? "700 Number" : lang === "ur" ? "700 نمبر" : "الرقم الموحد (700)"}
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.request_number}</label>
            <input
              type="text"
              dir="ltr"
              value={config.requestNumber}
              onChange={(e) => setConfig({ ...config, requestNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.commercial_reg_no}</label>
            <input
              type="text"
              dir="ltr"
              value={config.commercialRegNo}
              onChange={(e) => setConfig({ ...config, commercialRegNo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.request_type}</label>
            <input
              type="text"
              value={config.requestType}
              onChange={(e) => setConfig({ ...config, requestType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.applicant_name}</label>
            <input
              type="text"
              value={config.applicantName}
              onChange={(e) => setConfig({ ...config, applicantName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.amount}</label>
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
            {lang === "en"
              ? "Dates & Timestamps"
              : lang === "ur"
              ? "تاریخ اور اوقات"
              : "التواريخ ومواعيد الصلاحية"}
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

      {/* Sub-Card 4: حالة الطلب ومظهر الشارة */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <h3 className="text-sm font-black text-slate-800">
            {lang === "en"
              ? "Request Status & Color Badge"
              : lang === "ur"
              ? "درخواست کی حالت اور رنگ"
              : "حالة الطلب ومظهر الشارة"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.request_status}</label>
              <input
                type="text"
                value={config.requestStatus}
                onChange={(e) => setConfig({ ...config, requestStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.status_color}</label>
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
                        config.statusColor === swatch.color
                          ? "ring-2 ring-slate-800 scale-110"
                          : "border-slate-300"
                      }`}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Badge Preview */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "en"
                ? "Live Status Preview"
                : lang === "ur"
                ? "لائیو اسٹیٹس کا نمونہ"
                : "معاينة شارة الحالة"}
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
          {[
            "المدينة",
            "رقم الآيبان (IBAN)",
            "البريد الإلكتروني",
            "رقم الهوية الوطنية",
            "الفرع التجاري",
            "حالة الدفع",
          ].map((preset) => (
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
  );
}
