"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export default function FirebaseAnalytics() {
  useEffect(() => {
    // Automatically initializes Firebase Analytics on the client
    getFirebaseAnalytics();
  }, []);

  return null;
}
