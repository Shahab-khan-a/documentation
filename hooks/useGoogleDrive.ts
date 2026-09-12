"use client";

import { useState, useCallback, useEffect } from "react";

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  downloadUrl: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export interface SavedSuccessDetails {
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  driveViewLink?: string;
  buttonTitle?: string;
}

export function useGoogleDrive() {
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState("");
  const [drivePickerTarget, setDrivePickerTarget] = useState<
    "backButton" | "verifyAgainButton" | "downloadButton" | null
  >(null);

  const [fileToDelete, setFileToDelete] = useState<DriveItem | null>(null);
  const [fileToReplace, setFileToReplace] = useState<DriveItem | null>(null);
  const [replacingFile, setReplacingFile] = useState<string | null>(null);

  // Upload progress modal states
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadProgressModalOpen, setUploadProgressModalOpen] = useState(false);
  const [uploadProgressFileName, setUploadProgressFileName] = useState("");
  const [uploadProgressFileSize, setUploadProgressFileSize] = useState<number | undefined>(undefined);
  const [uploadProgressButtonTitle, setUploadProgressButtonTitle] = useState("");
  const [uploadProgressStatus, setUploadProgressStatus] = useState<string | undefined>(undefined);

  // Success celebration modal state
  const [uploadSuccessModalOpen, setUploadSuccessModalOpen] = useState(false);
  const [savedSuccessDetails, setSavedSuccessDetails] = useState<SavedSuccessDetails | null>(null);

  // Fetch all Google Drive files
  const fetchDriveFiles = useCallback(async () => {
    setLoadingDrive(true);
    try {
      const res = await fetch("/api/drive");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.files)) {
          setDriveFiles(data.files);
        }
      }
    } catch (err) {
      console.warn("Could not fetch Google Drive files:", err);
    } finally {
      setLoadingDrive(false);
    }
  }, []);

  // Filtered drive files based on search
  const filteredDriveFiles = driveFiles.filter((file) => {
    if (!driveSearchQuery.trim()) return true;
    const q = driveSearchQuery.toLowerCase().trim();
    return (
      (file.name || "").toLowerCase().includes(q) ||
      (file.mimeType || "").toLowerCase().includes(q)
    );
  });

  return {
    driveFiles,
    setDriveFiles,
    filteredDriveFiles,
    loadingDrive,
    setLoadingDrive,
    fetchDriveFiles,
    driveModalOpen,
    setDriveModalOpen,
    driveSearchQuery,
    setDriveSearchQuery,
    drivePickerTarget,
    setDrivePickerTarget,
    fileToDelete,
    setFileToDelete,
    fileToReplace,
    setFileToReplace,
    replacingFile,
    setReplacingFile,
    uploadPercentage,
    setUploadPercentage,
    uploadProgressModalOpen,
    setUploadProgressModalOpen,
    uploadProgressFileName,
    setUploadProgressFileName,
    uploadProgressFileSize,
    setUploadProgressFileSize,
    uploadProgressButtonTitle,
    setUploadProgressButtonTitle,
    uploadProgressStatus,
    setUploadProgressStatus,
    uploadSuccessModalOpen,
    setUploadSuccessModalOpen,
    savedSuccessDetails,
    setSavedSuccessDetails,
  };
}
