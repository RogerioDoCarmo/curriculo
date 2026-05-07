# Dependabot Alerts and PRs Status

**Last Updated**: May 7, 2026

## Summary

- **Total Open Alerts**: 9 (1 resolved, 8 pending auto-closure)
- **Total Open PRs**: 8
- **Security Issues Created**: 5

## Recent Updates

### May 7, 2026

- ✅ **Alert #20 (@tootallnate/once) - RESOLVED** via npm override in PR #96
- ⚠️ **Alert #22 (postcss) - PARTIALLY MITIGATED** - Updated direct dependency to 8.5.14, but Next.js 16.2.5 still bundles vulnerable version 8.4.31. Waiting for Next.js update.
- 🔄 **8 undici alerts** - Waiting for Dependabot auto-closure (24-48 hours after Firebase PR #82 merged to main on May 6, 2026)

## Alert to PR Mapping

### Security Vulnerabilities (10 alerts)

#### High Severity (3 alerts)

1. **Alert #12** - undici vulnerability
   - **Issue**: #87
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.24.0
   - **Status**: PR open, waiting for review

2. **Alert #11** - undici vulnerability
   - **Issue**: #88
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.24.0
   - **Status**: PR open, waiting for review

3. **Alert #9** - undici vulnerability
   - **Issue**: #89
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.24.0
   - **Status**: PR open, waiting for review

#### Medium Severity (5 alerts)

4. **Alert #22** - postcss vulnerability
   - **Issue**: #85
   - **PR**: #96 (updated direct dependency + Next.js version)
   - **Package**: postcss
   - **Current Version**: 8.5.14 (direct), 8.4.31 (Next.js bundled)
   - **Patched Version**: >= 8.5.10
   - **Status**: ⚠️ **PARTIALLY MITIGATED** - Direct dependency patched (8.5.14), but Next.js 16.2.5 bundles vulnerable version (8.4.31). Cannot override without breaking compatibility. Waiting for Next.js to update their bundled postcss. Risk is LOW as vulnerability affects build-time CSS processing in controlled environment.

5. **Alert #10** - undici vulnerability
   - **Issue**: Not created yet
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.24.0
   - **Status**: PR open, no issue created

6. **Alert #8** - undici vulnerability
   - **Issue**: Not created yet
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.24.0
   - **Status**: PR open, no issue created

7. **Alert #4** - undici vulnerability
   - **Issue**: Not created yet
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.23.0
   - **Status**: PR open, no issue created

8. **Alert #1** - undici vulnerability
   - **Issue**: Not created yet
   - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
   - **Package**: undici (transitive dependency from Firebase)
   - **Current Version**: 6.19.7
   - **Patched Version**: >= 6.21.1
   - **Status**: PR open, no issue created

#### Low Severity (2 alerts)

9. **Alert #20** - @tootallnate/once vulnerability
   - **Issue**: #86
   - **PR**: #96 (npm override to force patched version)
   - **Package**: @tootallnate/once
   - **Current Version**: 3.0.1 (patched via override)
   - **Patched Version**: >= 3.0.1
   - **Status**: ✅ **RESOLVED** - npm override forces version 3.0.1

10. **Alert #2** - undici vulnerability
    - **Issue**: Not created yet
    - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
    - **Package**: undici (transitive dependency from Firebase)
    - **Current Version**: 6.19.7
    - **Patched Version**: >= 6.21.2
    - **Status**: PR open, no issue created

## Open PRs (8 total)

### Security-Related PRs (2)

1. **PR #96** - `fix: resolve @tootallnate/once vulnerability and update postcss`
   - **Labels**: dependencies, security
   - **Fixes**: Issue #86 (Alert #20 - @tootallnate/once LOW severity)
   - **Partially Fixes**: Issue #85 (Alert #22 - postcss MEDIUM severity)
   - **Priority**: 🟡 MEDIUM - Fully resolves 1 vulnerability, partially mitigates another
   - **Changes**:
     - Added npm override for @tootallnate/once (2.0.1 → 3.0.1)
     - Updated Next.js (16.2.4 → 16.2.5)
     - Updated postcss direct dependency (8.5.10 → 8.5.14)
   - **Note**: postcss vulnerability in Next.js bundled version cannot be fully resolved until Next.js updates their internal dependency

2. **PR #82** - `chore(deps): bump firebase from 10.14.1 to 12.12.1`
   - **Labels**: dependencies, automated, security
   - **Fixes**: Issues #87, #88, #89 (3 HIGH severity undici vulnerabilities)
   - **Also Fixes**: Alerts #10, #8, #4, #1, #2 (5 additional undici vulnerabilities)
   - **Priority**: 🔴 HIGH - Fixes 8 security vulnerabilities (3 HIGH, 4 MEDIUM, 1 LOW)
   - **Status**: ✅ **MERGED** to main on May 6, 2026. Waiting for Dependabot auto-closure (24-48 hours)

### Dependency Update PRs (7)

2. **PR #84** - `chore(deps-dev): bump @typescript-eslint/parser from 7.18.0 to 8.59.2`
   - **Labels**: dependencies, automated
   - **Type**: Development dependency
   - **Priority**: 🟡 MEDIUM

3. **PR #83** - `chore(deps): bump react-dom from 18.3.1 to 19.2.5`
   - **Labels**: dependencies, automated
   - **Type**: Production dependency (major version update)
   - **Priority**: 🟡 MEDIUM - Requires testing

4. **PR #81** - `chore(deps-dev): bump jest from 29.7.0 to 30.3.0`
   - **Labels**: dependencies, automated
   - **Type**: Development dependency (major version update)
   - **Priority**: 🟡 MEDIUM - May have breaking changes

5. **PR #80** - `chore(deps): bump tailwindcss from 3.4.19 to 4.2.4`
   - **Labels**: dependencies, automated
   - **Type**: Production dependency (major version update)
   - **Priority**: 🟡 MEDIUM - Requires testing, may have breaking changes

6. **PR #79** - `chore(ci): bump actions/github-script from 7 to 9`
   - **Labels**: dependencies, automated
   - **Type**: GitHub Actions
   - **Priority**: 🟢 LOW

7. **PR #78** - `chore(ci): bump softprops/action-gh-release from 2 to 3`
   - **Labels**: dependencies, automated
   - **Type**: GitHub Actions
   - **Priority**: 🟢 LOW

8. **PR #77** - `chore(ci): bump actions/download-artifact from 4 to 8`
   - **Labels**: dependencies, automated
   - **Type**: GitHub Actions
   - **Priority**: 🟢 LOW

## Action Items

### Immediate Actions (High Priority)

1. ✅ **Create missing "dependencies" label** - DONE
2. ✅ **Add labels to all Dependabot PRs** - DONE
3. ✅ **Link PR #82 to security issues #87, #88, #89** - DONE
4. ✅ **Review and merge PR #82** (Firebase update) - MERGED to main on May 6, 2026
5. ✅ **Create PR #96** to fix @tootallnate/once and update postcss - DONE
6. ⏳ **Review and merge PR #96** - Waiting for review
   - Fully resolves Alert #20 (@tootallnate/once)
   - Partially mitigates Alert #22 (postcss)
   - Build verified successful

### Medium Priority Actions

7. ⏳ **Wait for Dependabot auto-closure** (24-48 hours after PR #82 merge)
   - 8 undici alerts should auto-close by May 8, 2026

8. ⏳ **Monitor Next.js releases** for postcss update
   - Check https://github.com/vercel/next.js/releases
   - Update Next.js when version with patched postcss (>= 8.5.10) is available
   - Or consider dismissing Alert #22 with justification (see DEPENDABOT-VULNERABILITIES-FIX.md)

9. ⏳ **Create issues for remaining 5 alerts** (Alerts #10, #8, #4, #1, #2)
   - These will be automatically closed when Dependabot rescans
   - Or skip creating issues since they're being auto-closed

### Low Priority Actions

10. ⏳ **Review and test major version updates**

- PR #83 (React 18 → 19) - May have breaking changes
- PR #81 (Jest 29 → 30) - May have breaking changes
- PR #80 (Tailwind 3 → 4) - Likely has breaking changes

9. ⏳ **Merge GitHub Actions updates** (PRs #79, #78, #77)
   - Low risk, can be merged after CI passes

## Notes

- **Why 9 PRs but 10 alerts?**
  - 8 of the 10 alerts are for `undici`, which is a transitive dependency from Firebase
  - PR #82 (Firebase update) was merged and will fix all 8 undici vulnerabilities once Dependabot rescans (24-48 hours)
  - PR #96 addresses the remaining 2 alerts (postcss and @tootallnate/once)
  - @tootallnate/once is fully resolved via npm override
  - postcss is partially mitigated (direct dependency patched, but Next.js bundles older version)

- **Why only 5 issues created?**
  - The script `scripts/create-dependabot-issues.sh` was run once and created 5 issues
  - It created issues for the 3 HIGH severity alerts and 2 others
  - The remaining 5 alerts (all related to undici) don't have issues yet
  - Since PR #82 was merged, these alerts will auto-close without needing issues

## Recommendations

1. ✅ **PR #82 merged** - 8 undici vulnerabilities will auto-close within 24-48 hours
2. ⏳ **Merge PR #96** - Fully resolves @tootallnate/once, partially mitigates postcss
3. ⏳ **Monitor Next.js releases** - Update when postcss is patched in Next.js
4. ⏳ **Consider dismissing Alert #22** - postcss risk is LOW (see DEPENDABOT-VULNERABILITIES-FIX.md for justification)
5. ⏳ **Defer major updates** - React 19, Jest 30, and Tailwind 4 are major version updates that may require significant testing and code changes

---

**Generated**: May 7, 2026
**Repository**: RogerioDoCarmo/curriculo
**Branch**: fix/dependabot-postcss-once-vulnerabilities
