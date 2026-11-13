"use client";

import React, { useEffect, useState, useRef } from "react";

export function TujarLoader({
  onDone,
  durationMs = 1200,
  ready,
  minDurationMs = 650,
  maxDurationMs = 15000,
}: {
  onDone?: () => void;
  durationMs?: number;
  ready?: boolean;
  minDurationMs?: number;
  maxDurationMs?: number;
}) {
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  if (startTimeRef.current === 0) {
    startTimeRef.current = Date.now();
  }

  useEffect(() => {
    let minTimer: NodeJS.Timeout | null = null;
    let maxTimer: NodeJS.Timeout | null = null;

    const triggerDone = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFadingOut(true);
      setTimeout(() => {
        onDone?.();
      }, 300);
    };

    if (ready === undefined) {
      // Standalone timer mode
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, durationMs - elapsed);
      const timer = setTimeout(triggerDone, remaining);
      return () => clearTimeout(timer);
    }

    // Ready-driven mode:
    const elapsed = Date.now() - startTimeRef.current;
    const remainingMin = Math.max(0, minDurationMs - elapsed);

    if (ready) {
      // Data is confirmed ready: wait only for minimum smooth animation time
      if (remainingMin <= 0) {
        triggerDone();
      } else {
        minTimer = setTimeout(triggerDone, remainingMin);
      }
    } else {
      // Data is still loading: KEEP LOADER ACTIVE! Only trigger fallback on absolute timeout
      const remainingMax = Math.max(0, maxDurationMs - elapsed);
      maxTimer = setTimeout(triggerDone, remainingMax);
    }

    return () => {
      if (minTimer) clearTimeout(minTimer);
      if (maxTimer) clearTimeout(maxTimer);
    };
  }, [onDone, durationMs, ready, minDurationMs, maxDurationMs]);

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
