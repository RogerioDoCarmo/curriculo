/**
 * E2E Test: "The World" cinematic filter pulse
 *
 * Effect-specific coverage for the default cinematic effect — the parts a
 * simple single-filter effect doesn't have: expanding glow rings and the
 * multi-beat colour grade built from blended layers.
 *
 * Generic pulse behaviour (button presence, disable guard, no navigation,
 * mobile sidebar) lives in filter-pulse.spec.ts.
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";
import { FilterPulseId, getFilterPulse } from "@/lib/filterPulses";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SPEC = getFilterPulse(FilterPulseId.TheWorld).cinematic;

const pulseButton = (page: Page) => page.getByRole("button", { name: /^trigger /i });

/** Computed background-color of one blended grade layer. */
async function layerColor(page: Page, testid: string): Promise<string> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid='${id}']`);
    return el ? getComputedStyle(el).backgroundColor : "";
  }, testid);
}

/** Alpha of a computed rgb/rgba string (1 when opaque, 0 when absent). */
function alphaOf(color: string): number {
  const m = color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  return m ? parseFloat(m[4] ?? "1") : 0;
}

test.beforeEach(async ({ context, page }) => {
  await setCookieConsentBeforeLoad(context);
  await page.route(/\/_vercel\/(insights|speed-insights)\//, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
});

test.describe("The World pulse", () => {
  test("is the effect the navbar button triggers", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await expect(pulseButton(page)).toHaveAttribute("aria-label", /the world/i);
  });

  test("activates the grade layers and rings for the pulse, then goes quiet", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);

    // The layers are always mounted -- the clip-path transition needs a
    // previous value to animate from -- so what changes is the active class
    // and the clip radius, not their presence.
    const rings = page.locator("[data-testid='cinematic-layers']");
    await expect(rings).toHaveCount(1);
    await expect(rings).not.toHaveClass(/fp-rings--active/);
    await expect(page.locator("[data-testid='pulse-ring']")).toHaveCount(SPEC?.rings ?? 2);

    await pulseButton(page).click();

    await expect(rings).toHaveClass(/fp-rings--active/);
    for (const id of ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"]) {
      await expect(page.locator(`[data-testid='${id}']`)).toHaveClass(/fp-grade/);
    }

    // Back to quiet once the pulse finishes: no active class, clip closed.
    await expect(rings).not.toHaveClass(/fp-rings--active/, { timeout: 12_000 });
    await expect
      .poll(() =>
        page.evaluate(() => {
          const el = document.querySelector(".filter-pulse-overlay");
          const m = el && getComputedStyle(el).clipPath.match(/circle\(([\d.]+)px/);
          return m ? parseFloat(m[1]) : 0;
        })
      )
      .toBeLessThan(50);
  });

  test("grades through distinct beats — the layer colours actually change", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    await page.waitForTimeout(350);
    const earlyColor = await layerColor(page, "fp-layer-color");
    const earlyInvert = await layerColor(page, "fp-layer-invert");

    await page.waitForTimeout(750);
    const laterColor = await layerColor(page, "fp-layer-color");
    const laterInvert = await layerColor(page, "fp-layer-invert");

    // If the keyframes weren't animating, these samples would be identical.
    expect(earlyColor).not.toBe(laterColor);
    expect(earlyInvert).not.toBe(laterInvert);
  });

  test("settles into a dark tinted 'stopped time' state and then releases", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    // The luminance layer carries the dark wash of the held beat.
    await expect
      .poll(async () => alphaOf(await layerColor(page, "fp-layer-lum")), { timeout: 8000 })
      .toBeGreaterThan(0.3);

    // ...and the wash clears once the pulse ends.
    await expect
      .poll(async () => alphaOf(await layerColor(page, "fp-layer-lum")), { timeout: 12_000 })
      .toBeLessThan(0.05);
  });

  test("opts into the ripple only when the registry enables it", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();
    await expect(page.locator("[data-testid='cinematic-layers']")).toHaveCount(1);

    const rippled = await page
      .locator("[data-testid='cinematic-layers'].fp-rings--rippled")
      .count();
    expect(rippled).toBe(SPEC?.distortion ? 1 : 0);
  });

  test("skips rings and grade layers entirely under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/en`);

    await pulseButton(page).click();

    // Reduced motion takes a different branch entirely: a single faded
    // overlay, with none of the cinematic structure mounted at all.
    expect(await page.locator("[data-testid='pulse-ring']").count()).toBe(0);
    expect(await page.locator("[data-testid='cinematic-layers']").count()).toBe(0);
    expect(await page.locator("[data-testid='fp-layer-invert']").count()).toBe(0);

    await expect(page.locator(".filter-pulse-overlay--reduced-motion")).toBeAttached();
  });
});
