/**
 * Sentry client-side initialization.
 *
 * Next.js (15.3+) loads this file natively in the browser before hydration, so
 * `Sentry.init` runs without needing the Sentry webpack/Turbopack plugin. This
 * replaces the legacy root `sentry.client.config.ts`, which modern
 * `@sentry/nextjs` (v8+) no longer auto-loads.
 *
 * This site is a static export (`output: "export"`), so there is no server
 * runtime in production — only this client init can capture errors. There is
 * intentionally no server/edge Sentry config.
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
