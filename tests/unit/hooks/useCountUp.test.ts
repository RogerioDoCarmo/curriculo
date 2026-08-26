import { renderHook, act } from "@testing-library/react";
import { useCountUp } from "@/hooks/useCountUp";

describe("useCountUp", () => {
  it("starts at 0", () => {
    const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    const { result } = renderHook(() => useCountUp(100));

    expect(result.current).toBe(0);
    raf.mockRestore();
  });

  it("advances toward the target as animation frames fire", () => {
    const frame: { cb: FrameRequestCallback | null } = { cb: null };
    let now = 0;
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frame.cb = cb;
      return 1;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    jest.spyOn(performance, "now").mockImplementation(() => now);

    const { result } = renderHook(() => useCountUp(100, { durationMs: 1000 }));

    act(() => {
      now = 500;
      frame.cb?.(now);
    });

    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);

    act(() => {
      now = 1000;
      frame.cb?.(now);
    });

    expect(result.current).toBe(100);

    jest.restoreAllMocks();
  });

  it("jumps straight to the target when the visitor prefers reduced motion", () => {
    jest.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    const raf = jest.spyOn(window, "requestAnimationFrame");

    const { result } = renderHook(() => useCountUp(42));

    expect(result.current).toBe(42);
    expect(raf).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it("cancels the pending animation frame on unmount", () => {
    jest.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 7);
    const caf = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    const { unmount } = renderHook(() => useCountUp(100));
    unmount();

    expect(caf).toHaveBeenCalledWith(7);
    jest.restoreAllMocks();
  });
});
