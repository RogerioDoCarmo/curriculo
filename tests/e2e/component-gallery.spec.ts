/**
 * E2E tests for Component Gallery page
 *
 * Tests:
 * - Page loads correctly for all locales
 * - All components are visible
 * - Navigation from Tech Stack page works
 * - Modal interactions work
 * - Responsive design
 * - Accessibility
 */

import { test, expect } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

const LOCALES = ["pt-BR", "en", "es"];
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Component Gallery Page", () => {
  // Set cookie consent before any page loads to prevent banner from appearing
  test.beforeEach(async ({ context }) => {
    await setCookieConsentBeforeLoad(context);
  });

  test.describe("Page Loading", () => {
    for (const locale of LOCALES) {
      test(`should load component gallery page for ${locale} locale`, async ({ page }) => {
        await page.goto(`${BASE_URL}/${locale}/components/`);

        // Wait for page to load - match localized titles
        await expect(page).toHaveTitle(
          /Component Gallery|Galeria de Componentes|Galería de Componentes/i
        );

        // Check page heading is visible
        const heading = page.getByRole("heading", { level: 1 });
        await expect(heading).toBeVisible();
      });
    }
  });

  test.describe("Component Showcases", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/pt-BR/components/`);
    });

    test("should display all 6 component showcases", async ({ page }) => {
      // Check for all component sections (locale-aware: pt-BR, en, es)
      // Using .first() to avoid strict mode violations when text appears multiple times
      const componentTitles = [
        { name: /Button|Botão|Botón/i },
        { name: /Card/i },
        { name: /Highlighted Text|Texto Destacado/i },
        { name: /Modal/i },
        { name: /Language Selector|Seletor de Idioma|Selector de Idioma/i },
        { name: /Theme Toggle|Alternar Tema/i },
      ];

      for (const { name } of componentTitles) {
        const heading = page.getByRole("heading", { level: 2, name }).first();
        await expect(heading).toBeVisible();
      }
    });

    test("should display Button component with all variants", async ({ page }) => {
      // Check for button variants (locale-aware: pt-BR, en, es)
      await expect(
        page.getByRole("button", { name: /Primary Button|Botão Primário|Botón Primario/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Secondary Button|Botão Secundário|Botón Secundario/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Ghost Button|Botão Fantasma|Botón Fantasma/i })
      ).toBeVisible();
    });

    test("should display Button component with all sizes", async ({ page }) => {
      // Check for button sizes (locale-aware: pt-BR, en, es)
      await expect(page.getByRole("button", { name: /Small|Pequeno|Pequeño/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /Medium|Médio|Mediano/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /Large|Grande/i })).toBeVisible();
    });

    test("should display Button component with states", async ({ page }) => {
      // Check for button states (locale-aware: pt-BR, en, es)
      await expect(
        page.getByRole("button", { name: /Disabled|Desabilitado|Deshabilitado/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Loading|Carregando|Cargando/i })
      ).toBeVisible();
    });

    test("should display Card component examples", async ({ page }) => {
      // Check for card examples
      const cardSection = page.locator("section").filter({ hasText: /^Card/ });
      await expect(cardSection).toBeVisible();

      // Cards should be visible within the section
      const cards = cardSection.locator('[class*="rounded"]').filter({ hasText: /Card/ });
      await expect(cards.first()).toBeVisible();
    });

    test("should display HighlightedText component with bold text", async ({ page }) => {
      // Check for highlighted text section (locale-aware)
      const highlightSection = page
        .locator("section")
        .filter({ hasText: /Highlighted Text|Texto Destacado/i });
      await expect(highlightSection).toBeVisible();

      // Check for bold text within highlighted section
      const boldText = highlightSection.locator("strong");
      await expect(boldText).toBeVisible();
    });

    test("should display LanguageSelector component", async ({ page }) => {
      // Check for language selector section (locale-aware)
      const langSection = page
        .locator("section")
        .filter({ hasText: /Language Selector|Seletor de Idioma|Selector de Idioma/i });
      await expect(langSection).toBeVisible();

      // Language selector should be present
      const selector = langSection.locator("select");
      await expect(selector).toBeVisible();
    });

    test("should display ThemeToggle component", async ({ page }) => {
      // Check for theme toggle section (locale-aware)
      const themeSection = page
        .locator("section")
        .filter({ hasText: /Theme Toggle|Alternar Tema/i });
      await expect(themeSection).toBeVisible();

      // Theme toggle button should be present
      const toggle = themeSection.locator("button");
      await expect(toggle).toBeVisible();
    });
  });

  test.describe("Modal Interactions", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/pt-BR/components/`);
    });

    test("should open and close basic modal", async ({ page }) => {
      // Find and click the basic modal button (locale-aware: pt-BR, en, es)
      const modalButton = page
        .getByRole("button", { name: /Open Modal|Abrir Modal|Abrir Modal/i })
        .first();
      await modalButton.click();

      // Modal should be visible
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Modal should have title
      await expect(modal.getByRole("heading")).toBeVisible();

      // Close modal by clicking close button
      const closeButton = modal.getByRole("button", { name: /close|fechar|cerrar/i });
      await closeButton.click();

      // Modal should be hidden
      await expect(modal).not.toBeVisible();
    });

    test("should open confirmation modal", async ({ page }) => {
      // Find and click confirmation modal button (locale-aware)
      const confirmButton = page.getByRole("button", {
        name: /Confirmation Modal|Modal de Confirmação|Modal de Confirmación/i,
      });
      await confirmButton.click();

      // Modal should be visible with confirmation content
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(/Are you sure|Tem certeza|Estás seguro/i)).toBeVisible();

      // Should have Cancel and Confirm buttons (locale-aware)
      await expect(modal.getByRole("button", { name: /Cancel|Cancelar/i })).toBeVisible();
      await expect(modal.getByRole("button", { name: /Confirm|Confirmar/i })).toBeVisible();
    });

    test("should open info modal with list", async ({ page }) => {
      // Find and click info modal button (locale-aware)
      const infoButton = page.getByRole("button", {
        name: /Info Modal|Modal de Informação|Modal de Información/i,
      });
      await infoButton.click();

      // Modal should be visible with list
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Should contain list items
      const listItems = modal.locator("li");
      await expect(listItems).toHaveCount(3);
    });

    test("should open form modal with inputs", async ({ page }) => {
      // Find and click form modal button (locale-aware)
      const formButton = page.getByRole("button", {
        name: /Form Modal|Modal de Formulário|Modal de Formulario/i,
      });
      await formButton.click();

      // Modal should be visible with form inputs
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Should have name and email inputs (locale-aware)
      await expect(modal.getByLabel(/Name|Nome/i)).toBeVisible();
      await expect(modal.getByLabel(/Email|E-mail/i)).toBeVisible();

      // Should have Submit button (locale-aware)
      await expect(modal.getByRole("button", { name: /Submit|Enviar/i })).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate from Tech Stack page to Component Gallery", async ({ page }) => {
      // Start at Tech Stack page
      await page.goto(`${BASE_URL}/pt-BR/tech-stack/`);

      // Find and click component gallery link (locale-aware)
      const galleryLink = page.getByRole("link", {
        name: /Component Gallery|Galeria de Componentes|Galería de Componentes/i,
      });
      await expect(galleryLink).toBeVisible();
      await galleryLink.click();

      // Should navigate to component gallery page
      await expect(page).toHaveURL(/\/components/);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("should maintain locale when navigating from Tech Stack", async ({ page }) => {
      for (const locale of LOCALES) {
        await page.goto(`${BASE_URL}/${locale}/tech-stack/`);

        // Find and click component gallery link (locale-aware)
        const galleryLink = page.getByRole("link", {
          name: /Component Gallery|Galeria de Componentes|Galería de Componentes/i,
        });
        await galleryLink.click();

        // Should maintain the locale in URL
        await expect(page).toHaveURL(new RegExp(`/${locale}/components`));
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should display correctly on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/pt-BR/components/`);

      // Page should load
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Components should be visible (locale-aware)
      await expect(
        page.getByRole("heading", { level: 2, name: /Button|Botão|Botón/i })
      ).toBeVisible();
    });

    test("should display correctly on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/pt-BR/components/`);

      // Page should load
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Components should be visible (locale-aware)
      await expect(
        page.getByRole("heading", { level: 2, name: /Button|Botão|Botón/i })
      ).toBeVisible();
    });

    test("should display correctly on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${BASE_URL}/pt-BR/components/`);

      // Page should load
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Components should be visible (locale-aware)
      await expect(
        page.getByRole("heading", { level: 2, name: /Button|Botão|Botón/i })
      ).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/pt-BR/components/`);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      // H1 for page title
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();

      // H2 for component sections
      const h2Elements = page.getByRole("heading", { level: 2 });
      await expect(h2Elements.first()).toBeVisible();
    });

    test("should have accessible buttons", async ({ page }) => {
      // All buttons should have accessible names
      const buttons = page.getByRole("button");
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const name = (await button.getAttribute("aria-label")) || (await button.textContent());
        expect(name).toBeTruthy();
      }
    });

    test("should support keyboard navigation", async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press("Tab");

      // Should be able to focus on buttons
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("should have proper ARIA attributes on modals", async ({ page }) => {
      // Open a modal (locale-aware)
      const modalButton = page
        .getByRole("button", { name: /Open Modal|Abrir Modal|Abrir Modal/i })
        .first();
      await modalButton.click();

      // Modal should have role="dialog"
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Modal should be properly labeled
      const heading = modal.getByRole("heading");
      await expect(heading).toBeVisible();
    });
  });

  test.describe("Performance", () => {
    test("should load page within acceptable time", async ({ page }) => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/pt-BR/components/`);
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("should not have console errors", async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(`${BASE_URL}/pt-BR/components/`);
      await page.waitForLoadState("networkidle");

      // Should not have any console errors
      expect(consoleErrors).toHaveLength(0);
    });
  });
});
