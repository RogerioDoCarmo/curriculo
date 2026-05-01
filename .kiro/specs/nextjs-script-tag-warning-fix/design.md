# Next.js Script Tag Warning Fix - Bugfix Design

## Overview

This bugfix addresses a console warning in Next.js 16.2.4: "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client." The warning appears on first page load in development mode due to an inline `<script>` tag in `app/[locale]/layout.tsx` (lines 196-204).

The script serves a critical function: preventing Flash of Unstyled Content (FOUC) by applying the theme class (`dark` or `light`) to `document.documentElement` before React hydration. This ensures users see the correct theme immediately without a visual flash.

The fix will migrate from a raw `<script>` tag to Next.js 16's recommended `next/script` component with the `beforeInteractive` strategy, which executes scripts before React hydration while eliminating the console warning.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a raw `<script>` tag is rendered inside a React component in Next.js 16
- **Property (P)**: The desired behavior - no console warnings while maintaining FOUC prevention functionality
- **Preservation**: Existing theme application, dark mode detection, error handling, and Schema.org scripts that must remain unchanged
- **FOUC (Flash of Unstyled Content)**: A visual artifact where content briefly appears unstyled before the correct theme is applied
- **beforeInteractive**: Next.js Script strategy that executes scripts before the page becomes interactive (before React hydration)
- **suppressHydrationWarning**: React attribute that suppresses hydration mismatch warnings when server and client HTML intentionally differ
- **localStorage**: Browser API for persistent client-side storage, used to save theme preference
- **prefers-color-scheme**: CSS media query that detects the user's system-level dark mode preference

## Bug Details

### Bug Condition

The bug manifests when Next.js 16.2.4 encounters a raw `<script>` tag rendered inside a React component's JSX. Next.js 16 introduced stricter validation to discourage this pattern because scripts in React components are not executed during client-side rendering, which can lead to developer confusion.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type ReactElement
  OUTPUT: boolean

  RETURN input.type === 'script'
         AND input is rendered inside React component JSX
         AND Next.js version >= 16.0.0
         AND environment === 'development'
         AND NOT using next/script component
END FUNCTION
```

### Examples

- **Current Implementation (triggers warning)**: `<script dangerouslySetInnerHTML={{ __html: '...' }} />` inside `app/[locale]/layout.tsx` → Console warning appears on first page load
- **Schema.org scripts (also trigger warning)**: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />` → Console warnings appear
- **After fix (no warning)**: `<Script id="theme-script" strategy="beforeInteractive">...</Script>` → No console warning
- **Edge case**: Multiple raw script tags in the same component → Multiple console warnings (one per script tag)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Theme application logic must continue to work exactly as before (read from localStorage, fallback to system preference, apply 'dark' class)
- FOUC prevention must remain effective (theme applied before visible rendering)
- Error handling must continue to gracefully catch localStorage access errors
- Schema.org structured data scripts must continue to render correctly
- The `suppressHydrationWarning` attribute on `<html>` and `<body>` must remain in place

**Scope:**
All functionality that does NOT involve the script tag rendering mechanism should be completely unaffected by this fix. This includes:

- Theme toggle functionality in the UI
- Theme persistence to localStorage
- System preference detection
- Dark mode CSS application
- Page rendering and hydration
- SEO structured data

## Hypothesized Root Cause

Based on the bug description and Next.js 16 documentation, the root cause is:

1. **Next.js 16 Validation Enhancement**: Next.js 16 introduced stricter validation that detects raw `<script>` tags in React components and emits console warnings. This is a deliberate design decision to guide developers toward the `next/script` component.

2. **Pattern Discouragement**: The warning exists because scripts in React component JSX are not executed during client-side navigation or re-renders, which can confuse developers. Next.js wants developers to use `next/script` for better control and optimization.

3. **Development-Only Warning**: The warning only appears in development mode as a developer experience improvement. It does not affect production builds or functionality.

4. **Multiple Script Tags**: The codebase has three raw `<script>` tags in the layout:
   - Theme FOUC prevention script (lines 196-204)
   - Person Schema.org script (line 189)
   - WebSite Schema.org script (line 192)

   All three trigger the warning, but the theme script is the most critical to fix due to its FOUC prevention role.

## Correctness Properties

Property 1: Bug Condition - No Console Warnings for Script Tags

_For any_ page load in Next.js 16.2.4 development mode where script tags are needed for theme application or structured data, the application SHALL use the `next/script` component with appropriate strategies, resulting in zero console warnings about script tags in React components.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Theme Application and FOUC Prevention

_For any_ page load where theme preferences exist in localStorage or system preferences, the fixed implementation SHALL apply the theme class to `document.documentElement` before React hydration with the same timing and behavior as the original inline script, preserving FOUC prevention functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Solution Analysis

Three approaches were considered:

**Option 1: Next.js Script Component with beforeInteractive Strategy** ✅ RECOMMENDED

- **Pros**: Official Next.js pattern, eliminates warning, maintains execution timing, works for both theme and Schema.org scripts
- **Cons**: Requires `id` prop, slightly more verbose syntax
- **Timing**: Executes before React hydration (same as current inline script)
- **Compatibility**: Fully supported in Next.js 16

**Option 2: Move Script to \_document.tsx**

- **Pros**: Would eliminate warning
- **Cons**: Next.js 16 App Router does not use `_document.tsx` (Pages Router only), not applicable
- **Verdict**: Not viable for App Router architecture

**Option 3: Suppress Warning with ESLint Comment**

- **Pros**: Minimal code change
- **Cons**: Does not fix the underlying issue, warning still appears in console, not a proper solution
- **Verdict**: Not recommended - treats symptom, not cause

### Recommended Solution: Option 1

Migrate all three script tags to use `next/script` with appropriate strategies:

**File**: `app/[locale]/layout.tsx`

**Specific Changes**:

1. **Add Import Statement**:

   ```typescript
   import Script from "next/script";
   ```

2. **Replace Theme FOUC Prevention Script** (lines 196-204):

   ```typescript
   // Before:
   <script
     dangerouslySetInnerHTML={{
       __html: `(function(){try{var saved=localStorage.getItem('theme');if(saved==='dark'||saved==='light'){if(saved==='dark')document.documentElement.classList.add('dark');}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}}catch(e){}})();`,
     }}
   />

   // After:
   <Script id="theme-init" strategy="beforeInteractive">
     {`(function(){try{var saved=localStorage.getItem('theme');if(saved==='dark'||saved==='light'){if(saved==='dark')document.documentElement.classList.add('dark');}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}}catch(e){}})();`}
   </Script>
   ```

3. **Replace Person Schema.org Script** (line 189):

   ```typescript
   // Before:
   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />

   // After:
   <Script id="person-schema" type="application/ld+json" strategy="beforeInteractive">
     {personSchema}
   </Script>
   ```

4. **Replace WebSite Schema.org Script** (line 192):

   ```typescript
   // Before:
   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webSiteSchema }} />

   // After:
   <Script id="website-schema" type="application/ld+json" strategy="beforeInteractive">
     {webSiteSchema}
   </Script>
   ```

5. **Remove ESLint Disable Comment** (line 195):
   ```typescript
   // Remove this line:
   {
     /* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */
   }
   ```

### Key Implementation Details

- **Strategy Choice**: `beforeInteractive` ensures scripts execute before React hydration, maintaining the same timing as inline scripts
- **ID Requirement**: Each `Script` component requires a unique `id` prop for Next.js to track and deduplicate scripts
- **Children vs dangerouslySetInnerHTML**: `next/script` accepts script content as children, which is cleaner than `dangerouslySetInnerHTML`
- **Type Attribute**: Schema.org scripts retain `type="application/ld+json"` to indicate JSON-LD format
- **Security**: The security comments can be preserved or moved to the `Script` components to maintain security documentation

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, confirm the warning exists in the current implementation, then verify the fix eliminates the warning while preserving all functionality.

### Exploratory Bug Condition Checking

**Goal**: Confirm the console warning appears in the UNFIXED code when raw `<script>` tags are rendered in Next.js 16.2.4 development mode.

**Test Plan**: Run the application in development mode, open the browser console, and observe the warning on first page load. Document the exact warning message and conditions.

**Test Cases**:

1. **First Page Load Warning**: Load the application in development mode → Warning appears in console (will fail on unfixed code)
2. **Subsequent Refresh**: Refresh the page → Warning may or may not appear depending on caching (will fail on unfixed code)
3. **Production Build**: Build and run in production mode → No warning should appear (passes on unfixed code, as warning is development-only)
4. **Multiple Script Tags**: Count the number of warnings → Should match the number of raw script tags (3 warnings expected)

**Expected Counterexamples**:

- Console warning: "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client."
- Warning appears for each raw `<script>` tag (theme script + 2 Schema.org scripts = 3 warnings)
- Possible causes: Next.js 16 validation detecting raw script tags in React component JSX

### Fix Checking

**Goal**: Verify that after migrating to `next/script`, no console warnings appear while theme application and FOUC prevention continue to work correctly.

**Pseudocode:**

```
FOR ALL page_load WHERE Next.js version >= 16.0.0 AND environment === 'development' DO
  result := renderLayout_fixed()
  ASSERT NO console warnings about script tags
  ASSERT theme class applied to document.documentElement before visible rendering
  ASSERT Schema.org scripts present in page source
END FOR
```

**Test Cases**:

1. **No Console Warnings**: Load the application in development mode → No script tag warnings in console
2. **Theme Applied Before Hydration**: Load with dark mode preference → Dark theme visible immediately without FOUC
3. **Schema.org Scripts Present**: Inspect page source → JSON-LD scripts present in `<head>`
4. **Error Handling Preserved**: Simulate localStorage error → Page renders without crashing

### Preservation Checking

**Goal**: Verify that all existing functionality remains unchanged after the fix.

**Pseudocode:**

```
FOR ALL user_interaction WHERE NOT related to script tag rendering DO
  ASSERT behavior_original(user_interaction) = behavior_fixed(user_interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across different theme preferences and system settings
- It catches edge cases that manual unit tests might miss (e.g., localStorage quota exceeded, invalid stored values)
- It provides strong guarantees that behavior is unchanged for all theme-related interactions

**Test Plan**: Observe behavior on UNFIXED code first for theme application, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Theme Toggle Preservation**: Click theme toggle button → Theme switches correctly (same behavior as before)
2. **localStorage Persistence Preservation**: Set theme, reload page → Theme preference persists (same behavior as before)
3. **System Preference Detection Preservation**: Clear localStorage, set system to dark mode, load page → Dark theme applied (same behavior as before)
4. **Error Handling Preservation**: Block localStorage access, load page → Page renders without crashing (same behavior as before)
5. **Hydration Preservation**: Verify `suppressHydrationWarning` still prevents hydration mismatch warnings

### Unit Tests

- Test that `next/script` components render with correct props (`id`, `strategy`, `type`)
- Test that theme script content matches the original inline script logic
- Test that Schema.org script content matches the original structured data
- Test that no ESLint warnings appear after removing the disable comment

### Property-Based Tests

- Generate random theme preferences (light, dark, null, invalid values) and verify theme application works correctly
- Generate random system preferences and verify fallback behavior
- Generate random localStorage states (available, blocked, quota exceeded) and verify error handling
- Test that theme application timing prevents FOUC across many scenarios

### Integration Tests

- Test full page load flow with theme application in development mode
- Test that console remains clean (no warnings) after fix
- Test that Schema.org structured data is correctly indexed by search engines (validate JSON-LD syntax)
- Test that theme toggle functionality works end-to-end after fix
- Test that page hydration completes successfully without errors
