/**
 * Datadog RUM (Real User Monitoring) initialization module.
 * Captures real-user Core Web Vitals, errors, and resource timing in the browser.
 * Uses a dynamic import so the SDK is only added to the bundle when actually started.
 *
 * Free-tier note: Session Replay is intentionally disabled (sessionReplaySampleRate: 0)
 * to stay within the free RUM session allowance — only metrics/errors are collected.
 *
 * Requirements: 10.1, 10.2
 */

import type { RumInitConfiguration } from "@datadog/browser-rum";

// ─── Datadog Config ─────────────────────────────────────────────────────────

const DATADOG_APPLICATION_ID = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
const DATADOG_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
// Datadog site (region). Defaults to US1; set to e.g. "datadoghq.eu" for EU.
const DATADOG_SITE = (process.env.NEXT_PUBLIC_DATADOG_SITE ??
  "datadoghq.com") as RumInitConfiguration["site"];
const DATADOG_SERVICE = process.env.NEXT_PUBLIC_DATADOG_SERVICE ?? "rogeriodocarmo-website";

/**
 * Fraction (0-100) of sessions to track. Lower this to stretch the free-tier
 * session quota on high-traffic days. Defaults to 100 (track every session).
 */
function getSessionSampleRate(): number {
  const raw = process.env.NEXT_PUBLIC_DATADOG_SAMPLE_RATE;
  if (!raw) return 100;
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) return parsed;
  return 100;
}

// ─── Init Guard ───────────────────────────────────────────────────────────────

let initialized = false;

/**
 * Check if user has given analytics consent.
 * Mirrors the opt-in logic used by the Firebase Analytics module so both
 * services react to the same cookie-consent state.
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
    console.warn("[Datadog] Failed to check analytics consent:", error);
  }

  return false;
}

/**
 * Checks whether Datadog RUM is properly configured via environment variables.
 */
export function isDatadogConfigured(): boolean {
  return Boolean(DATADOG_APPLICATION_ID && DATADOG_CLIENT_TOKEN);
}

/**
 * Initializes Datadog RUM in the browser.
 *
 * No-ops (returns false) in SSR, when the env vars are missing, when the user
 * has not consented to analytics, or when already initialized. Dynamically
 * imports the SDK so it stays out of the initial bundle until started.
 *
 * @returns whether RUM was started by this call.
 */
export async function initDatadogRum(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (initialized) return false;
  if (!isDatadogConfigured()) return false;
  if (!hasAnalyticsConsent()) return false;

  // Re-checked inside the guard above; narrow for the type system without `!`.
  if (!DATADOG_APPLICATION_ID || !DATADOG_CLIENT_TOKEN) return false;

  try {
    const { datadogRum } = await import("@datadog/browser-rum");

    datadogRum.init({
      applicationId: DATADOG_APPLICATION_ID,
      clientToken: DATADOG_CLIENT_TOKEN,
      site: DATADOG_SITE,
      service: DATADOG_SERVICE,
      env: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      sessionSampleRate: getSessionSampleRate(),
      // Session Replay is a separate, quota-heavy product — keep it off for free tier.
      sessionReplaySampleRate: 0,
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: true,
      // Mask user input by default to avoid collecting PII from forms.
      defaultPrivacyLevel: "mask-user-input",
    });

    initialized = true;
    return true;
  } catch (error) {
    console.warn("[Datadog] RUM initialization failed:", error);
    return false;
  }
}
