import { NextResponse } from "next/server";
import { Readable } from "stream";
import { getGoogleDriveClient, getPublicDriveDownloadUrl } from "@/lib/googleDrive";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  const customName = searchParams.get("name");

  if (!fileId) {
    return NextResponse.json(
      { success: false, error: "File ID is required" },
      { status: 400 }
    );
  }

  const { drive, isConfigured } = getGoogleDriveClient();

  // If service account is not configured on Vercel, redirect directly to Google Drive public download
  if (!isConfigured || !drive) {
    console.info(`Credentials not configured, redirecting to direct Google Drive download for file: ${fileId}`);
    return NextResponse.redirect(getPublicDriveDownloadUrl(fileId), 307);
  }

  try {
    // 1. Get file metadata from Google Drive
    const metaRes = await drive.files.get({
      fileId,
      supportsAllDrives: true,
      fields: "id, name, mimeType, size",
    });

    const fileName = (customName || metaRes.data.name || "document.pdf").trim();
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

    // RFC-6266 & RFC-5987 compliant Content-Disposition
    // safeAsciiName ensures no invalid character crash (e.g. ERR_INVALID_CHAR on Arabic text)
    const safeAsciiName = (fileName.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "") || "download.pdf").trim();
    const encodedFileName = encodeURIComponent(fileName);

    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedFileName}`
    );
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

    if (metaRes.data.size) {
      headers.set("Content-Length", metaRes.data.size);
    }

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.warn("Google Drive stream proxy encountered an error, falling back to direct public download link:", error);
    // Bulletproof fallback: redirect directly to Google Drive so visitor always gets the original file
    return NextResponse.redirect(getPublicDriveDownloadUrl(fileId), 307);
  }
}
