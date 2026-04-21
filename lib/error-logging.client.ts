/* eslint-disable no-console */
/**
 * Client-side only error logging module.
 * Use this in client components to avoid importing Sentry server code.
 *
 * Requirements: 10.5
 */

"use client";

import * as Sentry from "@sentry/nextjs";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

// ─── Error Context ────────────────────────────────────────────────────────────

export interface ErrorContext {
  /** Where the error occurred (e.g., "ContactForm", "ProjectsSection") */
  component?: string;
  /** Additional metadata to attach to the error report */
  extra?: Record<string, string | number | boolean>;
  /** Error severity level */
  level?: "fatal" | "error" | "warning" | "info";
}

// ─── Core Error Logger (Client-Side Only) ─────────────────────────────────────

/**
 * Logs an error to both Sentry and Firebase Analytics (client-side only).
 * Silently handles failures in either service to avoid cascading errors.
 */
export function logErrorClient(error: unknown, context?: ErrorContext): void {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  const level = context?.level ?? "error";

  console.log("[ErrorLogging] Attempting to log error:", normalizedError.message);

  // Log to Sentry
  try {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      if (context?.component) {
        scope.setTag("component", context.component);
      }
      if (context?.extra) {
        for (const [key, value] of Object.entries(context.extra)) {
          scope.setExtra(key, value);
        }
      }
      Sentry.captureException(normalizedError);
      console.log("[ErrorLogging] ✅ Sent to Sentry");
    });
  } catch (sentryError) {
    console.warn("[ErrorLogging] Sentry capture failed:", sentryError);
  }

  // Log to Firebase Analytics (async, fire-and-forget)
  (async () => {
    try {
      const analyticsInstance = await getFirebaseAnalytics();
      if (analyticsInstance) {
        logEvent(analyticsInstance, "exception", {
          description: normalizedError.message,
          fatal: level === "fatal",
        });
        console.log("[ErrorLogging] ✅ Sent to Firebase Analytics");
      } else {
        console.warn("[ErrorLogging] Firebase Analytics not available");
      }
    } catch (analyticsError) {
      console.warn("[ErrorLogging] Firebase Analytics capture failed:", analyticsError);
    }
  })();

  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorLogging] Error details:", normalizedError, context);
  }
}

/**
 * Logs a warning (non-fatal issue) to monitoring services.
 */
export function logWarningClient(message: string, context?: Omit<ErrorContext, "level">): void {
  logErrorClient(new Error(message), { ...context, level: "warning" });
}
