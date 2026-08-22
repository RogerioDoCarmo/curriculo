/**
 * E2E Test: "The World" cinematic filter pulse
 *
 * Effect-specific coverage for the default cinematic effect — the parts that
 * a simple single-filter effect doesn't have: expanding glow rings, the SVG
 * ripple filter, and the multi-beat colour grade staged in CSS @keyframes.
 *
 * Generic pulse behaviour (button presence, disable guard, no navigation,
 * mobile sidebar) lives in filter-pulse.spec.ts.
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const pulseButton = (page: Page) => page.getByRole("button", { name: /^trigger /i });

/** Computed backdrop-filter on the overlay (empty string when unset). */
async function backdropFilter(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    if (!el) return "";
    const cs = getComputedStyle(el);
    return cs.backdropFilter || cs.getPropertyValue("-webkit-backdrop-filter") || "";
  });
}

/** Computed background-color of the overlay — the tint layer that carries the colour. */
async function tint(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    return el ? getComputedStyle(el).backgroundColor : "";
  });
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

  test("renders both glow rings and the ripple filter while running, and cleans them up", async ({
    page,
  }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);

    // Nothing before the trigger.
    expect(await page.locator("[data-testid='pulse-ring']").count()).toBe(0);

    await pulseButton(page).click();

    await expect(page.locator("[data-testid='pulse-ring']")).toHaveCount(2);
    await expect(page.locator("[data-testid='time-stop-filter']")).toBeAttached();

    // Back to nothing once the pulse finishes.
    await expect(page.locator("[data-testid='pulse-ring']")).toHaveCount(0, { timeout: 12_000 });
  });

  test("runs the staged grade — the backdrop-filter actually changes between beats", async ({
    page,
  }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    // Sampled mid-sequence. If the keyframe function lists didn't match,
    // backdrop-filter would snap between discrete values rather than
    // interpolate, and these samples would be identical.
    await page.waitForTimeout(700);
    const early = await backdropFilter(page);
    await page.waitForTimeout(1200);
    const later = await backdropFilter(page);

    expect(early).not.toBe("");
    expect(later).not.toBe("");
    expect(early).not.toBe(later);
  });

  test("settles into a dark tinted 'stopped time' state and then releases", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    // The tint layer is what carries the colour (a filter chain alone cannot
    // add colour to a near-white page). By the held beat it must be a
    // visible, non-transparent wash.
    await expect
      .poll(
        async () => {
          const c = await tint(page);
          const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
          if (!m) return 0;
          return parseFloat(m[4] ?? "1");
        },
        { timeout: 8000 }
      )
      .toBeGreaterThan(0.3);

    // ...and it clears again once the pulse ends.
    await expect
      .poll(
        async () => {
          const c = await tint(page);
          return c === "rgba(0, 0, 0, 0)" || c === "transparent";
        },
        { timeout: 12_000 }
      )
      .toBe(true);
  });

  test("skips rings, ripple and grade entirely under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/en`);

    await pulseButton(page).click();

    expect(await page.locator("[data-testid='pulse-ring']").count()).toBe(0);
    expect(await page.locator("[data-testid='cinematic-layers']").count()).toBe(0);

    // The reduced-motion branch applies the settled grade as a plain fade.
    const overlay = page.locator(".filter-pulse-overlay--reduced-motion");
    await expect(overlay).toBeAttached();
  });
});
