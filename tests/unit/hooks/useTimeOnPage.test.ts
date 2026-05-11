import { renderHook } from "@testing-library/react";
import { useTimeOnPage } from "@/hooks/useTimeOnPage";
import { trackTimeOnPage } from "@/lib/analytics";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/test-page"),
}));

jest.mock("@/lib/analytics", () => ({
  trackTimeOnPage: jest.fn(),
}));

describe("useTimeOnPage", () => {
  const mockTrackTimeOnPage = trackTimeOnPage as jest.MockedFunction<typeof trackTimeOnPage>;
  let dateNowSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    dateNowSpy = jest.spyOn(Date, "now");
    dateNowSpy.mockReturnValue(1000000); // Start time
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  it("should track time on page when component unmounts", () => {
    const { unmount } = renderHook(() => useTimeOnPage());

    // Simulate 5 seconds passing
    dateNowSpy.mockReturnValue(1005000);

    unmount();

    expect(mockTrackTimeOnPage).toHaveBeenCalledWith({
      page_path: "/test-page",
      time_seconds: 5,
    });
  });

  it("should track time on page when pathname changes", () => {
    const { rerender } = renderHook(() => useTimeOnPage());

    // Simulate 3 seconds passing
    dateNowSpy.mockReturnValue(1003000);

    // Change pathname (triggers cleanup of previous effect)
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/new-page");
    rerender();

    expect(mockTrackTimeOnPage).toHaveBeenCalledWith({
      page_path: "/test-page",
      time_seconds: 3,
    });
  });

  it("should not track if time spent is 0 seconds", () => {
    const { unmount } = renderHook(() => useTimeOnPage());

    // No time passes
    dateNowSpy.mockReturnValue(1000000);

    unmount();

    expect(mockTrackTimeOnPage).not.toHaveBeenCalled();
  });

  it("should add beforeunload listener on mount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    renderHook(() => useTimeOnPage());

    expect(addEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should remove beforeunload listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useTimeOnPage());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should reset start time when pathname changes", () => {
    const { usePathname } = require("next/navigation");

    // Start with first page
    usePathname.mockReturnValue("/first-page");
    const { rerender, unmount } = renderHook(() => useTimeOnPage());

    // Simulate 5 seconds passing on first page
    dateNowSpy.mockReturnValue(1005000);

    // Change pathname - this will trigger cleanup and track first page
    usePathname.mockReturnValue("/new-page");
    rerender();

    // First page should have been tracked with 5 seconds
    expect(mockTrackTimeOnPage).toHaveBeenCalledWith({
      page_path: "/first-page",
      time_seconds: 5,
    });

    // Reset mock to check new page tracking
    mockTrackTimeOnPage.mockClear();

    // Simulate 3 more seconds on new page
    dateNowSpy.mockReturnValue(1008000);
    unmount();

    // Should track 3 seconds for the new page
    expect(mockTrackTimeOnPage).toHaveBeenCalledWith({
      page_path: "/new-page",
      time_seconds: 3,
    });
  });
});
