/**
 * Property-Based Tests for Exit Intent Session Management
 *
 * These tests validate:
 * - Property 39: Exit Intent Modal Shows Once Per Session
 *
 * Requirements validated: 19.3, 19.5
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useExitIntent } from "@/hooks/useExitIntent";
import * as fc from "fast-check";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Property 39: Exit Intent Modal Shows Once Per Session", () => {
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

  const triggerExitIntent = () => {
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
  };

  it("should show modal on first exit intent detection", async () => {
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

    triggerExitIntent();

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });
  });

  it("should not show modal again after dismissal in same session", async () => {
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

    // First trigger
    triggerExitIntent();

    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    // Dismiss modal
    act(() => {
      result.current.dismissModal();
    });

    expect(result.current.showModal).toBe(false);

    // Try to trigger again
    triggerExitIntent();

    // Should not show modal again
    expect(result.current.showModal).toBe(false);
  });

  it("should persist dismissal state in sessionStorage", async () => {
    const { result: result1 } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Trigger and dismiss
    triggerExitIntent();

    await waitFor(() => {
      expect(result1.current.showModal).toBe(true);
    });

    act(() => {
      result1.current.dismissModal();
    });

    // Create new hook instance (simulating page navigation within session)
    const { result: result2 } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Try to trigger with new instance
    triggerExitIntent();

    // Should not show because session storage remembers dismissal
    expect(result2.current.showModal).toBe(false);
  });

  it("should allow modal to show in new session (after sessionStorage clear)", async () => {
    // First session
    const { result: result1 } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    triggerExitIntent();

    await waitFor(() => {
      expect(result1.current.showModal).toBe(true);
    });

    act(() => {
      result1.current.dismissModal();
    });

    // Clear session storage (simulating new browser session)
    sessionStorage.clear();

    // New session
    const { result: result2 } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    triggerExitIntent();

    // Should show in new session
    await waitFor(() => {
      expect(result2.current.showModal).toBe(true);
    });
  });

  it("should handle multiple trigger attempts before dismissal", async () => {
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

    // Multiple trigger attempts
    triggerExitIntent();
    triggerExitIntent();
    triggerExitIntent();

    // Should only show once
    await waitFor(() => {
      expect(result.current.showModal).toBe(true);
    });

    // Dismiss
    act(() => {
      result.current.dismissModal();
    });

    // Try again multiple times
    triggerExitIntent();
    triggerExitIntent();

    // Should not show again
    expect(result.current.showModal).toBe(false);
  });

  it("should maintain session state across multiple hook instances", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (numInstances) => {
        sessionStorage.clear();

        let lastResult: any = null;

        // Create first instance and trigger
        const { result: firstResult } = renderHook(() =>
          useExitIntent({
            enabled: true,
            threshold: 20,
            minTimeOnPage: 0,
          })
        );

        act(() => {
          jest.advanceTimersByTime(100);
        });

        triggerExitIntent();

        // Dismiss first instance
        act(() => {
          firstResult.current.dismissModal();
        });

        // Create multiple subsequent instances
        for (let i = 0; i < numInstances; i++) {
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

          triggerExitIntent();

          // None should show modal
          expect(result.current.showModal).toBe(false);
          lastResult = result;
        }

        // Verify last instance also doesn't show
        expect(lastResult?.current.showModal).toBe(false);
      }),
      { numRuns: 20 }
    );
  });
});
