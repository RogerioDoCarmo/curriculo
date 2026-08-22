/**
 * E2E Test: Filter Pulse (behaviour common to every registered effect)
 *
 * Covers the navbar button that plays a one-shot circular filter-pulse
 * animation (see lib/filterPulses.ts, hooks/useFilterPulse.tsx,
 * components/FilterPulseButton, components/FilterPulseOverlay):
 *
 * 1. The button is present in the compact controls row on every viewport
 *    (that row is not hidden on mobile — only the nav links are).
 * 2. Clicking it grows a circular overlay to full viewport coverage, then
 *    shrinks it back — a real animation, not a mock.
 * 3. The button disables itself for the duration of the pulse and
 *    re-enables once it's back to idle (the re-trigger guard).
 * 4. It never causes a page navigation.
 * 5. It's present after client-side navigation to another section.
 * 6. Reduced motion still plays the effect, without the spatial growth.
 * 7. Triggering it from inside the mobile sidebar closes the sidebar (the
 *    sidebar is a native <dialog>, promoted to the browser's top layer,
 *    which would otherwise visually hide the fixed overlay underneath it).
 *
 * Effect-specific assertions for the cinematic default live in
 * the-world-pulse.spec.ts.
 *
 * The button is matched on /^trigger /i rather than a specific effect name so
 * these stay valid when DEFAULT_FILTER_PULSE_ID changes.
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";
import { acceptPulseWarningBeforeLoad } from "./helpers/filterPulseConsent";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/** The default effect ("The World") runs for 6s; allow margin on slow runners. */
const FULL_CYCLE_TIMEOUT = 12_000;

/** Reads the current radius (in px) from the overlay's clip-path, or 0 if not set/closed. */
async function getOverlayRadius(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    if (!el) return 0;
    const match = getComputedStyle(el).clipPath.match(/circle\(([\d.]+)px/);
    return match ? parseFloat(match[1]) : 0;
  });
}

const pulseButton = (page: Page) => page.getByRole("button", { name: /^trigger /i });

test.beforeEach(async ({ context, page }) => {
  await setCookieConsentBeforeLoad(context);
  // These specs exercise the pulse itself; the photosensitivity warning that
  // normally gates it has its own coverage in the-world-pulse.spec.ts.
  await acceptPulseWarningBeforeLoad(context);
  // Vercel Speed Insights / Web Analytics 404 off-Vercel; stub to avoid noise.
  await page.route(/\/_vercel\/(insights|speed-insights)\//, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
});

test.describe("Filter Pulse button", () => {
  test("is present in the navbar", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await expect(pulseButton(page)).toBeVisible();
  });

  test("grows the overlay to full coverage then shrinks it back on click", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);

    // expect.poll retries the callback until the assertion holds (or times
    // out), instead of comparing two fixed-instant samples -- point-in-time
    // sampling (waitForTimeout(N) then read once) is inherently prone to two
    // close checkpoints landing on the same simulated frame under CI/runner
    // contention, producing a coincidental tie rather than a real failure.
    const startRadius = await getOverlayRadius(page);
    await pulseButton(page).click();

    // Grows: radius moves well past its starting value.
    await expect
      .poll(() => getOverlayRadius(page), { timeout: 5000 })
      .toBeGreaterThan(startRadius + 100);

    // Reaches (and holds at) a large, viewport-covering radius.
    await expect.poll(() => getOverlayRadius(page), { timeout: 5000 }).toBeGreaterThan(400);

    // Shrinks back down to (near) zero once the full cycle completes.
    await expect
      .poll(() => getOverlayRadius(page), { timeout: FULL_CYCLE_TIMEOUT })
      .toBeLessThan(200);
  });

  test("disables itself during the pulse and re-enables once idle", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    const button = pulseButton(page);

    await button.click();
    await expect(button).toBeDisabled();
    await expect(button).toBeEnabled({ timeout: FULL_CYCLE_TIMEOUT });
  });

  test("does not trigger a page navigation", async ({ page }) => {
    // Compares the URL before/after rather than listening for a
    // "framenavigated" event: that event fires for reasons unrelated to this
    // button on some engines (observed on Firefox/WebKit), which is why
    // theme-switching.spec.ts's use of the same pattern is skipped entirely.
    await page.goto(`${BASE_URL}/en`);
    const urlBefore = page.url();

    await pulseButton(page).click();
    await page.waitForTimeout(200);

    expect(page.url()).toBe(urlBefore);
  });

  test("is still present after navigating to another section", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await expect(pulseButton(page)).toBeVisible();

    await page
      .getByRole("link", { name: /projects/i })
      .first()
      .click();
    await page.waitForTimeout(200);

    await expect(pulseButton(page)).toBeVisible();
  });

  test("still plays under reduced motion, without spatial growth", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/en`);

    const button = pulseButton(page);
    await button.click();

    const state = await page.evaluate(() => {
      const el = document.querySelector(".filter-pulse-overlay--reduced-motion") as HTMLElement;
      return el ? { opacity: getComputedStyle(el).opacity } : null;
    });
    expect(state).not.toBeNull();

    // No cinematic layers under reduced motion, whichever effect is default.
    expect(await page.locator("[data-testid='pulse-ring']").count()).toBe(0);

    // Reduced-motion cycle is ~1.2s; generous margin for slower CI runners.
    await expect(button).toBeEnabled({ timeout: 8000 });
  });
});

test.describe("Filter Pulse button — mobile sidebar", () => {
  test.skip(({ isMobile }) => !isMobile, "the hamburger sidebar only exists on mobile viewports");

  test("closes the sidebar and still plays the pulse when triggered from inside it", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/en`);

    const hamburger = page.getByRole("button", { name: /open menu|toggle menu|menu/i });
    await hamburger.click();

    const dialog = page.getByRole("dialog", { name: /navigation|menu/i });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: /^trigger /i }).click();

    // The dialog's top-layer promotion would otherwise hide the fixed
    // overlay beneath it — the sidebar must close as part of the trigger.
    await expect(dialog).not.toBeVisible();

    await expect.poll(() => getOverlayRadius(page), { timeout: 5000 }).toBeGreaterThan(0);
  });
});
