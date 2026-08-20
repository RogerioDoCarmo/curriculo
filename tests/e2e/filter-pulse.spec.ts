/**
 * E2E Test: Filter Pulse
 *
 * Covers the navbar button that plays a one-shot circular filter-pulse
 * animation (see lib/filterPulses.ts, hooks/useFilterPulse.tsx,
 * components/FilterPulseButton, components/FilterPulseOverlay):
 *
 * 1. The button is present in the compact controls row on every viewport
 *    (that row is not hidden on mobile — only the nav links are).
 * 2. Clicking it grows a circular backdrop-filter overlay to full viewport
 *    coverage, then shrinks it back — a real animation, not a mock.
 * 3. The button disables itself for the duration of the pulse and
 *    re-enables once it's back to idle (the re-trigger guard).
 * 4. It never causes a page navigation.
 * 5. It's present after client-side navigation to another section.
 * 6. Reduced motion still plays the effect, without the spatial growth.
 * 7. Triggering it from inside the mobile sidebar closes the sidebar (the
 *    sidebar is a native <dialog>, promoted to the browser's top layer,
 *    which would otherwise visually hide the fixed overlay underneath it).
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/** Reads the current radius (in px) from the overlay's clip-path, or 0 if not set/closed. */
async function getOverlayRadius(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    if (!el) return 0;
    const match = getComputedStyle(el).clipPath.match(/circle\(([\d.]+)px/);
    return match ? parseFloat(match[1]) : 0;
  });
}

test.beforeEach(async ({ context, page }) => {
  await setCookieConsentBeforeLoad(context);
  // Vercel Speed Insights / Web Analytics 404 off-Vercel; stub to avoid noise.
  await page.route(/\/_vercel\/(insights|speed-insights)\//, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
});

test.describe("Filter Pulse button", () => {
  test("is present in the navbar", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    const button = page.getByRole("button", { name: /pulse effect/i });
    await expect(button).toBeVisible();
  });

  test("grows the overlay to full coverage then shrinks it back on click", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    const button = page.getByRole("button", { name: /pulse effect/i });

    // Phase timeline (see hooks/useFilterPulse.tsx DURATIONS.full): expanding
    // 0-1200ms, holding 1200-1900ms, contracting 1900-3100ms. Checkpoints are
    // anchored to elapsed time since the click, not chained relative waits,
    // so per-call overhead can't drift a sample across a phase boundary.
    const clickTime = Date.now();
    await button.click();

    async function radiusAt(targetMs: number): Promise<number> {
      const wait = targetMs - (Date.now() - clickTime);
      if (wait > 0) await page.waitForTimeout(wait);
      return getOverlayRadius(page);
    }

    const early = await radiusAt(300);
    const grown = await radiusAt(900);
    expect(grown).toBeGreaterThan(early);

    // Well inside the holding window (1200-1900ms) — should be at/near max.
    const atFullCoverage = await radiusAt(1700);
    expect(atFullCoverage).toBeGreaterThan(400);

    // Past the full ~3.1s cycle — back to (near) zero. Generous margin for
    // slower CI runners: the assertion only needs "substantially closed, not
    // still near max", not "closed at exactly the theoretical millisecond".
    const final = await radiusAt(4200);
    expect(final).toBeLessThan(200);
  });

  test("applies the negative (invert) filter at full coverage", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    const button = page.getByRole("button", { name: /pulse effect/i });
    await button.click();
    await page.waitForTimeout(1500); // into the holding phase

    const backdropFilter = await page.evaluate(() => {
      const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
      return el ? getComputedStyle(el).backdropFilter : "";
    });
    expect(backdropFilter).toContain("invert");
  });

  test("disables itself during the pulse and re-enables once idle", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    const button = page.getByRole("button", { name: /pulse effect/i });

    await button.click();
    await expect(button).toBeDisabled();

    // Full cycle is ~3.1s; generous margin for slower CI runners.
    await expect(button).toBeEnabled({ timeout: 6000 });
  });

  test("does not trigger a page navigation", async ({ page }) => {
    // Compares the URL before/after rather than listening for a
    // "framenavigated" event: that event fires for reasons unrelated to this
    // button on some engines (observed on Firefox/WebKit), which is why
    // theme-switching.spec.ts's use of the same pattern is skipped entirely.
    await page.goto(`${BASE_URL}/en`);
    const urlBefore = page.url();

    const button = page.getByRole("button", { name: /pulse effect/i });
    await button.click();
    await page.waitForTimeout(200);

    expect(page.url()).toBe(urlBefore);
  });

  test("is still present after navigating to another section", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    const button = page.getByRole("button", { name: /pulse effect/i });
    await expect(button).toBeVisible();

    await page
      .getByRole("link", { name: /projects/i })
      .first()
      .click();
    await page.waitForTimeout(200);

    await expect(button).toBeVisible();
  });

  test("still plays under reduced motion, without spatial growth", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/en`);

    const button = page.getByRole("button", { name: /pulse effect/i });
    await button.click();

    const opacity = await page.evaluate(() => {
      const el = document.querySelector(
        ".filter-pulse-overlay--reduced-motion"
      ) as HTMLElement | null;
      return el ? getComputedStyle(el).opacity : null;
    });
    expect(opacity).not.toBeNull();

    // Reduced-motion cycle is ~1.2s; generous margin for slower CI runners.
    await expect(button).toBeEnabled({ timeout: 6000 });
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

    const sidebarButton = dialog.getByRole("button", { name: /pulse effect/i });
    await sidebarButton.click();

    // The dialog's top-layer promotion would otherwise hide the fixed
    // overlay beneath it — the sidebar must close as part of the trigger.
    await expect(dialog).not.toBeVisible();

    await page.waitForTimeout(900);
    const radius = await getOverlayRadius(page);
    expect(radius).toBeGreaterThan(0);
  });
});
