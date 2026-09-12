"use client";

import React from "react";
import Link from "next/link";
import { PortalConfig } from "@/types/portal";
import { TranslationStrings } from "@/constants/translations";
import { IconPreview, IconDeviceDesktop, IconDeviceMobile } from "@/components/icons/AdminIcons";

export interface PublicPreviewPaneProps {
  config: PortalConfig;
  previewDevice: "desktop" | "mobile";
  setPreviewDevice: (device: "desktop" | "mobile") => void;
  publicLink: string;
  t: TranslationStrings;
}

export function PublicPreviewPane({
  config,
  previewDevice,
  setPreviewDevice,
  publicLink,
  t,
}: PublicPreviewPaneProps) {
  return (
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
            href={publicLink}
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
              {config.customFields &&
                config.customFields.length > 0 &&
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
  );
}
