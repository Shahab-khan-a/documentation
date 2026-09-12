"use client";

import React from "react";
import Link from "next/link";
import { PortalConfig } from "@/types/portal";
import { AdminLanguage, TranslationStrings } from "@/constants/translations";
import { IconPreview } from "@/components/icons/AdminIcons";

export interface QuickPreviewModalProps {
  open: boolean;
  onClose: () => void;
  config: PortalConfig;
  publicLink: string;
  lang: AdminLanguage;
  t: TranslationStrings;
}

export function QuickPreviewModal({
  open,
  onClose,
  config,
  publicLink,
  lang,
  t,
}: QuickPreviewModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[99998] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
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
            onClick={onClose}
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
              <p>
                <strong>اسم الغرفة : </strong>
                <span>{config.chamberName}</span>
              </p>
              <p>
                <strong>اسم المنشأة : </strong>
                <span>{config.facilityName}</span>
              </p>
              {config.facilitySubName && (
                <p>
                  <span>{config.facilitySubName}</span>
                </p>
              )}
              <p>
                <strong>الرقم الموحد (700) : </strong>
                <span className="font-mono">{config.unifiedNumber}</span>
              </p>
              <p>
                <strong>رقم الطلب : </strong>
                <span className="font-mono text-base font-bold">{config.requestNumber}</span>
              </p>
              <p>
                <strong>نوع الطلب : </strong>
                <span>{config.requestType}</span>
              </p>
              <p>
                <strong>اسم مقدم الطلب : </strong>
                <span>{config.applicantName}</span>
              </p>
              <p>
                <strong>تاريخ ووقت الإنشاء : </strong>
                <span className="font-mono">
                  {config.creationDate} {config.creationTime}
                </span>
              </p>
              <p>
                <strong>مبلغ الطلب : </strong>
                <span>{config.amount}</span>
              </p>
              <p>
                <strong>تاريخ الصلاحية : </strong>
                <span className="font-mono">
                  {config.expiryDate} {config.expiryTime}
                </span>
              </p>
              <p>
                <strong>رقم السجل التجاري : </strong>
                <span className="font-mono">{config.commercialRegNo}</span>
              </p>
              <p className="pt-2 text-base">
                <strong>حالة الطلب : </strong>
                <strong style={{ color: config.statusColor || "#32c5cb" }}>
                  {config.requestStatus}
                </strong>
              </p>
              {/* Dynamic custom fields */}
              {config.customFields &&
                config.customFields.length > 0 &&
                config.customFields.map((f) => (
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
            href={publicLink}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 font-bold underline flex items-center gap-1"
          >
            <span>{t.preview_btn}</span>
            <span className="text-xs">↗</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 cursor-pointer"
          >
            {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
          </button>
        </div>
      </div>
    </div>
  );
}
