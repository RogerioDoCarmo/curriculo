# Next.js 16.2.4 Upgrade Guide

## Overview

This guide documents the upgrade process from Next.js 14.x to Next.js 16.2.4 to address security vulnerabilities and adopt the latest stable version with significant performance improvements.

## Motivation

### Security Vulnerabilities in Next.js 14.2.35

**Current Version**: next@14.2.35  
**Severity**: MEDIUM  
**Vulnerabilities**: 1 known security vulnerability

**Known Issues**:

- DoS via Image Optimizer remotePatterns configuration
- Server-Side Request Forgery (SSRF) in Image Optimization API
- Potential security risks in dynamic route handling

**Impact on This Project**:

- **Low Risk**: We use static export (`output: 'export'`), which disables the Image Optimization API
- **No Runtime Server**: Static export means no server-side vulnerabilities can be exploited
- **Best Practice**: Still recommended to upgrade for security best practices and future-proofing

### Benefits of Next.js 16.2.4

1. **Security Fixes**: Addresses all known vulnerabilities in Next.js 14
2. **Performance Improvements**: 2-5x faster builds, up to 10x faster Fast Refresh
3. **Turbopack Stable**: Production-ready bundler with significant speed gains
4. **Cache Components**: Explicit caching model with Partial Pre-Rendering (PPR)
5. **Better Developer Experience**: Improved error messages, logging, and debugging tools
6. **React 19.2 Support**: Latest React features including View Transitions

## Pre-Upgrade Checklist

Before starting the upgrade, ensure:

- [ ] All tests pass (`npm test`, `npm run test:e2e`)
- [ ] Current build succeeds (`npm run build`)
- [ ] Git working directory is clean
- [ ] Create backup branch: `git checkout -b backup/nextjs-14-stable`
- [ ] Document current bundle sizes and performance metrics
- [ ] Review Next.js 16 release notes: https://nextjs.org/blog/next-16

## Breaking Changes in Next.js 16

### 1. Async Request APIs (CRITICAL)

**params, searchParams, cookies, headers, draftMode**:

- All must now be awaited
- Synchronous access no longer supported

**Action**: Update all route files to use `await`

### 2. middleware.ts → proxy.ts

**Changes**:

- `middleware.ts` deprecated, use `proxy.ts`
- Export function must be named `proxy`
- Runs on Node.js runtime (not Edge)

**Action**: Rename file and export if using middleware

### 3. App Router Changes

**Metadata API**:

- `generateMetadata` may have updated type signatures
- Metadata fields may have new validation rules

**Action**: Review and test all metadata generation in `app/[locale]/layout.tsx`

### 2. Image Component

**Changes**:

- Updated default behavior for `loading` prop
- New `placeholder` options
- Updated `remotePatterns` configuration

**Action**: Review all `next/image` usage in components

### 3. TypeScript Support

**Changes**:

- Stricter type checking for route parameters
- Updated types for `generateStaticParams`
- New types for Server Components

**Action**: Fix any TypeScript errors after upgrade

### 4. Static Export

**Changes**:

- Updated `output: 'export'` behavior
- Changes to static file generation
- Updated handling of dynamic routes

**Action**: Test static export generation thoroughly

### 5. Middleware

**Changes**:

- Updated middleware API
- Changes to request/response handling

**Action**: Test next-intl middleware compatibility

## Upgrade Steps

### Step 1: Audit Current State

```bash
# Check current version
npm list next

# Run security audit
npm audit

# Run all tests
npm test
npm run test:e2e

# Build and verify
npm run build
```

### Step 2: Update Dependencies

```bash
# Update Next.js and related packages
npm install next@16.2.4 eslint-config-next@16.2.4

# Bundle analyzer should already be at 16.2.4
# Verify: npm list @next/bundle-analyzer

# Install dependencies
npm install
```

### Step 3: Update Configuration Files

**next.config.js**:

```javascript
// Review and update for Next.js 15 compatibility
// Verify output: 'export' still works
// Update image configuration if needed
```

**tsconfig.json**:

```json
// Update if Next.js 15 requires new compiler options
```

### Step 4: Update Code

1. **Update App Router files**:
   - `app/[locale]/layout.tsx`
   - `app/[locale]/page.tsx`
   - Metadata generation functions

2. **Update Image components**:
   - Review all `next/image` imports
   - Update props if API changed

3. **Update next-intl integration**:
   - Check compatibility
   - Update middleware if needed

### Step 5: Test Everything

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run property tests
npm run test:properties

# Test static export
npm run build
npm run serve

# Run Lighthouse audits
npm run test:lighthouse
```

### Step 6: Update Documentation

Update version references in:

- [ ] README.md
- [ ] docs/SECURITY-CHECKLIST.md
- [ ] .kiro/specs/personal-resume-website/tasks.md
- [ ] .kiro/specs/personal-resume-website/design.md
- [ ] content/projects/portfolio-website.md
- [ ] docs/storybook-setup.md
- [ ] package.json description

### Step 7: Commit and Deploy

```bash
# Commit changes
git add .
git commit -m "chore(deps): upgrade Next.js 14.x to 15.x

- Update Next.js from 14.2.35 to 15.x
- Fix MEDIUM severity security vulnerabilities
- Update related dependencies (eslint-config-next, bundle-analyzer)
- Update configuration files for Next.js 15 compatibility
- Update documentation to reflect Next.js 15
- All tests passing (726 tests)
- Static export verified working
- Performance metrics maintained

BREAKING CHANGES: None for this project (static export)

Fixes: DoS vulnerability in Image Optimizer
Closes: #[issue-number]"

# Tag release
git tag -a v0.15.0 -m "Next.js 15 upgrade"

# Push changes
git push origin main --tags
```

## Testing Checklist

After upgrade, verify:

### Functionality

- [ ] Homepage loads correctly in all locales (pt-BR, en, es)
- [ ] Language switching works
- [ ] Theme switching (light/dark) works
- [ ] Tech Stack section displays correctly
- [ ] Exit Intent modal works
- [ ] Email subscription form works
- [ ] PDF resume download works
- [ ] All navigation links work
- [ ] Back to top button works

### Build & Deploy

- [ ] `npm run build` succeeds
- [ ] Static export generates `out/` directory
- [ ] All pages present in `out/` directory
- [ ] All locales generated correctly
- [ ] Images optimized correctly
- [ ] Bundle size acceptable (< 200KB gzipped)

### Tests

- [ ] All unit tests pass (90%+ coverage)
- [ ] All integration tests pass
- [ ] All E2E tests pass (29 tests)
- [ ] All property tests pass
- [ ] Lighthouse scores >= 90

### CI/CD

- [ ] GitHub Actions workflows pass
- [ ] SonarQube quality gate passes
- [ ] Vercel deployment succeeds
- [ ] All domains work correctly

## Rollback Plan

If issues occur during upgrade:

```bash
# Restore from backup branch
git checkout backup/nextjs-14-stable

# Or revert the upgrade commit
git revert <commit-hash>

# Reinstall dependencies
npm install

# Verify everything works
npm test
npm run build
```

## Known Issues & Solutions

### Issue 1: TypeScript Errors After Upgrade

**Symptom**: TypeScript compilation errors in route files

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Issue 2: next-intl Compatibility

**Symptom**: Middleware errors or locale routing broken

**Solution**:

- Check next-intl compatibility with Next.js 15
- Update next-intl to latest version
- Review middleware configuration

### Issue 3: Static Export Issues

**Symptom**: Build fails or pages missing from `out/` directory

**Solution**:

- Review `next.config.js` configuration
- Check `generateStaticParams` implementation
- Verify all dynamic routes have static params

## Performance Comparison

Document performance metrics before and after upgrade:

| Metric                 | Next.js 14 | Next.js 15 | Change |
| ---------------------- | ---------- | ---------- | ------ |
| Build Time             | TBD        | TBD        | TBD    |
| Bundle Size (gzipped)  | TBD        | TBD        | TBD    |
| First Contentful Paint | TBD        | TBD        | TBD    |
| Time to Interactive    | TBD        | TBD        | TBD    |
| Lighthouse Performance | TBD        | TBD        | TBD    |

## References

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Next.js 15 Breaking Changes](https://nextjs.org/docs/app/building-your-application/upgrading/version-15#breaking-changes)
- [next-intl Compatibility](https://next-intl-docs.vercel.app/)

## Support

If you encounter issues during the upgrade:

1. Check Next.js 15 documentation
2. Review GitHub issues for similar problems
3. Check next-intl compatibility notes
4. Consult this project's test suite for expected behavior

## Completion Checklist

- [ ] All dependencies updated
- [ ] All configuration files updated
- [ ] All code updated for compatibility
- [ ] All tests passing
- [ ] Static export working
- [ ] Documentation updated
- [ ] Performance verified
- [ ] CI/CD pipeline working
- [ ] Deployed to production
- [ ] Security vulnerabilities resolved
