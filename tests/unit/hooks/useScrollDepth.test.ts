import { renderHook } from "@testing-library/react";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { trackScrollDepth } from "@/lib/analytics";

jest.mock("@/lib/analytics", () => ({
  trackScrollDepth: jest.fn(),
}));

describe("useScrollDepth", () => {
  const mockTrackScrollDepth = trackScrollDepth as jest.MockedFunction<typeof trackScrollDepth>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, writable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 3200,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should track 25% scroll depth", () => {
    renderHook(() => useScrollDepth());

    // Scroll to 25% (600px out of 2400px scrollable height)
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    window.dispatchEvent(new Event("scroll"));

    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 25 });
  });

  it("should track 50% scroll depth", () => {
    renderHook(() => useScrollDepth());

    // Scroll to 50% (1200px out of 2400px scrollable height)
    Object.defineProperty(window, "scrollY", { value: 1200, writable: true });
    window.dispatchEvent(new Event("scroll"));

    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 25 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 50 });
  });

  it("should track 75% scroll depth", () => {
    renderHook(() => useScrollDepth());

    // Scroll to 75% (1800px out of 2400px scrollable height)
    Object.defineProperty(window, "scrollY", { value: 1800, writable: true });
    window.dispatchEvent(new Event("scroll"));

    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 25 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 50 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 75 });
  });

  it("should track 100% scroll depth", () => {
    renderHook(() => useScrollDepth());

    // Scroll to 100% (2400px out of 2400px scrollable height)
    Object.defineProperty(window, "scrollY", { value: 2400, writable: true });
    window.dispatchEvent(new Event("scroll"));

    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 25 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 50 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 75 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 100 });
  });

  it("should track each milestone only once", () => {
    renderHook(() => useScrollDepth());

    // Scroll to 50% multiple times
    Object.defineProperty(window, "scrollY", { value: 1200, writable: true });
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));

    // Should only track 25% and 50% once each
    expect(mockTrackScrollDepth).toHaveBeenCalledTimes(2);
  });

  it("should check scroll depth on mount", () => {
    // User is already scrolled to 50%
    Object.defineProperty(window, "scrollY", { value: 1200, writable: true });

    renderHook(() => useScrollDepth());

    // Should immediately track 25% and 50%
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 25 });
    expect(mockTrackScrollDepth).toHaveBeenCalledWith({ depth_percentage: 50 });
  });

  it("should remove scroll listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollDepth());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
