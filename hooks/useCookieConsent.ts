/**
 * Cookie Consent Management Hook
 *
 * Manages user consent for cookies and analytics tracking.
 * Implements GDPR/LGPD compliant opt-in approach.
 *
 * Requirements: 10.1, 10.3, 11.7
 */

"use client";

import { useState, useEffect, useCallback } from "react";

export type CookieConsentStatus = "pending" | "accepted" | "rejected" | "customized";

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  functional: boolean;
}

const CONSENT_STORAGE_KEY = "cookie-consent";
const PREFERENCES_STORAGE_KEY = "cookie-preferences";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
};

/**
 * Get stored consent status from localStorage
 */
function getStoredConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored && ["accepted", "rejected", "customized"].includes(stored)) {
      return stored as CookieConsentStatus;
    }
  } catch (error) {
    console.warn("[CookieConsent] Failed to read consent status:", error);
  }

  return null;
}

/**
 * Get stored cookie preferences from localStorage
 */
function getStoredPreferences(): CookiePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        essential: true, // Always true
        analytics: parsed.analytics ?? false,
        functional: parsed.functional ?? false,
      };
    }
  } catch (error) {
    console.warn("[CookieConsent] Failed to read preferences:", error);
  }

  return DEFAULT_PREFERENCES;
}

/**
 * Save consent status to localStorage
 */
function saveConsent(status: CookieConsentStatus): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch (error) {
    console.error("[CookieConsent] Failed to save consent status:", error);
  }
}

/**
 * Save cookie preferences to localStorage
 */
function savePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("[CookieConsent] Failed to save preferences:", error);
  }
}

/**
 * Hook for managing cookie consent
 */
export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>("pending");
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent status and preferences on mount
  useEffect(() => {
    const storedConsent = getStoredConsent();
    const storedPreferences = getStoredPreferences();

    if (storedConsent) {
      setConsentStatus(storedConsent);
      setPreferences(storedPreferences);
      setShowBanner(false);
    } else {
      setConsentStatus("pending");
      setPreferences(DEFAULT_PREFERENCES);
      setShowBanner(true);
    }
  }, []);

  /**
   * Accept all cookies
   */
  const acceptAll = useCallback(() => {
    const newPreferences: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
    };

    setConsentStatus("accepted");
    setPreferences(newPreferences);
    setShowBanner(false);

    saveConsent("accepted");
    savePreferences(newPreferences);

    // Reload page to initialize analytics
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  /**
   * Reject non-essential cookies
   */
  const rejectAll = useCallback(() => {
    const newPreferences: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
    };

    setConsentStatus("rejected");
    setPreferences(newPreferences);
    setShowBanner(false);

    saveConsent("rejected");
    savePreferences(newPreferences);
  }, []);

  /**
   * Save custom preferences
   */
  const saveCustomPreferences = useCallback((customPreferences: Partial<CookiePreferences>) => {
    const newPreferences: CookiePreferences = {
      essential: true, // Always true
      analytics: customPreferences.analytics ?? false,
      functional: customPreferences.functional ?? false,
    };

    setConsentStatus("customized");
    setPreferences(newPreferences);
    setShowBanner(false);

    saveConsent("customized");
    savePreferences(newPreferences);

    // Reload page to apply changes
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  /**
   * Open banner to change preferences
   */
  const openBanner = useCallback(() => {
    setShowBanner(true);
  }, []);

  /**
   * Close banner without saving
   */
  const closeBanner = useCallback(() => {
    // Only allow closing if consent was already given
    if (consentStatus !== "pending") {
      setShowBanner(false);
    }
  }, [consentStatus]);

  /**
   * Check if analytics is enabled
   */
  const hasAnalyticsConsent = useCallback(() => {
    return preferences.analytics;
  }, [preferences.analytics]);

  /**
   * Check if functional cookies are enabled
   */
  const hasFunctionalConsent = useCallback(() => {
    return preferences.functional;
  }, [preferences.functional]);

  return {
    consentStatus,
    preferences,
    showBanner,
    acceptAll,
    rejectAll,
    saveCustomPreferences,
    openBanner,
    closeBanner,
    hasAnalyticsConsent,
    hasFunctionalConsent,
  };
}
