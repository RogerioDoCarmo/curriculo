---
inclusion: auto
description: Standards for creating and formatting pull request and release descriptions with copyable text
---

# PR and Release Conventions

Rules for creating and formatting pull request and release descriptions.

## Standard Behavior

When the user asks for PR title and description or release notes:

1. **Always provide copyable text directly in the chat**
2. **Format as plain text blocks** (not markdown files)
3. **Separate title and description clearly**
4. **Use markdown formatting in the description**
5. **Include emojis for visual scanning**
6. **Keep title under 70 characters**
7. **Make description scannable with headers and checkboxes**

## PR Title Format

```
<type>: <short description>
```

**Types**: `fix`, `feat`, `docs`, `test`, `chore`, `refactor`, `perf`, `style`, `ci`

**Examples**:

- `fix: UI state synchronization and PWA manifest implementation`
- `feat: add Progressive Web App support with customized shortcuts`
- `docs: add comprehensive testing conventions for TypeScript`

## PR Description Structure

```markdown
## Summary

Brief overview (1-2 sentences)

## Issues Fixed

### 1. Issue Name

- **Problem**: What was wrong
- **Solution**: How it was fixed
- **Result**: What changed

## Changes Made

### Bug Fixes

- ✅ Item 1
- ✅ Item 2

### Features

- ✅ Item 1
- ✅ Item 2

### Documentation

- ✅ Item 1
- ✅ Item 2

## Testing

- ✅ Test results
- ✅ Build status

## Benefits

### User Experience

- ✅ Benefit 1

### Technical

- ✅ Benefit 1

## Verification Steps

**Feature 1**: Step-by-step verification

## Related Requirements

- Requirement X.Y: Description

## Breaking Changes

None. / List of breaking changes

## Checklist

- [x] Item 1
- [x] Item 2
```

## Release Notes Format

```markdown
# Release vX.Y.Z

## 🎉 Highlights

Key features and improvements

## 🐛 Bug Fixes

- Fixed issue 1
- Fixed issue 2

## ✨ Features

- Added feature 1
- Added feature 2

## 📝 Documentation

- Updated doc 1
- Added doc 2

## 🧪 Testing

- Test improvements

## 🔧 Technical Changes

- Internal improvements

## 📦 Dependencies

- Updated package 1
- Updated package 2

## ⚠️ Breaking Changes

None. / List of breaking changes

## 🔗 Links

- [Full Changelog](link)
- [Documentation](link)
```

## Best Practices

### Titles

- Keep under 70 characters
- Use imperative mood ("add" not "added")
- Be specific but concise
- Use conventional commit format

### Descriptions

- Use emojis for visual scanning (✅ ❌ 🎉 🐛 ✨ 📝 🧪 🔧 📦 ⚠️)
- Group related changes
- Include verification steps
- Link to requirements/issues
- State breaking changes clearly
- Use checkboxes for checklists

### Content

- Focus on user impact first
- Include technical details second
- Provide verification steps
- Link to related documentation
- Be honest about limitations

### Formatting

- Use headers (##, ###) for structure
- Use bold for emphasis
- Use code blocks for commands
- Use lists for multiple items
- Use tables for comparisons

## Examples

See:

- `PR-51-GITHUB-DESCRIPTION.txt` - Example PR description
- `POST-MERGE-v1.0.0-SUMMARY.md` - Example release notes
