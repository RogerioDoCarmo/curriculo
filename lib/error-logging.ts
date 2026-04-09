/**
 * Error logging module.
 * Logs errors to both Firebase Analytics and Sentry for comprehensive monitoring.
 *
 * Requirements: 10.5
 */

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

// ─── Core Error Logger ────────────────────────────────────────────────────────

/**
 * Logs an error to both Sentry and Firebase Analytics.
 * Silently handles failures in either service to avoid cascading errors.
 */
export function logError(error: unknown, context?: ErrorContext): void {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  const level = context?.level ?? "error";

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
    });
  } catch (sentryError) {
    console.warn("[ErrorLogging] Sentry capture failed:", sentryError);
  }

  // Log to Firebase Analytics
  try {
    const analyticsInstance = getFirebaseAnalytics();
    if (analyticsInstance) {
      logEvent(analyticsInstance, "exception", {
        description: normalizedError.message,
        fatal: level === "fatal",
      });
    }
  } catch (analyticsError) {
    console.warn("[ErrorLogging] Firebase Analytics capture failed:", analyticsError);
  }

  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorLogging]", normalizedError, context);
  }
}

/**
 * Logs a warning (non-fatal issue) to monitoring services.
 */
export function logWarning(message: string, context?: Omit<ErrorContext, "level">): void {
  logError(new Error(message), { ...context, level: "warning" });
}
