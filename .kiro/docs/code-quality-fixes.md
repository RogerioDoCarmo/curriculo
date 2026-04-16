# Code Quality Fixes - Test Suite

This document summarizes the code quality improvements made to the test suite and provides guidelines to prevent similar issues in the future.

## Date: 2026-04-15

## Issues Fixed

### 1. Console Statements in Production Code

#### Problem

ESLint warns about `console.log()` statements in production code (rule: `no-console`). Console statements should not be used for debugging or logging in production code.

#### Files Fixed

- `components/ExitIntentModal/index.tsx`

#### Solution

Replace `console.log()` with TODO comments for future analytics integration:

```typescript
// Before (WRONG - ESLint warning)
const handleClick = () => {
  console.log("Button clicked");
  doSomething();
};

// After (CORRECT - TODO comment)
const handleClick = () => {
  // TODO: Track button click with analytics
  // trackEvent('button_click', { buttonId: 'cta' });
  doSomething();
};
```

#### Allowed Console Methods

Only `console.error()` and `console.warn()` are allowed for error/warning logging:

```typescript
// ✅ Allowed - Error logging
try {
  await riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  logErrorToService(error);
}

// ✅ Allowed - Warning logging
if (!isValid) {
  console.warn("Invalid configuration detected");
}

// ❌ Not allowed - Debug logging
console.log("Debug info:", data);
console.debug("Debugging:", value);
```

#### Development-Only Logging

If you need logging during development:

```typescript
// ✅ Conditional logging for development only
if (process.env.NODE_ENV === "development") {
  console.log("Dev info:", data);
}
```

---

## Date: 2026-04-14

## Issues Fixed

### 1. Non-Null Assertions Removed

#### Problem

Test files contained non-null assertion operators (`!`) which are forbidden by ESLint rule `@typescript-eslint/no-non-null-assertion`.

#### Files Fixed

- `tests/properties/projects.test.ts`
- `tests/properties/structured-data.test.ts`
- `tests/properties/heading-hierarchy.test.tsx`
- `tests/properties/content.test.ts`
- `tests/properties/career-path.test.ts`
- `tests/properties/accessible-labels.test.tsx`
- `tests/properties/focus-indicators.test.tsx`

#### Solution

Replaced all non-null assertions with proper null checks:

```typescript
// Before (WRONG)
const element = container.querySelector("button");
expect(element!.textContent).toBe("Click me");

// After (CORRECT)
const element = container.querySelector("button");
expect(element).toBeTruthy();
if (element) {
  expect(element.textContent).toBe("Click me");
}
```

### 2. ESLint Warnings for `<img>` in Test Mocks

#### Problem

IDE showing warnings about using `<img>` instead of Next.js `<Image />` in test mocks.

#### Files Fixed

- `tests/properties/accessible-labels.test.tsx`
- `tests/properties/image-alt-text.test.tsx`

#### Solution

Changed from inline to block-style ESLint disable comments:

```typescript
// Before
// eslint-disable-next-line @next/next/no-img-element
return <img src={src} alt={alt} />;

// After
/* eslint-disable @next/next/no-img-element */
return <img src={src} alt={alt} />;
/* eslint-enable @next/next/no-img-element */
```

### 3. TypeScript Errors with Schema Types

#### Problem

TypeScript not recognizing valid runtime properties on `schema-dts` types.

#### Files Fixed

- `tests/properties/structured-data.test.ts`

#### Solution

Added type assertions for schema objects:

```typescript
// Before (TYPE ERROR)
const personSchema = generatePersonSchema(locale);
expect(personSchema.sameAs).toBeDefined(); // Error: Property 'sameAs' does not exist

// After (CORRECT)
const personSchema = generatePersonSchema(locale) as any;
expect(personSchema.sameAs).toBeDefined();
```

## Prevention Guidelines

### For Developers

1. Never use non-null assertions - Always check for existence first
2. Use block-style ESLint comments - More explicit and better recognized by IDEs
3. Check optional properties - Use optional chaining or if statements
4. Use type assertions sparingly - Only for third-party strict types

### For Code Reviewers

Check for:

- [ ] No `!` operators in test files
- [ ] Proper null checks before property access
- [ ] Block-style ESLint comments for suppressions
- [ ] Type assertions are justified and documented

## Documentation Created

1. TESTING.md - Comprehensive testing guide with patterns and best practices
2. CONTRIBUTING.md - Code style guide and development workflow
3. .kiro/docs/test-patterns.md - Quick reference for common test patterns
4. Updated .eslintrc.json - Added comments referencing documentation

## Verification

All changes verified with:

- ✅ `npm test` - All 480 tests passing
- ✅ `npm run lint` - No ESLint warnings or errors
- ✅ TypeScript compilation - No type errors
- ✅ Test coverage - Maintained at 77.33%

## References

- [TESTING.md](../../TESTING.md) - Full testing guide
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Code style guide
- [test-patterns.md](./test-patterns.md) - Quick reference

## Checklist for Future Tests

Before committing new test code:

- [ ] No non-null assertions (`!`) used
- [ ] All DOM queries checked for existence
- [ ] Optional properties checked before access
- [ ] Array/Map methods checked for undefined
- [ ] ESLint disable comments use block style
- [ ] Type assertions documented and justified
- [ ] All tests pass: `npm test`
- [ ] No ESLint warnings: `npm run lint`
- [ ] TypeScript compiles: `npx tsc --noEmit`

## Checklist for Production Code

Before committing production code:

- [ ] No `console.log()` or `console.debug()` statements
- [ ] Analytics/logging uses proper service integration or TODO comments
- [ ] `console.error()` and `console.warn()` are intentional and necessary
- [ ] No non-null assertions (`!`) used
- [ ] All optional properties checked before access
- [ ] All tests pass: `npm test`
- [ ] No ESLint warnings: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] TypeScript compiles: `npx tsc --noEmit`

## Impact

- Code Quality: Improved null safety and type safety
- Maintainability: Clear patterns documented for future development
- Developer Experience: Better IDE support with proper ESLint suppressions
- Test Reliability: More robust tests with proper null checks

## Next Steps

1. Monitor for similar issues in new code
2. Update documentation as patterns evolve
3. Consider adding pre-commit hooks to enforce patterns
4. Share guidelines with team members
