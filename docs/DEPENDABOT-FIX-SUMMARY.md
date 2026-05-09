# Dependabot Vulnerabilities Fix Summary

**Date**: May 7, 2026  
**PR**: #97  
**Branch**: `fix/dependabot-postcss-once-vulnerabilities`  
**Status**: ✅ Ready for Review

---

## Overview

This PR addresses the 2 remaining Dependabot security alerts after the Firebase update (PR #82) was merged to main on May 6, 2026.

---

## Results

### Alert #20 - @tootallnate/once ✅ RESOLVED

| Attribute              | Value                 |
| ---------------------- | --------------------- |
| **Severity**           | LOW                   |
| **Package**            | @tootallnate/once     |
| **Vulnerable Version** | 2.0.1                 |
| **Patched Version**    | 3.0.1                 |
| **Solution**           | npm override          |
| **Status**             | ✅ **FULLY RESOLVED** |

**Verification**:

```bash
$ npm list @tootallnate/once
└─┬ firebase-admin@13.8.0
  └─┬ @google-cloud/storage@7.19.0
    └─┬ teeny-request@9.0.0
      └─┬ http-proxy-agent@5.0.0
        └── @tootallnate/once@3.0.1 ✅
```

---

### Alert #22 - postcss ⚠️ PARTIALLY MITIGATED

| Attribute                 | Value                                       |
| ------------------------- | ------------------------------------------- |
| **Severity**              | MEDIUM                                      |
| **Package**               | postcss                                     |
| **Vulnerable Version**    | < 8.5.10                                    |
| **Our Direct Dependency** | 8.5.14 ✅                                   |
| **Next.js Bundled**       | 8.4.31 ❌                                   |
| **Solution**              | Updated direct dependency + Next.js version |
| **Status**                | ⚠️ **PARTIALLY MITIGATED**                  |

**Why Partially Mitigated?**

- Our direct postcss dependency is patched (8.5.14)
- Next.js 16.2.5 bundles an older postcss version (8.4.31) internally
- Cannot override Next.js's bundled version without breaking compatibility
- Waiting for Next.js to update their internal postcss dependency

**Risk Assessment**: LOW

- Vulnerability affects build-time CSS processing only
- Our build environment is controlled and doesn't accept external CSS input
- No runtime impact on production application

**Verification**:

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

---

## Changes Made

### package.json

```json
{
  "dependencies": {
    "next": "^16.2.5", // Updated from 16.2.4
    "postcss": "^8.5.14" // Updated from 8.5.10
  },
  "overrides": {
    "@tootallnate/once": ">=3.0.1" // Added override
  }
}
```

### Documentation

- ✅ Created `docs/DEPENDABOT-VULNERABILITIES-FIX.md` - Comprehensive fix documentation
- ✅ Updated `docs/DEPENDABOT-ALERTS-STATUS.md` - Current alert status

---

## Testing Results

| Test                             | Status                          |
| -------------------------------- | ------------------------------- |
| `npm install --legacy-peer-deps` | ✅ Success                      |
| `npm run build`                  | ✅ Success (2.6s)               |
| `npm list @tootallnate/once`     | ✅ Version 3.0.1                |
| `npm list postcss`               | ✅ Direct dependency 8.5.14     |
| All postcss dependencies patched | ✅ Yes (except Next.js bundled) |

---

## npm audit Results

**Before This PR**:

```
2 vulnerabilities (1 moderate, 1 low)
- postcss < 8.5.10 (MEDIUM)
- @tootallnate/once < 3.0.1 (LOW)
```

**After This PR**:

```
1 vulnerability (1 moderate)
- postcss < 8.5.10 in Next.js bundled version only
```

**Improvement**: 50% reduction (1 vulnerability fully resolved)

---

## Next Steps

### Immediate

1. ✅ PR #97 created and ready for review
2. ⏳ Review and merge PR #97
3. ⏳ Wait for Dependabot to auto-close Alert #20

### Future

1. ⏳ Monitor Next.js releases for postcss update
2. ⏳ Update Next.js when version with patched postcss is available
3. ⏳ Consider dismissing Alert #22 with justification if Next.js doesn't update soon

---

## Related PRs and Issues

- **PR #82** - Firebase update (merged May 6, 2026) - Fixed 8 undici vulnerabilities
- **PR #97** - This PR - Fixes @tootallnate/once, partially mitigates postcss
- **Issue #86** - @tootallnate/once vulnerability (will be closed by this PR)
- **Issue #85** - postcss vulnerability (partially addressed by this PR)

---

## Dependabot Alert Status

| Alert                             | Severity        | Package           | Status                                      |
| --------------------------------- | --------------- | ----------------- | ------------------------------------------- |
| #12, #11, #9, #10, #8, #4, #1, #2 | HIGH/MEDIUM/LOW | undici            | 🔄 Waiting for auto-closure (PR #82 merged) |
| #20                               | LOW             | @tootallnate/once | ✅ **RESOLVED** (PR #97)                    |
| #22                               | MEDIUM          | postcss           | ⚠️ **PARTIALLY MITIGATED** (PR #97)         |

**Total**: 9 alerts remaining (8 pending auto-closure, 1 partially mitigated)

---

## Recommendations

1. **Merge PR #97** - Fully resolves 1 vulnerability, partially mitigates another
2. **Wait 24-48 hours** - 8 undici alerts should auto-close after Dependabot rescan
3. **Monitor Next.js** - Check https://github.com/vercel/next.js/releases for postcss update
4. **Consider dismissing Alert #22** - Risk is LOW, see DEPENDABOT-VULNERABILITIES-FIX.md for justification

---

## Documentation

- **Detailed Analysis**: `docs/DEPENDABOT-VULNERABILITIES-FIX.md`
- **Alert Status**: `docs/DEPENDABOT-ALERTS-STATUS.md`
- **Dependabot Setup**: `docs/DEPENDABOT-SETUP.md`

---

**Generated**: May 7, 2026  
**Author**: Kiro AI  
**Repository**: RogerioDoCarmo/curriculo  
**PR**: https://github.com/RogerioDoCarmo/curriculo/pull/97
