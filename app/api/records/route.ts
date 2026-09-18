import { NextResponse } from "next/server";
import { PortalConfig, PortalRecord } from "@/lib/portal-types";
import {
  getAllPortalRecordsFromFirebase,
  savePortalRecordToFirebase,
  deletePortalRecordFromFirebase,
} from "@/lib/firebase";
import { backupRecordsToGoogleDrive } from "@/lib/firebase-drive-backup";

// Transient in-memory cache
declare global {
  var __portal_records_memory__: PortalRecord[] | undefined;
}

/**
 * GET /api/records - Retrieve all portal records directly from Firebase Firestore
 */
export async function GET() {
  try {
    const fbRecords = await getAllPortalRecordsFromFirebase();
    if (fbRecords && fbRecords.length > 0) {
      globalThis.__portal_records_memory__ = fbRecords;
      return NextResponse.json(
        {
          success: true,
          records: fbRecords,
          count: fbRecords.length,
          source: "firebase",
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
            "Pragma": "no-cache",
          },
        }
      );
    }

    // If Firestore returned empty or during initial connection, use memory cache if available
    const fallback = globalThis.__portal_records_memory__ || [];
    return NextResponse.json(
      {
        success: true,
        records: fallback,
        count: fallback.length,
        source: "memory",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/records Firebase error:", error);
    const fallback = globalThis.__portal_records_memory__ || [];
    return NextResponse.json({ success: true, records: fallback, count: fallback.length });
  }
}

/**
 * POST /api/records - Save a record directly to Firebase Firestore
 */
export async function POST(req: Request) {
  try {
    const body: PortalConfig = await req.json();
    const cleanSerial = (body.serialNumber || "").trim();
    const cleanUnified = (body.unifiedNumber || "").trim();

    if (!cleanSerial) {
      return NextResponse.json(
        { success: false, error: "Serial number is required" },
        { status: 400 }
      );
    }

    const isNewRecCard = Boolean((body as any).id && (body as any).id.startsWith("rec_"));
    const currentRecordId = isNewRecCard
      ? undefined
      : (body as { currentRecordId?: string }).currentRecordId;
    const recordId =
      (body as any).id && (body as any).id !== "current"
        ? (body as any).id
        : cleanUnified
        ? `${cleanSerial}_${cleanUnified}`
        : cleanSerial;
    const now = new Date().toISOString();

    const recordData: PortalRecord = {
      ...body,
      id: recordId,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      createdAt: (body as any).createdAt || now,
      updatedAt: now,
    };
    if (isNewRecCard) {
      delete (recordData as any).currentRecordId;
    }

    // Save directly to Firebase Firestore
    await savePortalRecordToFirebase(recordData, currentRecordId);

    // Update transient memory cache
    const current = globalThis.__portal_records_memory__ || [];
    const existingIndex = isNewRecCard
      ? current.findIndex((r) => r.id === recordId)
      : current.findIndex(
          (r) =>
            (recordId && r.id === recordId) ||
            (currentRecordId && (r.id === currentRecordId || r.currentRecordId === currentRecordId))
        );
    if (existingIndex >= 0) {
      current[existingIndex] = recordData;
    } else {
      current.unshift(recordData);
    }
    globalThis.__portal_records_memory__ = current;

    // 🌟 Automatic background sync to Primary & Secondary Google Drive
    backupRecordsToGoogleDrive(current).catch((err) =>
      console.warn("[Auto-Backup] Background Drive backup warning:", err)
    );

    return NextResponse.json(
      { success: true, data: recordData, record: recordData, source: "firebase" },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/records Firebase error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/records?id=... - Delete record directly from Firebase Firestore
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const serial = searchParams.get("serial");
    const unified = searchParams.get("unified");
    const reqNum = searchParams.get("req");

    const cleanId = (id || "").trim();
    const cleanSerial = (serial || "").trim();
    const cleanUnified = (unified || "").trim();
    const cleanReq = (reqNum || "").trim();

    if (!cleanId && !cleanSerial) {
      return NextResponse.json(
        { success: false, error: "Record ID or serial is required" },
        { status: 400 }
      );
    }

    // Delete directly from Firebase Firestore
    await deletePortalRecordFromFirebase(cleanId, cleanSerial, cleanUnified, cleanReq);

    // Update memory cache: remove only the exact deleted record
    if (globalThis.__portal_records_memory__) {
      globalThis.__portal_records_memory__ = globalThis.__portal_records_memory__.filter((r) => {
        if (cleanId && (r.id === cleanId || r.currentRecordId === cleanId)) return false;
        return true;
      });
    }

    // 🌟 Automatic background sync to Primary & Secondary Google Drive
    backupRecordsToGoogleDrive(globalThis.__portal_records_memory__).catch((err) =>
      console.warn("[Auto-Backup] Background Drive backup warning:", err)
    );

    return NextResponse.json({
      success: true,
      deletedId: cleanId || cleanSerial,
      source: "firebase",
    });
  } catch (error) {
    console.error("DELETE /api/records Firebase error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete portal record from Firebase" },
      { status: 500 }
    );
  }
}
