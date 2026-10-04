"use client";

import React, { useEffect, useState } from "react";

export function TujarLoader({
  onDone,
  durationMs = 1200,
}: {
  onDone?: () => void;
  durationMs?: number;
}) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onDone?.();
      }, 300);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onDone, durationMs]);

  return (
    <div
      suppressHydrationWarning
      className="tujar-loader-overlay"
      style={{
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? "none" : "auto",
        transition: "opacity 0.3s ease-out",
      }}
    >
      <div className="loading">
        <span className="loader" />
      </div>
    </div>
  );
}
