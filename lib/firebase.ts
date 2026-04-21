/**
 * Firebase initialization module.
 * Initializes Firebase app, Analytics, and provides access to Firebase services.
 * Uses dynamic imports for tree-shaking and code splitting.
 *
 * Requirements: 10.1, 10.2
 */

import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

// ─── Firebase Config ──────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ─── App Singleton ────────────────────────────────────────────────────────────

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

/**
 * Returns the Firebase app instance, initializing it if necessary.
 * Uses singleton pattern to avoid duplicate app initialization.
 * Dynamically imports Firebase to reduce initial bundle size.
 */
export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!app) {
    const { initializeApp, getApps } = await import("firebase/app");
    const existingApps = getApps();
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
  }
  return app;
}

/**
 * Returns the Firebase Analytics instance.
 * Only available in browser environments.
 * Returns null in SSR/Node.js environments or when config is missing.
 * Dynamically imports Firebase Analytics to reduce initial bundle size.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null;

  if (!analytics) {
    try {
      const firebaseApp = await getFirebaseApp();
      const { getAnalytics } = await import("firebase/analytics");
      analytics = getAnalytics(firebaseApp);
    } catch (error) {
      console.warn("[Firebase] Analytics initialization failed:", error);
      return null;
    }
  }

  return analytics;
}

/**
 * Checks whether Firebase is properly configured via environment variables.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}
