/**
 * E2E Test: Offline Detector
 *
 * @rogeriodocarmo/offline-detector-web shows a "No internet" snackbar (with a
 * Retry action) when the real network is unreachable, and clears it with a
 * brief "Back online" message on recovery. These tests verify, per locale:
 *
 * 1. Nothing shows while online
 * 2. The snackbar and Retry label appear once offline
 * 3. Dismiss hides the snackbar
 * 4. No axe violations while the snackbar is showing
 *
 * context.setOffline(true) alone doesn't always fire the browser's `offline`
 * event on WebKit and Firefox, so it's paired with a manual dispatch.
 */

import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

const OFFLINE_STRINGS: Record<string, { offline: string; retry: string; dismiss: string }> = {
  en: { offline: "No internet", retry: "Retry", dismiss: "Dismiss" },
  "pt-BR": { offline: "Sem internet", retry: "Tentar novamente", dismiss: "Fechar" },
  es: { offline: "Sin internet", retry: "Reintentar", dismiss: "Cerrar" },
};

// The library probes cp.cloudflare.com, then falls back to www.gstatic.com,
// each with a 5s default timeout — so concluding "offline" can take ~10s
// after context.setOffline(true) actually cuts the network.
const OFFLINE_DETECTION_TIMEOUT = 15000;

async function goOffline(page: Page) {
  await page.context().setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
}

async function goOnline(page: Page) {
  await page.context().setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
}

/**
 * The snackbar, scoped by its own `.od-snackbar` class rather than by role.
 * The banner piece *also* renders `role="status"` with the same offline
 * text and its own Dismiss button (both pieces are on by default), so a
 * bare `getByRole("status")` matches both and dismissing one leaves the
 * other — this is what the library actually ships, not a test shortcut.
 */
function getSnackbar(page: Page, offlineText: string) {
  return page.locator(".od-snackbar").filter({ hasText: offlineText });
}

test.describe("Offline detector", () => {
  test.beforeEach(async ({ context }) => {
    await setCookieConsentBeforeLoad(context);
  });

  for (const [locale, strings] of Object.entries(OFFLINE_STRINGS)) {
    test(`shows the offline snackbar in ${locale} and clears it on reconnect`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      // Nothing shows at launch.
      await expect(page.getByText(strings.offline)).toHaveCount(0);

      await goOffline(page);

      const snackbar = getSnackbar(page, strings.offline);
      await expect(snackbar).toBeVisible({ timeout: OFFLINE_DETECTION_TIMEOUT });
      await expect(snackbar.getByRole("button", { name: strings.retry })).toBeVisible();

      await goOnline(page);
      await expect(snackbar).not.toBeVisible({ timeout: OFFLINE_DETECTION_TIMEOUT });
    });

    test(`dismissing the snackbar hides it in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await goOffline(page);

      const snackbar = getSnackbar(page, strings.offline);
      await expect(snackbar).toBeVisible({ timeout: OFFLINE_DETECTION_TIMEOUT });

      await snackbar.getByRole("button", { name: strings.dismiss }).click();
      await expect(snackbar).not.toBeVisible();
    });

    test(`has no axe violations while offline in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await goOffline(page);

      const snackbar = getSnackbar(page, strings.offline);
      await expect(snackbar).toBeVisible({ timeout: OFFLINE_DETECTION_TIMEOUT });

      // Let the entrance transition finish — a mid-animation color can fail a
      // contrast check that would pass once the snackbar is at rest.
      await page.waitForTimeout(500);

      // Scoped to the snackbar itself (not the whole document): this site has
      // a pre-existing, unrelated hydration crash (confirmed to reproduce with
      // no offline-detector code involved at all, and even while staying fully
      // online — see the PR/report) that can wipe the page's <main>/<h1> and
      // would otherwise fail this on an axe rule the widget has no part in.
      const results = await new AxeBuilder({ page }).include(".od-snackbar").analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
