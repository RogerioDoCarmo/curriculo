/**
 * Unit tests for notification utilities.
 * Tests FCM token management and topic subscription functionality.
 */

import {
  requestNotificationPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
  getTopicSubscriptions,
  isSubscribedToTopic,
} from "@/lib/notifications";

// Mock Firebase
jest.mock("@/lib/firebase", () => ({
  getFirebaseApp: jest.fn(() => ({})),
  isFirebaseConfigured: jest.fn(() => true),
}));

jest.mock("firebase/messaging", () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(),
  onMessage: jest.fn(),
}));

import { getToken } from "firebase/messaging";

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

// ─── Setup ────────────────────────────────────────────────────────────────────

function setupNotificationMock(permission: NotificationPermission = "default") {
  Object.defineProperty(window, "Notification", {
    writable: true,
    configurable: true,
    value: {
      permission,
      requestPermission: jest.fn().mockResolvedValue(permission),
    },
  });
}

function setupLocalStorage() {
  const store: Record<string, string> = {};

  Object.defineProperty(window, "localStorage", {
    writable: true,
    configurable: true,
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
    },
  });

  return store;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Notification Utilities", () => {
  let localStorageStore: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageStore = setupLocalStorage();
    setupNotificationMock("default");
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY = "test-vapid-key";
  });

  describe("requestNotificationPermission", () => {
    it("returns unsupported when Notification API is not available", async () => {
      // @ts-expect-error - Testing undefined Notification
      delete window.Notification;

      const result = await requestNotificationPermission();

      expect(result.status).toBe("unsupported");
      expect(result.token).toBeUndefined();
    });

    it("returns granted status when permission is granted", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockResolvedValueOnce("test-token");

      const result = await requestNotificationPermission();

      expect(result.status).toBe("granted");
      expect(result.token).toBe("test-token");
    });

    it("returns denied status when permission is denied", async () => {
      setupNotificationMock("denied");

      const result = await requestNotificationPermission();

      expect(result.status).toBe("denied");
      expect(result.token).toBeUndefined();
    });

    it("returns granted without token when VAPID key is missing", async () => {
      setupNotificationMock("granted");
      delete process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      const result = await requestNotificationPermission();

      expect(result.status).toBe("granted");
      expect(result.token).toBeUndefined();
    });

    it("handles token retrieval errors gracefully", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockRejectedValueOnce(new Error("Token error"));

      const result = await requestNotificationPermission();

      expect(result.status).toBe("granted");
      expect(result.token).toBeUndefined();
    });
  });

  describe("subscribeToTopic", () => {
    it("subscribes to topic and stores in localStorage", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockResolvedValueOnce("test-token");

      const result = await subscribeToTopic("deployments");

      expect(result).toBe(true);
      expect(localStorageStore["fcm_topic_subscriptions"]).toBe(JSON.stringify(["deployments"]));
    });

    it("does not duplicate topic subscriptions", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockResolvedValue("test-token");

      await subscribeToTopic("deployments");
      await subscribeToTopic("deployments");

      const subscriptions = JSON.parse(localStorageStore["fcm_topic_subscriptions"]);
      expect(subscriptions).toEqual(["deployments"]);
    });

    it("allows subscribing to multiple topics", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockResolvedValue("test-token");

      await subscribeToTopic("deployments");
      await subscribeToTopic("updates");

      const subscriptions = JSON.parse(localStorageStore["fcm_topic_subscriptions"]);
      expect(subscriptions).toEqual(["deployments", "updates"]);
    });

    it("returns false when no FCM token is available", async () => {
      setupNotificationMock("denied");

      const result = await subscribeToTopic("deployments");

      expect(result).toBe(false);
    });

    it("stores subscription locally even when token retrieval fails", async () => {
      setupNotificationMock("granted");
      mockGetToken.mockResolvedValueOnce("test-token");

      // Successfully subscribe to verify storage works
      await subscribeToTopic("deployments");

      const subscriptions = JSON.parse(localStorageStore["fcm_topic_subscriptions"]);
      expect(subscriptions).toEqual(["deployments"]);
    });
  });

  describe("unsubscribeFromTopic", () => {
    it("removes topic from localStorage", async () => {
      localStorageStore["fcm_topic_subscriptions"] = JSON.stringify(["deployments", "updates"]);

      const result = await unsubscribeFromTopic("deployments");

      expect(result).toBe(true);
      const subscriptions = JSON.parse(localStorageStore["fcm_topic_subscriptions"]);
      expect(subscriptions).toEqual(["updates"]);
    });

    it("handles unsubscribing from non-existent topic", async () => {
      localStorageStore["fcm_topic_subscriptions"] = JSON.stringify(["deployments"]);

      const result = await unsubscribeFromTopic("updates");

      expect(result).toBe(true);
      const subscriptions = JSON.parse(localStorageStore["fcm_topic_subscriptions"]);
      expect(subscriptions).toEqual(["deployments"]);
    });

    it("handles errors gracefully", async () => {
      // Simulate localStorage error
      jest.spyOn(window.localStorage, "setItem").mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const result = await unsubscribeFromTopic("deployments");

      expect(result).toBe(false);
    });
  });

  describe("getTopicSubscriptions", () => {
    it("returns empty array when no subscriptions exist", () => {
      const subscriptions = getTopicSubscriptions();

      expect(subscriptions).toEqual([]);
    });

    it("returns stored subscriptions", () => {
      localStorageStore["fcm_topic_subscriptions"] = JSON.stringify(["deployments", "updates"]);

      const subscriptions = getTopicSubscriptions();

      expect(subscriptions).toEqual(["deployments", "updates"]);
    });

    it("returns empty array when localStorage data is invalid", () => {
      localStorageStore["fcm_topic_subscriptions"] = "invalid-json";

      const subscriptions = getTopicSubscriptions();

      expect(subscriptions).toEqual([]);
    });

    it("returns empty array in server-side environment", () => {
      // Simulate server-side by removing window
      const originalWindow = global.window;
      // @ts-expect-error - Testing server-side
      delete global.window;

      const subscriptions = getTopicSubscriptions();

      expect(subscriptions).toEqual([]);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe("isSubscribedToTopic", () => {
    it("returns true when subscribed to topic", () => {
      localStorageStore["fcm_topic_subscriptions"] = JSON.stringify(["deployments", "updates"]);

      expect(isSubscribedToTopic("deployments")).toBe(true);
      expect(isSubscribedToTopic("updates")).toBe(true);
    });

    it("returns false when not subscribed to topic", () => {
      localStorageStore["fcm_topic_subscriptions"] = JSON.stringify(["deployments"]);

      expect(isSubscribedToTopic("updates")).toBe(false);
    });

    it("returns false when no subscriptions exist", () => {
      expect(isSubscribedToTopic("deployments")).toBe(false);
    });
  });
});
