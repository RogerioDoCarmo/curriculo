/**
 * Firebase initialization module.
 * Initializes Firebase app, Analytics, and provides access to Firebase services.
 * Uses dynamic imports for tree-shaking and code splitting.
 *
 * Requirements: 10.1, 10.2
 */

import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import type { RemoteConfig } from "firebase/remote-config";

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
let remoteConfig: RemoteConfig | null = null;

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
 * Check if user has given analytics consent
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const consentStatus = localStorage.getItem("cookie-consent");
    const preferences = localStorage.getItem("cookie-preferences");

    // If no consent given yet, return false (opt-in approach)
    if (!consentStatus) return false;

    // If rejected, return false
    if (consentStatus === "rejected") return false;

    // If accepted, return true
    if (consentStatus === "accepted") return true;

    // If customized, check preferences
    if (consentStatus === "customized" && preferences) {
      const parsed = JSON.parse(preferences);
      return parsed.analytics === true;
    }
  } catch (error) {
    console.warn("[Firebase] Failed to check analytics consent:", error);
  }

  return false;
}

/**
 * Returns the Firebase Analytics instance.
 * Only available in browser environments.
 * Returns null in SSR/Node.js environments, when config is missing, or when user hasn't consented.
 * Dynamically imports Firebase Analytics to reduce initial bundle size.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null;

  // Check for user consent before initializing analytics
  if (!hasAnalyticsConsent()) {
    return null;
  }

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

// ─── Remote Config ────────────────────────────────────────────────────────────

/**
 * Default values for Remote Config feature flags.
 * These values are used when Remote Config cannot be fetched or is unavailable.
 *
 * Requirements: 10.1
 */
const REMOTE_CONFIG_DEFAULTS = {
  use_locale_specific_pdfs: true, // Enable locale-specific resume PDFs
  // Add more feature flags here as needed
};

/**
 * Returns the Firebase Remote Config instance.
 * Only available in browser environments.
 * Returns null in SSR/Node.js environments or when config is missing.
 * Dynamically imports Firebase Remote Config to reduce initial bundle size.
 *
 * Configuration:
 * - minimumFetchIntervalMillis: 1 hour (3600000ms) in production, 0 in development
 * - fetchTimeoutMillis: 60 seconds
 * - Default values: REMOTE_CONFIG_DEFAULTS
 *
 * Requirements: 10.1
 */
export async function getFirebaseRemoteConfig(): Promise<RemoteConfig | null> {
  // Remote Config is only available in browser environments
  if (typeof window === "undefined") return null;

  // Check if Firebase is properly configured
  if (!isFirebaseConfigured()) return null;

  // Return existing instance if already initialized
  if (remoteConfig) {
    return remoteConfig;
  }

  try {
    const firebaseApp = await getFirebaseApp();
    const { getRemoteConfig } = await import("firebase/remote-config");

    remoteConfig = getRemoteConfig(firebaseApp);

    // Configure Remote Config settings
    remoteConfig.settings = {
      minimumFetchIntervalMillis: process.env.NODE_ENV === "production" ? 3600000 : 0, // 1 hour in prod, 0 in dev
      fetchTimeoutMillis: 60000, // 60 seconds
    };

    // Set default values
    remoteConfig.defaultConfig = REMOTE_CONFIG_DEFAULTS;

    return remoteConfig;
  } catch (error) {
    console.warn("[Firebase] Remote Config initialization failed:", error);
    return null;
  }
}
