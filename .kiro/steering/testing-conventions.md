---
inclusion: fileMatch
fileMatchPattern: "tests/**/*.test.{ts,tsx}"
---

# Test File Conventions

Rules that must be followed when writing or editing test files in this project.

## TypeScript Setup

`@testing-library/jest-dom` is configured in `tsconfig.json` via `"types": ["@testing-library/jest-dom"]`.
This provides `toBeInTheDocument`, `toHaveAttribute`, `toHaveTextContent`, etc. — no extra imports needed.

## Unused Variables in Callbacks

The ESLint rule `no-unused-vars` requires unused arguments to match `/^_/`.

- Omit unused destructured props when possible:
  ```typescript
  // ✅ omit entirely
  languages.forEach(({ messages }) => { ... });
  // ✅ prefix with _ if you must keep it
  languages.forEach(({ _code, messages }) => { ... });
  // ✅ Object.entries — prefix unused key
  Object.entries(map).forEach(([_key, value]) => { ... });
  ```

## Typing `messages` for `NextIntlClientProvider`

Never use `any` for the `messages` param. Use `AbstractIntlMessages`:

```typescript
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

const renderComponent = (locale: string, messages: AbstractIntlMessages) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <MyComponent />
    </NextIntlClientProvider>
  );
};
```

## Test Mocks Must Cover All Component Keys

If a component has a hardcoded list of keys (e.g. a `TECH_CATEGORIES` constant), the test mock **must** include every key and every field the component reads — otherwise `next-intl` throws `MISSING_MESSAGE` errors at runtime.

Steps:

1. Check the component for key mappings.
2. Ensure mock messages include all keys and all fields (including ones added later like `url`).

```typescript
// ❌ mock missing keys/fields → MISSING_MESSAGE error
const messages = { techStack: { technologies: { nextjs: { name: "Next.js" } } } };

// ✅ complete mock matching component's TECH_CATEGORIES
const messages = {
  techStack: {
    technologies: {
      nextjs: {
        name: "Next.js",
        description: "...",
        why: "...",
        benefits: "...",
        url: "https://nextjs.org",
      },
      sonarqube: {
        name: "SonarQube",
        description: "...",
        why: "...",
        benefits: "...",
        url: "https://www.sonarqube.org",
      },
      // ... all other keys
    },
  },
};
```
