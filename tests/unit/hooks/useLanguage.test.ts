/**
 * Unit tests for useLanguage hook
 * Tests locale detection, persistence, and navigation
 */

import { renderHook, act } from "@testing-library/react";
import {
  useLanguage,
  detectLocale,
  getStoredLocale,
  setStoredLocale,
  detectBrowserLocale,
} from "@/hooks/useLanguage";

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = "/";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("useLanguage - Helper Functions", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("detectLocale", () => {
    it("should return exact match for supported locale", () => {
      expect(detectLocale("pt-BR")).toBe("pt-BR");
      expect(detectLocale("en")).toBe("en");
      expect(detectLocale("es")).toBe("es");
    });

    it("should match language prefix when exact match not found", () => {
      expect(detectLocale("en-US")).toBe("en");
      expect(detectLocale("en-GB")).toBe("en");
      expect(detectLocale("es-ES")).toBe("es");
      expect(detectLocale("es-MX")).toBe("es");
    });

    it("should fallback to pt-BR for unsupported languages", () => {
      expect(detectLocale("fr")).toBe("pt-BR");
      expect(detectLocale("de")).toBe("pt-BR");
      expect(detectLocale("ja")).toBe("pt-BR");
      expect(detectLocale("zh-CN")).toBe("pt-BR");
    });

    it("should handle empty string", () => {
      expect(detectLocale("")).toBe("pt-BR");
    });
  });

  describe("getStoredLocale", () => {
    it("should return null when no locale is stored", () => {
      expect(getStoredLocale()).toBeNull();
    });

    it("should return stored locale when valid", () => {
      localStorage.setItem("preferred-locale", "en");
      expect(getStoredLocale()).toBe("en");
    });

    it("should return null for invalid stored locale", () => {
      localStorage.setItem("preferred-locale", "invalid");
      expect(getStoredLocale()).toBeNull();
    });

    it("should handle all supported locales", () => {
      localStorage.setItem("preferred-locale", "pt-BR");
      expect(getStoredLocale()).toBe("pt-BR");

      localStorage.setItem("preferred-locale", "en");
      expect(getStoredLocale()).toBe("en");

      localStorage.setItem("preferred-locale", "es");
      expect(getStoredLocale()).toBe("es");
    });
  });

  describe("setStoredLocale", () => {
    it("should store locale preference", () => {
      setStoredLocale("en");
      expect(localStorage.getItem("preferred-locale")).toBe("en");
    });

    it("should overwrite existing locale", () => {
      setStoredLocale("pt-BR");
      setStoredLocale("es");
      expect(localStorage.getItem("preferred-locale")).toBe("es");
    });

    it("should store all supported locales", () => {
      setStoredLocale("pt-BR");
      expect(localStorage.getItem("preferred-locale")).toBe("pt-BR");

      setStoredLocale("en");
      expect(localStorage.getItem("preferred-locale")).toBe("en");

      setStoredLocale("es");
      expect(localStorage.getItem("preferred-locale")).toBe("es");
    });
  });

  describe("detectBrowserLocale", () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        writable: true,
      });
    });

    it("should detect browser language and map to supported locale", () => {
      Object.defineProperty(global, "navigator", {
        value: { language: "en-US" },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe("en");
    });

    it("should fallback to pt-BR for unsupported browser language", () => {
      Object.defineProperty(global, "navigator", {
        value: { language: "fr-FR" },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe("pt-BR");
    });

    it("should handle exact locale match", () => {
      Object.defineProperty(global, "navigator", {
        value: { language: "pt-BR" },
        writable: true,
      });
      expect(detectBrowserLocale()).toBe("pt-BR");
    });
  });
});

describe("useLanguage - Hook", () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockPush.mockClear();
    Object.defineProperty(global, "navigator", {
      value: { language: "pt-BR" },
      writable: true,
    });
  });

  it("should initialize with current locale", () => {
    const { result } = renderHook(() => useLanguage("pt-BR"));
    expect(result.current.locale).toBe("pt-BR");
  });

  it("should provide available locales", () => {
    const { result } = renderHook(() => useLanguage("pt-BR"));
    expect(result.current.availableLocales).toEqual(["pt-BR", "en", "es"]);
  });

  it("should change locale and persist to localStorage", () => {
    const { result } = renderHook(() => useLanguage("pt-BR"));

    act(() => {
      result.current.setLocale("en");
    });

    expect(result.current.locale).toBe("en");
    expect(localStorage.getItem("preferred-locale")).toBe("en");
  });

  it("should navigate to new locale path", () => {
    const { result } = renderHook(() => useLanguage("pt-BR"));

    act(() => {
      result.current.setLocale("en");
    });

    expect(mockPush).toHaveBeenCalled();
  });

  it("carries the query string and hash across a locale switch", () => {
    // A shared project deep link (?project=<id>#projects) must survive the
    // switch, or changing language would silently close the open dialog.
    window.history.replaceState(null, "", "/?project=miroji#projects");
    const { result } = renderHook(() => useLanguage("pt-BR"));

    act(() => {
      result.current.setLocale("en");
    });

    expect(mockPush).toHaveBeenCalledWith("/en/?project=miroji#projects");
    window.history.replaceState(null, "", "/");
  });

  it("navigates cleanly when there is no query string or hash", () => {
    window.history.replaceState(null, "", "/");
    const { result } = renderHook(() => useLanguage("pt-BR"));

    act(() => {
      result.current.setLocale("es");
    });

    expect(mockPush).toHaveBeenCalledWith("/es/");
  });

  it("should reflect currentLocale even when a different locale is saved", () => {
    localStorage.setItem("preferred-locale", "es");

    const { result } = renderHook(() => useLanguage("pt-BR"));

    // The displayed locale must always match what's actually rendered (the
    // URL-derived currentLocale), never silently diverge to a stale
    // localStorage value without navigating.
    expect(result.current.locale).toBe("pt-BR");
  });

  it("should update locale state when currentLocale prop changes", () => {
    const { result, rerender } = renderHook(
      (locale: "pt-BR" | "en" | "es") => useLanguage(locale),
      {
        initialProps: "pt-BR",
      }
    );
    expect(result.current.locale).toBe("pt-BR");

    rerender("en");
    expect(result.current.locale).toBe("en");
  });

  it("should support switching between all locales", () => {
    const { result } = renderHook(() => useLanguage("pt-BR"));

    act(() => {
      result.current.setLocale("en");
    });
    expect(result.current.locale).toBe("en");

    act(() => {
      result.current.setLocale("es");
    });
    expect(result.current.locale).toBe("es");

    act(() => {
      result.current.setLocale("pt-BR");
    });
    expect(result.current.locale).toBe("pt-BR");
  });
});
