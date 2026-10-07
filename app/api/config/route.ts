import { NextResponse } from "next/server";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
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
    const rawSerial = searchParams.get("serial") || undefined;
    const rawUnified = searchParams.get("unified") || undefined;
    const rawReq = searchParams.get("req") || searchParams.get("requestNumber") || undefined;

    const recordId = rawId ? sanitizeDocNumber(rawId) || undefined : undefined;
    const serial = rawSerial ? sanitizeDocNumber(rawSerial) || undefined : undefined;
    const unified = rawUnified ? sanitizeDocNumber(rawUnified) || undefined : undefined;
    const requestNumber = rawReq ? sanitizeDocNumber(rawReq) || undefined : undefined;

    const responseHeaders = {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    // Load active global config first to provide up-to-date organization & social media defaults
    let globalConfig = globalThis.__portal_config_memory__;
    if (!globalConfig) {
      try {
        const fbConfig = await getConfigFromFirebase();
        if (fbConfig) {
          globalConfig = mergeWithDefaults(fbConfig);
          globalThis.__portal_config_memory__ = globalConfig;
        }
      } catch (err) {
        console.warn("Could not retrieve current global config from Firebase:", err);
      }
    }
    if (!globalConfig) {
      globalConfig = DEFAULT_PORTAL_CONFIG;
    } else {
      globalConfig = {
        ...globalConfig,
        serialNumber: sanitizeDocNumber(globalConfig.serialNumber) || DEFAULT_PORTAL_CONFIG.serialNumber,
        unifiedNumber: sanitizeDocNumber(globalConfig.unifiedNumber) || DEFAULT_PORTAL_CONFIG.unifiedNumber,
        requestNumber: sanitizeDocNumber(globalConfig.requestNumber) || DEFAULT_PORTAL_CONFIG.requestNumber,
      };
      globalThis.__portal_config_memory__ = globalConfig;
    }

    // 0. If recordId is provided, query specific document directly by ID
    if (recordId) {
      try {
        const specific = await getPortalRecordById(recordId);
        if (specific) {
          const mergedSpecific = mergeWithGlobal(specific, globalConfig);
          return NextResponse.json(mergedSpecific, { headers: responseHeaders });
        }
      } catch (err) {
        console.warn("Could not retrieve specific record by id from Firebase:", err);
      }
    }

    // 1. If serial or requestNumber is requested, query specific record in Firebase Firestore
    if (serial || requestNumber) {
      try {
        const specific = await getPortalRecordBySerialUnified(serial, unified, requestNumber, recordId);
        if (specific) {
          const mergedSpecific = mergeWithGlobal(specific, globalConfig);
          return NextResponse.json(mergedSpecific, { headers: responseHeaders });
        }
      } catch (err) {
        console.warn("Could not retrieve specific record from Firebase:", err);
      }
    }

    // 2. Fetch active 'current' config directly from Firebase Firestore
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
    updated.documentNumber = cleanDoc || updated.documentNumber || "205-178";
    const currentRecordId = (body as { currentRecordId?: string }).currentRecordId;
    const isRecCard = Boolean(body.id && typeof body.id === "string" && body.id.startsWith("rec_"));
    const recordId = isRecCard ? body.id : cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;

    if (isRecCard) {
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
