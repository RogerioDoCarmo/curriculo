# Color Contrast Accessibility Fix - Bugfix Design

## Overview

The TechStack section contains color contrast violations where links using `text-primary-600` (#2563eb) fail to meet WCAG 2 AA minimum contrast ratio of 4.5:1 against card backgrounds. While the Tailwind config documents that `primary-600` achieves 4.54:1 contrast on pure white (#ffffff), the actual card backgrounds use CSS custom properties (`bg-card`) that may have slightly different values, causing the contrast to drop below the threshold. This affects 11 technology documentation links and creates accessibility barriers for users with visual impairments.

The fix strategy involves replacing `text-primary-600` with `text-primary-700` (#1d4ed8) for links in the TechStack section, which provides 6.08:1 contrast on white backgrounds, ensuring WCAG AA compliance with a comfortable margin. This is a targeted fix scoped specifically to TechStack section links to avoid unintended side effects elsewhere in the application.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when TechStack section links use `text-primary-600` on card backgrounds, resulting in contrast ratios below 4.5:1
- **Property (P)**: The desired behavior - links should have a minimum contrast ratio of 4.5:1 against their backgrounds, meeting WCAG AA standards
- **Preservation**: Existing link behavior (hover states, focus rings, icons) and other section styling that must remain unchanged by the fix
- **text-primary-600**: Tailwind CSS class applying color #2563eb (4.54:1 contrast on pure white)
- **text-primary-700**: Tailwind CSS class applying color #1d4ed8 (6.08:1 contrast on pure white)
- **bg-card**: CSS custom property for card backgrounds, defined in globals.css via `--background` token
- **WCAG AA**: Web Content Accessibility Guidelines Level AA, requiring 4.5:1 minimum contrast for normal text
- **Contrast Ratio**: The luminance difference between foreground and background colors, expressed as a ratio (e.g., 4.5:1)

## Bug Details

### Bug Condition

The bug manifests when a link in the TechStack section uses the `text-primary-600` class (#2563eb) on a card background. The card background uses `bg-card` which resolves to CSS custom property `--background`, and while `primary-600` achieves 4.54:1 contrast on pure white (#ffffff), the actual rendered contrast falls below the WCAG AA threshold of 4.5:1, likely due to slight variations in the background color value or rendering differences.

**Formal Specification:**

```
FUNCTION isBugCondition(element)
  INPUT: element of type HTMLElement (link in TechStack section)
  OUTPUT: boolean

  RETURN element.tagName == 'A'
         AND element.classList.contains('text-primary-600')
         AND element.closest('[data-testid="tech-card"]') != null
         AND contrastRatio(element.color, element.backgroundColor) < 4.5
END FUNCTION
```

### Examples

- **Example 1**: Link to "nextjs.org" with `text-primary-600` on card background
  - **Expected**: Contrast ratio ≥ 4.5:1
  - **Actual**: Contrast ratio < 4.5:1 (reported by Vercel Debug tool)

- **Example 2**: Link to "typescriptlang.org" with `text-primary-600` on card background
  - **Expected**: Contrast ratio ≥ 4.5:1
  - **Actual**: Contrast ratio < 4.5:1 (reported by Vercel Debug tool)

- **Example 3**: Link to "tailwindcss.com" with `text-primary-600` on card background
  - **Expected**: Contrast ratio ≥ 4.5:1
  - **Actual**: Contrast ratio < 4.5:1 (reported by Vercel Debug tool)

- **Edge Case**: Link in dark mode with `text-primary-600`
  - **Expected**: Contrast ratio ≥ 4.5:1 with dark mode background
  - **Actual**: May have even lower contrast if primary-600 is not adjusted for dark backgrounds

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Link hover states (underline on hover) must continue to work exactly as before
- Link focus states (focus ring with `focus:ring-2 focus:ring-ring`) must continue to work exactly as before
- ExternalLink icon display alongside link text must remain unchanged
- Link transition effects (`transition-colors duration-200`) must remain unchanged
- Card styling (padding, border, background, shadow on hover) must remain unchanged
- Non-link text colors (headings, descriptions, labels) must remain unchanged
- Grid layout and responsive behavior must remain unchanged
- Links in other sections using `text-primary-600` must remain unchanged (fix is scoped to TechStack only)

**Scope:**
All elements that are NOT links in the TechStack section should be completely unaffected by this fix. This includes:

- Links in other sections (Hero, About, Projects, Contact, Footer)
- Non-link elements using `text-primary-600` anywhere in the application
- Card backgrounds, borders, and other styling
- Text colors for headings, descriptions, and labels
- Layout and spacing

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Insufficient Contrast Margin**: The `text-primary-600` color (#2563eb) provides only 4.54:1 contrast on pure white, which is barely above the 4.5:1 threshold. Any slight variation in background color (due to CSS custom properties, rendering differences, or color space conversions) causes the contrast to fall below the minimum.

2. **CSS Custom Property Resolution**: The card background uses `bg-card` which resolves to `hsl(var(--background))`. The HSL color space and custom property resolution may introduce slight variations from pure white (#ffffff), reducing the effective contrast ratio.

3. **Dark Mode Considerations**: In dark mode, `text-primary-600` may not be adjusted appropriately for dark backgrounds, potentially creating even lower contrast ratios. The dark mode background is `#111827` and the foreground is `#f9fafb`, but link colors may not follow this pattern.

4. **Browser Rendering Differences**: Different browsers may render HSL colors slightly differently, and anti-aliasing or subpixel rendering can affect perceived contrast, especially for colors near the threshold.

## Correctness Properties

Property 1: Bug Condition - TechStack Links Meet WCAG AA Contrast

_For any_ link element in the TechStack section (identified by being within a `[data-testid="tech-card"]` element), the fixed implementation SHALL use a color that provides a minimum contrast ratio of 4.5:1 against the card background, ensuring WCAG AA compliance and making links clearly distinguishable for users with visual impairments.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-TechStack Elements Unchanged

_For any_ element that is NOT a link in the TechStack section (including links in other sections, non-link elements, card styling, and layout), the fixed implementation SHALL produce exactly the same visual appearance and behavior as the original implementation, preserving all existing functionality and styling outside the TechStack section links.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (insufficient contrast margin with `text-primary-600`):

**File**: `components/TechStackSection/index.tsx`

**Function/Component**: `TechStackSection` (link rendering within the technology card)

**Specific Changes**:

1. **Replace Link Color Class**: Change `text-primary-600` to `text-primary-700` for the documentation link
   - Current: `text-sm font-medium text-primary-600`
   - Fixed: `text-sm font-medium text-primary-700`
   - Rationale: `primary-700` (#1d4ed8) provides 6.08:1 contrast on white, well above the 4.5:1 threshold

2. **Update Hover Color Class**: Change `hover:text-primary-700` to `hover:text-primary-800` to maintain visual hierarchy
   - Current: `hover:text-primary-700`
   - Fixed: `hover:text-primary-800`
   - Rationale: Maintains the pattern of darkening on hover while ensuring contrast remains high

3. **Verify Dark Mode Behavior**: Ensure the color change works correctly in dark mode
   - The Tailwind classes should automatically handle dark mode via the `dark:` prefix if needed
   - May need to add `dark:text-primary-400` or similar if the default behavior doesn't provide sufficient contrast in dark mode

4. **Scope the Fix**: Ensure the change only affects TechStack section links
   - The change is made within the `TechStackSection` component, so it's naturally scoped
   - No changes to global styles or other components

5. **Test Contrast Ratios**: Verify the fix with contrast checking tools
   - Use browser DevTools or Vercel Debug tool to confirm contrast ratios
   - Test in both light and dark modes
   - Test across different browsers

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code using contrast checking tools, then verify the fix works correctly and preserves existing behavior through automated tests and manual verification.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Use browser DevTools, Vercel Debug tool, or automated accessibility testing tools (like axe-core or Lighthouse) to measure contrast ratios of TechStack section links on the UNFIXED code. Document the actual contrast ratios and compare them to the WCAG AA threshold of 4.5:1.

**Test Cases**:

1. **Light Mode Contrast Test**: Measure contrast ratio of `text-primary-600` links on card backgrounds in light mode (will fail on unfixed code - expected < 4.5:1)
2. **Dark Mode Contrast Test**: Measure contrast ratio of `text-primary-600` links on card backgrounds in dark mode (will fail on unfixed code - may be even lower)
3. **Multiple Link Test**: Verify that all 11 technology links exhibit the same contrast issue (will fail on unfixed code)
4. **Background Color Verification**: Inspect the actual computed background color of cards to confirm it differs from pure white (may reveal the root cause)

**Expected Counterexamples**:

- Contrast ratios between 4.0:1 and 4.5:1 for `text-primary-600` on card backgrounds
- Possible causes: CSS custom property resolution, HSL color space variations, browser rendering differences

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (TechStack section links), the fixed function produces the expected behavior (contrast ratio ≥ 4.5:1).

**Pseudocode:**

```
FOR ALL link WHERE isBugCondition(link) DO
  result := measureContrastRatio(link)
  ASSERT result >= 4.5
END FOR
```

**Testing Approach**: Use automated accessibility testing tools to verify contrast ratios after the fix is applied.

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (non-TechStack elements), the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL element WHERE NOT isBugCondition(element) DO
  ASSERT originalAppearance(element) = fixedAppearance(element)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Capture screenshots or visual snapshots of the UNFIXED code for non-TechStack sections and elements, then compare them to the fixed code to verify no visual changes occurred.

**Test Cases**:

1. **Hero Section Links Preservation**: Verify that links in the Hero section continue to use their original colors and styling
2. **Footer Links Preservation**: Verify that links in the Footer section continue to use their original colors and styling
3. **Card Styling Preservation**: Verify that card backgrounds, borders, padding, and hover effects remain unchanged
4. **Non-Link Text Preservation**: Verify that headings, descriptions, and labels in TechStack cards retain their original colors

### Unit Tests

- Test that TechStack section links render with `text-primary-700` class after fix
- Test that TechStack section links render with `hover:text-primary-800` class after fix
- Test that link hover states continue to display underline
- Test that link focus states continue to display focus ring
- Test that ExternalLink icon continues to render alongside link text
- Test that links in other sections do NOT use `text-primary-700` (preservation)

### Property-Based Tests

- Generate random viewport sizes and verify TechStack links maintain contrast ratio ≥ 4.5:1 across all sizes
- Generate random theme states (light/dark mode) and verify TechStack links maintain contrast ratio ≥ 4.5:1 in both modes
- Generate random technology configurations and verify all links have sufficient contrast
- Test that all non-TechStack elements continue to render with their original colors across many scenarios

### Integration Tests

- Test full page rendering with TechStack section and verify all 11 links meet WCAG AA contrast standards
- Test theme switching (light to dark mode) and verify links maintain sufficient contrast in both modes
- Test that Vercel Debug tool or Lighthouse reports zero color contrast violations after fix
- Test that visual regression testing (e.g., Percy, Chromatic) shows no unintended changes outside TechStack section
