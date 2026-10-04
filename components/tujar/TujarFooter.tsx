"use client";

import React from "react";

export function TujarFooter() {
  return (
    <>
      <footer className="tujar-mobile-footer" suppressHydrationWarning>
        <div className="max-w-[1280px] mx-auto">
          {/* Section 1: أقسام مهمة */}
          <div className="mb-4">
            <h3 className="tujar-footer-section-title">أقسام مهمة</h3>
            <ul className="tujar-footer-links-list">
              <li>
                <a href="/faq">الأسئلة الشائعة</a>
              </li>
              <li>
                <a href="/privacy-policy">سياسة الخصوصية</a>
              </li>
              <li>
                <a href="/terms-and-conditions">الشروط والأحكام</a>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="tujar-footer-divider" />

          {/* Section 2: روابط أخرى */}
          <div className="mb-4">
            <h3 className="tujar-footer-section-title">روابط أخرى</h3>
            <ul className="tujar-footer-links-list">
              <li>
                <a href="mailto:HD@elm.sa" className="font-sans" dir="ltr">
                  HD@elm.sa
                </a>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="tujar-footer-divider" />

          {/* Section 3: روابط خارجية */}
          <div className="mb-6">
            <h3 className="tujar-footer-section-title">روابط خارجية</h3>
            <ul className="tujar-footer-links-list">
              <li>
                <a href="https://mc.gov.sa" target="_blank" rel="noopener noreferrer">
                  وزارة التجارة
                </a>
              </li>
              <li>
                <a href="https://www.mim.gov.sa/ar" target="_blank" rel="noopener noreferrer">
                  وزارة الصناعة والثروة المعدنية
                </a>
              </li>
              <li>
                <a href="https://zatca.gov.sa/ar/" target="_blank" rel="noopener noreferrer">
                  هيئة الزكاة والضريبة والجمارك
                </a>
              </li>
              <li>
                <a href="https://www.hrsd.gov.sa" target="_blank" rel="noopener noreferrer">
                  الموارد البشرية والتنمية الاجتماعية
                </a>
              </li>
            </ul>
          </div>

          {/* Logos (Matches Screenshot 3: Right: Federation of Chambers, Left: Ministry of Commerce) */}
          <div className="tujar-footer-logos-box">
            <a
              href="https://fsc.org.sa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اتحاد الغرف التجارية السعودية"
            >
              <img
                src="/assets/imgs/chambers-2.svg"
                alt="اتحاد الغرف التجارية السعودية"
              />
            </a>
            <a
              href="https://mc.gov.sa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="وزارة التجارة"
            >
              <img
                src="/assets/imgs/ministry-commerce.svg"
                alt="وزارة التجارة"
              />
            </a>
          </div>

          {/* Copyright Notes */}
          <div className="mt-4">
            <p className="tujar-footer-copy-text">
              اتحاد الغرف السعودية. جميع الحقوق محفوظة © 2026
            </p>
            <p className="tujar-footer-gov-note">
              موقع حكومي مسجّل لدى هيئة الحكومة الرقمية
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button (Matches Screenshot 1, 2, 3) */}
      <div
        className="tujar-floating-chat"
        title="الدعم والمساعدة"
        onClick={() => {}}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <circle cx="8.5" cy="12" r="1.1" fill="#ffffff" stroke="none" />
          <circle cx="12" cy="12" r="1.1" fill="#ffffff" stroke="none" />
          <circle cx="15.5" cy="12" r="1.1" fill="#ffffff" stroke="none" />
        </svg>
      </div>
    </>
  );
}
