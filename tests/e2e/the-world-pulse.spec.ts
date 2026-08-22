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
import { acceptPulseWarningBeforeLoad } from "./helpers/filterPulseConsent";
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
  // These exercise the pulse itself, so the photosensitivity warning that
  // normally gates it is pre-acknowledged; the warning has its own describe
  // below, which deliberately does not seed it.
  test.beforeEach(async ({ context }) => {
    await acceptPulseWarningBeforeLoad(context);
  });

  test("is the effect the navbar button triggers", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await expect(pulseButton(page)).toHaveAttribute("aria-label", /the world/i);
  });

  test("stays completely inert until triggered — it must not play on page load", async ({
    page,
  }) => {
    // Regression guard. The grade layers are always mounted, and the
    // animations were originally declared on their base classes, so they
    // started the moment those layers hit the DOM: the effect played itself
    // once on load and then never again, because re-adding a class does not
    // restart an animation whose name never changed. Clicking appeared to do
    // nothing. Waiting out a full pulse before asserting is the point of this
    // test -- sampling immediately after load would have caught the tail of
    // that stray animation and passed.
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).waitFor({ state: "visible" });
    await page.waitForTimeout(5000);

    const idle = await page.evaluate(() =>
      ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"].map((id) => {
        const el = document.querySelector(`[data-testid='${id}']`);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { anim: cs.animationName, bg: cs.backgroundColor };
      })
    );
    for (const layer of idle) {
      expect(layer).not.toBeNull();
      expect(layer?.anim).toBe("none");
      expect(alphaOf(layer?.bg ?? "")).toBe(0);
    }

    // ...and it does start once actually triggered.
    await pulseButton(page).click();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            getComputedStyle(document.querySelector("[data-testid='fp-layer-color']") as Element)
              .animationName
        )
      )
      .not.toBe("none");
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

    // Polled, not read once: trigger() deliberately waits two animation
    // frames before moving off "idle" (so the clip-path origin commits before
    // the radius starts growing -- see useFilterPulse), so the active class
    // is not on the DOM the instant the click resolves. Polling in a single
    // evaluate also keeps this cheap enough to catch the class well inside
    // the pulse window under parallel load.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const cls = (id: string) =>
              document.querySelector(`[data-testid='${id}']`)?.className ?? "";
            const graded = ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"].every((id) =>
              cls(id).includes("fp-grade")
            );
            return cls("cinematic-layers").includes("fp-rings--active") && graded;
          }),
        { timeout: 3000 }
      )
      .toBe(true);

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

    // Collects distinct colours across the pulse rather than comparing two
    // fixed instants: the sequence is only a couple of seconds long, so under
    // parallel load two fixed samples can land close enough together to read
    // as unchanged even though the animation is running fine.
    const seenColor = new Set<string>();
    const seenInvert = new Set<string>();
    for (let i = 0; i < 16; i++) {
      seenColor.add(await layerColor(page, "fp-layer-color"));
      seenInvert.add(await layerColor(page, "fp-layer-invert"));
      await page.waitForTimeout(110);
    }

    // If the keyframes weren't animating, each set would hold a single value.
    expect(seenColor.size).toBeGreaterThan(2);
    expect(seenInvert.size).toBeGreaterThan(2);
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

/**
 * The warning itself, which the specs above deliberately pre-acknowledge.
 * These do NOT seed consent, so they see the real first-visit flow.
 */
test.describe("The World pulse — photosensitivity warning", () => {
  test("asks before playing anything on a first visit", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    const dialog = page.getByTestId("filter-pulse-warning");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("role", "alertdialog");

    // Nothing has started: the visitor has not agreed yet.
    expect(await page.locator(".fp-grade").count()).toBe(0);
  });

  test("plays nothing when cancelled, and asks again next time", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    const dialog = page.getByTestId("filter-pulse-warning");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /cancel|cancelar/i }).click();
    await expect(dialog).not.toBeVisible();
    expect(await page.locator(".fp-grade").count()).toBe(0);

    // Declining stores nothing, so a mis-click does not lock the effect away.
    await pulseButton(page).click();
    await expect(dialog).toBeVisible();
  });

  test("plays the effect on continue, and stops asking afterwards", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    const dialog = page.getByTestId("filter-pulse-warning");
    await dialog.getByRole("button", { name: /play the effect|reproduc/i }).click();
    await expect(dialog).not.toBeVisible();

    // The pulse actually runs.
    await expect
      .poll(() => page.locator(".fp-grade").count(), { timeout: 5000 })
      .toBeGreaterThan(0);
    await expect(pulseButton(page)).toBeEnabled({ timeout: 12_000 });

    // Second time around it goes straight to the effect.
    await pulseButton(page).click();
    await expect(dialog).not.toBeVisible();
    await expect
      .poll(() => page.locator(".fp-grade").count(), { timeout: 5000 })
      .toBeGreaterThan(0);
  });

  test("is dismissible with ESC without playing", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await pulseButton(page).click();

    const dialog = page.getByTestId("filter-pulse-warning");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(dialog).not.toBeVisible();
    expect(await page.locator(".fp-grade").count()).toBe(0);
  });
});
