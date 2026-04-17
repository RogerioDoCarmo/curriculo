/**
 * E2E Test: Basic Navigation
 *
 * Basic smoke tests to verify the site loads and basic navigation works.
 * These tests verify the fundamental functionality that should always work.
 */

import { test, expect } from "@playwright/test";

test.describe("Basic Navigation", () => {
  test("should load the homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Verify page loaded - title varies by language
    // pt-BR: "Rogério do Carmo | Desenvolvedor React Native Mobile"
    // en: "Rogério do Carmo | Mobile React Native Developer"
    // es: "Rogério do Carmo | Desarrollador React Native Mobile"
    await expect(page).toHaveTitle(/Rogério do Carmo/i);

    // Verify main heading is visible
    const heading = page.getByRole("heading", { name: /personal resume website/i });
    await expect(heading).toBeVisible();
  });

  test("should have accessible navigation", async ({ page }) => {
    await page.goto("/");

    // Verify header exists with main heading (inside article)
    const header = page.locator("article header");
    await expect(header).toBeVisible();

    // Verify heading is accessible
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Personal Resume Website");
  });

  test("should display content sections", async ({ page }) => {
    await page.goto("/");

    // Verify main article exists (the one with the main heading)
    const mainArticle = page.locator("article").filter({ hasText: "Personal Resume Website" });
    await expect(mainArticle).toBeVisible();

    // Verify description section inside article
    const descriptionSection = page.locator("article section").first();
    await expect(descriptionSection).toBeVisible();

    // Verify tech stack section exists (outside main article)
    const techStackSection = page.locator("section").filter({ hasText: /tech stack|tecnologias/i });
    await expect(techStackSection).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verify page loads on mobile
    const heading = page.getByRole("heading", { name: /personal resume website/i });
    await expect(heading).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Verify page loads on tablet
    const heading = page.getByRole("heading", { name: /personal resume website/i });
    await expect(heading).toBeVisible();
  });

  test("should be responsive on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Verify page loads on desktop
    const heading = page.getByRole("heading", { name: /personal resume website/i });
    await expect(heading).toBeVisible();
  });

  test("should have proper HTML structure", async ({ page }) => {
    await page.goto("/");

    // Verify semantic HTML
    await expect(page.locator("html")).toBeVisible();
    await expect(page.locator("body")).toBeVisible();

    // Verify main element exists (from layout)
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("should load without JavaScript errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify no JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test("should display tech stack section", async ({ page }) => {
    await page.goto("/");

    // Verify tech stack section is visible
    // The heading text varies by language:
    // - en: "Tech Stack"
    // - pt-BR: "Tecnologias Utilizadas"
    // - es: "Tecnologías Utilizadas"
    const techStackHeading = page.getByRole("heading", {
      name: /tech stack|tecnologias utilizadas|tecnologías utilizadas/i,
    });
    await expect(techStackHeading).toBeVisible();
  });
});
