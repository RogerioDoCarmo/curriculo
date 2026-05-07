# Documentation Index

This directory contains all project documentation organized by category.

## 📁 Directory Structure

```
docs/
├── README.md                          # This file
├── releases/                          # Release notes and summaries
├── development/                       # Development guides and workflows
├── deployment/                        # Deployment and infrastructure docs
├── testing/                          # Testing guides and summaries
├── fixes/                            # Bug fixes and optimization summaries
├── upgrades/                         # Upgrade guides and checklists
├── DEPENDABOT-*.md                   # Dependabot and security docs
├── LCP-IMAGE-OPTIMIZATION.md         # Performance optimization
├── NEXTJS-16.2.6-SECURITY-UPDATE.md  # Latest security update
└── PERFORMANCE-FIXES-SUMMARY.md      # Performance improvements
```

---

## 📚 Documentation Categories

### 🚀 Releases (`releases/`)

Release notes, summaries, and PR descriptions for all versions.

| Document                                                              | Description                   |
| --------------------------------------------------------------------- | ----------------------------- |
| [RELEASE-NOTES-v1.2.0.md](releases/RELEASE-NOTES-v1.2.0.md)           | Release notes for v1.2.0      |
| [RELEASE-v1.2.0-SUMMARY.md](releases/RELEASE-v1.2.0-SUMMARY.md)       | Summary for v1.2.0            |
| [RELEASE-NOTES-v1.1.0.md](releases/RELEASE-NOTES-v1.1.0.md)           | Release notes for v1.1.0      |
| [RELEASE-v1.1.0-SUMMARY.md](releases/RELEASE-v1.1.0-SUMMARY.md)       | Summary for v1.1.0            |
| [RELEASE-ASSETS-v1.0.0.md](releases/RELEASE-ASSETS-v1.0.0.md)         | Release assets for v1.0.0     |
| [POST-MERGE-v1.0.0-SUMMARY.md](releases/POST-MERGE-v1.0.0-SUMMARY.md) | Post-merge summary for v1.0.0 |
| [PR-51-SUMMARY.md](releases/PR-51-SUMMARY.md)                         | PR #51 summary                |
| [PR-51-UPDATED-DESCRIPTION.md](releases/PR-51-UPDATED-DESCRIPTION.md) | PR #51 updated description    |

### 💻 Development (`development/`)

Development workflows, Git setup, and contribution guidelines.

| Document                                                             | Description             |
| -------------------------------------------------------------------- | ----------------------- |
| [CONTRIBUTING.md](development/CONTRIBUTING.md)                       | Contribution guidelines |
| [COMMANDS.md](development/COMMANDS.md)                               | Available npm commands  |
| [GIT-WORKFLOW-SUMMARY.md](development/GIT-WORKFLOW-SUMMARY.md)       | Git workflow guide      |
| [GIT-SETUP-VERIFICATION.md](development/GIT-SETUP-VERIFICATION.md)   | Git setup verification  |
| [BRANCH-PROTECTION-GUIDE.md](development/BRANCH-PROTECTION-GUIDE.md) | Branch protection setup |

### 🚢 Deployment (`deployment/`)

Deployment guides, Vercel setup, and static generation.

| Document                                                                | Description                 |
| ----------------------------------------------------------------------- | --------------------------- |
| [VERCEL-SETUP-GUIDE.md](deployment/VERCEL-SETUP-GUIDE.md)               | Complete Vercel setup guide |
| [VERCEL-SETUP-CHECKLIST.md](deployment/VERCEL-SETUP-CHECKLIST.md)       | Vercel setup checklist      |
| [STATIC-GENERATION-SUMMARY.md](deployment/STATIC-GENERATION-SUMMARY.md) | Static generation summary   |

### 🧪 Testing (`testing/`)

Testing guides, E2E optimization, and coverage notes.

| Document                                                           | Description              |
| ------------------------------------------------------------------ | ------------------------ |
| [TESTING.md](testing/TESTING.md)                                   | Complete testing guide   |
| [SONARQUBE-COVERAGE-NOTE.md](testing/SONARQUBE-COVERAGE-NOTE.md)   | SonarQube coverage notes |
| [E2E-LOCALE-FIX-SUMMARY.md](testing/E2E-LOCALE-FIX-SUMMARY.md)     | E2E locale fix summary   |
| [E2E-OPTIMIZATION-SUMMARY.md](testing/E2E-OPTIMIZATION-SUMMARY.md) | E2E optimization summary |

### 🔧 Fixes (`fixes/`)

Bug fixes, optimizations, and task summaries.

| Document                                                                     | Description                 |
| ---------------------------------------------------------------------------- | --------------------------- |
| [CI-FIXES-SUMMARY.md](fixes/CI-FIXES-SUMMARY.md)                             | CI fixes summary            |
| [LANGUAGE-SELECTOR-SYNC-FIX.md](fixes/LANGUAGE-SELECTOR-SYNC-FIX.md)         | Language selector sync fix  |
| [THEME-ICON-SYNC-FIX.md](fixes/THEME-ICON-SYNC-FIX.md)                       | Theme icon sync fix         |
| [UI-STATE-SYNCHRONIZATION-FIXES.md](fixes/UI-STATE-SYNCHRONIZATION-FIXES.md) | UI state sync fixes         |
| [PWA-MANIFEST-IMPLEMENTATION.md](fixes/PWA-MANIFEST-IMPLEMENTATION.md)       | PWA manifest implementation |
| [BUNDLE-OPTIMIZATION.md](fixes/BUNDLE-OPTIMIZATION.md)                       | Bundle optimization         |
| [TASK-\*.md](fixes/)                                                         | Various task summaries      |

### ⬆️ Upgrades (`upgrades/`)

Upgrade guides, checklists, and migration docs.

| Document                                                                  | Description                  |
| ------------------------------------------------------------------------- | ---------------------------- |
| [NEXTJS-16-UPGRADE-SUMMARY.md](upgrades/NEXTJS-16-UPGRADE-SUMMARY.md)     | Next.js 16 upgrade summary   |
| [NEXTJS-16-UPGRADE-STATUS.md](upgrades/NEXTJS-16-UPGRADE-STATUS.md)       | Next.js 16 upgrade status    |
| [NEXTJS-16-UPGRADE-CHECKLIST.md](upgrades/NEXTJS-16-UPGRADE-CHECKLIST.md) | Next.js 16 upgrade checklist |
| [NEXTJS-16-CODE-CHANGES.md](upgrades/NEXTJS-16-CODE-CHANGES.md)           | Next.js 16 code changes      |

### 🔒 Security (root `docs/`)

Security updates, Dependabot alerts, and vulnerability fixes.

| Document                                                               | Description                               |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| [NEXTJS-16.2.6-SECURITY-UPDATE.md](NEXTJS-16.2.6-SECURITY-UPDATE.md)   | Next.js 16.2.6 security update (13 fixes) |
| [DEPENDABOT-VULNERABILITIES-FIX.md](DEPENDABOT-VULNERABILITIES-FIX.md) | Dependabot vulnerabilities fix            |
| [DEPENDABOT-FIX-SUMMARY.md](DEPENDABOT-FIX-SUMMARY.md)                 | Dependabot fix summary                    |
| [DEPENDABOT-ALERTS-STATUS.md](DEPENDABOT-ALERTS-STATUS.md)             | Current Dependabot alerts status          |
| [DEPENDABOT-SETUP.md](DEPENDABOT-SETUP.md)                             | Dependabot setup guide                    |
| [RELEASE-v1.2.3-SUMMARY.md](RELEASE-v1.2.3-SUMMARY.md)                 | Release v1.2.3 summary (security)         |

### ⚡ Performance (root `docs/`)

Performance optimization guides and summaries.

| Document                                                     | Description                  |
| ------------------------------------------------------------ | ---------------------------- |
| [PERFORMANCE-FIXES-SUMMARY.md](PERFORMANCE-FIXES-SUMMARY.md) | Performance fixes summary    |
| [LCP-IMAGE-OPTIMIZATION.md](LCP-IMAGE-OPTIMIZATION.md)       | LCP image optimization guide |

---

## 🔍 Quick Links

### Latest Updates

- [Next.js 16.2.6 Security Update](NEXTJS-16.2.6-SECURITY-UPDATE.md) - 13 critical security fixes
- [Release v1.2.3 Summary](RELEASE-v1.2.3-SUMMARY.md) - Latest release
- [Dependabot Alerts Status](DEPENDABOT-ALERTS-STATUS.md) - Current security status

### Getting Started

- [Contributing Guide](development/CONTRIBUTING.md)
- [Commands Reference](development/COMMANDS.md)
- [Git Workflow](development/GIT-WORKFLOW-SUMMARY.md)

### Deployment

- [Vercel Setup Guide](deployment/VERCEL-SETUP-GUIDE.md)
- [Static Generation](deployment/STATIC-GENERATION-SUMMARY.md)

### Testing

- [Testing Guide](testing/TESTING.md)
- [E2E Optimization](testing/E2E-OPTIMIZATION-SUMMARY.md)

---

## 📝 Document Naming Conventions

- **RELEASE-\*.md** - Release notes and summaries
- **DEPENDABOT-\*.md** - Security and dependency management
- **NEXTJS-\*.md** - Next.js specific documentation
- **TASK-\*.md** - Task-specific summaries
- **PR-\*.md** - Pull request summaries
- **\*-SUMMARY.md** - Summary documents
- **\*-GUIDE.md** - Step-by-step guides
- **\*-CHECKLIST.md** - Checklists

---

## 🔄 Maintenance

This documentation is actively maintained. When adding new documentation:

1. Place it in the appropriate category folder
2. Update this README.md with a link
3. Follow the naming conventions
4. Include a clear description

---

**Last Updated**: May 7, 2026  
**Maintained By**: Development Team  
**Repository**: RogerioDoCarmo/curriculo
