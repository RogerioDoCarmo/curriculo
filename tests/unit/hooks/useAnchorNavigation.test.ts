/**
 * Unit tests for useAnchorNavigation hook
 * Tests URL hash-based navigation, section tracking, and browser history handling
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock next/navigation
const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  usePathname: () => "/",
}));

// Mock IntersectionObserver (not available in jsdom)
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

mockIntersectionObserver.mockImplementation((_callback: IntersectionObserverCallback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: null,
  rootMargin: "",
  thresholds: [],
}));

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

// Mock window.history.pushState
const mockPushState = jest.fn();
Object.defineProperty(window, "history", {
  writable: true,
  configurable: true,
  value: {
    ...window.history,
    pushState: mockPushState,
  },
});

// Helper to simulate popstate event (browser back/forward)
// Uses window.location.hash assignment (jsdom supports this natively)
function firePopstate(hash: string) {
  window.location.hash = hash;
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// ─── Test Sections ────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS = ["home", "projects", "experience", "skills", "contact", "tech-stack"];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useAnchorNavigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset location hash using jsdom's native hash assignment
    window.location.hash = "";
  });

  // ── 1. Initial state ────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("should initialize currentSection as empty string when no hash in URL", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));
      expect(result.current.currentSection).toBe("");
    });

    it("should initialize currentSection from URL hash if present", async () => {
      window.location.hash = "#projects";

      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      await waitFor(() => {
        expect(result.current.currentSection).toBe("projects");
      });
    });

    it("should expose navigateTo and isActive functions", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));
      expect(typeof result.current.navigateTo).toBe("function");
      expect(typeof result.current.isActive).toBe("function");
    });
  });

  // ── 2. navigateTo ───────────────────────────────────────────────────────────

  describe("navigateTo", () => {
    it("should update currentSection when navigating to a valid section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      expect(result.current.currentSection).toBe("projects");
    });

    it("should update URL hash when navigating to a section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("experience");
      });

      // Either window.history.pushState or window.location.hash should be updated
      const hashUpdated =
        mockPushState.mock.calls.some((call) => String(call[2]).includes("experience")) ||
        window.location.hash === "#experience";

      expect(hashUpdated).toBe(true);
    });

    it("should navigate to all supported sections", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      for (const section of DEFAULT_SECTIONS) {
        act(() => {
          result.current.navigateTo(section);
        });
        expect(result.current.currentSection).toBe(section);
      }
    });

    it("should update currentSection to the most recently navigated section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("skills");
      });
      expect(result.current.currentSection).toBe("skills");

      act(() => {
        result.current.navigateTo("contact");
      });
      expect(result.current.currentSection).toBe("contact");
    });
  });

  // ── 3. isActive ─────────────────────────────────────────────────────────────

  describe("isActive", () => {
    it("should return true for the current section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      expect(result.current.isActive("projects")).toBe(true);
    });

    it("should return false for a non-current section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      expect(result.current.isActive("experience")).toBe(false);
      expect(result.current.isActive("skills")).toBe(false);
      expect(result.current.isActive("contact")).toBe(false);
    });

    it("should return false for all sections when currentSection is empty", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      // No navigation yet, currentSection is ""
      for (const section of DEFAULT_SECTIONS) {
        expect(result.current.isActive(section)).toBe(false);
      }
    });

    it("should update isActive correctly after navigation change", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("skills");
      });
      expect(result.current.isActive("skills")).toBe(true);
      expect(result.current.isActive("contact")).toBe(false);

      act(() => {
        result.current.navigateTo("contact");
      });
      expect(result.current.isActive("skills")).toBe(false);
      expect(result.current.isActive("contact")).toBe(true);
    });
  });

  // ── 4. popstate (browser back/forward) ─────────────────────────────────────

  describe("popstate event", () => {
    it("should update currentSection when browser navigates back/forward", async () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        firePopstate("#experience");
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("experience");
      });
    });

    it("should update currentSection to empty string when hash is cleared", async () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      act(() => {
        firePopstate("");
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("");
      });
    });

    it("should handle popstate with unknown section gracefully", async () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      // Should not throw
      act(() => {
        firePopstate("#unknown-section");
      });

      // currentSection should remain unchanged or be set to empty
      await waitFor(() => {
        const section = result.current.currentSection;
        expect(DEFAULT_SECTIONS.includes(section) || section === "").toBe(true);
      });
    });
  });

  // ── 5. Invalid section handling ─────────────────────────────────────────────

  describe("invalid section handling", () => {
    it("should handle navigateTo with a section not in the sections array gracefully", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      // Should not throw
      expect(() => {
        act(() => {
          result.current.navigateTo("invalid-section");
        });
      }).not.toThrow();
    });

    it("should not update currentSection to an invalid section", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      act(() => {
        result.current.navigateTo("not-a-real-section");
      });

      // currentSection should remain "projects" (or be empty), not "not-a-real-section"
      expect(result.current.currentSection).not.toBe("not-a-real-section");
    });

    it("should handle empty string as section gracefully", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      expect(() => {
        act(() => {
          result.current.navigateTo("");
        });
      }).not.toThrow();
    });
  });

  // ── 6. Sections array respected ─────────────────────────────────────────────

  describe("sections array", () => {
    it("should only track sections provided in the sections array", () => {
      const customSections = ["home", "about", "portfolio"];
      const { result } = renderHook(() => useAnchorNavigation(customSections));

      act(() => {
        result.current.navigateTo("about");
      });
      expect(result.current.currentSection).toBe("about");
      expect(result.current.isActive("about")).toBe(true);
    });

    it("should work with a single section", () => {
      const { result } = renderHook(() => useAnchorNavigation(["home"]));

      act(() => {
        result.current.navigateTo("home");
      });
      expect(result.current.currentSection).toBe("home");
      expect(result.current.isActive("home")).toBe(true);
    });

    it("should work with an empty sections array", () => {
      expect(() => {
        renderHook(() => useAnchorNavigation([]));
      }).not.toThrow();
    });
  });

  // ── 7. Locale-aware URL handling ─────────────────────────────────────────────

  describe("locale-aware URL handling", () => {
    it("should call history.pushState with a URL containing the section hash", () => {
      const { result } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      act(() => {
        result.current.navigateTo("projects");
      });

      expect(mockPushState).toHaveBeenCalled();
      const lastCall = mockPushState.mock.calls[mockPushState.mock.calls.length - 1];
      // The URL argument (3rd param) should contain the section hash
      expect(String(lastCall[2])).toContain("projects");
    });
  });

  // ── 8. SSR safety ────────────────────────────────────────────────────────────

  describe("SSR safety", () => {
    it("should not throw when sections array is empty", () => {
      expect(() => {
        renderHook(() => useAnchorNavigation([]));
      }).not.toThrow();
    });

    it("should return stable function references", () => {
      const { result, rerender } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      const navigateTo1 = result.current.navigateTo;
      const isActive1 = result.current.isActive;

      rerender();

      expect(result.current.navigateTo).toBe(navigateTo1);
      expect(result.current.isActive).toBe(isActive1);
    });
  });

  // ── 9. Cleanup ───────────────────────────────────────────────────────────────

  describe("cleanup", () => {
    it("should disconnect IntersectionObserver on unmount", () => {
      const { unmount } = renderHook(() => useAnchorNavigation(DEFAULT_SECTIONS));

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
