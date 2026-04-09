/**
 * NotificationPrompt component.
 * Asks the user for push notification permission after a delay.
 *
 * Requirements: 10.1
 */

"use client";

import React, { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";

type PromptState = "idle" | "visible" | "dismissed";

export default function NotificationPrompt() {
  const [state, setState] = useState<PromptState>("idle");

  useEffect(() => {
    // Only show if notifications are supported and not yet decided
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;
    if (sessionStorage.getItem("notification-prompt-dismissed")) return;

    // Show prompt after 10 seconds
    const timer = setTimeout(() => setState("visible"), 10_000);
    return () => clearTimeout(timer);
  }, []);

  async function handleAllow() {
    setState("dismissed");
    await requestNotificationPermission();
  }

  function handleDismiss() {
    setState("dismissed");
    sessionStorage.setItem("notification-prompt-dismissed", "true");
  }

  if (state !== "visible") return null;

  return (
    <div
      role="dialog"
      aria-label="Notification permission request"
      aria-modal="false"
      className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
        Get notified about new projects and updates.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAllow}
          className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          Allow
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification prompt"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
