"use client";

import { useState, useCallback } from "react";

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLoaderActive, setDownloadLoaderActive] = useState(false);

  // Fallback trigger download via hidden <a>
  const triggerDownload = useCallback((fileUrl: string, fileName?: string) => {
    if (!fileUrl) return;
    try {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName || "document.pdf";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          document.body.removeChild(a);
        } catch {
          // ignore
        }
      }, 1000);
    } catch {
      window.open(fileUrl, "_blank");
    }
  }, []);

  // Download directly with active animation that runs UNTIL Google Drive download completes
  const downloadFileWithAnimation = useCallback(
    async (fileUrl: string, fileName?: string) => {
      if (!fileUrl) return;
      setIsDownloading(true);
      setDownloadLoaderActive(true);
      const startTime = Date.now();

      try {
        // 1. Fetch the file data stream from Google Drive endpoint
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Download HTTP error ${response.status}`);
        }

        // 2. Await full blob transfer from Google Drive
        const blob = await response.blob();

        // Ensure at least 1500ms for a smooth animation
        const elapsed = Date.now() - startTime;
        if (elapsed < 1500) {
          await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed));
        }

        // 3. Trigger immediate file save to user's computer
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName || "document.pdf";
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          try {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          } catch {
            // ignore
          }
        }, 2000);
      } catch (err) {
        console.warn("Direct stream download notice, falling back to triggerDownload:", err);
        triggerDownload(fileUrl, fileName);
      } finally {
        // 4. File download completed! Stop animation
        setIsDownloading(false);
        setDownloadLoaderActive(false);
      }
    },
    [triggerDownload]
  );

  return {
    isDownloading,
    downloadLoaderActive,
    downloadFileWithAnimation,
    triggerDownload,
  };
}
