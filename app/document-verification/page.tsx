"use client";

import React, { Suspense } from "react";
import { TujarVerificationView } from "@/components/tujar/TujarVerificationView";
import { TujarLoader } from "@/components/tujar/TujarLoader";

export default function DocumentVerificationPage() {
  return (
    <Suspense fallback={<TujarLoader durationMs={1000} />}>
      <TujarVerificationView />
    </Suspense>
  );
}
