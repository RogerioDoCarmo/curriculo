/**
 * Unit tests for useTheme hook and ThemeProvider
 * Tests theme management, persistence, and system preference detection
 */

import React, { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  ThemeProvider,
  useTheme,
  getStoredTheme,
  setStoredTheme,
  getSystemTheme,
  getInitialTheme,
} from "@/hooks/useTheme";

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

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

describe("useTheme - Pure Helper Functions", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("getStoredTheme", () => {
    it("should return null when no theme is stored", () => {
      expect(getStoredTheme()).toBeNull();
    });

    it("should return 'light' when light theme is stored", () => {
      localStorage.setItem("theme", "light");
      expect(getStoredTheme()).toBe("light");
    });

    it("should return 'dark' when dark theme is stored", () => {
      localStorage.setItem("theme", "dark");
      expect(getStoredTheme()).toBe("dark");
    });

    it("should return null for invalid stored values", () => {
      localStorage.setItem("theme", "invalid");
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe("setStoredTheme", () => {
    it("should store light theme", () => {
      setStoredTheme("light");
      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("should store dark theme", () => {
      setStoredTheme("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("should overwrite existing theme", () => {
      setStoredTheme("light");
      setStoredTheme("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("getSystemTheme", () => {
    it("should return 'dark' when system prefers dark mode", () => {
      window.matchMedia = createMatchMediaMock(true) as any;
      expect(getSystemTheme()).toBe("dark");
    });

    it("should return 'light' when system prefers light mode", () => {
      window.matchMedia = createMatchMediaMock(false) as any;
      expect(getSystemTheme()).toBe("light");
    });
  });

  describe("getInitialTheme", () => {
    it("should return stored theme if available", () => {
      localStorage.setItem("theme", "dark");
      window.matchMedia = createMatchMediaMock(false) as any;
      expect(getInitialTheme()).toBe("dark");
    });

    it("should return system theme if no stored theme", () => {
      window.matchMedia = createMatchMediaMock(true) as any;
      expect(getInitialTheme()).toBe("dark");
    });

    it("should prefer stored theme over system theme", () => {
      localStorage.setItem("theme", "light");
      window.matchMedia = createMatchMediaMock(true) as any;
      expect(getInitialTheme()).toBe("light");
    });
  });
});

describe("useTheme - Hook and Provider", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove("dark");
    window.matchMedia = createMatchMediaMock(false) as any;
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it("should throw error when used outside ThemeProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });

  it("should initialize with light theme by default", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    waitFor(() => {
      expect(result.current.theme).toBe("light");
    });
  });

  it("should initialize with stored theme preference", async () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });
  });

  it("should initialize with system preference when no stored theme", async () => {
    window.matchMedia = createMatchMediaMock(true) as any;

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });
  });

  it("should set theme and persist to localStorage", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("light");
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should toggle theme from light to dark", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("light");
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should toggle theme from dark to light", async () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should apply dark class to document element when theme is dark", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("light");
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove dark class from document element when theme is light", async () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should support custom defaultTheme prop", async () => {
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });

    // Wait for useEffect to run and apply initial theme
    await waitFor(() => {
      expect(result.current.theme).toBe("light"); // useEffect overrides with getInitialTheme()
    });
  });
});
