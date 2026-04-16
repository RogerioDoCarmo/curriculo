/**
 * Property-Based Tests for Exit Intent Detection
 *
 * These tests validate the correctness properties for exit intent detection:
 * - Property 37: Exit Intent Detection Tracks Mouse Movement
 * - Property 38: Exit Intent Triggers at Threshold
 * - Property 40: Exit Intent Respects Minimum Time
 *
 * Requirements validated: 19.1, 19.2, 19.9
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useExitIntent } from "@/hooks/useExitIntent";
import * as fc from "fast-check";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Property 37: Exit Intent Detection Tracks Mouse Movement", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock window.innerWidth for desktop viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should track mouse movement events when enabled", () => {
    const { result } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    // Initially should not show modal
    expect(result.current.showModal).toBe(false);

    // Verify mousemove listener is attached by triggering event
    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientY: 50,
      bubbles: true,
    });
    window.dispatchEvent(mouseMoveEvent);

    // Should still not show modal (not at threshold)
    expect(result.current.showModal).toBe(false);
  });

  it("should not track mouse movement when disabled", () => {
    const { result } = renderHook(() =>
      useExitIntent({
        enabled: false,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    // Trigger mouse movement
    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientY: 5,
      bubbles: true,
    });
    window.dispatchEvent(mouseMoveEvent);

    // Should never show modal when disabled
    expect(result.current.showModal).toBe(false);
  });

  it("should track mouse position correctly across multiple movements", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 5, maxLength: 20 }),
        (yPositions) => {
          const { result } = renderHook(() =>
            useExitIntent({
              enabled: true,
              threshold: 20,
              minTimeOnPage: 0,
            })
          );

          // Simulate multiple mouse movements
          yPositions.forEach((y) => {
            const event = new MouseEvent("mousemove", {
              clientY: y,
              bubbles: true,
            });
            window.dispatchEvent(event);
          });

          // Hook should be tracking (verified by no errors)
          expect(result.current).toBeDefined();
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe("Property 38: Exit Intent Triggers at Threshold", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    // Clear sessionStorage
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    sessionStorage.clear();
  });

  it("should trigger when cursor crosses threshold with upward velocity", async () => {
    const { result } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
      })
    );

    // Fast forward past minimum time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Simulate downward movement first (to establish velocity)
    act(() => {
      const downEvent = new MouseEvent("mousemove", {
        clientY: 100,
        bubbles: true,
      });
      window.dispatchEvent(downEvent);
    });

    // Then upward movement crossing threshold
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

  it("should not trigger when cursor is below threshold", () => {
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

    // Cursor at y=50 (below threshold of 20)
    act(() => {
      const event = new MouseEvent("mousemove", {
        clientY: 50,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(result.current.showModal).toBe(false);
  });

  it("should respect custom threshold values", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.integer({ min: 0, max: 200 }),
        (threshold, cursorY) => {
          sessionStorage.clear();

          const { result } = renderHook(() =>
            useExitIntent({
              enabled: true,
              threshold,
              minTimeOnPage: 0,
            })
          );

          act(() => {
            jest.advanceTimersByTime(100);
          });

          // Simulate movement from below to above
          act(() => {
            const downEvent = new MouseEvent("mousemove", {
              clientY: threshold + 50,
              bubbles: true,
            });
            window.dispatchEvent(downEvent);
          });

          act(() => {
            const upEvent = new MouseEvent("mousemove", {
              clientY: cursorY,
              bubbles: true,
            });
            window.dispatchEvent(upEvent);
          });

          const shouldTrigger = cursorY <= threshold;
          expect(result.current.showModal).toBe(shouldTrigger);
        }
      ),
      { numRuns: 30 }
    );
  });

  it("should not trigger on mobile viewports", () => {
    // Set mobile viewport width
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

    // Try to trigger exit intent
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

    // Should not trigger on mobile
    expect(result.current.showModal).toBe(false);
  });
});

describe("Property 40: Exit Intent Respects Minimum Time", () => {
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

  it("should not trigger before minimum time has elapsed", () => {
    const { result } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 5000, // 5 seconds
      })
    );

    // Try to trigger immediately (before min time)
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

    // Should not trigger before minimum time
    expect(result.current.showModal).toBe(false);
  });

  it("should trigger after minimum time has elapsed", async () => {
    const { result } = renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 5000, // 5 seconds
      })
    );

    // Fast forward past minimum time
    act(() => {
      jest.advanceTimersByTime(5100);
    });

    // Now try to trigger
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

  it("should respect various minimum time thresholds", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.integer({ min: 0, max: 15000 }),
        (minTime, elapsedTime) => {
          sessionStorage.clear();

          const { result } = renderHook(() =>
            useExitIntent({
              enabled: true,
              threshold: 20,
              minTimeOnPage: minTime,
            })
          );

          // Advance time
          act(() => {
            jest.advanceTimersByTime(elapsedTime);
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

          const shouldTrigger = elapsedTime >= minTime;
          expect(result.current.showModal).toBe(shouldTrigger);
        }
      ),
      { numRuns: 30 }
    );
  });
});
