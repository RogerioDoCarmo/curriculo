# Branch Protection Quick Reference

## 🔒 Protected Branches

- **main** - Production branch (fully protected)
- **develop** - Development branch (recommended protection)

## ✅ Required Status Checks

The following CI checks must pass before merging to `main`:

| Check | Job Name            | Description                    |
| ----- | ------------------- | ------------------------------ |
| ✓     | `Lint`              | ESLint code quality checks     |
| ✓     | `Type Check`        | TypeScript type validation     |
| ✓     | `Test`              | Unit and property-based tests  |
| ✓     | `Test Coverage`     | Minimum 71% coverage threshold |
| ✓     | `Build`             | Next.js production build       |
| ✓     | `E2E Tests`         | Playwright end-to-end tests    |
| ✓     | `All Checks Passed` | Final status aggregation       |

## 📋 Pull Request Requirements

Before a PR can be merged to `main`:

1. ✅ At least **1 approval** from a reviewer
2. ✅ All **status checks** must pass
3. ✅ All **conversations** must be resolved
4. ✅ Branch must be **up to date** with main
5. ✅ No **force pushes** allowed
6. ✅ No **direct pushes** to main

## 🚀 Standard Workflow

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: your changes"

# 3. Push to GitHub
git push origin feature/your-feature

# 4. Create PR on GitHub
# 5. Wait for CI checks and approval
# 6. Merge via GitHub UI (Squash & Merge recommended)
```

## 🔧 Configuration Location

**GitHub Settings Path:**
Repository → Settings → Branches → Branch protection rules

## 📚 Full Documentation

See [BRANCH-PROTECTION-GUIDE.md](../BRANCH-PROTECTION-GUIDE.md) for complete setup instructions.

## 🆘 Common Issues

| Issue                       | Solution                              |
| --------------------------- | ------------------------------------- |
| Status checks not appearing | Wait for CI to run once on the branch |
| Cannot merge with approval  | Check all conversations are resolved  |
| CI checks failing           | Review workflow logs in Actions tab   |
| Branch not up to date       | Click "Update branch" button in PR    |

## 🎯 Quick Setup Checklist

- [ ] Navigate to Settings → Branches
- [ ] Add rule for `main` branch
- [ ] Enable "Require pull request before merging" (1 approval)
- [ ] Enable "Require status checks to pass before merging"
- [ ] Add required checks: Lint, Type Check, Test, Test Coverage, Build, E2E Tests, All Checks Passed
- [ ] Enable "Require conversation resolution before merging"
- [ ] Enable "Include administrators"
- [ ] Disable "Allow force pushes"
- [ ] Disable "Allow deletions"
- [ ] Save changes

---

**Last Updated:** 2024
**Repository:** https://github.com/RogerioDoCarmo/curriculo
