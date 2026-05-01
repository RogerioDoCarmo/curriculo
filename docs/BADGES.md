# Project Badges Documentation

This document explains all the quality badges displayed in the project README, what they measure, and why they matter.

## Table of Contents

- [Build & Deployment Status](#build--deployment-status)
- [Code Quality Metrics](#code-quality-metrics)
- [Tech Stack Badges](#tech-stack-badges)
- [Project Information](#project-information)
- [How to Update Badges](#how-to-update-badges)

---

## Build & Deployment Status

These badges show the real-time status of our build and deployment pipelines.

### CI (Continuous Integration)

```markdown
[![CI](https://github.com/RogerioDoCarmo/curriculo/actions/workflows/ci.yml/badge.svg)](https://github.com/RogerioDoCarmo/curriculo/actions/workflows/ci.yml)
```

**What it shows**: Current status of the GitHub Actions CI workflow

**Possible states**:

- ✅ **Passing** (green) - All tests, linting, and build steps succeeded
- ❌ **Failing** (red) - One or more CI steps failed
- 🟡 **In Progress** (yellow) - CI workflow is currently running

**Why it matters**: Indicates that the codebase is stable and all automated quality checks are passing. A green badge means the code is safe to deploy.

**Source**: GitHub Actions workflow defined in `.github/workflows/ci.yml`

---

### Vercel Deployment

```markdown
[![Vercel](https://deploy-badge.vercel.app/?url=https://rogeriodocarmo.com&name=Vercel)](https://rogeriodocarmo.com)
```

**What it shows**: Current deployment status on Vercel

**Possible states**:

- ✅ **Ready** (green) - Latest deployment is live and accessible
- ❌ **Error** (red) - Deployment failed
- 🟡 **Building** (yellow) - Deployment in progress

**Why it matters**: Confirms that the production website is live and accessible. Users can click the badge to visit the live site.

**Source**: Vercel deployment platform monitoring the primary domain (rogeriodocarmo.com)

---

## Code Quality Metrics

These badges are provided by SonarCloud, a comprehensive code quality and security analysis platform.

### Quality Gate Status

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: Overall pass/fail status based on SonarCloud's quality gate criteria

**Possible states**:

- ✅ **Passed** (green) - Code meets all quality gate conditions
- ❌ **Failed** (red) - Code fails one or more quality gate conditions

**Why it matters**: This is the master indicator of code quality. A passing quality gate means the code meets minimum standards for:

- Code coverage (≥80%)
- Maintainability rating (A)
- Security rating (A)
- Reliability rating (A)
- No critical bugs or vulnerabilities

**Quality Gate Conditions**:

- Coverage on new code ≥ 80%
- Duplicated lines on new code ≤ 3%
- Maintainability rating on new code = A
- Reliability rating on new code = A
- Security rating on new code = A

---

### Quality Gate (Visual)

```markdown
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=RogerioDoCarmo_curriculo)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: Visual representation of the quality gate status with detailed metrics

**Why it matters**: Provides a quick visual summary of multiple quality metrics in one badge. Shows the overall health of the codebase at a glance.

---

### Code Coverage

```markdown
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=coverage)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: Percentage of code covered by automated tests

**Target**: ≥80% coverage

**Why it matters**: Higher coverage means more code is tested, reducing the risk of bugs in production. Our CI/CD pipeline enforces a minimum of 80% coverage.

**What's measured**:

- Line coverage: Percentage of executable lines tested
- Branch coverage: Percentage of conditional branches tested
- Function coverage: Percentage of functions called in tests

**Example**: 85.2% means 85.2% of the codebase is executed during test runs.

---

### Maintainability Rating

```markdown
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: How easy the code is to maintain and modify

**Rating scale**:

- **A** (green) - ≤5% technical debt ratio (excellent)
- **B** (light green) - 6-10% technical debt ratio (good)
- **C** (yellow) - 11-20% technical debt ratio (moderate)
- **D** (orange) - 21-50% technical debt ratio (poor)
- **E** (red) - >50% technical debt ratio (critical)

**Why it matters**: Code with high maintainability is easier to understand, modify, and extend. Low maintainability leads to slower development and more bugs.

**What's measured**:

- Code smells (design issues)
- Code complexity
- Code duplication
- Technical debt (estimated time to fix all issues)

**Target**: Rating A (≤5% technical debt)

---

### Security Rating

```markdown
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: Security vulnerability assessment

**Rating scale**:

- **A** (green) - 0 vulnerabilities (excellent)
- **B** (light green) - At least 1 minor vulnerability
- **C** (yellow) - At least 1 major vulnerability
- **D** (orange) - At least 1 critical vulnerability
- **E** (red) - At least 1 blocker vulnerability

**Why it matters**: Security vulnerabilities can lead to data breaches, unauthorized access, or system compromise. A rating of A means no known security issues.

**What's measured**:

- SQL injection vulnerabilities
- Cross-site scripting (XSS) vulnerabilities
- Authentication and authorization issues
- Cryptographic weaknesses
- Sensitive data exposure

**Target**: Rating A (0 vulnerabilities)

---

### Reliability Rating

```markdown
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

**What it shows**: Likelihood of bugs and runtime errors

**Rating scale**:

- **A** (green) - 0 bugs (excellent)
- **B** (light green) - At least 1 minor bug
- **C** (yellow) - At least 1 major bug
- **D** (orange) - At least 1 critical bug
- **E** (red) - At least 1 blocker bug

**Why it matters**: Bugs cause unexpected behavior, crashes, and poor user experience. A rating of A means no known bugs in the codebase.

**What's measured**:

- Null pointer dereferences
- Resource leaks
- Logic errors
- Exception handling issues
- Type errors

**Target**: Rating A (0 bugs)

---

## Tech Stack Badges

These badges showcase the technologies and frameworks used in the project.

### Next.js

```markdown
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
```

**What it shows**: Next.js framework version

**Current version**: 16.2.4

**Why it matters**: Next.js is the core framework for this application. The version number helps developers understand which features and APIs are available.

**Key features used**:

- App Router (Next.js 13+)
- Server Components
- Static Site Generation (SSG)
- Image Optimization
- Internationalization (i18n)

---

### TypeScript

```markdown
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
```

**What it shows**: TypeScript version

**Current version**: 5.x

**Why it matters**: TypeScript provides static type checking, reducing runtime errors and improving code quality. Version 5.x includes the latest type system improvements.

**Benefits**:

- Compile-time type checking
- Better IDE support and autocomplete
- Improved code documentation
- Easier refactoring

---

### React

```markdown
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://reactjs.org/)
```

**What it shows**: React version

**Current version**: 18

**Why it matters**: React 18 introduces concurrent rendering, automatic batching, and improved performance. The version number indicates which React features are available.

**Key features used**:

- React Server Components
- Concurrent rendering
- Automatic batching
- Suspense for data fetching

---

### Tailwind CSS

```markdown
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
```

**What it shows**: Tailwind CSS version

**Current version**: 3.x

**Why it matters**: Tailwind CSS is the utility-first CSS framework used for styling. Version 3.x includes JIT (Just-In-Time) compilation for faster builds and smaller bundle sizes.

**Benefits**:

- Utility-first approach
- JIT compilation
- Dark mode support
- Responsive design utilities

---

## Project Information

These badges provide general information about the project.

### License

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

**What it shows**: Project license type

**License**: MIT

**Why it matters**: The MIT license is a permissive open-source license that allows anyone to use, modify, and distribute the code with minimal restrictions.

**Permissions**:

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

**Conditions**:

- Include copyright notice
- Include license text

---

### Node.js Version

```markdown
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9.0-green?logo=node.js)](https://nodejs.org/)
```

**What it shows**: Minimum required Node.js version

**Requirement**: ≥20.9.0

**Why it matters**: Ensures developers use a compatible Node.js version. Node.js 20 is the current LTS (Long Term Support) version with the latest features and security updates.

**Benefits of Node.js 20**:

- Improved performance
- Native test runner
- Better ESM support
- Security updates

---

### Code Size

```markdown
[![Code Size](https://img.shields.io/github/languages/code-size/RogerioDoCarmo/curriculo)](https://github.com/RogerioDoCarmo/curriculo)
```

**What it shows**: Total size of the codebase in bytes

**Why it matters**: Provides a quick indication of project size. Smaller codebases are generally easier to maintain, but size should be balanced with functionality.

**Note**: This measures source code only, not dependencies or build artifacts.

---

### Last Commit

```markdown
[![Last Commit](https://img.shields.io/github/last-commit/RogerioDoCarmo/curriculo)](https://github.com/RogerioDoCarmo/curriculo/commits/main)
```

**What it shows**: Date and time of the most recent commit to the main branch

**Why it matters**: Indicates how actively the project is maintained. Recent commits suggest active development and maintenance.

**Interpretation**:

- Recent (within days) - Actively maintained
- Moderate (within weeks) - Regularly maintained
- Old (months+) - May be stable or inactive

---

## How to Update Badges

### Automatic Updates

Most badges update automatically:

- **CI badge**: Updates on every push/PR
- **Vercel badge**: Updates on every deployment
- **SonarCloud badges**: Update after each analysis (triggered by CI)
- **Code size badge**: Updates on every commit
- **Last commit badge**: Updates on every commit

### Manual Updates

Some badges require manual updates when versions change:

#### Update Next.js Version Badge

When upgrading Next.js, update the version in the badge:

```markdown
[![Next.js](https://img.shields.io/badge/Next.js-NEW_VERSION-black?logo=next.js)](https://nextjs.org/)
```

Replace `NEW_VERSION` with the new version number (e.g., `16.3.0`).

#### Update TypeScript Version Badge

When upgrading TypeScript, update the version:

```markdown
[![TypeScript](https://img.shields.io/badge/TypeScript-NEW_VERSION-blue?logo=typescript)](https://www.typescriptlang.org/)
```

#### Update React Version Badge

When upgrading React, update the version:

```markdown
[![React](https://img.shields.io/badge/React-NEW_VERSION-61dafb?logo=react)](https://reactjs.org/)
```

#### Update Tailwind CSS Version Badge

When upgrading Tailwind CSS, update the version:

```markdown
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-NEW_VERSION-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
```

---

## Badge Best Practices

### Organization

Badges are organized into logical groups with HTML comments:

```markdown
<!-- Build & Deployment Status -->

[badges here]

<!-- Code Quality -->

[badges here]

<!-- Tech Stack -->

[badges here]

<!-- Project Info -->

[badges here]
```

### Maintenance

- Review badges monthly to ensure they're working
- Update version badges when dependencies are upgraded
- Remove badges for deprecated tools or services
- Add new badges when adopting new tools or achieving new milestones

### Adding New Badges

When adding new badges, consider:

1. **Relevance**: Does it provide valuable information?
2. **Accuracy**: Does it update automatically or require manual updates?
3. **Placement**: Which category does it belong to?
4. **Consistency**: Does it match the style of existing badges?

### Badge Services

- **Shields.io**: https://shields.io/ - General-purpose badge generator
- **SonarCloud**: https://sonarcloud.io/ - Code quality badges
- **GitHub Actions**: Built-in CI/CD badges
- **Vercel**: https://github.com/therealsujitk/vercel-badge - Deployment badges

---

## Additional Resources

- [Shields.io Documentation](https://shields.io/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [GitHub Actions Badge Documentation](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Vercel Badge Generator](https://github.com/therealsujitk/vercel-badge)

---

## Summary

Our project displays **16 quality badges** across 4 categories:

- **2** Build & Deployment badges
- **6** Code Quality badges (SonarCloud)
- **4** Tech Stack badges
- **4** Project Information badges

These badges provide instant visibility into:

- ✅ Build and deployment status
- ✅ Code quality and security
- ✅ Test coverage
- ✅ Technology stack
- ✅ Project maintenance status

A full set of green badges indicates a high-quality, well-maintained, secure, and actively developed project.
