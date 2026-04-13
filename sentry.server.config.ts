/**
 * Sentry server-side configuration.
 * This file is automatically loaded by @sentry/nextjs for server error tracking.
 *
 * Requirements: 10.5
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Enable in development for testing (change to production-only later)
  enabled: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development",

  // Set environment
  environment: process.env.NODE_ENV,

  // Ignore common non-actionable errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
  ],

  beforeSend(event) {
    // Strip PII from error events
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
