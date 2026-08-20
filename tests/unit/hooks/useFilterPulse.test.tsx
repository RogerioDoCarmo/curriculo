/**
 * Unit tests for useFilterPulse hook and FilterPulseProvider.
 * Covers the pure computeMaxRadius helper and the idle/expanding/holding/
 * contracting phase machine, for both normal and reduced motion.
 */

import { act } from "react";
import { renderHook } from "@testing-library/react";
import { FilterPulseProvider, useFilterPulse, computeMaxRadius } from "@/hooks/useFilterPulse";
import { DEFAULT_FILTER_PULSE_ID } from "@/lib/filterPulses";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function mockMatchMedia(matchesReducedMotion: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === REDUCED_MOTION_QUERY ? matchesReducedMotion : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe("computeMaxRadius", () => {
  const viewport = { width: 1000, height: 800 };

  it("returns the distance to the farthest corner from the center", () => {
    const radius = computeMaxRadius({ x: 500, y: 400 }, viewport);
    expect(radius).toBeCloseTo(Math.hypot(500, 400));
  });

  it("covers the viewport when the origin is in a corner", () => {
    const radius = computeMaxRadius({ x: 0, y: 0 }, viewport);
    expect(radius).toBeCloseTo(Math.hypot(1000, 800));
  });

  it("covers the viewport when the origin is at the opposite corner", () => {
    const radius = computeMaxRadius({ x: 1000, y: 800 }, viewport);
    expect(radius).toBeCloseTo(Math.hypot(1000, 800));
  });

  it("covers the viewport when the origin is on an edge midpoint", () => {
    const radius = computeMaxRadius({ x: 0, y: 400 }, viewport);
    expect(radius).toBeCloseTo(Math.hypot(1000, 400));
  });
});

describe("FilterPulseProvider / useFilterPulse", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1000 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 800 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("throws when used outside a FilterPulseProvider", () => {
    expect(() => renderHook(() => useFilterPulse())).toThrow(
      "useFilterPulse must be used within a FilterPulseProvider"
    );
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });
    expect(result.current.phase).toBe("idle");
  });

  it("walks through expanding -> holding -> contracting -> idle (normal motion)", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    expect(result.current.phase).toBe("expanding");
    expect(result.current.activeFilterId).toBe(DEFAULT_FILTER_PULSE_ID);

    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(result.current.phase).toBe("holding");

    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(result.current.phase).toBe("contracting");

    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(result.current.phase).toBe("idle");
  });

  it("uses shorter durations when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    expect(result.current.phase).toBe("expanding");

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.phase).toBe("holding");

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.phase).toBe("contracting");

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.phase).toBe("idle");
  });

  it("resolves an explicit filterId instead of the default", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 }, "sepia");
    });
    expect(result.current.activeFilterId).toBe("sepia");
  });

  it("ignores a re-trigger while a pulse is already running", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    act(() => {
      jest.advanceTimersByTime(600);
      result.current.trigger({ x: 999, y: 999 });
    });
    expect(result.current.origin).toEqual({ x: 10, y: 10 });

    // Total time to idle still matches a single trigger's timeline.
    act(() => {
      jest.advanceTimersByTime(600 + 700 + 1200);
    });
    expect(result.current.phase).toBe("idle");
  });

  it("cleans up pending timers on unmount without warning", () => {
    const { result, unmount } = renderHook(() => useFilterPulse(), {
      wrapper: FilterPulseProvider,
    });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });

    expect(() => {
      unmount();
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    }).not.toThrow();
  });
});
