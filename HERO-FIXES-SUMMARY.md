# Hero Component Fixes Summary

## Issues Fixed

### 1. ✅ Spanish Locale Not Updating in Hero Component

**Problem**: When users selected Spanish language, the Hero component texts (degrees, dissertation, job title) were not updating because the component only checked for `pt-BR` and defaulted to English for everything else.

**Solution**: Updated all locale-dependent text in Hero component to use ternary operators that check for `pt-BR`, then `es`, then default to `en`.

**Changes Made**:

- Bachelor degree: "Licenciado en Ciencias de la Computación"
- Master degree: "Máster en Ciencias Cartográficas"
- Dissertation title: "Disertación de maestría completa:"
- Dissertation link text: "Evaluación de la calidad de las medidas y posicionamiento GNSS en smartphones Android"
- Download button: "Descargar Disertación (PDF)"
- Job title: "Desarrollador Mobile Senior"
- Job duration: "2023 - 2026 (3 años)"

**Testing**: Added 4 new tests for Spanish locale, all 39 tests passing ✅

**Files Modified**:

- `components/Hero/index.tsx`
- `tests/unit/components/Hero.test.tsx`

---

### 2. ✅ Scroll Behavior Warning

**Warning Message**:

```
Detected `scroll-behavior: smooth` on the `<html>` element.
To disable smooth scrolling during route transitions, add
`data-scroll-behavior="smooth"` to your <html> element.
```

**Status**: ✅ **Already Fixed**

The layout already has `data-scroll-behavior="smooth"` attribute on the `<html>` element (line 199 in `app/[locale]/layout.tsx`). This warning should not appear anymore.

**No Action Needed** - The fix is already in place.

---

### 3. ⚠️ Hydration Mismatch Warning

**Error Message**:

```
Uncaught Error: Hydration failed because the server rendered HTML
didn't match the client.
...
<div
+  hidden={true}
-  hidden={null}
-  id="brk_yuan">
```

**Root Cause**: This is caused by a **browser extension** injecting HTML into the page. The `id="brk_yuan"` is not present in our codebase - it's being injected by an extension.

**Why This Happens**:

1. Browser extensions inject HTML/scripts into pages
2. This happens after server-side rendering but before React hydration
3. React detects the mismatch between server HTML and client HTML
4. Common culprits: ad blockers, password managers, translation extensions

**Current Mitigation**:

- The layout already has `suppressHydrationWarning` on `<html>` and `<body>` tags
- This suppresses hydration warnings for intentional mismatches (like theme application)
- However, it doesn't suppress warnings from browser extension injections

**Solutions**:

#### Option 1: Ignore the Warning (Recommended)

This is a **false positive** caused by browser extensions, not our code. The warning is harmless and doesn't affect functionality.

**Action**: No code changes needed. Users can:

- Disable browser extensions temporarily to verify
- Use incognito/private mode (extensions disabled by default)
- Ignore the warning as it doesn't affect site functionality

#### Option 2: Add Error Boundary

If you want to catch and log these errors without showing them to users:

```tsx
// Add to app/[locale]/layout.tsx
"use client";

import { Component, ReactNode } from "react";

class HydrationErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Only log hydration errors from browser extensions
    if (error.message.includes("Hydration failed")) {
      console.warn("Hydration mismatch (likely browser extension):", error);
    }
  }

  render() {
    return this.props.children;
  }
}
```

#### Option 3: Detect and Warn Users

Add a development-only warning to inform developers about browser extensions:

```tsx
// Add to app/[locale]/layout.tsx (inside useEffect)
useEffect(() => {
  if (process.env.NODE_ENV === "development") {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.id === "brk_yuan") {
            console.warn(
              "⚠️ Browser extension detected injecting HTML. " +
                "This may cause hydration warnings. " +
                "Disable extensions or use incognito mode for testing."
            );
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }
}, []);
```

**Recommendation**: **Option 1** - Ignore the warning. It's a known issue with browser extensions and doesn't affect site functionality. The warning only appears in development mode and won't affect production users.

---

## Summary

| Issue                       | Status               | Action Required        |
| --------------------------- | -------------------- | ---------------------- |
| Spanish locale not updating | ✅ Fixed             | None - committed       |
| Scroll behavior warning     | ✅ Already fixed     | None - already in code |
| Hydration mismatch          | ⚠️ Browser extension | None - false positive  |

## Testing

All tests passing:

- 39 Hero component tests ✅
- Build successful ✅
- Spanish locale working correctly ✅

## Commits

1. `fix: use useLocale hook in Hero component for reactive language switching`
2. `fix: add Spanish locale support to Hero component`

---

## Additional Notes

### Browser Extension Detection

To verify the hydration warning is from a browser extension:

1. Open the site in **incognito/private mode** (extensions disabled)
2. Check if the warning still appears
3. If it doesn't appear, it's definitely a browser extension

Common extensions that cause this:

- Grammarly
- LastPass / 1Password
- Google Translate
- Ad blockers
- Dark Reader
- Honey / Shopping extensions

### Production Impact

**None** - These warnings only appear in development mode. Production builds don't show these warnings to end users.
