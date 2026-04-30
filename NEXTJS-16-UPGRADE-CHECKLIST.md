# Next.js 16.2.4 Upgrade Checklist

## Pre-Upgrade Status ✅

**Current Version**: Next.js 14.2.35  
**Target Version**: Next.js 16.2.4  
**Tests Passing**: 724/726 (2 Lighthouse failures expected)  
**Build Status**: ✅ Successful  
**Bundle Size**: 87.6 kB First Load JS

## Security Vulnerabilities Found

### Next.js 14.2.35 Vulnerabilities:

- DoS via Image Optimizer remotePatterns
- HTTP request deserialization DoS
- HTTP request smuggling in rewrites
- Unbounded disk cache growth
- Denial of Service with Server Components

### Other Dependencies:

- next-intl: Open redirect vulnerability (upgrade to 4.9.2+)
- postcss: XSS vulnerability
- protobufjs: Critical - Arbitrary code execution
- undici: Multiple high severity issues
- rollup: Arbitrary file write
- uuid: Buffer bounds check issue

---

## Step-by-Step Upgrade Instructions

### Step 1: Update Dependencies

```bash
# Update Next.js and related packages
npm install next@16.2.4 eslint-config-next@16.2.4

# Update next-intl to fix security vulnerability
npm install next-intl@latest

# Fix other vulnerabilities
npm audit fix

# Verify versions
npm list next eslint-config-next next-intl
```

### Step 2: Update Code for Breaking Changes

#### 2.1 Update `app/[locale]/page.tsx` - Make params async

**Before:**

```typescript
export default function HomePage({ params: { locale } }: HomePageProps) {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }
  // ...
}
```

**After:**

```typescript
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }
  // ...
}
```

#### 2.2 Update `app/[locale]/layout.tsx` - Make params async

**Before:**

```typescript
export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ...
}
```

**After:**

```typescript
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // ...
}
```

#### 2.3 Update `generateStaticParams` if used

**Before:**

```typescript
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
```

**After (if params are used):**

```typescript
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
```

#### 2.4 Check for middleware.ts

If you have `middleware.ts`, you may need to rename it to `proxy.ts` and update the export:

**Before (middleware.ts):**

```typescript
export default function middleware(request: NextRequest) {
  // ...
}
```

**After (proxy.ts):**

```typescript
export function proxy(request: NextRequest) {
  // ...
}
```

**Note**: For next-intl, check their documentation for Next.js 16 compatibility.

### Step 3: Update next.config.js (if needed)

Review your `next.config.js` for any deprecated options:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Still supported

  // Turbopack is now default, opt-out if needed:
  // Run: next build --webpack

  images: {
    unoptimized: true, // Required for static export
    // Update if you have custom image config
  },
};

module.exports = nextConfig;
```

### Step 4: Run Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run integration tests
npm run test:integration
```

### Step 5: Test Build

```bash
# Build the project
npm run build

# Verify static export
ls -la out/

# Test locally
npm run serve
```

### Step 6: Update Documentation

Update version references in these files:

- [ ] `README.md` - Change "Next.js 14" to "Next.js 16"
- [ ] `package.json` - Update description
- [ ] `.kiro/specs/personal-resume-website/tasks.md` - Update overview
- [ ] `.kiro/specs/personal-resume-website/design.md` - Update tech stack
- [ ] `content/projects/portfolio-website.md` - Update description
- [ ] `docs/storybook-setup.md` - Update Next.js version
- [ ] `docs/SECURITY-CHECKLIST.md` - Remove Next.js 14 vulnerability notes

### Step 7: Commit Changes

```bash
git add .
git commit -m "chore(deps): upgrade Next.js 14.2.35 to 16.2.4

- Update Next.js from 14.2.35 to 16.2.4
- Update eslint-config-next to 16.2.4
- Update next-intl to fix security vulnerability
- Fix MEDIUM severity security vulnerabilities in Next.js
- Update code for async params breaking change
- Update documentation to reflect Next.js 16

BREAKING CHANGES:
- params and searchParams must now be awaited
- Updated app/[locale]/page.tsx for async params
- Updated app/[locale]/layout.tsx for async params

Fixes:
- DoS vulnerability in Image Optimizer (GHSA-9g9p-9gw9-jx7f)
- HTTP request deserialization DoS (GHSA-h25m-26qc-wcjf)
- HTTP request smuggling (GHSA-ggv3-7p47-pfv8)
- Unbounded disk cache growth (GHSA-3x4c-7xq6-9pq8)
- next-intl open redirect (GHSA-8f24-v5vv-gm5j)

Tests: 724/726 passing
Build: ✅ Successful
Bundle Size: Maintained at ~87.6 kB"
```

---

## Breaking Changes Checklist

### Required Changes:

- [x] ✅ Update `app/[locale]/page.tsx` - Make params async
- [x] ✅ Update `app/[locale]/layout.tsx` - Make params async
- [ ] Update any other route files that use params
- [ ] Update any files that use `cookies()` to await it
- [ ] Update any files that use `headers()` to await it
- [ ] Update any files that use `draftMode()` to await it
- [ ] Check middleware.ts → proxy.ts migration (if applicable)

### Optional Changes:

- [ ] Review image configuration for new defaults
- [ ] Review caching configuration
- [ ] Test Turbopack (now default bundler)
- [ ] Review prefetch behavior changes

---

## Testing Checklist

### Functionality Tests:

- [ ] Homepage loads in all locales (pt-BR, en, es)
- [ ] Language switching works
- [ ] Theme switching works
- [ ] Tech Stack section displays
- [ ] Exit Intent modal works
- [ ] Email subscription works
- [ ] PDF resume download works
- [ ] Navigation works
- [ ] Back to top button works

### Build Tests:

- [ ] `npm run build` succeeds
- [ ] Static export generates `out/` directory
- [ ] All pages present in `out/`
- [ ] All locales generated
- [ ] Images optimized
- [ ] Bundle size acceptable

### Test Suite:

- [ ] Unit tests pass (90%+ coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Property tests pass

---

## Rollback Plan

If issues occur:

```bash
# Revert the upgrade
git revert HEAD

# Or restore from backup
git checkout HEAD~1 package.json package-lock.json
npm install

# Verify everything works
npm test
npm run build
```

---

## Performance Comparison

| Metric        | Next.js 14 | Next.js 16 | Change |
| ------------- | ---------- | ---------- | ------ |
| Build Time    | TBD        | TBD        | TBD    |
| Bundle Size   | 87.6 kB    | TBD        | TBD    |
| Tests Passing | 724/726    | TBD        | TBD    |

---

## Expected Benefits

### Performance:

- ✅ 2-5x faster production builds with Turbopack
- ✅ Up to 10x faster Fast Refresh in development
- ✅ Better prefetching with layout deduplication

### Security:

- ✅ Fixes all Next.js 14 vulnerabilities
- ✅ Fixes next-intl open redirect
- ✅ Better image security

### Developer Experience:

- ✅ Improved error messages
- ✅ Better logging (compile/render time breakdown)
- ✅ Next.js DevTools MCP support

---

## Support Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [next-intl Next.js 16 Compatibility](https://next-intl-docs.vercel.app/)
- [Project Upgrade Guide](./docs/NEXTJS-16-UPGRADE-GUIDE.md)

---

## Notes

- **Static Export**: Many Next.js 16 features (Cache Components, PPR, Server Actions) don't apply to static export
- **Turbopack**: Now default bundler, can opt-out with `next build --webpack`
- **Breaking Changes**: Mainly async params/cookies/headers - straightforward to fix
- **Risk Level**: Medium - well-tested upgrade path, but requires code changes

---

## Status

- [ ] Dependencies updated
- [ ] Code updated for breaking changes
- [ ] Tests passing
- [ ] Build successful
- [ ] Documentation updated
- [ ] Committed and pushed
- [ ] Deployed to production
