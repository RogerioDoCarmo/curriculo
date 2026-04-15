/**
 * Unit Tests for useExitIntent Hook
 *
 * These tests verify the specific behavior of the exit intent hook:
 * - Hook doesn't trigger before minimum time
 * - Hook triggers at threshold after minimum time
 * - Hook is disabled on mobile
 *
 * Requirements validated: 19.1, 19.2, 19.7, 19.9
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useExitIntent } from "@/hooks/useExitIntent";

describe("useExitIntent Hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    sessionStorage.clear();
  });

  describe("Minimum Time Requirement", () => {
    it("should not trigger before minimum time has elapsed", () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 5000,
        })
      );

      // Immediately try to trigger (before min time)
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      expect(result.current.showModal).toBe(false);
    });

    it("should trigger after minimum time has elapsed", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 5000,
        })
      );

      // Fast forward past minimum time
      act(() => {
        jest.advanceTimersByTime(5100);
      });

      // Now trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });

    it("should respect exact minimum time threshold", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 3000,
        })
      );

      // Advance to exactly minimum time
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });
  });

  describe("Threshold Detection", () => {
    it("should trigger at threshold after minimum time", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 100,
        })
      );

      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Establish downward movement
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      // Move to threshold with upward velocity
      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 15,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });

    it("should not trigger below threshold", () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        const event = new MouseEvent("mousemove", {
          clientY: 50,
          bubbles: true,
        });
        window.dispatchEvent(event);
      });

      expect(result.current.showModal).toBe(false);
    });

    it("should require upward velocity to trigger", () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Move to threshold without upward velocity (no previous position)
      act(() => {
        const event = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(event);
      });

      expect(result.current.showModal).toBe(false);
    });
  });

  describe("Mobile Detection", () => {
    it("should be disabled on mobile viewports", () => {
      // Set mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Try to trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      expect(result.current.showModal).toBe(false);
    });

    it("should work on tablet viewports (>= 768px)", async () => {
      // Set tablet viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });

    it("should work on desktop viewports", async () => {
      // Set desktop viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });

      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });
  });

  describe("Enabled/Disabled State", () => {
    it("should not trigger when disabled", () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: false,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Try to trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      expect(result.current.showModal).toBe(false);
    });

    it("should trigger when enabled", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });
    });
  });

  describe("Dismiss Functionality", () => {
    it("should dismiss modal when dismissModal is called", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });

      // Dismiss
      act(() => {
        result.current.dismissModal();
      });

      expect(result.current.showModal).toBe(false);
    });

    it("should persist dismissal to sessionStorage", async () => {
      const { result } = renderHook(() =>
        useExitIntent({
          enabled: true,
          threshold: 20,
          minTimeOnPage: 0,
        })
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger
      act(() => {
        const downEvent = new MouseEvent("mousemove", {
          clientY: 100,
          bubbles: true,
        });
        window.dispatchEvent(downEvent);
      });

      act(() => {
        const upEvent = new MouseEvent("mousemove", {
          clientY: 10,
          bubbles: true,
        });
        window.dispatchEvent(upEvent);
      });

      await waitFor(() => {
        expect(result.current.showModal).toBe(true);
      });

      // Dismiss
      act(() => {
        result.current.dismissModal();
      });

      // Check sessionStorage
      expect(sessionStorage.getItem("exitIntentDismissed")).toBe("true");
    });
  });
});
