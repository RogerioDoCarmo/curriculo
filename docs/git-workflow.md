# Git Workflow Guide

# Git Workflow Guide

## ⚠️ CRITICAL: Protected Branches

**NEVER commit directly to `main` or `develop` branches!**

These branches are protected and require pull requests:

- ❌ **DO NOT**: `git checkout main` → make changes → `git commit`
- ❌ **DO NOT**: `git checkout develop` → make changes → `git commit`
- ❌ **DO NOT**: Use `--no-verify` to bypass pre-commit hooks on protected branches
- ✅ **ALWAYS**: Create a feature branch → make changes → create PR

**Correct workflow:**

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-task-name

# Make changes and commit
git add .
git commit -m "feat: your changes"

# Push feature branch
git push origin feature/your-task-name

# Create PR on GitHub: feature/your-task-name → develop
```

## Overview

This project uses a **protected branch workflow** to ensure code quality and prevent accidental commits to main branches.

## Branch Protection Rules

### Protected Branches

- **`main`** - Production branch (protected)
- **`develop`** - Development branch (protected)

### What "Protected" Means

- ❌ Cannot push directly to these branches
- ❌ Cannot force push
- ✅ Must create Pull Requests
- ✅ Must pass CI/CD checks
- ✅ May require code review (depending on settings)

---

## Standard Workflow

### 1. Check Current Branch

**ALWAYS check your current branch before making changes:**

```bash
git branch --show-current
```

**Expected output**: Should be a feature branch (e.g., `feature/my-feature`)

**If you see `main` or `develop`**: STOP! Create a feature branch first.

### 2. Create Feature Branch

If you're on `main` or `develop`, create a feature branch:

```bash
# From main or develop
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**

- `feature/` - New features (e.g., `feature/seo-submission-task`)
- `fix/` - Bug fixes (e.g., `fix/contact-form-validation`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-auth`)
- `test/` - Test additions/updates (e.g., `test/add-unit-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 3. Make Your Changes

Work on your feature branch:

```bash
# Edit files
# ...

# Check status
git status

# Stage changes
git add <files>

# Commit with conventional commit message
git commit -m "feat: add new feature"
```

### 4. Push Feature Branch

Push your feature branch to remote:

```bash
# First push (sets up tracking)
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### 5. Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request" (appears after push)
3. Select base branch:
   - For features: `develop`
   - For hotfixes: `main`
4. Fill in PR template:
   - Title: Clear, descriptive
   - Description: What, why, how
   - Link related issues
5. Click "Create pull request"

### 6. Wait for CI/CD Checks

Your PR will trigger automated checks:

- ✅ Lint
- ✅ Type Check
- ✅ Tests
- ✅ Coverage
- ✅ Build
- ✅ E2E Tests
- ✅ Lighthouse
- ✅ SonarQube

**All checks must pass before merging.**

### 7. Address Review Feedback

If reviewers request changes:

```bash
# Make changes on your feature branch
git add <files>
git commit -m "fix: address review feedback"
git push
```

The PR will automatically update.

### 8. Merge Pull Request

Once approved and all checks pass:

1. Click "Merge pull request" on GitHub
2. Choose merge strategy:
   - **Squash and merge** (recommended for clean history)
   - **Merge commit** (preserves all commits)
   - **Rebase and merge** (linear history)
3. Confirm merge
4. Delete branch on GitHub (optional but recommended)

### 9. Update Local Branches

After PR is merged:

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# If merged to main, also update main
git checkout main
git pull origin main

# Delete local feature branch (optional)
git branch -d feature/your-feature-name

# Delete remote feature branch (if not done on GitHub)
git push origin --delete feature/your-feature-name
```

---

## Common Scenarios

### Scenario 1: Accidentally on Main

**Problem**: You made changes on `main` branch

**Solution**:

```bash
# Check current branch
git branch --show-current
# Output: main

# Stash your changes
git stash

# Create feature branch
git checkout -b feature/my-feature

# Apply stashed changes
git stash pop

# Now commit on feature branch
git add .
git commit -m "feat: my changes"
git push -u origin feature/my-feature
```

### Scenario 2: Forgot to Create Feature Branch

**Problem**: You already committed to `main` or `develop`

**Solution**:

```bash
# Create feature branch from current position
git checkout -b feature/my-feature

# Force update main/develop to match remote (discards local commits)
git checkout main
git reset --hard origin/main

# Switch back to feature branch
git checkout feature/my-feature

# Your commits are now on the feature branch
git push -u origin feature/my-feature
```

### Scenario 3: Need to Update Feature Branch with Latest Changes

**Problem**: Your feature branch is behind `develop`

**Solution**:

```bash
# On your feature branch
git checkout feature/my-feature

# Fetch latest changes
git fetch origin

# Rebase on develop (recommended)
git rebase origin/develop

# Or merge develop into your branch
git merge origin/develop

# Push changes
git push
```

**Note**: Avoid rebasing if your branch has already been pushed and others might be working on it. If you must rebase a pushed branch, use `git push --force-with-lease` (safer than `--force`) and communicate with your team first.

### Scenario 4: Merge Conflicts

**Problem**: Your PR has merge conflicts

**Solution**:

```bash
# On your feature branch
git checkout feature/my-feature

# Fetch and merge develop
git fetch origin
git merge origin/develop

# Resolve conflicts in your editor
# Look for <<<<<<< HEAD markers

# After resolving, stage files
git add <resolved-files>

# Complete merge
git commit -m "fix: resolve merge conflicts"

# Push
git push
```

### Scenario 5: Want to Undo Last Commit

**Problem**: You committed something wrong

**Solution**:

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Make corrections
git add <files>
git commit -m "feat: corrected version"

# Push new commit
git push
```

**Better Alternative**: Instead of undoing commits, create a new commit with the fix. This preserves history and avoids force push:

```bash
# Make corrections
git add <files>
git commit -m "fix: correct previous commit"
git push
```

**If you absolutely must force push** (e.g., fixing sensitive data):

- Use `--force-with-lease` (safer than `--force`)
- Only do this on branches you own
- Communicate with your team first
- Never force push to `main` or `develop`

---

## Best Practices

### Do's ✅

- ✅ **Always check current branch** before making changes
- ✅ **Create feature branches** for all work
- ✅ **Use descriptive branch names** (e.g., `feature/add-seo-task`)
- ✅ **Write clear commit messages** (follow Conventional Commits)
- ✅ **Keep PRs focused** (one feature/fix per PR)
- ✅ **Update your branch** regularly with latest changes
- ✅ **Run tests locally** before pushing
- ✅ **Delete merged branches** to keep repo clean
- ✅ **Pull latest changes** after merging PRs

### Don'ts ❌

- ❌ **Never commit directly to `main` or `develop`**
- ❌ **Never force push to protected branches** (`main`, `develop`)
- ❌ **Avoid force push on feature branches** - prefer new commits to preserve history
- ❌ **Don't create PRs with failing tests**
- ❌ **Don't merge your own PRs** (unless you're the only developer)
- ❌ **Don't leave stale branches** (delete after merge)
- ❌ **Don't commit sensitive data** (API keys, passwords)
- ❌ **Don't commit large binary files** (use Git LFS if needed)
- ❌ **Don't rewrite public history** - avoid force push, prefer new commits

**When Force Push Might Be Necessary**:

- Removing accidentally committed secrets (use `--force-with-lease`)
- Fixing commit messages before anyone else has pulled
- Only on branches you own and haven't shared

**Always prefer**:

- Creating new commits instead of amending
- Merging instead of rebasing on shared branches
- Communicating with team before any force push

---

## Quick Reference

### Check Current Branch

```bash
git branch --show-current
```

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Stage and Commit

```bash
git add .
git commit -m "feat: add feature"
```

### Push Feature Branch

```bash
git push -u origin feature/my-feature
```

### Update Local Branches

```bash
git checkout develop
git pull origin develop
git checkout main
git pull origin main
```

### Delete Feature Branch

```bash
# Local
git branch -d feature/my-feature

# Remote
git push origin --delete feature/my-feature
```

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Simple feature
git commit -m "feat(seo): add sitemap submission task"

# Bug fix with scope
git commit -m "fix(auth): validate email format"

# Documentation update
git commit -m "docs: update git workflow guide"

# Breaking change
git commit -m "feat(api): change authentication method

BREAKING CHANGE: JWT tokens now required for all API calls"
```

---

## CI/CD Pipeline

### Automated Checks

Every PR triggers these checks:

| Check          | Description           | Must Pass |
| -------------- | --------------------- | --------- |
| **Lint**       | ESLint code quality   | ✅ Yes    |
| **Type Check** | TypeScript validation | ✅ Yes    |
| **Test**       | Unit tests            | ✅ Yes    |
| **Coverage**   | Test coverage (71%+)  | ✅ Yes    |
| **Build**      | Production build      | ✅ Yes    |
| **E2E**        | End-to-end tests      | ✅ Yes    |
| **Lighthouse** | Performance tests     | ✅ Yes    |
| **SonarQube**  | Code quality analysis | ✅ Yes    |

### If Checks Fail

1. **Review the error logs** in GitHub Actions
2. **Fix the issues** on your feature branch
3. **Commit and push** the fixes
4. **Wait for checks** to run again

---

## Branch Protection Settings

### Current Settings (GitHub)

**Main Branch**:

- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators (no one can bypass)

**Develop Branch**:

- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

### To View/Update Settings

1. Go to GitHub repository
2. Click **Settings** → **Branches**
3. View **Branch protection rules**

---

## Troubleshooting

### Error: "Protected branch update failed"

**Cause**: Trying to push directly to `main` or `develop`

**Solution**: Create a feature branch and PR instead

```bash
git checkout -b feature/my-feature
git push -u origin feature/my-feature
```

### Error: "Updates were rejected"

**Cause**: Your branch is behind the remote

**Solution**: Pull latest changes first

```bash
git pull origin feature/my-feature
# Or if you want to rebase
git pull --rebase origin feature/my-feature
```

### Error: "Merge conflicts"

**Cause**: Your changes conflict with other changes

**Solution**: Resolve conflicts manually

```bash
# Update your branch
git fetch origin
git merge origin/develop

# Resolve conflicts in editor
# Stage resolved files
git add <files>
git commit -m "fix: resolve merge conflicts"
git push
```

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

---

## Questions?

If you have questions about the Git workflow:

1. Check this guide first
2. Review [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Search existing issues
4. Create a new issue with the `question` label

---

**Last Updated**: 2026-04-30
**Version**: 1.0.0
