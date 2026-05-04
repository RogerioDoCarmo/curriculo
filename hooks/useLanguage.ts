"use client";

/**
 * useLanguage hook — manages locale state, browser language detection,
 * and persistence to localStorage.
 *
 * Requirements: 11.2, 11.3, 11.4, 11.6
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from "@/types/index";

const LOCALE_STORAGE_KEY = "preferred-locale";

// ─── Helpers (exported for testing) ──────────────────────────────────────────

/**
 * Detects the best matching supported locale from a browser language string.
 * Falls back to pt-BR for unsupported languages.
 */
export function detectLocale(browserLanguage: string): SupportedLocale {
  // Exact match
  if (SUPPORTED_LOCALES.includes(browserLanguage as SupportedLocale)) {
    return browserLanguage as SupportedLocale;
  }

  // Language prefix match (e.g., "en-US" → "en")
  const prefix = browserLanguage.split("-")[0];
  const prefixMatch = SUPPORTED_LOCALES.find((locale) => locale.split("-")[0] === prefix);
  if (prefixMatch) {
    return prefixMatch;
  }

  return DEFAULT_LOCALE;
}

/**
 * Reads the stored locale preference from localStorage.
 * Returns null if not set or invalid.
 */
export function getStoredLocale(): SupportedLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (value && SUPPORTED_LOCALES.includes(value as SupportedLocale)) {
      return value as SupportedLocale;
    }
  } catch {
    // localStorage may be unavailable (e.g., private browsing restrictions)
  }
  return null;
}

/**
 * Persists the locale preference to localStorage.
 */
export function setStoredLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore write errors
  }
}

/**
 * Detects the browser's preferred language and maps it to a supported locale.
 * Falls back to pt-BR if the browser language is not supported.
 */
export function detectBrowserLocale(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const browserLang = navigator.language || DEFAULT_LOCALE;
  return detectLocale(browserLang);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseLanguageReturn {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  availableLocales: SupportedLocale[];
}

/**
 * Manages locale state with browser detection and localStorage persistence.
 *
 * Priority order:
 * 1. Saved localStorage preference
 * 2. Browser language detection
 * 3. Default locale (pt-BR)
 */
export function useLanguage(currentLocale: SupportedLocale): UseLanguageReturn {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize with the correct locale from the start
  // This ensures the language selector displays the right language immediately
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window === "undefined") return currentLocale;

    // Check for saved preference first - this takes priority
    const saved = getStoredLocale();
    if (saved) return saved;

    // Otherwise use the current locale from URL
    return currentLocale;
  });

  // Sync state with currentLocale only when currentLocale changes AND
  // there's no saved preference (to respect user's explicit choice)
  useEffect(() => {
    const saved = getStoredLocale();
    // Only update if there's no saved preference and currentLocale differs
    if (!saved && locale !== currentLocale) {
      setLocaleState(currentLocale);
    }
  }, [currentLocale, locale]);

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      setLocaleState(newLocale);
      setStoredLocale(newLocale);

      // Navigate to the new locale using next-intl router
      // Replace the current locale segment in the pathname
      const segments = pathname.split("/");
      const localeIndex = SUPPORTED_LOCALES.includes(segments[1] as SupportedLocale) ? 1 : -1;

      if (localeIndex !== -1) {
        segments[1] = newLocale === DEFAULT_LOCALE ? "" : newLocale;
        const newPath = segments.filter(Boolean).join("/") || "/";
        router.push(`/${newPath}`);
      } else {
        router.push(`/${newLocale === DEFAULT_LOCALE ? "" : newLocale + "/"}${pathname}`);
      }
    },
    [pathname, router]
  );

  return {
    locale,
    setLocale,
    availableLocales: [...SUPPORTED_LOCALES],
  };
}
