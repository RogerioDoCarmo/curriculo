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
  // Existing events
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

  // Navigation events
  HEADER_LOGO_CLICK: "header_logo_click",
  NAV_LINK_CLICK: "nav_link_click",
  FOOTER_LINK_CLICK: "footer_link_click",
  SOCIAL_LINK_CLICK: "social_link_click",
  EXTERNAL_LINK_CLICK: "external_link_click",

  // Hero events
  HERO_CTA_CLICK: "hero_cta_click",
  HERO_SCROLL_INDICATOR_CLICK: "hero_scroll_indicator_click",

  // Form events
  FORM_FIELD_FOCUS: "form_field_focus",
  FORM_FIELD_BLUR: "form_field_blur",
  FORM_VALIDATION_ERROR: "form_validation_error",
  FORM_SUBMISSION_START: "form_submission_start",
  FORM_SUBMISSION_SUCCESS: "form_submission_success",
  FORM_SUBMISSION_ERROR: "form_submission_error",

  // Email subscription events
  EMAIL_SUBSCRIBE_FOCUS: "email_subscribe_focus",
  EMAIL_SUBSCRIBE_SUBMIT: "email_subscribe_submit",
  EMAIL_SUBSCRIBE_SUCCESS: "email_subscribe_success",
  EMAIL_SUBSCRIBE_ERROR: "email_subscribe_error",

  // Content interaction events
  TECH_STACK_ITEM_CLICK: "tech_stack_item_click",
  SKILL_CATEGORY_VIEW: "skill_category_view",
  EXPERIENCE_CARD_EXPAND: "experience_card_expand",
  EXPERIENCE_CARD_COLLAPSE: "experience_card_collapse",

  // Notification events
  NOTIFICATION_PERMISSION_REQUESTED: "notification_permission_requested",
  NOTIFICATION_PERMISSION_GRANTED: "notification_permission_granted",
  NOTIFICATION_PERMISSION_DENIED: "notification_permission_denied",
  NOTIFICATION_PROMPT_DISMISSED: "notification_prompt_dismissed",

  // Scroll events
  SCROLL_DEPTH_25: "scroll_depth_25",
  SCROLL_DEPTH_50: "scroll_depth_50",
  SCROLL_DEPTH_75: "scroll_depth_75",
  SCROLL_DEPTH_100: "scroll_depth_100",

  // Error events
  ERROR_BOUNDARY_TRIGGERED: "error_boundary_triggered",
  API_ERROR: "api_error",

  // Engagement events
  TIME_ON_PAGE: "time_on_page",
  SESSION_DURATION: "session_duration",

  // Feature flag events
  FEATURE_FLAG_CHECKED: "feature_flag_checked",
  PDF_DOWNLOAD: "pdf_download",
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

// ─── Navigation Tracking ──────────────────────────────────────────────────────

/**
 * Tracks a header logo click.
 */
export function trackHeaderLogoClick(): void {
  trackEvent(ANALYTICS_EVENTS.HEADER_LOGO_CLICK);
}

/**
 * Tracks a navigation link click.
 */
export function trackNavLinkClick(params: { link_text: string; link_url: string }): void {
  trackEvent(ANALYTICS_EVENTS.NAV_LINK_CLICK, params);
}

/**
 * Tracks a footer link click.
 */
export function trackFooterLinkClick(params: {
  link_text: string;
  link_url: string;
  link_type: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FOOTER_LINK_CLICK, params);
}

/**
 * Tracks a social media link click.
 */
export function trackSocialLinkClick(params: { platform: string; url: string }): void {
  trackEvent(ANALYTICS_EVENTS.SOCIAL_LINK_CLICK, params);
}

/**
 * Tracks an external link click.
 */
export function trackExternalLinkClick(params: { url: string; context: string }): void {
  trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK, params);
}

// ─── Hero Tracking ────────────────────────────────────────────────────────────

/**
 * Tracks a hero CTA button click.
 */
export function trackHeroCTAClick(params: { cta_text: string; cta_action: string }): void {
  trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICK, params);
}

/**
 * Tracks a hero scroll indicator click.
 */
export function trackHeroScrollIndicatorClick(): void {
  trackEvent(ANALYTICS_EVENTS.HERO_SCROLL_INDICATOR_CLICK);
}

// ─── Form Tracking ────────────────────────────────────────────────────────────

/**
 * Tracks when a form field receives focus.
 */
export function trackFormFieldFocus(params: { form_name: string; field_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.FORM_FIELD_FOCUS, params);
}

/**
 * Tracks when a form field loses focus.
 */
export function trackFormFieldBlur(params: {
  form_name: string;
  field_name: string;
  has_value: boolean;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_FIELD_BLUR, params);
}

/**
 * Tracks a form validation error.
 */
export function trackFormValidationError(params: {
  form_name: string;
  field_name: string;
  error_type: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_VALIDATION_ERROR, params);
}

/**
 * Tracks when a form submission starts.
 */
export function trackFormSubmissionStart(params: { form_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_START, params);
}

/**
 * Tracks a successful form submission.
 */
export function trackFormSubmissionSuccess(params: {
  form_name: string;
  submission_time_ms: number;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_SUCCESS, params);
}

/**
 * Tracks a failed form submission.
 */
export function trackFormSubmissionError(params: {
  form_name: string;
  error_message: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_ERROR, params);
}

// ─── Email Subscription Tracking ──────────────────────────────────────────────

/**
 * Tracks when the email subscribe field receives focus.
 */
export function trackEmailSubscribeFocus(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_FOCUS);
}

/**
 * Tracks an email subscription submission attempt.
 */
export function trackEmailSubscribeSubmit(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_SUBMIT);
}

/**
 * Tracks a successful email subscription.
 */
export function trackEmailSubscribeSuccess(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_SUCCESS);
}

/**
 * Tracks a failed email subscription.
 */
export function trackEmailSubscribeError(params: { error_message: string }): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_ERROR, params);
}

// ─── Content Interaction Tracking ─────────────────────────────────────────────

/**
 * Tracks a tech stack item click.
 */
export function trackTechStackItemClick(params: {
  tech_name: string;
  tech_category: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.TECH_STACK_ITEM_CLICK, params);
}

/**
 * Tracks when a skill category becomes visible.
 */
export function trackSkillCategoryView(params: { category_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.SKILL_CATEGORY_VIEW, params);
}

/**
 * Tracks when an experience card is expanded.
 */
export function trackExperienceCardExpand(params: {
  company_name: string;
  position: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPAND, params);
}

/**
 * Tracks when an experience card is collapsed.
 */
export function trackExperienceCardCollapse(params: {
  company_name: string;
  position: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.EXPERIENCE_CARD_COLLAPSE, params);
}

// ─── Notification Tracking ────────────────────────────────────────────────────

/**
 * Tracks when notification permission is requested.
 */
export function trackNotificationPermissionRequested(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_REQUESTED);
}

/**
 * Tracks when notification permission is granted.
 */
export function trackNotificationPermissionGranted(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_GRANTED);
}

/**
 * Tracks when notification permission is denied.
 */
export function trackNotificationPermissionDenied(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_DENIED);
}

/**
 * Tracks when the notification prompt is dismissed.
 */
export function trackNotificationPromptDismissed(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PROMPT_DISMISSED);
}

// ─── Scroll Tracking ──────────────────────────────────────────────────────────

/**
 * Tracks scroll depth milestones.
 */
export function trackScrollDepth(params: { depth_percentage: 25 | 50 | 75 | 100 }): void {
  const eventMap = {
    25: ANALYTICS_EVENTS.SCROLL_DEPTH_25,
    50: ANALYTICS_EVENTS.SCROLL_DEPTH_50,
    75: ANALYTICS_EVENTS.SCROLL_DEPTH_75,
    100: ANALYTICS_EVENTS.SCROLL_DEPTH_100,
  };
  trackEvent(eventMap[params.depth_percentage]);
}

// ─── Error Tracking ───────────────────────────────────────────────────────────

/**
 * Tracks when an error boundary is triggered.
 */
export function trackErrorBoundary(params: {
  error_message: string;
  component_stack: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.ERROR_BOUNDARY_TRIGGERED, params);
}

/**
 * Tracks API errors.
 */
export function trackAPIError(params: {
  endpoint: string;
  status_code: number;
  error_message: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.API_ERROR, params);
}

// ─── Engagement Tracking ──────────────────────────────────────────────────────

/**
 * Tracks time spent on a page.
 */
export function trackTimeOnPage(params: { page_path: string; time_seconds: number }): void {
  trackEvent(ANALYTICS_EVENTS.TIME_ON_PAGE, params);
}

/**
 * Tracks total session duration.
 */
export function trackSessionDuration(params: { duration_seconds: number }): void {
  trackEvent(ANALYTICS_EVENTS.SESSION_DURATION, params);
}

// ─── Feature Flag Tracking ────────────────────────────────────────────────────

/**
 * Tracks when a feature flag is checked.
 * Used to monitor feature flag usage and adoption.
 *
 * Requirements: 10.1
 */
export function trackFeatureFlagChecked(params: {
  flag_name: string;
  flag_value: boolean | string | number;
  locale?: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FEATURE_FLAG_CHECKED, params);
}

/**
 * Tracks when a PDF is downloaded.
 * Includes information about whether locale-specific PDFs are enabled.
 *
 * Requirements: 10.1
 */
export function trackPDFDownload(params: { locale: string; feature_flag_enabled: boolean }): void {
  trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD, params);
}
