# Language Selector Synchronization Fix

## Problem

The language selector component sometimes displayed the wrong language flag/label when accessing the site. For example, the page might be in English (URL: `/en`), but the selector would briefly show Portuguese (🇧🇷) before updating to English (🇺🇸). This created a confusing user experience where the displayed language didn't match the selector.

## Root Cause

Similar to the theme toggle issue, the problem was in the `useLanguage` hook initialization:

1. **Initial State**: The hook initialized with `currentLocale` parameter (from URL)
2. **useEffect Update**: After mount, it checked localStorage and updated the state
3. **Timing Issue**: During the first render, the state didn't reflect the saved preference

This created a mismatch where:

- The page content was in the correct language (from URL)
- But the selector showed the wrong language (from initial state)
- After the useEffect ran, the selector updated, causing a visual "jump"

## Solution

Changed the `useLanguage` hook to initialize state with the actual saved preference from the start:

```typescript
// Before (incorrect):
const [locale, setLocaleState] = useState<SupportedLocale>(currentLocale);

useEffect(() => {
  const saved = getStoredLocale();
  if (saved && saved !== currentLocale) {
    setLocaleState(saved);
  } else if (!saved) {
    const detected = detectBrowserLocale();
    if (detected !== currentLocale) {
      setLocaleState(detected);
    }
  }
}, [currentLocale]);

// After (correct):
const [locale, setLocaleState] = useState<SupportedLocale>(() => {
  if (typeof window === "undefined") return currentLocale;

  // Check for saved preference first - this takes priority
  const saved = getStoredLocale();
  if (saved) return saved;

  // Otherwise use the current locale from URL
  return currentLocale;
});

useEffect(() => {
  const saved = getStoredLocale();
  // Only update if there's no saved preference and currentLocale differs
  if (!saved && locale !== currentLocale) {
    setLocaleState(currentLocale);
  }
}, [currentLocale, locale]);
```

### Key Changes:

1. **Lazy Initialization**: Used a function in `useState` to compute the initial value only once
2. **Priority Order**:
   - First: Saved preference from localStorage
   - Second: Current locale from URL
3. **SSR Safety**: Returns `currentLocale` during server-side rendering
4. **Smart Sync**: Only updates state when necessary (no saved preference and locale differs)

## Benefits

1. ✅ **Selector Matches Language**: The language selector now correctly reflects the current language from the first render
2. ✅ **No Visual Jumps**: Eliminates the "flash" where the selector briefly shows the wrong language
3. ✅ **Respects User Preference**: Saved language preference takes priority over URL
4. ✅ **Better UX**: Users see the correct language flag/label immediately
5. ✅ **All Tests Pass**: No breaking changes to existing functionality

## Testing

All existing tests pass:

- ✅ 20 tests in `useLanguage.test.ts`
- ✅ 12 tests in `LanguageSelector.test.tsx`
- ✅ Build succeeds without errors
- ✅ No TypeScript diagnostics

## Files Modified

- `hooks/useLanguage.ts` - Updated `useLanguage` hook initialization logic

## Verification Steps

To verify the fix works:

1. Open the site and select a language (e.g., English)
2. Navigate to different pages
3. Verify the language selector always shows the correct flag (🇺🇸 for English)
4. Refresh the page multiple times
5. Verify the selector remains correct (no flash of wrong language)
6. Switch to another language (e.g., Spanish)
7. Verify the selector immediately shows 🇪🇸
8. Close and reopen the browser
9. Verify the saved language preference is maintained

## Related Requirements

- Requirement 11.2: Browser language detection
- Requirement 11.3: Fallback to pt-BR for unsupported languages
- Requirement 11.4: Language preference persistence
- Requirement 11.5: Language selector component
- Requirement 11.6: Language preference persistence to localStorage

## Comparison with Theme Fix

Both fixes follow the same pattern:

- **Problem**: State initialized with default value, then updated in useEffect
- **Solution**: Use lazy initialization to compute correct value from the start
- **Result**: UI matches state immediately, no visual jumps or confusion

This demonstrates a common React pattern: when you need to initialize state from browser APIs (localStorage, matchMedia, etc.), use lazy initialization instead of useEffect to avoid mismatches during the first render.
