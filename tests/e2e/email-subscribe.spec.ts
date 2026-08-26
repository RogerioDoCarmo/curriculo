/**
 * E2E tests for EmailSubscribeForm.
 * Tests the email capture form on the main page and in the exit intent modal.
 */

import { test, expect, type Page } from "@playwright/test";
import { setCookieConsentBeforeLoad } from "./helpers/dismissCookieBanner";

/**
 * Triggers exit-intent detection by sweeping the cursor up to the top edge.
 *
 * The hook only fires when it sees a mousemove with `clientY <= threshold` whose
 * previous Y was greater (upward velocity). Two discrete `mouse.move` calls don't
 * reliably deliver that on WebKit, so move down first, then sweep up to y=1 in
 * many steps — each intermediate mousemove has a strictly smaller Y, guaranteeing
 * the upward-velocity condition is met as the cursor crosses the threshold.
 */
async function triggerExitIntent(page: Page): Promise<void> {
  await page.mouse.move(400, 400);
  await page.mouse.move(400, 1, { steps: 20 });
}

test.describe("EmailSubscribeForm - main page", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set cookie consent BEFORE navigation to prevent banner from appearing
    await setCookieConsentBeforeLoad(context);
    await page.goto("/en");
    // Scroll to the contact section
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("renders email input and submit button", async ({ page }) => {
    const section = page.locator("#contact");
    await expect(section.locator('input[id="contact-email"]')).toBeVisible();
    await expect(section.locator('button[type="submit"]')).toBeVisible();
  });

  test("shows validation error for empty submission", async ({ page }) => {
    const section = page.locator("#contact");
    await section.locator('button[type="submit"]').click();
    await expect(section.locator("text=Email is required")).toBeVisible();
  });

  test.skip("shows validation error for invalid email", async ({ page }) => {
    const section = page.locator("#contact");
    await section.locator('input[id="contact-email"]').fill("not-an-email");
    await section.locator('button[type="submit"]').click();
    await expect(section.locator("text=Enter a valid email")).toBeVisible();
  });

  test("submits valid email and shows success message", async ({ page }) => {
    // Intercept the Formspree request
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    const section = page.locator("#contact");
    // Fill all required fields
    await section.locator('input[id="contact-name"]').fill("Test User");
    await section.locator('input[id="contact-email"]').fill("test@example.com");
    await section.locator('textarea[id="contact-message"]').fill("This is a test message");
    await section.locator('button[type="submit"]').click();

    await expect(section.locator("text=/success|sent|thank/i")).toBeVisible({ timeout: 5000 });
  });

  test("shows error message on API failure", async ({ page }) => {
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: "Server error" }) });
    });

    const section = page.locator("#contact");
    // Fill all required fields
    await section.locator('input[id="contact-name"]').fill("Test User");
    await section.locator('input[id="contact-email"]').fill("test@example.com");
    await section.locator('textarea[id="contact-message"]').fill("This is a test message");
    await section.locator('button[type="submit"]').click();

    await expect(section.locator("text=/error|wrong|failed/i")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("EmailSubscribeForm - exit intent modal", () => {
  // Exit intent detection is disabled on mobile (< 768px viewport)
  // and relies on mouse movement which doesn't exist on touch devices.
  // These tests only run on desktop browsers.
  test.skip(({ isMobile }) => isMobile, "Exit intent is disabled on mobile viewports");

  test.beforeEach(async ({ page, context }) => {
    // Set cookie consent BEFORE navigation to prevent banner from appearing
    await setCookieConsentBeforeLoad(context);
    await page.goto("/en");
  });

  test("email form is present in exit intent modal", async ({ page }) => {
    // Trigger exit intent by sweeping the cursor up to the top of the viewport.
    await page.waitForTimeout(6000); // wait past minTimeOnPage (5s)
    await triggerExitIntent(page);

    const modal = page.getByRole("dialog", { name: "Hey, wait!" });
    await expect(modal).toBeVisible({ timeout: 5000 });

    await expect(modal.locator('input[type="email"]')).toBeVisible();
    await expect(modal.locator("text=Contact me")).toBeVisible();
  });

  test("submits email from exit intent modal", async ({ page }) => {
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.waitForTimeout(6000);
    await triggerExitIntent(page);

    const modal = page.getByRole("dialog", { name: "Hey, wait!" });
    await expect(modal).toBeVisible({ timeout: 5000 });

    await modal.locator('input[type="email"]').fill("modal@example.com");
    await modal.locator("text=Contact me").click();

    await expect(modal.locator("text=Got it!")).toBeVisible({ timeout: 5000 });
  });
});
