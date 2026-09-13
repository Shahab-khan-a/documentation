"use client";

import { useState, useCallback } from "react";

/**
 * Helper to extract Google Drive fileId from internal download URLs or view URLs
 */
function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const queryMatch = url.match(/[?&]fileId=([a-zA-Z0-9_-]+)/i);
  if (queryMatch && queryMatch[1]) return queryMatch[1];
  const pathMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) return pathMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLoaderActive, setDownloadLoaderActive] = useState(false);

  // Fallback trigger download via hidden <a>
  const triggerDownload = useCallback((fileUrl: string, fileName?: string) => {
    if (!fileUrl) return;

    const fileId = extractDriveFileId(fileUrl);
    // If it's a Drive file and we need a direct fallback, use Google's direct download
    const targetUrl = fileId
      ? `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`
      : fileUrl;

    try {
      const a = document.createElement("a");
      a.href = targetUrl;
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
      window.open(targetUrl, "_blank");
    }
  }, []);

  // Download directly with active animation that runs UNTIL file download completes
  const downloadFileWithAnimation = useCallback(
    async (fileUrl: string, fileName?: string) => {
      if (!fileUrl) return;
      setIsDownloading(true);
      setDownloadLoaderActive(true);
      const startTime = Date.now();

      try {
        // 1. Fetch file data stream from download endpoint
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Download HTTP error ${response.status}`);
        }

        // Guard against JSON error bodies disguised as file downloads
        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        if (contentType.includes("application/json")) {
          const json = await response.json();
          throw new Error(json.error || "Server returned JSON error instead of file");
        }

        // 2. Await full blob transfer
        const blob = await response.blob();

        // Ensure at least 1200ms for a smooth animation
        const elapsed = Date.now() - startTime;
        if (elapsed < 1200) {
          await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
        }

        // 3. Trigger immediate file save to user's device
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
        console.warn("Direct stream download notice, triggering reliable fallback:", err);
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
