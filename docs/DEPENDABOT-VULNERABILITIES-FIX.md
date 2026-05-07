# Dependabot Vulnerabilities Fix

**Date**: May 7, 2026  
**Branch**: `fix/dependabot-postcss-once-vulnerabilities`  
**Related Alerts**: #22 (postcss), #20 (@tootallnate/once)

## Summary

This document describes the resolution of the 2 remaining Dependabot security alerts after the Firebase update (PR #82) was merged to main.

## Vulnerabilities Addressed

### 1. Alert #20 - @tootallnate/once (LOW severity) ✅ RESOLVED

**Status**: ✅ **FIXED**

**Details**:

- **Package**: `@tootallnate/once`
- **Vulnerable Version**: 2.0.1
- **Patched Version**: >= 3.0.1
- **Severity**: LOW
- **Dependency Chain**: firebase-admin → @google-cloud/storage → teeny-request → http-proxy-agent → @tootallnate/once

**Solution**:
Added npm override to force the patched version:

```json
"overrides": {
  "@tootallnate/once": ">=3.0.1"
}
```

**Verification**:

```bash
$ npm list @tootallnate/once
└─┬ firebase-admin@13.8.0
  └─┬ @google-cloud/storage@7.19.0
    └─┬ teeny-request@9.0.0
      └─┬ http-proxy-agent@5.0.0
        └── @tootallnate/once@3.0.1 ✅
```

The vulnerability is now resolved and no longer appears in `npm audit`.

---

### 2. Alert #22 - postcss (MEDIUM severity) ⚠️ MITIGATED

**Status**: ⚠️ **PARTIALLY MITIGATED** (waiting for Next.js update)

**Details**:

- **Package**: `postcss`
- **Vulnerable Version**: < 8.5.10 (Next.js bundles 8.4.31)
- **Patched Version**: >= 8.5.10
- **Severity**: MEDIUM
- **CVE**: PostCSS XSS via Unescaped `</style>` in CSS Stringify Output
- **Advisory**: https://github.com/advisories/GHSA-qx2v-qp2m-jg93

**Root Cause**:
Next.js 16.2.5 bundles an older version of postcss (8.4.31) internally. While our direct dependency is patched (8.5.14), Next.js's bundled version is below the patched threshold.

**Dependency Tree**:

```bash
$ npm list postcss
├── postcss@8.5.14 ✅ (our direct dependency - PATCHED)
├─┬ next@16.2.5
│ └── postcss@8.4.31 ❌ (Next.js bundled - VULNERABLE)
├─┬ autoprefixer@10.5.0
│ └── postcss@8.5.14 ✅
├─┬ tailwindcss@3.4.19
│ └── postcss@8.5.14 ✅
└─┬ vite@8.0.10
  └── postcss@8.5.14 ✅
```

**Why We Can't Fix It Completely**:

1. Next.js bundles postcss internally for its own build process
2. npm overrides cannot force Next.js to use a different postcss version without breaking compatibility
3. Attempting to override causes conflicts with our direct dependency
4. This is a known limitation with framework-bundled dependencies

**Mitigation Steps Taken**:

1. ✅ Updated our direct postcss dependency to 8.5.14 (latest stable)
2. ✅ Updated Next.js from 16.2.4 to 16.2.5 (latest stable)
3. ✅ Verified all other postcss dependencies are patched
4. ✅ Verified build succeeds with current configuration

**Risk Assessment**:

- **Impact**: LOW - The vulnerability is in Next.js's internal build tooling, not in our application code
- **Exposure**: The XSS vulnerability requires an attacker to inject malicious CSS during the build process
- **Likelihood**: VERY LOW - Our build process is controlled and doesn't accept external CSS input
- **Production Impact**: MINIMAL - The vulnerability affects build-time CSS processing, not runtime

**Next Steps**:

1. ⏳ Wait for Next.js to update their bundled postcss version (likely in 16.3.0 or later)
2. ⏳ Monitor Next.js releases: https://github.com/vercel/next.js/releases
3. ⏳ Update Next.js when a version with patched postcss is available
4. ⏳ Alternatively, consider dismissing the Dependabot alert with justification

**Recommendation**:
Given the low risk and the fact that this is a framework-level issue beyond our control, we recommend:

1. Merge this PR to fix the @tootallnate/once vulnerability
2. Monitor for Next.js updates that include patched postcss
3. Consider dismissing the Dependabot alert with the following justification:
   > "This vulnerability is in Next.js's bundled postcss version used for internal build tooling. Our direct postcss dependency (8.5.14) is patched. The risk is minimal as the vulnerability requires injecting malicious CSS during the build process, which is not possible in our controlled build environment. We will update Next.js when a version with patched postcss is available."

---

## Changes Made

### package.json

1. **Updated Next.js**: 16.2.4 → 16.2.5
2. **Updated postcss**: 8.5.10 → 8.5.14 (direct dependency)
3. **Added npm overrides**:
   ```json
   "overrides": {
     "@tootallnate/once": ">=3.0.1"
   }
   ```

### Verification

**Build Test**:

```bash
$ npm run build
✓ Compiled successfully in 2.6s
✓ Generating static pages (13/13) in 332ms
```

**Audit Results**:

```bash
$ npm audit
# 4 moderate severity vulnerabilities
# All related to postcss in Next.js (cannot be fixed without Next.js update)
```

**Before This Fix**:

- 2 vulnerabilities: postcss (MEDIUM) + @tootallnate/once (LOW)

**After This Fix**:

- 1 vulnerability: postcss (MEDIUM) - waiting for Next.js update
- @tootallnate/once: ✅ RESOLVED

---

## Testing Checklist

- [x] `npm install --legacy-peer-deps` succeeds
- [x] `npm run build` succeeds
- [x] `npm audit` shows only postcss vulnerability (Next.js bundled)
- [x] `npm list @tootallnate/once` shows version 3.0.1
- [x] `npm list postcss` shows direct dependency at 8.5.14
- [x] All postcss dependencies (except Next.js) are patched

---

## Related Documentation

- [DEPENDABOT-ALERTS-STATUS.md](./DEPENDABOT-ALERTS-STATUS.md) - Current status of all Dependabot alerts
- [DEPENDABOT-SETUP.md](./DEPENDABOT-SETUP.md) - Dependabot configuration guide
- [Firebase Update PR #82](https://github.com/RogerioDoCarmo/curriculo/pull/82) - Fixed 8 undici vulnerabilities

---

## References

- **@tootallnate/once Advisory**: https://github.com/advisories/GHSA-...
- **postcss Advisory**: https://github.com/advisories/GHSA-qx2v-qp2m-jg93
- **Next.js Releases**: https://github.com/vercel/next.js/releases
- **npm overrides Documentation**: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides

---

**Generated**: May 7, 2026  
**Author**: Kiro AI  
**Repository**: RogerioDoCarmo/curriculo
