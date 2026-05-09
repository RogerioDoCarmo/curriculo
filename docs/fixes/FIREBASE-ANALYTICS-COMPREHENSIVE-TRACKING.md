# Firebase Analytics Comprehensive Tracking Implementation

**Date**: May 7, 2026  
**Priority**: Medium  
**Estimated Effort**: 4-6 hours  
**Status**: Pending

---

## 📋 Overview

Implement comprehensive Firebase Analytics tracking for all user interactions across the website to gain insights into user behavior, engagement patterns, and conversion metrics.

---

## 🎯 Objectives

1. Track all clickable elements (buttons, links, cards)
2. Track form interactions (focus, validation, submission)
3. Track navigation patterns (internal links, external links)
4. Track scroll depth and section visibility
5. Track media interactions (if any)
6. Track error occurrences
7. Ensure GDPR compliance and user privacy

---

## 📊 Current State

### Existing Analytics Events

Currently implemented in `lib/analytics.ts`:

| Event                     | Status         | Usage                |
| ------------------------- | -------------- | -------------------- |
| `page_view`               | ✅ Implemented | Page navigation      |
| `contact_form_submission` | ✅ Implemented | Contact form         |
| `project_click`           | ✅ Implemented | Project cards        |
| `language_change`         | ✅ Implemented | Language selector    |
| `theme_toggle`            | ✅ Implemented | Theme toggle         |
| `career_path_selection`   | ✅ Implemented | Career path selector |
| `section_view`            | ✅ Implemented | Section visibility   |
| `back_to_top_click`       | ✅ Implemented | Back to top button   |
| `exit_intent_shown`       | ✅ Implemented | Exit intent modal    |
| `exit_intent_action`      | ✅ Implemented | Exit intent actions  |

### Components Requiring Tracking

| Component          | Location                         | Interactions to Track               |
| ------------------ | -------------------------------- | ----------------------------------- |
| Header             | `components/Header/`             | Logo click, nav links               |
| Footer             | `components/Footer/`             | Social links, footer links          |
| Hero               | `components/Hero/`               | CTA buttons, scroll indicator       |
| ContactForm        | `components/ContactForm/`        | Field focus, validation, submission |
| EmailSubscribeForm | `components/EmailSubscribeForm/` | Field focus, submission             |
| Button             | `components/Button/`             | All button clicks                   |
| Card               | `components/Card/`               | Card clicks, hover                  |
| LanguageSelector   | `components/LanguageSelector/`   | ✅ Already tracked                  |
| ThemeToggle        | `components/ThemeToggle/`        | ✅ Already tracked                  |
| BackToTopButton    | `components/BackToTopButton/`    | ✅ Already tracked                  |
| CareerPathSelector | `components/CareerPathSelector/` | ✅ Already tracked                  |
| TechStackSection   | `components/TechStackSection/`   | Tech item clicks                    |
| SkillsSection      | `components/SkillsSection/`      | Skill category views                |
| ExperienceSection  | `components/ExperienceSection/`  | Experience card interactions        |
| NotificationPrompt | `components/NotificationPrompt/` | Permission requests, actions        |

---

## 🔧 Implementation Plan

### Phase 1: Define New Analytics Events

Add new event types to `lib/analytics.ts`:

```typescript
export const ANALYTICS_EVENTS = {
  // Existing events...

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
} as const;
```

### Phase 2: Create Tracking Helper Functions

Add corresponding tracking functions:

```typescript
// Navigation tracking
export function trackHeaderLogoClick(): void {
  trackEvent(ANALYTICS_EVENTS.HEADER_LOGO_CLICK);
}

export function trackNavLinkClick(params: { link_text: string; link_url: string }): void {
  trackEvent(ANALYTICS_EVENTS.NAV_LINK_CLICK, params);
}

export function trackFooterLinkClick(params: {
  link_text: string;
  link_url: string;
  link_type: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FOOTER_LINK_CLICK, params);
}

export function trackSocialLinkClick(params: { platform: string; url: string }): void {
  trackEvent(ANALYTICS_EVENTS.SOCIAL_LINK_CLICK, params);
}

export function trackExternalLinkClick(params: { url: string; context: string }): void {
  trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK_CLICK, params);
}

// Hero tracking
export function trackHeroCTAClick(params: { cta_text: string; cta_action: string }): void {
  trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICK, params);
}

export function trackHeroScrollIndicatorClick(): void {
  trackEvent(ANALYTICS_EVENTS.HERO_SCROLL_INDICATOR_CLICK);
}

// Form tracking
export function trackFormFieldFocus(params: { form_name: string; field_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.FORM_FIELD_FOCUS, params);
}

export function trackFormFieldBlur(params: {
  form_name: string;
  field_name: string;
  has_value: boolean;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_FIELD_BLUR, params);
}

export function trackFormValidationError(params: {
  form_name: string;
  field_name: string;
  error_type: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_VALIDATION_ERROR, params);
}

export function trackFormSubmissionStart(params: { form_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_START, params);
}

export function trackFormSubmissionSuccess(params: {
  form_name: string;
  submission_time_ms: number;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_SUCCESS, params);
}

export function trackFormSubmissionError(params: {
  form_name: string;
  error_message: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.FORM_SUBMISSION_ERROR, params);
}

// Email subscription tracking
export function trackEmailSubscribeFocus(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_FOCUS);
}

export function trackEmailSubscribeSubmit(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_SUBMIT);
}

export function trackEmailSubscribeSuccess(): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_SUCCESS);
}

export function trackEmailSubscribeError(params: { error_message: string }): void {
  trackEvent(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE_ERROR, params);
}

// Content interaction tracking
export function trackTechStackItemClick(params: {
  tech_name: string;
  tech_category: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.TECH_STACK_ITEM_CLICK, params);
}

export function trackSkillCategoryView(params: { category_name: string }): void {
  trackEvent(ANALYTICS_EVENTS.SKILL_CATEGORY_VIEW, params);
}

export function trackExperienceCardExpand(params: {
  company_name: string;
  position: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPAND, params);
}

export function trackExperienceCardCollapse(params: {
  company_name: string;
  position: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.EXPERIENCE_CARD_COLLAPSE, params);
}

// Notification tracking
export function trackNotificationPermissionRequested(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_REQUESTED);
}

export function trackNotificationPermissionGranted(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_GRANTED);
}

export function trackNotificationPermissionDenied(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_DENIED);
}

export function trackNotificationPromptDismissed(): void {
  trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PROMPT_DISMISSED);
}

// Scroll tracking
export function trackScrollDepth(params: { depth_percentage: 25 | 50 | 75 | 100 }): void {
  const eventMap = {
    25: ANALYTICS_EVENTS.SCROLL_DEPTH_25,
    50: ANALYTICS_EVENTS.SCROLL_DEPTH_50,
    75: ANALYTICS_EVENTS.SCROLL_DEPTH_75,
    100: ANALYTICS_EVENTS.SCROLL_DEPTH_100,
  };
  trackEvent(eventMap[params.depth_percentage]);
}

// Error tracking
export function trackErrorBoundary(params: {
  error_message: string;
  component_stack: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.ERROR_BOUNDARY_TRIGGERED, params);
}

export function trackAPIError(params: {
  endpoint: string;
  status_code: number;
  error_message: string;
}): void {
  trackEvent(ANALYTICS_EVENTS.API_ERROR, params);
}

// Engagement tracking
export function trackTimeOnPage(params: { page_path: string; time_seconds: number }): void {
  trackEvent(ANALYTICS_EVENTS.TIME_ON_PAGE, params);
}

export function trackSessionDuration(params: { duration_seconds: number }): void {
  trackEvent(ANALYTICS_EVENTS.SESSION_DURATION, params);
}
```

### Phase 3: Implement Component Tracking

#### 3.1 Header Component

```typescript
// components/Header/index.tsx
import { trackHeaderLogoClick, trackNavLinkClick } from "@/lib/analytics";

// Logo click
<Link href="/" onClick={() => trackHeaderLogoClick()}>
  <Image src="/logo.svg" alt="Logo" />
</Link>

// Nav link click
<Link
  href={href}
  onClick={() => trackNavLinkClick({ link_text: text, link_url: href })}
>
  {text}
</Link>
```

#### 3.2 Footer Component

```typescript
// components/Footer/index.tsx
import { trackFooterLinkClick, trackSocialLinkClick } from "@/lib/analytics";

// Footer link
<Link
  href={href}
  onClick={() => trackFooterLinkClick({
    link_text: text,
    link_url: href,
    link_type: "footer_nav"
  })}
>
  {text}
</Link>

// Social link
<a
  href={socialUrl}
  onClick={() => trackSocialLinkClick({ platform: "linkedin", url: socialUrl })}
>
  <LinkedInIcon />
</a>
```

#### 3.3 Hero Component

```typescript
// components/Hero/index.tsx
import { trackHeroCTAClick, trackHeroScrollIndicatorClick } from "@/lib/analytics";

// CTA button
<Button
  onClick={() => {
    trackHeroCTAClick({ cta_text: "Contact Me", cta_action: "scroll_to_contact" });
    scrollToContact();
  }}
>
  Contact Me
</Button>

// Scroll indicator
<button
  onClick={() => {
    trackHeroScrollIndicatorClick();
    scrollToNextSection();
  }}
>
  <ChevronDownIcon />
</button>
```

#### 3.4 ContactForm Component

```typescript
// components/ContactForm/index.tsx
import {
  trackFormFieldFocus,
  trackFormFieldBlur,
  trackFormValidationError,
  trackFormSubmissionStart,
  trackFormSubmissionSuccess,
  trackFormSubmissionError
} from "@/lib/analytics";

// Field focus
<input
  onFocus={() => trackFormFieldFocus({ form_name: "contact", field_name: "email" })}
  onBlur={(e) => trackFormFieldBlur({
    form_name: "contact",
    field_name: "email",
    has_value: !!e.target.value
  })}
/>

// Form submission
const handleSubmit = async (data) => {
  const startTime = Date.now();
  trackFormSubmissionStart({ form_name: "contact" });

  try {
    await submitForm(data);
    const submissionTime = Date.now() - startTime;
    trackFormSubmissionSuccess({ form_name: "contact", submission_time_ms: submissionTime });
  } catch (error) {
    trackFormSubmissionError({ form_name: "contact", error_message: error.message });
  }
};

// Validation error
if (errors.email) {
  trackFormValidationError({
    form_name: "contact",
    field_name: "email",
    error_type: errors.email.type
  });
}
```

#### 3.5 Scroll Depth Tracking

```typescript
// hooks/useScrollDepth.ts
import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

export function useScrollDepth() {
  const trackedDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      [25, 50, 75, 100].forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScrollDepth({ depth_percentage: depth as 25 | 50 | 75 | 100 });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

// Usage in layout
// app/[locale]/layout.tsx
import { useScrollDepth } from "@/hooks/useScrollDepth";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  useScrollDepth();
  return <>{children}</>;
}
```

#### 3.6 Error Boundary Tracking

```typescript
// components/ErrorBoundary/index.tsx
import { trackErrorBoundary } from "@/lib/analytics";

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  trackErrorBoundary({
    error_message: error.message,
    component_stack: errorInfo.componentStack || "",
  });
}
```

#### 3.7 Time on Page Tracking

```typescript
// hooks/useTimeOnPage.ts
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackTimeOnPage } from "@/lib/analytics";

export function useTimeOnPage() {
  const pathname = usePathname();
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage({ page_path: pathname, time_seconds: timeSpent });
      }
    };
  }, [pathname]);
}

// Usage in layout
// app/[locale]/layout.tsx
import { useTimeOnPage } from "@/hooks/useTimeOnPage";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  useTimeOnPage();
  return <>{children}</>;
}
```

---

## 📝 Implementation Checklist

### Phase 1: Analytics Events Definition

- [ ] Add new event constants to `lib/analytics.ts`
- [ ] Create TypeScript types for event parameters
- [ ] Document each event with JSDoc comments

### Phase 2: Tracking Functions

- [ ] Implement navigation tracking functions
- [ ] Implement form tracking functions
- [ ] Implement content interaction tracking functions
- [ ] Implement scroll depth tracking functions
- [ ] Implement error tracking functions
- [ ] Implement engagement tracking functions

### Phase 3: Component Integration

- [ ] Add tracking to Header component
- [ ] Add tracking to Footer component
- [ ] Add tracking to Hero component
- [ ] Add tracking to ContactForm component
- [ ] Add tracking to EmailSubscribeForm component
- [ ] Add tracking to TechStackSection component
- [ ] Add tracking to SkillsSection component
- [ ] Add tracking to ExperienceSection component
- [ ] Add tracking to NotificationPrompt component
- [ ] Add tracking to ErrorBoundary component

### Phase 4: Hooks Implementation

- [ ] Create `useScrollDepth` hook
- [ ] Create `useTimeOnPage` hook
- [ ] Create `useSessionDuration` hook
- [ ] Integrate hooks in layout components

### Phase 5: Testing

- [ ] Test all tracking events in development
- [ ] Verify events appear in Firebase Analytics console
- [ ] Test event parameters are correct
- [ ] Test tracking works across all locales
- [ ] Test tracking respects user consent (GDPR)

### Phase 6: Documentation

- [ ] Update `lib/analytics.ts` documentation
- [ ] Create analytics events reference guide
- [ ] Document privacy considerations
- [ ] Update CONTRIBUTING.md with analytics guidelines

---

## 🔒 Privacy & GDPR Compliance

### Consent Management

Ensure analytics tracking respects user consent:

```typescript
// lib/analytics.ts
let analyticsConsent = false;

export function setAnalyticsConsent(consent: boolean): void {
  analyticsConsent = consent;
  if (consent) {
    // Initialize analytics
    getFirebaseAnalytics();
  }
}

export function hasAnalyticsConsent(): boolean {
  return analyticsConsent;
}

// Modify trackEvent to check consent
async function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  if (!hasAnalyticsConsent()) {
    console.log(`[Analytics] Event "${eventName}" not tracked - no consent`);
    return;
  }

  // ... existing tracking code
}
```

### Data Minimization

- Only track necessary data
- Avoid tracking PII (personally identifiable information)
- Anonymize IP addresses
- Use generic identifiers instead of user-specific data

### User Rights

- Provide opt-out mechanism
- Allow users to view tracked data
- Implement data deletion on request

---

## 📊 Expected Metrics

After implementation, you'll be able to track:

### Engagement Metrics

- Page views per session
- Average time on page
- Scroll depth distribution
- Section visibility rates

### Interaction Metrics

- Button click rates
- Link click patterns
- Form completion rates
- Form abandonment points

### Navigation Metrics

- Most clicked navigation links
- External link clicks
- Social media engagement
- Footer link usage

### Conversion Metrics

- Contact form submissions
- Email subscription rate
- CTA click-through rates
- Project card engagement

### Error Metrics

- Error boundary triggers
- API error rates
- Form validation errors
- Component failure rates

---

## 🧪 Testing Strategy

### Development Testing

```bash
# Run development server with analytics enabled
npm run dev

# Open browser console and filter for "[Analytics]"
# Interact with the site and verify events are logged
```

### Firebase Console Verification

1. Open Firebase Console → Analytics → Events
2. Enable Debug View
3. Interact with the site
4. Verify events appear in real-time

### Automated Testing

```typescript
// __tests__/analytics.test.ts
import { trackNavLinkClick } from "@/lib/analytics";

jest.mock("firebase/analytics");

describe("Analytics Tracking", () => {
  it("should track nav link clicks", () => {
    trackNavLinkClick({ link_text: "About", link_url: "/about" });
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), "nav_link_click", {
      link_text: "About",
      link_url: "/about",
    });
  });
});
```

---

## 📚 Related Documentation

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [GDPR Compliance Guide](https://firebase.google.com/support/privacy)
- [Analytics Best Practices](https://firebase.google.com/docs/analytics/best-practices)
- Current implementation: `lib/analytics.ts`

---

## 🎯 Success Criteria

- [ ] All user interactions are tracked
- [ ] Events appear in Firebase Analytics console
- [ ] Event parameters are accurate and useful
- [ ] Tracking respects user privacy and consent
- [ ] No performance impact on user experience
- [ ] Documentation is complete and clear
- [ ] Tests cover all tracking functions

---

## ⏱️ Estimated Timeline

- **Phase 1**: 1 hour - Define events
- **Phase 2**: 1 hour - Create tracking functions
- **Phase 3**: 2-3 hours - Integrate into components
- **Phase 4**: 1 hour - Implement hooks
- **Phase 5**: 1 hour - Testing
- **Phase 6**: 30 minutes - Documentation

**Total**: 4-6 hours

---

**Created**: May 7, 2026  
**Author**: Kiro AI  
**Repository**: RogerioDoCarmo/curriculo  
**Status**: Ready for implementation
