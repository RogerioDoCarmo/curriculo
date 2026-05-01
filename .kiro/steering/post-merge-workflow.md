---
description: Automated workflow for updating repository after PR merge and creating git tags
inclusion: manual
---

# Post-Merge Workflow

**Trigger phrases**: "post-merge workflow", "update repo after merge", "merged PR update local"

## Workflow Steps

When the user says one of the trigger phrases, execute these steps automatically:

### 1. Update develop branch

```bash
git checkout develop
git pull
```

### 2. Update main branch

```bash
git checkout main
git pull
```

### 3. Delete local feature branch

Ask user for branch name if not provided, then:

```bash
git branch -d <branch-name>
```

### 4. Create annotated git tag

Ask user for:

- Tag version (e.g., v0.18.0)
- Release title
- Key changes/features

Then create tag with structured release notes:

```bash
git tag -a <version> -m "<release-notes>"
```

### 5. Push tag to remote

```bash
git push --tags
```

## Release Notes Template

```
v<version> - <Title>

## <Feature Category>

### <Subsection>
- <Change description>
- Performance: <metrics with ✅/❌ indicators>

## Files Changed
- <file1> (created/updated/deleted)

## Known Issues
- <Issue description>

## Related
- Commit: <commit-hash>
- Previous: <previous-tag>
```

## Tag Naming Convention

Follow semantic versioning:

- **Major** (v1.0.0): Breaking changes
- **Minor** (v0.18.0): New features, no breaking changes
- **Patch** (v0.17.1): Bug fixes only

## Error Handling

**Branch not fully merged**:

```bash
git branch -D <branch-name>  # Force delete (use with caution)
```

**Tag already exists**:

```bash
git tag -d <tag-name>                    # Delete local
git push --delete origin <tag-name>      # Delete remote
git tag -a <tag-name> -m "..."          # Recreate
git push --tags
```

## Metrics Convention

Always use ✅/❌ indicators in release notes:

- ✅ = Improvement (faster/smaller/higher score)
- ❌ = Regression (slower/larger/lower score)

Example:

- Build time: ✅ 22% faster (3.2s → 2.5s)
- Bundle size: ✅ 1.6% smaller (185KB → 182KB)
