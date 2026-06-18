"use client";

/**
 * Analytics Provider - Client component that wraps children and provides
 * analytics tracking hooks (scroll depth, time on page) plus Vercel Speed
 * Insights for real-user Core Web Vitals.
 * Only initializes analytics if user has given consent.
 */

import { SpeedInsights } from "@vercel/speed-insights/next";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useTimeOnPage } from "@/hooks/useTimeOnPage";

interface AnalyticsProviderProps {
  readonly children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { hasAnalyticsConsent } = useCookieConsent();

  // Only initialize analytics hooks if user has given consent
  const shouldTrack = hasAnalyticsConsent();

  // Conditionally call hooks based on consent
  // Note: We always call the hooks to avoid React hook rules violations,
  // but the hooks themselves will check consent before tracking
  useScrollDepth();
  useTimeOnPage();

  return (
    <>
      {/* Vercel Speed Insights: real-user Core Web Vitals. Cookieless, but still
          gated on analytics consent to match the site's opt-in privacy posture.
          Auto-active on Vercel deployments; no-ops locally without a project. */}
      {shouldTrack && <SpeedInsights />}
      {children}
    </>
  );
}
