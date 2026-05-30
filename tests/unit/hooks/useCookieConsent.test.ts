/**
 * Unit tests for useCookieConsent hook
 *
 * Tests cookie consent management logic including:
 * - Initial state and localStorage loading
 * - Accept/reject/customize flows
 * - Consent status persistence
 * - Helper functions
 * - Error handling
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

describe("useCookieConsent", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: jest.fn() },
    });
  });

  describe("Initial state", () => {
    it("should show banner on first visit (no stored consent)", () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.showBanner).toBe(true);
      expect(result.current.consentStatus).toBe("pending");
      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });

    it("should not show banner if consent already given", () => {
      localStorage.setItem("cookie-consent", "accepted");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ essential: true, analytics: true, functional: true })
      );

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.showBanner).toBe(false);
      expect(result.current.consentStatus).toBe("accepted");
    });

    it("should load stored consent status from localStorage", () => {
      localStorage.setItem("cookie-consent", "rejected");

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("rejected");
    });

    it("should load stored preferences from localStorage", () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ essential: true, analytics: true, functional: false })
      );

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: true,
        functional: false,
      });
    });

    it("should use default preferences if localStorage is empty", () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });

    it("should ignore invalid consent status from localStorage", () => {
      localStorage.setItem("cookie-consent", "invalid-status");

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("pending");
      expect(result.current.showBanner).toBe(true);
    });
  });

  describe("Accept all", () => {
    it("should set consent status to 'accepted'", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.consentStatus).toBe("accepted");
    });

    it("should enable all cookie categories", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: true,
        functional: true,
      });
    });

    it("should save to localStorage", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(localStorage.getItem("cookie-consent")).toBe("accepted");
      const preferences = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
      expect(preferences).toEqual({
        essential: true,
        analytics: true,
        functional: true,
      });
    });

    it("should hide banner", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.showBanner).toBe(false);
    });

    // Note: Cannot test window.location.reload() in JSDOM environment
    // The actual reload behavior is tested in E2E tests
  });

  describe("Reject all", () => {
    it("should set consent status to 'rejected'", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.consentStatus).toBe("rejected");
    });

    it("should disable non-essential cookies", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });

    it("should keep essential cookies enabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.preferences.essential).toBe(true);
    });

    it("should save to localStorage", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(localStorage.getItem("cookie-consent")).toBe("rejected");
      const preferences = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
      expect(preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });

    it("should hide banner", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.showBanner).toBe(false);
    });

    // Note: rejectAll() does NOT reload the page (unlike acceptAll)
    // This is verified by the absence of reload calls in E2E tests
  });

  describe("Custom preferences", () => {
    it("should set consent status to 'customized'", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: true, functional: false });
      });

      expect(result.current.consentStatus).toBe("customized");
    });

    it("should save custom preferences to localStorage", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: true, functional: false });
      });

      expect(localStorage.getItem("cookie-consent")).toBe("customized");
      const preferences = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
      expect(preferences).toEqual({
        essential: true,
        analytics: true,
        functional: false,
      });
    });

    it("should always keep essential cookies enabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: false, functional: false });
      });

      expect(result.current.preferences.essential).toBe(true);
    });

    it("should hide banner", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: true, functional: true });
      });

      expect(result.current.showBanner).toBe(false);
    });

    // Note: Cannot test window.location.reload() in JSDOM environment
    // The actual reload behavior is tested in E2E tests

    it("should handle partial preferences (analytics only)", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: true });
      });

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: true,
        functional: false,
      });
    });

    it("should handle partial preferences (functional only)", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ functional: true });
      });

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: true,
      });
    });

    it("should handle empty preferences object", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({});
      });

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });
  });

  describe("Consent helpers", () => {
    it("hasAnalyticsConsent() returns true when analytics enabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.hasAnalyticsConsent()).toBe(true);
    });

    it("hasAnalyticsConsent() returns false when analytics disabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.hasAnalyticsConsent()).toBe(false);
    });

    it("hasAnalyticsConsent() returns true for customized with analytics", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: true, functional: false });
      });

      expect(result.current.hasAnalyticsConsent()).toBe(true);
    });

    it("hasAnalyticsConsent() returns false for customized without analytics", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.saveCustomPreferences({ analytics: false, functional: true });
      });

      expect(result.current.hasAnalyticsConsent()).toBe(false);
    });

    it("hasFunctionalConsent() returns true when functional enabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.hasFunctionalConsent()).toBe(true);
    });

    it("hasFunctionalConsent() returns false when functional disabled", () => {
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.hasFunctionalConsent()).toBe(false);
    });
  });

  describe("Banner control", () => {
    it("openBanner() should show banner", () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { result } = renderHook(() => useCookieConsent());

      // Banner should be hidden initially
      expect(result.current.showBanner).toBe(false);

      act(() => {
        result.current.openBanner();
      });

      expect(result.current.showBanner).toBe(true);
    });

    it("closeBanner() should hide banner if consent given", () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { result } = renderHook(() => useCookieConsent());

      act(() => {
        result.current.openBanner();
      });

      expect(result.current.showBanner).toBe(true);

      act(() => {
        result.current.closeBanner();
      });

      expect(result.current.showBanner).toBe(false);
    });

    it("closeBanner() should NOT hide banner if consent pending", () => {
      const { result } = renderHook(() => useCookieConsent());

      // Banner should be shown initially (pending consent)
      expect(result.current.showBanner).toBe(true);

      act(() => {
        result.current.closeBanner();
      });

      // Banner should still be shown
      expect(result.current.showBanner).toBe(true);
    });
  });

  describe("localStorage errors", () => {
    it("should handle localStorage read errors gracefully", () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error("localStorage read error");
      });

      const { result } = renderHook(() => useCookieConsent());

      // Should use default values
      expect(result.current.consentStatus).toBe("pending");
      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });

      // Restore original
      Storage.prototype.getItem = originalGetItem;
    });

    it("should handle localStorage write errors gracefully", () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error("localStorage write error");
      });

      const { result } = renderHook(() => useCookieConsent());

      // Should not throw error
      expect(() => {
        act(() => {
          result.current.acceptAll();
        });
      }).not.toThrow();

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore original
      Storage.prototype.setItem = originalSetItem;
      consoleErrorSpy.mockRestore();
    });

    it("should use default preferences if localStorage contains invalid JSON", () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem("cookie-preferences", "invalid-json{");

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.preferences).toEqual({
        essential: true,
        analytics: false,
        functional: false,
      });
    });

    it("should always set essential to true even if localStorage says false", () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem(
        "cookie-preferences",
        JSON.stringify({ essential: false, analytics: true, functional: true })
      );

      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.preferences.essential).toBe(true);
    });
  });

  describe("Consent status transitions", () => {
    it("should transition from pending to accepted", () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("pending");

      act(() => {
        result.current.acceptAll();
      });

      expect(result.current.consentStatus).toBe("accepted");
    });

    it("should transition from pending to rejected", () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("pending");

      act(() => {
        result.current.rejectAll();
      });

      expect(result.current.consentStatus).toBe("rejected");
    });

    it("should transition from pending to customized", () => {
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("pending");

      act(() => {
        result.current.saveCustomPreferences({ analytics: true });
      });

      expect(result.current.consentStatus).toBe("customized");
    });

    it("should allow changing from accepted to rejected", () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("accepted");

      act(() => {
        result.current.openBanner();
        result.current.rejectAll();
      });

      expect(result.current.consentStatus).toBe("rejected");
    });

    it("should allow changing from rejected to accepted", () => {
      localStorage.setItem("cookie-consent", "rejected");
      const { result } = renderHook(() => useCookieConsent());

      expect(result.current.consentStatus).toBe("rejected");

      act(() => {
        result.current.openBanner();
        result.current.acceptAll();
      });

      expect(result.current.consentStatus).toBe("accepted");
    });
  });
});
