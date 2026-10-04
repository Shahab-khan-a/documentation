"use client";

import React from "react";
import { TujarCheckIcon } from "@/lib/tujar-icons";

interface TujarStepperProps {
  currentStep?: number;
}

export function TujarStepper({ currentStep = 2 }: TujarStepperProps) {
  return (
    <div className="stepper-card-wrapper" suppressHydrationWarning>
      <ul className="tujar-stepper-timeline">
        {/* Step 1: الاستعلام بالرقم المرجعي (Matches Screenshot 2) */}
        <li className="tujar-timeline-step">
          <div className="tujar-step-circle-green">
            <TujarCheckIcon className="w-4 h-4 text-white" />
          </div>
          <div className="tujar-step-info">
            <div className="tujar-step-title">الاستعلام بالرقم المرجعي</div>
            <div className="tujar-step-subtitle">البحث عن وثيقة بقائمة العمليات</div>
          </div>
        </li>

        {/* Step 2: التحقق عبر عرض بيانات الوثيقة و تحميلها (Matches Screenshot 2 & 3) */}
        <li className="tujar-timeline-step">
          <div className="tujar-step-circle-green">
            <TujarCheckIcon className="w-4 h-4 text-white" />
          </div>
          <div className="tujar-step-info">
            <div className="tujar-step-title">التحقق عبر عرض بيانات الوثيقة و تحميلها</div>
            <div className="tujar-step-subtitle">التحقق عبر عرض بيانات الوثيقة و تحميلها</div>
          </div>
        </li>
      </ul>

      {/* Faint Saudi City Skyline Illustration (anchored at bottom) */}
      <div className="hero-skyline">
        <img
          src="/assets/imgs/auth-portal-bg.svg"
          alt="City Skyline"
          className="skyline-image"
        />
      </div>
    </div>
  );
}
