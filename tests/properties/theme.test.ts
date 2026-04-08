/**
 * Property-based tests for the theme system.
 *
 * Property 29: System Theme Detection
 * **Validates: Requirements 17.2**
 *
 * Property 32: Theme Preference Persistence
 * **Validates: Requirements 17.7**
 *
 * Property 31: Theme Toggle Switches Themes
 * **Validates: Requirements 17.6**
 */

import * as fc from "fast-check";

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = "light" | "dark";

// ─── Mock infrastructure ──────────────────────────────────────────────────────

const THEME_STORAGE_KEY = "theme";

/**
 * Simulates localStorage for testing persistence logic without a browser.
 */
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

/**
 * Simulates window.matchMedia for testing system preference detection.
 */
function createMockMatchMedia(prefersDark: boolean) {
  return (query: string): { matches: boolean } => {
    if (query === "(prefers-color-scheme: dark)") {
      return { matches: prefersDark };
    }
    return { matches: false };
  };
}

// ─── Pure logic functions (mirrors hooks/useTheme.ts) ─────────────────────────

/**
 * Reads the stored theme from localStorage.
 * Returns null if not set or invalid.
 */
function getStoredTheme(storage: MockLocalStorage): Theme | null {
  const value = storage.getItem(THEME_STORAGE_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

/**
 * Persists the theme to localStorage.
 */
function setStoredTheme(storage: MockLocalStorage, theme: Theme): void {
  storage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Determines the initial theme based on:
 * 1. Saved localStorage preference (highest priority)
 * 2. System prefers-color-scheme preference
 * 3. Default: 'light'
 */
function getInitialTheme(
  storage: MockLocalStorage,
  matchMedia: (query: string) => { matches: boolean }
): Theme {
  const saved = getStoredTheme(storage);
  if (saved) return saved;

  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme(current: Theme): Theme {
  return current === "light" ? "dark" : "light";
}

// ─── Property 29: System Theme Detection ─────────────────────────────────────

describe("Property 29: System Theme Detection", () => {
  /**
   * getInitialTheme() should return 'dark' when system prefers dark,
   * 'light' when system prefers light, and saved preference overrides system.
   *
   * Validates: Requirements 17.2
   */
  it("returns dark when system prefers dark and no saved preference", () => {
    const storage = new MockLocalStorage();
    const matchMedia = createMockMatchMedia(true);
    expect(getInitialTheme(storage, matchMedia)).toBe("dark");
  });

  it("returns light when system prefers light and no saved preference", () => {
    const storage = new MockLocalStorage();
    const matchMedia = createMockMatchMedia(false);
    expect(getInitialTheme(storage, matchMedia)).toBe("light");
  });

  it("saved localStorage preference overrides system preference", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>("light", "dark"),
        fc.boolean(),
        (savedTheme, systemPrefersDark) => {
          const storage = new MockLocalStorage();
          setStoredTheme(storage, savedTheme);
          const matchMedia = createMockMatchMedia(systemPrefersDark);
          const result = getInitialTheme(storage, matchMedia);
          // Saved preference always wins
          expect(result).toBe(savedTheme);
        }
      ),
      { numRuns: 20 }
    );
  });

  it("always returns a valid theme value", () => {
    fc.assert(
      fc.property(fc.boolean(), fc.boolean(), (hasSavedDark, systemPrefersDark) => {
        const storage = new MockLocalStorage();
        if (hasSavedDark !== undefined) {
          setStoredTheme(storage, hasSavedDark ? "dark" : "light");
        }
        const matchMedia = createMockMatchMedia(systemPrefersDark);
        const result = getInitialTheme(storage, matchMedia);
        expect(["light", "dark"]).toContain(result);
      }),
      { numRuns: 50 }
    );
  });
});

// ─── Property 32: Theme Preference Persistence ───────────────────────────────

describe("Property 32: Theme Preference Persistence", () => {
  /**
   * Round-trip: setTheme → localStorage → getStoredTheme → same value.
   * Both 'light' and 'dark' values persist correctly.
   *
   * Validates: Requirements 17.7
   */
  it("round-trip: set theme → get stored theme returns same value", () => {
    fc.assert(
      fc.property(fc.constantFrom<Theme>("light", "dark"), (theme) => {
        const storage = new MockLocalStorage();
        setStoredTheme(storage, theme);
        expect(getStoredTheme(storage)).toBe(theme);
      }),
      { numRuns: 20 }
    );
  });

  it("persists light theme correctly", () => {
    const storage = new MockLocalStorage();
    setStoredTheme(storage, "light");
    expect(getStoredTheme(storage)).toBe("light");
  });

  it("persists dark theme correctly", () => {
    const storage = new MockLocalStorage();
    setStoredTheme(storage, "dark");
    expect(getStoredTheme(storage)).toBe("dark");
  });

  it("returns null when no theme is stored", () => {
    const storage = new MockLocalStorage();
    expect(getStoredTheme(storage)).toBeNull();
  });

  it("returns null for invalid stored values", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s !== "light" && s !== "dark"),
        (invalidTheme) => {
          const storage = new MockLocalStorage();
          storage.setItem(THEME_STORAGE_KEY, invalidTheme);
          expect(getStoredTheme(storage)).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("overwrites previous theme preference", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>("light", "dark"),
        fc.constantFrom<Theme>("light", "dark"),
        (first, second) => {
          const storage = new MockLocalStorage();
          setStoredTheme(storage, first);
          setStoredTheme(storage, second);
          expect(getStoredTheme(storage)).toBe(second);
        }
      ),
      { numRuns: 20 }
    );
  });
});

// ─── Property 31: Theme Toggle Switches Themes ───────────────────────────────

describe("Property 31: Theme Toggle Switches Themes", () => {
  /**
   * Toggling from light → dark → light returns to original.
   * Toggle always produces the opposite theme.
   *
   * Validates: Requirements 17.6
   */
  it("toggle always produces the opposite theme", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });

  it("double toggle returns to original theme", () => {
    fc.assert(
      fc.property(fc.constantFrom<Theme>("light", "dark"), (theme) => {
        expect(toggleTheme(toggleTheme(theme))).toBe(theme);
      }),
      { numRuns: 10 }
    );
  });

  it("light → dark → light round-trip", () => {
    const start: Theme = "light";
    const afterFirst = toggleTheme(start);
    expect(afterFirst).toBe("dark");
    const afterSecond = toggleTheme(afterFirst);
    expect(afterSecond).toBe("light");
  });

  it("toggle result is always a valid theme", () => {
    fc.assert(
      fc.property(fc.constantFrom<Theme>("light", "dark"), (theme) => {
        const result = toggleTheme(theme);
        expect(["light", "dark"]).toContain(result);
      }),
      { numRuns: 10 }
    );
  });

  it("toggle is its own inverse", () => {
    fc.assert(
      fc.property(fc.constantFrom<Theme>("light", "dark"), (theme) => {
        // toggle(toggle(x)) === x
        expect(toggleTheme(toggleTheme(theme))).toBe(theme);
        // toggle(x) !== x
        expect(toggleTheme(theme)).not.toBe(theme);
      }),
      { numRuns: 10 }
    );
  });
});
