# Next.js Best Practices and Common Pitfalls

**Last Updated**: May 6, 2026  
**Purpose**: Prevent common Next.js issues in code generation and development

## Table of Contents

1. [Next.js Image Component](#nextjs-image-component)
2. [Hydration Issues](#hydration-issues)
3. [Performance Optimization](#performance-optimization)
4. [SSR vs Client-Side Rendering](#ssr-vs-client-side-rendering)

---

## Next.js Image Component

### ✅ Correct Usage

#### For Above-the-Fold Images (LCP)

```tsx
import Image from "next/image";

// ✅ CORRECT: Use actual image dimensions + priority prop
<Image
  src="/images/logo.png"
  alt="Company Logo"
  width={1280} // Actual image width
  height={427} // Actual image height
  className="w-[125px] h-auto" // Tailwind for responsive sizing
  priority // Disables lazy loading for LCP images
/>;
```

**Key Points**:

- ✅ Use `priority` prop for above-the-fold images
- ✅ Use **actual image dimensions** in `width`/`height` props
- ✅ Use **Tailwind classes** for responsive sizing (`w-[Xpx] h-auto`)
- ✅ Always include `h-auto` to maintain aspect ratio

#### For Below-the-Fold Images

```tsx
// ✅ CORRECT: Default lazy loading for below-the-fold images
<Image
  src="/images/content.jpg"
  alt="Content Image"
  width={1920}
  height={1080}
  className="w-full h-auto"
  // No priority prop = lazy loading (default)
/>
```

### ❌ Common Mistakes

```tsx
// ❌ WRONG: Using scaled dimensions instead of actual dimensions
<Image
  src="/images/logo.png"
  width={125}         // Scaled, not actual
  height={50}         // Scaled, not actual
  style={{ width: "125px", height: "auto" }}  // Inline styles
/>
// Result: Aspect ratio warnings

// ❌ WRONG: Using height={0}
<Image
  src="/images/logo.png"
  width={125}
  height={0}          // Invalid
/>
// Result: Aspect ratio warnings

// ❌ WRONG: Using loading="eager" instead of priority
<Image
  src="/images/logo.png"
  width={1280}
  height={427}
  loading="eager"     // Not supported by Next.js Image
/>
// Result: LCP warnings (lazy loading still active)

// ❌ WRONG: Missing priority for above-the-fold images
<Image
  src="/images/hero.jpg"
  width={1920}
  height={1080}
  // Missing priority prop
/>
// Result: LCP warnings, poor performance
```

### How to Get Actual Image Dimensions

```bash
# macOS
sips -g pixelWidth -g pixelHeight public/images/logo.png

# Linux
identify -format "%wx%h" public/images/logo.png

# Or check in browser DevTools
```

### Priority Prop Decision Tree

```
Is the image above the fold (visible without scrolling)?
├─ YES → Use priority prop
│   └─ Is it the Largest Contentful Paint (LCP) element?
│       ├─ YES → MUST use priority prop
│       └─ NO → Should use priority prop
└─ NO → Don't use priority prop (lazy loading is good)
```

---

## Hydration Issues

### Problem: Server/Client Mismatch

Hydration errors occur when the server-rendered HTML doesn't match the client-rendered HTML.

### ✅ Solution: Use Mounted State

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during SSR
  if (!mounted) {
    return (
      <button disabled aria-label="Toggle theme">
        ☀️ {/* Neutral placeholder */}
      </button>
    );
  }

  // Render actual content after hydration
  const icon = theme === "dark" ? "☀️" : "🌙";
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {icon}
    </button>
  );
}
```

### Common Hydration Triggers

#### ❌ Avoid These Patterns

```tsx
// ❌ WRONG: Using window/localStorage directly in render
function Component() {
  const theme = localStorage.getItem("theme"); // Undefined on server
  return <div>{theme}</div>;
}

// ❌ WRONG: Using Date.now() or Math.random()
function Component() {
  const id = Math.random(); // Different on server vs client
  return <div id={id}>Content</div>;
}

// ❌ WRONG: Browser-only APIs in render
function Component() {
  const width = window.innerWidth; // Undefined on server
  return <div>{width}px</div>;
}

// ❌ WRONG: Conditional rendering based on typeof window
function Component() {
  if (typeof window !== "undefined") {
    return <ClientComponent />;
  }
  return <ServerComponent />;
}
```

#### ✅ Correct Patterns

```tsx
// ✅ CORRECT: Use mounted state
function Component() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setTheme(localStorage.getItem("theme"));
  }, []);

  if (!mounted) {
    return <div>Loading...</div>; // Placeholder
  }

  return <div>{theme}</div>;
}

// ✅ CORRECT: Use useEffect for browser APIs
function Component() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <div>{width}px</div>;
}

// ✅ CORRECT: Use suppressHydrationWarning for dynamic content
function Component() {
  return <time suppressHydrationWarning>{new Date().toLocaleString()}</time>;
}
```

### When to Use suppressHydrationWarning

Use `suppressHydrationWarning` **only** when:

1. The content is intentionally different on server vs client
2. The difference is acceptable (e.g., timestamps, user-specific data)
3. You can't use the mounted state pattern

```tsx
// ✅ CORRECT: Acceptable use of suppressHydrationWarning
<html lang={locale} suppressHydrationWarning>
  <body suppressHydrationWarning className={theme}>
    {children}
  </body>
</html>
```

---

## Performance Optimization

### Image Optimization Checklist

- [ ] Use Next.js `Image` component (not `<img>`)
- [ ] Provide actual image dimensions in `width`/`height` props
- [ ] Use `priority` prop for above-the-fold images
- [ ] Use Tailwind classes for responsive sizing
- [ ] Always include `h-auto` for aspect ratio
- [ ] Optimize image files (WebP, AVIF formats)
- [ ] Use appropriate `sizes` prop for responsive images

### Example: Responsive Image

```tsx
<Image
  src="/images/hero.jpg"
  alt="Hero Image"
  width={1920}
  height={1080}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

### Core Web Vitals

**LCP (Largest Contentful Paint)**:

- Use `priority` prop on LCP images
- Preload critical resources
- Optimize server response time

**CLS (Cumulative Layout Shift)**:

- Always provide `width` and `height` for images
- Reserve space for dynamic content
- Use `aspect-ratio` CSS property

**FID (First Input Delay)**:

- Minimize JavaScript execution time
- Use code splitting
- Defer non-critical scripts

---

## SSR vs Client-Side Rendering

### When to Use "use client"

```tsx
// ✅ Use "use client" when component needs:
// - Browser APIs (window, localStorage, etc.)
// - React hooks (useState, useEffect, etc.)
// - Event handlers (onClick, onChange, etc.)
// - Third-party libraries that use browser APIs

"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### When to Use Server Components (Default)

```tsx
// ✅ Use Server Components (no "use client") when:
// - Fetching data from database/API
// - Accessing backend resources
// - Keeping sensitive data on server
// - Reducing client-side JavaScript

// No "use client" directive
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{data.title}</div>;
}
```

### Mixing Server and Client Components

```tsx
// ✅ CORRECT: Server Component wrapping Client Component
// app/page.tsx (Server Component)
import ClientComponent from "./ClientComponent";

export default async function Page() {
  const data = await fetchData();
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientComponent initialData={data} />
    </div>
  );
}

// ClientComponent.tsx (Client Component)
("use client");

export default function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // ... client-side logic
}
```

---

## Quick Reference

### Image Component Checklist

```tsx
// Template for above-the-fold images
<Image
  src="/path/to/image.ext"
  alt="Descriptive alt text"
  width={ACTUAL_WIDTH}      // Get from image file
  height={ACTUAL_HEIGHT}    // Get from image file
  className="w-[Xpx] h-auto" // Tailwind for sizing
  priority                   // For LCP images
/>

// Template for below-the-fold images
<Image
  src="/path/to/image.ext"
  alt="Descriptive alt text"
  width={ACTUAL_WIDTH}
  height={ACTUAL_HEIGHT}
  className="w-full h-auto"
  // No priority = lazy loading
/>
```

### Hydration-Safe Component Template

```tsx
"use client";

import { useState, useEffect } from "react";

export default function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PlaceholderComponent />;
  }

  return <ActualComponent />;
}
```

---

## Related Documentation

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Rendering](https://nextjs.org/docs/app/building-your-application/rendering)
- [Web Vitals](https://web.dev/vitals/)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)

---

**Last Updated**: May 6, 2026  
**Maintained By**: Development Team  
**Review Frequency**: After each Next.js major version update
