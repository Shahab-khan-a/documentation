import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  Firestore,
  Unsubscribe,
} from "firebase/firestore";
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
 * Recursively removes all undefined fields from an object or array.
 * Firebase Firestore throws an error when any field is undefined.
 */
export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }
  if (typeof data === "object" && data !== null) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Save complete portal configuration to Firebase Cloud Firestore.
 * Saves under:
 *  1. `portal_configs/current` (active current default)
 *  2. `portal_configs/[serialNumber]` (single serial lookup)
 *  3. `portal_configs/[serialNumber]_[unifiedNumber]` (exact composite lookup)
 *  4. `portal_configs/[requestNumber]_[serialNumber]_[unifiedNumber]` (DocumentVerify lookup)
 */
export async function saveConfigToFirebase(config: PortalConfig): Promise<boolean> {
  try {
    const cleanSerial = (config.serialNumber || "").trim();
    const cleanUnified = (config.unifiedNumber || "").trim();
    const cleanReq = (config.requestNumber || "").trim();
    const now = new Date().toISOString();

    const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;

    const rawData: PortalRecord = {
      ...config,
      id: recordId,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      requestNumber: cleanReq,
      updatedAt: now,
      createdAt: (config as any).createdAt || now,
    };

    const dataToSave = sanitizeFirestoreData(rawData);

    // 1. Save to the main active document 'current'
    const currentDocRef = doc(db, "portal_configs", "current");
    await setDoc(currentDocRef, dataToSave, { merge: true });

    // 2. Archive by serial number if provided
    if (cleanSerial) {
      const serialDocRef = doc(db, "portal_configs", cleanSerial);
      await setDoc(serialDocRef, dataToSave, { merge: true });

      // 3. Archive by composite key `[serial]_[unified]`
      if (cleanUnified) {
        const compositeDocRef = doc(db, "portal_configs", `${cleanSerial}_${cleanUnified}`);
        await setDoc(compositeDocRef, dataToSave, { merge: true });
      }

      // 4. Archive by `[requestNumber]_[serial]` & `[requestNumber]_[serial]_[unified]` for DocumentVerify routes
      if (cleanReq) {
        const reqSerialDocRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}`);
        await setDoc(reqSerialDocRef, dataToSave, { merge: true });
      }
      if (cleanReq && cleanUnified) {
        const reqDocRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}_${cleanUnified}`);
        await setDoc(reqDocRef, dataToSave, { merge: true });
      }
    }

    return true;
  } catch (err: unknown) {
    console.error("Firebase Firestore saveConfigToFirebase error:", err);
    return false;
  }
}

/**
 * Retrieve portal configuration from Firebase Cloud Firestore
 * Checks composite key, serial, request number, or active 'current' document.
 */
export async function getConfigFromFirebase(
  serialNumber?: string,
  unifiedNumber?: string,
  requestNumber?: string
): Promise<PortalConfig | null> {
  try {
    const cleanSerial = (serialNumber || "").trim();
    const cleanUnified = (unifiedNumber || "").trim();
    const cleanReq = (requestNumber || "").trim();

    // 1. Try DocumentVerify key: [req]_[serial]
    if (cleanReq && cleanSerial) {
      const reqRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}`);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        return reqSnap.data() as PortalConfig;
      }
    }

    // 2. Try DocumentVerify full composite key: [req]_[serial]_[unified]
    if (cleanReq && cleanSerial && cleanUnified) {
      const reqDocRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}_${cleanUnified}`);
      const reqSnap = await getDoc(reqDocRef);
      if (reqSnap.exists()) {
        return reqSnap.data() as PortalConfig;
      }
    }

    // 2. Try composite key: [serial]_[unified]
    if (cleanSerial && cleanUnified) {
      const compDocRef = doc(db, "portal_configs", `${cleanSerial}_${cleanUnified}`);
      const compSnap = await getDoc(compDocRef);
      if (compSnap.exists()) {
        return compSnap.data() as PortalConfig;
      }
    }

    // 3. Try single serial document in portal_configs
    if (cleanSerial) {
      const serialDocRef = doc(db, "portal_configs", cleanSerial);
      const serialSnap = await getDoc(serialDocRef);
      if (serialSnap.exists()) {
        return serialSnap.data() as PortalConfig;
      }
    }

    // 4. Fallback to active 'current' document
    const currentDocRef = doc(db, "portal_configs", "current");
    const snapshot = await getDoc(currentDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as PortalConfig;
    }
  } catch (err) {
    console.warn("Could not retrieve config from Firebase:", err);
  }
  return null;
}

/**
 * Save / Archive a dedicated Portal Record into Firestore
 */
export async function savePortalRecordToFirebase(
  config: PortalConfig,
  currentRecordId?: string
): Promise<PortalRecord | null> {
  try {
    const cleanSerial = (config.serialNumber || "").trim();
    const cleanUnified = (config.unifiedNumber || "").trim();
    const cleanReq = (config.requestNumber || "").trim();
    if (!cleanSerial) return null;

    const recordId = cleanUnified ? `${cleanSerial}_${cleanUnified}` : cleanSerial;
    const now = new Date().toISOString();

    const rawRecord: PortalRecord = {
      ...config,
      id: recordId,
      serialNumber: cleanSerial,
      unifiedNumber: cleanUnified,
      requestNumber: cleanReq,
      createdAt: (config as any).createdAt || now,
      updatedAt: now,
    };

    const recordData = sanitizeFirestoreData(rawRecord);

    // If currentRecordId is provided and differs from new recordId, clean up old record doc
    if (currentRecordId && currentRecordId !== recordId && currentRecordId !== "current") {
      try {
        const oldDocRef = doc(db, "portal_configs", currentRecordId);
        await deleteDoc(oldDocRef);
      } catch {
        // ignore
      }
    }

    // 1. Save to portal_configs with recordId
    const recordDocRef = doc(db, "portal_configs", recordId);
    await setDoc(recordDocRef, recordData, { merge: true });

    // 2. Also save by serial if cleanSerial exists
    if (cleanSerial && recordId !== cleanSerial) {
      const serialDocRef = doc(db, "portal_configs", cleanSerial);
      await setDoc(serialDocRef, recordData, { merge: true });
    }

    // 3. Also archive by DocumentVerify composite key if requestNumber exists
    if (cleanReq && cleanSerial) {
      const reqSerialDocRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}`);
      await setDoc(reqSerialDocRef, recordData, { merge: true });
    }
    if (cleanReq && cleanUnified) {
      const reqDocRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}_${cleanUnified}`);
      await setDoc(reqDocRef, recordData, { merge: true });
    }

    // 4. Save as current active config
    const currentDocRef = doc(db, "portal_configs", "current");
    await setDoc(currentDocRef, recordData, { merge: true });

    return recordData;
  } catch (err) {
    console.error("Could not save portal record to Firebase:", err);
    throw err;
  }
}

/**
 * Retrieve all saved Portal Records from Firestore
 */
export async function getAllPortalRecordsFromFirebase(): Promise<PortalRecord[]> {
  const recordsMap = new Map<string, PortalRecord>();

  try {
    const configsCol = collection(db, "portal_configs");
    const snapshot = await getDocs(configsCol);
    snapshot.forEach((d) => {
      if (d.exists()) {
        const id = d.id;
        // Ignore system documents
        if (id === "test_connection" || id === "current") return;
        const data = d.data() as PortalRecord;
        if (data && (data.serialNumber || data.chamberName)) {
          const cleanS = (data.serialNumber || "").trim();
          const cleanU = (data.unifiedNumber || "").trim();
          const canonicalKey = cleanS ? (cleanU ? `${cleanS}_${cleanU}` : cleanS) : (data.id || id);

          const existing = recordsMap.get(canonicalKey);
          const currentUpdated = data.updatedAt || data.createdAt || "";
          const existingUpdated = existing?.updatedAt || existing?.createdAt || "";

          if (!existing || currentUpdated >= existingUpdated) {
            recordsMap.set(canonicalKey, {
              ...data,
              id: canonicalKey,
              serialNumber: cleanS,
              unifiedNumber: cleanU,
              requestNumber: (data.requestNumber || "").trim(),
            });
          }
        }
      }
    });
  } catch (err) {
    console.warn("Could not list records from portal_configs:", err);
  }

  const records = Array.from(recordsMap.values());
  return records.sort((a, b) =>
    (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")
  );
}

/**
 * Permanently delete a record and all its associated Firestore documents
 * (serial documents, composite keys, request documents) from Firestore.
 */
export async function deletePortalRecordFromFirebase(
  recordOrId: PortalRecord | string,
  serial?: string,
  unified?: string,
  requestNumber?: string
): Promise<boolean> {
  try {
    let cleanId = "";
    let cleanSerial = (serial || "").trim();
    let cleanUnified = (unified || "").trim();
    let cleanReq = (requestNumber || "").trim();

    if (typeof recordOrId === "object" && recordOrId !== null) {
      cleanId = (recordOrId.id || "").trim();
      cleanSerial = cleanSerial || (recordOrId.serialNumber || "").trim();
      cleanUnified = cleanUnified || (recordOrId.unifiedNumber || "").trim();
      cleanReq = cleanReq || (recordOrId.requestNumber || "").trim();
    } else if (typeof recordOrId === "string") {
      cleanId = recordOrId.trim();
      if (!cleanSerial && cleanId.includes("_")) {
        const parts = cleanId.split("_");
        cleanSerial = parts[0] || "";
        cleanUnified = parts[1] || "";
      } else if (!cleanSerial) {
        cleanSerial = cleanId;
      }
    }

    if (!cleanId && !cleanSerial) return false;

    // Collect all potential document IDs in portal_configs
    const targetDocIds = new Set<string>();
    if (cleanId) targetDocIds.add(cleanId);
    if (cleanSerial) {
      targetDocIds.add(cleanSerial);
      if (cleanUnified) {
        targetDocIds.add(`${cleanSerial}_${cleanUnified}`);
      }
      if (cleanReq) {
        targetDocIds.add(`${cleanReq}_${cleanSerial}`);
        if (cleanUnified) {
          targetDocIds.add(`${cleanReq}_${cleanSerial}_${cleanUnified}`);
        }
      }
    }

    // Delete direct document references
    for (const docId of targetDocIds) {
      if (!docId || docId === "current" || docId === "test_connection") continue;
      try {
        const docRef = doc(db, "portal_configs", docId);
        await deleteDoc(docRef);
      } catch {
        // ignore
      }
    }

    // Also scan portal_configs collection and delete any documents where serialNumber or id matches
    if (cleanSerial || cleanId) {
      try {
        const configsCol = collection(db, "portal_configs");
        const snapshot = await getDocs(configsCol);
        for (const d of snapshot.docs) {
          const dId = d.id;
          if (dId === "current" || dId === "test_connection") continue;
          const data = d.data();
          const matchesSerial = cleanSerial && (data?.serialNumber === cleanSerial || dId === cleanSerial || dId.endsWith(`_${cleanSerial}`));
          const matchesId = cleanId && (data?.id === cleanId || dId === cleanId);
          if (matchesSerial || matchesId) {
            try {
              await deleteDoc(doc(db, "portal_configs", dId));
            } catch {
              // ignore
            }
          }
        }
      } catch (scanErr) {
        console.warn("Could not scan portal_configs during deletion:", scanErr);
      }
    }

    // If the active 'current' document was pointing to this deleted record, update 'current'
    try {
      const currentDocRef = doc(db, "portal_configs", "current");
      const currentSnap = await getDoc(currentDocRef);
      if (currentSnap.exists()) {
        const curData = currentSnap.data();
        if (
          (cleanSerial && curData?.serialNumber === cleanSerial) ||
          (cleanId && (curData?.id === cleanId || curData?.currentRecordId === cleanId))
        ) {
          const configsCol = collection(db, "portal_configs");
          const snapshot = await getDocs(configsCol);
          let replacement: any = null;
          for (const d of snapshot.docs) {
            const did = d.id;
            if (did !== "current" && did !== "test_connection" && did !== cleanId && did !== cleanSerial) {
              const ddata = d.data();
              if (ddata?.serialNumber && ddata.serialNumber !== cleanSerial) {
                replacement = ddata;
                break;
              }
            }
          }
          if (replacement) {
            await setDoc(currentDocRef, sanitizeFirestoreData(replacement));
          }
        }
      }
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
 * Find specific portal record by serial, optional unified number, and optional request number
 */
export async function getPortalRecordBySerialUnified(
  serial?: string,
  unified?: string,
  requestNumber?: string
): Promise<PortalConfig | null> {
  try {
    const cleanSerial = (serial || "").trim();
    const cleanUnified = (unified || "").trim();
    const cleanReq = (requestNumber || "").trim();

    // 1. Try DocumentVerify key: [req]_[serial]
    if (cleanReq && cleanSerial) {
      try {
        const reqRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}`);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          return reqSnap.data() as PortalConfig;
        }
      } catch {
        // ignore
      }
    }

    // 2. Try DocumentVerify full composite key: [req]_[serial]_[unified]
    if (cleanReq && cleanSerial && cleanUnified) {
      try {
        const reqRef = doc(db, "portal_configs", `${cleanReq}_${cleanSerial}_${cleanUnified}`);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          return reqSnap.data() as PortalConfig;
        }
      } catch {
        // ignore
      }
    }

    // 2. Try exact composite `[serial]_[unified]` in portal_configs
    if (cleanSerial && cleanUnified) {
      try {
        const compRef = doc(db, "portal_configs", `${cleanSerial}_${cleanUnified}`);
        const compSnap = await getDoc(compRef);
        if (compSnap.exists()) {
          return compSnap.data() as PortalConfig;
        }
      } catch {
        // ignore
      }
    }

    // 3. Try single serial in portal_configs
    if (cleanSerial) {
      try {
        const serialRef = doc(db, "portal_configs", cleanSerial);
        const serialSnap = await getDoc(serialRef);
        if (serialSnap.exists()) {
          return serialSnap.data() as PortalConfig;
        }
      } catch {
        // ignore
      }
    }

    // 4. Fallback to active 'current' document
    return await getConfigFromFirebase(cleanSerial, cleanUnified, cleanReq);
  } catch (err) {
    console.warn("Could not get portal record by serial/unified/requestNumber:", err);
    return null;
  }
}

/**
 * Subscribe to real-time Firestore document updates.
 * Fires the callback whenever the document is updated in Firebase.
 */
export function subscribeToPortalConfig(
  serial?: string,
  unified?: string,
  onUpdate?: (config: PortalConfig) => void
): Unsubscribe | null {
  if (typeof window === "undefined" || !onUpdate) return null;

  try {
    const cleanSerial = (serial || "").trim();
    const cleanUnified = (unified || "").trim();

    let targetDocId = "current";
    if (cleanSerial && cleanUnified) {
      targetDocId = `${cleanSerial}_${cleanUnified}`;
    } else if (cleanSerial) {
      targetDocId = cleanSerial;
    }

    const docRef = doc(db, "portal_configs", targetDocId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as PortalConfig);
        }
      },
      (err) => {
        console.warn("Firestore snapshot listener error:", err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Could not set up Firestore listener:", err);
    return null;
  }
}

export { app, db, analytics, firebaseConfig };
export default app;
