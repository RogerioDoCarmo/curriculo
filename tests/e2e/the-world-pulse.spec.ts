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

declare global {
  interface Window {
    __pulseRecording?: {
      lum: string[];
      color: string[];
      invert: string[];
      maxLumAlpha: number;
      lastLumAlpha: number;
    };
  }
}
const SPEC = getFilterPulse(FilterPulseId.TheWorld).cinematic;

const pulseButton = (page: Page) => page.getByRole("button", { name: /^trigger /i });

/**
 * Reads a grade layer's computed colour at an exact point in its keyframe
 * animation, by applying the grade class, pausing the resulting animation and
 * seeking to that point.
 *
 * This deliberately does NOT trigger a pulse. Sampling a live pulse cannot be
 * made reliable: the sequence is only ~2.4s, and every approach tried raced
 * it. A page.evaluate per sample costs a round-trip each and overran the pulse
 * on slow runners; sampling in-page on requestAnimationFrame failed
 * differently because headless CI throttles rAF hard (two samples for a whole
 * pulse, peak alpha 0.267 instead of 0.55, final sample still mid-animation);
 * and seeking the live animation still lost, because when the pulse ends the
 * component removes the grade class and the animation disappears mid-test.
 *
 * What these two tests are actually about is what the keyframes resolve to,
 * which is a property of the CSS and needs no pulse to observe. Driving it
 * directly makes them exact and timing-free, and returns byte-identical
 * values on Chromium, Firefox and WebKit.
 *
 * The live integration — that a click applies these classes, runs the
 * animation and cleans up afterwards — is covered by "stays completely inert
 * until triggered" and "activates the grade layers and rings", both of which
 * assert on state that persists rather than on a moving value.
 */
async function gradeAt(page: Page, testId: string, progress: number): Promise<string> {
  return page.evaluate(
    ({ testId, progress }) => {
      const el = document.querySelector(`[data-testid='${testId}']`);
      if (!el) return "";
      // Only .fp-grade, without an intensity modifier: the keyframes fall back
      // to the same alphas .fp-grade--full sets, so this matches what ships
      // while staying independent of the FLASH_INTENSITY setting.
      el.classList.add("fp-grade");
      const named = (a: Animation): string =>
        "animationName" in a ? String((a as CSSAnimation).animationName) : "";
      // getAnimations() also returns the overlay's clip-path transition, so
      // pick the keyframe animation by name rather than by index.
      const anim = el.getAnimations().find((a) => named(a).startsWith("fp-"));
      if (!anim) return "";
      const duration = anim.effect?.getTiming().duration;
      if (typeof duration !== "number") return "";
      anim.pause();
      anim.currentTime = duration * progress;
      return getComputedStyle(el).backgroundColor;
    },
    { testId, progress }
  );
}

/** Alpha channel of a computed colour, 0 when fully transparent or unset. */
function alphaOfComputed(color: string): number {
  const match = /rgba?\(([^)]+)\)/.exec(color);
  if (!match) return 0;
  const parts = match[1].split(",").map((v) => parseFloat(v));
  return parts.length > 3 ? parts[3] : 1;
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
      expect(alphaOfComputed(layer?.bg ?? "")).toBe(0);
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
    await page.goto(`${BASE_URL}/en`);

    // One sample per beat of the sequence.
    const beats = [0, 0.05, 0.18, 0.33, 0.43, 0.55];
    for (const layer of ["fp-layer-color", "fp-layer-invert", "fp-layer-lum"]) {
      const colors: string[] = [];
      for (const at of beats) colors.push(await gradeAt(page, layer, at));
      // Every beat resolved to something, and they are not all the same value.
      expect(colors.every((c) => c !== "")).toBe(true);
      expect(new Set(colors).size).toBeGreaterThan(2);
    }
  });

  test("settles into a dark tinted 'stopped time' state and then releases", async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);

    // The held beat (46%-66% of the sequence) is the dark "stopped time" wash
    // the luminance layer carries.
    const held = await gradeAt(page, "fp-layer-lum", 0.55);
    expect(alphaOfComputed(held)).toBeGreaterThan(0.3);

    // It flashes bright well before that, so the wash is a distinct beat and
    // not just "the layer is always tinted".
    const flash = await gradeAt(page, "fp-layer-lum", 0.05);
    expect(flash).not.toBe(held);
    expect(alphaOfComputed(flash)).toBeGreaterThan(0.3);

    // ...and everything clears by the end.
    const released = await gradeAt(page, "fp-layer-lum", 1);
    expect(alphaOfComputed(released)).toBeLessThan(0.05);
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
