"use client";

import { useState, useCallback } from "react";
import { ToastData } from "@/components/ui/ToastNotification";

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "success",
      link?: string,
      linkLabel?: string
    ) => {
      setToast({ message, type, link, linkLabel });
      const timer = setTimeout(() => {
        setToast(null);
      }, link ? 8000 : 4000);
      return () => clearTimeout(timer);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
    setToast,
  };
}
