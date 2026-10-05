/**
 * Helpers that keep E2E specs steady on slow runners (CI's WebKit above all).
 *
 * Both fix a *race in the test*, not a bug in the app:
 *
 * - The page is server-rendered, so a button can be visible and clickable well
 *   before React has hydrated and attached its handlers. A click or form submit
 *   in that window does nothing (or falls through to the browser's default
 *   behaviour), and the assertion after it then times out.
 * - Accepting cookies makes the app reload the page itself. A test that calls
 *   `page.reload()` around then can collide with it, and WebKit reports
 *   "Frame load interrupted".
 */

import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Waits until React has hydrated the element: hydration attaches an internal
 * `__reactProps$…` / `__reactFiber$…` key to every DOM node it owns, which the
 * server-rendered HTML does not have.
 */
export async function waitForHydrated(locator: Locator, timeout = 20_000): Promise<void> {
  await expect
    .poll(
      () =>
        locator.first().evaluate((el) => {
          return Object.keys(el).some(
            (key) => key.startsWith("__reactProps$") || key.startsWith("__reactFiber$")
          );
        }),
      { timeout, message: "element was never hydrated by React" }
    )
    .toBe(true);
}

/** Errors that mean a navigation was cut short by another one, so the reload is worth repeating. */
const INTERRUPTED_NAVIGATION =
  /Frame load interrupted|Execution context was destroyed|interrupted by another navigation/i;

/**
 * `page.reload()` that tries again when it collides with a navigation the app
 * started itself. Any other failure is rethrown straight away.
 */
export async function reloadWithRetry(page: Page, attempts = 3): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await page.reload();
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt >= attempts || !INTERRUPTED_NAVIGATION.test(message)) throw error;
      await page.waitForLoadState("load").catch(() => {});
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Waits until the page is actually producing frames, i.e. `requestAnimationFrame`
 * callbacks run.
 *
 * On CI's Linux WebKit and mobile-Safari roughly one page in five starts with
 * rAF not firing at all although it reports visible and focused (measured: 19
 * of 96 fresh pages; frames then began within 10s, always). Anything that is
 * sequenced by rAF, like the filter pulse's double-rAF start, simply never
 * begins until then, which reads as an animation that "does not start" and
 * fails any fixed-length poll. Waiting here turns that into a short, bounded
 * wait before the interaction.
 */
export async function waitForFrames(page: Page, timeout = 30_000): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            new Promise<boolean>((resolve) => {
              const timer = setTimeout(() => resolve(false), 300);
              requestAnimationFrame(() => {
                clearTimeout(timer);
                resolve(true);
              });
            })
        ),
      { timeout, intervals: [100, 250, 500], message: "the page never produced an animation frame" }
    )
    .toBe(true);
}
