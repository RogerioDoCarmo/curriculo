# Contributing Guide

Thank you for contributing to this project! This guide will help you understand our development workflow and coding standards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Run linter: `npm run lint`
8. Commit your changes
9. Push to your fork
10. Create a Pull Request

## Development Workflow

### ⚠️ CRITICAL: Branch Protection Rules

**The `main` and `develop` branches are protected and require pull requests.**

**NEVER commit directly to `main` or `develop`!**

Always follow this workflow:

1. **Check current branch** before making changes:

   ```bash
   git branch --show-current
   ```

2. **If on `main` or `develop`**, create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** on the feature branch

4. **Commit and push** to the feature branch:

   ```bash
   git add .
   git commit -m "feat: your changes"
   git push -u origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

6. **After PR is merged**, update your local branches:

   ```bash
   git checkout main
   git pull origin main
   git checkout develop
   git pull origin develop
   ```

7. **Delete the feature branch** (optional):
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

### Git Workflow Diagram

```
main (protected)
  ↓
develop (protected)
  ↓
feature/your-feature ← Work here!
  ↓
Pull Request → develop
  ↓
Pull Request → main
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

Example: `feature/add-dark-mode`, `fix/contact-form-validation`

### Local Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Format code
npm run format
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`, never use `var`
- Use explicit types for function parameters and return values when not obvious
- Avoid `any` type unless absolutely necessary (will trigger a warning)

### React Components

```typescript
// Functional components with TypeScript
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Null Safety

#### Never use non-null assertions (`!`) in production or test code

❌ **Bad**:

```typescript
const user = users.find((u) => u.id === id);
console.log(user!.name); // Forbidden!
```

✅ **Good**:

```typescript
const user = users.find((u) => u.id === id);
if (user) {
  console.log(user.name);
}
// Or use optional chaining
console.log(user?.name);
```

### ESLint Rules

Our ESLint configuration enforces:

- `@typescript-eslint/no-non-null-assertion`: **warn** - Avoid non-null assertions
- `@typescript-eslint/no-explicit-any`: **warn** - Avoid `any` type
- `@typescript-eslint/no-unused-vars`: **error** - No unused variables
- `prefer-const`: **error** - Use `const` when possible
- `no-var`: **error** - Never use `var`
- `no-console`: **warn** - Avoid console.log (except warn/error)

### Console Statements

#### ❌ Never use `console.log()` in production code

ESLint will warn about console statements. Instead:

**For debugging during development:**

```typescript
// Remove before committing
console.log("Debug info:", data);
```

**For planned logging/analytics:**

```typescript
// ✅ Use TODO comments for future integration
const handleAction = () => {
  // TODO: Integrate with analytics service (Firebase Analytics, etc.)
  // trackEvent('button_clicked', { buttonId: 'submit' });

  performAction();
};
```

**For error logging:**

```typescript
// ✅ console.error and console.warn are allowed
try {
  await riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  // Also log to monitoring service
  logError(error);
}
```

**For development-only logging:**

```typescript
// ✅ Conditional logging for development
if (process.env.NODE_ENV === "development") {
  console.log("Dev info:", data);
}
```

#### Common Patterns

**Analytics Integration:**

```typescript
// ❌ Bad - console.log in production code
const handleClick = () => {
  console.log("Button clicked");
  doSomething();
};

// ✅ Good - TODO comment for future integration
const handleClick = () => {
  // TODO: Track button click with analytics
  // trackEvent('button_click', { buttonId: 'cta' });
  doSomething();
};

// ✅ Better - Implement analytics immediately
const handleClick = () => {
  trackEvent("button_click", { buttonId: "cta" });
  doSomething();
};
```

**Debugging:**

```typescript
// ❌ Bad - Leaving debug logs
const processData = (data: Data[]) => {
  console.log("Processing:", data);
  return data.map(transform);
};

// ✅ Good - Remove debug logs before commit
const processData = (data: Data[]) => {
  return data.map(transform);
};

// ✅ Good - Use proper debugging tools
const processData = (data: Data[]) => {
  // Use debugger statement or IDE breakpoints instead
  return data.map(transform);
};
```

**Error Handling:**

```typescript
// ✅ console.error is acceptable for error logging
const handleError = (error: Error) => {
  console.error("Error occurred:", error);
  logErrorToService(error); // Also log to monitoring service
};

// ✅ console.warn is acceptable for warnings
if (!isValid) {
  console.warn("Invalid configuration detected");
}
```

#### Pre-commit Checklist

Before committing, verify:

- [ ] No `console.log()` statements in production code
- [ ] No `console.debug()` statements
- [ ] `console.error()` and `console.warn()` are intentional
- [ ] Run `npm run lint` - should show no console warnings
- [ ] Analytics/logging uses proper service integration or TODO comments

### Styling

- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design
- Use CSS Modules for component-specific styles when needed
- Maintain consistent spacing and naming conventions

### Performance Metrics Documentation

When documenting performance improvements or regressions in documentation, use this convention:

**✅ Improvements** (lower is better for time/size metrics):

```markdown
| Metric      | Before | After | Change          |
| ----------- | ------ | ----- | --------------- |
| Build Time  | 3.2s   | 2.5s  | ✅ 22% faster   |
| Bundle Size | 185KB  | 182KB | ✅ 1.6% smaller |
| FCP         | 1.4s   | 1.3s  | ✅ 7% faster    |
```

**❌ Regressions** (higher is worse for time/size metrics):

```markdown
| Metric      | Before | After | Change         |
| ----------- | ------ | ----- | -------------- |
| Build Time  | 2.5s   | 3.2s  | ❌ 28% slower  |
| Bundle Size | 182KB  | 200KB | ❌ 9.9% larger |
```

**✅ Improvements** (higher is better for score metrics):

```markdown
| Metric           | Before | After | Change      |
| ---------------- | ------ | ----- | ----------- |
| Lighthouse Score | 92     | 93    | ✅ +1 point |
| Test Coverage    | 85%    | 92%   | ✅ +7%      |
```

**Key Rules:**

- Use ✅ for improvements (regardless of direction)
- Use ❌ for regressions (regardless of direction)
- Always include the semantic description (faster/slower, smaller/larger, etc.)
- For time metrics: lower values = ✅ improvement
- For size metrics: lower values = ✅ improvement
- For score metrics: higher values = ✅ improvement

## Testing Guidelines

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines.

### Quick Reference

#### Test File Naming

- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `Feature.integration.test.tsx`
- Property tests: `feature-name.test.ts` in `tests/properties/`
- E2E tests: `feature-name.spec.ts` in `tests/e2e/`

#### Mocking Next.js Image

Always use this pattern in test files:

```typescript
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    loading,
    className,
  }: {
    src: string;
    alt: string;
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
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));
```

#### Null Checks in Tests

Always check for existence before accessing properties:

```typescript
const button = container.querySelector("button");
expect(button).toBeTruthy();
if (button) {
  expect(button.textContent).toBe("Click me");
}
```

#### Type Assertions

Use `as any` only when necessary (e.g., schema-dts types):

```typescript
// Only when type system doesn't recognize valid runtime properties
const schema = generatePersonSchema("en") as any;
expect(schema.sameAs).toBeDefined();
```

### Test Coverage

- Minimum coverage: 80%
- All new features must include tests
- Property-based tests for business logic
- Integration tests for critical flows

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```
feat(auth): add user authentication

Implement JWT-based authentication with refresh tokens.
Includes login, logout, and token refresh endpoints.

Closes #123
```

```
fix(contact-form): validate email format

Add email validation to prevent invalid submissions.
```

```
test(properties): add non-null assertion checks

Ensure all test files follow null-safety guidelines.
```

## Pull Request Process

1. **Update Documentation**: Update README.md, TESTING.md, or other docs if needed
2. **Add Tests**: Ensure your changes are covered by tests
3. **Run Tests**: `npm test` - All tests must pass
4. **Run Linter**: `npm run lint` - No ESLint errors
5. **Check Coverage**: Maintain or improve test coverage
6. **Update Changelog**: Add entry to CHANGELOG.md (if exists)
7. **Create PR**: Use a descriptive title and detailed description
8. **Link Issues**: Reference related issues in the PR description
9. **Request Review**: Tag relevant reviewers
10. **Address Feedback**: Respond to review comments promptly

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Coverage maintained/improved
```

## Code Review Guidelines

### For Authors

- Keep PRs focused and reasonably sized
- Write clear commit messages
- Add comments for complex logic
- Respond to feedback constructively
- Update PR based on feedback

### For Reviewers

- Be respectful and constructive
- Focus on code quality and maintainability
- Check for test coverage
- Verify documentation updates
- Test changes locally when needed

## Common Patterns

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import type { ComponentProps } from "@/types";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export default function MyComponent({ title, onAction }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setState(true);
    onAction();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

### Error Handling

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  // Handle error appropriately
  throw new Error("Failed to complete operation");
}
```

### Async Operations

```typescript
// Use async/await
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
```

## Questions?

If you have questions or need help:

1. Check existing documentation (README.md, TESTING.md)
2. Search existing issues
3. Create a new issue with the `question` label
4. Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
