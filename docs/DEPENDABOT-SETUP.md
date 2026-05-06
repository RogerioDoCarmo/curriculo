# Dependabot Configuration Guide

This document explains how Dependabot is configured in this repository to automatically manage dependency updates and security alerts.

## Overview

Dependabot is configured to:

1. **Automatically create pull requests** for dependency updates (weekly)
2. **Automatically create GitHub issues** for security vulnerabilities
3. **Group related updates** to reduce PR noise
4. **Target the `develop` branch** for all updates

## Configuration Files

### 1. `.github/dependabot.yml`

Main Dependabot configuration file that controls:

- **Update schedule**: Weekly on Mondays at 9:00 AM (São Paulo timezone)
- **Package ecosystems**: npm dependencies and GitHub Actions
- **PR limits**: Maximum 5 npm PRs and 3 GitHub Actions PRs open at once
- **Grouping**: Development and production dependencies grouped separately
- **Target branch**: All PRs target `develop` branch
- **Labels**: Automatic labeling with `dependencies` and `automated`
- **Commit messages**: Conventional commit format (`chore(deps):` prefix)

### 2. `.github/workflows/dependabot-auto-issue.yml`

Automatically creates GitHub issues when new Dependabot security alerts are detected.

**Triggers**: When a new vulnerability alert is created
**Permissions**: Read security events, write issues

**Features**:

- Creates detailed issues with severity, CVE, CVSS score
- Includes step-by-step fix instructions
- Adds appropriate priority labels (high/medium/low)
- Avoids duplicate issues
- Links to security advisories and CVE details

### 3. `.github/workflows/dependabot-sync-issues.yml`

Manual workflow to sync existing Dependabot alerts to GitHub issues.

**Triggers**: Manual workflow dispatch
**Permissions**: Read security events, write issues

**Features**:

- Can be run manually from GitHub Actions tab
- Filter by severity (all, critical, high, medium, low)
- Syncs all existing open alerts to issues
- Useful for initial setup or after configuration changes

## How It Works

### Automatic Security Issue Creation

1. **Dependabot detects a vulnerability** in a dependency
2. **GitHub creates a security alert** in the Security tab
3. **Workflow triggers automatically** (`dependabot-auto-issue.yml`)
4. **Issue is created** with:
   - Title: `🔒 [SEVERITY] Security vulnerability in package-name`
   - Labels: `security`, `dependabot`, `priority: high/medium/low`, `automated`
   - Body: Detailed information, fix instructions, and links
5. **You receive a notification** about the new issue

### Automatic Dependency Updates

1. **Dependabot checks for updates** every Monday at 9:00 AM
2. **Pull requests are created** for outdated dependencies
3. **PRs are grouped** by type (development vs production)
4. **PRs target `develop` branch** for review
5. **CI/CD runs automatically** on each PR
6. **You review and merge** when ready

## Initial Setup

### Step 1: Enable Dependabot Alerts

1. Go to your repository on GitHub
2. Click **Settings** → **Security** → **Code security and analysis**
3. Enable:
   - ✅ **Dependency graph**
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**

### Step 2: Sync Existing Alerts to Issues

Run the manual sync workflow to create issues for existing alerts:

1. Go to **Actions** tab
2. Select **Sync Dependabot Alerts to Issues** workflow
3. Click **Run workflow**
4. Choose severity filter (or select "all")
5. Click **Run workflow** button

This will create issues for all existing open Dependabot alerts.

### Step 3: Configure Notifications

1. Go to **Settings** → **Notifications**
2. Enable notifications for:
   - Issues (to receive security issue notifications)
   - Pull requests (to receive dependency update notifications)

## Issue and PR Labels

Issues and PRs created by Dependabot use these labels:

- **`security`**: Security-related issue or PR
- **`dependabot`**: Created by Dependabot automation
- **`dependencies`**: Dependency update PR
- **`automated`**: Automatically generated
- **`priority: high`**: Critical or high severity vulnerabilities
- **`priority: medium`**: Medium severity vulnerabilities
- **`priority: low`**: Low severity vulnerabilities

**Note**: The `dependencies` and `automated` labels must exist in your repository for Dependabot PRs to be labeled correctly. If you see a warning about missing labels, create them using:

```bash
gh label create "dependencies" --description "Dependency updates" --color "0366d6"
gh label create "automated" --description "Automatically generated" --color "ededed"
```

## Fixing Security Vulnerabilities

When a security issue is created, follow these steps:

### 1. Review the Issue

- Read the security advisory details
- Check the severity and CVSS score
- Review the vulnerable version range
- Identify the patched version

### 2. Update the Dependency

```bash
# Create a feature branch
git checkout -b fix/security-package-name

# Update the vulnerable package
npm install package-name@patched-version --save

# Or for dev dependencies
npm install package-name@patched-version --save-dev
```

### 3. Test the Update

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run type check
npm run type-check

# Build the project
npm run build
```

### 4. Commit and Push

```bash
# Stage changes
git add package.json package-lock.json

# Commit with conventional format
git commit -m "fix(deps): update package-name to X.Y.Z (security fix)"

# Push to remote
git push -u origin fix/security-package-name
```

### 5. Create Pull Request

```bash
# Create PR using GitHub CLI
gh pr create --base develop --title "fix(deps): update package-name to X.Y.Z (security fix)" --body "Fixes #ISSUE_NUMBER

## Security Fix

Updates \`package-name\` from vulnerable version to patched version X.Y.Z.

**Severity**: HIGH/MEDIUM/LOW
**CVE**: CVE-XXXX-XXXXX

## Testing

- [x] All unit tests pass
- [x] All E2E tests pass
- [x] Build succeeds
- [x] No breaking changes detected

Closes #ISSUE_NUMBER"
```

### 6. Verify and Close

After merging the PR:

1. Verify the Dependabot alert is automatically closed
2. Close the GitHub issue manually if needed
3. Monitor for any new alerts

## Customization

### Changing Update Schedule

Edit `.github/dependabot.yml`:

```yaml
schedule:
  interval: "daily" # Options: daily, weekly, monthly
  day: "monday" # For weekly: monday-sunday
  time: "09:00" # 24-hour format
  timezone: "America/Sao_Paulo"
```

### Ignoring Specific Dependencies

Add to `.github/dependabot.yml`:

```yaml
ignore:
  - dependency-name: "package-name"
    versions: ["1.x", "2.x"] # Ignore specific version ranges
```

### Changing PR Limits

Edit `.github/dependabot.yml`:

```yaml
open-pull-requests-limit: 10 # Increase from 5 to 10
```

### Changing Target Branch

Edit `.github/dependabot.yml`:

```yaml
target-branch: "main" # Change from develop to main
```

## Monitoring

### View Dependabot Alerts

1. Go to **Security** tab
2. Click **Dependabot alerts**
3. View all open and closed alerts

### View Dependabot Pull Requests

1. Go to **Pull requests** tab
2. Filter by label: `dependencies`
3. Review and merge PRs

### View Security Issues

1. Go to **Issues** tab
2. Filter by labels: `security` and `dependabot`
3. Review and fix vulnerabilities

## Troubleshooting

### Issue Not Created for Alert

**Problem**: Dependabot alert exists but no issue was created

**Solution**:

1. Check if issue already exists (search for alert number)
2. Run manual sync workflow: **Actions** → **Sync Dependabot Alerts to Issues**
3. Check workflow logs for errors

### Duplicate Issues

**Problem**: Multiple issues created for the same alert

**Solution**:

- The workflow checks for duplicates automatically
- If duplicates exist, close the newer ones manually
- The workflow uses "Alert #X" in the body to detect duplicates

### Workflow Not Triggering

**Problem**: New alerts don't trigger issue creation

**Solution**:

1. Verify Dependabot alerts are enabled in repository settings
2. Check workflow permissions: **Settings** → **Actions** → **General** → **Workflow permissions**
3. Ensure "Read and write permissions" is enabled
4. Re-run the workflow manually if needed

### PR Not Created

**Problem**: Dependabot doesn't create PRs for updates

**Solution**:

1. Check if PR limit is reached (max 5 npm PRs)
2. Verify `dependabot.yml` syntax is correct
3. Check Dependabot logs: **Insights** → **Dependency graph** → **Dependabot**
4. Ensure target branch (`develop`) exists

## Best Practices

1. **Review security issues promptly**: High and critical severity issues should be fixed within 24-48 hours
2. **Test thoroughly**: Always run full test suite before merging dependency updates
3. **Group updates**: Let Dependabot group minor/patch updates to reduce PR noise
4. **Monitor regularly**: Check Dependabot dashboard weekly for new alerts
5. **Keep dependencies updated**: Merge dependency update PRs regularly to avoid large breaking changes
6. **Document breaking changes**: If an update causes breaking changes, document them in the PR
7. **Use conventional commits**: Follow the commit message format for consistency

## Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Dependabot Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Security Advisories](https://github.com/advisories)
- [CVE Database](https://cve.mitre.org/)

## Support

If you encounter issues with Dependabot configuration:

1. Check the [GitHub Status](https://www.githubstatus.com/) page
2. Review [GitHub Community Discussions](https://github.com/orgs/community/discussions)
3. Contact GitHub Support if needed

---

**Last Updated**: May 5, 2026
**Maintained By**: Rogério do Carmo
