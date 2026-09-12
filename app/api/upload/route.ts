import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { Readable } from "stream";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const KEY_FILE_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbyi5j_acFTJXANgElR84azJ1qb5aHvGvtdnMEWwPOGRQEGgsZ-S6tBAr1b5siR-8LJS/exec";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const replaceFileId = (formData.get("replaceFileId") as string | null)?.trim() || null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const originalName = file.name || "document.pdf";
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._\-\u0600-\u06FF]/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optional local backup cache (safe for serverless/read-only environments like Vercel /var/task)
    const localFileUrl = `/uploads/${uniqueFileName}`;
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOADS_DIR, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn("Local uploads dir is read-only or unavailable (serverless environment):", fsErr);
    }

    // ─── 1. GOOGLE APPS SCRIPT DIRECT DRIVE UPLOAD (Primary for Personal Drive Folders) ───
    if (APPS_SCRIPT_URL) {
      try {
        const gasRes = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            base64: buffer.toString("base64"),
            fileName: originalName,
            mimeType: file.type || "application/pdf",
          }),
        });

        const gasText = await gasRes.text();
        let gasData: {
          success?: boolean;
          fileId?: string;
          webViewLink?: string;
          error?: string;
        } | null = null;
        try {
          gasData = JSON.parse(gasText);
        } catch {
          // not json
        }

        if (gasData && gasData.success && gasData.fileId) {
          const driveDownloadUrl = `/api/drive/download?fileId=${gasData.fileId}&name=${encodeURIComponent(originalName)}`;
          return NextResponse.json({
            success: true,
            source: "google_drive",
            fileUrl: driveDownloadUrl,
            driveFileId: gasData.fileId,
            driveViewLink: gasData.webViewLink || `https://drive.google.com/file/d/${gasData.fileId}/view`,
            fileName: originalName,
            fileSize: file.size,
          });
        }
      } catch (gasErr) {
        console.warn("Apps Script upload fallback notice:", gasErr);
      }
    }

    // ─── 2. GOOGLE DRIVE SERVICE ACCOUNT UPLOAD / UPDATE (Fallback) ───
    if (fs.existsSync(KEY_FILE_PATH) || process.env.GOOGLE_CREDENTIALS) {
      try {
        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);

        let driveResId: string | null = null;
        let driveViewLink: string | null = null;

        // If updating an existing file in-place
        if (replaceFileId) {
          try {
            const updateRes = await drive.files.update({
              fileId: replaceFileId,
              supportsAllDrives: true,
              requestBody: {
                name: originalName,
              },
              media: {
                mimeType: file.type || "application/pdf",
                body: bufferStream,
              },
              fields: "id, name, mimeType, webViewLink, webContentLink, size",
            });
            driveResId = updateRes.data.id || replaceFileId;
            driveViewLink = updateRes.data.webViewLink || null;
          } catch {
            // fallback to create
          }
        }

        // If not updating or in-place update failed, create file in Drive
        if (!driveResId) {
          const freshBufferStream = new Readable();
          freshBufferStream.push(buffer);
          freshBufferStream.push(null);

          const driveRes = await drive.files.create({
            supportsAllDrives: true,
            requestBody: {
              name: originalName,
              parents: [FOLDER_ID],
            },
            media: {
              mimeType: file.type || "application/pdf",
              body: freshBufferStream,
            },
            fields: "id, name, mimeType, webViewLink, webContentLink, size",
          });
          driveResId = driveRes.data.id || null;
          driveViewLink = driveRes.data.webViewLink || null;
        }

        if (driveResId) {
          try {
            await drive.permissions.create({
              fileId: driveResId,
              supportsAllDrives: true,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
          } catch {
            // ignore
          }

          const driveDownloadUrl = `/api/drive/download?fileId=${driveResId}&name=${encodeURIComponent(originalName)}`;

          return NextResponse.json({
            success: true,
            source: "google_drive",
            fileUrl: driveDownloadUrl,
            driveFileId: driveResId,
            driveViewLink:
              driveViewLink ||
              `https://drive.google.com/file/d/${driveResId}/view`,
            fileName: originalName,
            fileSize: file.size,
          });
        }
      } catch (driveErr) {
        console.warn("Google Drive service account upload note:", driveErr);
      }
    }

    // ─── 3. LOCAL BACKUP ───
    return NextResponse.json({
      success: true,
      source: "local",
      fileUrl: localFileUrl,
      driveViewLink: `https://drive.google.com/drive/folders/${FOLDER_ID}`,
      fileName: originalName,
      fileSize: file.size,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
