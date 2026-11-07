"use client";

import React, { useEffect, useState, useRef } from "react";

export function TujarLoader({
  onDone,
  durationMs = 1200,
  ready,
  minDurationMs = 650,
  maxDurationMs = 2500,
}: {
  onDone?: () => void;
  durationMs?: number;
  ready?: boolean;
  minDurationMs?: number;
  maxDurationMs?: number;
}) {
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let minTimer: NodeJS.Timeout | null = null;
    let maxTimer: NodeJS.Timeout | null = null;
    let minTimeElapsed = false;

    const triggerDone = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFadingOut(true);
      setTimeout(() => {
        onDone?.();
      }, 300);
    };

    if (ready === undefined) {
      timer = setTimeout(triggerDone, durationMs);
    } else {
      minTimer = setTimeout(() => {
        minTimeElapsed = true;
        if (ready) {
          triggerDone();
        }
      }, minDurationMs);

      maxTimer = setTimeout(() => {
        triggerDone();
      }, maxDurationMs);

      if (ready && minTimeElapsed) {
        triggerDone();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
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
