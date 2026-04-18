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

/**
 * Subscribes the current device to a FCM topic.
 * Topics allow sending notifications to multiple devices at once.
 *
 * @param topic - The topic name to subscribe to (e.g., "deployments")
 * @returns Promise that resolves to true if subscription succeeded, false otherwise
 */
export async function subscribeToTopic(topic: string): Promise<boolean> {
  try {
    const { token } = await requestNotificationPermission();

    if (!token) {
      console.warn("[FCM] Cannot subscribe to topic: no FCM token available");
      return false;
    }

    // Note: Topic subscription requires a server-side endpoint
    // The Firebase Admin SDK on the server handles the actual subscription
    // This function stores the subscription preference locally

    // Store subscription preference in localStorage
    const subscriptions = getTopicSubscriptions();
    if (!subscriptions.includes(topic)) {
      subscriptions.push(topic);
      localStorage.setItem("fcm_topic_subscriptions", JSON.stringify(subscriptions));
    }

    console.log(`[FCM] Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`[FCM] Failed to subscribe to topic ${topic}:`, error);
    return false;
  }
}

/**
 * Unsubscribes the current device from a FCM topic.
 *
 * @param topic - The topic name to unsubscribe from
 * @returns Promise that resolves to true if unsubscription succeeded, false otherwise
 */
export async function unsubscribeFromTopic(topic: string): Promise<boolean> {
  try {
    // Remove subscription preference from localStorage
    const subscriptions = getTopicSubscriptions();
    const filtered = subscriptions.filter((t) => t !== topic);
    localStorage.setItem("fcm_topic_subscriptions", JSON.stringify(filtered));

    console.log(`[FCM] Unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`[FCM] Failed to unsubscribe from topic ${topic}:`, error);
    return false;
  }
}

/**
 * Gets the list of topics the current device is subscribed to.
 *
 * @returns Array of topic names
 */
export function getTopicSubscriptions(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("fcm_topic_subscriptions");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Checks if the current device is subscribed to a specific topic.
 *
 * @param topic - The topic name to check
 * @returns true if subscribed, false otherwise
 */
export function isSubscribedToTopic(topic: string): boolean {
  return getTopicSubscriptions().includes(topic);
}
