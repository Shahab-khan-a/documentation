import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig, PortalRecord } from "@/lib/portal-types";
import {
  saveConfigToFirebase,
  getConfigFromFirebase,
  savePortalRecordToFirebase,
  getAllPortalRecordsFromFirebase,
  getPortalRecordBySerialUnified,
} from "@/lib/firebase";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "portal-config.json");
const TMP_CONFIG_FILE = path.join(os.tmpdir(), "portal-config.json");

// In-memory cache fallback for serverless read-only environments
declare global {
  var __portal_config_memory__: PortalConfig | undefined;
}

function mergeWithDefaults(parsed: Partial<PortalConfig>): PortalConfig {
  return {
    ...DEFAULT_PORTAL_CONFIG,
    ...parsed,
    customFields: Array.isArray(parsed.customFields) ? parsed.customFields : [],
    backButton: { ...DEFAULT_PORTAL_CONFIG.backButton, ...(parsed.backButton || {}) },
    verifyAgainButton: { ...DEFAULT_PORTAL_CONFIG.verifyAgainButton, ...(parsed.verifyAgainButton || {}) },
    downloadButton: { ...DEFAULT_PORTAL_CONFIG.downloadButton, ...(parsed.downloadButton || {}) },
    socialLinks: { ...DEFAULT_PORTAL_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
  };
}

function ensureConfigFile(): PortalConfig {
  if (globalThis.__portal_config_memory__) {
    return globalThis.__portal_config_memory__;
  }

  // 1. Try reading from project data/ directory
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      const config = mergeWithDefaults(JSON.parse(raw));
      globalThis.__portal_config_memory__ = config;
      return config;
    }
  } catch {
    // Ignore and try tmp
  }

  // 2. Try reading from /tmp
  try {
    if (fs.existsSync(TMP_CONFIG_FILE)) {
      const raw = fs.readFileSync(TMP_CONFIG_FILE, "utf-8");
      const config = mergeWithDefaults(JSON.parse(raw));
      globalThis.__portal_config_memory__ = config;
      return config;
    }
  } catch {
    // Ignore
  }

  // 3. Try to persist default config to data/ or /tmp
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_PORTAL_CONFIG, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(DEFAULT_PORTAL_CONFIG, null, 2), "utf-8");
    } catch {
      // Both disk writes failed (read-only environment), in-memory cache will be used
    }
  }

  globalThis.__portal_config_memory__ = DEFAULT_PORTAL_CONFIG;
  return DEFAULT_PORTAL_CONFIG;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serial = searchParams.get("serial") || undefined;
    const unified = searchParams.get("unified") || undefined;

    // 1. If serial is requested, search for specific saved record first
    if (serial) {
      try {
        const specific = await getPortalRecordBySerialUnified(serial, unified);
        if (specific) {
          return NextResponse.json(specific, {
            headers: {
              "Cache-Control": "no-store, max-age=0",
            },
          });
        }
      } catch {
        // ignore
      }

      // Check local saved-records.json for matching serial & unified
      try {
        const recordsFile = path.join(DATA_DIR, "saved-records.json");
        if (fs.existsSync(recordsFile)) {
          const list = JSON.parse(fs.readFileSync(recordsFile, "utf-8"));
          if (Array.isArray(list)) {
            const cleanSerial = serial.trim();
            const cleanUnified = unified ? unified.trim() : "";
            const targetId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;
            const found = list.find(
              (r) => r.id === targetId || (r.serialNumber === cleanSerial && (!cleanUnified || r.unifiedNumber === cleanUnified))
            );
            if (found) {
              return NextResponse.json(found, {
                headers: {
                  "Cache-Control": "no-store, max-age=0",
                },
              });
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Try to fetch active 'current' config from Firebase Firestore
    try {
      const fbConfig = await getConfigFromFirebase(serial, unified);
      if (fbConfig) {
        globalThis.__portal_config_memory__ = fbConfig;
        return NextResponse.json(fbConfig, {
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    } catch {
      // ignore
    }

    // 3. Fall back to local disk / memory cache
    const config = ensureConfigFile();
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("GET /api/config error:", error);
    return NextResponse.json(DEFAULT_PORTAL_CONFIG, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = ensureConfigFile();
    const updated: PortalConfig = {
      ...current,
      ...body,
      customFields: Array.isArray(body.customFields) ? body.customFields : (current.customFields || []),
      backButton: { ...current.backButton, ...(body.backButton || {}) },
      verifyAgainButton: { ...current.verifyAgainButton, ...(body.verifyAgainButton || {}) },
      downloadButton: { ...current.downloadButton, ...(body.downloadButton || {}) },
      socialLinks: { ...current.socialLinks, ...(body.socialLinks || {}) },
    };

    const cleanSerial = (updated.serialNumber || "").trim();
    const cleanUnified = (updated.unifiedNumber || "").trim();
    const currentRecordId = (body as { currentRecordId?: string }).currentRecordId;
    const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;

    // Strict validation: Unified Number must be unique across Firebase & local records
    if (cleanUnified) {
      let duplicateLocal: PortalRecord | undefined;
      try {
        const rf = path.join(DATA_DIR, "saved-records.json");
        if (fs.existsSync(rf)) {
          const list: PortalRecord[] = JSON.parse(fs.readFileSync(rf, "utf-8"));
          if (Array.isArray(list)) {
            duplicateLocal = list.find(
              (r) =>
                (r.unifiedNumber || "").trim() === cleanUnified &&
                r.id !== recordId &&
                (!currentRecordId || r.id !== currentRecordId)
            );
          }
        }
      } catch {
        // ignore
      }

      let duplicateFb: PortalRecord | undefined;
      try {
        const fbRecords = await getAllPortalRecordsFromFirebase();
        duplicateFb = fbRecords.find(
          (r: PortalRecord) =>
            (r.unifiedNumber || "").trim() === cleanUnified &&
            r.id !== recordId &&
            (!currentRecordId || r.id !== currentRecordId)
        );
      } catch {
        // ignore
      }

      const dup = duplicateFb || duplicateLocal;
      if (dup) {
        return NextResponse.json(
          {
            success: false,
            code: "DUPLICATE_UNIFIED_NUMBER",
            error: `الرقم الموحد (${cleanUnified}) مسجل مسبقاً في Firebase تحت السجل #${dup.serialNumber}! لا يمكن تكرار الرقم الموحد.`,
            existingSerial: dup.serialNumber,
            duplicateUnified: cleanUnified,
          },
          { status: 409 }
        );
      }
    }

    // Update memory cache first
    globalThis.__portal_config_memory__ = updated;

    // 1. Persist to Firebase Cloud Firestore (current & portal_records)
    try {
      await saveConfigToFirebase(updated);
      await savePortalRecordToFirebase(updated, currentRecordId || recordId);
    } catch (fbErr: any) {
      if (fbErr?.message?.includes("DUPLICATE_UNIFIED_NUMBER")) {
        return NextResponse.json(
          {
            success: false,
            code: "DUPLICATE_UNIFIED_NUMBER",
            error: fbErr.message,
          },
          { status: 409 }
        );
      }
      console.warn("Could not save to Firebase Firestore in API route:", fbErr);
    }

    // 1b. Archive into saved-records.json
    try {
      const cleanSerial = (updated.serialNumber || "").trim();
      const cleanUnified = (updated.unifiedNumber || "").trim();
      if (cleanSerial) {
        const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;
        const now = new Date().toISOString();
        const rec: PortalRecord = {
          ...updated,
          id: recordId,
          serialNumber: cleanSerial,
          unifiedNumber: cleanUnified,
          createdAt: now,
          updatedAt: now,
        };
        const recordsFile = path.join(DATA_DIR, "saved-records.json");
        let list: PortalRecord[] = [];
        if (fs.existsSync(recordsFile)) {
          try {
            list = JSON.parse(fs.readFileSync(recordsFile, "utf-8"));
          } catch {
            list = [];
          }
        }
        const idx = list.findIndex((r) => r.id === recordId);
        if (idx >= 0) {
          list[idx] = { ...rec, createdAt: list[idx].createdAt || now };
        } else {
          list.unshift(rec);
        }
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(recordsFile, JSON.stringify(list, null, 2), "utf-8");
      }
    } catch {
      // ignore
    }

    // 2. Try saving to project data/ directory
    let saved = false;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
      saved = true;
    } catch {
      // Project root is read-only (e.g. Vercel)
    }

    // 3. If project root was read-only, save to writable /tmp
    if (!saved) {
      try {
        fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
      } catch {
        // Kept in globalThis memory cache
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST /api/config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
