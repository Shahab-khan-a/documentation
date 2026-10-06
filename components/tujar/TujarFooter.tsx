"use client";

import React from "react";

export function TujarFooter() {
  return (
    <footer className="tujar-footer" dir="rtl" suppressHydrationWarning>
      <div className="tujar-footer-container">
        {/* Section 1: أقسام مهمة */}
        <div className="tujar-footer-section">
          <h3 className="tujar-footer-title">أقسام مهمة</h3>
          <ul className="tujar-footer-links">
            <li>
              <a
                href="https://mc.gov.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="tujar-footer-link"
              >
                الأسئلة الشائعة
              </a>
            </li>
            <li>
              <a href="#privacy" className="tujar-footer-link">
                سياسة الخصوصية
              </a>
            </li>
            <li>
              <a href="#terms" className="tujar-footer-link">
                الشروط والأحكام
              </a>
            </li>
          </ul>
        </div>

        {/* Section 2: روابط أخرى */}
        <div className="tujar-footer-section">
          <h3 className="tujar-footer-title">روابط أخرى</h3>
          <ul className="tujar-footer-links">
            <li>
              <a href="mailto:HD@elm.sa" className="tujar-footer-link-email">
                HD@elm.sa
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: روابط خارجية */}
        <div className="tujar-footer-section">
          <h3 className="tujar-footer-title">روابط خارجية</h3>
          <ul className="tujar-footer-links">
            <li>
              <a
                href="https://mc.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="tujar-footer-link"
              >
                وزارة التجارة
              </a>
            </li>
            <li>
              <a
                href="https://www.mim.gov.sa/ar"
                target="_blank"
                rel="noopener noreferrer"
                className="tujar-footer-link"
              >
                وزارة الصناعة والثروة المعدنية
              </a>
            </li>
            <li>
              <a
                href="https://zatca.gov.sa/ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="tujar-footer-link"
              >
                هيئة الزكاة والضريبة والجمارك
              </a>
            </li>
            <li>
              <a
                href="https://www.hrsd.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="tujar-footer-link"
              >
                الموارد البشرية والتنمية الاجتماعية
              </a>
            </li>
          </ul>
        </div>

        {/* Logos (Matches Screenshot: Federation of Chambers & Ministry of Commerce) */}
        <div className="tujar-footer-logos-row">
          <a
            href="https://fsc.org.sa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اتحاد الغرف التجارية السعودية"
            className="tujar-footer-logo-link"
          >
            <img
              src="/assets/imgs/chambers-2.svg"
              alt="اتحاد الغرف التجارية السعودية"
              className="tujar-footer-logo-img"
            />
          </a>
          <a
            href="https://mc.gov.sa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="وزارة التجارة"
            className="tujar-footer-logo-link"
          >
            <img
              src="/assets/imgs/ministry-commerce.svg"
              alt="وزارة التجارة"
              className="tujar-footer-logo-img"
            />
          </a>
        </div>

        {/* Copyright Notes (Matches Screenshot) */}
        <div className="tujar-footer-copyright-box">
          <p className="tujar-footer-copy-main">
            اتحاد الغرف السعودية. جميع الحقوق محفوظة © 2026
          </p>
          <p className="tujar-footer-copy-sub">
            موقع حكومي مسجّل لدى هيئة الحكومة الرقمية
          </p>
        </div>
      </div>
    </footer>
  );
}
