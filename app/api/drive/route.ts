import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  getGoogleDriveClient,
  getPublicDriveDownloadUrl,
  clearDriveFilesCache,
} from "@/lib/googleDrive";

const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// 1. Fetch files from Google Drive (GET route)
export async function GET(req: Request) {
  try {
    const { drive, folderId, isConfigured, error: credsError } = getGoogleDriveClient();

    if (!isConfigured || !drive) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: credsError || "Google Drive credentials not configured.",
        files: [],
      });
    }

    const { searchParams } = new URL(req.url);
    const folderIdParam = searchParams.get("folderId");
    const activeFolderId = folderIdParam || folderId;
    const forceRefresh =
      searchParams.get("refresh") === "true" ||
      searchParams.get("force") === "true" ||
      searchParams.get("refresh") === "1";

    // ── Check in-memory cache if not forcing refresh ──
    const cacheMap = globalThis.__drive_files_cache__;
    if (!forceRefresh && cacheMap && cacheMap[activeFolderId]) {
      const cached = cacheMap[activeFolderId];
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return NextResponse.json({
          success: true,
          configured: true,
          files: cached.files,
          cached: true,
        });
      }
    }

    let query = "trashed = false";
    if (activeFolderId && activeFolderId !== "YOUR_SHARED_FOLDER_ID_HERE") {
      query = `'${activeFolderId}' in parents and trashed = false`;
    }

    const response = await drive.files.list({
      q: query,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy: "createdTime desc",
      fields:
        "files(id, name, mimeType, webViewLink, webContentLink, size, createdTime, modifiedTime, thumbnailLink, iconLink)",
    });

    const files = (response.data.files || []).map((f) => ({
      ...f,
      downloadUrl: `/api/drive/download?fileId=${f.id}&name=${encodeURIComponent(f.name || "document.pdf")}`,
      directDownloadUrl: f.id ? getPublicDriveDownloadUrl(f.id) : undefined,
    }));

    // Update in-memory cache
    if (!globalThis.__drive_files_cache__) {
      globalThis.__drive_files_cache__ = {};
    }
    globalThis.__drive_files_cache__[activeFolderId] = {
      files,
      timestamp: Date.now(),
    };

    return NextResponse.json({ success: true, configured: true, files, cached: false });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("Drive API Error:", error);
    return NextResponse.json(
      { success: false, error: errMessage, files: [] },
      { status: 500 }
    );
  }
}

// 2. Delete file from Google Drive (DELETE route)
export async function DELETE(req: Request) {
  try {
    const { drive, folderId, isConfigured, error: credsError } = getGoogleDriveClient();

    if (!isConfigured || !drive) {
      return NextResponse.json(
        { success: false, error: credsError || "Google Drive credentials not configured." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const fileName = searchParams.get("fileName");

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "fileId is required" },
        { status: 400 }
      );
    }

    let deletedMethod = "permanent";

    // ─── Tier 1: Try permanent deletion via drive.files.delete ───
    try {
      await drive.files.delete({
        fileId,
        supportsAllDrives: true,
      });
      deletedMethod = "permanent";
    } catch (delErr: unknown) {
      // ─── Tier 2: Try moving to Google Drive trash (trashed = true) ───
      try {
        await drive.files.update({
          fileId,
          requestBody: { trashed: true },
          supportsAllDrives: true,
        });
        deletedMethod = "trashed";
      } catch (trashErr: unknown) {
        // ─── Tier 3: Remove from shared folder ───
        try {
          await drive.files.update({
            fileId,
            removeParents: folderId,
            supportsAllDrives: true,
          });
          deletedMethod = "removed_from_folder";
        } catch (removeErr: unknown) {
          const removeMsg = removeErr instanceof Error ? removeErr.message : String(removeErr);
          const delMsg = delErr instanceof Error ? delErr.message : String(delErr);
          console.error("Failed delete, trash, and removeParents:", { delErr, trashErr, removeErr });
          throw new Error(delMsg || removeMsg || "Failed to delete file from Google Drive");
        }
      }
    }

    // Optional local cleanup if file exists locally
    if (fileName) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (fs.existsSync(uploadsDir)) {
          const localFiles = fs.readdirSync(uploadsDir);
          for (const localFile of localFiles) {
            if (localFile.includes(fileName)) {
              fs.unlinkSync(path.join(uploadsDir, localFile));
            }
          }
        }
      } catch {
        // non-critical
      }
    }

    // Invalidate drive files cache so UI gets fresh list
    clearDriveFilesCache();

    return NextResponse.json({
      success: true,
      message: "File successfully deleted from Google Drive",
      method: deletedMethod,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("Drive Delete API Error:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
