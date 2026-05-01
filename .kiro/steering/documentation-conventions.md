---
description: Standards for documenting performance metrics using improvement/regression indicators
inclusion: auto
---

# Documentation Conventions

This file contains documentation standards that should be followed when creating or updating project documentation.

## Performance Metrics Documentation

When documenting performance improvements or regressions in any documentation (README, upgrade summaries, PR descriptions, etc.), always use this convention:

### Convention Rules

1. **Use ✅ for improvements** (regardless of whether the value went up or down)
2. **Use ❌ for regressions** (regardless of whether the value went up or down)
3. **Always include semantic description** (faster/slower, smaller/larger, better/worse)
4. **Context matters**:
   - For time metrics (build time, FCP, TTI): **lower is better** → use ✅
   - For size metrics (bundle size, file size): **lower is better** → use ✅
   - For score metrics (Lighthouse, coverage): **higher is better** → use ✅

### Examples

#### ✅ Improvements (Time/Size Metrics - Lower is Better)

```markdown
| Metric                 | Before | After | Change          |
| ---------------------- | ------ | ----- | --------------- |
| Build Time             | 3.2s   | 2.5s  | ✅ 22% faster   |
| Bundle Size (gzipped)  | 185KB  | 182KB | ✅ 1.6% smaller |
| First Contentful Paint | 1.4s   | 1.3s  | ✅ 7% faster    |
| Time to Interactive    | 2.8s   | 2.7s  | ✅ 3.6% faster  |
```

#### ✅ Improvements (Score Metrics - Higher is Better)

```markdown
| Metric           | Before | After | Change       |
| ---------------- | ------ | ----- | ------------ |
| Lighthouse Score | 92     | 93    | ✅ +1 point  |
| Test Coverage    | 85%    | 92%   | ✅ +7%       |
| Performance      | 88     | 95    | ✅ +7 points |
```

#### ❌ Regressions (Time/Size Metrics - Higher is Worse)

```markdown
| Metric      | Before | After | Change         |
| ----------- | ------ | ----- | -------------- |
| Build Time  | 2.5s   | 3.2s  | ❌ 28% slower  |
| Bundle Size | 182KB  | 200KB | ❌ 9.9% larger |
| Load Time   | 1.2s   | 1.8s  | ❌ 50% slower  |
```

#### ❌ Regressions (Score Metrics - Lower is Worse)

```markdown
| Metric           | Before | After | Change       |
| ---------------- | ------ | ----- | ------------ |
| Lighthouse Score | 93     | 88    | ❌ -5 points |
| Test Coverage    | 92%    | 85%   | ❌ -7%       |
```

### Why This Convention?

**Problem with directional arrows (⬇️/⬆️):**

- ⬇️ technically means "value decreased" but can be confusing
- For build time: 3.2s → 2.5s is ⬇️ (value down) but that's GOOD
- For Lighthouse: 92 → 93 is ⬆️ (value up) and that's also GOOD
- Mixing ⬇️ and ⬆️ for improvements is cognitively inconsistent

**Solution with checkmarks/crosses:**

- ✅ always means "this is good" (improvement)
- ❌ always means "this is bad" (regression)
- Semantic description clarifies what happened (faster/slower/smaller/larger)
- Consistent visual language regardless of metric type

### Implementation Checklist

When creating or updating documentation with metrics:

- [ ] Use ✅ for all improvements
- [ ] Use ❌ for all regressions
- [ ] Include semantic description (faster/slower/smaller/larger/better/worse)
- [ ] Verify the direction matches the metric type (lower time = better, higher score = better)
- [ ] Use consistent table formatting
- [ ] Include units (s, ms, KB, MB, %, points)

### Related Documentation

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Full contributing guide with this convention
- [NEXTJS-16-UPGRADE-SUMMARY.md](../../NEXTJS-16-UPGRADE-SUMMARY.md) - Example implementation
