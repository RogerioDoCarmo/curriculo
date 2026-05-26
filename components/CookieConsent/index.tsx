"use client";

/**
 * Cookie Consent Banner Component
 *
 * GDPR/LGPD compliant cookie consent banner with opt-in approach.
 * Displays on first visit and allows users to accept/reject/customize cookies.
 *
 * Requirements: 10.1, 10.3, 11.7
 */

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useCookieConsent, type CookiePreferences } from "@/hooks/useCookieConsent";

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const {
    showBanner,
    preferences,
    acceptAll,
    rejectAll,
    saveCustomPreferences,
    closeBanner: _closeBanner,
  } = useCookieConsent();

  const [showCustomize, setShowCustomize] = useState(false);
  const [customPrefs, setCustomPrefs] = useState<Partial<CookiePreferences>>({
    analytics: preferences.analytics,
    functional: preferences.functional,
  });

  // Refs for focus management
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const lastButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus first button when banner opens
  useEffect(() => {
    if (showBanner && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [showBanner, showCustomize]);

  // Focus trap
  useEffect(() => {
    if (!showBanner) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showBanner]);

  if (!showBanner) return null;

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    saveCustomPreferences(customPrefs);
  };

  const handleBack = () => {
    setShowCustomize(false);
  };

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
        {!showCustomize ? (
          // Main banner view
          <>
            <h2
              id="cookie-consent-title"
              className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              {t("title")}
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">{t("description")}</p>

            {/* Cookie categories summary */}
            <div className="mb-6 space-y-3 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("essential")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("essentialDescription")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("analytics")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("analyticsDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                ref={firstButtonRef}
                onClick={acceptAll}
                className="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 rounded-md border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("rejectAll")}
              </button>
              <button
                ref={lastButtonRef}
                onClick={handleCustomize}
                className="flex-1 rounded-md border-2 border-primary-600 bg-white px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-primary-400 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-primary-900/20"
              >
                {t("customize")}
              </button>
            </div>

            {/* Privacy policy link */}
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              {t("learnMore")}{" "}
              <a
                href="/privacy"
                className="text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t("privacyPolicy")}
              </a>{" "}
              {t("and")}{" "}
              <a
                href="/cookies"
                className="text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t("cookiePolicy")}
              </a>
            </p>
          </>
        ) : (
          // Customize view
          <>
            <div className="mb-4 flex items-center gap-2">
              <button
                ref={firstButtonRef}
                onClick={handleBack}
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label={t("back")}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2
                id="cookie-consent-title"
                className="text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                {t("customizeTitle")}
              </h2>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              {t("customizeDescription")}
            </p>

            {/* Cookie preferences */}
            <div className="mb-6 space-y-4">
              {/* Essential cookies - always enabled */}
              <div className="flex items-start justify-between rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t("essential")}
                    </h3>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      {t("required")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {t("essentialDescription")}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 opacity-50"
                    aria-label={t("essential")}
                  />
                </div>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-start justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("analytics")}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {t("analyticsDescription")}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {t("analyticsCookies")}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={customPrefs.analytics}
                    onChange={(e) =>
                      setCustomPrefs({ ...customPrefs, analytics: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    aria-label={t("analytics")}
                  />
                </div>
              </div>

              {/* Functional cookies */}
              <div className="flex items-start justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("functional")}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {t("functionalDescription")}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={customPrefs.functional}
                    onChange={(e) =>
                      setCustomPrefs({ ...customPrefs, functional: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    aria-label={t("functional")}
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="flex gap-3">
              <button
                ref={lastButtonRef}
                onClick={handleSaveCustom}
                className="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {t("savePreferences")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
