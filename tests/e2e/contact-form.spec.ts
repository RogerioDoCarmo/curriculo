/**
 * E2E Test: Contact Form Flow
 *
 * Tests Requirements 3.2, 3.3, 3.4, 3.5:
 * - Complete form submission flow
 * - Form validation for required fields
 * - Success confirmation message
 * - Error handling
 *
 * NOTE: These tests are currently skipped because the ContactForm component
 * needs to be integrated into the main page. Unskip once the contact section is complete.
 *
 * This test verifies that:
 * 1. Users can fill out and submit the contact form
 * 2. Form validates required fields (name, email, message)
 * 3. Form shows validation errors for invalid input
 * 4. Form shows success confirmation after submission
 * 5. Form handles submission errors gracefully
 */

import { test, expect } from "@playwright/test";

test.describe.skip("Contact Form Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the contact section
    await page.goto("/");
    await page
      .getByRole("link", { name: /contact|contato|contacto/i })
      .first()
      .click();
    await page.waitForTimeout(500);
  });

  test("should display contact form with all required fields", async ({ page }) => {
    // Verify form is visible
    const form = page.locator("form").filter({ hasText: /contact|contato|contacto/i });
    await expect(form).toBeVisible();

    // Verify all required fields are present
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Try to submit empty form
    await submitButton.click();
    await page.waitForTimeout(500);

    // Verify validation errors appear
    // Look for error messages or invalid field indicators
    const errorMessages = page.locator('[role="alert"], .error, [class*="error"]');
    await expect(errorMessages.first()).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form with invalid email
    await nameInput.fill("John Doe");
    await emailInput.fill("invalid-email");
    await messageInput.fill("This is a test message");

    // Submit form
    await submitButton.click();
    await page.waitForTimeout(500);

    // Verify email validation error appears
    const emailError = page.locator('[role="alert"], .error, [class*="error"]').filter({
      hasText: /email|e-mail/i,
    });
    await expect(emailError.first()).toBeVisible();
  });

  test("should submit form with valid data", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form with valid data
    await nameInput.fill("John Doe");
    await emailInput.fill("john.doe@example.com");
    await messageInput.fill("This is a test message from E2E tests. Please ignore.");

    // Mock the form submission to avoid actually sending emails during tests
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // Submit form
    await submitButton.click();

    // Wait for submission to complete
    await page.waitForTimeout(2000);

    // Verify success message appears
    const successMessage = page.locator('[role="alert"], [role="status"]').filter({
      hasText: /success|sent|enviado|éxito/i,
    });
    await expect(successMessage.first()).toBeVisible();
  });

  test("should show loading state during submission", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form
    await nameInput.fill("John Doe");
    await emailInput.fill("john.doe@example.com");
    await messageInput.fill("Test message");

    // Mock slow response
    await page.route("**/formspree.io/**", async (route) => {
      await page.waitForTimeout(1000);
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // Submit form
    await submitButton.click();

    // Verify loading state (button disabled or showing loading indicator)
    await expect(submitButton).toBeDisabled();
  });

  test("should handle submission errors gracefully", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form
    await nameInput.fill("John Doe");
    await emailInput.fill("john.doe@example.com");
    await messageInput.fill("Test message");

    // Mock error response
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    // Submit form
    await submitButton.click();

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Verify error message appears
    const errorMessage = page.locator('[role="alert"]').filter({
      hasText: /error|erro|failed|falhou/i,
    });
    await expect(errorMessage.first()).toBeVisible();
  });

  test("should clear form after successful submission", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form
    await nameInput.fill("John Doe");
    await emailInput.fill("john.doe@example.com");
    await messageInput.fill("Test message");

    // Mock successful response
    await page.route("**/formspree.io/**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // Submit form
    await submitButton.click();

    // Wait for submission
    await page.waitForTimeout(2000);

    // Verify form fields are cleared
    await expect(nameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
    await expect(messageInput).toHaveValue("");
  });

  test("should validate minimum message length", async ({ page }) => {
    const nameInput = page.getByLabel(/name|nome/i);
    const emailInput = page.getByLabel(/email|e-mail/i);
    const messageInput = page.getByLabel(/message|mensagem/i);
    const submitButton = page.getByRole("button", { name: /send|enviar/i });

    // Fill form with very short message
    await nameInput.fill("John Doe");
    await emailInput.fill("john.doe@example.com");
    await messageInput.fill("Hi");

    // Submit form
    await submitButton.click();
    await page.waitForTimeout(500);

    // Verify validation error for message length
    const messageError = page.locator('[role="alert"], .error').filter({
      hasText: /message|mensagem/i,
    });
    await expect(messageError.first()).toBeVisible();
  });

  test("should be accessible via keyboard navigation", async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press("Tab");
    const nameInput = page.getByLabel(/name|nome/i);
    await expect(nameInput).toBeFocused();

    await page.keyboard.press("Tab");
    const emailInput = page.getByLabel(/email|e-mail/i);
    await expect(emailInput).toBeFocused();

    await page.keyboard.press("Tab");
    const messageInput = page.getByLabel(/message|mensagem/i);
    await expect(messageInput).toBeFocused();

    // Fill form using keyboard
    await nameInput.type("John Doe");
    await emailInput.type("john.doe@example.com");
    await messageInput.type("Test message via keyboard");

    // Tab to submit button
    await page.keyboard.press("Tab");
    const submitButton = page.getByRole("button", { name: /send|enviar/i });
    await expect(submitButton).toBeFocused();
  });

  test("should display contact information alongside form", async ({ page }) => {
    // Verify contact information is visible
    // Look for email, social media links, etc.
    const contactSection = page.locator("section").filter({
      hasText: /contact|contato|contacto/i,
    });

    await expect(contactSection).toBeVisible();

    // Look for social media links or email
    const links = contactSection.locator("a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
