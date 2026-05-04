---
inclusion: fileMatch
fileMatchPattern: "tests/**/*.test.{ts,tsx}"
---

# Test File Conventions

Rules that must be followed when writing or editing test files in this project.

## TypeScript Setup

`@testing-library/jest-dom` is configured in `tsconfig.json` via `"types": ["@testing-library/jest-dom"]`.
This provides `toBeInTheDocument`, `toHaveAttribute`, `toHaveTextContent`, etc. — no extra imports needed.

## TypeScript Strict Null Checks

**NEVER use non-null assertion operator (`!`)** in tests. It bypasses TypeScript's null safety and can cause runtime errors.

### The Problem

```typescript
// ❌ WRONG - Non-null assertion bypasses type safety
it("should have a name", () => {
  expect(manifestData.name).toBeDefined();
  expect(manifestData.name!.length).toBeGreaterThan(0); // ❌ Could throw NPE
});

// ❌ WRONG - Accessing potentially undefined property
it("should have icons", () => {
  const icon = manifestData.icons![0]; // ❌ Could throw NPE
  expect(icon.src).toBeTruthy();
});
```

### The Solution

Use proper type guards with conditional checks:

```typescript
// ✅ CORRECT - Type guard before accessing property
it("should have a name", () => {
  expect(manifestData.name).toBeDefined();
  if (manifestData.name) {
    expect(manifestData.name.length).toBeGreaterThan(0);
  }
});

// ✅ CORRECT - Check array exists before accessing elements
it("should have icons", () => {
  expect(manifestData.icons).toBeDefined();
  if (manifestData.icons && manifestData.icons.length > 0) {
    const icon = manifestData.icons[0];
    expect(icon.src).toBeTruthy();
  }
});

// ✅ CORRECT - Check nested properties exist
it("should have an SVG icon", () => {
  expect(manifestData.icons).toBeDefined();
  if (manifestData.icons) {
    const svgIcon = manifestData.icons.find((icon) => icon.type === "image/svg+xml");
    expect(svgIcon).toBeDefined();
    if (svgIcon) {
      expect(svgIcon.src).toBe("/icon.svg");
    }
  }
});
```

### Why This Matters

1. **CI Enforcement**: TypeScript strict null checks (`--strictNullChecks`) are enabled in CI
2. **Runtime Safety**: Prevents `Cannot read property 'X' of undefined` errors
3. **Type Safety**: Maintains TypeScript's null safety guarantees
4. **Code Quality**: Forces explicit handling of potentially undefined values

### Pattern to Follow

1. **Always check `toBeDefined()` or `toBeTruthy()` first**
2. **Then use conditional check before accessing properties**
3. **Never assume a value exists just because you tested it**

```typescript
// Pattern for single property
expect(data.property).toBeDefined();
if (data.property) {
  expect(data.property.nestedValue).toBe(expected);
}

// Pattern for arrays
expect(data.array).toBeDefined();
if (data.array && data.array.length > 0) {
  expect(data.array[0].value).toBe(expected);
}

// Pattern for optional chaining in find/filter
if (data.items) {
  const found = data.items.find((item) => item.id === "test");
  expect(found).toBeDefined();
  if (found) {
    expect(found.name).toBe("Test");
  }
}
```

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

1. **Check the component for ALL translation keys** - including `sections.*` keys used in `aria-label` and headings
2. Ensure mock messages include all keys and all fields (including ones added later like `url`)
3. **Common translation key patterns to check**:
   - `sections.{sectionName}` - Used for section headings and aria-labels
   - `{componentName}.{field}` - Component-specific translations
   - Nested keys for complex components

```typescript
// ❌ mock missing keys/fields → MISSING_MESSAGE error
const messages = {
  // Missing sections.projects key!
  projects: {
    title: "Projects",
    filterByTech: "Filter by technology",
  },
};

// ✅ complete mock including sections.* keys
const messages = {
  sections: {
    projects: "Projects", // ← Don't forget section keys!
    about: "About",
    skills: "Skills",
  },
  projects: {
    title: "Projects",
    filterByTech: "Filter by technology",
    all: "All",
    noMatch: "No projects match",
    screenshot: "screenshot",
    // ... all other keys
  },
};
```

### How to Find All Translation Keys

1. **Search for `t("` in the component** - finds all translation calls
2. **Check `aria-label` attributes** - often use `sections.*` keys
3. **Check heading elements** - commonly use `sections.*` keys
4. **Look for nested components** - may use additional translation namespaces

```typescript
// Example: ProjectsSection uses both sections.* and projects.* keys
<section aria-label={t("sections.projects")}>  {/* ← sections key */}
  <h2>{t("sections.projects")}</h2>            {/* ← sections key */}
  <button>{t("projects.all")}</button>         {/* ← projects key */}
</section>
```

## Mock Data Must Match Type Definitions

When creating mock data for tests, **always match the exact TypeScript type structure** expected by the component.

### Common Mistakes

❌ **Wrong**: Using primitive arrays when objects are expected

```typescript
const mockSkills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: ["React", "TypeScript"], // ❌ strings instead of objects
  },
];
```

✅ **Correct**: Using proper object structure

```typescript
const mockSkills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "advanced" },
      { name: "TypeScript", level: "intermediate" },
    ],
  },
];
```

### How to Avoid This

1. **Check the type definition** before creating mock data
2. **Look at the component implementation** to see what properties it accesses
3. **Use TypeScript's type checking** - if the mock compiles, it's structurally correct
4. **Run tests** to catch runtime issues like missing keys or React warnings

### Example: SkillCategory Type

```typescript
// Type definition
interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

interface SkillCategory {
  category: string;
  skills: Skill[]; // Array of objects, not strings!
}

// Component usage
{cat.skills.map((skill) => (
  <li key={skill.name}> {/* Expects skill.name, not just skill */}
    <span>{skill.name}</span>
    {skill.level && <span>{skill.level}</span>}
  </li>
))}
```

## JSDOM Environment Limitations

Jest uses JSDOM which has limitations compared to a real browser:

### APIs That Need Mocking

Add these mocks to `jest.setup.js`:

```javascript
// IntersectionObserver (for scroll-based features)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// window.matchMedia (for theme/media queries)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Viewport Size Testing

JSDOM doesn't actually render at different viewport sizes. Tests that check responsive behavior should:

1. **Test CSS classes are present** (not actual rendering)
2. **Use Playwright for true viewport testing** (E2E tests)
3. **Mock `window.innerWidth` if needed** for components that check it

```typescript
// ❌ Won't work - JSDOM doesn't change viewport
it("should show mobile menu at 375px", () => {
  // This won't actually resize the viewport
  global.innerWidth = 375;
  // ...
});

// ✅ Test responsive CSS classes instead
it("should have mobile-specific classes", () => {
  const { container } = render(<Header />);
  const element = container.querySelector(".md\\:hidden");
  expect(element).toBeInTheDocument();
});
```

## Next.js Router Mocking

Components using Next.js navigation hooks need router mocking:

```typescript
// Mock next/navigation for tests
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/en",
    query: {},
    asPath: "/en",
  })),
  usePathname: jest.fn(() => "/en"),
}));
```

## Provider Wrapping

Components using context providers need proper wrapping in tests:

```typescript
import { ThemeProvider } from "@/hooks/useTheme";
import { NextIntlClientProvider } from "next-intl";

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};
```

## React Key Props

Always ensure list items have unique keys:

```typescript
// ❌ Using potentially duplicate values
{projects.map((project) => (
  <div key={project.id}> {/* Could have duplicates in test data */}
))}

// ✅ Combine with index for guaranteed uniqueness
{projects.map((project, index) => (
  <div key={`${project.id}-${index}`}>
))}
```
