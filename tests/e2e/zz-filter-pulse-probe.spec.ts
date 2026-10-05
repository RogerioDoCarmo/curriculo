/**
 * TEMPORARY diagnostic probe for the intermittent filter-pulse failure on CI's
 * WebKit (radius stays 0 for the whole poll). Not meant to be merged.
 *
 * Repeats the click scenario in parallel and, when the radius never moves,
 * fails with a report of what the page was actually doing: whether
 * requestAnimationFrame ticks at all, page visibility, the consent flag, the
 * button state, any open dialog and the overlay's inline/computed radius.
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";
import { acceptPulseWarningBeforeLoad } from "./helpers/filterPulseConsent";
import { waitForHydrated } from "./helpers/stability";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const COPIES = Number(process.env.PROBE_COPIES || 12);

const pulseButton = (page: Page) => page.getByRole("button", { name: /^trigger /i });

const readRadius = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    if (!el) return -1;
    const m = getComputedStyle(el).clipPath.match(/circle\(([\d.]+)px/);
    return m ? parseFloat(m[1]) : 0;
  });

/** Counts requestAnimationFrame callbacks over `ms`. Zero means rendering is stalled. */
const rafTicks = (page: Page, ms: number) =>
  page.evaluate(
    (duration) =>
      new Promise<number>((resolve) => {
        let n = 0;
        const start = performance.now();
        const frame = () => {
          n += 1;
          if (performance.now() - start < duration) requestAnimationFrame(frame);
          else resolve(n);
        };
        requestAnimationFrame(frame);
        // If rAF never fires, still answer.
        setTimeout(() => resolve(n), duration + 1500);
      }),
    ms
  );

const snapshot = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector(".filter-pulse-overlay") as HTMLElement | null;
    const btn = document.querySelector('button[aria-label^="Trigger"]') as HTMLButtonElement | null;
    return {
      visibility: document.visibilityState,
      hasFocus: document.hasFocus(),
      consent: localStorage.getItem("filter-pulse-photosensitivity-consent"),
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      openDialogs: Array.from(document.querySelectorAll("dialog[open]")).map(
        (d) => d.getAttribute("aria-labelledby") || d.className.slice(0, 40)
      ),
      button: btn
        ? { disabled: btn.disabled, ariaDisabled: btn.getAttribute("aria-disabled") }
        : null,
      overlay: el
        ? {
            inlineRadius: el.style.getPropertyValue("--pulse-radius"),
            inlineTransition: el.style.transition,
            computedClipPath: getComputedStyle(el).clipPath,
            running: el.getAnimations().length,
          }
        : null,
      viewport: { w: innerWidth, h: innerHeight },
    };
  });

test.describe.configure({ mode: "parallel" });

test.beforeEach(async ({ context, browserName }) => {
  test.slow(browserName === "webkit");
  await setCookieConsentBeforeLoad(context);
  await acceptPulseWarningBeforeLoad(context);
});

for (let i = 1; i <= COPIES; i++) {
  test(`probe ${i}: the pulse grows after a click`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(`${BASE_URL}/en`);
    await waitForHydrated(pulseButton(page));

    // Hypothesis under test: wait until the page actually produces frames
    // before clicking. Records how long that took, for every copy.
    const waitStart = Date.now();
    let firstTicks = await rafTicks(page, 300);
    let waitedForFrames = 0;
    while (firstTicks === 0 && Date.now() - waitStart < 20_000) {
      waitedForFrames = Date.now() - waitStart;
      await page.waitForTimeout(250);
      firstTicks = await rafTicks(page, 300);
    }
    console.log(
      `PROBE-RAF copy=${i} initialDead=${waitedForFrames > 0} msUntilFramesFlow=${
        firstTicks === 0 ? "NEVER" : Date.now() - waitStart
      }`
    );
    const before = {
      rafTicksIn300ms: firstTicks,
      msWaitedForFrames: waitedForFrames,
      state: await snapshot(page),
    };
    await pulseButton(page).click();

    let grew = false;
    const samples: number[] = [];
    const deadline = Date.now() + 12_000;
    while (Date.now() < deadline) {
      const r = await readRadius(page);
      samples.push(Math.round(r));
      if (r > 100) {
        grew = true;
        break;
      }
      await page.waitForTimeout(250);
    }

    if (!grew) {
      const after = {
        rafTicksIn300ms: await rafTicks(page, 300),
        state: await snapshot(page),
      };
      throw new Error(
        `PROBE FAILURE: radius never exceeded 100\n` +
          JSON.stringify({ before, after, radiusSamples: samples.slice(0, 20) }, null, 2)
      );
    }
    expect(grew).toBe(true);
  });
}
