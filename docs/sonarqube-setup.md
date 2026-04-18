# SonarQube Cloud Setup Guide

This guide walks through setting up SonarQube Cloud integration for automated code quality analysis.

## Overview

SonarQube Cloud provides:

- **Code Quality Analysis**: Detect bugs, vulnerabilities, and code smells
- **Security Scanning**: Identify security hotspots and vulnerabilities
- **Coverage Tracking**: Monitor test coverage trends
- **Quality Gates**: Enforce quality standards before merging
- **PR Decoration**: Automatic quality gate status on pull requests

## Prerequisites

- GitHub account with admin access to the repository
- SonarQube Cloud account (free for public repositories)

## Step 1: Create SonarQube Cloud Account

1. Go to [SonarQube Cloud](https://sonarcloud.io/)
2. Click **"Log in"** → **"Sign up with GitHub"**
3. Authorize SonarQube Cloud to access your GitHub account
4. Complete the registration

## Step 2: Create Organization

1. After login, click **"+"** → **"Create new organization"**
2. Choose **"Import an organization from GitHub"**
3. Select your GitHub organization or personal account
4. Organization key will be auto-generated (e.g., `rogeriodocarmo`)
5. Click **"Continue"**

## Step 3: Create Project

1. Click **"Analyze new project"**
2. Select your repository: `RogerioDoCarmo/curriculo`
3. Click **"Set Up"**
4. Choose **"With GitHub Actions"** as the analysis method

## Step 4: Generate Token

1. SonarQube will prompt you to create a token
2. Enter a token name: `GitHub Actions CI`
3. Click **"Generate"**
4. **Copy the token** - you'll need it for GitHub Secrets

## Step 5: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

| Secret Name      | Value                   | Description                    |
| ---------------- | ----------------------- | ------------------------------ |
| `SONAR_TOKEN`    | (token from Step 4)     | SonarQube authentication token |
| `SONAR_HOST_URL` | `https://sonarcloud.io` | SonarQube Cloud URL            |

## Step 6: Update sonar-project.properties

Edit `sonar-project.properties` with your actual values:

```properties
# Replace with your actual values
sonar.projectKey=RogerioDoCarmo_curriculo
sonar.organization=rogeriodocarmo  # Your SonarQube organization key
```

## Step 7: Verify CI Integration

The SonarQube analysis job is already configured in `.github/workflows/ci.yml`. It will:

1. Run after tests complete
2. Upload coverage reports
3. Analyze code quality
4. Check quality gate status
5. Comment on PRs with analysis results

## Quality Gate Configuration

### Default Quality Gate

SonarQube Cloud uses the "Sonar way" quality gate by default:

- **Coverage**: ≥ 80% on new code
- **Duplications**: ≤ 3% on new code
- **Maintainability Rating**: A on new code
- **Reliability Rating**: A on new code
- **Security Rating**: A on new code

### Custom Quality Gate (Recommended)

For stricter standards, create a custom quality gate:

1. Go to **Quality Gates** in SonarQube Cloud
2. Click **"Create"**
3. Name it: `Personal Resume Website`
4. Add conditions:

| Metric                     | Operator        | Value |
| -------------------------- | --------------- | ----- |
| Coverage                   | is less than    | 90%   |
| Duplicated Lines (%)       | is greater than | 3%    |
| Maintainability Rating     | is worse than   | A     |
| Reliability Rating         | is worse than   | A     |
| Security Rating            | is worse than   | A     |
| Security Hotspots Reviewed | is less than    | 100%  |
| Blocker Issues             | is greater than | 0     |
| Critical Issues            | is greater than | 0     |

5. Click **"Save"**
6. Go to your project → **Administration → Quality Gate**
7. Select your custom quality gate

## Troubleshooting

### Analysis Fails with "Shallow Clone"

**Error**: `Shallow clone detected, no blame information will be provided`

**Solution**: The CI workflow already configures `fetch-depth: 0` to fetch full history.

### Coverage Not Showing

**Error**: Coverage is 0% in SonarQube

**Solution**:

1. Verify `coverage/lcov.info` is generated: `npm run test:coverage`
2. Check `sonar.javascript.lcov.reportPaths` in `sonar-project.properties`
3. Ensure coverage job runs before SonarQube analysis

### Quality Gate Fails

**Error**: Quality gate status is FAILED

**Solution**:

1. Check SonarQube dashboard for specific issues
2. Fix code smells, bugs, or vulnerabilities
3. Increase test coverage if below threshold
4. Re-run analysis after fixes

### Token Expired

**Error**: `401 Unauthorized`

**Solution**:

1. Generate a new token in SonarQube Cloud
2. Update `SONAR_TOKEN` secret in GitHub
3. Re-run the workflow

## Viewing Results

### In SonarQube Cloud

1. Go to [SonarQube Cloud](https://sonarcloud.io/)
2. Select your project
3. View:
   - **Overview**: Summary of issues and coverage
   - **Issues**: Detailed list of bugs, vulnerabilities, code smells
   - **Security Hotspots**: Security-sensitive code to review
   - **Measures**: Metrics and trends over time
   - **Code**: Browse code with inline annotations

### In GitHub PRs

SonarQube will automatically:

- Add a status check to PRs
- Comment with analysis summary
- Block merge if quality gate fails (when branch protection is enabled)

## Branch Protection

To enforce SonarQube quality gate:

1. Go to **Settings → Branches → Branch protection rules**
2. Edit rule for `develop` or `main`
3. Under **"Require status checks to pass before merging"**
4. Select: `SonarCloud Code Analysis`
5. Save changes

Now PRs cannot be merged if SonarQube analysis fails.

## Monitoring

### Quality Trends

Track quality over time:

- **Activity**: View analysis history
- **Measures**: See metric trends (coverage, duplications, etc.)
- **New Code**: Focus on quality of recent changes

### Badges

Add SonarQube badges to README.md:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=coverage)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=bugs)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
```

## Best Practices

1. **Fix Issues Early**: Address issues as they appear, don't let them accumulate
2. **Review Security Hotspots**: Manually review all security-sensitive code
3. **Maintain Coverage**: Keep coverage above 90% for new code
4. **Monitor Trends**: Check quality trends regularly
5. **Update Quality Gate**: Adjust thresholds as project matures

## Next Steps

After SonarQube is set up:

- Task 21.4: Create deployment workflow
- Task 21.5: Configure Vercel project
- Task 21.6: Set up domain configuration

## References

- [SonarQube Cloud Documentation](https://docs.sonarcloud.io/)
- [GitHub Actions Integration](https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/github-actions/)
- [Quality Gates](https://docs.sonarcloud.io/improving/quality-gates/)
