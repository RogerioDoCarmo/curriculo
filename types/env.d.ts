/**
 * Type definitions for environment variables.
 * Provides type safety when accessing process.env throughout the application.
 *
 * NEXT_PUBLIC_* variables are available in the browser (client-side).
 * Other variables are only available at build time or in server-side code.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // ── Firebase Configuration (public - safe to expose in browser) ──────────
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: string;

    // ── Sentry Configuration (public) ────────────────────────────────────────
    NEXT_PUBLIC_SENTRY_DSN: string;

    // ── Formspree Configuration (public) ─────────────────────────────────────
    NEXT_PUBLIC_FORMSPREE_FORM_ID: string;

    // ── Firebase Admin SDK (private - CI/CD only, never in browser) ──────────
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_PRIVATE_KEY?: string;

    // ── SonarQube Configuration (private - CI/CD only) ────────────────────────
    SONAR_TOKEN?: string;
    SONAR_HOST_URL?: string;

    // ── Vercel Deployment (private - CI/CD only) ──────────────────────────────
    VERCEL_TOKEN?: string;
    VERCEL_ORG_ID?: string;
    VERCEL_PROJECT_ID?: string;

    // ── Node.js built-ins ────────────────────────────────────────────────────
    NODE_ENV: "development" | "production" | "test";
  }
}
