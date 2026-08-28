/**
 * E2E Test: Project Deep Links
 *
 * A project detail dialog is shareable: opening one writes `?project=<id>` into
 * the URL, and arriving on that URL scrolls to the projects section and reopens
 * the same dialog. These tests verify:
 *
 * 1. Arriving on a deep link opens the dialog on the projects section
 * 2. An unknown project id is ignored rather than breaking the page
 * 3. Opening / closing a project keeps the URL in step, and Back reopens it
 * 4. The Copy link button puts the absolute share URL on the clipboard
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

/** Section-heading text per locale, used to anchor on the projects section. */
const PROJECTS_HEADING = /^(projetos|projects|proyectos)$/i;

/** Copy-link button label per locale. */
const COPY_LINK = /^(copiar link|copy link|copiar enlace)/i;

/**
 * Opens a project detail modal and returns it. `name` must match the card
 * button's full accessible label ("View details for <title>") — several
 * technology filter chips also contain project keywords, so a loose regex would
 * click a filter instead of a card.
 *
 * Below the `sm` breakpoint the grid is swapped for a swipe carousel once the
 * media query resolves, which detaches the card rendered during hydration.
 * Retrying the whole locate-and-click rides out that swap.
 */
async function openProjectDetail(page: Page, name: RegExp) {
  const section = page.locator('section[id="projects"]');
  await expect(section.getByRole("heading", { name: PROJECTS_HEADING })).toBeVisible();

  const dialog = page.getByRole("dialog");
  await expect(async () => {
    // Guarded so a retry never clicks the card again behind an open modal.
    if (!(await dialog.isVisible())) {
      await section.getByRole("button", { name }).first().click({ timeout: 3000 });
    }
    await expect(dialog).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

  return dialog;
}

test.describe("Project deep links", () => {
  test.beforeEach(async ({ context }) => {
    await setCookieConsentBeforeLoad(context);
  });

  // One navigation per test: several page loads in a single test overruns the
  // navigation timeout when the whole browser matrix runs in parallel.

  test("opens the linked project's dialog on arrival", async ({ page }) => {
    await page.goto("/en/?project=miroji#projects");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByRole("heading", { name: /miroji/i })).toBeVisible();

    // And the page behind it is parked on the projects section.
    await expect(page.locator('section[id="projects"]')).toBeInViewport();
  });

  test("honours a deep link in another locale", async ({ page }) => {
    await page.goto("/pt-BR/?project=inct-gnss-app#projects");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByRole("heading", { name: /inct/i })).toBeVisible();
  });

  test("ignores an unknown project id", async ({ page }) => {
    await page.goto("/en/?project=not-a-real-project#projects");

    const section = page.locator('section[id="projects"]');
    await expect(section.getByRole("heading", { name: PROJECTS_HEADING })).toBeVisible();
    // The page renders normally; no dialog is forced open.
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("writes the open project into the URL and clears it on close", async ({ page }) => {
    await page.goto("/en");

    const dialog = await openProjectDetail(page, /^view details for miroji$/i);
    await expect(page).toHaveURL(/\?project=miroji/);

    await dialog.getByRole("button", { name: /close/i }).click();
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/\?project=/);
  });

  test("back and forward step through the opened project", async ({ page }) => {
    await page.goto("/en");

    await openProjectDetail(page, /^view details for miroji$/i);
    await expect(page).toHaveURL(/\?project=miroji/);

    await page.goBack();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.goForward();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page).toHaveURL(/\?project=miroji/);
  });

  test("copies the shareable link to the clipboard", async ({ page, context, browserName }) => {
    // Clipboard permissions are only grantable in Chromium; Firefox and WebKit
    // reject the grant, so the write would be blocked rather than tested.
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/en");

    const dialog = await openProjectDetail(page, /^view details for miroji$/i);
    await dialog.getByRole("button", { name: COPY_LINK }).click();

    // The confirmation lands in the dialog's live region.
    await expect(dialog.getByRole("status")).toHaveText(/copied/i);

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/\/en\/\?project=miroji#projects$/);
    expect(copied.startsWith("http")).toBe(true);
  });

  test("a copied link reopens the same project", async ({ page }) => {
    // Rather than round-tripping through the clipboard (permission-gated), open
    // the project, read the URL the app produced, and navigate to it fresh.
    await page.goto("/en");
    await openProjectDetail(page, /^view details for android native crud$/i);

    const url = page.url();
    expect(url).toContain("?project=android-study-app");

    await page.goto(url);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByRole("heading", { name: /android native crud/i })).toBeVisible();
  });
});
