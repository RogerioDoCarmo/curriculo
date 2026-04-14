# Test Patterns Quick Reference

This document provides quick reference for common test patterns used in this project.

## ESLint Suppressions in Tests

### Mocking Next.js Image Component

When mocking `next/image` in tests, always use block-style ESLint comments:

```typescript
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    sizes,
    loading,
    className,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    loading?: "eager" | "lazy";
    className?: string;
  }) => {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        data-fill={fill}
        data-sizes={sizes}
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));
```

#### Why block-style?

- More explicit about what's being disabled
- Re-enables the rule after the code block
- Better recognized by IDE ESLint extensions
- Limits the scope of the suppression

## Null Safety Patterns

### Never Use Non-Null Assertions

#### ❌ NEVER DO THIS

```typescript
const element = container.querySelector("button");
expect(element!.textContent).toBe("Click me"); // FORBIDDEN!

const value = map.get(key);
console.log(value!.toString()); // FORBIDDEN!

const project = projects.find((p) => p.id === id);
expect(project!.title).toBe("Test"); // FORBIDDEN!
```

#### ✅ ALWAYS DO THIS

```typescript
// Pattern 1: Check existence first
const element = container.querySelector("button");
expect(element).toBeTruthy();
if (element) {
  expect(element.textContent).toBe("Click me");
}

// Pattern 2: Use optional chaining
const element = container.querySelector("button");
expect(element?.textContent).toBe("Click me");

// Pattern 3: Combine both for clarity
const element = container.querySelector("button");
expect(element).toBeTruthy();
expect(element?.textContent).toBe("Click me");
```

### Common Scenarios

#### DOM Queries

```typescript
// querySelector
const button = container.querySelector("button");
expect(button).toBeTruthy();
if (button) {
  expect(button.getAttribute("aria-label")).toBe("Close");
}

// querySelectorAll with forEach
const images = container.querySelectorAll("img");
images.forEach((img) => {
  const alt = img.getAttribute("alt");
  if (alt) {
    expect(alt.length).toBeGreaterThan(0);
  }
});
```

#### Array Methods

```typescript
// Array.find()
const found = projects.find((p) => p.id === "test");
expect(found).toBeDefined();
if (found) {
  expect(found.title).toBe("Test Project");
}

// Array.filter() - safe, always returns array
const filtered = projects.filter((p) => p.featured);
expect(filtered.length).toBeGreaterThan(0);
```

#### Map/Object Access

```typescript
// Map.get()
const value = map.get(key);
if (value) {
  expect(typeof value).toBe("string");
}

// Object property access
const obj = { name: "test" };
if (obj.name) {
  expect(obj.name.length).toBeGreaterThan(0);
}
```

#### Optional Properties

```typescript
// Testing optional properties
interface Project {
  title: string;
  liveUrl?: string;
  repoUrl?: string;
}

const project: Project = { title: "Test" };

// Check existence before accessing
if (project.liveUrl) {
  expect(project.liveUrl.length).toBeGreaterThan(0);
}

// Or use optional chaining
expect(project.liveUrl?.length).toBeGreaterThan(0);
```

## Type Assertions

### When to Use `as any`

Use `as any` only when:

1. The type system doesn't recognize valid runtime properties
2. Working with third-party types that are too strict
3. Testing dynamic properties on schema types

```typescript
// Schema.org types from schema-dts
import { generatePersonSchema } from "@/lib/structured-data";

it("should include social links", () => {
  // Type assertion needed because schema-dts types are strict
  const personSchema = generatePersonSchema("en") as any;

  expect(personSchema.sameAs).toBeDefined();
  expect(Array.isArray(personSchema.sameAs)).toBe(true);
  if (personSchema.sameAs) {
    expect(personSchema.sameAs.length).toBeGreaterThan(0);
  }
});
```

### When NOT to Use `as any`

❌ Don't use `as any` to bypass type errors in your own code:

```typescript
// BAD - Fix the types instead
const data = fetchData() as any;
data.someProperty = "value";
```

✅ Fix the types properly:

```typescript
// GOOD - Define proper types
interface FetchedData {
  someProperty: string;
}
const data = fetchData() as FetchedData;
data.someProperty = "value";
```

## Property-Based Testing Patterns

### Generating Valid Data

```typescript
import * as fc from "fast-check";

// Non-empty strings
const nonEmptyStringArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

// Valid slugs
const slugArb = fc
  .stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-".split("")), {
    minLength: 3,
    maxLength: 30,
  })
  .filter((s) => /^[a-z]/.test(s) && !s.endsWith("-"));

// Valid URLs
const urlArb = fc.webUrl({ validSchemes: ["https", "http"] });

// Optional values
const optionalUrlArb = fc.option(urlArb, { nil: undefined });
```

### Testing with Generated Data

```typescript
it("should handle all valid inputs", () => {
  fc.assert(
    fc.property(nonEmptyStringArb, (input) => {
      const result = processInput(input);

      // Always check existence before accessing
      expect(result).toBeDefined();
      if (result) {
        expect(result.length).toBeGreaterThan(0);
      }
    }),
    { numRuns: 100 }
  );
});
```

## Checklist for New Tests

Before committing test code, verify:

- [ ] No non-null assertions (`!`) used
- [ ] All DOM queries checked for existence
- [ ] Optional properties checked before access
- [ ] Array/Map methods checked for undefined
- [ ] ESLint disable comments use block style (`/* */`)
- [ ] Type assertions (`as any`) used sparingly and documented
- [ ] Property-based tests use valid data generators
- [ ] All tests pass: `npm test`
- [ ] No ESLint warnings: `npm run lint`

## Files Using These Patterns

Reference these files for examples:

- `tests/properties/accessible-labels.test.tsx` - Image mock, null checks
- `tests/properties/image-alt-text.test.tsx` - Image mock, null checks
- `tests/properties/focus-indicators.test.tsx` - DOM queries, null checks
- `tests/properties/structured-data.test.ts` - Type assertions, null checks
- `tests/properties/projects.test.ts` - Optional properties, null checks
- `tests/properties/content.test.ts` - Array methods, null checks
- `tests/properties/career-path.test.ts` - Map methods, null checks
- `tests/properties/heading-hierarchy.test.tsx` - DOM queries, null checks

## Quick Commands

```bash
# Run tests
npm test

# Run specific test file
npm test -- tests/properties/accessible-labels.test.tsx

# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Check TypeScript
npx tsc --noEmit
```

## Getting Help

- See [TESTING.md](../../TESTING.md) for comprehensive testing guide
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) for code style guide
- Check existing test files for examples
- Ask in PR reviews or create an issue
