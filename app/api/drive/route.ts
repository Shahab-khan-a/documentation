import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

// 1. Google Auth Configuration
const KEY_FILE_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

// 2. Drive se files fetch karne ke liye GET route
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folderIdParam = searchParams.get("folderId");
    const FOLDER_ID = folderIdParam || process.env.GOOGLE_DRIVE_FOLDER_ID || "1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";

    let query = "trashed = false";
    if (FOLDER_ID && FOLDER_ID !== "YOUR_SHARED_FOLDER_ID_HERE") {
      query = `'${FOLDER_ID}' in parents and trashed = false`;
    }

    const response = await drive.files.list({
      q: query,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy: "createdTime desc",
      fields: "files(id, name, mimeType, webViewLink, webContentLink, size, createdTime, modifiedTime, thumbnailLink, iconLink)",
    });

    const files = (response.data.files || []).map((f) => ({
      ...f,
      downloadUrl: `/api/drive/download?fileId=${f.id}&name=${encodeURIComponent(f.name || "document.pdf")}`,
    }));

    return NextResponse.json({ success: true, files });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("Drive API Error:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// 3. Drive se file delete karne ke liye DELETE route
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const fileName = searchParams.get("fileName");

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "fileId is required" },
        { status: 400 }
      );
    }

    const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1x_l6AuXh8rhOTWPrtOS0muxJr-y8zwtl";
    let deletedMethod = "permanent";

    // ─── Tier 1: Try permanent deletion via drive.files.delete ───
    try {
      await drive.files.delete({
        fileId,
        supportsAllDrives: true,
      });
      deletedMethod = "permanent";
    } catch (delErr: unknown) {
      // ─── Tier 2: If service account lacks delete permission (shared file/folder), remove from shared folder ───
      try {
        await drive.files.update({
          fileId,
          removeParents: FOLDER_ID,
          supportsAllDrives: true,
        });
        deletedMethod = "removed_from_folder";
      } catch (removeErr: unknown) {
        const removeMsg = removeErr instanceof Error ? removeErr.message : String(removeErr);
        const delMsg = delErr instanceof Error ? delErr.message : String(delErr);
        console.error("Failed both delete and removeParents:", { delErr, removeErr });
        throw new Error(delMsg || removeMsg || "Failed to delete file from Google Drive");
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
