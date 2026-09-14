"use client";

import React from "react";
import Link from "next/link";
import { PortalConfig } from "@/types/portal";
import { SocialIconsList } from "@/components/portal/SocialIconsList";

export interface PublicFooterProps {
  config: PortalConfig;
}

export function PublicFooter({ config }: PublicFooterProps) {
  const d = config;

  return (
    <>
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
          <SocialIconsList socialLinks={d.socialLinks} />

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

    {/* Row 6: Official Chamber Copyright Notice below blue banner */}
    <div
      dir="rtl"
      className="text-center mt-3.5 pb-2 text-[12.5px] sm:text-[13px] font-semibold text-[#1e293b] select-none tracking-normal"
    >
      {d.copyrightText !== undefined && d.copyrightText !== ""
        ? d.copyrightText
        : "جميع الحقوق محفوظة الغرفة التجارية بينبع © 2026"}
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
    </>
  );
}
