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

  // 3. Persist default config
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_PORTAL_CONFIG, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(DEFAULT_PORTAL_CONFIG, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }

  globalThis.__portal_config_memory__ = DEFAULT_PORTAL_CONFIG;
  return DEFAULT_PORTAL_CONFIG;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSerial = searchParams.get("serial") || undefined;
    const rawUnified = searchParams.get("unified") || undefined;
    const rawReq = searchParams.get("req") || searchParams.get("requestNumber") || undefined;

    const serial = rawSerial ? decodeURIComponent(rawSerial).trim() : undefined;
    const unified = rawUnified ? decodeURIComponent(rawUnified).trim() : undefined;
    const requestNumber = rawReq ? decodeURIComponent(rawReq).trim() : undefined;

    const responseHeaders = {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    // 1. If serial or requestNumber is requested, search for specific saved record in Firebase first
    if (serial || requestNumber) {
      try {
        const specific = await getPortalRecordBySerialUnified(serial, unified, requestNumber);
        if (specific) {
          return NextResponse.json(specific, { headers: responseHeaders });
        }
      } catch (err) {
        console.warn("Could not retrieve specific record from Firebase:", err);
      }

      // Check local saved-records.json as secondary fallback
      try {
        const recordsFile = path.join(DATA_DIR, "saved-records.json");
        if (fs.existsSync(recordsFile)) {
          const list = JSON.parse(fs.readFileSync(recordsFile, "utf-8"));
          if (Array.isArray(list)) {
            const targetId = unified ? `${serial}_${unified}` : serial;
            const found = list.find(
              (r) =>
                (requestNumber && serial && r.requestNumber === requestNumber && r.serialNumber === serial) ||
                r.id === targetId ||
                (r.serialNumber === serial && (!unified || r.unifiedNumber === unified))
            );
            if (found) {
              return NextResponse.json(found, { headers: responseHeaders });
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Fetch active 'current' config from Firebase Firestore
    try {
      const fbConfig = await getConfigFromFirebase(serial, unified, requestNumber);
      if (fbConfig) {
        globalThis.__portal_config_memory__ = fbConfig;
        return NextResponse.json(fbConfig, { headers: responseHeaders });
      }
    } catch (err) {
      console.warn("Could not retrieve current config from Firebase:", err);
    }

    // 3. Fall back to local disk / memory cache
    const config = ensureConfigFile();
    return NextResponse.json(config, { headers: responseHeaders });
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

    // Update memory cache
    globalThis.__portal_config_memory__ = updated;

    // 1. Persist to Firebase Cloud Firestore
    try {
      await saveConfigToFirebase(updated);
      await savePortalRecordToFirebase(updated, currentRecordId || recordId);
    } catch (fbErr: any) {
      console.warn("Notice while saving to Firebase Firestore in API route:", fbErr);
    }

    // 2. Archive into local saved-records.json
    try {
      if (cleanSerial) {
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

    // 3. Save to project data/ directory
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

    // 4. If project root was read-only, save to writable /tmp
    if (!saved) {
      try {
        fs.writeFileSync(TMP_CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
      } catch {
        // Kept in globalThis memory cache
      }
    }

    return NextResponse.json({
      success: true,
      data: updated,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("POST /api/config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
