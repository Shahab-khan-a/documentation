"use client";

import React from "react";
import {
  TujarBuildIcon,
  TujarFileIcon,
  TujarListNumberIcon,
  TujarUserListIcon,
  TujarDepartmentIcon,
  TujarDateIcon,
  TujarStatusIcon,
} from "@/lib/tujar-icons";

export interface TujarDocumentDetails {
  chamberName: string;
  serviceName: string;
  documentNumber: string;
  orderNumber: string;
  requestSubmitter: string;
  entityName: string;
  subscriptionNumber: string;
  unifiedNumber: string;
  creationDateTime: string;
  serviceValidUntil: string;
  documentStatus: string;
  isValid: boolean;
}

interface TujarVerificationResultCardProps {
  details: TujarDocumentDetails;
  onDownload: () => void;
  onRevalidate: () => void;
  isDownloading?: boolean;
}

export function TujarVerificationResultCard({
  details,
  onDownload,
  onRevalidate,
  isDownloading = false,
}: TujarVerificationResultCardProps) {
  return (
    <div className="steeper-content" suppressHydrationWarning>
      {/* 1. Card Header: Title & Description on Right, Back Circle on Left (Matches Screenshot) */}
      <div className="tujar-result-header">
        <button
          type="button"
          onClick={onRevalidate}
          className="tujar-circle-back-btn"
          title="العودة"
          aria-label="العودة للبحث"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="tujar-result-header-text">
          <h2 className="tujar-result-title">نتيجة التحقق من الوثائق</h2>
          <p className="tujar-result-desc">
            خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونياً عبر بوابة خدمات المشتركين، وللتحقق من شهادة الاشتراك الرجاء إدخال الرقم المرجعي أو رقم الطلب الخاص بالوثيقة.
          </p>
        </div>
      </div>

      {/* 2. Fields List (Matches Screenshot 1 & 2: Clean white, circular icon on right, right-aligned texts) */}
      <div className="tujar-fields-list">
        {/* 1. اسم الغرفة */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarBuildIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">اسم الغرفة</span>
            <span className="tujar-field-value">{details.chamberName}</span>
          </div>
        </div>

        {/* 2. الخدمة */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarFileIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">الخدمة</span>
            <span className="tujar-field-value">{details.serviceName}</span>
          </div>
        </div>

        {/* 3. رقم الوثيقة */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarListNumberIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">رقم الوثيقة</span>
            <span className="tujar-field-value" dir="ltr">{details.documentNumber}</span>
          </div>
        </div>

        {/* 4. رقم الطلب */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarListNumberIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">رقم الطلب</span>
            <span className="tujar-field-value" dir="ltr">{details.orderNumber}</span>
          </div>
        </div>

        {/* 5. مقدم الطلب */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarUserListIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">مقدم الطلب</span>
            <span className="tujar-field-value">{details.requestSubmitter}</span>
          </div>
        </div>

        {/* 6. اسم المنشأة */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarDepartmentIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">اسم المنشأة</span>
            <span className="tujar-field-value">{details.entityName}</span>
          </div>
        </div>

        {/* 7. رقم العضوية */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarListNumberIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">رقم العضوية</span>
            <span className="tujar-field-value" dir="ltr">{details.subscriptionNumber}</span>
          </div>
        </div>

        {/* 8. الرقم الموحد */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarListNumberIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">الرقم الموحد</span>
            <span className="tujar-field-value" dir="ltr">{details.unifiedNumber}</span>
          </div>
        </div>

        {/* 9. تاريخ ووقت الإنشاء */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarDateIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">تاريخ ووقت الإنشاء</span>
            <span className="tujar-field-value" dir="ltr">{details.creationDateTime}</span>
          </div>
        </div>

        {/* 10. حالة الوثيقة (Matches Screenshot with مقبول and ساري pill badges) */}
        <div className="tujar-field-item">
          <div className="tujar-field-circle">
            <TujarStatusIcon className="w-5 h-5 text-[#344054]" />
          </div>
          <div className="tujar-field-texts">
            <span className="tujar-field-label">حالة الوثيقة</span>
            <div className="tujar-badges-row">
              <span className="tujar-pill-badge">
                <span className="tujar-pill-dot" />
                <span>{details.documentStatus}</span>
              </span>
              <span className="tujar-pill-badge">
                <span className="tujar-pill-dot" />
                <span>{details.isValid ? "ساري" : "منتهي"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons (Matches Screenshot: Right: تحميل الوثيقة, Left: إعادة تحقق) */}
      <div className="tujar-actions-buttons-row">
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="tujar-btn-download-green"
        >
          {isDownloading ? "جاري التحميل..." : "تحميل الوثيقة"}
        </button>

        <button
          type="button"
          onClick={onRevalidate}
          className="tujar-btn-revalidate-gray"
        >
          إعادة تحقق
        </button>
      </div>
    </div>
  );
}
