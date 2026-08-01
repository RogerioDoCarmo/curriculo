/**
 * Feature flag management utilities with Firebase Remote Config integration.
 * Provides functions to retrieve feature flags with caching and fallback support.
 *
 * Features:
 * - Remote Config integration for dynamic feature flags
 * - In-memory caching to minimize Remote Config fetches
 * - Graceful fallback to default values when offline or errors occur
 * - Type-safe flag retrieval (boolean, string, number)
 * - Analytics tracking for feature flag usage
 *
 * Requirements: 10.1
 */

import { getFirebaseRemoteConfig } from "./firebase";
import { trackFeatureFlagChecked } from "./analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Supported feature flag value types
 */
type FeatureFlagValue = boolean | string | number;

/**
 * Cache entry for a feature flag
 */
interface CacheEntry<T extends FeatureFlagValue> {
  value: T;
  timestamp: number;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

/**
 * In-memory cache for feature flag values.
 * Reduces Remote Config fetches and improves performance.
 */
const featureFlagCache = new Map<string, CacheEntry<FeatureFlagValue>>();

/**
 * Cache TTL in milliseconds (5 minutes)
 * After this time, flags will be refetched from Remote Config
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Clears the feature flag cache.
 * Useful for testing or forcing a refresh of all flags.
 */
export function clearFeatureFlagCache(): void {
  featureFlagCache.clear();
}

// ─── Feature Flag Retrieval ───────────────────────────────────────────────────

/**
 * Retrieves a feature flag value from Firebase Remote Config.
 *
 * Features:
 * - Fetches from Remote Config on first call
 * - Caches values for subsequent calls (5 minute TTL)
 * - Falls back to default value on errors or when offline
 * - Type-safe: returns same type as default value
 * - Tracks flag usage with Firebase Analytics
 *
 * @param key - The feature flag key (e.g., "use_locale_specific_pdfs")
 * @param defaultValue - Default value to use as fallback
 * @param trackUsage - Whether to track flag usage with analytics (default: true)
 * @returns The feature flag value or default value
 *
 * @example
 * ```typescript
 * // Boolean flag
 * const enabled = await getFeatureFlag("use_locale_specific_pdfs", false);
 *
 * // String flag
 * const apiUrl = await getFeatureFlag("api_url", "https://api.example.com");
 *
 * // Number flag
 * const maxRetries = await getFeatureFlag("max_retries", 3);
 *
 * // Disable analytics tracking
 * const flag = await getFeatureFlag("my_flag", false, false);
 * ```
 *
 * Requirements: 10.1
 */
export async function getFeatureFlag<T extends FeatureFlagValue>(
  key: string,
  defaultValue: T,
  trackUsage: boolean = true
): Promise<T> {
  try {
    // Check cache first
    const cached = featureFlagCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Track cached flag usage
      if (trackUsage) {
        trackFeatureFlagChecked({
          flag_name: key,
          flag_value: cached.value,
        });
      }
      return cached.value as T;
    }

    // Get Remote Config instance
    const remoteConfig = await getFirebaseRemoteConfig();

    // If Remote Config is unavailable (SSR, missing config, etc.), return default
    if (!remoteConfig) {
      // Track default value usage
      if (trackUsage) {
        trackFeatureFlagChecked({
          flag_name: key,
          flag_value: defaultValue,
        });
      }
      return defaultValue;
    }

    // Fetch and activate Remote Config (best-effort).
    //
    // `fetchAndActivate` resolves to `false` when no *new* config was activated —
    // e.g. within the `minimumFetchInterval`, or when the freshly fetched values
    // match the already-active config (which persists across sessions in
    // IndexedDB). That does NOT mean there is no value to read: previously
    // activated remote values and the in-app `defaultConfig` remain available via
    // `getValue`. So we never branch on the returned boolean — we always read the
    // active value below. Gating on `!activated` was the bug that collapsed
    // locale-specific resume PDFs to the generic default on repeat visits.
    const { fetchAndActivate, getValue } = await import("firebase/remote-config");

    try {
      await fetchAndActivate(remoteConfig);
    } catch (fetchError) {
      // A failed fetch still leaves `defaultConfig` (and any persisted activated
      // values) readable via `getValue`, so fall through rather than abort.
      console.warn(`[FeatureFlags] fetchAndActivate failed for "${key}":`, fetchError);
    }

    // Read the active value: remote → previously activated → in-app defaultConfig.
    const value = getValue(remoteConfig, key);

    // A "static" source means the key is configured in neither Remote Config nor
    // `defaultConfig`; honour the caller's default in that case.
    if (value.getSource() === "static") {
      if (trackUsage) {
        trackFeatureFlagChecked({
          flag_name: key,
          flag_value: defaultValue,
        });
      }
      return defaultValue;
    }

    // Convert to appropriate type based on default value type
    let flagValue: T;

    if (typeof defaultValue === "boolean") {
      flagValue = value.asBoolean() as T;
    } else if (typeof defaultValue === "number") {
      flagValue = value.asNumber() as T;
    } else {
      flagValue = value.asString() as T;
    }

    // Cache the value
    featureFlagCache.set(key, {
      value: flagValue,
      timestamp: Date.now(),
    });

    // Track flag usage
    if (trackUsage) {
      trackFeatureFlagChecked({
        flag_name: key,
        flag_value: flagValue,
      });
    }

    return flagValue;
  } catch (error) {
    // Log error for debugging but don't throw
    console.warn(`[FeatureFlags] Failed to fetch flag "${key}":`, error);

    // Track default value usage on error
    if (trackUsage) {
      trackFeatureFlagChecked({
        flag_name: key,
        flag_value: defaultValue,
      });
    }

    // Return default value on any error
    return defaultValue;
  }
}
