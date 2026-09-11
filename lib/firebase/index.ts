import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { PortalConfig, PortalRecord } from "../portal-types";

// Singleton initialization: prevents "Firebase App already exists" error during Next.js hot-reload
const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore database instance
const db: Firestore = getFirestore(app);

// Analytics is only supported in browser/client environments (not SSR/Node)
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics could not be initialized:", err);
    });
}

/**
 * Helper to safely get the Analytics instance on the client
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      return analytics;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Save complete portal configuration to Firebase Cloud Firestore
 * Stores under `portal_configs/current`, archives under `portal_configs/[serialNumber]`
 * and composite `portal_configs/[serialNumber]_[unifiedNumber]`
 */
export async function saveConfigToFirebase(config: PortalConfig): Promise<boolean> {
  try {
    const cleanSerial = (config.serialNumber || "").trim();
    const cleanUnified = (config.unifiedNumber || "").trim();

    const dataToSave = {
      ...config,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      savedAt: new Date().toISOString(),
    };

    // 1. Save to the main active document 'current'
    const currentDocRef = doc(db, "portal_configs", "current");
    await setDoc(currentDocRef, dataToSave, { merge: true });

    // 2. Archive by serial number if provided
    if (cleanSerial) {
      const serialDocRef = doc(db, "portal_configs", cleanSerial);
      await setDoc(serialDocRef, dataToSave, { merge: true });

      // 3. Also archive by composite key `[serial]_[unified]` if unified exists
      if (cleanUnified) {
        const compositeDocRef = doc(db, "portal_configs", `${cleanSerial}_${cleanUnified}`);
        await setDoc(compositeDocRef, dataToSave, { merge: true });
      }
    }

    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes("Missing or insufficient permissions") ||
      (err as { code?: string })?.code === "permission-denied"
    ) {
      console.warn(
        "ℹ️ Firebase Firestore Security Notice: To enable direct client-side Firestore writes, allow read/write in Firebase Console -> Firestore -> Rules:\n" +
        "match /portal_configs/{document=**} { allow read, write: if true; }\n" +
        "Changes are currently saved safely to server API and local cache."
      );
    } else {
      console.warn("Firebase Firestore save notice:", err);
    }
    return false;
  }
}

/**
 * Retrieve portal configuration from Firebase Cloud Firestore
 * Optionally checks for specific composite `[serial]_[unified]` or `[serial]`,
 * falling back to the active `current` document.
 */
export async function getConfigFromFirebase(
  serialNumber?: string,
  unifiedNumber?: string
): Promise<PortalConfig | null> {
  try {
    const cleanSerial = (serialNumber || "").trim();
    const cleanUnified = (unifiedNumber || "").trim();

    // 1. Try composite key first
    if (cleanSerial && cleanUnified) {
      const compDocRef = doc(db, "portal_configs", `${cleanSerial}_${cleanUnified}`);
      const compSnap = await getDoc(compDocRef);
      if (compSnap.exists()) {
        return compSnap.data() as PortalConfig;
      }
    }

    // 2. Try serial document
    if (cleanSerial) {
      const serialDocRef = doc(db, "portal_configs", cleanSerial);
      const serialSnap = await getDoc(serialDocRef);
      if (serialSnap.exists()) {
        return serialSnap.data() as PortalConfig;
      }
    }

    // 3. Fallback to active 'current' document
    const currentDocRef = doc(db, "portal_configs", "current");
    const snapshot = await getDoc(currentDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as PortalConfig;
    }
  } catch (err) {
    console.warn("Could not retrieve config from Firebase (falling back to local cache):", err);
  }
  return null;
}

/**
 * Check whether a unified number already exists in Firestore collection `portal_records`
 * Returns { exists: boolean, existingRecord?: PortalRecord }
 */
export async function checkUnifiedNumberExists(
  unifiedNumber: string,
  excludeRecordId?: string
): Promise<{ exists: boolean; existingRecord?: PortalRecord }> {
  try {
    const cleanUnified = (unifiedNumber || "").trim();
    if (!cleanUnified) return { exists: false };

    const records = await getAllPortalRecordsFromFirebase();
    const found = records.find(
      (r) =>
        (r.unifiedNumber || "").trim() === cleanUnified &&
        (!excludeRecordId || r.id !== excludeRecordId)
    );

    if (found) {
      return { exists: true, existingRecord: found };
    }
    return { exists: false };
  } catch (err) {
    console.warn("Could not check unified number in Firebase:", err);
    return { exists: false };
  }
}

/**
 * Save / Archive a dedicated Portal Record into Firestore collection `portal_records`
 * Re-using serial numbers is 100% ALLOWED.
 * Duplicate unified numbers across different records are strictly forbidden and rejected.
 */
export async function savePortalRecordToFirebase(
  config: PortalConfig,
  currentRecordId?: string
): Promise<PortalRecord | null> {
  try {
    const cleanSerial = (config.serialNumber || "").trim();
    const cleanUnified = (config.unifiedNumber || "").trim();
    if (!cleanSerial) return null;

    const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;

    // Strict validation: Unified Number must be unique across Firebase records
    if (cleanUnified) {
      const dupCheck = await checkUnifiedNumberExists(
        cleanUnified,
        currentRecordId || recordId
      );
      if (dupCheck.exists && dupCheck.existingRecord && dupCheck.existingRecord.id !== recordId) {
        throw new Error(
          `DUPLICATE_UNIFIED_NUMBER: الرقم الموحد (${cleanUnified}) مسجل مسبقاً في Firebase تحت السجل #${dupCheck.existingRecord.serialNumber}`
        );
      }
    }

    const now = new Date().toISOString();

    const recordData: PortalRecord = {
      ...config,
      id: recordId,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Save to dedicated portal_records collection
    const recordDocRef = doc(db, "portal_records", recordId);
    await setDoc(recordDocRef, recordData, { merge: true });

    // 2. Also keep portal_configs synced for backward compatibility
    await saveConfigToFirebase(config);

    return recordData;
  } catch (err) {
    console.warn("Could not save portal record to Firebase:", err);
    throw err;
  }
}

/**
 * Retrieve all saved Portal Records from Firestore collection `portal_records`
 */
export async function getAllPortalRecordsFromFirebase(): Promise<PortalRecord[]> {
  try {
    const recordsCol = collection(db, "portal_records");
    const snapshot = await getDocs(recordsCol);
    const records: PortalRecord[] = [];
    snapshot.forEach((d) => {
      if (d.exists()) {
        records.push(d.data() as PortalRecord);
      }
    });

    // Sort by createdAt descending
    return records.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (err) {
    console.warn("Could not list portal records from Firebase:", err);
    return [];
  }
}

/**
 * Permanently delete a record by ID from Firestore collection `portal_records`
 */
export async function deletePortalRecordFromFirebase(recordId: string): Promise<boolean> {
  try {
    const cleanId = (recordId || "").trim();
    if (!cleanId) return false;

    // Delete from portal_records
    const recordDocRef = doc(db, "portal_records", cleanId);
    await deleteDoc(recordDocRef);

    // Also attempt cleanup from portal_configs if matching doc exists
    try {
      const configDocRef = doc(db, "portal_configs", cleanId);
      await deleteDoc(configDocRef);
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.warn("Could not delete portal record from Firebase:", err);
    return false;
  }
}

/**
 * Find specific portal record by serial and optional unified number
 */
export async function getPortalRecordBySerialUnified(
  serial: string,
  unified?: string
): Promise<PortalConfig | null> {
  try {
    const cleanSerial = (serial || "").trim();
    const cleanUnified = (unified || "").trim();
    if (!cleanSerial) return null;

    // 1. Try exact composite `[serial]_[unified]` in portal_records
    if (cleanUnified) {
      const compRef = doc(db, "portal_records", `${cleanSerial}_${cleanUnified}`);
      const compSnap = await getDoc(compRef);
      if (compSnap.exists()) {
        return compSnap.data() as PortalConfig;
      }
    }

    // 2. Try single serial in portal_records
    const serialRef = doc(db, "portal_records", cleanSerial);
    const serialSnap = await getDoc(serialRef);
    if (serialSnap.exists()) {
      return serialSnap.data() as PortalConfig;
    }

    // 3. Fallback to portal_configs
    return await getConfigFromFirebase(cleanSerial, cleanUnified);
  } catch (err) {
    console.warn("Could not get portal record by serial/unified:", err);
    return null;
  }
}

export { app, db, analytics, firebaseConfig };
export default app;
