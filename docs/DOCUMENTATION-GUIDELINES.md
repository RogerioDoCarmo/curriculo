# Documentation Guidelines

**Last Updated**: May 7, 2026

This document provides guidelines for creating and organizing documentation in this project.

---

## 📁 Directory Structure

All documentation must be placed in the appropriate subdirectory under `docs/`:

```
docs/
├── README.md                          # Documentation index (DO NOT MODIFY without updating links)
├── DOCUMENTATION-GUIDELINES.md        # This file
├── releases/                          # Release notes and summaries
├── development/                       # Development guides and workflows
├── deployment/                        # Deployment and infrastructure docs
├── testing/                          # Testing guides and summaries
├── fixes/                            # Bug fixes and optimization summaries
├── upgrades/                         # Upgrade guides and checklists
└── [root docs/]                      # Security, performance, and project-wide docs
```

---

## 📝 File Placement Rules

### When Creating New Documentation

**ALWAYS** place new documentation files in the appropriate category folder:

| Document Type          | Location            | Examples                                                 |
| ---------------------- | ------------------- | -------------------------------------------------------- |
| **Release Notes**      | `docs/releases/`    | RELEASE-NOTES-v1.3.0.md, RELEASE-v1.3.0-SUMMARY.md       |
| **PR Summaries**       | `docs/releases/`    | PR-103-SUMMARY.md, PR-103-DESCRIPTION.md                 |
| **Development Guides** | `docs/development/` | GIT-WORKFLOW.md, CODING-STANDARDS.md                     |
| **Git/Branch Guides**  | `docs/development/` | BRANCH-STRATEGY.md, COMMIT-CONVENTIONS.md                |
| **Deployment Guides**  | `docs/deployment/`  | VERCEL-DEPLOYMENT.md, STATIC-EXPORT.md                   |
| **Infrastructure**     | `docs/deployment/`  | CDN-SETUP.md, DOMAIN-CONFIGURATION.md                    |
| **Testing Guides**     | `docs/testing/`     | E2E-TESTING.md, UNIT-TESTING.md                          |
| **Test Reports**       | `docs/testing/`     | TEST-RESULTS-v1.3.0.md, COVERAGE-REPORT.md               |
| **Bug Fix Summaries**  | `docs/fixes/`       | BUG-123-FIX.md, HYDRATION-FIX.md                         |
| **Optimization Docs**  | `docs/fixes/`       | BUNDLE-SIZE-OPTIMIZATION.md, PERFORMANCE-IMPROVEMENTS.md |
| **Task Summaries**     | `docs/fixes/`       | TASK-45-SUMMARY.md, FEATURE-X-IMPLEMENTATION.md          |
| **Upgrade Guides**     | `docs/upgrades/`    | NEXTJS-17-UPGRADE.md, REACT-19-MIGRATION.md              |
| **Migration Docs**     | `docs/upgrades/`    | TYPESCRIPT-5-MIGRATION.md, TAILWIND-4-UPGRADE.md         |
| **Security Docs**      | `docs/` (root)      | DEPENDABOT-_.md, SECURITY-UPDATE-_.md                    |
| **Performance Docs**   | `docs/` (root)      | PERFORMANCE-\*.md, LCP-OPTIMIZATION.md                   |
| **Project-Wide Docs**  | `docs/` (root)      | ARCHITECTURE.md, TECH-STACK.md                           |

---

## 🚫 What NOT to Do

### ❌ DO NOT Create Documentation in Project Root

**WRONG**:

```
/RELEASE-NOTES-v1.3.0.md          ❌ Root directory
/MY-NEW-FEATURE-GUIDE.md           ❌ Root directory
/BUG-FIX-SUMMARY.md                ❌ Root directory
```

**CORRECT**:

```
docs/releases/RELEASE-NOTES-v1.3.0.md      ✅ Proper location
docs/development/MY-NEW-FEATURE-GUIDE.md   ✅ Proper location
docs/fixes/BUG-FIX-SUMMARY.md              ✅ Proper location
```

### ❌ DO NOT Mix Categories

Each document should be in ONE category only. If a document covers multiple topics, choose the primary category.

---

## 📋 Naming Conventions

### File Names

Use descriptive, kebab-case names with appropriate prefixes:

| Prefix           | Usage               | Example                         |
| ---------------- | ------------------- | ------------------------------- |
| `RELEASE-NOTES-` | Release notes       | `RELEASE-NOTES-v1.3.0.md`       |
| `RELEASE-`       | Release summaries   | `RELEASE-v1.3.0-SUMMARY.md`     |
| `PR-`            | Pull request docs   | `PR-103-SUMMARY.md`             |
| `TASK-`          | Task summaries      | `TASK-45-SUMMARY.md`            |
| `NEXTJS-`        | Next.js specific    | `NEXTJS-17-UPGRADE.md`          |
| `DEPENDABOT-`    | Dependabot/security | `DEPENDABOT-ALERTS-STATUS.md`   |
| `PERFORMANCE-`   | Performance docs    | `PERFORMANCE-OPTIMIZATION.md`   |
| No prefix        | General guides      | `TESTING.md`, `CONTRIBUTING.md` |

### Suffixes

| Suffix       | Usage                 | Example                       |
| ------------ | --------------------- | ----------------------------- |
| `-GUIDE`     | Step-by-step guides   | `DEPLOYMENT-GUIDE.md`         |
| `-SUMMARY`   | Summary documents     | `RELEASE-v1.3.0-SUMMARY.md`   |
| `-CHECKLIST` | Checklists            | `DEPLOYMENT-CHECKLIST.md`     |
| `-STATUS`    | Status reports        | `DEPENDABOT-ALERTS-STATUS.md` |
| `-REPORT`    | Test/analysis reports | `COVERAGE-REPORT.md`          |

---

## 🔄 When Creating New Documentation

### Step 1: Determine Category

Ask yourself:

- Is this about a release? → `docs/releases/`
- Is this about development workflow? → `docs/development/`
- Is this about deployment? → `docs/deployment/`
- Is this about testing? → `docs/testing/`
- Is this about a bug fix or optimization? → `docs/fixes/`
- Is this about an upgrade or migration? → `docs/upgrades/`
- Is this about security or performance? → `docs/` (root)

### Step 2: Choose Appropriate Name

Follow the naming conventions above.

### Step 3: Create File in Correct Location

```bash
# CORRECT
touch docs/releases/RELEASE-NOTES-v1.3.0.md
touch docs/fixes/HYDRATION-BUG-FIX.md
touch docs/upgrades/NEXTJS-17-UPGRADE-GUIDE.md

# WRONG
touch RELEASE-NOTES-v1.3.0.md           # ❌ Root directory
touch docs/HYDRATION-BUG-FIX.md         # ❌ Wrong category
```

### Step 4: Update docs/README.md

Add a link to your new document in the appropriate section of `docs/README.md`.

---

## 📚 Document Structure

### Required Sections

Every documentation file should include:

1. **Title** - Clear, descriptive title
2. **Metadata** - Date, author, version, etc.
3. **Summary** - Brief overview (2-3 sentences)
4. **Content** - Main documentation content
5. **Related Links** - Links to related docs

### Example Template

```markdown
# Document Title

**Date**: May 7, 2026  
**Author**: Your Name  
**Version**: 1.0.0  
**Related**: [Link to related doc](./RELATED-DOC.md)

---

## Summary

Brief 2-3 sentence overview of what this document covers.

---

## Content

Main documentation content here...

---

## Related Documentation

- [Related Doc 1](./RELATED-DOC-1.md)
- [Related Doc 2](./RELATED-DOC-2.md)

---

**Last Updated**: May 7, 2026  
**Maintained By**: Team Name
```

---

## 🤖 AI Agent Instructions

When generating documentation as an AI agent:

1. **ALWAYS** determine the correct category first
2. **ALWAYS** create files in the appropriate `docs/` subdirectory
3. **NEVER** create documentation files in the project root
4. **ALWAYS** follow naming conventions
5. **ALWAYS** update `docs/README.md` with a link to the new document
6. **ALWAYS** include proper metadata (date, author, version)
7. **ALWAYS** add related links to other relevant documentation

### Example AI Workflow

```
User: "Create documentation for the Next.js 17 upgrade"

AI Decision Process:
1. Category: Upgrade guide → docs/upgrades/
2. Name: NEXTJS-17-UPGRADE-GUIDE.md
3. Full path: docs/upgrades/NEXTJS-17-UPGRADE-GUIDE.md
4. Create file with proper structure
5. Update docs/README.md with link
```

---

## 🔍 Finding Documentation

### Use docs/README.md

The `docs/README.md` file is the central index. Always check there first.

### Search by Category

```bash
# Find all release docs
ls docs/releases/

# Find all testing docs
ls docs/testing/

# Find all upgrade guides
ls docs/upgrades/
```

### Search by Name

```bash
# Find all Next.js related docs
find docs -name "*NEXTJS*"

# Find all release notes
find docs -name "RELEASE-NOTES-*"

# Find all summaries
find docs -name "*SUMMARY*"
```

---

## ✅ Checklist for New Documentation

Before committing new documentation:

- [ ] File is in the correct `docs/` subdirectory
- [ ] File name follows naming conventions
- [ ] File includes required metadata (date, author, version)
- [ ] File has clear title and summary
- [ ] File includes related links
- [ ] `docs/README.md` has been updated with a link
- [ ] File is NOT in the project root directory
- [ ] Commit message mentions documentation update

---

## 🚨 Common Mistakes to Avoid

### 1. Creating Files in Root

```bash
# ❌ WRONG
touch RELEASE-NOTES-v1.3.0.md

# ✅ CORRECT
touch docs/releases/RELEASE-NOTES-v1.3.0.md
```

### 2. Wrong Category

```bash
# ❌ WRONG - Release note in fixes folder
touch docs/fixes/RELEASE-NOTES-v1.3.0.md

# ✅ CORRECT
touch docs/releases/RELEASE-NOTES-v1.3.0.md
```

### 3. Inconsistent Naming

```bash
# ❌ WRONG - Inconsistent naming
touch docs/releases/release_notes_v1.3.0.md
touch docs/releases/ReleaseNotesV1.3.0.md

# ✅ CORRECT - Consistent kebab-case
touch docs/releases/RELEASE-NOTES-v1.3.0.md
```

### 4. Forgetting to Update Index

Always update `docs/README.md` when adding new documentation!

---

## 📞 Questions?

If you're unsure where to place a document:

1. Check `docs/README.md` for similar documents
2. Look at existing files in each category
3. Choose the category that best fits the primary purpose
4. When in doubt, ask the team or check this guide

---

## 🔄 Maintenance

This guide should be updated when:

- New documentation categories are added
- Naming conventions change
- New document types are introduced
- Best practices evolve

---

**Last Updated**: May 7, 2026  
**Maintained By**: Development Team  
**Repository**: RogerioDoCarmo/curriculo
