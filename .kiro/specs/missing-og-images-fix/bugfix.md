# Bugfix Requirements Document

## Introduction

This document defines the requirements for fixing missing Open Graph images in the site's social media metadata. Currently, when the site is shared on social media platforms (Twitter, LinkedIn, Facebook, etc.), no preview image appears because the `openGraph` and `twitter` metadata objects in `app/[locale]/layout.tsx` are missing the `images` property. This affects the site's professional appearance and reduces engagement when shared on social platforms.

The fix will add the `images` property to both metadata objects, using the existing `/public/og-image.png` file that is already present in the project.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the site metadata is generated in `app/[locale]/layout.tsx` THEN the `openGraph` object (lines 107-115) does not include an `images` property

1.2 WHEN the site metadata is generated in `app/[locale]/layout.tsx` THEN the `twitter` object (lines 116-121) does not include an `images` property

1.3 WHEN the site is shared on social media platforms THEN no preview image appears in the social media card

1.4 WHEN Vercel's debug tool analyzes the site metadata THEN it reports warnings for missing `twitter:image` and `og:image` tags

### Expected Behavior (Correct)

2.1 WHEN the site metadata is generated in `app/[locale]/layout.tsx` THEN the `openGraph` object SHALL include an `images` array with the Open Graph image URL, dimensions (1200x630), and alt text

2.2 WHEN the site metadata is generated in `app/[locale]/layout.tsx` THEN the `twitter` object SHALL include an `images` array with the Open Graph image URL

2.3 WHEN the site is shared on social media platforms THEN a preview image SHALL appear in the social media card showing the Open Graph image

2.4 WHEN Vercel's debug tool analyzes the site metadata THEN it SHALL show no warnings about missing `twitter:image` or `og:image` tags

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the site metadata is generated THEN the system SHALL CONTINUE TO include all existing metadata properties (title, description, keywords, authors, creator, metadataBase, alternates, siteName, locale, alternateLocale, robots)

3.2 WHEN the site is accessed in different locales (pt-BR, en, es) THEN the system SHALL CONTINUE TO generate locale-specific metadata correctly

3.3 WHEN the site is indexed by search engines THEN the system SHALL CONTINUE TO provide proper SEO metadata (robots, googleBot settings)

3.4 WHEN the `lib/seo.ts` utility is used elsewhere in the codebase THEN it SHALL CONTINUE TO function correctly with its existing image implementation
