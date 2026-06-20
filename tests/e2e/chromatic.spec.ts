/**
 * Chromatic visual snapshots captured from real pages via the
 * `@chromatic-com/playwright` integration — complements the Storybook snapshots
 * with full-page visual regression on the actual rendered routes.
 *
 * Local flow:
 *   1. `npm run test:e2e:chromatic`  -> runs this spec and writes page archives
 *   2. `npm run chromatic:playwright` -> uploads the archives to Chromatic
 *
 * Notes:
 * - Scoped to the chromium project to keep the snapshot count (and cost) down.
 * - `prefers-reduced-motion` is emulated so the banks marquee is frozen and the
 *   snapshots stay deterministic.
 */

import { test, takeSnapshot } from "@chromatic-com/playwright";

test.describe("Chromatic page snapshots", () => {
  test("home page (pt-BR)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Chromatic snapshots run on chromium only");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pt-BR");
    await page.getByRole("heading", { level: 1 }).first().waitFor();

    await takeSnapshot(page, testInfo);
  });

  test("home page (en)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Chromatic snapshots run on chromium only");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.getByRole("heading", { level: 1 }).first().waitFor();

    await takeSnapshot(page, testInfo);
  });
});
