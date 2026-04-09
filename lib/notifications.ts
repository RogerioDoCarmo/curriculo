/**
 * Firebase Cloud Messaging (FCM) notification utilities.
 * Handles push notification permission and foreground message handling.
 *
 * Requirements: 10.1
 */

import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { getFirebaseApp, isFirebaseConfigured } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationPermissionStatus = "granted" | "denied" | "default" | "unsupported";

export interface FCMMessage {
  title?: string;
  body?: string;
  icon?: string;
  data?: Record<string, string>;
}

// ─── Messaging Singleton ──────────────────────────────────────────────────────

let messagingInstance: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;
  if (!("Notification" in window)) return null;

  if (!messagingInstance) {
    try {
      messagingInstance = getMessaging(getFirebaseApp());
    } catch (error) {
      console.warn("[FCM] Messaging initialization failed:", error);
      return null;
    }
  }

  return messagingInstance;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Requests notification permission from the user and registers the FCM token.
 * Returns the permission status and optionally the FCM token.
 */
export async function requestNotificationPermission(): Promise<{
  status: NotificationPermissionStatus;
  token?: string;
}> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { status: "unsupported" };
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return { status: permission as NotificationPermissionStatus };
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn("[FCM] VAPID key not configured.");
    return { status: "granted" };
  }

  try {
    const messaging = getMessagingInstance();
    if (!messaging) return { status: "granted" };

    const token = await getToken(messaging, { vapidKey });
    return { status: "granted", token };
  } catch (error) {
    console.warn("[FCM] Failed to get FCM token:", error);
    return { status: "granted" };
  }
}

/**
 * Sets up a foreground message handler.
 * Returns an unsubscribe function.
 */
export function setupForegroundNotifications(
  onMessageReceived: (message: FCMMessage) => void
): () => void {
  const messaging = getMessagingInstance();
  if (!messaging) return () => {};

  const unsubscribe = onMessage(messaging, (payload) => {
    onMessageReceived({
      title: payload.notification?.title,
      body: payload.notification?.body,
      icon: payload.notification?.icon,
      data: payload.data as Record<string, string> | undefined,
    });
  });

  return unsubscribe;
}
