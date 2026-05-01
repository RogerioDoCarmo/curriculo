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

    // Verify main heading is visible (varies by locale)
    // pt-BR: "Site de Currículo Pessoal"
    // en: "Personal Resume Website"
    // es: "Sitio Web de Currículum Personal"
    const heading = page.getByRole("heading", {
      name: /site de currículo pessoal|personal resume website|sitio web de currículum personal/i,
    });
    await expect(heading).toBeVisible();
  });

  test("should have accessible navigation", async ({ page }) => {
    await page.goto("/");

    // Verify hero section exists
    const heroSection = page.locator('section[id="home"]');
    await expect(heroSection).toBeVisible();

    // Verify heading is accessible (varies by locale)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    // Heading should contain the name
    await expect(heading).toHaveText(/Rogério do Carmo/i);
  });

  test("should display content sections", async ({ page }) => {
    await page.goto("/");

    // Verify hero section exists
    const heroSection = page.locator('section[id="home"]');
    await expect(heroSection).toBeVisible();

    // Verify main heading is visible
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Verify contact section exists
    const contactSection = page.locator('section[id="contact"]');
    await expect(contactSection).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verify page loads on mobile (text varies by locale)
    const heading = page.getByRole("heading", {
      name: /site de currículo pessoal|personal resume website|sitio web de currículum personal/i,
    });
    await expect(heading).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Verify page loads on tablet (text varies by locale)
    const heading = page.getByRole("heading", {
      name: /site de currículo pessoal|personal resume website|sitio web de currículum personal/i,
    });
    await expect(heading).toBeVisible();
  });

  test("should be responsive on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Verify page loads on desktop (text varies by locale)
    const heading = page.getByRole("heading", {
      name: /site de currículo pessoal|personal resume website|sitio web de currículum personal/i,
    });
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
    // Navigate to tech stack page with explicit locale
    await page.goto("/en/tech-stack");

    // Verify tech stack page heading is visible
    // The heading text varies by language:
    // - en: "Used in this site"
    // - pt-BR: "Usado neste site"
    // - es: "Usado en este sitio"
    const techStackHeading = page.getByRole("heading", {
      name: /used in this site|usado neste site|usado en este sitio/i,
    });
    await expect(techStackHeading).toBeVisible();
  });
});
