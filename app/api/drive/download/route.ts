import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const KEY_FILE_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const customName = searchParams.get("name");

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(KEY_FILE_PATH) && !process.env.GOOGLE_CREDENTIALS) {
      return NextResponse.json(
        { success: false, error: "Google Drive credentials not configured" },
        { status: 404 }
      );
    }

    // 1. Get file metadata from Google Drive
    const metaRes = await drive.files.get({
      fileId,
      supportsAllDrives: true,
      fields: "id, name, mimeType, size",
    });

    const fileName = customName || metaRes.data.name || "document.pdf";
    const mimeType = metaRes.data.mimeType || "application/octet-stream";

    // 2. Stream file content from Google Drive
    const fileStreamRes = await drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      { responseType: "stream" }
    );

    // Convert Node.js readable stream to Web ReadableStream for Next.js
    const nodeStream = fileStreamRes.data as unknown as Readable;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk: Buffer | Uint8Array) => {
          controller.enqueue(chunk);
        });
        nodeStream.on("end", () => {
          controller.close();
        });
        nodeStream.on("error", (err: Error) => {
          controller.error(err);
        });
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    // Encode filename for Content-Disposition header
    const encodedFileName = encodeURIComponent(fileName);

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`,
        ...(metaRes.data.size ? { "Content-Length": metaRes.data.size } : {}),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Google Drive Download Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
