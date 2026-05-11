/**
 * Firebase Cloud Messaging Service Worker.
 * Handles background push notifications.
 *
 * Requirements: 10.1
 */

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

// Firebase config is injected at runtime via the notification prompt
// The service worker reads config from the client via postMessage
let messaging = null;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    const firebaseConfig = event.data.config;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body, icon } = payload.notification ?? {};
      self.registration.showNotification(title ?? "New notification", {
        body: body ?? "",
        icon: icon ?? "/icon.svg",
      });
    });
  }
});
