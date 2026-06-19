/**
 * Integration tests for AnalyticsProvider with Cookie Consent
 *
 * Tests that the AnalyticsProvider correctly integrates with the cookie consent system:
 * - Analytics hooks are initialized when consent is given
 * - Analytics tracking respects consent status
 * - Consent changes affect tracking behavior
 */

import { render } from "@testing-library/react";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useTimeOnPage } from "@/hooks/useTimeOnPage";
import * as analytics from "@/lib/analytics";

// Mock the hooks
jest.mock("@/hooks/useCookieConsent");
jest.mock("@/hooks/useScrollDepth");
jest.mock("@/hooks/useTimeOnPage");
jest.mock("@/lib/analytics");

// Mock Vercel Speed Insights and Web Analytics with detectable markers
jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

jest.mock("@vercel/analytics/next", () => ({
  Analytics: () => <div data-testid="web-analytics" />,
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/en"),
}));

describe("AnalyticsProvider with Cookie Consent", () => {
  const mockUseCookieConsent = useCookieConsent as jest.MockedFunction<typeof useCookieConsent>;
  const mockUseScrollDepth = useScrollDepth as jest.MockedFunction<typeof useScrollDepth>;
  const mockUseTimeOnPage = useTimeOnPage as jest.MockedFunction<typeof useTimeOnPage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("With analytics consent", () => {
    beforeEach(() => {
      // Mock consent as granted
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "accepted",
        preferences: { essential: true, analytics: true, functional: true },
        showBanner: false,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => true),
        hasFunctionalConsent: jest.fn(() => true),
      });
    });

    it("should initialize scroll depth tracking", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(mockUseScrollDepth).toHaveBeenCalled();
    });

    it("should initialize time on page tracking", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(mockUseTimeOnPage).toHaveBeenCalled();
    });

    it("should render children correctly", () => {
      const { getByText } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should render Vercel Speed Insights when consent is granted", () => {
      const { getByTestId } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(getByTestId("speed-insights")).toBeInTheDocument();
    });

    it("should render Vercel Web Analytics when consent is granted", () => {
      const { getByTestId } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(getByTestId("web-analytics")).toBeInTheDocument();
    });
  });

  describe("Without analytics consent", () => {
    beforeEach(() => {
      // Mock consent as rejected
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "rejected",
        preferences: { essential: true, analytics: false, functional: false },
        showBanner: false,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => false),
        hasFunctionalConsent: jest.fn(() => false),
      });
    });

    it("should still initialize hooks (to avoid React hook rules violations)", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      // Hooks are always called to avoid conditional hook calls
      expect(mockUseScrollDepth).toHaveBeenCalled();
      expect(mockUseTimeOnPage).toHaveBeenCalled();
    });

    it("should render children correctly", () => {
      const { getByText } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should NOT render Vercel Speed Insights when consent is denied", () => {
      const { queryByTestId } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(queryByTestId("speed-insights")).not.toBeInTheDocument();
    });

    it("should NOT render Vercel Web Analytics when consent is denied", () => {
      const { queryByTestId } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(queryByTestId("web-analytics")).not.toBeInTheDocument();
    });
  });

  describe("Consent status: pending", () => {
    beforeEach(() => {
      // Mock consent as pending (no decision yet)
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "pending",
        preferences: { essential: true, analytics: false, functional: false },
        showBanner: true,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => false),
        hasFunctionalConsent: jest.fn(() => false),
      });
    });

    it("should initialize hooks even when consent is pending", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(mockUseScrollDepth).toHaveBeenCalled();
      expect(mockUseTimeOnPage).toHaveBeenCalled();
    });
  });

  describe("Consent status: customized with analytics enabled", () => {
    beforeEach(() => {
      // Mock consent as customized with analytics enabled
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "customized",
        preferences: { essential: true, analytics: true, functional: false },
        showBanner: false,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => true),
        hasFunctionalConsent: jest.fn(() => false),
      });
    });

    it("should initialize analytics hooks when customized with analytics enabled", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(mockUseScrollDepth).toHaveBeenCalled();
      expect(mockUseTimeOnPage).toHaveBeenCalled();
    });
  });

  describe("Consent status: customized with analytics disabled", () => {
    beforeEach(() => {
      // Mock consent as customized with analytics disabled
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "customized",
        preferences: { essential: true, analytics: false, functional: true },
        showBanner: false,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => false),
        hasFunctionalConsent: jest.fn(() => true),
      });
    });

    it("should still initialize hooks (hooks check consent internally)", () => {
      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(mockUseScrollDepth).toHaveBeenCalled();
      expect(mockUseTimeOnPage).toHaveBeenCalled();
    });
  });

  describe("Multiple children", () => {
    it("should render multiple children correctly", () => {
      mockUseCookieConsent.mockReturnValue({
        consentStatus: "accepted",
        preferences: { essential: true, analytics: true, functional: true },
        showBanner: false,
        acceptAll: jest.fn(),
        rejectAll: jest.fn(),
        saveCustomPreferences: jest.fn(),
        openBanner: jest.fn(),
        closeBanner: jest.fn(),
        hasAnalyticsConsent: jest.fn(() => true),
        hasFunctionalConsent: jest.fn(() => true),
      });

      const { getByText } = render(
        <AnalyticsProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </AnalyticsProvider>
      );

      expect(getByText("Child 1")).toBeInTheDocument();
      expect(getByText("Child 2")).toBeInTheDocument();
      expect(getByText("Child 3")).toBeInTheDocument();
    });
  });
});
