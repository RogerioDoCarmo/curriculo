/**
 * React hook for feature flag management.
 * Provides a convenient way to use feature flags in React components.
 *
 * Features:
 * - Automatic fetching on mount
 * - Loading state management
 * - Error handling
 * - Type-safe flag values
 *
 * Requirements: 10.1
 */

"use client";

import { useState, useEffect } from "react";
import { getFeatureFlag } from "@/lib/feature-flags";

/**
 * Supported feature flag value types
 */
type FeatureFlagValue = boolean | string | number;

/**
 * Return type for useFeatureFlag hook
 */
interface UseFeatureFlagResult<T extends FeatureFlagValue> {
  /** The feature flag value (default value until loaded) */
  value: T;
  /** Whether the flag is currently being fetched */
  loading: boolean;
  /** Whether an error occurred while fetching */
  error: boolean;
}

/**
 * React hook to retrieve and use feature flags in components.
 *
 * Features:
 * - Fetches flag value on mount
 * - Provides loading state
 * - Handles errors gracefully
 * - Returns default value on errors
 * - Refetches when key changes
 *
 * @param key - The feature flag key (e.g., "use_locale_specific_pdfs")
 * @param defaultValue - Default value to use as fallback
 * @returns Object with value, loading, and error state
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { value: useLocalePdfs, loading } = useFeatureFlag(
 *     "use_locale_specific_pdfs",
 *     false
 *   );
 *
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>Feature enabled: {useLocalePdfs ? "Yes" : "No"}</div>;
 * }
 * ```
 *
 * Requirements: 10.1
 */
export function useFeatureFlag<T extends FeatureFlagValue>(
  key: string,
  defaultValue: T
): UseFeatureFlagResult<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchFlag() {
      try {
        setLoading(true);
        setError(false);

        const flagValue = await getFeatureFlag(key, defaultValue);

        if (isMounted) {
          setValue(flagValue);
          setLoading(false);
        }
      } catch (err) {
        console.warn(`[useFeatureFlag] Failed to fetch flag "${key}":`, err);

        if (isMounted) {
          setError(true);
          setLoading(false);
          // Keep default value on error
        }
      }
    }

    fetchFlag();

    return () => {
      isMounted = false;
    };
  }, [key, defaultValue]);

  return { value, loading, error };
}
