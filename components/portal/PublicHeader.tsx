"use client";

import React from "react";

export interface PublicHeaderProps {
  portalTitle?: string;
}

export function PublicHeader({ portalTitle = "بوابة خدمات الغرفة" }: PublicHeaderProps) {
  return (
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
          {portalTitle}
        </span>
      </div>
      <hr className="border-t border-slate-200 m-0" />
    </header>
  );
}
