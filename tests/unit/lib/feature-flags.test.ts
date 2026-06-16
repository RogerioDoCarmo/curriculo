/**
 * Unit tests for feature flag management utilities.
 * Tests Remote Config integration, caching, and fallback behavior.
 *
 * Requirements: 10.1
 */

import { getFeatureFlag, clearFeatureFlagCache } from "@/lib/feature-flags";
import * as firebaseModule from "@/lib/firebase";

// Mock Firebase module
jest.mock("@/lib/firebase");

// Mock firebase/remote-config module
jest.mock("firebase/remote-config", () => ({
  fetchAndActivate: jest.fn(),
  getValue: jest.fn(),
}));

describe("Feature Flag Management", () => {
  const mockGetRemoteConfig = firebaseModule.getFirebaseRemoteConfig as jest.MockedFunction<
    typeof firebaseModule.getFirebaseRemoteConfig
  >;

  let mockFetchAndActivate: jest.Mock;
  let mockGetValue: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    clearFeatureFlagCache();

    // Get the mocked functions from firebase/remote-config
    const remoteConfigModule = await import("firebase/remote-config");
    mockFetchAndActivate = remoteConfigModule.fetchAndActivate as jest.Mock;
    mockGetValue = remoteConfigModule.getValue as jest.Mock;
  });

  describe("getFeatureFlag", () => {
    it("should return default value when Remote Config is unavailable", async () => {
      mockGetRemoteConfig.mockResolvedValue(null);

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(false);
      expect(mockGetRemoteConfig).toHaveBeenCalled();
    });

    it("should fetch and return boolean flag from Remote Config", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => true,
        asString: () => "true",
        asNumber: () => 1,
        getSource: () => "remote",
      });

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(true);
      expect(mockFetchAndActivate).toHaveBeenCalledWith(mockRemoteConfig);
      expect(mockGetValue).toHaveBeenCalledWith(mockRemoteConfig, "use_locale_specific_pdfs");
    });

    it("should fetch and return string flag from Remote Config", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => false,
        asString: () => "test-value",
        asNumber: () => 0,
        getSource: () => "remote",
      });

      const result = await getFeatureFlag("test_string_flag", "default");

      expect(result).toBe("test-value");
      expect(mockFetchAndActivate).toHaveBeenCalledWith(mockRemoteConfig);
      expect(mockGetValue).toHaveBeenCalledWith(mockRemoteConfig, "test_string_flag");
    });

    it("should fetch and return number flag from Remote Config", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => false,
        asString: () => "42",
        asNumber: () => 42,
        getSource: () => "remote",
      });

      const result = await getFeatureFlag("test_number_flag", 0);

      expect(result).toBe(42);
      expect(mockFetchAndActivate).toHaveBeenCalledWith(mockRemoteConfig);
      expect(mockGetValue).toHaveBeenCalledWith(mockRemoteConfig, "test_number_flag");
    });

    it("should cache flag values to minimize Remote Config fetches", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => true,
        asString: () => "true",
        asNumber: () => 1,
        getSource: () => "remote",
      });

      // First call - should fetch
      const result1 = await getFeatureFlag("use_locale_specific_pdfs", false);
      expect(result1).toBe(true);
      expect(mockFetchAndActivate).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await getFeatureFlag("use_locale_specific_pdfs", false);
      expect(result2).toBe(true);
      expect(mockFetchAndActivate).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it("should still read the active value (defaultConfig) when the fetch fails", async () => {
      // A failed fetch must not discard the in-app defaultConfig — getValue still
      // returns it, so the flag should resolve to that value, not the caller default.
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockRejectedValue(new Error("Network error"));
      mockGetValue.mockReturnValue({
        asBoolean: () => true,
        asString: () => "true",
        asNumber: () => 1,
        getSource: () => "default",
      });

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(true);
      expect(mockFetchAndActivate).toHaveBeenCalledWith(mockRemoteConfig);
      expect(mockGetValue).toHaveBeenCalledWith(mockRemoteConfig, "use_locale_specific_pdfs");
    });

    it("should handle getValue errors gracefully and return default value", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockImplementation(() => {
        throw new Error("getValue error");
      });

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(false);
    });

    it("reads the active value even when fetchAndActivate returns false (locale-PDF regression)", async () => {
      // fetchAndActivate returns false on repeat visits (nothing new to activate),
      // but the already-active remote value must still be honoured. Previously the
      // code bailed to the caller default here, collapsing locale PDFs to generic.
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(false); // No new values activated
      mockGetValue.mockReturnValue({
        asBoolean: () => true,
        asString: () => "true",
        asNumber: () => 1,
        getSource: () => "remote",
      });

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(true);
      expect(mockGetValue).toHaveBeenCalledWith(mockRemoteConfig, "use_locale_specific_pdfs");
    });

    it("returns the caller default when the value source is 'static' (key unconfigured)", async () => {
      // No Remote Config param and no defaultConfig entry → static source. The
      // caller's default must win rather than the static zero-value (false/0/"").
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => false,
        asString: () => "",
        asNumber: () => 0,
        getSource: () => "static",
      });

      const result = await getFeatureFlag("unconfigured_flag", true);

      expect(result).toBe(true);
    });

    it("should handle offline scenarios by returning cached or default values", async () => {
      mockGetRemoteConfig.mockResolvedValue(null);

      const result = await getFeatureFlag("use_locale_specific_pdfs", false);

      expect(result).toBe(false);
    });
  });

  describe("Cache management", () => {
    it("should clear cache when clearFeatureFlagCache is called", async () => {
      const mockRemoteConfig = {} as any;

      mockGetRemoteConfig.mockResolvedValue(mockRemoteConfig);
      mockFetchAndActivate.mockResolvedValue(true);
      mockGetValue.mockReturnValue({
        asBoolean: () => true,
        asString: () => "true",
        asNumber: () => 1,
        getSource: () => "remote",
      });

      // First call - should fetch
      await getFeatureFlag("use_locale_specific_pdfs", false);
      expect(mockFetchAndActivate).toHaveBeenCalledTimes(1);

      // Clear cache
      clearFeatureFlagCache();

      // Second call - should fetch again
      await getFeatureFlag("use_locale_specific_pdfs", false);
      expect(mockFetchAndActivate).toHaveBeenCalledTimes(2);
    });
  });
});
