/**
 * E2E Test: Projects Page, and the home page's three-project section
 *
 * The home page shows the first three projects (featured first, then newest);
 * /<locale>/projects/ lists all of them with a technology filter. These tests
 * verify:
 *
 * 1. The home section shows three projects and links to the page
 * 2. The page lists everything, in the same order, in every language
 * 3. Filtering by technology, and keeping the choice in the URL
 * 4. A deep link opens a project's dialog on the page, and on the home page
 *    even for a project the home page doesn't show
 * 5. Copy link gives a working link
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";
import { waitForHydrated } from "./helpers/stability";

const TOTAL_PROJECTS = 4;
// Display order: featured first (Miroji, INCT), then newest (OmniMorse, Android).
const ON_HOME = ["Miroji", "INCT GNSS App", "OmniMorse"];
const NOT_ON_HOME = "Android Native Crud";

/** Project cards on the page: each is one button named "View details for …", per locale. */
const cards = (page: Page) =>
  page.getByRole("button", { name: /^(View details for|Ver detalhes de|Ver detalles de) / });

const chip = (page: Page, name: string) =>
  page
    .getByRole("group", {
      name: /^(Filter by technology|Filtrar por tecnologia|Filtrar por tecnología)$/,
    })
    .getByRole("button", { name, exact: true });

test.describe("Projects page", () => {
  test.beforeEach(async ({ context, browserName }) => {
    // CI's WebKit is slow to load and hydrate; give it the room it needs.
    test.slow(browserName === "webkit");
    await setCookieConsentBeforeLoad(context);
  });

  test.describe("home page section", () => {
    test("shows only the first three projects and links to the rest", async ({ page }) => {
      await page.goto("/en/#projects", { waitUntil: "domcontentloaded" });
      const section = page.locator('section[id="projects"]');

      for (const title of ON_HOME) {
        await expect(
          section.getByRole("button", { name: `View details for ${title}` }).first()
        ).toBeVisible();
      }
      await expect(
        section.getByRole("button", { name: `View details for ${NOT_ON_HOME}` })
      ).toHaveCount(0);
      // The filter moved to the page: no technology chips here any more.
      await expect(section.getByRole("group")).toHaveCount(0);
    });

    test("the View all link goes to the projects page", async ({ page }) => {
      await page.goto("/en/#projects", { waitUntil: "domcontentloaded" });
      const link = page
        .locator('section[id="projects"]')
        .getByRole("link", { name: "View all projects" });

      // The trailing slash comes from `trailingSlash: true`, which Jest doesn't load.
      await expect(link).toHaveAttribute("href", "/en/projects/");
      // Retried as a whole: the page is still scrolling to #projects and hydrating.
      await expect(async () => {
        await link.click({ timeout: 4000 });
        await expect(page).toHaveURL(/\/en\/projects\/$/, { timeout: 4000 });
      }).toPass({ timeout: 20000 });
      await expect(page.getByRole("heading", { level: 1, name: "All projects" })).toBeVisible();
    });

    test("opens a deep link to a project the section doesn't show, without Prev/Next", async ({
      page,
    }) => {
      await page.goto("/en/?project=android-study-app#projects", {
        waitUntil: "domcontentloaded",
      });

      const dialog = page.getByRole("dialog");
      await expect(dialog.getByRole("heading", { name: NOT_ON_HOME })).toBeVisible({
        timeout: 10000,
      });
      await expect(dialog.getByRole("button", { name: "Next project" })).toHaveCount(0);
      await expect(dialog.getByRole("button", { name: "Previous project" })).toHaveCount(0);
    });
  });

  test("lists every project, in the home page's order", async ({ page }) => {
    await page.goto("/en/projects/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "All projects" })).toBeVisible();
    await expect(cards(page)).toHaveCount(TOTAL_PROJECTS);

    const names = await cards(page).evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label"))
    );
    expect(names).toEqual([...ON_HOME, NOT_ON_HOME].map((t) => `View details for ${t}`));
  });

  test("filters by technology and keeps the choice in the URL", async ({ page }) => {
    await page.goto("/en/projects/", { waitUntil: "domcontentloaded" });
    await waitForHydrated(chip(page, "Kotlin"));

    await chip(page, "Kotlin").click();

    await expect(chip(page, "Kotlin")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(1);
    await expect(page.getByRole("button", { name: "View details for OmniMorse" })).toBeVisible();
    await expect(page).toHaveURL(/\/en\/projects\/\?tech=Kotlin$/);

    await chip(page, "All").click();
    await expect(cards(page)).toHaveCount(TOTAL_PROJECTS);
    await expect(page).toHaveURL(/\/en\/projects\/$/);
  });

  test("preselects the technology named in the URL", async ({ page }) => {
    await page.goto("/en/projects/?tech=Kotlin", { waitUntil: "domcontentloaded" });

    await expect(chip(page, "Kotlin")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(1);
  });

  test("shows everything for a technology nothing uses", async ({ page }) => {
    await page.goto("/en/projects/?tech=COBOL", { waitUntil: "domcontentloaded" });

    await expect(chip(page, "All")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(TOTAL_PROJECTS);
  });

  test("opens a deep-linked project, even the one the home page leaves out", async ({ page }) => {
    await page.goto("/en/projects/?project=android-study-app", { waitUntil: "domcontentloaded" });

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: NOT_ON_HOME })).toBeVisible({
      timeout: 10000,
    });
  });

  test("steps through every project with Prev/Next, wrapping", async ({ page }) => {
    await page.goto("/en/projects/?project=miroji", { waitUntil: "domcontentloaded" });

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Miroji" })).toBeVisible({ timeout: 10000 });
    // Miroji is first, so Previous wraps all the way to the last project: unlike
    // the home page's three, this list holds all four.
    await dialog.getByRole("button", { name: "Previous project" }).click();
    await expect(dialog.getByRole("heading", { name: NOT_ON_HOME })).toBeVisible();
  });

  test("Copy link puts a working link to the project on the clipboard", async ({
    page,
    context,
    browserName,
    baseURL,
  }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions can only be granted in Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en/projects/?project=omnimorse", { waitUntil: "domcontentloaded" });

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "OmniMorse" })).toBeVisible({
      timeout: 10000,
    });
    await dialog.getByRole("button", { name: /^Copy link/ }).click();
    await expect(dialog.getByRole("status")).toHaveText("Link copied!");

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(`${baseURL}/en/projects/?project=omnimorse`);

    // And the link itself works: it reopens the same project.
    await page.goto(copied, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("dialog").getByRole("heading", { name: "OmniMorse" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("OmniMorse's dialog has a button to its YouTube video, in every language", async ({
    page,
  }) => {
    for (const [locale, label] of [
      ["en", "Watch video"],
      ["pt-BR", "Assistir ao vídeo"],
      ["es", "Ver el video"],
    ]) {
      await page.goto(`/${locale}/projects/?project=omnimorse`, {
        waitUntil: "domcontentloaded",
      });

      const dialog = page.getByRole("dialog");
      const link = dialog.getByRole("link", { name: new RegExp(`^${label}`) });
      await expect(link).toBeVisible({ timeout: 10000 });
      await expect(link).toHaveAttribute("href", "https://youtu.be/CcyTyHB7n_M");
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  test("a project without a video has no video button", async ({ page }) => {
    await page.goto("/en/projects/?project=miroji", { waitUntil: "domcontentloaded" });

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Miroji" })).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByRole("link", { name: /watch video/i })).toHaveCount(0);
  });

  test("is localized in Portuguese", async ({ page }) => {
    await page.goto("/pt-BR/projects/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Todos os projetos" })).toBeVisible();
    await expect(chip(page, "Todas")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(TOTAL_PROJECTS);
  });

  test("is localized in Spanish", async ({ page }) => {
    await page.goto("/es/projects/", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 1, name: "Todos los proyectos" })
    ).toBeVisible();
    await expect(cards(page)).toHaveCount(TOTAL_PROJECTS);
  });
});
