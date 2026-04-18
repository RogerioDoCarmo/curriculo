# Deployment Setup Guide

This guide explains how to set up automated deployment to Vercel with GitHub Actions.

## Overview

The deployment workflow automatically:

- Runs all tests before deployment
- Deploys to Vercel on successful tests
- Sends push notifications to users on successful deployment
- Only triggers on pushes to the `main` branch

## Prerequisites

- Vercel account
- Firebase project with Admin SDK enabled
- GitHub repository with Actions enabled

## Step 1: Set Up Vercel Project

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com/)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `out`

3. **Get Vercel Credentials**
   - Go to [Vercel Tokens](https://vercel.com/account/tokens)
   - Create new token named "GitHub Actions Deploy"
   - Copy the token (you'll need it for GitHub Secrets)

4. **Get Project IDs**
   - Go to your project settings
   - Copy the Project ID
   - Copy the Organization ID (Team ID)

## Step 2: Set Up Firebase Admin SDK

1. **Generate Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Prepare Service Account JSON**
   - Open the downloaded JSON file
   - Copy the entire contents
   - You'll add this to GitHub Secrets

## Step 3: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. **Go to Repository Settings**
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"

2. **Add Required Secrets**:

   | Secret Name                | Description                           | Where to Find                                          |
   | -------------------------- | ------------------------------------- | ------------------------------------------------------ |
   | `VERCEL_TOKEN`             | Vercel deployment token               | Vercel Account Settings → Tokens                       |
   | `VERCEL_ORG_ID`            | Vercel organization/team ID           | Vercel Project Settings → General                      |
   | `VERCEL_PROJECT_ID`        | Vercel project ID                     | Vercel Project Settings → General                      |
   | `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin SDK credentials (JSON) | Firebase Console → Project Settings → Service Accounts |

## Step 4: Install Firebase Admin SDK

The deployment workflow requires `firebase-admin` package:

```bash
npm install firebase-admin --save-dev
```

## Step 5: Configure FCM Topic Subscription

Users need to subscribe to the "deployments" topic to receive notifications:

```typescript
// In your client-side code (lib/notifications.ts)
import { getMessaging, getToken } from "firebase/messaging";

export async function subscribeToDeploymentNotifications() {
  const messaging = getMessaging();
  const token = await getToken(messaging);

  // Subscribe to deployments topic
  await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/deployments`, {
    method: "POST",
    headers: {
      Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
    },
  });
}
```

## Workflow Stages

### 1. Test Stage

- Runs linter, type check, and tests
- Validates coverage threshold (71% minimum)
- Blocks deployment if any test fails

### 2. Deploy Stage

- Deploys to Vercel production
- Only runs if tests pass
- Creates deployment URL

### 3. Notify Stage

- Sends FCM push notification
- Notifies subscribed users of successful deployment
- Only runs if deployment succeeds

## Triggering Deployment

Deployment automatically triggers when you:

1. **Merge to Main**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. **Direct Push to Main** (if allowed)
   ```bash
   git checkout main
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```

## Monitoring Deployments

### GitHub Actions

- Go to Actions tab in your repository
- View deployment workflow runs
- Check logs for each stage

### Vercel Dashboard

- Go to your project in Vercel
- View deployment history
- Check deployment logs and analytics

### Firebase Console

- Go to Cloud Messaging
- View notification delivery statistics

## Troubleshooting

### Deployment Fails at Test Stage

- Check test logs in GitHub Actions
- Run tests locally: `npm run test:coverage`
- Ensure coverage meets 71% threshold

### Deployment Fails at Deploy Stage

- Verify Vercel secrets are correct
- Check Vercel project settings
- Ensure build command succeeds locally

### Notification Not Sent

- Verify Firebase service account JSON is valid
- Check that users are subscribed to "deployments" topic
- Review FCM logs in Firebase Console

### Vercel Token Expired

- Generate new token in Vercel
- Update `VERCEL_TOKEN` secret in GitHub

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Rotate tokens** periodically (every 90 days)
3. **Use environment-specific** Firebase projects
4. **Limit token permissions** to deployment only
5. **Review deployment logs** for sensitive data

## Environment Variables

The following environment variables should be set in Vercel:

| Variable                                   | Description                  | Required |
| ------------------------------------------ | ---------------------------- | -------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key             | Yes      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         | Yes      |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          | Yes      |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      | Yes      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes      |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              | Yes      |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      | Firebase measurement ID      | Yes      |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT`           | Formspree form endpoint      | Yes      |
| `NEXT_PUBLIC_SENTRY_DSN`                   | Sentry DSN                   | Yes      |

## Next Steps

After setting up deployment:

1. Test the workflow by pushing to main
2. Verify deployment succeeds in Vercel
3. Check that notifications are sent
4. Configure custom domains (Task 21.6)
5. Set up monitoring and alerts

## Related Documentation

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
