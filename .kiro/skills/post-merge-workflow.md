---
name: Post-Merge Workflow
description: Update local repository after merging a PR and create a git tag
keywords: git, merge, tag, release, workflow, update
---

# Post-Merge Workflow Skill

This skill automates the workflow after merging a PR to develop and main branches.

## What This Skill Does

1. **Updates develop branch**: Switches to develop and pulls latest changes
2. **Updates main branch**: Switches to main and pulls latest changes
3. **Deletes local feature branch**: Removes the merged feature branch locally
4. **Creates git tag**: Creates an annotated tag with release notes
5. **Pushes tag**: Pushes the tag to remote repository

## When to Use

Use this skill after you've:

- Merged a PR to develop
- Merged develop to main
- Deleted the remote feature branch

## Usage

Simply say: **"post-merge workflow"** or **"update repo after merge"**

The skill will:

- Ask for the feature branch name to delete (if needed)
- Ask for the tag version (e.g., v0.18.0)
- Ask for release notes content
- Execute all steps automatically

## Workflow Steps

### 1. Update Develop Branch

```bash
git checkout develop
git pull
```

### 2. Update Main Branch

```bash
git checkout main
git pull
```

### 3. Delete Local Feature Branch

```bash
git branch -d <feature-branch-name>
```

### 4. Create Annotated Tag

```bash
git tag -a <version> -m "<release-notes>"
```

### 5. Push Tag to Remote

```bash
git push --tags
```

**Automated GitHub Release**: Pushing the tag triggers `.github/workflows/release.yml` which automatically creates the GitHub Release using the tag message. No manual action required!

### 6. Verify GitHub Release (Automated)

The GitHub Actions workflow will automatically:

- Extract release notes from git tag message
- Create GitHub Release with proper formatting
- Add technical details and changelog links
- Publish the release

**Timeline**: Release created within 1-2 minutes after pushing the tag.

**Verification**: Check `https://github.com/<owner>/<repo>/releases`

## Tag Naming Convention

Follow semantic versioning:

- **Major version** (v1.0.0): Breaking changes
- **Minor version** (v0.18.0): New features, no breaking changes
- **Patch version** (v0.17.1): Bug fixes only

## Release Notes Template

```
v<version> - <Title>

## <Feature Category>

### <Subsection>
- <Change description>
- Performance: <metrics with ✅/❌ indicators>

### <Subsection>
- <Change description>

## <Another Category>

### <Subsection>
- <Change description>

## Files Changed
- <file1> (created/updated/deleted)
- <file2> (created/updated/deleted)

## Known Issues
- <Issue description>

## Related
- Commit: <commit-hash>
- Previous: <previous-tag>
```

## GitHub Release Template

**Title**: `v<version> - <Short Descriptive Title>`

**Description**:

```markdown
## 🚀 <Main Feature/Change>

Brief overview paragraph explaining what this release introduces.

## ✨ What's New

### <Feature Name>

Description of the feature and what it does.

**Usage**: How to use it

**What it does**:

1. ✅ Step 1
2. ✅ Step 2
3. ✅ Step 3

### Files Added/Changed

#### `path/to/file.md` (X lines)

- Description of what this file contains
- Key features or sections

## 💡 Benefits

- ✅ **Benefit 1**: Description
- ✅ **Benefit 2**: Description
- ✅ **Benefit 3**: Description

## 📋 Example Workflow

**Before** (old way):
\`\`\`bash

# Old commands

\`\`\`

**After** (new way):
\`\`\`

# New simplified approach

\`\`\`

## 🔗 Integration

How this integrates with existing project conventions and documentation.

## 📊 Metrics

- **Metric 1**: Value with ✅/❌ indicator
- **Metric 2**: Value with ✅/❌ indicator

## 🔧 Technical Details

**Commit**: <commit-hash>  
**Previous Release**: [v<prev>](link-to-previous-release)  
**Files Changed**: X files, Y insertions

## 📚 Documentation

- [Doc 1](link) - Description
- [Doc 2](link) - Description

---

**Full Changelog**: [v<prev>...v<current>](github-compare-link)
```

## Known Issues

- <Issue description>

## Related

- Commit: <commit-hash>
- Previous: <previous-tag>

```

## Example Release Notes

```

v0.18.0 - Next.js 16.2.4 Upgrade + Documentation Standards

## Next.js 16.2.4 Upgrade (Task 29)

### Security & Performance

- Upgraded from Next.js 14.x to 16.2.4
- Build time: ✅ 22% faster (3.2s → 2.5s)
- Bundle size: ✅ 1.6% smaller (185KB → 182KB)
- Lighthouse Score: ✅ +1 point (92 → 93)

### Compatibility

- next-intl 4.9.2 fully compatible
- Test suite: 88/91 passing (97%)

## Documentation Standards

### Performance Metrics Convention

- Standardized with ✅/❌ indicators
- Created documentation-conventions.md

## Files Changed

- NEXTJS-16-UPGRADE-SUMMARY.md (created)
- README.md (updated)
- CONTRIBUTING.md (updated)

## Related

- Commit: cacec59
- Previous: v0.17.0

````

## Tips

- Always verify you're on the correct branch before pulling
- Ensure the feature branch is fully merged before deleting
- Use descriptive tag messages for better release history
- Follow the metrics convention (✅/❌) in release notes
- Include commit hash and previous tag for traceability

## Error Handling

If you encounter issues:

**Branch not fully merged**:

```bash
git branch -D <branch-name>  # Force delete (use with caution)
````

**Tag already exists**:

```bash
git tag -d <tag-name>        # Delete local tag
git push --delete origin <tag-name>  # Delete remote tag
git tag -a <tag-name> -m "..."  # Recreate tag
git push --tags
```

**Conflicts during pull**:

```bash
git stash                    # Stash local changes
git pull                     # Pull remote changes
git stash pop                # Reapply local changes
```

## Related Documentation

- [GIT-WORKFLOW.md](../../docs/GIT-WORKFLOW.md) - Complete git workflow guide
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contributing guidelines
- [documentation-conventions.md](../steering/documentation-conventions.md) - Metrics convention
