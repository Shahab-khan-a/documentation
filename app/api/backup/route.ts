import { NextResponse } from "next/server";
import {
  backupRecordsToGoogleDrive,
  restoreRecordsToFirebase,
  MASTER_BACKUP_FILENAME,
} from "@/lib/firebase-drive-backup";
import { getAllPortalRecordsFromFirebase } from "@/lib/firebase";

export const dynamic = "force-dynamic";

/**
 * GET /api/backup - Get backup overview
 */
export async function GET() {
  try {
    const records = await getAllPortalRecordsFromFirebase();
    return NextResponse.json({
      success: true,
      totalFirebaseRecords: records.length,
      backupFileName: MASTER_BACKUP_FILENAME,
      message: "Ready to backup to Primary and Secondary Google Drive",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/backup - Trigger backup of all Firebase records to Google Drive
 * Optional query parameter: ?action=restore (with JSON body to restore)
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Optional restore functionality
    if (action === "restore") {
      const body = await req.text();
      const restoreResult = await restoreRecordsToFirebase(body);
      return NextResponse.json(restoreResult, {
        status: restoreResult.success ? 200 : 400,
      });
    }

    // Default: Perform full backup to Google Drive
    const result = await backupRecordsToGoogleDrive();

    if (!result.success && result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          totalRecords: result.totalRecords,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully backed up ${result.totalRecords} records to Google Drive!`,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("POST /api/backup error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
