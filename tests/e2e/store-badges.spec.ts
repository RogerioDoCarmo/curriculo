/**
 * E2E Test: Store badges
 *
 * The App Store, Google Play and F-Droid badges sit side by side in a project's
 * detail dialog. Google's and F-Droid's original artwork ships with ~41px of
 * transparent padding on every side, which made those two look a third shorter
 * than Apple's at the same CSS height. The assets are now trimmed to their
 * visible artwork; these tests verify, per locale:
 *
 * 1. All three badges render at the same height (within 1px)
 * 2. The Play and F-Droid images are wide, trimmed artwork (aspect ratio > 3),
 *    not the padded 646x250 originals (aspect ratio ~2.58)
 * 3. The Play badge is the locale's own artwork, not the English fallback
 */

import { test, expect } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

for (const locale of ["en", "es", "pt-BR"] as const) {
  test.describe(`Store badges (${locale})`, () => {
    test.beforeEach(async ({ context, browserName }) => {
      test.slow(browserName === "webkit");
      await setCookieConsentBeforeLoad(context);
    });

    test("render at equal height with trimmed artwork", async ({ page }) => {
      await page.goto(`/${locale}/?project=miroji#projects`, { waitUntil: "domcontentloaded" });

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible({ timeout: 10000 });

      // In document order: App Store, Google Play, F-Droid.
      const images = dialog.locator(
        'a[href*="apps.apple.com"] img, a[href*="play.google.com"] img, a[href*="f-droid.org"] img'
      );
      await expect(images).toHaveCount(3);

      // The badges sit below the fold and next/image lazy-loads them: bring
      // them into view, then wait for every image to decode so `w-auto`
      // resolves to the real width. Scroll with the DOM API, retried inside
      // the poll: `scrollIntoViewIfNeeded` waits for the element to be stable,
      // which times out in WebKit while the dialog is still animating open.
      await expect(async () => {
        await images.last().evaluate((el) => el.scrollIntoView({ block: "center" }));
        const loaded = await images.evaluateAll((els) =>
          els.every(
            (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0
          )
        );
        expect(loaded).toBe(true);
      }).toPass({ timeout: 10000 });

      const boxes = await Promise.all(
        [0, 1, 2].map(async (i) => {
          const box = await images.nth(i).boundingBox();
          expect(box).not.toBeNull();
          return box!;
        })
      );

      const heights = boxes.map((b) => b.height);
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
      expect(heights[0]).toBeGreaterThan(0);

      // Play (index 1) and F-Droid (index 2): trimmed artwork is ~3.36:1.
      for (const box of boxes.slice(1)) {
        expect(box.width / box.height).toBeGreaterThan(3);
      }

      // Every locale has its own Play artwork; none falls back to English.
      const playSrc = await images.nth(1).evaluate((el) => (el as HTMLImageElement).currentSrc);
      expect(decodeURIComponent(playSrc)).toContain(`/images/badges/google-play-${locale}.png`);
    });
  });
}
