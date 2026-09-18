import { NextResponse } from "next/server";
import path from "path";
import { Readable } from "stream";
import {
  getGoogleDriveClient,
  getPublicDriveDownloadUrl,
  getDirectDriveViewUrl,
  mirrorFileToSecondaryDrive,
} from "@/lib/googleDrive";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";

    // ─── 1. GOOGLE DRIVE SERVICE ACCOUNT UPLOAD (PRIMARY & MOST RELIABLE) ───
    const { drive, folderId, isConfigured, error: credsError } = getGoogleDriveClient();

    if (isConfigured && drive) {
      try {
        let driveResId: string | null = null;
        let driveViewLink: string | null = null;

        // If replacing an existing file in Google Drive
        if (replaceFileId) {
          try {
            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);

            const updateRes = await drive.files.update({
              fileId: replaceFileId,
              supportsAllDrives: true,
              requestBody: {
                name: originalName,
              },
              media: {
                mimeType,
                body: bufferStream,
              },
              fields: "id, name, mimeType, webViewLink, webContentLink, size",
            });
            driveResId = updateRes.data.id || replaceFileId;
            driveViewLink = updateRes.data.webViewLink || null;
          } catch (updateErr) {
            console.warn("Failed updating existing file in Drive, creating fresh file:", updateErr);
          }
        }

        // If not replacing or replacement failed, create new file
        if (!driveResId) {
          const freshBufferStream = new Readable();
          freshBufferStream.push(buffer);
          freshBufferStream.push(null);

          const driveRes = await drive.files.create({
            supportsAllDrives: true,
            requestBody: {
              name: originalName,
              parents: folderId && folderId !== "YOUR_SHARED_FOLDER_ID_HERE" ? [folderId] : undefined,
            },
            media: {
              mimeType,
              body: freshBufferStream,
            },
            fields: "id, name, mimeType, webViewLink, webContentLink, size",
          });
          driveResId = driveRes.data.id || null;
          driveViewLink = driveRes.data.webViewLink || null;
        }

        if (driveResId) {
          // Set file to public reader so anyone with the link can view & download
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
            // Non-critical if permissions already inherited from parent folder
          }

          // 🌟 Auto-mirror to Secondary Google Drive (Dildar Ali Swati account)
          mirrorFileToSecondaryDrive(driveResId, originalName).catch(() => {});

          const driveDownloadUrl = `/api/drive/download?fileId=${driveResId}&name=${encodeURIComponent(originalName)}`;
          const directDownloadUrl = getPublicDriveDownloadUrl(driveResId);
          const finalViewLink = driveViewLink || getDirectDriveViewUrl(driveResId);

          return NextResponse.json({
            success: true,
            source: "google_drive",
            fileUrl: driveDownloadUrl,
            directDownloadUrl,
            driveFileId: driveResId,
            driveViewLink: finalViewLink,
            fileName: originalName,
            fileSize: file.size,
          });
        }
      } catch (driveErr) {
        console.error("Google Drive service account upload failed:", driveErr);
      }
    }

    // ─── 2. GOOGLE APPS SCRIPT FALLBACK (IF CONFIGURED) ───
    if (APPS_SCRIPT_URL) {
      try {
        const gasRes = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            base64: buffer.toString("base64"),
            fileName: originalName,
            mimeType,
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
          // 🌟 Auto-mirror to Secondary Google Drive (Dildar Ali Swati account)
          mirrorFileToSecondaryDrive(gasData.fileId, originalName).catch(() => {});

          const driveDownloadUrl = `/api/drive/download?fileId=${gasData.fileId}&name=${encodeURIComponent(originalName)}`;
          return NextResponse.json({
            success: true,
            source: "google_drive",
            fileUrl: driveDownloadUrl,
            directDownloadUrl: getPublicDriveDownloadUrl(gasData.fileId),
            driveFileId: gasData.fileId,
            driveViewLink: gasData.webViewLink || getDirectDriveViewUrl(gasData.fileId),
            fileName: originalName,
            fileSize: file.size,
          });
        }
      } catch (gasErr) {
        console.warn("Apps Script upload fallback notice:", gasErr);
      }
    }

    // ─── 3. IF HOSTED ON VERCEL & GOOGLE DRIVE IS NOT CONFIGURED ───
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          success: false,
          error:
            credsError ||
            "Google Drive is not connected on Vercel. Please add GOOGLE_CREDENTIALS to your Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: credsError || "Failed to upload file to Google Drive. Please verify your Google Drive credentials.",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
