# Dependabot Alerts and PRs Status

**Last Updated**: May 6, 2026

## Summary

- **Total Open Alerts**: 10
- **Total Open PRs**: 8
- **Security Issues Created**: 5

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
   - **PR**: None (current version 8.5.14 is already above patched version 8.5.10)
   - **Package**: postcss
   - **Current Version**: 8.5.14
   - **Patched Version**: >= 8.5.10
   - **Status**: ⚠️ Needs investigation - version appears to be patched but alert is still open

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
   - **PR**: None (transitive dependency)
   - **Package**: @tootallnate/once
   - **Current Version**: Unknown (transitive)
   - **Patched Version**: >= 3.0.1
   - **Status**: ⚠️ Needs investigation - transitive dependency

10. **Alert #2** - undici vulnerability
    - **Issue**: Not created yet
    - **PR**: #82 (Firebase update 10.14.1 → 12.12.1)
    - **Package**: undici (transitive dependency from Firebase)
    - **Current Version**: 6.19.7
    - **Patched Version**: >= 6.21.2
    - **Status**: PR open, no issue created

## Open PRs (8 total)

### Security-Related PRs (1)

1. **PR #82** - `chore(deps): bump firebase from 10.14.1 to 12.12.1`
   - **Labels**: dependencies, automated, security
   - **Fixes**: Issues #87, #88, #89 (3 HIGH severity undici vulnerabilities)
   - **Also Fixes**: Alerts #10, #8, #4, #1, #2 (5 additional undici vulnerabilities)
   - **Priority**: 🔴 HIGH - Fixes 8 security vulnerabilities (3 HIGH, 4 MEDIUM, 1 LOW)

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
4. ⏳ **Review and merge PR #82** (Firebase update) - Fixes 8 security vulnerabilities
   - Run full test suite
   - Test Firebase Analytics
   - Test Firebase Cloud Messaging
   - Verify build succeeds

### Medium Priority Actions

5. ⏳ **Create issues for remaining 5 alerts** (Alerts #10, #8, #4, #1, #2)
   - These will be automatically closed when PR #82 is merged
   - Or skip creating issues since PR #82 already addresses them

6. ⏳ **Investigate Alert #22** (postcss)
   - Current version (8.5.14) appears to be above patched version (8.5.10)
   - May be a false positive or related to transitive dependency
   - Check if alert can be dismissed

7. ⏳ **Investigate Alert #20** (@tootallnate/once)
   - Transitive dependency - need to identify which package depends on it
   - May require updating parent package

### Low Priority Actions

8. ⏳ **Review and test major version updates**
   - PR #83 (React 18 → 19) - May have breaking changes
   - PR #81 (Jest 29 → 30) - May have breaking changes
   - PR #80 (Tailwind 3 → 4) - Likely has breaking changes

9. ⏳ **Merge GitHub Actions updates** (PRs #79, #78, #77)
   - Low risk, can be merged after CI passes

## Notes

- **Why 8 PRs but 10 alerts?**
  - 8 of the 10 alerts are for `undici`, which is a transitive dependency from Firebase
  - PR #82 (Firebase update) will fix all 8 undici vulnerabilities at once
  - The remaining 2 alerts (postcss and @tootallnate/once) are for different packages
  - postcss appears to already be patched (needs investigation)
  - @tootallnate/once is a transitive dependency (needs investigation)

- **Why only 5 issues created?**
  - The script `scripts/create-dependabot-issues.sh` was run once and created 5 issues
  - It created issues for the 3 HIGH severity alerts and 2 others
  - The remaining 5 alerts (all related to undici) don't have issues yet
  - Since PR #82 addresses all undici vulnerabilities, creating additional issues may not be necessary

## Recommendations

1. **Prioritize PR #82** - This single PR fixes 8 out of 10 security vulnerabilities
2. **Test thoroughly** - Firebase is a critical dependency, ensure all functionality works after update
3. **Investigate false positives** - Alert #22 (postcss) may be incorrectly flagged
4. **Consider batch merging** - After PR #82 is merged and tested, consider merging the GitHub Actions PRs together
5. **Defer major updates** - React 19, Jest 30, and Tailwind 4 are major version updates that may require significant testing and code changes

---

**Generated**: May 6, 2026
**Repository**: RogerioDoCarmo/curriculo
**Branch**: develop
