"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TujarLogo,
  TujarLanguageIcon,
  TujarSignInUserIcon,
  TujarDragIcon,
} from "@/lib/tujar-icons";

export function TujarHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="tujar-header" suppressHydrationWarning>
      <div className="tujar-header-container">
        {/* 1. Mobile Navigation Bar (Matches Screenshots 1, 2, 3) */}
        <div className="tujar-mobile-nav">
          {/* Left: Hamburger menu */}
          <button
            type="button"
            className="tujar-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="القائمة"
          >
            <TujarDragIcon className="w-5 h-5 text-[#101828]" />
          </button>

          {/* Center: Tujar Logo */}
          <Link href="/" className="tujar-mobile-logo" aria-label="الرئيسية">
            <TujarLogo className="h-8 w-auto" />
          </Link>

          {/* Right: Language Switcher Icon [A 文] */}
          <button
            type="button"
            className="tujar-mobile-lang-btn"
            onClick={() => {}}
            aria-label="Change Language"
          >
            <TujarLanguageIcon className="w-6 h-6 text-[#101828]" />
          </button>
        </div>

        {/* 2. Desktop Navigation Bar */}
        <div className="tujar-desktop-nav">
          <div className="flex items-center gap-7">
            <Link href="/" className="inline-flex items-center" aria-label="منصة تجار">
              <TujarLogo className="h-9 w-auto" fill="#00997b" />
            </Link>

            <nav className="flex items-center gap-6">
              <a href="https://tujar.fsc.org.sa/#audience" className="tujar-nav-item">الخدمات</a>
              <a href="https://tujar.fsc.org.sa/#how-to-start" className="tujar-nav-item">لمن المنصة</a>
              <a href="https://tujar.fsc.org.sa/#about" className="tujar-nav-item">كيف تبدأ</a>
              <a href="https://tujar.fsc.org.sa/faq" className="tujar-nav-item">عن المنصة</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="tujar-lang-btn-desktop"
              onClick={() => {}}
              aria-label="Change Language"
            >
              <TujarLanguageIcon className="w-5 h-5 text-[#344054]" />
              <span>English</span>
            </button>

            <button
              type="button"
              className="tujar-login-btn-desktop"
              onClick={() => {}}
            >
              <TujarSignInUserIcon className="w-5 h-5 text-[#344054]" />
              <span>تسجيل الدخول</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="tujar-mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="tujar-mobile-drawer" dir="rtl">
            <div className="tujar-drawer-header">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="منصة تجار"
              >
                <TujarLogo className="h-8 w-auto" fill="#00997b" />
              </Link>
              <button
                type="button"
                className="tujar-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="إغلاق"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="tujar-drawer-body">
              <a
                href="https://tujar.fsc.org.sa/#audience"
                className="tujar-drawer-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                الخدمات
              </a>
              <a
                href="https://tujar.fsc.org.sa/#how-to-start"
                className="tujar-drawer-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                لمن المنصة
              </a>
              <a
                href="https://tujar.fsc.org.sa/#about"
                className="tujar-drawer-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                كيف تبدأ
              </a>
              <a
                href="https://tujar.fsc.org.sa/faq"
                className="tujar-drawer-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                عن المنصة
              </a>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  className="tujar-login-btn-mobile w-full justify-center py-3 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <TujarSignInUserIcon className="w-5 h-5 text-[#344054]" />
                  <span>تسجيل الدخول</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
