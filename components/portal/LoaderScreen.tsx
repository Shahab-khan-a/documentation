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
  const [fadeOut, setFadeOut] = useState(false);
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
      suppressHydrationWarning
      dir="rtl"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(249, 248, 255, 0.4)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
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
