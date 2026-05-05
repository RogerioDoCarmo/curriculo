# Lighthouse CI Reliable Testing - Future Implementation

## Status

**Not Started** - Deferred for future implementation

## Problem Statement

Lighthouse performance tests are currently non-blocking in the CI pipeline due to persistent Chrome/WebSocket connection failures in GitHub Actions environment. While the tests work reliably in local development, they fail consistently in CI with errors like:

- "Failed to fetch browser webSocket URL from http://127.0.0.1:xxxxx/json/version: fetch failed"
- "Chrome prevented page load with an interstitial"
- Jest worker processes terminated with SIGKILL

## Current Workaround

The lighthouse job in `.github/workflows/ci.yml` is configured with `continue-on-error: true`, making it non-blocking. This allows:

- CI pipeline to complete successfully
- Other quality gates (unit tests, E2E tests, linting) to remain blocking
- Lighthouse tests to still run locally for developers
- Lighthouse results to be visible when they do succeed in CI

## Goal

Implement a reliable solution for running Lighthouse performance tests in CI that:

1. Runs consistently without Chrome/WebSocket connection failures
2. Provides accurate performance metrics comparable to local development
3. Can be a blocking quality gate in the CI pipeline
4. Maintains or improves current performance thresholds

## Potential Solutions to Investigate

### Option 1: Lighthouse CI Server

- Use official Lighthouse CI server (https://github.com/GoogleChrome/lighthouse-ci)
- Dedicated infrastructure for running Lighthouse audits
- Better Chrome environment management
- Historical performance tracking

**Pros:**

- Purpose-built for CI environments
- Better Chrome process management
- Performance trend tracking
- Official Google solution

**Cons:**

- Requires additional infrastructure setup
- More complex configuration
- Potential hosting costs

### Option 2: Docker-based Lighthouse

- Run Lighthouse in a dedicated Docker container with proper Chrome setup
- Use `lighthouse-ci/cli` Docker image
- Better isolation from CI environment issues

**Pros:**

- Consistent Chrome environment
- Better resource isolation
- Reproducible across environments

**Cons:**

- Requires Docker in CI workflow
- Slightly slower due to container overhead
- More complex workflow configuration

### Option 3: Separate Performance Testing Workflow

- Move Lighthouse tests to a dedicated workflow
- Run on schedule (nightly) or manually triggered
- Use different runner configuration optimized for Chrome

**Pros:**

- Doesn't block main CI pipeline
- Can use specialized runners
- More time for tests to complete

**Cons:**

- Performance regressions not caught immediately
- Requires separate workflow management
- Less integrated with PR process

### Option 4: Alternative Performance Testing Tools

- Consider tools designed for CI environments
- Examples: WebPageTest API, SpeedCurve, Calibre
- May have better CI compatibility

**Pros:**

- Purpose-built for CI/CD
- Often include historical tracking
- May have better reliability

**Cons:**

- Potential costs
- Different metrics than Lighthouse
- Migration effort

## Current Performance Thresholds

### Local Development

- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 4.5s
- Performance Score: ≥ 70

### CI Environment (when working)

- First Contentful Paint (FCP): < 3.5s
- Time to Interactive (TTI): < 6s
- Performance Score: ≥ 63

## Files Involved

- `.github/workflows/ci.yml` - CI workflow with lighthouse job
- `tests/lighthouse/performance.test.ts` - Lighthouse test implementation
- `tests/properties/lighthouse-ci-server-startup.test.ts` - Property-based tests
- `package.json` - Scripts for running Lighthouse tests

## Success Criteria

A successful implementation should:

1. ✅ Run Lighthouse tests reliably in CI (>95% success rate)
2. ✅ Complete within reasonable time (<5 minutes)
3. ✅ Provide actionable performance metrics
4. ✅ Can be made a blocking quality gate
5. ✅ Maintain or improve current performance standards
6. ✅ Work consistently across different PR sizes and changes

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md)
- [Lighthouse CI GitHub Action](https://github.com/treosh/lighthouse-ci-action)
- [Chrome Headless in CI Best Practices](https://developers.google.com/web/updates/2017/04/headless-chrome)
- [GitHub Actions Chrome Setup](https://github.com/browser-actions/setup-chrome)

## Next Steps (When Ready to Implement)

1. Research and evaluate the 4 options above
2. Create a proof-of-concept for the chosen approach
3. Test reliability over multiple CI runs
4. Compare performance metrics with local development
5. Update CI workflow to use new approach
6. Make lighthouse job blocking again
7. Document the solution for team

## Related Issues

- Lighthouse CI test failures: Port conflicts, performance thresholds
- Chrome WebSocket connection failures in GitHub Actions
- Jest worker process SIGKILL terminations

## Priority

**Low-Medium** - Current workaround is functional. Implement when:

- Team has bandwidth for infrastructure improvements
- Performance testing becomes more critical
- Current workaround causes issues (e.g., performance regressions not caught)

---

**Created**: 2026-05-04  
**Last Updated**: 2026-05-04  
**Owner**: TBD
