# Coding Standards and Patterns

**Last Updated**: May 6, 2026  
**Purpose**: Standard patterns and conventions for this project

## Table of Contents

1. [Component Patterns](#component-patterns)
2. [Image Handling](#image-handling)
3. [Theme and Dark Mode](#theme-and-dark-mode)
4. [TypeScript Conventions](#typescript-conventions)
5. [Testing Requirements](#testing-requirements)

---

## Component Patterns

### Client Component Template

````tsx
"use client";

/**
 * ComponentName — brief description
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * Requirements: X.Y, X.Z
 *
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ComponentNameProps {
  /** Description of prop */
  readonly prop: string;
  /** Optional prop with default */
  readonly optional?: boolean;
  /** Children elements */
  readonly children?: ReactNode;
}

export default function ComponentName({ prop, optional = false, children }: ComponentNameProps) {
  // State
  const [state, setState] = useState<string>("");

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return <div>{children}</div>;
}
````

### Server Component Template

```tsx
/**
 * PageName — brief description
 *
 * Server Component that fetches data and renders content.
 *
 * Requirements: X.Y
 */

import type { Metadata } from "next";

interface PageProps {
  readonly params: {
    readonly locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Page Title",
    description: "Page description",
  };
}

export default async function PageName({ params }: PageProps) {
  // Fetch data
  const data = await fetchData();

  // Render
  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
```

---

## Image Handling

### Standard Image Pattern

```tsx
import Image from "next/image";

// For logos and icons (above the fold)
<Image
  src="/images/logos/logo.png"
  alt="Company Logo"
  width={1280}              // Actual image dimensions
  height={427}
  className="w-[125px] h-auto"  // Responsive sizing
  priority                  // LCP optimization
/>

// For content images (below the fold)
<Image
  src="/images/content/photo.jpg"
  alt="Descriptive alt text"
  width={1920}
  height={1080}
  className="w-full h-auto"
  // No priority = lazy loading
/>

// For responsive images with multiple sizes
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

### Image Checklist

Before adding any image:

1. ✅ Get actual dimensions: `sips -g pixelWidth -g pixelHeight path/to/image.ext`
2. ✅ Determine if above-the-fold → use `priority`
3. ✅ Use Tailwind classes for sizing, not inline styles
4. ✅ Always include `h-auto` for aspect ratio
5. ✅ Provide descriptive `alt` text

---

## Theme and Dark Mode

### Theme-Dependent Components

**ALWAYS** use mounted state for theme-dependent content:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeComponent() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during SSR
  if (!mounted) {
    return <PlaceholderComponent />;
  }

  // Render actual theme-dependent content
  const isDark = theme === "dark";
  return <div className={isDark ? "dark-styles" : "light-styles"}>{/* Content */}</div>;
}
```

### Theme Toggle Pattern

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button disabled aria-label="Toggle theme">
        ☀️
      </button>
    );
  }

  const isDark = theme === "dark";
  const icon = isDark ? "☀️" : "🌙";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button onClick={toggleTheme} aria-label={label} title={label}>
      {icon}
    </button>
  );
}
```

---

## TypeScript Conventions

### Props Interface

```tsx
// ✅ CORRECT: Use readonly for props
interface ComponentProps {
  readonly title: string;
  readonly count: number;
  readonly optional?: boolean;
  readonly children?: ReactNode;
}

// ❌ WRONG: Mutable props
interface ComponentProps {
  title: string; // Not readonly
  count: number;
}
```

### Type Imports

```tsx
// ✅ CORRECT: Use type imports
import type { ReactNode } from "react";
import type { Metadata } from "next";

// ❌ WRONG: Regular imports for types
import { ReactNode } from "react";
```

### Event Handlers

```tsx
// ✅ CORRECT: Typed event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handler logic
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  // Handler logic
};
```

---

## Testing Requirements

### Component Tests

Every component must have:

1. ✅ Unit tests for rendering
2. ✅ Tests for user interactions
3. ✅ Tests for edge cases
4. ✅ Accessibility tests

```tsx
// ComponentName.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    render(<ComponentName prop="value" />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Updated Text")).toBeInTheDocument();
  });

  it("is accessible", () => {
    const { container } = render(<ComponentName prop="value" />);
    expect(container.querySelector("button")).toHaveAttribute("aria-label");
  });
});
```

### Property-Based Tests

For complex logic, add property-based tests:

```tsx
// properties/component-name.test.ts
import fc from "fast-check";

describe("ComponentName Properties", () => {
  it("maintains invariant X for all inputs", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = processInput(input);
        expect(result).toSatisfy(invariantX);
      })
    );
  });
});
```

---

## Accessibility Standards

### ARIA Labels

```tsx
// ✅ CORRECT: Descriptive ARIA labels
<button aria-label="Close dialog">
  <XIcon />
</button>

<Image
  src="/icon.svg"
  alt="Company Logo"
  aria-hidden="true"  // Decorative images
/>

// ❌ WRONG: Missing or generic labels
<button>
  <XIcon />  // No label
</button>
```

### Keyboard Navigation

```tsx
// ✅ CORRECT: Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  Action
</button>

// ✅ CORRECT: Focus management
<div
  tabIndex={0}
  role="button"
  onKeyDown={handleKeyDown}
>
  Custom Button
</div>
```

### Focus Indicators

```tsx
// ✅ CORRECT: Visible focus indicators
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500">
  Action
</button>

// ❌ WRONG: Removing focus without alternative
<button className="focus:outline-none">
  Action
</button>
```

---

## CSS and Styling

### Tailwind Conventions

```tsx
// ✅ CORRECT: Organized class names
<div className="
  flex items-center justify-between
  w-full max-w-5xl
  px-4 py-6
  bg-white dark:bg-gray-900
  rounded-lg shadow-md
  transition-colors duration-200
">
  Content
</div>

// ✅ CORRECT: Responsive design
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
">
  Content
</div>

// ❌ WRONG: Inline styles (except for dynamic values)
<div style={{ width: "100px", height: "50px" }}>
  Content
</div>
```

### Dark Mode

```tsx
// ✅ CORRECT: Dark mode variants
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>

// ✅ CORRECT: Theme-aware colors
<button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
  Action
</button>
```

---

## Performance Best Practices

### Code Splitting

```tsx
// ✅ CORRECT: Dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // If component doesn't need SSR
});
```

### Memoization

```tsx
// ✅ CORRECT: Memoize expensive computations
import { useMemo } from "react";

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ CORRECT: Memoize callbacks
import { useCallback } from "react";

const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

---

## Error Handling

### Error Boundaries

```tsx
// ✅ CORRECT: Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### Try-Catch for Async Operations

```tsx
// ✅ CORRECT: Handle errors in async operations
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await fetch("/api/data");
      setData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error);
    }
  };

  fetchData();
}, []);
```

---

## Related Documentation

- [Next.js Best Practices](.kiro/docs/nextjs-best-practices.md)
- [Test Patterns](.kiro/docs/test-patterns.md)
- [Code Quality Fixes](.kiro/docs/code-quality-fixes.md)

---

**Last Updated**: May 6, 2026  
**Maintained By**: Development Team  
**Review Frequency**: Monthly
