# Git Workflow - Git Flow Strategy

This project follows the **Git Flow** branching model for organized development and releases.

## Branch Structure

```
main (production)
  ↑
  │ PR (release)
  │
develop (integration)
  ↑
  │ PR (feature)
  │
feature/task-name (development)
```

## Branches

### `main` - Production Branch

- **Purpose**: Contains production-ready code
- **Protection**: Branch protection enabled - no direct commits
- **Updates**: Only via PR from `develop`
- **Tags**: All release tags are created here
- **Deployment**: Automatically deploys to production (future)

### `develop` - Integration Branch

- **Purpose**: Integration branch for ongoing development
- **Base for**: All feature branches
- **Updates**: Via PRs from feature branches
- **State**: Should always be in a working state

### `feature/*` - Feature Branches

- **Purpose**: Development of specific features or tasks
- **Naming**: `feature/task-name` or `feature/checkpoint-X-description`
- **Base**: Created from `develop`
- **Merge to**: `develop` via PR
- **Lifetime**: Deleted after merge

## Workflow Steps

### 1. Starting a New Feature

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/task-name
```

### 2. Development

```bash
# Make changes
# ... code ...

# Validate changes
npm test
npm run lint
npm run format:check

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/task-name
```

### 3. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. **Base**: `develop` ← **Compare**: `feature/task-name`
4. Fill in PR title and description
5. Request review (if applicable)
6. Wait for CI/CD checks to pass
7. Merge PR

### 4. After PR Merge

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Delete feature branch locally
git branch -d feature/task-name

# Clean up remote tracking
git fetch --prune
```

### 5. Release to Production

When `develop` is ready for production release:

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create PR from develop to main via GitHub
# Base: main ← Compare: develop
```

After PR is merged to `main`:

```bash
# Switch to main
git checkout main
git pull origin main

# Create release tag
git tag -a v0.X.Y -m "Release description"
git push origin v0.X.Y

# Create GitHub release
# Go to GitHub → Releases → Create new release
```

## Branch Protection Rules

### `main` Branch

- ✅ Require pull request before merging
- ✅ Require conversation resolution
- ✅ Include administrators
- ❌ Allow force pushes (disabled)
- ❌ Allow deletions (disabled)
- ✅ CodeQL scanning required

### `develop` Branch (Optional)

Consider adding similar protection to `develop` for team projects.

## Commit Message Convention

Follow conventional commits format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add SEO metadata utilities"
git commit -m "fix: resolve navigation bug on mobile"
git commit -m "test: add property tests for structured data"
git commit -m "docs: update Git workflow documentation"
```

## Versioning Strategy

This project uses **Semantic Versioning** (SemVer):

```
v<MAJOR>.<MINOR>.<PATCH>
```

- **MAJOR** (v1.0.0): Breaking changes
- **MINOR** (v0.1.0): New features (backward compatible)
- **PATCH** (v0.0.1): Bug fixes (backward compatible)

**Checkpoint Tags:**

- Major milestones: `v0.X.0-checkpoint-X`
- Minor updates: `v0.X.Y`

## Quick Reference

### Create Feature Branch

```bash
git checkout develop && git pull origin develop && git checkout -b feature/task-name
```

### Commit and Push

```bash
npm test && npm run lint && git add . && git commit -m "feat: description" && git push origin feature/task-name
```

### Update Develop After Merge

```bash
git checkout develop && git pull origin develop && git branch -d feature/task-name && git fetch --prune
```

### Create Release Tag

```bash
git checkout main && git pull origin main && git tag -a v0.X.Y -m "Release description" && git push origin v0.X.Y
```

## Troubleshooting

### Accidentally committed to wrong branch

```bash
# Save changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply changes
git stash pop
```

### Need to update feature branch with latest develop

```bash
# On feature branch
git checkout feature/task-name

# Pull latest develop
git fetch origin develop

# Rebase on develop
git rebase origin/develop

# Force push (only if not shared with others)
git push --force-with-lease origin feature/task-name
```

### Merge conflict resolution

```bash
# Pull latest develop
git checkout develop
git pull origin develop

# Switch to feature branch
git checkout feature/task-name

# Merge develop into feature
git merge develop

# Resolve conflicts in editor
# ... fix conflicts ...

# Stage resolved files
git add .

# Complete merge
git commit -m "merge: resolve conflicts with develop"

# Push
git push origin feature/task-name
```

## Best Practices

1. ✅ **Always branch from develop** for new features
2. ✅ **Keep feature branches small** and focused
3. ✅ **Pull develop frequently** to stay up to date
4. ✅ **Run tests before pushing** to catch issues early
5. ✅ **Write descriptive commit messages** for clarity
6. ✅ **Delete branches after merge** to keep repo clean
7. ✅ **Use PRs for code review** even for solo projects
8. ✅ **Tag releases on main** for version tracking
9. ❌ **Never commit directly to main** - always use PRs
10. ❌ **Never force push to shared branches** - use `--force-with-lease` if needed

## Resources

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
