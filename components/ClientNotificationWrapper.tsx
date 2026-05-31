"use client";

/**
 * Client-side wrapper for NotificationPrompt
 * This component is needed because NotificationPrompt uses ssr: false
 * and cannot be directly imported in Server Components
 */

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { LazyNotificationPrompt } from "@/lib/lazy-components";

export default function ClientNotificationWrapper() {
  const { hasFunctionalConsent } = useCookieConsent();

  if (!hasFunctionalConsent()) return null;

  return <LazyNotificationPrompt />;
}
