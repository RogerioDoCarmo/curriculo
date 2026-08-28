/**
 * Unit tests for the useCopyToClipboard hook.
 */

import { act, renderHook } from "@testing-library/react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

/** jsdom leaves `navigator.clipboard` undefined, so each test installs its own. */
const setClipboard = (value: unknown) => {
  Object.defineProperty(navigator, "clipboard", {
    value,
    configurable: true,
    writable: true,
  });
};

describe("useCopyToClipboard", () => {
  afterEach(() => {
    setClipboard(undefined);
    jest.useRealTimers();
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.status).toBe("idle");
    expect(result.current.copied).toBe(false);
    expect(result.current.failed).toBe(false);
  });

  it("writes the given text to the clipboard and reports success", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    const { result } = renderHook(() => useCopyToClipboard());
    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.copy("https://example.dev/en/?project=miroji#projects");
    });

    expect(writeText).toHaveBeenCalledWith("https://example.dev/en/?project=miroji#projects");
    expect(returned).toBe(true);
    expect(result.current.status).toBe("copied");
    expect(result.current.copied).toBe(true);
    expect(result.current.failed).toBe(false);
  });

  it("reports failure when the clipboard API is unavailable", async () => {
    setClipboard(undefined);

    const { result } = renderHook(() => useCopyToClipboard());
    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.copy("anything");
    });

    expect(returned).toBe(false);
    expect(result.current.status).toBe("failed");
    expect(result.current.failed).toBe(true);
    expect(result.current.copied).toBe(false);
  });

  it("reports failure when the write is rejected", async () => {
    setClipboard({ writeText: jest.fn().mockRejectedValue(new Error("denied")) });

    const { result } = renderHook(() => useCopyToClipboard());
    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.copy("anything");
    });

    expect(returned).toBe(false);
    expect(result.current.status).toBe("failed");
  });

  it("returns to idle after the reset delay", async () => {
    jest.useFakeTimers();
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

    const { result } = renderHook(() => useCopyToClipboard(2000));
    await act(async () => {
      await result.current.copy("anything");
    });
    expect(result.current.status).toBe("copied");

    act(() => {
      jest.advanceTimersByTime(1999);
    });
    expect(result.current.status).toBe("copied");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.status).toBe("idle");
  });

  it("honours a custom reset delay", async () => {
    jest.useFakeTimers();
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => {
      await result.current.copy("anything");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.status).toBe("idle");
  });

  it("clears the pending reset timer on unmount", async () => {
    jest.useFakeTimers();
    const clearSpy = jest.spyOn(global, "clearTimeout");
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

    const { result, unmount } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("anything");
    });

    clearSpy.mockClear();
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
