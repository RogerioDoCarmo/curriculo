/**
 * Firebase Analytics tracking functions.
 * Provides typed wrappers for all analytics events used in the application.
 * Uses dynamic imports for code splitting and reduced initial bundle size.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import { getFirebaseAnalytics } from "./firebase";
import type { CareerPath, SectionId, SupportedLocale, Theme } from "@/types/index";

// ─── Event Names ──────────────────────────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  CONTACT_FORM_SUBMISSION: "contact_form_submission",
  PROJECT_CLICK: "project_click",
  LANGUAGE_CHANGE: "language_change",
  THEME_TOGGLE: "theme_toggle",
  CAREER_PATH_SELECTION: "career_path_selection",
  SECTION_VIEW: "section_view",
  BACK_TO_TOP_CLICK: "back_to_top_click",
  EXIT_INTENT_SHOWN: "exit_intent_shown",
  EXIT_INTENT_ACTION: "exit_intent_action",
} as const;

// ─── Core Tracking Helper ─────────────────────────────────────────────────────

/**
 * Logs an analytics event. Silently no-ops if Analytics is unavailable.
 * Dynamically imports logEvent to reduce initial bundle size.
 */
async function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const analyticsInstance = await getFirebaseAnalytics();
    if (!analyticsInstance) return;

    const { logEvent } = await import("firebase/analytics");
    logEvent(analyticsInstance, eventName, params);
  } catch (error) {
    console.warn(`[Analytics] Failed to track event "${eventName}":`, error);
  }
}

// ─── Public Tracking Functions ────────────────────────────────────────────────

/**
 * Tracks a page view event.
 */
export function trackPageView(params?: { page_path?: string; page_title?: string }): void {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, params);
}

/**
 * Tracks a contact form submission.
 */
export function trackContactFormSubmission(params: { success: boolean }): void {
  trackEvent(ANALYTICS_EVENTS.CONTACT_FORM_SUBMISSION, {
    success: params.success,
  });
}

/**
 * Tracks a project card click.
 */
export function trackProjectClick(params: { project_id: string; project_title: string }): void {
  trackEvent(ANALYTICS_EVENTS.PROJECT_CLICK, params);
}

/**
 * Tracks a language change.
 */
export function trackLanguageChange(params: {
  from_locale: SupportedLocale;
  to_locale: SupportedLocale;
}): void {
  trackEvent(ANALYTICS_EVENTS.LANGUAGE_CHANGE, params);
}

/**
 * Tracks a theme toggle.
 */
export function trackThemeToggle(params: { theme: Theme }): void {
  trackEvent(ANALYTICS_EVENTS.THEME_TOGGLE, params);
}

/**
 * Tracks a career path selection.
 */
export function trackCareerPathSelection(params: { path: CareerPath }): void {
  trackEvent(ANALYTICS_EVENTS.CAREER_PATH_SELECTION, params);
}

/**
 * Tracks when a section becomes visible in the viewport.
 */
export function trackSectionView(params: { section_id: SectionId }): void {
  trackEvent(ANALYTICS_EVENTS.SECTION_VIEW, params);
}

/**
 * Tracks a back-to-top button click.
 */
export function trackBackToTopClick(): void {
  trackEvent(ANALYTICS_EVENTS.BACK_TO_TOP_CLICK);
}

/**
 * Tracks when the exit intent modal is shown.
 */
export function trackExitIntentShown(): void {
  trackEvent(ANALYTICS_EVENTS.EXIT_INTENT_SHOWN);
}

/**
 * Tracks an action taken from the exit intent modal.
 */
export function trackExitIntentAction(params: {
  action: "download_resume" | "connect_linkedin" | "star_github" | "dismiss";
}): void {
  trackEvent(ANALYTICS_EVENTS.EXIT_INTENT_ACTION, params);
}
