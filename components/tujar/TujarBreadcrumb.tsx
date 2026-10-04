"use client";

import React from "react";
import Link from "next/link";

export function TujarBreadcrumb() {
  return (
    <section className="bread-crumb-with-bg-img" suppressHydrationWarning>
      {/* Background SVG pattern */}
      <img
        src="/assets/imgs/profile-pattern-bg.svg"
        alt="Profile Pattern Background"
        className="green-hero-img"
      />

      <div className="bread-content">
        {/* Breadcrumb line */}
        <nav aria-label="Breadcrumb" className="bread-crumb-nav">
          <Link href="/" className="bread-crumb-home-btn">
            <img
              src="/assets/imgs/home-line.svg"
              alt="Home"
              className="w-4 h-4 filter brightness-0 invert"
            />
            <span>الرئيسية</span>
          </Link>
          <span className="bread-crumb-separator">/</span>
          <span className="bread-crumb-current-page">التحقق من الوثائق</span>
        </nav>

        {/* Page Title */}
        <h1 className="bread-crumb-page-title">
          التحقق من الوثائق
        </h1>
      </div>
    </section>
  );
}
