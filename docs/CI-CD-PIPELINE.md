# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Personal Resume Website project.

## Overview

The project uses GitHub Actions for automated testing, quality checks, and deployment. The pipeline ensures code quality, test coverage, and performance standards are met before code is merged or deployed.

## CI Workflow (`.github/workflows/ci.yml`)

The CI workflow runs on every push and pull request to validate code quality and functionality.

### Jobs

#### 1. Lint

- **Purpose**: Validates code style and catches common errors
- **Runs**: ESLint with Next.js recommended rules
- **Fails if**: Any linting errors are found

#### 2. Type Check

- **Purpose**: Validates TypeScript types
- **Runs**: `tsc --noEmit` to check types without building
- **Fails if**: Any type errors are found

#### 3. Test

- **Purpose**: Runs unit and integration tests
- **Steps**:
  1. Build production site (`npm run build`)
  2. Run tests (`npm test`)
  3. Upload test results as artifacts
- **Fails if**: Any tests fail

#### 4. Coverage

- **Purpose**: Ensures test coverage meets minimum threshold
- **Steps**:
  1. Build production site
  2. Run tests with coverage (`npm run test:coverage`)
  3. Check coverage threshold (71% minimum, goal: 90%)
  4. Upload coverage reports
  5. Comment coverage report on PRs
- **Fails if**: Coverage is below 71%

#### 5. Build

- **Purpose**: Validates production build succeeds
- **Steps**:
  1. Build static site (`npm run build`)
  2. Upload build artifacts for use by other jobs
- **Fails if**: Build fails

#### 6. E2E Tests

- **Purpose**: Validates end-to-end user flows
- **Steps**:
  1. Install Playwright browsers
  2. Run E2E tests (`npm run test:e2e`)
  3. Upload test results and videos
- **Fails if**: Any E2E tests fail

#### 7. Lighthouse Performance Tests

- **Purpose**: Validates performance requirements
- **Requirements**:
  - First Contentful Paint (FCP) < 1.5s
  - Time to Interactive (TTI) < 3s
  - Performance Score >= 90
- **Steps**:
  1. Download build artifacts from Build job
  2. Start local server (`npm run serve`)
  3. Wait for server to be ready
  4. Run Lighthouse tests (`npm run test:lighthouse`)
  5. Upload Lighthouse results
- **Fails if**: Any performance requirement is not met

#### 8. SonarQube Analysis

- **Purpose**: Analyzes code quality and security
- **Runs**: Only on PRs and main/develop branches
- **Requirements**:
  - 90% quality rating (A)
  - Zero critical issues
- **Fails if**: Quality gate fails

#### 9. Status Check

- **Purpose**: Aggregates all job results
- **Runs**: After all other jobs complete
- **Fails if**: Any required job fails

## CD Workflow (`.github/workflows/deploy.yml`)

The deployment workflow runs on pushes to the main branch to deploy to production.

### Jobs

1. **Build and Deploy**
   - Builds production site
   - Deploys to Vercel
   - Sends push notification on success (Firebase Cloud Messaging)

## Performance Requirements

The Lighthouse job validates these performance metrics:

| Metric                 | Requirement | Current  |
| ---------------------- | ----------- | -------- |
| First Contentful Paint | < 1.5s      | 0.62s ✅ |
| Time to Interactive    | < 3s        | 2.42s ✅ |
| Performance Score      | >= 90       | 98 ✅    |

## Quality Gates

### Test Coverage

- **Minimum**: 71%
- **Goal**: 90%
- **Enforced**: CI pipeline fails if below minimum

### SonarQube

- **Quality Rating**: A (90%+)
- **Critical Issues**: 0
- **Enforced**: CI pipeline fails if quality gate fails

### Performance

- **FCP**: < 1.5s
- **TTI**: < 3s
- **Score**: >= 90
- **Enforced**: CI pipeline fails if any metric fails

## Running CI Checks Locally

Before pushing code, run these commands to catch issues early:

```bash
# 1. Lint
npm run lint

# 2. Type check
npx tsc --noEmit

# 3. Tests
npm test

# 4. Coverage
npm run test:coverage

# 5. Build
npm run build

# 6. E2E tests
npm run test:e2e

# 7. Lighthouse (requires build + serve)
npm run serve &
npm run test:lighthouse
```

## Artifacts

The CI workflow uploads these artifacts for debugging:

- **test-results**: Unit and integration test results
- **coverage-report**: Test coverage HTML report
- **build-output**: Production build files
- **playwright-report**: E2E test results
- **test-videos**: E2E test failure videos
- **lighthouse-results**: Lighthouse performance report JSON

## Branch Protection

The `main` branch is protected with these rules:

- Require pull request reviews
- Require status checks to pass:
  - Lint
  - Type Check
  - Test
  - Coverage
  - Build
  - E2E Tests
  - Lighthouse
  - SonarQube (when applicable)
- Require branches to be up to date before merging
- No direct commits allowed

## Troubleshooting

### Lighthouse Tests Failing

If Lighthouse tests fail in CI:

1. Check the uploaded `lighthouse-results` artifact
2. Run tests locally to reproduce:
   ```bash
   npm run build
   npm run serve &
   npm run test:lighthouse
   ```
3. Common issues:
   - Server not starting properly (check port 3000 availability)
   - Build artifacts missing (ensure Build job succeeded)
   - Performance regression (check bundle size, lazy loading)

### Coverage Below Threshold

If coverage drops below 71%:

1. Check the coverage report artifact
2. Run locally: `npm run test:coverage`
3. Add tests for uncovered code
4. Focus on critical paths first

### SonarQube Failing

If SonarQube quality gate fails:

1. Check SonarQube dashboard for details
2. Address critical issues first
3. Common issues:
   - Code smells (refactor complex functions)
   - Security hotspots (review and document)
   - Duplicated code (extract to shared utilities)

## Performance Optimization

If Lighthouse scores drop:

1. **Check bundle size**: `npm run build:analyze`
2. **Review lazy loading**: Ensure below-fold content is lazy loaded
3. **Optimize images**: Use Next.js Image component with proper sizing
4. **Check dependencies**: Remove unused packages
5. **Review code splitting**: Ensure dynamic imports are used appropriately

## Monitoring

- **CI/CD Status**: GitHub Actions tab
- **Test Coverage**: SonarQube dashboard
- **Performance**: Lighthouse reports in CI artifacts
- **Deployment**: Vercel dashboard

## Related Documentation

- [TESTING.md](../TESTING.md) - Testing guidelines
- [COMMANDS.md](../COMMANDS.md) - CLI commands reference
- [tests/lighthouse/README.md](../tests/lighthouse/README.md) - Lighthouse tests documentation
