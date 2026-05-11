/**
 * E2E Test: Cookie Consent Banner
 *
 * Tests Requirements 33.1-33.10:
 * - Cookie consent banner display and functionality
 * - User consent choices (accept, reject, customize)
 * - Consent persistence across page reloads
 * - Analytics tracking based on consent
 * - Multi-language support
 * - Accessibility compliance
 *
 * This test verifies that:
 * 1. Banner appears on first visit
 * 2. User can accept, reject, or customize cookie preferences
 * 3. Consent choices persist in localStorage
 * 4. Page reloads when accepting/customizing (to initialize analytics)
 * 5. Analytics tracking respects consent status
 * 6. Banner works in all supported languages
 * 7. Banner is keyboard accessible
 */

import { test, expect } from "@playwright/test";

test.describe("Cookie Consent Banner", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage by navigating to about:blank first
    await page.goto("about:blank");
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore errors
      }
    });

    // Clear all cookies and permissions
    await context.clearCookies();
    await context.clearPermissions();
  });

  test.describe("First visit", () => {
    test("should show banner on first visit", async ({ page }) => {
      await page.goto("/");

      // Wait for banner to appear
      const banner = page.getByRole("dialog");
      await expect(banner).toBeVisible({ timeout: 10000 });

      // Verify banner has proper ARIA attributes
      await expect(banner).toHaveAttribute("aria-modal", "true");
      await expect(banner).toHaveAttribute("role", "dialog");
    });

    test("should show essential and analytics cookie categories", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible({ timeout: 10000 });

      // Check for cookie categories (use .first() to avoid strict mode violations)
      await expect(banner.getByText(/essential/i).first()).toBeVisible();
      await expect(banner.getByText(/analytics/i).first()).toBeVisible();
    });

    test("should have three action buttons", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await expect(banner).toBeVisible();

      // Verify all three buttons are present
      await expect(banner.getByRole("button", { name: /aceitar|accept/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /rejeitar|reject/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /personalizar|customize/i })).toBeVisible();
    });
  });

  test.describe("Accept all flow", () => {
    test("should hide banner after accepting", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await expect(banner).toBeVisible();

      // Click Accept All button
      await banner.getByRole("button", { name: /aceitar|accept/i }).click();

      // Wait for page reload (accept triggers reload)
      await page.waitForLoadState("networkidle");

      // Banner should not be visible after reload
      await expect(banner).not.toBeVisible();
    });

    test("should persist consent across page reloads", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await banner.getByRole("button", { name: /aceitar|accept/i }).click();

      // Wait for reload
      await page.waitForLoadState("networkidle");

      // Check localStorage
      const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
      expect(consentStatus).toBe("accepted");

      const preferences = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
      );
      expect(preferences.analytics).toBe(true);
      expect(preferences.functional).toBe(true);

      // Reload page manually
      await page.reload();

      // Banner should still not be visible
      await expect(banner).not.toBeVisible();
    });

    test("should enable Firebase Analytics after accepting", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await banner.getByRole("button", { name: /aceitar|accept/i }).click();

      // Wait for reload
      await page.waitForLoadState("networkidle");

      // Check that analytics consent is granted
      const hasConsent = await page.evaluate(() => {
        const status = localStorage.getItem("cookie-consent");
        return status === "accepted";
      });
      expect(hasConsent).toBe(true);
    });
  });

  test.describe("Reject non-essential flow", () => {
    test("should hide banner after rejecting", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await expect(banner).toBeVisible();

      // Click Reject button
      await banner.getByRole("button", { name: /rejeitar|reject/i }).click();

      // Banner should hide immediately (no reload for reject)
      await expect(banner).not.toBeVisible();
    });

    test("should persist rejection across page reloads", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await banner.getByRole("button", { name: /rejeitar|reject/i }).click();

      // Check localStorage
      const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
      expect(consentStatus).toBe("rejected");

      const preferences = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
      );
      expect(preferences.analytics).toBe(false);
      expect(preferences.functional).toBe(false);

      // Reload page
      await page.reload();

      // Banner should not be visible after reload
      await expect(banner).not.toBeVisible();
    });

    test("should NOT enable Firebase Analytics after rejecting", async ({ page }) => {
      await page.goto("/");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await banner.getByRole("button", { name: /rejeitar|reject/i }).click();

      // Check that analytics consent is NOT granted
      const hasConsent = await page.evaluate(() => {
        const status = localStorage.getItem("cookie-consent");
        const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
        return status === "accepted" || (status === "customized" && prefs.analytics === true);
      });
      expect(hasConsent).toBe(false);
    });
  });

  test.describe("Customize flow", () => {
    test("should show customize view when clicked", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible();

      // Count how many customize buttons exist
      const customizeButtons = await page.getByRole("button", { name: /customize/i }).count();
      console.log(`Found ${customizeButtons} customize button(s)`);

      // Click Customize button directly without scoping to banner
      await page.getByRole("button", { name: /customize/i }).click();

      // Wait for React state to update
      await page.waitForTimeout(500);

      // Check if banner still exists
      const bannerCount = await page.getByRole("dialog").count();
      console.log(`Banner count after click: ${bannerCount}`);

      // Verify banner is still visible
      await expect(banner).toBeVisible();

      // Verify customize view is shown - look for the heading
      await expect(banner.getByRole("heading", { name: /customize/i })).toBeVisible();

      // Verify checkboxes are present
      await expect(banner.getByRole("checkbox", { name: /essential/i })).toBeVisible();
      await expect(banner.getByRole("checkbox", { name: /analytics/i })).toBeVisible();
      await expect(banner.getByRole("checkbox", { name: /functional/i })).toBeVisible();
    });

    test("should have essential cookies always enabled", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      // Essential checkbox should be checked and disabled
      const essentialCheckbox = banner.getByRole("checkbox", { name: /essential/i });
      await expect(essentialCheckbox).toBeChecked();
      await expect(essentialCheckbox).toBeDisabled();
    });

    test("should allow toggling analytics preference", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      const analyticsCheckbox = banner.getByRole("checkbox", { name: /analytics/i });

      // Should be unchecked by default (opt-in approach)
      await expect(analyticsCheckbox).not.toBeChecked();

      // Check analytics
      await analyticsCheckbox.click();
      await expect(analyticsCheckbox).toBeChecked();

      // Uncheck analytics again
      await analyticsCheckbox.click();
      await expect(analyticsCheckbox).not.toBeChecked();
    });

    test("should allow toggling functional preference", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      const functionalCheckbox = banner.getByRole("checkbox", { name: /functional/i });

      // Should be unchecked by default (opt-in approach)
      await expect(functionalCheckbox).not.toBeChecked();

      // Check functional
      await functionalCheckbox.click();
      await expect(functionalCheckbox).toBeChecked();

      // Uncheck functional again
      await functionalCheckbox.click();
      await expect(functionalCheckbox).not.toBeChecked();
    });

    test("should save custom preferences", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      // Enable analytics, keep functional disabled (both start unchecked)
      const analyticsCheckbox = banner.getByRole("checkbox", { name: /analytics/i });
      await analyticsCheckbox.click(); // Check analytics

      // Save preferences
      await banner.getByRole("button", { name: /save/i }).click();

      // Wait for reload
      await page.waitForLoadState("networkidle");

      // Check localStorage
      const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
      expect(consentStatus).toBe("customized");

      const preferences = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
      );
      expect(preferences.analytics).toBe(true);
      expect(preferences.functional).toBe(false);
    });

    test("should persist custom preferences across reloads", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      // Enable functional, keep analytics disabled (both start unchecked)
      await banner.getByRole("checkbox", { name: /functional/i }).click();
      await banner.getByRole("button", { name: /save/i }).click();

      // Wait for reload
      await page.waitForLoadState("networkidle");

      // Reload page manually
      await page.reload();

      // Banner should not be visible
      await expect(banner).not.toBeVisible();

      // Verify preferences persisted
      const preferences = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
      );
      expect(preferences.analytics).toBe(false);
      expect(preferences.functional).toBe(true);
    });

    test("should respect analytics preference for tracking", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      // Keep analytics disabled (it starts unchecked, so don't click it)
      await banner.getByRole("button", { name: /save/i }).click();

      // Wait for reload
      await page.waitForLoadState("networkidle");

      // Verify analytics is disabled
      const hasAnalyticsConsent = await page.evaluate(() => {
        const status = localStorage.getItem("cookie-consent");
        const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
        return status === "accepted" || (status === "customized" && prefs.analytics === true);
      });
      expect(hasAnalyticsConsent).toBe(false);
    });

    test("should return to main view when back button clicked", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /customize/i }).click();

      // Verify we're in customize view - look for heading
      await expect(banner.getByRole("heading", { name: /customize/i })).toBeVisible();

      // Click back button
      await banner.getByRole("button", { name: /back/i }).click();

      // Verify we're back in main view
      await expect(banner.getByRole("button", { name: /accept/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /reject/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /customize/i })).toBeVisible();
    });
  });

  test.describe("Change preferences", () => {
    test("should reopen banner from footer link", async ({ page }) => {
      await page.goto("/en");

      // Accept cookies first
      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /accept/i }).click();

      // Wait for reload to complete
      await page.waitForLoadState("load");
      await page.waitForLoadState("networkidle");

      // Banner should be hidden after reload
      await expect(banner).not.toBeVisible();

      // Wait a bit for page to stabilize after reload
      await page.waitForTimeout(1000);

      // Scroll to footer using a more reliable method
      await page.evaluate(() => {
        const footer = document.querySelector("footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      });
      await page.waitForTimeout(500);

      // Find and click cookie settings link in footer
      const cookieSettingsLink = page.getByRole("link", {
        name: /cookie settings/i,
      });
      await expect(cookieSettingsLink).toBeVisible();
      await cookieSettingsLink.click();

      // Banner should reappear
      await expect(banner).toBeVisible();
    });

    test("should allow changing existing consent", async ({ page }) => {
      await page.goto("/en");

      // Accept cookies first
      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await banner.getByRole("button", { name: /accept/i }).click();

      // Wait for reload to complete
      await page.waitForLoadState("load");
      await page.waitForLoadState("networkidle");

      // Wait for page to stabilize after reload
      await page.waitForTimeout(1000);

      // Scroll to footer using a more reliable method
      await page.evaluate(() => {
        const footer = document.querySelector("footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      });
      await page.waitForTimeout(500);

      // Reopen banner
      const cookieSettingsLink = page.getByRole("link", { name: /cookie settings/i });
      await expect(cookieSettingsLink).toBeVisible();
      await cookieSettingsLink.click();
      await expect(banner).toBeVisible();

      // Change to reject
      await banner.getByRole("button", { name: /reject/i }).click();

      // Verify consent changed
      const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
      expect(consentStatus).toBe("rejected");
    });
  });

  test.describe("Multi-language support", () => {
    test("should display banner in Portuguese", async ({ page }) => {
      await page.goto("/pt-BR");

      const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
      await expect(banner).toBeVisible();

      // Check Portuguese text (use .first() to avoid strict mode violations)
      await expect(banner.getByText(/cookies/i).first()).toBeVisible();
      await expect(banner.getByRole("button", { name: /aceitar/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /rejeitar/i })).toBeVisible();
    });

    test("should display banner in English", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible();

      // Check English text (use .first() to avoid strict mode violations)
      await expect(banner.getByText(/cookies/i).first()).toBeVisible();
      await expect(banner.getByRole("button", { name: /accept/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /reject/i })).toBeVisible();
    });

    test("should display banner in Spanish", async ({ page }) => {
      await page.goto("/es");

      const banner = page.getByRole("dialog", { name: /cookies|privacidad/i });
      await expect(banner).toBeVisible();

      // Check Spanish text (use .first() to avoid strict mode violations)
      await expect(banner.getByText(/cookies/i).first()).toBeVisible();
      await expect(banner.getByRole("button", { name: /aceptar/i })).toBeVisible();
      await expect(banner.getByRole("button", { name: /rechazar/i })).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible();

      // First button (Accept All) should be auto-focused when modal opens
      const acceptButton = banner.getByRole("button", { name: /accept/i });
      await expect(acceptButton).toBeFocused();

      // Tab to second button (Reject)
      await page.keyboard.press("Tab");
      const rejectButton = banner.getByRole("button", { name: /reject/i });
      await expect(rejectButton).toBeFocused();

      // Tab to third button (Customize)
      await page.keyboard.press("Tab");
      const customizeButton = banner.getByRole("button", { name: /customize/i });
      await expect(customizeButton).toBeFocused();

      // Press Enter to activate Customize
      await page.keyboard.press("Enter");
      await expect(banner.getByRole("heading", { name: /customize/i })).toBeVisible();
    });

    test("should have proper ARIA labels", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible();

      // Check ARIA attributes
      await expect(banner).toHaveAttribute("role", "dialog");
      await expect(banner).toHaveAttribute("aria-modal", "true");

      // Go to customize view
      await banner.getByRole("button", { name: /customize/i }).click();

      // Check checkboxes have labels
      const analyticsCheckbox = banner.getByRole("checkbox", { name: /analytics/i });
      await expect(analyticsCheckbox).toHaveAttribute("aria-label");
    });

    test("should trap focus in modal", async ({ page }) => {
      await page.goto("/en");

      const banner = page.getByRole("dialog", { name: /cookie|privacy/i });
      await expect(banner).toBeVisible();

      // First button should be auto-focused
      const acceptButton = banner.getByRole("button", { name: /accept/i });
      await expect(acceptButton).toBeFocused();

      // Tab through all focusable elements (3 buttons + 2 links)
      await page.keyboard.press("Tab"); // Reject button
      await page.keyboard.press("Tab"); // Customize button
      await page.keyboard.press("Tab"); // Privacy Policy link
      await page.keyboard.press("Tab"); // Cookie Policy link
      await page.keyboard.press("Tab"); // Should wrap back to Accept button

      await expect(acceptButton).toBeFocused();
    });
  });
});
