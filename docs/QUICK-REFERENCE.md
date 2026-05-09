# Documentation Quick Reference

**Quick guide for placing new documentation files**

---

## 📁 Where to Put New Docs

| Document Type        | Location            | Example                   |
| -------------------- | ------------------- | ------------------------- |
| 🚀 **Release notes** | `docs/releases/`    | `RELEASE-NOTES-v1.3.0.md` |
| 📝 **PR summaries**  | `docs/releases/`    | `PR-103-SUMMARY.md`       |
| 💻 **Dev guides**    | `docs/development/` | `GIT-WORKFLOW.md`         |
| 🚢 **Deployment**    | `docs/deployment/`  | `VERCEL-SETUP.md`         |
| 🧪 **Testing**       | `docs/testing/`     | `E2E-TESTING.md`          |
| 🔧 **Bug fixes**     | `docs/fixes/`       | `BUG-123-FIX.md`          |
| ⬆️ **Upgrades**      | `docs/upgrades/`    | `NEXTJS-17-UPGRADE.md`    |
| 🔒 **Security**      | `docs/` (root)      | `DEPENDABOT-*.md`         |
| ⚡ **Performance**   | `docs/` (root)      | `PERFORMANCE-*.md`        |

---

## 🚫 NEVER Create Docs in Project Root

```bash
# ❌ WRONG
touch RELEASE-NOTES-v1.3.0.md
touch MY-GUIDE.md

# ✅ CORRECT
touch docs/releases/RELEASE-NOTES-v1.3.0.md
touch docs/development/MY-GUIDE.md
```

---

## ✅ Quick Checklist

- [ ] File is in correct `docs/` subdirectory
- [ ] File name follows conventions (kebab-case)
- [ ] Updated `docs/README.md` with link
- [ ] NOT in project root

---

**Full Guidelines**: [DOCUMENTATION-GUIDELINES.md](DOCUMENTATION-GUIDELINES.md)
