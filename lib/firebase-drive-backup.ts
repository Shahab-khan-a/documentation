import { Readable } from "stream";
import { PortalRecord } from "@/lib/portal-types";
import {
  getAllPortalRecordsFromFirebase,
  savePortalRecordToFirebase,
} from "@/lib/firebase";
import {
  getGoogleDriveClient,
  mirrorFileToSecondaryDrive,
  GOOGLE_DRIVE_FOLDER_ID,
} from "@/lib/googleDrive";

export const MASTER_BACKUP_FILENAME = "firebase_all_records_backup.json";

export interface DriveBackupResult {
  success: boolean;
  totalRecords: number;
  backupAt: string;
  fileName: string;
  primaryFileId?: string;
  secondaryFileId?: string;
  primaryDriveUrl?: string;
  records?: PortalRecord[];
  error?: string;
}

/**
 * Backs up all Firebase Firestore records to both Google Drive accounts
 * as a master JSON file (firebase_all_records_backup.json).
 */
export async function backupRecordsToGoogleDrive(
  providedRecords?: PortalRecord[]
): Promise<DriveBackupResult> {
  const now = new Date().toISOString();
  try {
    // 1. Retrieve records if not provided
    let records = providedRecords;
    if (!records || records.length === 0) {
      records = await getAllPortalRecordsFromFirebase();
    }

    const backupPayload = {
      version: "1.0",
      backupAt: now,
      totalRecords: records.length,
      system: "E-Services Verification Portal",
      records,
    };

    const jsonContent = JSON.stringify(backupPayload, null, 2);
    const buffer = Buffer.from(jsonContent, "utf-8");
    const mimeType = "application/json";

    let primaryFileId: string | undefined;
    let primaryDriveUrl: string | undefined;

    // 2. Upload / Update in Primary Google Drive (kms475531k)
    const { drive, folderId, isConfigured } = getGoogleDriveClient();
    const effectiveFolderId = folderId || GOOGLE_DRIVE_FOLDER_ID;

    if (isConfigured && drive) {
      try {
        // Search if file already exists in folder
        const searchRes = await drive.files.list({
          q: `'${effectiveFolderId}' in parents and name = '${MASTER_BACKUP_FILENAME}' and trashed = false`,
          fields: "files(id, name, webViewLink)",
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
        });

        const existingFile = searchRes.data.files?.[0];

        if (existingFile?.id) {
          // Update existing backup file
          const stream = new Readable();
          stream.push(buffer);
          stream.push(null);

          const updateRes = await drive.files.update({
            fileId: existingFile.id,
            supportsAllDrives: true,
            media: {
              mimeType,
              body: stream,
            },
            fields: "id, name, webViewLink",
          });

          primaryFileId = updateRes.data.id || existingFile.id;
          primaryDriveUrl = updateRes.data.webViewLink || existingFile.webViewLink || undefined;
          console.log(`[Drive Backup] Updated master backup in Primary Drive: ${primaryFileId}`);
        } else {
          // Create new backup file
          const stream = new Readable();
          stream.push(buffer);
          stream.push(null);

          const createRes = await drive.files.create({
            supportsAllDrives: true,
            requestBody: {
              name: MASTER_BACKUP_FILENAME,
              parents: [effectiveFolderId],
              mimeType,
            },
            media: {
              mimeType,
              body: stream,
            },
            fields: "id, name, webViewLink",
          });

          primaryFileId = createRes.data.id || undefined;
          primaryDriveUrl = createRes.data.webViewLink || undefined;
          console.log(`[Drive Backup] Created new master backup in Primary Drive: ${primaryFileId}`);
        }
      } catch (primaryErr) {
        console.warn("[Drive Backup] Primary Drive backup warning:", primaryErr);
      }
    }

    // Fallback: If primary drive upload failed or service account wasn't configured, try Primary Apps Script
    if (!primaryFileId && process.env.GOOGLE_APPS_SCRIPT_URL) {
      try {
        const gasRes = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            base64: buffer.toString("base64"),
            fileName: MASTER_BACKUP_FILENAME,
            mimeType,
          }),
        });
        const text = await gasRes.text();
        const data = JSON.parse(text);
        if (data.success && data.fileId) {
          primaryFileId = data.fileId;
          primaryDriveUrl = data.webViewLink;
        }
      } catch (gasErr) {
        console.warn("[Drive Backup] Primary Apps Script fallback failed:", gasErr);
      }
    }

    // 3. Mirror directly and independently to Secondary Google Drive (dildaraliswati720)
    let secondaryFileId: string | undefined;
    try {
      const mirrorRes = await mirrorFileToSecondaryDrive(
        primaryFileId || "master_backup_payload",
        MASTER_BACKUP_FILENAME,
        buffer,
        mimeType
      );
      if (mirrorRes.success) {
        secondaryFileId = mirrorRes.secondaryFileId;
        console.log(`[Drive Backup] Master backup mirrored to Secondary Drive: ${secondaryFileId}`);
      }
    } catch (mirrorErr) {
      console.warn("[Drive Backup] Secondary Drive mirror warning:", mirrorErr);
    }

    return {
      success: Boolean(primaryFileId || secondaryFileId),
      totalRecords: records.length,
      backupAt: now,
      fileName: MASTER_BACKUP_FILENAME,
      primaryFileId,
      secondaryFileId,
      primaryDriveUrl,
      records,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Drive Backup] Unexpected backup error:", err);
    return {
      success: false,
      totalRecords: 0,
      backupAt: now,
      fileName: MASTER_BACKUP_FILENAME,
      error: errorMsg,
    };
  }
}

export { convertRecordToMainPageArabic } from "@/lib/arabic-format";

/**
 * Restores records from a JSON string or buffer into Firebase Firestore.
 * Supports BOTH standard format AND Main Page Arabic format!
 */
export async function restoreRecordsToFirebase(
  jsonString: string
): Promise<{ success: boolean; restoredCount: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    const recordsList: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed["الوثائق"])
      ? parsed["الوثائق"]
      : Array.isArray(parsed["الوثائق_المعتمدة"])
      ? parsed["الوثائق_المعتمدة"]
      : Array.isArray(parsed["السجلات"])
      ? parsed["السجلات"]
      : Array.isArray(parsed.records)
      ? parsed.records
      : [];

    if (recordsList.length === 0) {
      return { success: false, restoredCount: 0, error: "No records found in backup" };
    }

    let restored = 0;
    for (const raw of recordsList) {
      if (!raw) continue;
      const serialNumber =
        raw["الرقم التسلسلي للوثيقة"] ||
        raw["الرقم التسلسلي"] ||
        raw.serialNumber ||
        raw.id;

      if (!serialNumber) continue;

      const id = String(raw.id || `${serialNumber}_${raw["الرقم الموحد (700)"] || raw.unifiedNumber || "doc"}`);
      const recordToSave: PortalRecord = {
        id,
        serialNumber: String(serialNumber).trim(),
        chamberName: raw["إسم الغرفة"] || raw.chamberName || "",
        facilityName: raw["إسم المنشأة"] || raw.facilityName || "",
        facilitySubName: raw["نوع المنشأة"] || raw.facilitySubName || "",
        unifiedNumber: raw["الرقم الموحد (700)"] || raw.unifiedNumber || "",
        requestNumber: raw["رقم الطلب"] || raw.requestNumber || "",
        requestType: raw["نوع الطلب"] || raw.requestType || "",
        applicantName: raw["إسم مقدم الطلب"] || raw.applicantName || "",
        creationDate:
          raw["تاريخ الإنشاء"] ||
          raw["تاريخ ووقت إنشاء الطلب"]?.split(" ")?.[0] ||
          raw.creationDate ||
          "",
        creationTime:
          raw["وقت الإنشاء"] ||
          raw["تاريخ ووقت إنشاء الطلب"]?.split(" ")?.[1] ||
          raw.creationTime ||
          "",
        amount: raw["مبلغ الطلب"] || raw.amount || "",
        expiryDate:
          raw["تاريخ الإنتهاء"] ||
          raw["تاريخ صلاحية الطلب"]?.split(" ")?.[0] ||
          raw.expiryDate ||
          "",
        expiryTime:
          raw["وقت الإنتهاء"] ||
          raw["تاريخ صلاحية الطلب"]?.split(" ")?.[1] ||
          raw.expiryTime ||
          "",
        commercialRegNo: raw["رقم السجل التجاري"] || raw.commercialRegNo || "",
        requestStatus: raw["حالة الطلب"] || raw.requestStatus || "معتمد",
        portalTitle: raw.portalTitle || "بوابة خدمات المشتركين",
        pageTitle: raw.pageTitle || "التحقق من الوثائق",
        devLabel: raw.devLabel || "",
        companyNameAr: raw.companyNameAr || "",
        companyNameEn: raw.companyNameEn || "",
        supportPhone: raw.supportPhone || "",
        socialLinks: raw.socialLinks || {},
        loaderGifUrl: raw.loaderGifUrl || "",
        buttonLoaderGifUrl: raw.buttonLoaderGifUrl || "",
        loaderDurationMs: raw.loaderDurationMs || 0,
        buttonLoaderDurationMs: raw.buttonLoaderDurationMs || 0,
        enableInitialLoader: Boolean(raw.enableInitialLoader),
        downloadButton: {
          label: "تحميل",
          actionType: "file",
          fileUrl:
            raw["أزرار ومرفقات الوثيقة"]?.["رابط ملف الوثيقة (PDF)"] ||
            raw.downloadButton?.fileUrl ||
            "",
          fileName:
            raw["أزرار ومرفقات الوثيقة"]?.["إسم ملف الوثيقة"] ||
            raw.downloadButton?.fileName ||
            "",
          url:
            raw["أزرار ومرفقات الوثيقة"]?.["رابط ملف الوثيقة (PDF)"] ||
            raw.downloadButton?.url ||
            "",
        },
        verifyAgainButton: {
          label: "التحقق مرة آخرى",
          actionType: "link",
          url:
            raw["أزرار ومرفقات الوثيقة"]?.["رابط التحقق مرة آخرى"] ||
            raw.verifyAgainButton?.url ||
            "",
        },
        backButton: {
          label: "العودة",
          actionType: "link",
          url:
            raw["أزرار ومرفقات الوثيقة"]?.["رابط زر العودة"] ||
            raw.backButton?.url ||
            "",
        },
        createdAt: raw["تاريخ التوثيق والتحديث"] || raw.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await savePortalRecordToFirebase(recordToSave);
      restored++;
    }

    return { success: true, restoredCount: restored };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, restoredCount: 0, error: msg };
  }
}

export interface CleanFormData {
  serialNumber: string;
  unifiedNumber: string;
  requestNumber: string;
  requestType: string;
  requestStatus: string;
  statusColor?: string;
  chamberName: string;
  facilityName: string;
  facilitySubName: string;
  commercialRegNo: string;
  applicantName: string;
  creationDate: string;
  creationTime: string;
  expiryDate: string;
  expiryTime: string;
  amount: string;
  customFields: Array<{ id: string; label: string; value: string }>;
  buttons: {
    downloadButton: {
      label: string;
      actionType: string;
      fileUrl?: string;
      fileName?: string;
      url?: string;
      fileSize?: number;
    };
    verifyAgainButton: {
      label: string;
      actionType: string;
      url: string;
    };
    backButton: {
      label: string;
      actionType: string;
      url: string;
    };
  };
  footer: {
    companyNameAr: string;
    companyNameEn: string;
    supportPhone: string;
    devLabel: string;
    copyrightText: string;
  };
  savedAt: string;
}

/**
 * Extracts ONLY the actual fields visible in the Admin Panel form,
 * stripping out all internal Firebase flags, cache tokens, composite keys, and system variables.
 */
export function extractCleanFormData(raw: any): CleanFormData {
  return {
    serialNumber: (raw?.serialNumber || "").trim(),
    unifiedNumber: (raw?.unifiedNumber || "").trim(),
    requestNumber: (raw?.requestNumber || "").trim(),
    requestType: raw?.requestType || "",
    requestStatus: raw?.requestStatus || "",
    statusColor: raw?.statusColor || "",
    chamberName: raw?.chamberName || "",
    facilityName: raw?.facilityName || "",
    facilitySubName: raw?.facilitySubName || "",
    commercialRegNo: raw?.commercialRegNo || "",
    applicantName: raw?.applicantName || "",
    creationDate: raw?.creationDate || "",
    creationTime: raw?.creationTime || "",
    expiryDate: raw?.expiryDate || "",
    expiryTime: raw?.expiryTime || "",
    amount: raw?.amount || "",
    customFields: Array.isArray(raw?.customFields)
      ? raw.customFields.map((f: any) => ({
          id: String(f?.id || ""),
          label: String(f?.label || ""),
          value: String(f?.value || ""),
        }))
      : [],
    buttons: {
      downloadButton: {
        label: raw?.downloadButton?.label || "",
        actionType: raw?.downloadButton?.actionType || "file",
        fileUrl: raw?.downloadButton?.fileUrl || "",
        fileName: raw?.downloadButton?.fileName || "",
        url: raw?.downloadButton?.url || "",
        fileSize: raw?.downloadButton?.fileSize,
      },
      verifyAgainButton: {
        label: raw?.verifyAgainButton?.label || "",
        actionType: raw?.verifyAgainButton?.actionType || "link",
        url: raw?.verifyAgainButton?.url || "",
      },
      backButton: {
        label: raw?.backButton?.label || "",
        actionType: raw?.backButton?.actionType || "link",
        url: raw?.backButton?.url || "",
      },
    },
    footer: {
      companyNameAr: raw?.companyNameAr || "",
      companyNameEn: raw?.companyNameEn || "",
      supportPhone: raw?.supportPhone || "",
      devLabel: raw?.devLabel || "",
      copyrightText: raw?.copyrightText || "",
    },
    savedAt: new Date().toISOString(),
  };
}

/**
 * Saves this clean form record directly and immediately into both Google Drive accounts.
 * Google Drive does NOT wait for Firebase — saves direct to:
 * - Primary Drive (kms475531k)
 * - Secondary Drive (dildaraliswati720)
 * File Name: record_<serialNumber>.json
 */
export async function saveCleanRecordDirectToDrive(
  formData: any
): Promise<{ success: boolean; fileName: string; primaryFileId?: string; secondaryFileId?: string; error?: string }> {
  const cleanData = extractCleanFormData(formData);
  const serial = cleanData.serialNumber;
  if (!serial) {
    return { success: false, fileName: "", error: "Missing serial number" };
  }

  const fileName = `record_${serial}.json`;
  const jsonContent = JSON.stringify(cleanData, null, 2);
  const buffer = Buffer.from(jsonContent, "utf-8");
  const mimeType = "application/json";

  let primaryFileId: string | undefined;

  // 1. Save directly to Primary Google Drive
  const { drive, folderId, isConfigured } = getGoogleDriveClient();
  const effectiveFolderId = folderId || GOOGLE_DRIVE_FOLDER_ID;

  if (isConfigured && drive) {
    try {
      const searchRes = await drive.files.list({
        q: `'${effectiveFolderId}' in parents and name = '${fileName}' and trashed = false`,
        fields: "files(id, name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const existing = searchRes.data.files?.[0];

      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      if (existing?.id) {
        const updateRes = await drive.files.update({
          fileId: existing.id,
          supportsAllDrives: true,
          media: { mimeType, body: stream },
          fields: "id, name",
        });
        primaryFileId = updateRes.data.id || existing.id;
        console.log(`[Direct Drive Save] Updated clean record in Primary Drive: ${fileName}`);
      } else {
        const createRes = await drive.files.create({
          supportsAllDrives: true,
          requestBody: {
            name: fileName,
            parents: [effectiveFolderId],
          },
          media: { mimeType, body: stream },
          fields: "id, name",
        });
        primaryFileId = createRes.data.id || undefined;
        if (primaryFileId) {
          drive.permissions.create({
            fileId: primaryFileId,
            supportsAllDrives: true,
            requestBody: { role: "reader", type: "anyone" },
          }).catch(() => {});
        }
        console.log(`[Direct Drive Save] Created clean record in Primary Drive: ${fileName}`);
      }
    } catch (driveErr) {
      console.warn("[Direct Drive Save] Primary Drive save notice:", driveErr);
    }
  }

  // Fallback if service account not available: Primary Apps Script
  if (!primaryFileId && process.env.GOOGLE_APPS_SCRIPT_URL) {
    try {
      const gasRes = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          base64: buffer.toString("base64"),
          fileName,
          mimeType,
        }),
      });
      const data = JSON.parse(await gasRes.text());
      if (data.success && data.fileId) primaryFileId = data.fileId;
    } catch (gasErr) {
      console.warn("[Direct Drive Save] Primary Apps Script fallback notice:", gasErr);
    }
  }

  // 2. Save directly to Secondary Google Drive (dildaraliswati720)
  let secondaryFileId: string | undefined;
  try {
    const mirrorRes = await mirrorFileToSecondaryDrive(
      primaryFileId || "record",
      fileName,
      buffer,
      mimeType
    );
    if (mirrorRes.success) {
      secondaryFileId = mirrorRes.secondaryFileId;
      console.log(`[Direct Drive Save] Saved clean record to Secondary Drive: ${fileName} (${secondaryFileId})`);
    }
  } catch (mirrorErr) {
    console.warn("[Direct Drive Save] Secondary Drive save warning:", mirrorErr);
  }

  return {
    success: Boolean(primaryFileId || secondaryFileId),
    fileName,
    primaryFileId,
    secondaryFileId,
  };
}

