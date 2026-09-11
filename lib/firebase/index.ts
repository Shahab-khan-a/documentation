import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getAuth, signInAnonymously, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";
import { PortalConfig } from "../portal-types";

// Singleton initialization: prevents "Firebase App already exists" error during Next.js hot-reload
const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore database instance
const db: Firestore = getFirestore(app);

// Initialize Firebase Auth instance
let auth: Auth | null = null;
if (typeof window !== "undefined") {
  try {
    auth = getAuth(app);
    signInAnonymously(auth).catch(() => {
      // Anonymous auth disabled or not needed in console
    });
  } catch {
    // ignore
  }
}

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

export { app, db, analytics, firebaseConfig };
export default app;
