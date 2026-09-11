import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { DEFAULT_PORTAL_CONFIG } from "@/lib/default-config";
import { PortalConfig } from "@/lib/portal-types";
import { saveConfigToFirebase, getConfigFromFirebase } from "@/lib/firebase";

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

    // 1. Try to fetch latest config from Firebase Firestore
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

    // 2. Fall back to local disk / memory cache
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

    // Update memory cache first
    globalThis.__portal_config_memory__ = updated;

    // 1. Persist to Firebase Cloud Firestore
    try {
      await saveConfigToFirebase(updated);
    } catch (fbErr) {
      console.warn("Could not save to Firebase Firestore in API route:", fbErr);
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
