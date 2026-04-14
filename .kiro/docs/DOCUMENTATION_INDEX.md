# Documentation Index

This document provides an overview of all project documentation.

## Main Documentation

### [README.md](../../README.md)

Project overview, features, tech stack, and quick start guide.

### [TESTING.md](../../TESTING.md)

Comprehensive testing guide covering:

- Test types (unit, integration, property-based, E2E)
- Testing patterns and best practices
- Common issues and solutions
- Mocking strategies
- Property-based testing with fast-check

### [CONTRIBUTING.md](../../CONTRIBUTING.md)

Code style guidelines and development workflow:

- Getting started
- Branch naming conventions
- Code style rules
- Commit message format
- Pull request process
- Code review guidelines

## Quick References

### [test-patterns.md](./test-patterns.md)

Quick reference for common test patterns:

- ESLint suppressions in tests
- Null safety patterns
- Type assertions
- Property-based testing patterns
- Checklist for new tests

### [code-quality-fixes.md](./code-quality-fixes.md)

Log of code quality improvements:

- Issues fixed (non-null assertions, ESLint warnings, TypeScript errors)
- Prevention guidelines
- Verification results
- Impact summary

## Configuration Files

### [.eslintrc.json](../../.eslintrc.json)

ESLint configuration with rules for:

- TypeScript best practices
- Null safety enforcement
- Code style consistency
- References to documentation

### [jest.config.js](../../jest.config.js)

Jest testing configuration

### [tsconfig.json](../../tsconfig.json)

TypeScript compiler configuration

## Key Patterns and Rules

### Null Safety

#### Never use non-null assertions (`!`)

```typescript
// ❌ WRONG
const element = container.querySelector("button");
expect(element!.textContent).toBe("Click me");

// ✅ CORRECT
const element = container.querySelector("button");
expect(element).toBeTruthy();
if (element) {
  expect(element.textContent).toBe("Click me");
}
```

### ESLint Suppressions

#### Use block-style comments for test mocks

```typescript
/* eslint-disable @next/next/no-img-element */
return <img src={src} alt={alt} />;
/* eslint-enable @next/next/no-img-element */
```

### Type Assertions

#### Use `as any` only when necessary

```typescript
// Only for third-party strict types
const schema = generatePersonSchema("en") as any;
expect(schema.sameAs).toBeDefined();
```

## Testing Checklist

Before committing test code:

- [ ] No non-null assertions (`!`) used
- [ ] All DOM queries checked for existence
- [ ] Optional properties checked before access
- [ ] ESLint disable comments use block style
- [ ] Type assertions documented and justified
- [ ] All tests pass: `npm test`
- [ ] No ESLint warnings: `npm run lint`

## Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:properties  # Run property-based tests
npm run test:e2e         # Run E2E tests

# Code Quality
npm run lint             # Run ESLint
npm run lint -- --fix    # Fix auto-fixable issues
npm run format           # Format code with Prettier
npx tsc --noEmit         # Check TypeScript types
```

## File Organization

```
project-root/
├── README.md                    # Project overview
├── TESTING.md                   # Testing guide
├── CONTRIBUTING.md              # Code style guide
├── .eslintrc.json              # ESLint config
├── .kiro/
│   └── docs/
│       ├── DOCUMENTATION_INDEX.md    # This file
│       ├── test-patterns.md          # Quick reference
│       └── code-quality-fixes.md     # Quality improvements log
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── properties/             # Property-based tests
│   └── e2e/                    # E2E tests
└── ...
```

## Getting Help

1. **Check documentation**: Start with README.md, then TESTING.md or CONTRIBUTING.md
2. **Quick reference**: See test-patterns.md for common patterns
3. **Search issues**: Check existing GitHub issues
4. **Ask questions**: Create a new issue with the `question` label
5. **Code examples**: Look at existing test files for patterns

## Maintenance

This documentation should be updated when:

- New patterns are established
- Rules change
- New tools are added
- Common issues are discovered
- Best practices evolve

Last updated: 2026-04-14
