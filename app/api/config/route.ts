import { NextResponse } from "next/server";
import { DEFAULT_PORTAL_CONFIG, getCurrentPortalDate } from "@/lib/default-config";
import { PortalConfig } from "@/lib/portal-types";
import { sanitizeDocNumber } from "@/constants/defaults";
import {
  saveConfigToFirebase,
  getConfigFromFirebase,
  savePortalRecordToFirebase,
  getPortalRecordBySerialUnified,
  getPortalRecordById,
} from "@/lib/firebase";
import { backupRecordsToGoogleDrive } from "@/lib/firebase-drive-backup";

// In-memory cache fallback for fast response
declare global {
  var __portal_config_memory__: PortalConfig | undefined;
  var __portal_records_cache__: Map<string, { data: PortalConfig; time: number }> | undefined;
}

if (!globalThis.__portal_records_cache__) {
  globalThis.__portal_records_cache__ = new Map();
}

function getCachedRecord(key: string): PortalConfig | null {
  const item = globalThis.__portal_records_cache__?.get(key);
  if (item && Date.now() - item.time < 60000) {
    return item.data;
  }
  return null;
}

function setCachedRecord(key: string, data: PortalConfig) {
  globalThis.__portal_records_cache__?.set(key, { data, time: Date.now() });
}

function resolveDailyCreationDate(rawDate?: string, updatedAt?: string): string {
  const clean = (rawDate || "").trim();
  const today = getCurrentPortalDate();
  if (!clean || clean === "09/06/2026-") return today;
  if (updatedAt) {
    const parsedDate = new Date(updatedAt);
    if (!isNaN(parsedDate.getTime()) && getCurrentPortalDate(parsedDate) === today) {
      return clean;
    }
  }
  return today;
}

function resolveDefaultCreationTime(rawTime?: string): string {
  const clean = (rawTime || "").trim();
  if (!clean || clean === "6:12م") return "8:12م";
  return clean;
}

function cleanPortalTitle(title?: string): string {
  if (!title) return DEFAULT_PORTAL_CONFIG.portalTitle;
  const trimmed = title.trim();
  if (
    /^[A-Za-z0-9\s._\-:/]+$/.test(trimmed) ||
    trimmed.toLowerCase().includes("eservices") ||
    trimmed.toLowerCase().includes("ynbcci")
  ) {
    return DEFAULT_PORTAL_CONFIG.portalTitle;
  }
  return trimmed;
}

function mergeWithDefaults(parsed: Partial<PortalConfig>): PortalConfig {
  const cleanSerial = sanitizeDocNumber(parsed.serialNumber);
  const cleanUnified = sanitizeDocNumber(parsed.unifiedNumber);
  const cleanReq = sanitizeDocNumber(parsed.requestNumber);
  const cleanDoc = sanitizeDocNumber(parsed.documentNumber);

  return {
    ...DEFAULT_PORTAL_CONFIG,
    ...parsed,
    serialNumber: cleanSerial || DEFAULT_PORTAL_CONFIG.serialNumber,
    documentNumber: cleanDoc || parsed.documentNumber || DEFAULT_PORTAL_CONFIG.documentNumber || "205-178",
    unifiedNumber: cleanUnified || DEFAULT_PORTAL_CONFIG.unifiedNumber,
    requestNumber: cleanReq || DEFAULT_PORTAL_CONFIG.requestNumber,
    requestType:
      !(parsed.requestType || "").trim() || (parsed.requestType || "").trim() === "طلب مفتوح ملف"
        ? DEFAULT_PORTAL_CONFIG.requestType
        : parsed.requestType!.trim(),
    creationDate: resolveDailyCreationDate(parsed.creationDate, (parsed as { updatedAt?: string }).updatedAt),
    creationTime: resolveDefaultCreationTime(parsed.creationTime),
    portalTitle: cleanPortalTitle(parsed.portalTitle),
    customFields: Array.isArray(parsed.customFields) ? parsed.customFields : [],
    backButton: { ...DEFAULT_PORTAL_CONFIG.backButton, ...(parsed.backButton || {}) },
    verifyAgainButton: { ...DEFAULT_PORTAL_CONFIG.verifyAgainButton, ...(parsed.verifyAgainButton || {}) },
    downloadButton: { ...DEFAULT_PORTAL_CONFIG.downloadButton, ...(parsed.downloadButton || {}) },
    socialLinks: { ...DEFAULT_PORTAL_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
  };
}

function mergeWithGlobal(parsed: Partial<PortalConfig>, globalConfig: PortalConfig): PortalConfig {
  const allPlatforms = ["skype", "instagram", "youtube", "twitter", "facebook"] as const;
  const mergedSocial: Record<string, string> = {};

  for (const p of allPlatforms) {
    const recordVal = parsed.socialLinks?.[p]?.trim();
    const globalVal = globalConfig.socialLinks?.[p]?.trim();
    if (recordVal && recordVal !== `#${p}` && recordVal !== "#") {
      mergedSocial[p] = recordVal;
    } else if (globalVal && globalVal !== `#${p}` && globalVal !== "#") {
      mergedSocial[p] = globalVal;
    } else {
      mergedSocial[p] = recordVal || globalVal || `#${p}`;
    }
  }

  return {
    ...DEFAULT_PORTAL_CONFIG,
    ...globalConfig,
    ...parsed,
    serialNumber: sanitizeDocNumber(parsed.serialNumber) || sanitizeDocNumber(globalConfig.serialNumber) || DEFAULT_PORTAL_CONFIG.serialNumber,
    documentNumber: sanitizeDocNumber(parsed.documentNumber) || sanitizeDocNumber(globalConfig.documentNumber) || DEFAULT_PORTAL_CONFIG.documentNumber || "205-178",
    unifiedNumber: sanitizeDocNumber(parsed.unifiedNumber) || sanitizeDocNumber(globalConfig.unifiedNumber) || DEFAULT_PORTAL_CONFIG.unifiedNumber,
    requestNumber: sanitizeDocNumber(parsed.requestNumber) || sanitizeDocNumber(globalConfig.requestNumber) || DEFAULT_PORTAL_CONFIG.requestNumber,
    requestType: (parsed.requestType || "").trim() || (globalConfig.requestType || "").trim() || DEFAULT_PORTAL_CONFIG.requestType,
    creationDate: (parsed.creationDate || "").trim() || (globalConfig.creationDate || "").trim() || getCurrentPortalDate(),
    creationTime: (parsed.creationTime || "").trim() || (globalConfig.creationTime || "").trim() || "8:12م",
    portalTitle: cleanPortalTitle(parsed.portalTitle || globalConfig.portalTitle),
    customFields: Array.isArray(parsed.customFields) ? parsed.customFields : [],
    backButton: { ...DEFAULT_PORTAL_CONFIG.backButton, ...(globalConfig.backButton || {}), ...(parsed.backButton || {}) },
    verifyAgainButton: { ...DEFAULT_PORTAL_CONFIG.verifyAgainButton, ...(globalConfig.verifyAgainButton || {}), ...(parsed.verifyAgainButton || {}) },
    downloadButton: { ...DEFAULT_PORTAL_CONFIG.downloadButton, ...(globalConfig.downloadButton || {}), ...(parsed.downloadButton || {}) },
    supportPhone: parsed.supportPhone || globalConfig.supportPhone || DEFAULT_PORTAL_CONFIG.supportPhone,
    companyNameAr: parsed.companyNameAr || globalConfig.companyNameAr || DEFAULT_PORTAL_CONFIG.companyNameAr,
    companyNameEn: parsed.companyNameEn || globalConfig.companyNameEn || DEFAULT_PORTAL_CONFIG.companyNameEn,
    devLabel: parsed.devLabel || globalConfig.devLabel || DEFAULT_PORTAL_CONFIG.devLabel,
    copyrightText: parsed.copyrightText || globalConfig.copyrightText || DEFAULT_PORTAL_CONFIG.copyrightText,
    socialLinks: {
      ...DEFAULT_PORTAL_CONFIG.socialLinks,
      ...(globalConfig.socialLinks || {}),
      ...mergedSocial,
    },
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("id") || undefined;
    const rawSerial =
      searchParams.get("serial") ||
      searchParams.get("subscriptionNumber") ||
      searchParams.get("SubscriptionNumber") ||
      searchParams.get("sub") ||
      undefined;
    const rawUnified = searchParams.get("unified") || undefined;
    const rawReq =
      searchParams.get("req") ||
      searchParams.get("requestNumber") ||
      searchParams.get("documentNumber") ||
      searchParams.get("DocumentNumber") ||
      searchParams.get("doc") ||
      searchParams.get("orderNumber") ||
      undefined;

    const recordId = rawId ? sanitizeDocNumber(rawId) || undefined : undefined;
    const serial = rawSerial ? sanitizeDocNumber(rawSerial) || undefined : undefined;
    const unified = rawUnified ? sanitizeDocNumber(rawUnified) || undefined : undefined;
    const requestNumber = rawReq ? sanitizeDocNumber(rawReq) || undefined : undefined;

    const responseHeaders = {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    const cacheKey = `${recordId || ""}_${serial || ""}_${unified || ""}_${requestNumber || ""}`;
    const cachedRecord = getCachedRecord(cacheKey);
    if (cachedRecord) {
      return NextResponse.json(cachedRecord, { headers: responseHeaders });
    }

    // Fetch specific record and global config concurrently in parallel for sub-second response
    const globalConfigPromise = (async () => {
      let gc = globalThis.__portal_config_memory__;
      if (!gc) {
        try {
          const fbConfig = await getConfigFromFirebase();
          if (fbConfig) {
            gc = mergeWithDefaults(fbConfig);
            globalThis.__portal_config_memory__ = gc;
          }
        } catch (err) {
          console.warn("Could not retrieve current global config from Firebase:", err);
        }
      }
      return gc;
    })();

    const specificRecordPromise = (async (): Promise<PortalConfig | null> => {
      if (recordId) {
        try {
          return await getPortalRecordById(recordId);
        } catch (err) {
          console.warn("Could not retrieve specific record by id from Firebase:", err);
          return null;
        }
      }
      if (serial || requestNumber) {
        try {
          return await getPortalRecordBySerialUnified(serial, unified, requestNumber, recordId);
        } catch (err) {
          console.warn("Could not retrieve specific record from Firebase:", err);
          return null;
        }
      }
      return null;
    })();

    const [specific, rawGlobal] = await Promise.all([specificRecordPromise, globalConfigPromise]);

    let globalConfig: PortalConfig;
    if (!rawGlobal) {
      globalConfig = {
        ...DEFAULT_PORTAL_CONFIG,
        creationDate: getCurrentPortalDate(),
        creationTime: "8:12م",
      };
    } else {
      globalConfig = {
        ...rawGlobal,
        serialNumber: sanitizeDocNumber(rawGlobal.serialNumber) || DEFAULT_PORTAL_CONFIG.serialNumber,
        unifiedNumber: sanitizeDocNumber(rawGlobal.unifiedNumber) || DEFAULT_PORTAL_CONFIG.unifiedNumber,
        requestNumber: sanitizeDocNumber(rawGlobal.requestNumber) || DEFAULT_PORTAL_CONFIG.requestNumber,
        creationDate: resolveDailyCreationDate(rawGlobal.creationDate, (rawGlobal as { updatedAt?: string }).updatedAt),
        creationTime: resolveDefaultCreationTime(rawGlobal.creationTime),
      };
      globalThis.__portal_config_memory__ = globalConfig;
    }

    if (specific) {
      const mergedSpecific = mergeWithGlobal(specific, globalConfig);
      setCachedRecord(cacheKey, mergedSpecific);
      return NextResponse.json(mergedSpecific, { headers: responseHeaders });
    }

    // 2. Fetch active 'current' config directly from Firebase Firestore
    setCachedRecord(cacheKey, globalConfig);
    return NextResponse.json(globalConfig, { headers: responseHeaders });
  } catch (error) {
    console.error("GET /api/config error:", error);
    return NextResponse.json(DEFAULT_PORTAL_CONFIG, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = globalThis.__portal_config_memory__ || DEFAULT_PORTAL_CONFIG;
    const updated: PortalConfig = {
      ...current,
      ...body,
      portalTitle: cleanPortalTitle(body.portalTitle || current.portalTitle),
      customFields: Array.isArray(body.customFields) ? body.customFields : (current.customFields || []),
      backButton: { ...current.backButton, ...(body.backButton || {}) },
      verifyAgainButton: { ...current.verifyAgainButton, ...(body.verifyAgainButton || {}) },
      downloadButton: { ...current.downloadButton, ...(body.downloadButton || {}) },
      socialLinks: { ...current.socialLinks, ...(body.socialLinks || {}) },
      copyrightText: body.copyrightText !== undefined ? body.copyrightText : current.copyrightText,
    };

    const cleanSerial = sanitizeDocNumber(updated.serialNumber);
    const cleanUnified = sanitizeDocNumber(updated.unifiedNumber);
    const cleanReq = sanitizeDocNumber(updated.requestNumber);
    const cleanDoc = sanitizeDocNumber(updated.documentNumber);
    updated.serialNumber = cleanSerial;
    updated.unifiedNumber = cleanUnified;
    updated.requestNumber = cleanReq;
    updated.requestType = (updated.requestType || "").trim() || DEFAULT_PORTAL_CONFIG.requestType;
    updated.creationDate = (updated.creationDate || "").trim() || getCurrentPortalDate();
    updated.creationTime = (updated.creationTime || "").trim() || "8:12م";
    (updated as PortalConfig & { updatedAt?: string }).updatedAt =
      (body as { updatedAt?: string }).updatedAt || new Date().toISOString();
    updated.documentNumber = cleanDoc || updated.documentNumber || "205-178";
    const currentRecordId = (body as { currentRecordId?: string }).currentRecordId;
    const isRecCard = Boolean(body.id && typeof body.id === "string" && body.id.startsWith("rec_"));
    const recordId = isRecCard ? body.id : cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;

    if (isRecCard) {
      globalThis.__portal_records_cache__?.clear();
      // Cloned record: save directly to its own document in Firestore without clobbering active global config
      try {
        await savePortalRecordToFirebase({ ...updated, id: recordId } as any, currentRecordId || recordId);
      } catch (fbErr: any) {
        console.warn("Notice saving cloned record in /api/config:", fbErr);
      }
      return NextResponse.json(
        { success: true, data: { ...updated, id: recordId }, source: "firebase" },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
          },
        }
      );
    }

    // Update transient memory cache
    globalThis.__portal_config_memory__ = updated;
    globalThis.__portal_records_cache__?.clear();

    // Persist directly to Firebase Cloud Firestore
    try {
      await saveConfigToFirebase(updated);
      await savePortalRecordToFirebase(updated, currentRecordId || recordId);
    } catch (fbErr: any) {
      console.warn("Notice while saving to Firebase Firestore in API route:", fbErr);
    }

    // 🌟 Automatic background sync to Primary & Secondary Google Drive
    backupRecordsToGoogleDrive().catch((err) =>
      console.warn("[Auto-Backup] Background Drive backup warning:", err)
    );

    return NextResponse.json(
      { success: true, data: updated, source: "firebase" },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update portal config in Firebase" },
      { status: 500 }
    );
  }
}
