/**
 * Helpers for the photosensitivity warning that gates the cinematic filter
 * pulse (see lib/filterPulseConsent).
 */

import type { BrowserContext } from "@playwright/test";

const CONSENT_STORAGE_KEY = "filter-pulse-photosensitivity-consent";

/**
 * Pre-acknowledges the photosensitivity warning before any page loads, so
 * tests that are exercising the pulse itself are not blocked by the dialog.
 *
 * Set via an init script rather than after navigation so the very first render
 * already sees it — the same approach setCookieConsentBeforeLoad uses.
 */
export async function acceptPulseWarningBeforeLoad(context: BrowserContext): Promise<void> {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "acknowledged");
    } catch {
      // Ignore — the test will simply see the dialog.
    }
  }, CONSENT_STORAGE_KEY);
}
