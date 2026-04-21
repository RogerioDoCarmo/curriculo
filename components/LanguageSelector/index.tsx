"use client";

/**
 * LanguageSelector component — dropdown for switching between supported locales.
 *
 * Features:
 * - Supports Brazilian Portuguese (pt-BR), English (en), and Spanish (es)
 * - Flag icons for visual recognition
 * - Persists language preference to localStorage
 * - Detects browser language on first visit
 * - Keyboard accessible with proper ARIA labels
 * - Integrates with next-intl for internationalization
 *
 * Requirements: 11.5
 *
 * @example
 * ```tsx
 * <LanguageSelector currentLocale="pt-BR" />
 * ```
 *
 * @example
 * ```tsx
 * <LanguageSelector currentLocale="en" className="shadow-lg" />
 * ```
 */

import { useLanguage } from "@/hooks/useLanguage";
import type { SupportedLocale } from "@/types/index";

/** Maps locale codes to flag emojis and display labels. */
const LOCALE_META: Record<SupportedLocale, { flag: string; label: string }> = {
  "pt-BR": { flag: "🇧🇷", label: "Português (BR)" },
  en: { flag: "🇺🇸", label: "English" },
  es: { flag: "🇪🇸", label: "Español" },
};

/**
 * LanguageSelector component props
 */
interface LanguageSelectorProps {
  /** Currently selected locale */
  currentLocale: SupportedLocale;
  /** Additional CSS classes to apply */
  className?: string;
}

export default function LanguageSelector({ currentLocale, className = "" }: LanguageSelectorProps) {
  const { locale, setLocale, availableLocales } = useLanguage(currentLocale);
  const current = LOCALE_META[locale];

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLocale(event.target.value as SupportedLocale);
  }

  return (
    <div className={`relative inline-flex items-center print:hidden ${className}`}>
      <label htmlFor="language-selector" className="sr-only">
        {/* Accessible label — visible only to screen readers */}
        Select language
      </label>
      <span aria-hidden="true" className="mr-1 text-base">
        {current.flag}
      </span>
      <select
        id="language-selector"
        value={locale}
        onChange={handleChange}
        aria-label="Select language"
        className="
          appearance-none bg-transparent
          text-sm font-medium
          text-foreground
          border border-border rounded-md
          px-2 py-1 pr-6
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-ring
          transition-colors duration-200
          hover:bg-accent hover:text-accent-foreground
        "
      >
        {availableLocales.map((loc) => {
          const meta = LOCALE_META[loc];
          return (
            <option key={loc} value={loc}>
              {meta.flag} {meta.label}
            </option>
          );
        })}
      </select>
      {/* Dropdown chevron */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
      >
        ▾
      </span>
    </div>
  );
}
