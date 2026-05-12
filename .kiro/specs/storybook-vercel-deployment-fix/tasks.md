# Implementation Plan

## Overview

This implementation plan pivots from deploying Storybook HTML files (which have security vulnerabilities) to creating a custom component gallery page within the Next.js application. This approach avoids all security issues while providing a clean, integrated way to showcase components.

**Reason for Pivot**:

1. CodeQL identified 6 security vulnerabilities (4 high, 2 medium) in Storybook's bundled JavaScript
2. PDF generation approach failed (components don't render in automated screenshots)
3. Storybook docs-only build also doesn't work properly

**Final Approach**: Build a custom `/components` page in the Next.js app that imports and displays all components with their variants.

---

## Tasks

- [x] 1. Clean up failed approaches
  - [x] 1.1 Remove obsolete test files
    - Deleted `tests/e2e/storybook-vercel-deployment.spec.ts`
    - Removed Storybook deployment E2E tests
    - _Requirements: Clean slate for new approach_

  - [x] 1.2 Remove deployment scripts from package.json
    - Removed `build:with-storybook` script
    - Removed `copy-storybook` script
    - Kept Storybook for development only
    - _Requirements: Clean up obsolete scripts_

- [x] 2. Create component gallery page structure
  - [x] 2.1 Create components page route
    - Created `app/[locale]/components/page.tsx`
    - Set up page structure with metadata and SEO
    - Added `generateStaticParams()` for static export
    - Added `setRequestLocale()` for locale handling
    - Fixed async params handling for Next.js 16
    - Added translations for page title and description in all 3 locales
    - _Requirements: New component gallery page_

  - [x] 2.2 Create ComponentShowcase component
    - Created `components/ComponentShowcase/index.tsx`
    - Component displays:
      - Component name and description
      - Live preview of the component
      - Proper styling with Tailwind CSS
    - Styled to match site design system
    - _Requirements: Reusable showcase component_

- [x] 3. Implement component gallery content
  - [x] 3.1 Add Button component showcase
    - Imported Button component
    - Shows all variants (primary, secondary, ghost)
    - Shows all sizes (small, medium, large)
    - Shows states (default, disabled, loading)
    - Added padding to button containers
    - Increased button inner padding for better UX
    - _Requirements: Button component display_

  - [x] 3.2 Add Card component showcase
    - Imported Card component
    - Shows with and without title
    - Shows different content examples
    - Added padding to container
    - _Requirements: Card component display_

  - [x] 3.3 Add Modal component showcase
    - Imported Modal component
    - Shows 4 different modal types:
      - Basic modal with content
      - Confirmation modal with Cancel/Confirm buttons
      - Info modal with list items
      - Form modal with input fields
    - All modals are fully functional
    - Added padding to container
    - _Requirements: Modal component display_

  - [x] 3.4 Add LanguageSelector component showcase
    - Imported LanguageSelector component
    - Passed currentLocale prop correctly
    - Shows language switching functionality
    - Added padding to container
    - _Requirements: LanguageSelector component display_

  - [x] 3.5 Add ThemeToggle component showcase
    - Imported ThemeToggle component
    - Shows theme switching functionality
    - Added padding to container
    - _Requirements: ThemeToggle component display_

  - [x] 3.6 Add HighlightedText component showcase
    - Imported HighlightedText component
    - Shows different highlight styles
    - Added bold text example with `<strong>` tag
    - Added padding to container
    - _Requirements: HighlightedText component display_

- [x] 4. Add navigation and styling
  - [x] 4.1 Update Tech Stack page link
    - Updated `components/TechStackSection/index.tsx`
    - Changed link to point to `/components` page
    - Updated link text to "View Component Gallery"
    - Added translations for new link text in all 3 locales
    - Moved button to top of page (after header)
    - Fixed locale-aware navigation using `useLocale()` hook
    - Used Next.js Link component with `href={`/${locale}/components`}`
    - _Requirements: Navigation to component gallery_

  - [x] 4.2 Add component gallery styling
    - Created responsive layout for components
    - Added section headers and descriptions
    - Ensured mobile-friendly design
    - Matched site's design system (colors, typography, spacing)
    - Added consistent padding to all component showcases
    - _Requirements: Professional appearance_

- [x] 5. Write tests for component gallery
  - [x] 5.1 Write unit tests for ComponentShowcase
    - Created `components/ComponentShowcase/__tests__/ComponentShowcase.test.tsx`
    - Tests component renders correctly
    - Tests title, description, and children rendering
    - Tests semantic structure and styling
    - Tests edge cases (long text, special characters)
    - All tests passing (38 test suites, 645 tests)
    - _Requirements: Component testing_

  - [x] 5.2 Write E2E test for component gallery page
    - Created `tests/e2e/component-gallery.spec.ts`
    - Tests page loads correctly for all locales
    - Tests all 6 components are visible
    - Tests navigation from Tech Stack page
    - Tests modal interactions (open/close, different types)
    - Tests responsive design (mobile, tablet, desktop)
    - Tests accessibility (headings, ARIA, keyboard navigation)
    - Tests performance (load time, no console errors)
    - _Requirements: E2E testing_

- [ ] 6. Deploy and validate on Vercel
  - [ ] 6.1 Deploy to Vercel preview environment
    - Commit all changes
    - Push to feature branch `feat/storybook-deployment-alternative`
    - Wait for Vercel preview deployment
    - Note the preview URL
    - _Requirements: Deployment_

  - [ ] 6.2 Manual testing on Vercel preview
    - Visit component gallery page on preview URL
    - Verify all components render correctly
    - Test all 4 modal types work
    - Test on multiple browsers (Chrome, Firefox, Safari)
    - Test on mobile devices
    - Verify locale-aware navigation works
    - _Requirements: Cross-browser testing_

  - [ ] 6.3 Verify no security vulnerabilities
    - Check GitHub CodeQL scan results
    - Verify no new security alerts
    - Confirm previous Storybook vulnerabilities are gone (no Storybook deployment)
    - _Requirements: Security requirement_

  - [ ] 6.4 Verify main site functionality preserved
    - Visit main pages: `/`, `/en/`, `/es/`, `/tech-stack/`, `/privacy/`, `/cookies/`, `/terms/`
    - Verify all pages load correctly
    - Verify no console errors
    - Test navigation between pages
    - _Requirements: No regressions_

- [ ] 7. Checkpoint - Ensure all requirements met
  - Run all automated tests (`npm test`)
  - Verify component gallery works on deployed site
  - Verify no security vulnerabilities
  - Verify all existing functionality preserved
  - If any issues arise, document and ask user for guidance
  - Once all tests pass, ready for production deployment

---

## Implementation Details

### Files Created:

- `app/[locale]/components/page.tsx` - Component gallery page
- `components/ComponentShowcase/index.tsx` - Reusable showcase component
- `components/ComponentShowcase/__tests__/ComponentShowcase.test.tsx` - Unit tests
- `tests/e2e/component-gallery.spec.ts` - E2E tests

### Files Modified:

- `components/TechStackSection/index.tsx` - Added component gallery link
- `components/Button/index.tsx` - Increased button padding
- `messages/en.json` - Added ComponentGallery translations
- `messages/es.json` - Added ComponentGallery translations
- `messages/pt-BR.json` - Added ComponentGallery translations
- `package.json` - Removed obsolete deployment scripts

### Files Deleted:

- `tests/e2e/storybook-vercel-deployment.spec.ts` - Obsolete test

### Key Fixes Applied:

1. **Next.js 16 Async Params** - Updated `generateMetadata` to await params
2. **Static Export Compatibility** - Added `setRequestLocale()` and proper locale validation
3. **LanguageSelector Prop** - Passed `currentLocale` prop to component
4. **Locale-Aware Navigation** - Used `useLocale()` hook to construct proper URLs
5. **Button Padding** - Increased inner padding for better UX
6. **Modal Examples** - Added 4 different modal types for comprehensive showcase

---

## Notes

- **Approach Change**: Pivoted from PDF generation to custom component gallery page
- **Security**: Custom Next.js page avoids all Storybook security vulnerabilities
- **Simplicity**: Integrated into existing Next.js app, no separate deployment needed
- **User Experience**: Interactive component gallery with live previews and multiple modal examples
- **Maintainability**: Easy to update and maintain as part of the main codebase
- **Testing**: Comprehensive unit and E2E tests ensure quality
- **Storybook**: Kept for development purposes only, not deployed

## Success Criteria

- [x] Component gallery page accessible at `/components` route (all locales)
- [x] All 6 component types displayed with variants
- [x] Navigation link from Tech Stack page works correctly with locale preservation
- [x] Page is responsive and works on mobile devices
- [x] Multiple modal examples showcase different use cases
- [x] All automated tests written and passing
- [ ] No security vulnerabilities in CodeQL scan (pending deployment)
- [ ] All existing functionality preserved (pending deployment verification)

## Next Steps

1. Commit all changes to feature branch
2. Push to GitHub and create PR
3. Wait for Vercel preview deployment
4. Run manual testing on preview URL
5. Verify CodeQL scan results
6. Merge to main if all checks pass
