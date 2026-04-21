# Branch Protection Configuration Guide

This guide provides step-by-step instructions for configuring branch protection rules on GitHub for the personal resume website repository.

## Repository Information

- **Repository URL**: https://github.com/RogerioDoCarmo/curriculo
- **Protected Branch**: `main`
- **Development Branch**: `develop`

## Prerequisites

- Repository owner or admin access to the GitHub repository
- Repository must be pushed to GitHub (✓ Already completed)

## Branch Protection Rules Configuration

### Step 1: Access Branch Protection Settings

1. Navigate to your repository on GitHub: https://github.com/RogerioDoCarmo/curriculo
2. Click on **Settings** tab
3. In the left sidebar, click on **Branches** under "Code and automation"
4. Under "Branch protection rules", click **Add rule** or **Add branch protection rule**

### Step 2: Configure Main Branch Protection

#### Basic Settings

1. **Branch name pattern**: Enter `main`
2. Enable the following protection rules:

#### Required Settings (Aligned with Requirements 15.1 and 15.4)

**Require a pull request before merging**

- ✓ Enable this option
- **Required number of approvals before merging**: Set to `1` (minimum)
  - For team projects, consider `2` approvals
- ✓ **Dismiss stale pull request approvals when new commits are pushed**
  - This ensures reviewers see the latest changes
- ✓ **Require review from Code Owners** (optional, if CODEOWNERS file exists)

**Require status checks to pass before merging**

- ✓ Enable this option
- ✓ **Require branches to be up to date before merging**
- **Status checks that are required**:
  - Search and add: `build`
  - Search and add: `test`
  - Search and add: `lint`
  - Search and add: `type-check`
  - These checks are defined in `.github/workflows/ci.yml`

**Require conversation resolution before merging**

- ✓ Enable this option
- Ensures all review comments are addressed before merging

**Require signed commits** (Optional but recommended)

- ✓ Enable for enhanced security
- Requires contributors to sign their commits with GPG keys

**Require linear history** (Optional)

- ✓ Enable to prevent merge commits
- Enforces rebase or squash merging only

**Include administrators**

- ✓ Enable to apply rules to repository administrators
- Recommended for consistency

**Restrict who can push to matching branches** (Optional)

- Configure if you want to limit who can push directly
- Useful for larger teams

**Allow force pushes**

- ✗ Keep disabled (default)
- Prevents rewriting history on protected branch

**Allow deletions**

- ✗ Keep disabled (default)
- Prevents accidental deletion of the main branch

### Step 3: Save Protection Rules

1. Scroll to the bottom of the page
2. Click **Create** or **Save changes**

### Step 4: Verify Configuration

1. Navigate to **Settings** > **Branches**
2. Verify that `main` appears under "Branch protection rules"
3. Click **Edit** to review the configured settings

## Additional Recommended Configurations

### Configure Develop Branch Protection (Optional)

For a more robust workflow, consider protecting the `develop` branch as well:

1. Follow the same steps as above
2. Use branch name pattern: `develop`
3. Apply similar rules but with potentially fewer restrictions:
   - Require pull request reviews: `1` approval
   - Require status checks to pass
   - Allow force pushes: Disabled

### Set Up CODEOWNERS File (Optional)

Create a `.github/CODEOWNERS` file to automatically request reviews from specific team members:

```
# Default owners for everything in the repo
* @RogerioDoCarmo

# Frontend components
/components/ @RogerioDoCarmo

# CI/CD workflows
/.github/workflows/ @RogerioDoCarmo

# Configuration files
*.config.js @RogerioDoCarmo
*.config.ts @RogerioDoCarmo
```

### Configure Merge Button Settings

1. Go to **Settings** > **General**
2. Scroll to "Pull Requests" section
3. Configure merge options:
   - ✓ **Allow squash merging** (recommended)
   - ✓ **Allow rebase merging** (optional)
   - ✗ **Allow merge commits** (optional, disable for linear history)
   - ✓ **Automatically delete head branches** (recommended)

## Workflow After Configuration

### Creating a Pull Request

1. Create a feature branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub:
   - Navigate to the repository
   - Click "Compare & pull request"
   - Fill in the PR description
   - Request reviewers
   - Wait for CI checks to pass
   - Wait for required approvals

5. Merge the Pull Request:
   - Once approved and checks pass, click "Squash and merge" or "Rebase and merge"
   - Delete the feature branch after merging

### Handling Failed Status Checks

If CI checks fail:

1. Review the failed check details in the PR
2. Fix the issues locally on your feature branch
3. Commit and push the fixes:
   ```bash
   git add .
   git commit -m "fix: resolve CI issues"
   git push origin feature/your-feature-name
   ```
4. CI will automatically re-run
5. Request re-review if needed (if "Dismiss stale approvals" is enabled)

## Verification Checklist

After configuring branch protection, verify:

- [ ] Cannot push directly to `main` branch
- [ ] Pull requests require at least 1 approval
- [ ] CI status checks must pass before merging
- [ ] All conversations must be resolved before merging
- [ ] Stale approvals are dismissed when new commits are pushed
- [ ] Branch protection applies to administrators
- [ ] Force pushes are disabled on `main`
- [ ] Branch deletion is disabled on `main`

## Testing Branch Protection

To test that branch protection is working:

1. Try to push directly to main (should fail):

   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test: direct push"
   git push origin main
   ```

   Expected result: Push should be rejected

2. Create a PR and try to merge without approval (should fail)
3. Create a PR and try to merge with failing CI checks (should fail)

## Troubleshooting

### Issue: Status checks not appearing

**Solution**:

- Ensure CI workflow has run at least once on the branch
- Check that workflow names in `.github/workflows/ci.yml` match the required status checks
- Wait a few minutes for GitHub to register the checks

### Issue: Cannot merge even with approvals

**Solution**:

- Verify all required status checks have passed
- Ensure all conversations are resolved
- Check that the branch is up to date with the base branch

### Issue: Administrators can bypass rules

**Solution**:

- Enable "Include administrators" in branch protection settings
- This ensures rules apply to everyone, including admins

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
- [GitHub Pull Request Reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

## Summary

This configuration ensures:

- ✅ Code quality through required reviews (Requirement 15.1)
- ✅ Automated testing before merging (Requirement 15.4)
- ✅ Protected main branch from direct pushes
- ✅ Conversation resolution before merging
- ✅ Consistent workflow for all contributors
- ✅ Integration with CI/CD pipeline

The branch protection rules are now documented and ready to be configured on GitHub.
