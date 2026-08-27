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

/** Headings from Miroji's markdown body, per locale — proof the copy is translated. */
const MIROJI_BODY_HEADINGS: Record<string, { overview: string; download: string }> = {
  "pt-BR": { overview: "Visão Geral", download: "Onde Baixar" },
  en: { overview: "Overview", download: "Where to Download" },
  es: { overview: "Visión General", download: "Dónde Descargar" },
};

/**
 * Opens the Miroji project detail modal and returns it.
 *
 * Below the `sm` breakpoint the grid is swapped for a swipe carousel once the
 * media query resolves, which detaches the card that was rendered during
 * hydration. Retrying the whole locate-and-click rides out that swap instead of
 * failing with "element is not attached to the DOM".
 */
async function openMirojiDetail(page: Page) {
  const section = page.locator('section[id="projects"]');
  await expect(section.getByRole("heading", { name: PROJECTS_HEADING })).toBeVisible();

  const dialog = page.getByRole("dialog");
  await expect(async () => {
    // Guarded so a retry never clicks the card again behind an open modal.
    if (!(await dialog.isVisible())) {
      await section
        .getByRole("button", { name: /miroji/i })
        .first()
        .click({ timeout: 3000 });
    }
    await expect(dialog).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

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

      // Every locale must expose the same three project entries. On mobile the
      // carousel renders three copies of each card, but only the middle copy is
      // exposed to the accessibility tree — so count by role, not by element.
      await expect(projectsSection.getByRole("heading", { level: 3 })).toHaveCount(3);
      await expect(projectsSection.getByText("Miroji").first()).toBeVisible();
    });
  }

  // One navigation per test: three page loads in a single test overruns the
  // navigation timeout when the whole browser matrix runs in parallel.
  for (const [locale, headings] of Object.entries(MIROJI_BODY_HEADINGS)) {
    test(`project copy is translated for ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const detail = await openMirojiDetail(page);

      await expect(detail.getByText(headings.overview).first()).toBeVisible();
      await expect(detail.getByText(headings.download).first()).toBeVisible();
    });
  }

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
