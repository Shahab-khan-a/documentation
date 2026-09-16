"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { PortalConfig, PortalRecord } from "@/types/portal";
import { AdminLanguage } from "@/lib/admin-translations";
import { DEFAULT_RECORD_REQUEST_NUMBER } from "@/constants/record-editor";

export interface UseCreateRecordFromSourceParams {
  sourceRecord: PortalRecord | null;
  open: boolean;
  lang: AdminLanguage;
  onSaveAsNew: (newRecord: PortalRecord) => Promise<boolean | void> | boolean | void;
  onClose: () => void;
}

export function useCreateRecordFromSource({
  sourceRecord,
  open,
  lang,
  onSaveAsNew,
  onClose,
}: UseCreateRecordFromSourceParams) {
  const isRtl = lang === "ar" || lang === "ur";

  // Helper to generate a fresh unique serial number
  const generateNewSerial = useCallback(() => {
    return String(Math.floor(100000 + Math.random() * 900000));
  }, []);

  // Form state
  const [formData, setFormData] = useState<PortalConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [serialError, setSerialError] = useState("");

  // Initialize or re-populate when sourceRecord opens
  useEffect(() => {
    if (sourceRecord && open) {
      // Keep exact same data from source record without any automatic change
      setFormData({
        ...sourceRecord,
      });
      setSerialError("");
    } else {
      setFormData(null);
    }
  }, [sourceRecord, open]);

  // Compute live preview link
  const livePreviewUrl = useMemo(() => {
    if (!formData) return "";
    const cleanReq = (formData.requestNumber || "").trim() || DEFAULT_RECORD_REQUEST_NUMBER;
    const cleanSerial = (formData.serialNumber || "").trim();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = cleanSerial
      ? `/sa/#/DocumentVerify/${encodeURIComponent(cleanReq)}/mem/${encodeURIComponent(cleanSerial)}`
      : `/sa/#/DocumentVerify/${encodeURIComponent(cleanReq)}/mem`;
    return `${origin}${path}`;
  }, [formData]);

  const handleFieldChange = useCallback((field: keyof PortalConfig, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (field === "serialNumber") {
      setSerialError("");
    }
  }, []);

  const handleRandomizeSerial = useCallback(() => {
    const newS = generateNewSerial();
    handleFieldChange("serialNumber", newS);
  }, [generateNewSerial, handleFieldChange]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!formData || !sourceRecord) return;

      const cleanSerial = (formData.serialNumber || "").trim();
      if (!cleanSerial) {
        setSerialError(
          lang === "en"
            ? "Serial Number is required!"
            : lang === "ur"
            ? "سیریل نمبر درج کرنا لازمی ہے!"
            : "الرقم التسلسلي مطلوب للوثيقة الجديدة!"
        );
        return;
      }

      const cleanUnified = (formData.unifiedNumber || "").trim();
      const cleanReq = (formData.requestNumber || "").trim();
      const now = new Date().toISOString();

      // Generate a unique document id so multiple identical cards can be stored independently without modifying or suffixing data
      const uniqueId = `rec_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecordToSave: PortalRecord = {
        ...formData,
        id: uniqueId,
        serialNumber: cleanSerial,
        unifiedNumber: cleanUnified,
        requestNumber: cleanReq,
        createdAt: now,
        updatedAt: now,
      };

      setIsSaving(true);
      try {
        const ok = await onSaveAsNew(newRecordToSave);
        if (ok !== false) {
          onClose();
        }
      } finally {
        setIsSaving(false);
      }
    },
    [formData, sourceRecord, lang, handleFieldChange, onSaveAsNew, onClose]
  );

  return {
    isRtl,
    formData,
    setFormData,
    isSaving,
    serialError,
    setSerialError,
    livePreviewUrl,
    handleFieldChange,
    handleRandomizeSerial,
    handleSubmit,
  };
}
