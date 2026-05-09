# UI State Synchronization Fixes

## Overview

Fixed two related UI synchronization bugs where component state didn't match the displayed UI during initial render, causing confusing user experiences with "jumping" or mismatched icons/labels.

## Issues Fixed

### 1. Theme Toggle Icon Mismatch

**Problem**: Dark theme applied, but sun icon (☀️) displayed instead of moon (🌙)

### 2. Language Selector Display Mismatch

**Problem**: Page in English, but selector briefly showed Portuguese flag (🇧🇷) before updating to English (🇺🇸)

## Root Cause (Common Pattern)

Both issues stemmed from the same anti-pattern:

```typescript
// ❌ ANTI-PATTERN: Initialize with default, update in useEffect
const [state, setState] = useState(defaultValue);

useEffect(() => {
  const actualValue = readFromBrowser(); // localStorage, matchMedia, etc.
  setState(actualValue);
}, []);
```

**Why this fails:**

1. First render uses `defaultValue`
2. Component renders with wrong state
3. useEffect runs and updates state
4. Component re-renders with correct state
5. User sees a "flash" or "jump" from wrong → correct

## Solution (Common Pattern)

Use **lazy initialization** to compute the correct value immediately:

```typescript
// ✅ CORRECT PATTERN: Lazy initialization
const [state, setState] = useState(() => {
  if (typeof window === "undefined") return defaultValue; // SSR safety
  return readFromBrowser(); // Compute correct value immediately
});

useEffect(() => {
  // Only sync when necessary, not on every mount
  if (shouldSync) {
    setState(newValue);
  }
}, [dependencies]);
```

**Why this works:**

1. First render uses correct value from browser
2. Component renders correctly immediately
3. No visual "flash" or "jump"
4. Better user experience

## Specific Fixes

### Theme Toggle Fix

**File**: `hooks/useTheme.tsx`

```typescript
// Before
const [theme, setThemeState] = useState<Theme>(defaultTheme ?? "light");

useEffect(() => {
  const initial = getInitialTheme();
  setThemeState(initial);
  applyTheme(initial);
}, []);

// After
const [theme, setThemeState] = useState<Theme>(() => {
  if (typeof window === "undefined") return defaultTheme ?? "light";
  return getInitialTheme(); // Reads from localStorage/system preference
});

useEffect(() => {
  applyTheme(theme);
}, [theme]);
```

### Language Selector Fix

**File**: `hooks/useLanguage.ts`

```typescript
// Before
const [locale, setLocaleState] = useState<SupportedLocale>(currentLocale);

useEffect(() => {
  const saved = getStoredLocale();
  if (saved && saved !== currentLocale) {
    setLocaleState(saved);
  }
}, [currentLocale]);

// After
const [locale, setLocaleState] = useState<SupportedLocale>(() => {
  if (typeof window === "undefined") return currentLocale;

  const saved = getStoredLocale();
  if (saved) return saved;

  return currentLocale;
});

useEffect(() => {
  const saved = getStoredLocale();
  if (!saved && locale !== currentLocale) {
    setLocaleState(currentLocale);
  }
}, [currentLocale, locale]);
```

## Benefits

### User Experience

- ✅ No visual "flashing" or "jumping" of UI elements
- ✅ Icons and labels match the actual state immediately
- ✅ More professional and polished feel
- ✅ Reduced confusion for users

### Technical

- ✅ Fewer re-renders (no unnecessary state update after mount)
- ✅ Better performance (compute once vs compute + update)
- ✅ SSR-safe (handles server-side rendering correctly)
- ✅ All 65 tests pass

## Testing Results

### Test Coverage

- ✅ 22 tests in `useTheme.test.tsx`
- ✅ 11 tests in `ThemeToggle.test.tsx`
- ✅ 20 tests in `useLanguage.test.ts`
- ✅ 12 tests in `LanguageSelector.test.tsx`
- **Total: 65 tests passing**

### Build Verification

- ✅ Production build succeeds
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Static export generates correctly

## Files Modified

1. `hooks/useTheme.tsx` - Theme state initialization
2. `hooks/useLanguage.ts` - Language state initialization

## Verification Steps

### Theme Toggle

1. Set dark theme and refresh page multiple times
2. Verify sun icon (☀️) displays immediately in dark mode
3. Click toggle to switch to light mode
4. Verify moon icon (🌙) displays immediately
5. No "flash" of wrong icon

### Language Selector

1. Select English and navigate between pages
2. Verify English flag (🇺🇸) displays immediately
3. Refresh page multiple times
4. Verify flag remains correct (no flash of 🇧🇷)
5. Switch to Spanish
6. Verify Spanish flag (🇪🇸) displays immediately

## Lessons Learned

### When to Use Lazy Initialization

Use lazy initialization (`useState(() => ...)`) when:

- Reading from browser APIs (localStorage, sessionStorage, matchMedia)
- Computing expensive initial values
- Initial value depends on client-side state
- You want to avoid useEffect for initialization

### When NOT to Use Lazy Initialization

Don't use lazy initialization when:

- Initial value is a simple constant
- Value comes from props (use props directly)
- You need to re-compute on prop changes (use useEffect)

### React Best Practices

1. **Avoid useEffect for initialization** - Use lazy initialization instead
2. **SSR Safety** - Always check `typeof window === "undefined"`
3. **Minimize re-renders** - Compute correct value once, not twice
4. **Test thoroughly** - Ensure no regressions in existing functionality

## Related Requirements

### Theme System

- Requirement 17.1: Theme system implementation
- Requirement 17.2: FOUC prevention
- Requirement 17.6: Theme toggle functionality
- Requirement 17.7: Theme persistence

### Language System

- Requirement 11.2: Browser language detection
- Requirement 11.3: Fallback to pt-BR
- Requirement 11.4: Language preference persistence
- Requirement 11.5: Language selector component
- Requirement 11.6: localStorage persistence

## Future Considerations

This pattern can be applied to other state management scenarios:

- User preferences (font size, contrast mode)
- Feature flags from localStorage
- Session-based state
- Any client-side state that needs immediate initialization

## References

- [React useState Lazy Initialization](https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state)
- [React useEffect Best Practices](https://react.dev/learn/you-might-not-need-an-effect)
- Next.js SSR Considerations
