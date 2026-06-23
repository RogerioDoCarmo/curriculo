/**
 * Chromatic visual snapshots captured from real pages via the
 * `@chromatic-com/playwright` integration — complements the Storybook snapshots
 * with full-page visual regression on the actual rendered routes.
 *
 * Each test calls `takeSnapshot` to archive a specific state; the snapshot is
 * named after the test title. Local flow:
 *   1. `npm run test:e2e:chromatic`   -> runs this spec and writes page archives
 *   2. `npm run chromatic:playwright`  -> uploads the archives to Chromatic
 *
 * Notes:
 * - Scoped to the chromium project to keep the snapshot count (and cost) down.
 * - `prefers-reduced-motion` is emulated so the banks marquee is frozen and the
 *   snapshots stay deterministic.
 * - Cookie consent is pre-seeded in localStorage so snapshots show the page
 *   itself rather than the consent overlay.
 */

import { test, takeSnapshot } from "@chromatic-com/playwright";
import type { Page } from "@playwright/test";

const CHROMIUM_ONLY = "Chromatic snapshots run on chromium only";

/**
 * Dismiss the cookie banner (and optionally force a theme) before the app boots,
 * and freeze animations, so the captured archive is deterministic.
 */
async function seed(page: Page, theme?: "light" | "dark"): Promise<void> {
  await page.addInitScript((t) => {
    window.localStorage.setItem("cookie-consent", "accepted");
    if (t) window.localStorage.setItem("theme", t);
  }, theme);
  await page.emulateMedia({ reducedMotion: "reduce" });
}

/** Navigate to a locale home page and wait for the hero heading to render. */
async function gotoHome(page: Page, locale: "pt-BR" | "en"): Promise<void> {
  await page.goto(`/${locale}`);
  await page.getByRole("heading", { level: 1 }).first().waitFor();
}

test.describe("Chromatic page snapshots", () => {
  test("home page (pt-BR)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", CHROMIUM_ONLY);
    await seed(page);
    await gotoHome(page, "pt-BR");
    await takeSnapshot(page, testInfo);
  });

  test("home page (en)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", CHROMIUM_ONLY);
    await seed(page);
    await gotoHome(page, "en");
    await takeSnapshot(page, testInfo);
  });

  test("home page (pt-BR, dark)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", CHROMIUM_ONLY);
    await seed(page, "dark");
    await gotoHome(page, "pt-BR");
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await takeSnapshot(page, testInfo);
  });

  test("INCT featured image lightbox (en)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", CHROMIUM_ONLY);
    await seed(page);
    await gotoHome(page, "en");

    // Open the featured INCT card's first image in the fullscreen lightbox.
    await page
      .getByRole("button", { name: /view image in full screen/i })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await dialog.getByRole("img").first().waitFor();

    await takeSnapshot(page, testInfo);
  });
});
