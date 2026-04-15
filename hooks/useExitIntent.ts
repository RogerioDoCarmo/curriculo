/**
 * useExitIntent Hook
 *
 * Detects when a user is about to leave the page by monitoring mouse movement
 * toward the top of the viewport. Triggers exit intent detection when:
 * - Cursor moves to top 20 pixels with upward velocity
 * - User has been on page for minimum time threshold
 * - Not on mobile viewport (< 768px)
 * - Modal hasn't been shown in current session
 *
 * Requirements: 19.1, 19.2, 19.3, 19.5, 19.7, 19.9
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface UseExitIntentOptions {
  enabled: boolean;
  threshold: number; // Y-coordinate threshold in pixels
  minTimeOnPage: number; // Minimum time in milliseconds
}

interface UseExitIntentReturn {
  showModal: boolean;
  dismissModal: () => void;
}

const SESSION_STORAGE_KEY = "exitIntentDismissed";
const MOBILE_BREAKPOINT = 768;

export function useExitIntent(options: UseExitIntentOptions): UseExitIntentReturn {
  const { enabled, threshold, minTimeOnPage } = options;

  const [showModal, setShowModal] = useState(false);
  const [canTrigger, setCanTrigger] = useState(false);
  const previousYRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Check if modal was already dismissed in this session
  const isDismissed = useCallback(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  }, []);

  // Check if viewport is mobile
  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  // Dismiss modal and persist to session storage
  const dismissModal = useCallback(() => {
    setShowModal(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    }
  }, []);

  // Enable triggering after minimum time has elapsed
  useEffect(() => {
    if (!enabled || isMobile()) return;

    const timer = setTimeout(() => {
      setCanTrigger(true);
    }, minTimeOnPage);

    return () => clearTimeout(timer);
  }, [enabled, minTimeOnPage, isMobile]);

  // Track mouse movement and detect exit intent
  useEffect(() => {
    if (!enabled || !canTrigger || isDismissed() || isMobile() || showModal) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const currentY = event.clientY;

      // Check if cursor is within threshold
      if (currentY <= threshold) {
        // Check for upward velocity (previous Y was greater than current Y)
        if (previousYRef.current !== null && previousYRef.current > currentY) {
          // Trigger exit intent only if not already showing and not dismissed
          if (!isDismissed()) {
            setShowModal(true);
          }
        }
      }

      // Update previous Y position
      previousYRef.current = currentY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled, canTrigger, threshold, isDismissed, isMobile, showModal]);

  return {
    showModal,
    dismissModal,
  };
}
