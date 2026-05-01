"use client";

/**
 * useTheme hook and ThemeProvider — manages light/dark theme state.
 *
 * - Detects system preference via window.matchMedia('(prefers-color-scheme: dark)')
 * - Persists to localStorage with key 'theme'
 * - Applies/removes 'dark' class on document.documentElement
 *
 * Requirements: 17.1, 17.2, 17.4, 17.7
 */

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Theme } from "@/types/index";

const THEME_STORAGE_KEY = "theme";

// ─── Pure helpers (exported for testing) ─────────────────────────────────────

/**
 * Reads the stored theme from localStorage.
 * Returns null if not set or invalid.
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/**
 * Persists the theme to localStorage.
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore write errors
  }
}

/**
 * Detects the system's preferred color scheme.
 * Returns 'dark' if the system prefers dark mode, 'light' otherwise.
 */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Determines the initial theme:
 * 1. Saved localStorage preference
 * 2. System prefers-color-scheme
 * 3. Default: 'light'
 */
export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

/**
 * Applies or removes the 'dark' class on document.documentElement.
 */
function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: Theme;
}

/**
 * ThemeProvider — wraps the app and provides theme context.
 * Must be used as a client component.
 *
 * Note: The theme class is applied via inline script in layout.tsx before React hydration
 * to prevent FOUC. This may cause a hydration warning which is suppressed via
 * suppressHydrationWarning on the html/body tags.
 */
export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme ?? "light");

  // On mount, read saved preference or detect system preference
  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      setStoredTheme(next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTheme — access theme state and controls from any client component.
 * Must be used inside a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
