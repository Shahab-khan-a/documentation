import { google, drive_v3 } from "googleapis";
import path from "path";
import fs from "fs";

export const GOOGLE_DRIVE_FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || "1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

export const GOOGLE_DRIVE_FOLDER_ID_SECONDARY =
  process.env.GOOGLE_DRIVE_FOLDER_ID_SECONDARY || "1CGdhBWgVVLRRFVbkXLfy1bKBzB4N0h6D";

export const GOOGLE_APPS_SCRIPT_URL_SECONDARY =
  process.env.GOOGLE_APPS_SCRIPT_URL_SECONDARY ||
  "https://script.google.com/macros/s/AKfycbzE7O5ZOINjfo08D-ZWYPNv3Wlk0xXmecUkIsXdAaYFpRBCTCujJ9VFJTIJmBBHssve/exec";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

interface GoogleServiceAccountCredentials {
  client_email?: string;
  private_key?: string;
  project_id?: string;
  [key: string]: unknown;
}

/**
 * Parses credentials from a string, handling raw JSON or Base64-encoded JSON.
 */
function parseCredentialsString(raw: string): GoogleServiceAccountCredentials | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Try parsing directly as JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && (parsed.client_email || parsed.private_key)) {
      return parsed;
    }
  } catch {
    // Continue to base64 check
  }

  // 2. Try decoding as Base64 then parsing as JSON
  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (parsed && (parsed.client_email || parsed.private_key)) {
      return parsed;
    }
  } catch {
    // Not valid base64 JSON
  }

  return null;
}

/**
 * Returns an authenticated Google Drive client instance with multi-tier credentials resolution:
 * 1. process.env.GOOGLE_CREDENTIALS (Raw JSON or Base64 encoded JSON)
 * 2. process.env.GOOGLE_SERVICE_ACCOUNT_KEY (Base64 or JSON)
 * 3. Individual env vars: GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY
 * 4. Local file: credentials.json (for local development)
 */
export function getGoogleDriveClient(): {
  drive: drive_v3.Drive | null;
  auth: InstanceType<typeof google.auth.GoogleAuth> | null;
  folderId: string;
  isConfigured: boolean;
  source: string;
  error?: string;
} {
  const folderId = GOOGLE_DRIVE_FOLDER_ID;

  // Tier 1: GOOGLE_CREDENTIALS environment variable
  if (process.env.GOOGLE_CREDENTIALS) {
    const creds = parseCredentialsString(process.env.GOOGLE_CREDENTIALS);
    if (creds && creds.client_email && creds.private_key) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: creds.client_email,
          private_key: creds.private_key.replace(/\\n/g, "\n"),
          project_id: creds.project_id,
        },
        scopes: SCOPES,
      });
      return {
        drive: google.drive({ version: "v3", auth }),
        auth,
        folderId,
        isConfigured: true,
        source: "env_GOOGLE_CREDENTIALS",
      };
    }
  }

  // Tier 2: GOOGLE_SERVICE_ACCOUNT_KEY environment variable
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const creds = parseCredentialsString(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    if (creds && creds.client_email && creds.private_key) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: creds.client_email,
          private_key: creds.private_key.replace(/\\n/g, "\n"),
          project_id: creds.project_id,
        },
        scopes: SCOPES,
      });
      return {
        drive: google.drive({ version: "v3", auth }),
        auth,
        folderId,
        isConfigured: true,
        source: "env_GOOGLE_SERVICE_ACCOUNT_KEY",
      };
    }
  }

  // Tier 3: Separate environment variables
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
      scopes: SCOPES,
    });
    return {
      drive: google.drive({ version: "v3", auth }),
      auth,
      folderId,
      isConfigured: true,
      source: "env_separate_keys",
    };
  }

  // Tier 4: Local credentials.json file
  const localKeyPath = path.join(process.cwd(), "credentials.json");
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileContent = fs.readFileSync(localKeyPath, "utf-8");
      const creds = parseCredentialsString(fileContent);
      if (creds && creds.client_email && creds.private_key) {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: creds.client_email,
            private_key: creds.private_key.replace(/\\n/g, "\n"),
            project_id: creds.project_id,
          },
          scopes: SCOPES,
        });
        return {
          drive: google.drive({ version: "v3", auth }),
          auth,
          folderId,
          isConfigured: true,
          source: "local_credentials_json",
        };
      }
    } catch (e) {
      console.warn("Failed reading local credentials.json:", e);
    }
  }

  return {
    drive: null,
    auth: null,
    folderId,
    isConfigured: false,
    source: "none",
    error: "Google Drive service account credentials are not configured.",
  };
}

/**
 * Returns a direct public Google Drive download URL.
 */
export function getPublicDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
}

/**
 * Returns a direct Google Drive view link.
 */
export function getDirectDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Dual Storage Engine:
 * Uploads a real, independent copy of the file to the secondary Google Drive (Dildar Ali Swati account)
 * via its dedicated Google Apps Script Web App.
 * If buffer is unavailable or Apps Script upload fails, seamlessly falls back to creating a Drive shortcut.
 * Both accounts now hold independent files with separate quotas!
 */
export async function mirrorFileToSecondaryDrive(
  fileId: string,
  fileName: string,
  buffer?: Buffer,
  mimeType?: string
): Promise<{ success: boolean; secondaryFileId?: string; type: "real_file" | "shortcut" | "none" }> {
  const secondaryAppsScriptUrl =
    process.env.GOOGLE_APPS_SCRIPT_URL_SECONDARY || GOOGLE_APPS_SCRIPT_URL_SECONDARY;

  // 1. Try uploading real independent duplicate file via Secondary Google Apps Script
  if (buffer && secondaryAppsScriptUrl) {
    try {
      const res = await fetch(secondaryAppsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          base64: buffer.toString("base64"),
          fileName,
          mimeType: mimeType || "application/pdf",
        }),
      });
      const text = await res.text();
      let data: { success?: boolean; fileId?: string; error?: string } | null = null;
      try {
        data = JSON.parse(text);
      } catch {}

      if (data && data.success && data.fileId) {
        console.log(
          `[Secondary Drive] Real independent duplicate saved in Account 2: "${fileName}" (ID: ${data.fileId})`
        );
        return { success: true, secondaryFileId: data.fileId, type: "real_file" };
      }
    } catch (gasErr) {
      console.warn("[Secondary Drive] Apps Script real file upload error:", gasErr);
    }
  }

  // 2. Fallback: Create Google Drive shortcut
  const secondaryFolderId =
    process.env.GOOGLE_DRIVE_FOLDER_ID_SECONDARY || GOOGLE_DRIVE_FOLDER_ID_SECONDARY;

  if (!secondaryFolderId || !fileId) return { success: false, type: "none" };

  try {
    const { drive, isConfigured } = getGoogleDriveClient();
    if (!drive || !isConfigured) return { success: false, type: "none" };

    const shortcutRes = await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: fileName,
        mimeType: "application/vnd.google-apps.shortcut",
        parents: [secondaryFolderId],
        shortcutDetails: {
          targetId: fileId,
        },
      },
      fields: "id, name",
    });
    console.log(`[Secondary Drive] File "${fileName}" shortcut mirrored to folder ${secondaryFolderId}`);
    return { success: true, secondaryFileId: shortcutRes.data.id || undefined, type: "shortcut" };
  } catch (err) {
    console.warn("[Secondary Drive] Shortcut mirror warning:", err);
    return { success: false, type: "none" };
  }
}
