/**
 * E2E Test: Localized Project Content
 *
 * Project entries live under `content/projects/<locale>/`, so each supported
 * locale renders its own translation of the same project set. These tests
 * verify that:
 *
 * 1. Every locale renders the same projects (no missing translation file)
 * 2. The copy shown actually changes with the locale
 * 3. Store badges in the detail modal link to the App Store / F-Droid and use
 *    the locale's badge artwork
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

/** Section-heading text per locale, used to anchor on the projects section. */
const PROJECTS_HEADING = /^(projetos|projects|proyectos)$/i;

/** Opens the Miroji project detail modal and returns it. */
async function openMirojiDetail(page: Page) {
  const card = page
    .locator('section[id="projects"]')
    .getByRole("button", { name: /miroji/i })
    .first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("Localized project content", () => {
  test.beforeEach(async ({ context }) => {
    await setCookieConsentBeforeLoad(context);
  });

  for (const locale of ["pt-BR", "en", "es"]) {
    test(`renders the project set for ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const projectsSection = page.locator('section[id="projects"]');
      await expect(projectsSection.getByRole("heading", { name: PROJECTS_HEADING })).toBeVisible();

      // Every locale must expose the same three project entries.
      await expect(projectsSection.locator("h3")).toHaveCount(3);
      await expect(projectsSection.getByText("Miroji").first()).toBeVisible();
    });
  }

  test("project copy is translated per locale", async ({ page }) => {
    await page.goto("/pt-BR");
    const ptDetail = await openMirojiDetail(page);
    // pt-BR body uses the Portuguese section heading.
    await expect(ptDetail.getByText("Visão Geral").first()).toBeVisible();
    await expect(ptDetail.getByText("Onde Baixar").first()).toBeVisible();

    await page.goto("/en");
    const enDetail = await openMirojiDetail(page);
    await expect(enDetail.getByText("Overview").first()).toBeVisible();
    await expect(enDetail.getByText("Where to Download").first()).toBeVisible();

    await page.goto("/es");
    const esDetail = await openMirojiDetail(page);
    await expect(esDetail.getByText("Visión General").first()).toBeVisible();
    await expect(esDetail.getByText("Dónde Descargar").first()).toBeVisible();
  });

  test("store badges link to the App Store and F-Droid listings", async ({ page }) => {
    await page.goto("/en");
    const detail = await openMirojiDetail(page);

    const appStoreLink = detail.getByRole("link", { name: /download on the app store/i });
    await expect(appStoreLink).toHaveAttribute(
      "href",
      "https://apps.apple.com/us/app/miroji/id6774924907"
    );
    await expect(appStoreLink).toHaveAttribute("rel", /noopener/);

    const fdroidLink = detail.getByRole("link", { name: /get it on f-droid/i });
    await expect(fdroidLink).toHaveAttribute(
      "href",
      "https://f-droid.org/en/packages/com.rogeriodocarmo.miroji"
    );

    // Badge artwork is served locally (the CSP only allows same-origin images).
    await expect(detail.getByRole("img", { name: /download on the app store/i })).toHaveAttribute(
      "src",
      /\/images\/badges\/app-store-en\.svg/
    );
    await expect(detail.getByRole("img", { name: /get it on f-droid/i })).toHaveAttribute(
      "src",
      /\/images\/badges\/f-droid-en\.svg/
    );
  });

  test("store badges use the locale's artwork", async ({ page }) => {
    await page.goto("/pt-BR");
    const detail = await openMirojiDetail(page);

    await expect(detail.getByRole("img", { name: /baixe na app store/i })).toHaveAttribute(
      "src",
      /\/images\/badges\/app-store-pt-BR\.svg/
    );
    await expect(detail.getByRole("img", { name: /disponível no f-droid/i })).toHaveAttribute(
      "src",
      /\/images\/badges\/f-droid-pt-BR\.svg/
    );
    await expect(detail.getByRole("link", { name: /disponível no f-droid/i })).toHaveAttribute(
      "href",
      "https://f-droid.org/pt/packages/com.rogeriodocarmo.miroji"
    );
  });
});
