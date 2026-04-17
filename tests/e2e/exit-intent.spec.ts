/**
 * E2E Test: Exit Intent Detection
 *
 * Tests Requirements 19.2, 19.3, 19.7:
 * - Modal appears on exit intent
 * - Modal doesn't appear on mobile viewports
 * - Modal only shows once per session
 *
 * NOTE: These tests are currently skipped because the ExitIntentModal component
 * hasn't been implemented yet. Unskip once the exit intent feature is complete.
 *
 * This test verifies that:
 * 1. Exit intent modal appears when cursor moves to top of viewport
 * 2. Modal doesn't trigger on mobile devices (< 768px)
 * 3. Modal only displays once per session
 * 4. Modal can be dismissed
 * 5. Modal respects minimum time threshold (5 seconds)
 */

import { test, expect } from "@playwright/test";

test.describe.skip("Exit Intent Detection", () => {
  test.beforeEach(async ({ page }) => {
    // Clear sessionStorage to start fresh
    await page.goto("/");
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
  });

  test("should trigger exit intent modal on desktop", async ({ page }) => {
    // Wait for minimum time threshold (5 seconds)
    await page.waitForTimeout(5500);

    // Move mouse to top of viewport to trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();
  });

  test("should not trigger before minimum time threshold", async ({ page }) => {
    // Wait only 2 seconds (less than 5 second threshold)
    await page.waitForTimeout(2000);

    // Move mouse to top of viewport
    await page.mouse.move(500, 0);
    await page.waitForTimeout(500);

    // Verify modal does NOT appear
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).not.toBeVisible();
  });

  test("should not trigger on mobile viewport", async ({ page, context }) => {
    // Set mobile viewport (< 768px)
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Try to trigger exit intent
    await page.mouse.move(200, 0);
    await page.waitForTimeout(500);

    // Verify modal does NOT appear on mobile
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).not.toBeVisible();
  });

  test("should only show modal once per session", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Close modal
    const closeButton = modal.getByRole("button", { name: /close|fechar|cerrar/i });
    await closeButton.click();
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();

    // Try to trigger exit intent again
    await page.mouse.move(500, 600);
    await page.waitForTimeout(500);
    await page.mouse.move(500, 0);
    await page.waitForTimeout(500);

    // Verify modal does NOT appear again
    await expect(modal).not.toBeVisible();
  });

  test("should dismiss modal on backdrop click", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Click backdrop (outside modal)
    await page.mouse.click(50, 50);
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should dismiss modal on ESC key", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Press ESC key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should display call-to-action content in modal", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Verify modal contains call-to-action content
    // Should have options like: download resume, connect on LinkedIn, etc.
    const modalContent = await modal.textContent();
    expect(modalContent).toBeTruthy();
    expect(modalContent!.length).toBeGreaterThan(50);
  });

  test("should have accessible modal with proper ARIA attributes", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal has proper role
    const modal = page.locator('[role="dialog"], [role="alertdialog"]');
    await expect(modal).toBeVisible();

    // Verify modal has aria-modal attribute
    const ariaModal = await modal.getAttribute("aria-modal");
    expect(ariaModal).toBe("true");

    // Verify close button is accessible
    const closeButton = modal.getByRole("button", { name: /close|fechar|cerrar/i });
    await expect(closeButton).toBeVisible();
  });

  test("should store session flag in sessionStorage", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Check sessionStorage has the flag
    const exitIntentShown = await page.evaluate(() => sessionStorage.getItem("exit-intent-shown"));
    expect(exitIntentShown).toBe("true");
  });

  test("should not trigger when scrolling down", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Move mouse within page (not to top edge)
    await page.mouse.move(500, 300);
    await page.waitForTimeout(500);

    // Verify modal does NOT appear
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).not.toBeVisible();
  });

  test("should work across different language settings", async ({ page }) => {
    // Test with English
    await page.goto("/en");
    await page.waitForTimeout(5500);
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    const modalEn = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go/i,
    });
    await expect(modalEn).toBeVisible();

    // Close modal
    const closeButtonEn = modalEn.getByRole("button", { name: /close/i });
    await closeButtonEn.click();
    await page.waitForTimeout(300);

    // Clear session and test with Spanish
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/es");
    await page.waitForTimeout(5500);
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    const modalEs = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /antes de irte/i,
    });
    await expect(modalEs).toBeVisible();
  });

  test("should maintain focus trap within modal", async ({ page }) => {
    // Wait for minimum time threshold
    await page.waitForTimeout(5500);

    // Trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(200);

    // Verify modal appears
    const modal = page.locator('[role="dialog"], [role="alertdialog"]').filter({
      hasText: /before you go|antes de sair|antes de irte/i,
    });
    await expect(modal).toBeVisible();

    // Tab through focusable elements
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);

    // Verify focus stays within modal
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // The focused element should be within the modal
    const isFocusInModal = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const modalEl = document.querySelector('[role="dialog"], [role="alertdialog"]');
      return modalEl?.contains(activeEl) ?? false;
    });
    expect(isFocusInModal).toBe(true);
  });
});
