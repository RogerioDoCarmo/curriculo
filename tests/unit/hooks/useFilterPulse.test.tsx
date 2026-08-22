/**
 * Unit tests for useFilterPulse hook and FilterPulseProvider.
 * Covers the pure computeMaxRadius helper and the idle/expanding/holding/
 * contracting phase machine, for both normal and reduced motion.
 */

import { act } from "react";
import { renderHook } from "@testing-library/react";
import { FilterPulseProvider, useFilterPulse, computeMaxRadius } from "@/hooks/useFilterPulse";
import { DEFAULT_FILTER_PULSE_ID, FilterPulseId } from "@/lib/filterPulses";

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

  it("commits the new origin (at phase idle) before flipping to expanding, so position never transitions alongside radius", () => {
    // Regression test for a Firefox-only bug: setting origin and phase
    // "expanding" in the same commit made the clip-path's position AND
    // radius change together, which Firefox visibly interpolates (the
    // circle appeared to sweep in from the previous origin instead of
    // growing in place). The fix commits origin/maxRadius on their own,
    // one paint before phase flips, via a double requestAnimationFrame.
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 42, y: 24 });
    });
    // Immediately after trigger(), before the rAF pair has had a chance to
    // run: origin/maxRadius/activeFilterId are already committed, but phase
    // is still "idle" -- exactly the position-only, radius-still-0 paint
    // the fix relies on.
    expect(result.current.phase).toBe("idle");
    expect(result.current.origin).toEqual({ x: 42, y: 24 });
    expect(result.current.maxRadius).toBeGreaterThan(0);

    act(() => {
      jest.advanceTimersByTime(32); // flush the double requestAnimationFrame
    });
    expect(result.current.phase).toBe("expanding");
    // Origin is unchanged from the pre-expanding commit -- confirms the
    // radius-only transition has a stable position to animate from.
    expect(result.current.origin).toEqual({ x: 42, y: 24 });
  });

  it("walks a simple effect through expanding -> holding -> contracting -> idle", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    // Explicitly a simple (non-cinematic) effect, so this stays pinned to the
    // simple timing regardless of which effect DEFAULT_FILTER_PULSE_ID names.
    act(() => {
      result.current.trigger({ x: 10, y: 10 }, FilterPulseId.Sepia);
    });
    act(() => {
      jest.advanceTimersByTime(32); // flush the double requestAnimationFrame
    });
    expect(result.current.phase).toBe("expanding");
    expect(result.current.activeFilterId).toBe(FilterPulseId.Sepia);

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

  it("uses the cinematic effect's longer timing, and defaults to it", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    act(() => {
      jest.advanceTimersByTime(32);
    });
    // No explicit id -> the registry default, which is the cinematic effect.
    expect(result.current.activeFilterId).toBe(DEFAULT_FILTER_PULSE_ID);
    expect(result.current.activeFilterId).toBe(FilterPulseId.TheWorld);
    expect(result.current.phase).toBe("expanding");
    expect(result.current.durations).toEqual({
      expanding: 1050,
      holding: 500,
      contracting: 875,
    });

    act(() => {
      jest.advanceTimersByTime(1050);
    });
    expect(result.current.phase).toBe("holding");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.phase).toBe("contracting");

    act(() => {
      jest.advanceTimersByTime(875);
    });
    expect(result.current.phase).toBe("idle");
  });

  it("uses shorter durations when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    act(() => {
      jest.advanceTimersByTime(32); // flush the double requestAnimationFrame
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
      result.current.trigger({ x: 10, y: 10 }, FilterPulseId.Sepia);
    });
    expect(result.current.activeFilterId).toBe(FilterPulseId.Sepia);
  });

  it("ignores a re-trigger while a pulse is already running", () => {
    const { result } = renderHook(() => useFilterPulse(), { wrapper: FilterPulseProvider });

    act(() => {
      result.current.trigger({ x: 10, y: 10 }, FilterPulseId.Sepia);
    });
    act(() => {
      jest.advanceTimersByTime(32); // flush the double requestAnimationFrame
    });
    expect(result.current.phase).toBe("expanding");

    // Attempted re-trigger while already running: must be a no-op. Kept in
    // its own act() so the "expanding" phase (and the guard ref it sets)
    // has actually committed before this call reads it.
    act(() => {
      result.current.trigger({ x: 999, y: 999 }, FilterPulseId.Sepia);
    });
    expect(result.current.origin).toEqual({ x: 10, y: 10 });

    // Total time to idle still matches a single trigger's timeline.
    act(() => {
      jest.advanceTimersByTime(1200 + 700 + 1200);
    });
    expect(result.current.phase).toBe("idle");
  });

  it("cancels the pending requestAnimationFrame pair on unmount", () => {
    // Regression test: the "holding"/"contracting"/"idle" setTimeout chain
    // is only created once the second rAF fires, so unmounting *before*
    // that (the common case, since trigger() -> unmount can happen well
    // within one frame) previously left both rAF callbacks uncancelled --
    // they'd still fire later and call setPhase on the unmounted component.
    const cancelSpy = jest.spyOn(window, "cancelAnimationFrame");
    const { result, unmount } = renderHook(() => useFilterPulse(), {
      wrapper: FilterPulseProvider,
    });

    act(() => {
      result.current.trigger({ x: 10, y: 10 });
    });
    // Unmount before the double rAF has a chance to flush: only the first
    // rAF has been requested yet (the second is only scheduled from inside
    // the first's callback), so cancelling that one is enough to prevent
    // the whole chain from ever running.
    unmount();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
    cancelSpy.mockRestore();
  });

  it("cleans up pending timers on unmount without warning", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
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

    // No "state update on an unmounted component" (or similar) warning --
    // confirms the rAF pair and any setTimeout chain it would have created
    // are genuinely cancelled, not just silently swallowed.
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
