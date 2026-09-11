import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { PortalConfig, PortalRecord } from "@/lib/portal-types";
import {
  getAllPortalRecordsFromFirebase,
  savePortalRecordToFirebase,
  deletePortalRecordFromFirebase,
} from "@/lib/firebase";

const DATA_DIR = path.join(process.cwd(), "data");
const RECORDS_FILE = path.join(DATA_DIR, "saved-records.json");
const TMP_RECORDS_FILE = path.join(os.tmpdir(), "saved-records.json");

// In-memory cache fallback for serverless
declare global {
  var __portal_records_memory__: PortalRecord[] | undefined;
}

function readLocalRecords(): PortalRecord[] {
  try {
    if (fs.existsSync(RECORDS_FILE)) {
      const raw = fs.readFileSync(RECORDS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        globalThis.__portal_records_memory__ = list;
        return list;
      }
    }
  } catch {
    // try tmp or memory
  }

  if (globalThis.__portal_records_memory__) {
    return globalThis.__portal_records_memory__;
  }

  try {
    if (fs.existsSync(TMP_RECORDS_FILE)) {
      const raw = fs.readFileSync(TMP_RECORDS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        globalThis.__portal_records_memory__ = list;
        return list;
      }
    }
  } catch {
    // ignore
  }

  globalThis.__portal_records_memory__ = [];
  return [];
}

function saveLocalRecords(records: PortalRecord[]) {
  globalThis.__portal_records_memory__ = records;
  let saved = false;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), "utf-8");
    saved = true;
  } catch {
    // ignore
  }

  if (!saved) {
    try {
      fs.writeFileSync(TMP_RECORDS_FILE, JSON.stringify(records, null, 2), "utf-8");
    } catch {
      // kept in memory
    }
  }
}

/**
 * GET /api/records - Retrieve all saved portal records
 */
export async function GET() {
  try {
    // 1. Fetch from Firebase Firestore
    let fbRecords: PortalRecord[] = [];
    try {
      fbRecords = await getAllPortalRecordsFromFirebase();
    } catch (fbErr) {
      console.warn("Could not fetch records from Firebase (using local backup):", fbErr);
    }

    const localRecords = readLocalRecords();

    // Merge Firestore and local records (avoid duplicates by ID)
    const map = new Map<string, PortalRecord>();
    for (const r of localRecords) {
      if (r && (r.id || r.serialNumber)) {
        const id = r.id || `${r.serialNumber}_${r.unifiedNumber}`;
        map.set(id, { ...r, id });
      }
    }
    for (const r of fbRecords) {
      if (r && (r.id || r.serialNumber)) {
        const id = r.id || `${r.serialNumber}_${r.unifiedNumber}`;
        map.set(id, { ...r, id });
      }
    }

    const merged = Array.from(map.values()).sort((a, b) =>
      (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")
    );

    // Save synced merged list locally
    saveLocalRecords(merged);

    return NextResponse.json(
      {
        success: true,
        records: merged,
        count: merged.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/records error:", error);
    const local = readLocalRecords();
    return NextResponse.json({ success: true, records: local, count: local.length });
  }
}

/**
 * POST /api/records - Save a new or updated record
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

    const currentRecordId = (body as { currentRecordId?: string }).currentRecordId;
    const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;
    const now = new Date().toISOString();

    const recordData: PortalRecord = {
      ...body,
      id: recordId,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      createdAt: (body as any).createdAt || now,
      updatedAt: now,
    };

    // 1. Save to Firebase Firestore
    try {
      await savePortalRecordToFirebase(recordData, currentRecordId || recordId);
    } catch (fbErr: any) {
      console.warn("Could not save portal record to Firebase:", fbErr);
    }

    // 2. Save to local storage
    const current = readLocalRecords();
    const existingIndex = current.findIndex((r) => r.id === recordId);
    let updatedList: PortalRecord[];
    if (existingIndex >= 0) {
      updatedList = [...current];
      updatedList[existingIndex] = {
        ...recordData,
        createdAt: current[existingIndex].createdAt || now,
      };
    } else {
      updatedList = [recordData, ...current];
    }
    saveLocalRecords(updatedList);

    return NextResponse.json(
      { success: true, data: recordData, record: recordData },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/records error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save portal record" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/records?id=... - Delete a record directly from Firebase and local store
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !id.trim()) {
      return NextResponse.json(
        { success: false, error: "Record ID is required" },
        { status: 400 }
      );
    }

    const cleanId = id.trim();

    // 1. Delete from Firebase Firestore
    try {
      await deletePortalRecordFromFirebase(cleanId);
    } catch (fbErr) {
      console.warn("Could not delete portal record from Firebase:", fbErr);
    }

    // 2. Delete from local storage
    const current = readLocalRecords();
    const filtered = current.filter((r) => r.id !== cleanId);
    saveLocalRecords(filtered);

    return NextResponse.json({
      success: true,
      deletedId: cleanId,
      remainingCount: filtered.length,
    });
  } catch (error) {
    console.error("DELETE /api/records error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete portal record" },
      { status: 500 }
    );
  }
}
