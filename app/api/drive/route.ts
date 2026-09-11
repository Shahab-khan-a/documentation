import { google } from "googleapis";
import path from "path";
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
    // User URL se bhi ?folderId=... pass kar sakta hai, ya default ID use hogi
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
      fields: "files(id, name, mimeType, webViewLink, webContentLink, size, createdTime)",
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
