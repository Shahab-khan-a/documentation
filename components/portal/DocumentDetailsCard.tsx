"use client";

import React from "react";
import { PortalConfig } from "@/types/portal";

export interface DocumentDetailsCardProps {
  config: PortalConfig;
  isDownloading?: boolean;
  onDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVerifyAgain: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBack: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function DocumentDetailsCard({
  config,
  isDownloading = false,
  onDownload,
  onVerifyAgain,
  onBack,
}: DocumentDetailsCardProps) {
  const d = config;

  return (
    <main className="max-w-md mx-auto px-4">
      {/* Title bar: Right has blue accent bar + title; Left has button العودة */}
      <div className="flex items-center justify-between pt-3.5 pb-2.5">
        {/* Right: Vertical accent bar + Page Title */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-[3.5px] h-[22px] rounded-xs"
            style={{ backgroundColor: "#1e72b8" }}
          />
          <h1 className="font-bold text-[17px] sm:text-[19px] text-[#192532] m-0">
            {d.pageTitle || "التحقق من الوثائق"}
          </h1>
        </div>

        {/* Left: Button العودة */}
        <a
          href={
            d?.backButton?.fileUrl && d.backButton.fileUrl.trim() !== ""
              ? d.backButton.fileUrl
              : d?.backButton?.url && d.backButton.url !== "#"
              ? d.backButton.url
              : "#"
          }
          download={
            d?.backButton?.fileUrl && d.backButton.fileUrl.trim() !== ""
              ? d.backButton.fileName || "document.pdf"
              : undefined
          }
          target={d?.backButton?.openInNewTab ? "_blank" : undefined}
          rel={d?.backButton?.openInNewTab ? "noreferrer" : undefined}
          onClick={onBack}
          className="inline-flex items-center justify-center text-white font-bold text-[13px] rounded-md px-4 py-1.5 no-underline hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
          style={{
            backgroundColor: "#5c9df6",
          }}
        >
          {d?.backButton?.label || "العودة"}
        </a>
      </div>

      <hr className="border-t border-slate-200 m-0" />

      {/* Intro text: Aligned to start (right in RTL), matching the rest of the text */}
      <div className="max-w-[325px] sm:max-w-[360px] mx-auto py-3.5 text-right text-[12.5px] sm:text-[13px] leading-relaxed text-[#475569]">
        <p className="m-0">خدمة تتيح التحقق من الوثائق التي تم تصديقها</p>
        <p className="m-0">إلكترونياً عبر بوابة خدمات ركين وللتحقق من</p>
        <p className="m-0">شهادة الاشتراك الرجاء ادخال الرقم المرجعي الخاص</p>
        <p className="m-0">بالوثيقة.</p>
      </div>

      <hr className="border-t border-slate-200 m-0" />

      {/* Data fields: Perfectly aligned from line start on the right */}
      <div className="max-w-[325px] sm:max-w-[360px] mx-auto py-4 text-right space-y-1 text-[13px] sm:text-[13.5px] leading-relaxed">
        {/* 1. إسم الغرفة */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">إسم الغرفة</span>
          <span className="text-[#41515e]">{d.chamberName}</span>
        </div>

        {/* 2. إسم المنشأة */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[#14202c] shrink-0">إسم المنشأة</span>
            <span className="text-[#41515e]">{d.facilityName}</span>
          </div>
          {d.facilitySubName && (
            <div className="text-[#41515e] text-[12px] sm:text-[12.5px] text-right">
              {d.facilitySubName}
            </div>
          )}
        </div>

        {/* 3. الرقم الموحد (700) */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">الرقم الموحد (700)</span>
          <span className="text-[#41515e] font-sans" dir="ltr">
            {d.unifiedNumber}
          </span>
        </div>

        {/* 4. رقم الطلب */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">رقم الطلب</span>
          <span className="text-[#41515e] font-sans" dir="ltr">
            {d.requestNumber}
          </span>
        </div>

        {/* 5. نوع الطلب */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">نوع الطلب</span>
          <span className="text-[#41515e]">{d.requestType}</span>
        </div>

        {/* 6. إسم مقدم الطلب */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">إسم مقدم الطلب</span>
          <span className="text-[#41515e]">{d.applicantName}</span>
        </div>

        {/* 7. تاريخ ووقت إنشاء الطلب */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[#14202c] shrink-0">تاريخ ووقت إنشاء الطلب</span>
            <span className="text-[#41515e]" dir="ltr">
              {d.creationDate}
            </span>
          </div>
          <div className="text-[#41515e] text-[11.5px] sm:text-[12px] text-right" dir="rtl">
            {d.creationTime}
          </div>
        </div>

        {/* 8. مبلغ الطلب */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">مبلغ الطلب</span>
          <span className="text-[#41515e]">{d.amount}</span>
        </div>

        {/* 9. تاريخ صلاحية الطلب */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[#14202c] shrink-0">تاريخ صلاحية الطلب</span>
            <span className="text-[#41515e]" dir="ltr">
              {d.expiryDate}
            </span>
          </div>
          <div className="text-[#41515e] text-[11.5px] sm:text-[12px] text-right" dir="rtl">
            {d.expiryTime}
          </div>
        </div>

        {/* 10. رقم السجل التجاري */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-[#14202c] shrink-0">رقم السجل التجاري</span>
          <span className="text-[#41515e] font-sans" dir="ltr">
            {d.commercialRegNo}
          </span>
        </div>

        {/* 11. حالة الطلب */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="font-bold text-[#14202c] shrink-0">حالة الطلب</span>
          <span className="font-bold" style={{ color: d.statusColor || "#32c5cb" }}>
            {d.requestStatus}
          </span>
        </div>

        {/* Dynamic custom fields if any */}
        {d.customFields &&
          d.customFields.length > 0 &&
          d.customFields.map((f) => (
            <div key={f.id} className="flex items-baseline gap-1.5">
              <span className="font-bold text-[#14202c] shrink-0">{f.label}</span>
              <span className="text-[#41515e]">{f.value}</span>
            </div>
          ))}
      </div>

      {/* Action buttons (Buttons 2 & 3) */}
      {/* In RTL: First child in DOM is rendered on the RIGHT, second child on the LEFT */}
      <div className="flex items-center justify-center gap-3 pt-1 pb-5">
        {/* Right button in RTL: تحميل */}
        <button
          type="button"
          disabled={isDownloading}
          onClick={onDownload}
          className="inline-flex items-center justify-center text-white font-bold text-[13px] rounded-md px-7 py-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-75 min-w-[90px]"
          style={{
            backgroundColor: "#5c9df6",
          }}
        >
          {isDownloading ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري التحميل...</span>
            </span>
          ) : (
            d?.downloadButton?.label || "تحميل"
          )}
        </button>

        {/* Left button in RTL: التحقق مرة آخرى */}
        <button
          type="button"
          onClick={onVerifyAgain}
          className="inline-flex items-center justify-center text-white font-bold text-[13px] rounded-md px-5 py-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs"
          style={{
            backgroundColor: "#5c9df6",
          }}
        >
          {d?.verifyAgainButton?.label || "التحقق مرة آخرى"}
        </button>
      </div>

      <hr className="border-t border-slate-200 m-0" />
    </main>
  );
}
