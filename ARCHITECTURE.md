# Architecture & Design Patterns

This document describes the structural decisions, design patterns, and clean code conventions applied across the codebase.

## Layer Responsibilities

Each directory has a single, well-defined role. Nothing crosses these boundaries without a clear reason.

| Layer                | Directory        | Responsibility                                                |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| Routing & Pages      | `app/`           | Next.js App Router routes, layouts, metadata, sitemap, robots |
| UI Components        | `components/`    | Presentational React components — one folder per component    |
| State & Side Effects | `hooks/`         | All stateful logic, browser API access, and subscriptions     |
| Utilities & Services | `lib/`           | Data access, analytics, feature flags, SEO, error logging     |
| Domain Types         | `types/index.ts` | All shared TypeScript types in one file                       |
| i18n Messages        | `messages/`      | Translation JSON files — one per locale (`en`, `es`, `pt-BR`) |

**Rule of thumb**: if a component needs state or a side effect, that logic lives in a hook, not inline. If a hook needs to read from a file or call an external service, that belongs in `lib/`.

---

## Design Patterns

### Provider Pattern

Context providers are composed in the root layout in a deliberate order — each wraps only what it needs to supply:

```tsx
<NextIntlClientProvider>
  {" "}
  // i18n strings
  <ThemeProvider>
    {" "}
    // light/dark theme
    <AnalyticsProvider>
      {" "}
      // Firebase + Vercel analytics
      <ErrorBoundary>
        {" "}
        // catch-all render error handler
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </ErrorBoundary>
    </AnalyticsProvider>
  </ThemeProvider>
</NextIntlClientProvider>
```

Each provider has a single concern. Components anywhere in the tree consume what they need via `useTheme()`, `useTranslations()`, etc. — no prop-drilling.

### Custom Hook Pattern

Components are thin. All state, persistence, and event logic is extracted into `hooks/`:

| Hook                  | Responsibility                                                                |
| --------------------- | ----------------------------------------------------------------------------- |
| `useTheme`            | Theme state, `localStorage` persistence, `prefers-color-scheme` detection     |
| `useCookieConsent`    | Full consent lifecycle — accept/reject/customize, `localStorage`, page reload |
| `useFeatureFlag`      | Firebase Remote Config wrapper with in-memory cache and fallback              |
| `useAnchorNavigation` | Smooth-scroll to section IDs with URL hash sync                               |
| `useExitIntent`       | Mouse-leave detection for exit-intent modal triggering                        |
| `useScrollDepth`      | Analytics tracking of scroll depth milestones                                 |
| `useTimeOnPage`       | Time-on-page tracking for analytics                                           |
| `useLanguage`         | Locale detection and switching helpers                                        |

This makes hooks independently unit-testable without mounting any component.

### Strategy Pattern (Lookup Tables)

Variant-driven components use plain object maps instead of if/switch chains. The `Button` component is the clearest example:

```ts
const variantClasses: Record<ButtonProps["variant"], string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 ...",
  secondary: "border border-primary-600 text-primary-600 ...",
  ghost: "text-primary-600 hover:bg-primary-50 ...",
};

const sizeClasses: Record<ButtonProps["size"], string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};
```

TypeScript's `Record<K, V>` enforces exhaustiveness — adding a new variant to the union immediately produces a type error at the map definition, not silently at runtime.

### Error Boundary Pattern

`components/ErrorBoundary/index.tsx` is a class component (required by React's API for `componentDidCatch`). It integrates two cross-cutting concerns in one place:

```ts
componentDidCatch(error: Error, info: React.ErrorInfo): void {
  logError(error, { component: this.props.component, ... });  // Sentry / Crashlytics
  trackErrorBoundary({ error_message: error.message, ... });  // Firebase Analytics
}
```

The boundary accepts an optional `fallback` prop and a `component` label for error context. It is placed at the root layout level to catch any unhandled render error in the tree.

### Cache-Aside Pattern

`lib/feature-flags.ts` implements a three-tier resolution for feature flag values:

```
1. In-memory Map (5-minute TTL)
       ↓ miss
2. Firebase Remote Config (fetchAndActivate)
       ↓ unavailable / error
3. Default value (always provided by caller)
```

Any failure at any tier returns the caller's default — never throws. This means the app degrades gracefully whether offline, in SSR, or when Firebase is misconfigured.

### Lazy Loading Registry

`lib/lazy-components.tsx` centralizes all `next/dynamic` imports for heavy components. Keeping them in one file makes code-splitting strategy visible and auditable in a single place:

```ts
export const LazyTechStackSection = dynamic(() => import("@/components/TechStackSection"), {
  ssr: true,   // needed for SEO
  loading: () => <SkeletonLoader />,
});

export const LazyExitIntentModal = dynamic(() => import("@/components/ExitIntentModal"), {
  ssr: false,  // browser-only, exit intent detection requires window
  loading: () => null,
});
```

Each entry declares its own skeleton loader inline, matched to the shape of the real component to minimize layout shift.

---

## Clean Code Conventions

### TypeScript Strictness

- **`readonly` on all props interfaces** — prevents accidental mutation of component inputs
- **`import type { ... }`** for type-only imports — zero runtime cost, explicit intent
- **No `!` non-null assertions** anywhere in source or tests — type guards (`if (value)`, narrowing) are used instead
- **Union types for domain values** — `Theme = "light" | "dark"`, `SupportedLocale = "pt-BR" | "en" | "es"`, `SkillLevel = "beginner" | "intermediate" | "advanced" | "expert"` — invalid values are a type error, not a runtime condition

### Named Constants

Magic values are named at the module level and imported where needed:

```ts
const THEME_STORAGE_KEY = "theme";         // hooks/useTheme.tsx
const CACHE_TTL = 5 * 60 * 1000;          // lib/feature-flags.ts
export const SUPPORTED_LOCALES = [...];    // types/index.ts
export const DEFAULT_LOCALE = "pt-BR";    // types/index.ts
export const SECTION_IDS = [...];         // types/index.ts
```

### Pure Helpers Extracted for Testability

`hooks/useTheme.tsx` exports its internal helpers as standalone named functions. The hook composes them; tests call them directly without mounting React:

```ts
export function getStoredTheme(): Theme | null { ... }
export function setStoredTheme(theme: Theme): void { ... }
export function getSystemTheme(): Theme { ... }
export function getInitialTheme(): Theme { ... }
```

### Graceful Degradation

Any code that touches browser APIs or external services is wrapped defensively:

- `localStorage` reads/writes: try/catch in `useTheme`, `useCookieConsent`, and `lib/feature-flags`
- Firebase calls: return default values on any error, log a warning
- Content directory missing: return `[]` in production, `console.warn` in development
- SSR guard: `if (typeof window === "undefined") return null` before any browser API access

### Security-Conscious Patterns

- Inline `<Script>` tags that output data (JSON-LD structured data) use `JSON.stringify()` — which escapes special characters — preventing XSS. The source is always application-controlled, never user input.
- The FOUC-prevention theme script only reads `localStorage` and applies a CSS class — no user data is evaluated or interpolated.
- Comments on both of these call out the reasoning explicitly so future maintainers don't accidentally weaken the guarantees.

### Server-First Components

Components are React Server Components by default. `"use client"` is added only when the component genuinely needs browser APIs or React state. This keeps the server-rendered HTML payload small and avoids unnecessary client JavaScript.

---

## Testing Architecture

Tests are split into three layers with distinct purposes:

| Layer              | Tool                   | What it verifies                                    |
| ------------------ | ---------------------- | --------------------------------------------------- |
| Unit / Integration | Jest + Testing Library | Component rendering, hook logic, accessibility      |
| Property-based     | fast-check             | i18n key parity across all locales, type invariants |
| End-to-End         | Playwright             | Full user journeys across all browsers and locales  |

### Key Testing Conventions

- Every component requires a render test, an interaction test, and an accessibility test.
- Mocks are scoped to system boundaries only: `localStorage`, `window.location`, `window.matchMedia`, `IntersectionObserver`. Internal logic runs real.
- `window.location` is mocked with `Object.defineProperty` in `beforeAll` (not `beforeEach`) to avoid the "cannot redefine property" error across multiple tests in the same suite.
- E2E locators are scoped to semantic IDs (e.g. `page.locator("#tech-stack")`) rather than role alone, preventing strict-mode violations when duplicate accessible names exist at different points in the page (e.g. a link in the nav and the same link in the footer).
- A property test asserts that all three locales (`en`, `es`, `pt-BR`) have identical i18n key sets — missing keys are caught before they reach CI rather than at runtime.

---

## Known Limitations

- `ErrorBoundary` must remain a class component until React 19's error boundary hooks stabilize.
- `app/[locale]/tech-stack/page.tsx` and the root layout both render a `<main>` element, creating a nested `<main>` — a known structural quirk of the App Router pattern for this page.
- `ThemeProvider` issues a suppressed hydration warning on `<html>` and `<body>` because the FOUC-prevention inline script applies the theme class before React hydrates. The `suppressHydrationWarning` attributes are intentional and documented.
