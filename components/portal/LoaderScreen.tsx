"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_FALLBACK_GIF, DEFAULT_ONLINE_FALLBACK_GIF } from "@/constants/defaults";

export interface LoaderScreenProps {
  onDone: () => void;
  durationMs?: number;
  gifUrl?: string;
  restartKey?: number | string;
}

export function LoaderScreen({
  onDone,
  durationMs = 10000,
  gifUrl,
  restartKey,
}: LoaderScreenProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [gifSrc, setGifSrc] = useState<string>(() => {
    const base = gifUrl || DEFAULT_FALLBACK_GIF;
    return restartKey ? `${base}?t=${restartKey}` : base;
  });
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Only update src with cache-busting timestamp if explicitly requested via restartKey (e.g. button re-click)
  useEffect(() => {
    const base = gifUrl || DEFAULT_FALLBACK_GIF;
    if (restartKey) {
      setGifSrc(`${base}?t=${restartKey}`);
    } else {
      setGifSrc(base);
    }
  }, [gifUrl, restartKey]);

  // Mark loaded immediately if browser already has the image ready in cache
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true);
    }
  }, [gifSrc]);

  useEffect(() => {
    const doneTimer = setTimeout(() => {
      onDone();
    }, durationMs);

    return () => {
      clearTimeout(doneTimer);
    };
  }, [onDone, durationMs]);

  return (
    <div
      suppressHydrationWarning
      dir="rtl"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(249, 248, 255, 0.35)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        fontFamily: "'Cairo','Segoe UI',Arial,sans-serif",
      }}
    >
      {/* Graceful placeholder spinner while GIF decodes */}
      {!imgLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none bg-white/70 backdrop-blur-xs z-0">
          <div className="w-11 h-11 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-600 tracking-wide">
            جاري التحقق من الوثيقة...
          </span>
        </div>
      )}

      {/* Top blur overlay: Covers and blurs the top area during animation and scroll */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "155px",
          zIndex: 2,
          background:
            "linear-gradient(to bottom, rgba(249, 248, 255, 0.85) 0%, rgba(249, 248, 255, 0.5) 75%, rgba(249, 248, 255, 0) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        suppressHydrationWarning
        key={restartKey ? String(restartKey) : "initial-loader"}
        src={gifSrc}
        alt="بوابة خدمات الغرفة"
        loading="eager"
        decoding="sync"
        draggable={false}
        onLoad={() => setImgLoaded(true)}
        onError={(e) => {
          setImgLoaded(true);
          e.currentTarget.src = DEFAULT_ONLINE_FALLBACK_GIF;
        }}
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
