# LCP Image Optimization - Performance Fix

**Date**: May 6, 2026  
**Branch**: `perf/add-eager-loading-to-lcp-images`  
**Status**: ✅ Complete - Ready for PR

## Summary

Fixed Next.js warnings about Largest Contentful Paint (LCP) images and aspect ratio by:

1. Adding `priority` prop to above-the-fold images in the Hero component
2. Using actual image dimensions (width/height props)
3. Replacing inline styles with Tailwind CSS classes

## Changes Made

### Files Modified

- `components/Hero/index.tsx`

### Specific Changes

1. **UNESP Logo** (`/images/logos/logo_unesp.png`)
   - Added `priority` prop
   - Changed to actual dimensions: `width={1280}` `height={427}`
   - Replaced `style={{ width: "125px", height: "auto" }}` with Tailwind `w-[125px] h-auto`
   - Location: Education section in Hero component

2. **Topaz Company Logo** (`/images/logos/logo_topaz.svg`)
   - Added `priority` prop
   - Changed to actual dimensions: `width={1280}` `height={291}`
   - Replaced `style={{ width: "200px", height: "auto" }}` with Tailwind `w-[200px] h-auto`
   - Location: Current job section in Hero component

## Problem Description

Next.js detected two issues with these images:

### 1. LCP Warning (Fixed ✅)

Images were detected as Largest Contentful Paint (LCP) elements but were using default lazy loading:

```
[browser] Image with src "/images/logos/logo_unesp.png" was detected as the
Largest Contentful Paint (LCP). Please add the `loading="eager"` property if
this image is above the fold.
```

### 2. Aspect Ratio Warning (Fixed ✅)

Images had incorrect dimensions and inline styles that prevented proper aspect ratio calculation:

```
[browser] Image with src "http://localhost:3001/images/logos/logo_unesp.png"
has either width or height modified, but not the other. If you use CSS to
change the size of your image, also include the styles 'width: "auto"' or
'height: "auto"' to maintain the aspect ratio.
```

## Solution

### Fix 1: Priority Prop for LCP

Added `priority` prop to both Image components to ensure they load immediately since they are:

- Above the fold (visible without scrolling)
- Part of the LCP (Largest Contentful Paint) metric
- Critical for initial page render

**Important**: In Next.js, the `priority` prop (not `loading="eager"`) is the correct way to handle LCP images. The `priority` prop:

- Disables lazy loading
- Adds a preload `<link>` tag in the document head
- Ensures the image is fetched with high priority
- Is specifically designed for LCP optimization

### Fix 2: Actual Image Dimensions + Tailwind Classes

The key to fixing the aspect ratio warning is:

1. **Use actual image dimensions** in `width` and `height` props (not scaled-down values)
2. **Use Tailwind classes** for responsive sizing instead of inline styles
3. **Always include `h-auto`** to maintain aspect ratio

**Image Dimensions**:

- UNESP logo: 1280×427 pixels (aspect ratio ~3:1)
- Topaz logo: 1280×291 pixels (aspect ratio ~4.4:1)

**Before** (caused warnings):

```tsx
width={125}
height={50}
style={{ width: "125px", height: "auto" }}
```

**After** (no warnings):

```tsx
width={1280}
height={427}
className="w-[125px] h-auto"
```

## Performance Impact

### Before

- Images used default lazy loading
- LCP metric potentially delayed
- Next.js LCP warnings in browser console
- Aspect ratio warnings due to incorrect dimensions + inline styles

### After

- Images preloaded with priority prop ✅
- Improved LCP metric ✅
- No LCP warnings in browser console ✅
- No aspect ratio warnings ✅
- Better Core Web Vitals score ✅
- Proper aspect ratios maintained ✅

## Testing

### Build Test ✅

```bash
npm run build
```

- ✅ Build successful
- ✅ All 13 static pages generated
- ✅ No TypeScript errors
- ✅ No build warnings

### Dev Server Test ✅

```bash
npm run dev
```

- ✅ No LCP warnings in browser console
- ✅ No aspect ratio warnings in browser console
- ✅ Images load immediately
- ✅ Priority prop working correctly
- ✅ Aspect ratios maintained
- ✅ Responsive sizing works correctly

## Code Changes

### UNESP Logo

**Before**:

```tsx
<Image
  src="/images/logos/logo_unesp.png"
  alt="UNESP Logo"
  width={125}
  height={0}
  style={{ width: "125px", height: "auto" }}
  className="rounded"
/>
```

**After**:

```tsx
<Image
  src="/images/logos/logo_unesp.png"
  alt="UNESP Logo"
  width={1280}
  height={427}
  className="rounded w-[125px] h-auto"
  priority
/>
```

### Topaz Logo

**Before**:

```tsx
<Image
  src="/images/logos/logo_topaz.svg"
  alt="Company Logo"
  width={200}
  height={0}
  style={{ width: "200px", height: "auto" }}
  className="rounded"
/>
```

**After**:

```tsx
<Image
  src="/images/logos/logo_topaz.svg"
  alt="Company Logo"
  width={1280}
  height={291}
  className="rounded w-[200px] h-auto"
  priority
/>
```

## Next Steps

1. ✅ Create feature branch - `perf/add-eager-loading-to-lcp-images`
2. ✅ Make changes to Hero component
3. ✅ Run tests and build
4. ✅ Commit changes
5. ✅ Verify in dev server (no warnings)
6. ⏳ Push branch to remote
7. ⏳ Create PR to develop
8. ⏳ Merge to develop after CI passes
9. ⏳ Deploy to production via develop → main

## Related Documentation

- [Next.js Image Component - priority property](https://nextjs.org/docs/app/api-reference/components/image#priority)
- [Next.js Image Component - width and height](https://nextjs.org/docs/app/api-reference/components/image#width-and-height)
- [Web Vitals - LCP](https://web.dev/lcp/)
- [Core Web Vitals](https://web.dev/vitals/)

## Technical Notes

### Why Actual Dimensions Matter

Next.js Image component needs the actual image dimensions to:

1. Calculate the correct aspect ratio
2. Reserve space in the layout (prevent layout shift)
3. Generate optimized versions at different sizes

When you provide scaled dimensions (like 125×50 instead of 1280×427), Next.js can't properly calculate the aspect ratio, especially when combined with inline styles.

### Why Tailwind Classes Instead of Inline Styles

Using Tailwind classes (`w-[125px] h-auto`) instead of inline styles (`style={{ width: "125px", height: "auto" }}`) prevents the aspect ratio warning because:

1. Tailwind classes are applied via CSS, not inline styles
2. Next.js doesn't detect them as "modifying" the dimensions
3. The `h-auto` class properly maintains aspect ratio
4. It's more consistent with the rest of the codebase

### Images in Hero Component

- **Profile photo**: Already uses `priority` prop ✅
- **UNESP logo**: Now uses `priority` prop + actual dimensions + Tailwind ✅
- **Topaz logo**: Now uses `priority` prop + actual dimensions + Tailwind ✅

All three images are above the fold and critical for initial render.

---

**Commit**: `1bce041`  
**Branch**: `perf/add-eager-loading-to-lcp-images`  
**Ready for**: Push and PR creation  
**Verified**: No warnings in dev server (LCP + aspect ratio both fixed) ✅
