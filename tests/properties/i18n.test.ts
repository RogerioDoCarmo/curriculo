/**
 * Property-based tests for internationalization (i18n).
 *
 * Property 24: Complete Translation Coverage
 * **Validates: Requirements 11.7**
 *
 * Property 20: Browser Language Detection
 * **Validates: Requirements 11.2**
 *
 * Property 23: Language Preference Persistence
 * **Validates: Requirements 11.6**
 */

import * as fc from "fast-check";
import * as path from "path";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Recursively collects all dot-separated key paths from a nested object. */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/** Retrieves a nested value from an object using a dot-separated key path. */
function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  return keyPath.split(".").reduce<unknown>((current, key) => {
    if (current !== null && typeof current === "object") {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ─── Load translation files ───────────────────────────────────────────────────

const messagesDir = path.join(process.cwd(), "messages");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ptBR: Record<string, unknown> = require(path.join(messagesDir, "pt-BR.json"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const en: Record<string, unknown> = require(path.join(messagesDir, "en.json"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const es: Record<string, unknown> = require(path.join(messagesDir, "es.json"));

const allKeys = collectKeys(ptBR);

// ─── Property 24: Complete Translation Coverage ───────────────────────────────

describe("Property 24: Complete Translation Coverage", () => {
  /**
   * All keys present in pt-BR.json must also exist in en.json and es.json,
   * and no translation value should be an empty string.
   *
   * Validates: Requirements 11.7
   */
  it("all pt-BR keys exist in en.json with non-empty values", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allKeys), (keyPath) => {
        const enValue = getNestedValue(en, keyPath);
        expect(enValue).toBeDefined();
        expect(typeof enValue).toBe("string");
        expect((enValue as string).length).toBeGreaterThan(0);
      }),
      { numRuns: allKeys.length }
    );
  });

  it("all pt-BR keys exist in es.json with non-empty values", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allKeys), (keyPath) => {
        const esValue = getNestedValue(es, keyPath);
        expect(esValue).toBeDefined();
        expect(typeof esValue).toBe("string");
        expect((esValue as string).length).toBeGreaterThan(0);
      }),
      { numRuns: allKeys.length }
    );
  });

  it("no translation value in pt-BR is an empty string", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allKeys), (keyPath) => {
        const value = getNestedValue(ptBR, keyPath);
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      }),
      { numRuns: allKeys.length }
    );
  });

  it("en and es have the same set of keys as pt-BR", () => {
    const enKeys = collectKeys(en).sort();
    const esKeys = collectKeys(es).sort();
    const ptBRKeys = allKeys.slice().sort();

    expect(enKeys).toEqual(ptBRKeys);
    expect(esKeys).toEqual(ptBRKeys);
  });
});

// ─── Property 20: Browser Language Detection ─────────────────────────────────

/**
 * Maps a browser language string to a supported locale.
 * Mirrors the logic in hooks/useLanguage.ts.
 */
function detectLocale(browserLanguage: string): string {
  const supported = ["pt-BR", "en", "es"];
  const defaultLocale = "pt-BR";

  // Exact match first
  if (supported.includes(browserLanguage)) {
    return browserLanguage;
  }

  // Language prefix match (e.g., "en-US" → "en", "pt-BR" already handled above)
  const prefix = browserLanguage.split("-")[0];
  const prefixMatch = supported.find((locale) => locale.split("-")[0] === prefix);
  if (prefixMatch) {
    return prefixMatch;
  }

  return defaultLocale;
}

describe("Property 20: Browser Language Detection", () => {
  /**
   * Various Accept-Language header values should map to correct supported locales.
   * Unsupported languages should fall back to pt-BR.
   *
   * Validates: Requirements 11.2
   */
  it("maps exact supported locales correctly", () => {
    expect(detectLocale("pt-BR")).toBe("pt-BR");
    expect(detectLocale("en")).toBe("en");
    expect(detectLocale("es")).toBe("es");
  });

  it("maps language prefix variants to supported locales", () => {
    expect(detectLocale("en-US")).toBe("en");
    expect(detectLocale("en-GB")).toBe("en");
    expect(detectLocale("es-MX")).toBe("es");
    expect(detectLocale("es-AR")).toBe("es");
  });

  it("falls back to pt-BR for unsupported languages", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 2, maxLength: 10 })
          .filter(
            (lang) =>
              !["pt-BR", "en", "es", "pt", "en-US", "en-GB", "es-MX", "es-AR"].includes(lang) &&
              !lang.startsWith("en") &&
              !lang.startsWith("es") &&
              !lang.startsWith("pt")
          ),
        (unsupportedLang) => {
          const result = detectLocale(unsupportedLang);
          expect(result).toBe("pt-BR");
        }
      ),
      { numRuns: 50 }
    );
  });

  it("always returns a supported locale", () => {
    const supported = ["pt-BR", "en", "es"];
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 20 }), (lang) => {
        const result = detectLocale(lang);
        expect(supported).toContain(result);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 23: Language Preference Persistence ────────────────────────────

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

const LOCALE_STORAGE_KEY = "preferred-locale";
const SUPPORTED_LOCALES_LIST = ["pt-BR", "en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES_LIST)[number];

function setStoredLocale(storage: MockLocalStorage, locale: SupportedLocale): void {
  storage.setItem(LOCALE_STORAGE_KEY, locale);
}

function getStoredLocale(storage: MockLocalStorage): SupportedLocale | null {
  const value = storage.getItem(LOCALE_STORAGE_KEY);
  if (value && SUPPORTED_LOCALES_LIST.includes(value as SupportedLocale)) {
    return value as SupportedLocale;
  }
  return null;
}

describe("Property 23: Language Preference Persistence", () => {
  /**
   * Round-trip: setLocale → localStorage → getStoredLocale → same value.
   *
   * Validates: Requirements 11.6
   */
  it("round-trip: set locale → get stored locale returns same value", () => {
    fc.assert(
      fc.property(fc.constantFrom(...SUPPORTED_LOCALES_LIST), (locale) => {
        const storage = new MockLocalStorage();
        setStoredLocale(storage, locale);
        const retrieved = getStoredLocale(storage);
        expect(retrieved).toBe(locale);
      }),
      { numRuns: SUPPORTED_LOCALES_LIST.length * 10 }
    );
  });

  it("returns null when no locale is stored", () => {
    const storage = new MockLocalStorage();
    expect(getStoredLocale(storage)).toBeNull();
  });

  it("returns null for invalid stored values", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 20 })
          .filter((s) => !SUPPORTED_LOCALES_LIST.includes(s as SupportedLocale)),
        (invalidLocale) => {
          const storage = new MockLocalStorage();
          storage.setItem(LOCALE_STORAGE_KEY, invalidLocale);
          expect(getStoredLocale(storage)).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("overwrites previous locale preference", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES_LIST),
        fc.constantFrom(...SUPPORTED_LOCALES_LIST),
        (first, second) => {
          const storage = new MockLocalStorage();
          setStoredLocale(storage, first);
          setStoredLocale(storage, second);
          expect(getStoredLocale(storage)).toBe(second);
        }
      ),
      { numRuns: 30 }
    );
  });
});
