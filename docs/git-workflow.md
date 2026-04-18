# Git Workflow Guide

**⚠️ IMPORTANT: The `main` and `develop` branches are PROTECTED!**

Always create feature branches for new work. Never commit directly to `main` or `develop`.

## Branch Protection Rules

### Protected Branches

- **`main`** - Production branch (protected)
- **`develop`** - Development branch (protected)

### Why Branches Are Protected

1. Ensures code review before merging
2. Runs CI/CD checks before merge
3. Maintains code quality standards
4. Prevents accidental direct commits
5. Enforces pull request workflow

## Correct Workflow

### 1. Starting New Work

**❌ WRONG:**

```bash
git checkout main
git add .
git commit -m "Add feature"  # This will fail!
```

**✅ CORRECT:**

```bash
# Always create a feature branch first
git checkout main
git pull --no-rebase origin main
git checkout -b feature/your-feature-name
```

### 2. Feature Branch Naming Convention

Use descriptive names with prefixes:

- `feature/` - New features
  - Example: `feature/task-21.6-domain-configuration`
  - Example: `feature/add-contact-form`

- `fix/` - Bug fixes
  - Example: `fix/broken-navigation`
  - Example: `fix/typescript-errors`

- `docs/` - Documentation only
  - Example: `docs/update-readme`
  - Example: `docs/api-documentation`

- `test/` - Test additions/fixes
  - Example: `test/add-unit-tests`
  - Example: `test/fix-failing-tests`

- `refactor/` - Code refactoring
  - Example: `refactor/simplify-auth`
  - Example: `refactor/optimize-performance`

### 3. Making Changes

```bash
# Make your changes
# ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add domain configuration documentation

- Add comprehensive setup guide
- Add progress checklist
- Add quick reference card"

# Push to remote
git push -u origin feature/your-feature-name
```

### 4. Creating Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Select base branch:
   - For features: `develop`
   - For hotfixes: `main`
4. Fill in PR description
5. Wait for CI checks to pass
6. Request review (if required)
7. Merge when approved

### 5. After Merge

```bash
# Switch back to main/develop
git checkout main
git pull --no-rebase origin main

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch (optional, GitHub can do this automatically)
git push origin --delete feature/your-feature-name
```

## Common Scenarios

### Scenario 1: Accidentally Committed to Main

**If you haven't pushed yet:**

```bash
# Undo the commit
git reset HEAD~1

# Create feature branch
git checkout -b feature/your-feature-name

# Re-add and commit
git add .
git commit -m "Your commit message"
git push -u origin feature/your-feature-name
```

**If you already pushed:**

```bash
# This will fail because main is protected
# Contact repository admin to force push (not recommended)
# Better: Create a revert commit via PR
```

### Scenario 2: Need to Update Feature Branch with Latest Main

```bash
# On your feature branch
git checkout feature/your-feature-name

# Fetch latest changes
git fetch origin

# Merge main into your feature branch
git merge origin/main

# Or rebase (if no conflicts expected)
git rebase origin/main

# Push updated branch
git push origin feature/your-feature-name
```

### Scenario 3: Multiple People Working on Same Feature

```bash
# Pull latest changes from feature branch
git checkout feature/shared-feature
git pull --no-rebase origin feature/shared-feature

# Make your changes
# ...

# Push your changes
git push origin feature/shared-feature
```

## Commit Message Conventions

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat: add domain configuration guides"

# Bug fix
git commit -m "fix: resolve TypeScript errors in notification tests"

# Documentation
git commit -m "docs: update README with setup instructions"

# Multiple changes
git commit -m "feat: implement FCM topic subscription

- Add subscribeToTopic function
- Add unsubscribeFromTopic function
- Update NotificationPrompt component
- Add comprehensive unit tests"
```

## Branch Lifecycle

```
main (protected)
  ↓
develop (protected)
  ↓
feature/your-feature ← Work here!
  ↓
Pull Request → develop
  ↓
Pull Request → main
```

## Quick Reference

### Create Feature Branch

```bash
git checkout main
git pull --no-rebase origin main
git checkout -b feature/task-name
```

### Commit and Push

```bash
git add .
git commit -m "type: description"
git push -u origin feature/task-name
```

### Update from Main

```bash
git fetch origin
git merge origin/main
```

### Clean Up After Merge

```bash
git checkout main
git pull --no-rebase origin main
git branch -d feature/task-name
```

## Troubleshooting

### "Updates were rejected because the tip of your current branch is behind"

```bash
# Pull latest changes first
git pull --no-rebase origin feature/your-feature-name

# Then push
git push origin feature/your-feature-name
```

### "You are not allowed to push code to protected branches"

```bash
# You're trying to push to main/develop directly
# Create a feature branch instead:
git checkout -b feature/your-feature-name
git push -u origin feature/your-feature-name
```

### "Your branch and 'origin/main' have diverged"

```bash
# If on feature branch, merge main
git merge origin/main

# If on main (shouldn't happen), pull
git pull --no-rebase origin main
```

## Best Practices

1. ✅ **Always create feature branches**
2. ✅ **Pull before creating new branch**
3. ✅ **Use descriptive branch names**
4. ✅ **Write clear commit messages**
5. ✅ **Keep commits focused and atomic**
6. ✅ **Push regularly to backup work**
7. ✅ **Delete branches after merge**
8. ✅ **Keep feature branches short-lived**

## Never Do This

1. ❌ **Never commit directly to main**
2. ❌ **Never commit directly to develop**
3. ❌ **Never force push to protected branches**
4. ❌ **Never merge without CI checks passing**
5. ❌ **Never push sensitive data (keys, passwords)**
6. ❌ **Never commit large binary files**
7. ❌ **Never rewrite public history**

## Related Documentation

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)

---

**Remember: When in doubt, create a feature branch!**
