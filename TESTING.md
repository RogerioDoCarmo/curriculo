# Testing Guide

This document provides guidelines for writing and maintaining tests in this project.

## Table of Contents

- [Test Types](#test-types)
- [Testing Patterns](#testing-patterns)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Best Practices](#best-practices)

## Test Types

### Unit Tests

Located in `tests/unit/`, these test individual components and functions in isolation.

### Integration Tests

Located in `tests/integration/`, these test how multiple components work together.

### Property-Based Tests

Located in `tests/properties/`, these use `fast-check` to test properties that should hold for all inputs.

### E2E Tests

Located in `tests/e2e/`, these use Playwright to test the full application flow.

## Testing Patterns

### Mocking Next.js Image Component

When testing components that use `next/image`, mock it with a regular `<img>` tag:

```typescript
// Mock next/image
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

**Important**: Always use block-style ESLint disable comments (`/* */`) to suppress the `@next/next/no-img-element` warning in test mocks.

### Avoiding Non-Null Assertions

**Never use non-null assertions (`!`) in test files.** ESLint rule `@typescript-eslint/no-non-null-assertion` forbids them.

❌ **Bad**:

```typescript
const button = container.querySelector("button");
expect(button!.textContent).toBe("Click me");
```

✅ **Good**:

```typescript
const button = container.querySelector("button");
expect(button).toBeTruthy();
if (button) {
  expect(button.textContent).toBe("Click me");
}
```

✅ **Also Good** (for simple checks):

```typescript
const button = container.querySelector("button");
expect(button).toBeTruthy();
expect(button?.textContent).toBe("Click me");
```

### Handling Optional Properties

When testing objects with optional properties, always check for existence first:

❌ **Bad**:

```typescript
expect(project.liveUrl!.length).toBeGreaterThan(0);
```

✅ **Good**:

```typescript
if (project.liveUrl) {
  expect(project.liveUrl.length).toBeGreaterThan(0);
}
```

### Working with Schema Types

When testing structured data (schema.org types), you may need to use type assertions for dynamic properties:

```typescript
import { generatePersonSchema } from "@/lib/structured-data";

it("should include social links", () => {
  const personSchema = generatePersonSchema("en") as any;

  expect(personSchema.sameAs).toBeDefined();
  expect(Array.isArray(personSchema.sameAs)).toBe(true);
});
```

**Note**: Use `as any` sparingly and only when the type system doesn't recognize valid runtime properties (e.g., schema-dts types).

### Property-Based Testing Patterns

When using `fast-check`, ensure generated data is valid:

```typescript
import * as fc from "fast-check";

// Generate non-empty strings
const nonEmptyStringArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

// Generate valid slugs
const slugArb = fc
  .stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-".split("")), {
    minLength: 3,
    maxLength: 30,
  })
  .filter((s) => /^[a-z]/.test(s) && !s.endsWith("-"));
```

## Common Issues and Solutions

### Issue: ESLint Warning on `<img>` in Test Mocks

**Problem**: IDE shows warning "Using `<img>` could result in slower LCP..."

**Solution**: Use block-style ESLint disable comments:

```typescript
/* eslint-disable @next/next/no-img-element */
return <img src={src} alt={alt} />;
/* eslint-enable @next/next/no-img-element */
```

### Issue: Non-Null Assertion Errors

**Problem**: ESLint error "Forbidden non-null assertion"

**Solution**: Use optional chaining or null checks:

```typescript
// Instead of: element!.textContent
// Use:
element?.textContent;
// Or:
if (element) {
  element.textContent;
}
```

### Issue: TypeScript Errors with Schema Types

**Problem**: "Property 'sameAs' does not exist on type 'WithContext<Person>'"

**Solution**: Use type assertion for runtime properties:

```typescript
const personSchema = generatePersonSchema(locale) as any;
expect(personSchema.sameAs).toBeDefined();
```

### Issue: Array/Map Methods Returning Undefined

**Problem**: `Map.get()` or `Array.find()` might return undefined

**Solution**: Check for existence before using:

```typescript
const value = map.get(key);
if (value) {
  expect(typeof value).toBe("string");
}
```

## Best Practices

### 1. Always Check for Existence

Before accessing properties or methods, verify the element/value exists:

```typescript
const element = container.querySelector("button");
expect(element).toBeTruthy();
// Now safe to use element
```

### 2. Use Descriptive Test Names

```typescript
// Good
it("should render project title with correct text content", () => {});

// Bad
it("works", () => {});
```

### 3. Test One Thing Per Test

Each test should verify a single behavior or property.

### 4. Use Property-Based Tests for Invariants

If a property should hold for all inputs, use `fast-check`:

```typescript
it("should always preserve array length", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const result = processArray(arr);
      expect(result.length).toBe(arr.length);
    })
  );
});
```

### 5. Mock External Dependencies

Always mock external services, APIs, and Next.js-specific features:

```typescript
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));
```

### 6. Clean Up After Tests

For tests that create temporary files or state:

```typescript
afterEach(() => {
  // Clean up
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
```

### 7. Use Appropriate Matchers

```typescript
// For existence checks
expect(value).toBeDefined();
expect(value).toBeTruthy();

// For type checks
expect(typeof value).toBe("string");
expect(Array.isArray(value)).toBe(true);

// For content checks
expect(value).toContain("substring");
expect(value).toMatch(/regex/);
```

### 8. Document Complex Test Logic

Add comments explaining why a test is structured a certain way:

```typescript
it("should handle edge case", () => {
  // This test verifies that the component handles empty arrays
  // without throwing errors, which is critical for the initial
  // render before data loads
  const { container } = render(<Component items={[]} />);
  expect(container).toBeTruthy();
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run only property-based tests
npm run test:properties
```

## Test Coverage Requirements

- Minimum coverage: 80%
- All new features must include tests
- Property-based tests for core business logic
- Integration tests for critical user flows
- E2E tests for main user journeys

## Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Run a single test
npm test -- -t "test name"

# Debug in VS Code
# Add breakpoint and use "Jest: Debug" configuration
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [fast-check Documentation](https://fast-check.dev/)
- [Playwright Documentation](https://playwright.dev/)
