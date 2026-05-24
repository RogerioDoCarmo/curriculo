/**
 * Helper function to dismiss the cookie consent banner in E2E tests.
 *
 * The cookie consent banner appears on first visit and blocks interactions
 * with other page elements. This helper dismisses it before running tests.
 *
 * Usage:
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *   await page.goto("/en");
 *   await dismissCookieBanner(page);
 * });
 * ```
 */

import { Page } from "@playwright/test";

/**
 * Dismisses the cookie consent banner if it's visible.
 *
 * @param page - Playwright page object
 * @param action - Action to take: "accept" (default), "reject", or "skip" (if banner not present)
 */
export async function dismissCookieBanner(
  page: Page,
  action: "accept" | "reject" = "accept"
): Promise<void> {
  try {
    // Wait for the banner to appear (with a short timeout)
    const banner = page.locator('div[role="dialog"][aria-modal="true"]');

    // Check if banner is visible
    const isVisible = await banner.isVisible({ timeout: 2000 }).catch(() => false);

    if (!isVisible) {
      // Banner not present, nothing to do
      return;
    }

    // Click the appropriate button based on action
    if (action === "accept") {
      // Look for "Accept all" button with flexible text matching
      const acceptButton = banner.locator("button", {
        hasText: /accept.*all|aceitar.*tudo|aceptar.*todo/i,
      });
      await acceptButton.click({ timeout: 5000 });
    } else {
      // Look for "Reject" button with flexible text matching
      const rejectButton = banner.locator("button", {
        hasText: /reject|rejeitar|rechazar/i,
      });
      await rejectButton.click({ timeout: 5000 });
    }

    // Wait for banner to disappear
    await banner.waitFor({ state: "hidden", timeout: 3000 });
  } catch (error) {
    // If banner dismissal fails, log but don't fail the test
    // The banner might not be present or already dismissed
    console.log(`[dismissCookieBanner] Banner not found or already dismissed: ${error}`);
  }
}

/**
 * Sets cookie consent preferences directly via localStorage.
 * This is faster than clicking through the UI and useful for tests
 * that don't specifically test the cookie banner.
 *
 * @param page - Playwright page object
 * @param preferences - Cookie preferences to set
 */
export async function setCookieConsent(
  page: Page,
  preferences: {
    analytics?: boolean;
    functional?: boolean;
  } = { analytics: true, functional: true }
): Promise<void> {
  await page.evaluate((prefs) => {
    localStorage.setItem("cookie-consent", "customized");
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        analytics: prefs.analytics ?? true,
        functional: prefs.functional ?? true,
      })
    );
  }, preferences);
}

/**
 * Sets cookie consent preferences via context init script.
 * This sets localStorage BEFORE any page loads, preventing the banner from ever appearing.
 * Use this in test.beforeEach or test.beforeAll for better performance.
 *
 * @param context - Playwright browser context
 * @param preferences - Cookie preferences to set
 */
export async function setCookieConsentBeforeLoad(
  context: any,
  preferences: {
    analytics?: boolean;
    functional?: boolean;
  } = { analytics: true, functional: true }
): Promise<void> {
  await context.addInitScript((prefs: any) => {
    localStorage.setItem("cookie-consent", "customized");
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({
        analytics: prefs.analytics ?? true,
        functional: prefs.functional ?? true,
      })
    );
  }, preferences);
}
