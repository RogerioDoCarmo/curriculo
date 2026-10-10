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
import { getSentryEnvironment, isSentryEnabled } from "@/lib/sentry-environment";

const environment = getSentryEnvironment();

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Only real deployments (production/preview) report to Sentry — local
  // machine builds and `next dev` are excluded, regardless of NODE_ENV.
  enabled: isSentryEnabled(environment),

  // "production" | "preview" | "local" — derived from VERCEL_ENV, not
  // NODE_ENV, so a local `next build && next start` isn't mistaken for prod.
  environment,

  // Ignore common non-actionable errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
  ],

  // v11 replaced `sendDefaultPii` with `dataCollection`, and leaving it unset
  // now collects cookies, user info and request headers/bodies. Pin the v10
  // restrictive baseline so the upgrade doesn't widen what a consent-gated
  // site sends.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
      response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    },
    httpBodies: [],
    urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
  },

  beforeSend(event) {
    // Strip PII from error events
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
