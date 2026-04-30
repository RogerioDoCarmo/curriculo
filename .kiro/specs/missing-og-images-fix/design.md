# Missing Open Graph Images Bugfix Design

## Overview

This bugfix addresses the missing Open Graph and Twitter Card images in the site's social media metadata. The bug manifests when the site is shared on social platforms - no preview image appears because the `openGraph` and `twitter` metadata objects in `app/[locale]/layout.tsx` lack the `images` property. The fix is straightforward: add the `images` property to both metadata objects, referencing the existing `/public/og-image.png` file with proper dimensions and alt text. This is a minimal, targeted change that enhances social media presence without altering any existing functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when social media platforms request Open Graph or Twitter Card metadata and the `images` property is missing from the metadata objects
- **Property (P)**: The desired behavior when metadata is generated - both `openGraph` and `twitter` objects should include properly formatted `images` arrays
- **Preservation**: All existing metadata properties (title, description, locale support, SEO settings) that must remain unchanged by the fix
- **generateMetadata**: The async function in `app/[locale]/layout.tsx` (lines 68-127) that dynamically generates Next.js metadata based on the current locale
- **openGraph**: The metadata object (lines 107-115) that provides Open Graph protocol tags for social media platforms
- **twitter**: The metadata object (lines 116-121) that provides Twitter Card tags for Twitter/X sharing
- **SITE_URL**: The constant `"https://rogeriodocarmo.com"` used as the base URL for all metadata

## Bug Details

### Bug Condition

The bug manifests when social media platforms (Twitter, LinkedIn, Facebook, etc.) request Open Graph or Twitter Card metadata from the site. The `generateMetadata` function returns metadata objects where the `openGraph` and `twitter` properties lack the `images` field, causing social platforms to display no preview image when the site is shared.

**Formal Specification:**

```
FUNCTION isBugCondition(metadata)
  INPUT: metadata of type Metadata (Next.js metadata object)
  OUTPUT: boolean

  RETURN (metadata.openGraph EXISTS AND metadata.openGraph.images IS UNDEFINED)
         OR (metadata.twitter EXISTS AND metadata.twitter.images IS UNDEFINED)
END FUNCTION
```

### Examples

- **Twitter Share**: When a user shares `https://rogeriodocarmo.com` on Twitter, the tweet shows only the title and description, with no preview image card
- **LinkedIn Share**: When a user shares `https://rogeriodocarmo.com/en` on LinkedIn, the post displays text-only metadata without a visual preview
- **Facebook Share**: When a user shares `https://rogeriodocarmo.com/es` on Facebook, the post lacks the large image preview that typically appears with proper Open Graph tags
- **Vercel Debug Tool**: When analyzing the site with Vercel's OG image debugger, it reports warnings for missing `twitter:image` and `og:image` tags

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- All existing metadata properties must continue to work exactly as before (title, description, keywords, authors, creator, metadataBase, alternates, siteName, locale, alternateLocale, robots)
- Locale-specific metadata generation must remain unchanged (pt-BR, en, es)
- SEO metadata and search engine indexing behavior must remain unchanged
- The `lib/seo.ts` utility file must continue to function correctly with its existing image implementation
- Canonical URLs and alternate language links must remain unchanged

**Scope:**
All metadata generation logic that does NOT involve the `images` property should be completely unaffected by this fix. This includes:

- Title and description generation based on locale
- Keywords arrays for each locale
- Author and creator metadata
- Canonical URL generation
- Alternate language links
- Robot indexing directives
- Structured data scripts (Person and WebSite schemas)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is clear and straightforward:

1. **Missing Property**: The `openGraph` object (lines 107-115) and `twitter` object (lines 116-121) in `app/[locale]/layout.tsx` were created without the `images` property

2. **Incomplete Implementation**: While the project has an existing `/public/og-image.png` file (1200x630 dimensions) and the `lib/seo.ts` utility correctly implements image metadata, the main layout file's `generateMetadata` function was not updated to include images

3. **Not a Logic Error**: This is not a conditional logic bug or edge case - the `images` property is simply absent from the metadata objects

4. **Reference Implementation Exists**: The `lib/seo.ts` file shows the correct pattern for including images in both `openGraph` and `twitter` metadata, which can be used as a reference for the fix

## Correctness Properties

Property 1: Bug Condition - Open Graph and Twitter Images Present

_For any_ metadata generation request where the locale is valid and the `generateMetadata` function is called, the returned metadata object SHALL include an `images` array in both the `openGraph` object (with url, width, height, and alt properties) and the `twitter` object (with url), referencing `/og-image.png`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Existing Metadata Unchanged

_For any_ metadata generation request, the fixed `generateMetadata` function SHALL produce exactly the same values for all existing metadata properties (title, description, keywords, authors, creator, metadataBase, alternates, openGraph.type, openGraph.url, openGraph.title, openGraph.description, openGraph.siteName, openGraph.locale, openGraph.alternateLocale, twitter.card, twitter.title, twitter.description, twitter.creator, robots) as the original function, preserving all existing SEO and social media functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

The root cause is confirmed - the `images` property is simply missing from the metadata objects.

**File**: `app/[locale]/layout.tsx`

**Function**: `generateMetadata` (lines 68-127)

**Specific Changes**:

1. **Add images to openGraph object** (after line 115):
   - Add an `images` property to the `openGraph` object
   - Use an array with a single image object containing:
     - `url: "/og-image.png"` (relative path, will be resolved by metadataBase)
     - `width: 1200` (standard Open Graph image width)
     - `height: 630` (standard Open Graph image height)
     - `alt: title` (use the locale-specific title as alt text)

2. **Add images to twitter object** (after line 121):
   - Add an `images` property to the `twitter` object
   - Use an array with a single string: `["/og-image.png"]`
   - This follows Next.js Metadata API convention for Twitter Cards

3. **Maintain existing structure**:
   - Keep all existing properties in both objects unchanged
   - Ensure proper TypeScript typing (Next.js Metadata type will validate)
   - Follow the existing code style and formatting

4. **Reference implementation**:
   - The `lib/seo.ts` file (lines 42-49 for openGraph, line 54 for twitter) shows the correct pattern
   - Adapt this pattern to the layout file's metadata structure

5. **No additional files needed**:
   - The `/public/og-image.png` file already exists
   - No new imports or dependencies required
   - No changes to other files needed

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, confirm the bug exists by checking the current metadata output, then verify the fix adds the images correctly while preserving all existing metadata.

### Exploratory Bug Condition Checking

**Goal**: Confirm the bug exists in the current code BEFORE implementing the fix. Verify that the `openGraph` and `twitter` objects lack the `images` property.

**Test Plan**: Inspect the metadata returned by `generateMetadata` for each locale. Run these checks on the UNFIXED code to observe the missing `images` properties and understand the exact structure.

**Test Cases**:

1. **pt-BR Locale Test**: Call `generateMetadata` with locale "pt-BR" and verify `openGraph.images` is undefined (will fail on unfixed code)
2. **en Locale Test**: Call `generateMetadata` with locale "en" and verify `twitter.images` is undefined (will fail on unfixed code)
3. **es Locale Test**: Call `generateMetadata` with locale "es" and verify both `openGraph.images` and `twitter.images` are undefined (will fail on unfixed code)
4. **Social Media Scraper Test**: Use a social media debugger tool (Twitter Card Validator, Facebook Sharing Debugger, or Vercel OG debugger) to confirm no image appears (will fail on unfixed code)

**Expected Counterexamples**:

- `metadata.openGraph.images` returns `undefined` instead of an array
- `metadata.twitter.images` returns `undefined` instead of an array
- Social media debuggers report missing `og:image` and `twitter:image` tags
- Possible causes: property not defined in metadata objects, incorrect property name, incorrect structure

### Fix Checking

**Goal**: Verify that for all metadata generation requests (all locales), the fixed function includes properly formatted `images` arrays in both `openGraph` and `twitter` objects.

**Pseudocode:**

```
FOR ALL locale IN ["pt-BR", "en", "es"] DO
  metadata := generateMetadata_fixed({ params: { locale } })

  ASSERT metadata.openGraph.images IS DEFINED
  ASSERT metadata.openGraph.images IS ARRAY
  ASSERT metadata.openGraph.images[0].url = "/og-image.png"
  ASSERT metadata.openGraph.images[0].width = 1200
  ASSERT metadata.openGraph.images[0].height = 630
  ASSERT metadata.openGraph.images[0].alt = metadataByLocale[locale].title

  ASSERT metadata.twitter.images IS DEFINED
  ASSERT metadata.twitter.images IS ARRAY
  ASSERT metadata.twitter.images[0] = "/og-image.png"
END FOR
```

### Preservation Checking

**Goal**: Verify that for all metadata generation requests, the fixed function produces exactly the same values for all existing metadata properties as the original function.

**Pseudocode:**

```
FOR ALL locale IN ["pt-BR", "en", "es"] DO
  original := generateMetadata_original({ params: { locale } })
  fixed := generateMetadata_fixed({ params: { locale } })

  ASSERT fixed.title = original.title
  ASSERT fixed.description = original.description
  ASSERT fixed.keywords = original.keywords
  ASSERT fixed.authors = original.authors
  ASSERT fixed.creator = original.creator
  ASSERT fixed.metadataBase = original.metadataBase
  ASSERT fixed.alternates = original.alternates
  ASSERT fixed.openGraph.type = original.openGraph.type
  ASSERT fixed.openGraph.url = original.openGraph.url
  ASSERT fixed.openGraph.title = original.openGraph.title
  ASSERT fixed.openGraph.description = original.openGraph.description
  ASSERT fixed.openGraph.siteName = original.openGraph.siteName
  ASSERT fixed.openGraph.locale = original.openGraph.locale
  ASSERT fixed.openGraph.alternateLocale = original.openGraph.alternateLocale
  ASSERT fixed.twitter.card = original.twitter.card
  ASSERT fixed.twitter.title = original.twitter.title
  ASSERT fixed.twitter.description = original.twitter.description
  ASSERT fixed.twitter.creator = original.twitter.creator
  ASSERT fixed.robots = original.robots
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates test cases for all three locales automatically
- It catches any unintended changes to existing metadata properties
- It provides strong guarantees that behavior is unchanged for all non-image metadata

**Test Plan**: First, capture the current metadata output for all locales on UNFIXED code (excluding the missing `images` properties). Then, after applying the fix, write property-based tests that verify all captured properties remain identical.

**Test Cases**:

1. **Title Preservation**: Verify that title generation for all locales produces the same values after the fix
2. **Description Preservation**: Verify that description generation for all locales produces the same values after the fix
3. **SEO Metadata Preservation**: Verify that keywords, authors, creator, robots, and googleBot settings remain unchanged
4. **Locale Support Preservation**: Verify that canonical URLs, alternate language links, and locale-specific metadata continue to work correctly

### Unit Tests

- Test that `generateMetadata` returns metadata with `openGraph.images` array for each locale
- Test that `openGraph.images[0]` has correct url, width, height, and alt properties
- Test that `twitter.images` array contains the correct image URL
- Test that all existing metadata properties remain unchanged after adding images
- Test edge case: invalid locale defaults to "pt-BR" and still includes images

### Property-Based Tests

- Generate test cases for all three supported locales and verify images are present in metadata
- Generate test cases verifying all existing metadata properties match the original implementation
- Test that image URLs are correctly resolved by Next.js metadataBase (absolute URLs in rendered HTML)

### Integration Tests

- Use social media debugger tools (Twitter Card Validator, Facebook Sharing Debugger, Vercel OG debugger) to verify images appear correctly
- Test that the site displays preview images when shared on actual social media platforms
- Verify that the rendered HTML includes proper `<meta property="og:image">` and `<meta name="twitter:image">` tags
- Test that locale switching continues to work correctly with images present
