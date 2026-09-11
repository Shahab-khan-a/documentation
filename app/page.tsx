"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig } from "@/lib/portal-types";

// Social icons data ordered for RTL display (Facebook on far right, then Twitter, YouTube, Instagram, Skype)
const SOCIAL_ICONS = [
  {
    key: "facebook",
    label: "Facebook",
    svg: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    key: "twitter",
    label: "Twitter",
    svg: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    svg: (
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    svg: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
  },
  {
    key: "skype",
    label: "Skype",
    svg: (
      <path d="M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.688 1.24-1.453 1.24-1.469 0-1.213-2.039-4.164-2.039-1.469 0-2.292.664-2.292 1.617s1.153 1.258 2.157 1.487l2.637.587c2.891.649 3.624 2.346 3.624 3.944 0 2.476-1.902 4.325-5.668 4.325zm11.931 1.37c-.302 1.686-1.715 2.986-3.411 3.289a4.888 4.888 0 0 1-.88.08 4.79 4.79 0 0 1-2.682-.814l.004.003a8.946 8.946 0 0 1-4.892 1.454C5.374 24.256.9 19.692.9 14.024c0-1.861.517-3.57 1.376-5.079A5.11 5.11 0 0 1 2.1 7.9 4.963 4.963 0 0 1 2 6.744a5.001 5.001 0 0 1 5-4.999c.637 0 1.244.124 1.803.334A9.026 9.026 0 0 1 14 .256c4.939 0 8.941 3.999 8.941 8.933 0 .568-.053 1.123-.153 1.66.328.675.513 1.433.513 2.235a4.956 4.956 0 0 1-.301 1.716v-.004z" />
    ),
  },
];

// ─────────────────────────────────────────────────────────
//  LOADER SCREEN (Full screen animation)
// ─────────────────────────────────────────────────────────
function LoaderScreen({
  onDone,
  durationMs,
  gifUrl,
  restartKey,
}: {
  onDone: () => void;
  durationMs: number;
  gifUrl: string;
  restartKey?: number | string;
}) {
  const [fadeOut, setFadeOut] = useState(false);
  const gifSrc = restartKey ? `${gifUrl}?t=${restartKey}` : gifUrl;

  useEffect(() => {
    const fadeDuration = 500;
    const activeDuration = Math.max(durationMs - fadeDuration, 500);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, activeDuration);

    const doneTimer = setTimeout(() => {
      onDone();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone, durationMs]);

  return (
    <div
      dir="rtl"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
        fontFamily: "'Cairo','Segoe UI',Arial,sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={gifSrc}
        src={gifSrc}
        alt="بوابة خدمات الغرفة"
        loading="eager"
        decoding="sync"
        onError={(e) => {
          e.currentTarget.src =
            "https://lottie.host/73358927-6e0d-453a-9a9f-e0607ae61ad8/9sISJeaK1n.gif";
        }}
        style={{ width: "100%", height: "100vh", objectFit: "contain" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  VERIFICATION RESULTS PAGE
// ─────────────────────────────────────────────────────────
function ResultsPage({
  config,
  revealed,
  onDownload,
  onVerifyAgain,
  onBack,
}: {
  config: PortalConfig;
  revealed: boolean;
  onDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onVerifyAgain: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBack: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const d = config;

  return (
    <div
      suppressHydrationWarning
      dir="rtl"
      className="min-h-screen bg-white text-[#212529] relative selection:bg-blue-100"
      style={{
        fontFamily: "var(--font-cairo), 'Cairo', 'Segoe UI', Arial, sans-serif",
        opacity: revealed ? 1 : 0,
        pointerEvents: revealed ? "auto" : "none",
        transition: "opacity 0.25s ease",
      }}
    >


      {/* ══════════════════ HEADER ══════════════════ */}
      <header className="w-full bg-white relative overflow-hidden">
        {/* Subtle Islamic geometric star pattern backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23333' stroke-width='1'/%3E%3Cpath d='M30 15 L45 30 L30 45 L15 30 Z' fill='none' stroke='%23333' stroke-width='1'/%3E%3Cpath d='M0 0 L60 60 M60 0 L0 60' fill='none' stroke='%23333' stroke-width='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-start gap-2 relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/chamber-logo.png"
            alt="شعار بوابة خدمات الغرفة"
            width={36}
            height={40}
            className="w-[34px] h-[38px] object-contain select-none"
          />
          <span
            className="font-bold text-[17px] sm:text-[18px] tracking-tight"
            style={{ color: "#136d93" }}
          >
            {d.portalTitle || "بوابة خدمات الغرفة"}
          </span>
        </div>
        <hr className="border-t border-slate-200 m-0" />
      </header>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
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
              d.backButton.fileUrl && d.backButton.fileUrl.trim() !== ""
                ? d.backButton.fileUrl
                : (d.backButton.url && d.backButton.url !== "#" ? d.backButton.url : "#")
            }
            download={
              d.backButton.fileUrl && d.backButton.fileUrl.trim() !== ""
                ? d.backButton.fileName || "document.pdf"
                : undefined
            }
            target={d.backButton.openInNewTab ? "_blank" : undefined}
            rel={d.backButton.openInNewTab ? "noreferrer" : undefined}
            onClick={onBack}
            className="inline-flex items-center justify-center text-white font-bold text-[13px] rounded-md px-4 py-1.5 no-underline hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
            style={{
              backgroundColor: "#5c9df6",
            }}
          >
            {d.backButton.label || "العودة"}
          </a>
        </div>

        <hr className="border-t border-slate-200 m-0" />

        {/* Intro text: Aligned to start (right in RTL), matching the rest of the text */}
        <div
          className="max-w-[325px] sm:max-w-[360px] mx-auto py-3.5 text-right text-[12.5px] sm:text-[13px] leading-relaxed text-[#475569]"
        >
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
            <span className="text-[#41515e] font-sans" dir="ltr">{d.unifiedNumber}</span>
          </div>

          {/* 4. رقم الطلب */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[#14202c] shrink-0">رقم الطلب</span>
            <span className="text-[#41515e] font-sans" dir="ltr">{d.requestNumber}</span>
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
              <span className="text-[#41515e]" dir="ltr">{d.creationDate}</span>
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
              <span className="text-[#41515e]" dir="ltr">{d.expiryDate}</span>
            </div>
            <div className="text-[#41515e] text-[11.5px] sm:text-[12px] text-right" dir="rtl">
              {d.expiryTime}
            </div>
          </div>

          {/* 10. رقم السجل التجاري */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[#14202c] shrink-0">رقم السجل التجاري</span>
            <span className="text-[#41515e] font-sans" dir="ltr">{d.commercialRegNo}</span>
          </div>

          {/* 11. حالة الطلب */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="font-bold text-[#14202c] shrink-0">حالة الطلب</span>
            <span className="font-bold" style={{ color: d.statusColor || "#32c5cb" }}>
              {d.requestStatus}
            </span>
          </div>

          {/* Dynamic custom fields if any */}
          {d.customFields && d.customFields.length > 0 && d.customFields.map((f) => (
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
            onClick={onDownload}
            className="inline-flex items-center justify-center text-white font-bold text-[13px] rounded-md px-7 py-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs"
            style={{
              backgroundColor: "#5c9df6",
            }}
          >
            {d.downloadButton.label || "تحميل"}
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
            {d.verifyAgainButton.label || "التحقق مرة آخرى"}
          </button>
        </div>

        <hr className="border-t border-slate-200 m-0" />
      </main>

      {/* ══════════════════ FOOTER BLUE BANNER ══════════════════ */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-8">
        <div
          className="relative overflow-hidden rounded-xl shadow-md"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(62, 142, 235, 0.90) 0%, rgba(38, 114, 210, 0.92) 45%, rgba(22, 85, 180, 0.95) 100%), url(/footer-bg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
            color: "white",
          }}
        >
          <div className="relative z-10 px-5 pt-4 pb-4">
            {/* Row 1: dev label */}
            <div className="flex justify-start mb-0.5">
              <span
                style={{
                  fontSize: "11.5px",
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 400,
                }}
              >
                {d.devLabel || "تطوير وتشغيل"}
              </span>
            </div>

            {/* Row 2: Striped logo on right, Company Name on left */}
            <div className="flex items-center justify-start gap-2.5 mb-3.5">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  border: "2px solid rgba(255,255,255,0.75)",
                  borderRadius: "5px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <svg viewBox="0 0 56 56" className="w-full h-full">
                  {[-24, -16, -8, 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80].map((o, i) => (
                    <line
                      key={i}
                      x1={o}
                      y1="0"
                      x2={o + 56}
                      y2="56"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
              </div>

              <div className="text-right leading-tight">
                <div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
                  {d.companyNameAr || "عالم النظم و البرامج"}
                </div>
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 400,
                  }}
                >
                  {d.companyNameEn || "World of Systems & Software"}
                </div>
              </div>
            </div>

            {/* Row 3: Support + phone + white pill */}
            <div className="flex justify-start mb-3">
              <div className="flex flex-col items-start gap-0.5">
                <span style={{ fontSize: "12px", fontWeight: 500, color: "white" }}>
                  للإستفسار والدعم الفني
                </span>
                <a
                  href={`tel:${d.supportPhone}`}
                  dir="ltr"
                  className="no-underline hover:underline"
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "monospace",
                    letterSpacing: "0.5px",
                  }}
                >
                  {d.supportPhone}
                </a>
                <div
                  style={{
                    width: "52px",
                    height: "18px",
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: "20px",
                    marginTop: "2px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.22)",
                marginBottom: "12px",
              }}
            />

            {/* Row 4: SSL badge on the left, Social Icons on the right */}
            {/* In RTL: Child 1 (Social) is on the RIGHT; Child 2 (SSL) is on the LEFT */}
            <div className="flex items-center justify-between">
              {/* Social icons on the right */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {SOCIAL_ICONS.map(({ key, label, svg }) => {
                  const href =
                    (d.socialLinks as Record<string, string | undefined>)[key] ||
                    `#${label.toLowerCase()}`;
                  return (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      aria-label={label}
                      className="no-underline transition-transform hover:scale-110"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.18)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                        {svg}
                      </svg>
                    </a>
                  );
                })}
              </div>

              {/* SSL Secured Badge on the left */}
              <div className="flex flex-col items-center gap-0.5">
                <div style={{ width: "34px", height: "38px" }}>
                  <svg viewBox="0 0 46 52" className="w-full h-full">
                    <path
                      d="M23 2 L42 10 L42 28 C42 39 33 47 23 50 C13 47 4 39 4 28 L4 10 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="2.5"
                    />
                    <text
                      x="23"
                      y="27"
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="Arial,sans-serif"
                      letterSpacing="0.5"
                    >
                      SSL
                    </text>
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "7.5px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  SECURED
                </span>
              </div>
            </div>

            {/* Row 5: Browser recommendation */}
            <div
              className="text-center mt-3"
              style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}
            >
              يفضل استخدام متصفح جوجل كروم
            </div>
          </div>
        </div>
      </div>

      {/* Floating admin shortcut badge on bottom left */}
      <Link
        href="/admin"
        className="fixed bottom-3 left-3 z-30 w-7 h-7 rounded-full bg-[#18181b] hover:bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-lg select-none transition-all active:scale-95 no-underline"
        title="لوحة التحكم / Admin Panel"
      >
        N
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN ROOT COMPONENT
// ─────────────────────────────────────────────────────────
export default function DocumentVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const [config, setConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);
  const [loaded, setLoaded] = useState(true);
  const [buttonLoaderKey, setButtonLoaderKey] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Hidden download trigger helper
  const triggerDownload = (fileUrl: string, fileName?: string) => {
    if (!fileUrl) return;
    const cleanName = fileName || "document.pdf";
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = cleanName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        // ignore
      }
    }, 1000);
  };

  // Helper to normalize URLs (adds https:// if protocol is missing)
  const normalizeUrl = (raw?: string): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "#") return null;
    if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Universal button action executor
  const executeButtonAction = (
    btn: {
      actionType?: string;
      url?: string;
      fileUrl?: string;
      fileName?: string;
      openInNewTab?: boolean;
    },
    defaultFallback: () => void
  ) => {
    // 1. If file attached (actionType === "file" OR fileUrl exists) -> DOWNLOAD FILE
    if (btn.fileUrl && btn.fileUrl.trim() !== "") {
      triggerDownload(btn.fileUrl.trim(), btn.fileName || "document.pdf");
      return;
    }

    // 2. If URL configured (url exists and not "#") -> GO TO LINK
    const targetUrl = normalizeUrl(btn.url);
    if (targetUrl) {
      if (btn.openInNewTab) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = targetUrl;
      }
      return;
    }

    // 3. Default fallback
    defaultFallback();
  };

  // 1. Fetch live config from server & listen to Admin updates
  useEffect(() => {
    async function fetchLiveConfig() {
      // Restore client-cached config after hydration
      try {
        const cached = localStorage.getItem("portal_config_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setConfig(parsed);
          if (parsed.enableInitialLoader) {
            setLoaded(false);
          }
        }
      } catch {
        // ignore
      }

      try {
        const query = new URLSearchParams();
        if (params?.serial && typeof params.serial === "string") {
          query.set("serial", params.serial);
        }
        if (params?.unified && typeof params.unified === "string") {
          query.set("unified", params.unified);
        }
        query.set("_t", Date.now().toString());

        const res = await fetch(`/api/config?${query.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data: PortalConfig = await res.json();
          setConfig(data);
          try {
            localStorage.setItem("portal_config_cache", JSON.stringify(data));
          } catch {
            // ignore
          }
          if (data.enableInitialLoader) {
            setLoaded(false);
          } else {
            setLoaded(true);
          }
        }
      } catch (err) {
        console.error("Error fetching live config:", err);
      }
    }
    fetchLiveConfig();

    // Listen for storage events (real-time sync when admin saves in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portal_config_cache" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setConfig(updated);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [params]);

  // Synchronize browser URL bar to display '/[serialNumber]/[unifiedNumber]'
  useEffect(() => {
    const cleanSerial = config.serialNumber?.trim();
    const cleanUnified = config.unifiedNumber?.trim();
    if (!cleanSerial) return;

    const targetPath = cleanUnified
      ? `/${encodeURIComponent(cleanSerial)}/${encodeURIComponent(cleanUnified)}`
      : `/${encodeURIComponent(cleanSerial)}`;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      // Do not rewrite if inside admin or api
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/api")) {
        return;
      }
      try {
        if (decodeURIComponent(currentPath) !== decodeURIComponent(targetPath)) {
          window.history.replaceState(null, "", targetPath);
        }
      } catch {
        window.history.replaceState(null, "", targetPath);
      }
    }
  }, [config.serialNumber, config.unifiedNumber]);

  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleButtonLoaderDone = useCallback(() => {
    setButtonLoaderKey(null);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  // Action: Button 1 (العودة / Back)
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const btn = config.backButton;
    executeButtonAction(btn, () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push("/");
      }
    });
  };

  // Action: Button 2 (التحقق مرة آخرى / Verify Again)
  const handleVerifyAgainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = config.verifyAgainButton;

    const action = () => {
      executeButtonAction(btn, () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };

    if (btn.showLoader) {
      setPendingAction(() => action);
      setButtonLoaderKey(Date.now());
    } else {
      action();
    }
  };

  // Action: Button 3 (تحميل / Download)
  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = config.downloadButton;

    const action = () => {
      executeButtonAction(btn, () => {
        window.print();
      });
    };

    if (btn.showLoader) {
      setPendingAction(() => action);
      setButtonLoaderKey(Date.now());
    } else {
      action();
    }
  };

  return (
    <>
      {/* Results page */}
      <ResultsPage
        config={config}
        revealed={loaded}
        onDownload={handleDownloadClick}
        onVerifyAgain={handleVerifyAgainClick}
        onBack={handleBackClick}
      />

      {/* Initial page loader if enabled */}
      {!loaded && config.enableInitialLoader && (
        <LoaderScreen
          onDone={handleLoaderDone}
          durationMs={config.loaderDurationMs}
          gifUrl={config.loaderGifUrl}
        />
      )}

      {/* Button click loader animation */}
      {buttonLoaderKey !== null && (
        <LoaderScreen
          key={buttonLoaderKey}
          restartKey={buttonLoaderKey}
          gifUrl={config.buttonLoaderGifUrl}
          onDone={handleButtonLoaderDone}
          durationMs={config.buttonLoaderDurationMs}
        />
      )}
    </>
  );
}
