/**
 * Unit tests for useFeatureFlag React hook.
 * Tests hook behavior, loading states, and error handling.
 *
 * Requirements: 10.1
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import * as featureFlagsModule from "@/lib/feature-flags";

// Mock feature-flags module
jest.mock("@/lib/feature-flags");

describe("useFeatureFlag hook", () => {
  const mockGetFeatureFlag = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (featureFlagsModule.getFeatureFlag as jest.Mock) = mockGetFeatureFlag;
  });

  it("should return default value initially", () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { result } = renderHook(() => useFeatureFlag("use_locale_specific_pdfs", false));

    expect(result.current.value).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch and return feature flag value", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { result } = renderHook(() => useFeatureFlag("use_locale_specific_pdfs", false));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe(true);
    expect(mockGetFeatureFlag).toHaveBeenCalledWith("use_locale_specific_pdfs", false);
  });

  it("should handle errors gracefully and return default value", async () => {
    mockGetFeatureFlag.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFeatureFlag("use_locale_specific_pdfs", false));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe(false);
    expect(result.current.error).toBe(true);
  });

  it("should work with string flags", async () => {
    mockGetFeatureFlag.mockResolvedValue("test-value");

    const { result } = renderHook(() => useFeatureFlag("test_string_flag", "default"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe("test-value");
  });

  it("should work with number flags", async () => {
    mockGetFeatureFlag.mockResolvedValue(42);

    const { result } = renderHook(() => useFeatureFlag("test_number_flag", 0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe(42);
  });

  it("should not refetch on re-render with same key", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { result, rerender } = renderHook(() =>
      useFeatureFlag("use_locale_specific_pdfs", false)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetFeatureFlag).toHaveBeenCalledTimes(1);

    // Re-render
    rerender();

    expect(mockGetFeatureFlag).toHaveBeenCalledTimes(1); // Still 1
  });

  it("should refetch when key changes", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { result, rerender } = renderHook(
      ({ key, defaultValue }) => useFeatureFlag(key, defaultValue),
      {
        initialProps: { key: "flag1", defaultValue: false },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetFeatureFlag).toHaveBeenCalledWith("flag1", false);

    // Change key
    mockGetFeatureFlag.mockResolvedValue(false);
    rerender({ key: "flag2", defaultValue: true });

    await waitFor(() => {
      expect(mockGetFeatureFlag).toHaveBeenCalledWith("flag2", true);
    });

    expect(mockGetFeatureFlag).toHaveBeenCalledTimes(2);
  });

  it("should handle loading state correctly", async () => {
    let resolvePromise: (value: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    mockGetFeatureFlag.mockReturnValue(promise);

    const { result } = renderHook(() => useFeatureFlag("use_locale_specific_pdfs", false));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.value).toBe(false);

    // Resolve promise
    resolvePromise!(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.value).toBe(true);
  });
});
