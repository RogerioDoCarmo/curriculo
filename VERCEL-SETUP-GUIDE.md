# Vercel Project Configuration Guide

This guide walks you through configuring your Vercel project for the Personal Resume Website (Task 21.5).

## Prerequisites

Before starting, ensure you have:

- A GitHub account with this repository pushed
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- All required API keys and credentials ready (Firebase, Sentry, Formspree)

## Step 1: Connect GitHub Repository to Vercel

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select your `personal-resume-website` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `.` (leave as default)
   - **Build Command**: `npm run build` (or `yarn build` if using Yarn)
   - **Output Directory**: `.next` (should be auto-detected)
   - **Install Command**: `npm install` (or `yarn install`)

## Step 2: Configure Environment Variables

Add the following environment variables in the Vercel dashboard:

### Navigate to Environment Variables

1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar

### Add Required Variables

#### Firebase Configuration (Public - Required for Production)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

**Where to get these values:**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to Project Settings → General
- Scroll to "Your apps" section
- Copy the config values from your web app

#### Sentry Configuration (Public - Required for Production)

```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Where to get this value:**

- Go to [Sentry Dashboard](https://sentry.io/)
- Select your project
- Go to Settings → Client Keys (DSN)
- Copy the DSN value

#### Formspree Configuration (Public - Required for Production)

```
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id_here
```

**Where to get this value:**

- Go to [Formspree Dashboard](https://formspree.io/)
- Create a new form or select existing form
- Copy the form ID from the form endpoint URL

### Environment Selection

For each variable, select which environments it should be available in:

- ✅ **Production** (required for live site)
- ✅ **Preview** (recommended for testing)
- ✅ **Development** (optional, can use `.env.local` instead)

### Important Notes

- **Public Variables**: All variables prefixed with `NEXT_PUBLIC_` are embedded in the browser bundle and are safe to expose
- **Private Variables**: Firebase Admin SDK variables (FIREBASE_PRIVATE_KEY, etc.) should ONLY be added to GitHub Secrets for CI/CD, NOT to Vercel
- **Verification**: After adding variables, redeploy to apply changes

## Step 3: Configure Build Settings

1. **Navigate to Build Settings**
   - Go to Settings → General
   - Scroll to "Build & Development Settings"

2. **Verify Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x or higher (check package.json engines field)

3. **Advanced Settings** (Optional)
   - **Ignored Build Step**: Leave empty (build on every push)
   - **Environment Variables**: Already configured in Step 2

## Step 4: Configure Custom Domains

### Add Primary Domain

1. **Navigate to Domains**
   - Go to Settings → Domains

2. **Add Domain**
   - Click "Add Domain"
   - Enter: `rogeriodocarmo.com`
   - Click "Add"

3. **Configure DNS in Hostinger**
   - Log in to [Hostinger](https://www.hostinger.com/)
   - Go to your domain management
   - Add the following DNS records:

   **For rogeriodocarmo.com:**

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

4. **Verify Domain**
   - Return to Vercel dashboard
   - Wait for DNS propagation (can take up to 48 hours, usually faster)
   - Vercel will automatically verify and issue SSL certificate

### Add Additional Domains

Repeat the process for each additional domain:

**rogeriodocarmo.com.br:**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**rogeriodocarmo.xyz:**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**rogeriodocarmo.online:**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Set Primary Domain (Optional)

1. In Vercel Domains settings
2. Click the three dots next to your preferred domain
3. Select "Set as Primary"
4. This will redirect all other domains to the primary domain

## Step 5: Configure Deployment Settings

1. **Navigate to Git Settings**
   - Go to Settings → Git

2. **Configure Branch Settings**
   - **Production Branch**: `main`
   - **Deploy Hooks**: Leave empty (using GitHub Actions)

3. **Configure Deployment Protection** (Optional)
   - Enable "Deployment Protection" for production
   - Require approval before deploying to production

## Step 6: Test Deployment

1. **Trigger Deployment**
   - Push a commit to the `main` branch
   - Or click "Deployments" → "Redeploy" in Vercel dashboard

2. **Monitor Build**
   - Watch the build logs in real-time
   - Verify no errors occur
   - Check that environment variables are loaded correctly

3. **Verify Deployment**
   - Visit your Vercel deployment URL (e.g., `your-project.vercel.app`)
   - Test all functionality:
     - Language switching
     - Theme toggle
     - Contact form submission
     - Firebase Analytics tracking
     - Error logging to Sentry

4. **Test Custom Domains**
   - Once DNS propagates, visit each custom domain
   - Verify HTTPS is working (green padlock)
   - Verify all domains serve the same content
   - Test all functionality on each domain

## Step 7: Configure Automatic Deployments

Vercel automatically deploys when you push to GitHub. To customize:

1. **Production Deployments**
   - Automatically triggered on push to `main` branch
   - Runs build command and deploys to production domains

2. **Preview Deployments**
   - Automatically triggered on push to any other branch
   - Creates unique preview URL for testing
   - Useful for pull request reviews

3. **Deployment Notifications**
   - Go to Settings → Notifications
   - Configure Slack, Discord, or email notifications
   - Get notified when deployments succeed or fail

## Verification Checklist

After completing all steps, verify:

- [ ] GitHub repository is connected to Vercel
- [ ] All environment variables are configured
- [ ] Build settings are correct (`npm run build`)
- [ ] All four custom domains are added and verified
- [ ] HTTPS certificates are issued for all domains
- [ ] Test deployment succeeds without errors
- [ ] Website is accessible on all domains
- [ ] Firebase Analytics is tracking events
- [ ] Contact form submissions work
- [ ] Sentry is capturing errors
- [ ] Theme and language switching work
- [ ] All content displays correctly

## Troubleshooting

### Build Fails

**Problem**: Build fails with "Module not found" error
**Solution**:

- Check that all dependencies are in `package.json`
- Verify `package-lock.json` or `yarn.lock` is committed
- Try clearing Vercel cache: Settings → General → Clear Cache

**Problem**: Build fails with environment variable error
**Solution**:

- Verify all required `NEXT_PUBLIC_*` variables are set in Vercel
- Check for typos in variable names
- Redeploy after adding variables

### Domain Not Working

**Problem**: Domain shows "Domain not found" error
**Solution**:

- Verify DNS records are correct in Hostinger
- Wait for DNS propagation (up to 48 hours)
- Use [DNS Checker](https://dnschecker.org/) to verify propagation

**Problem**: Domain shows "SSL certificate error"
**Solution**:

- Wait for Vercel to issue certificate (can take a few minutes)
- Verify domain is properly verified in Vercel
- Check that DNS records point to Vercel

### Functionality Issues

**Problem**: Firebase Analytics not tracking
**Solution**:

- Verify `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
- Check browser console for Firebase errors
- Verify Firebase project is active in Firebase Console

**Problem**: Contact form not submitting
**Solution**:

- Verify `NEXT_PUBLIC_FORMSPREE_FORM_ID` is set correctly
- Check Formspree dashboard for form submissions
- Verify form endpoint is active

## Next Steps

After completing Vercel configuration:

1. **Test thoroughly** on all domains and devices
2. **Monitor deployments** in Vercel dashboard
3. **Set up monitoring** in Firebase and Sentry dashboards
4. **Configure alerts** for deployment failures
5. **Document** any custom configuration for team members

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Custom Domains Guide](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/domains/dns)

---

**Task 21.5 Status**: Configuration guide complete. Follow the steps above to configure your Vercel project.

**Validates Requirements**: 8.1 (Vercel deployment), 8.3 (HTTPS certificates), 8.4 (CDN edge caching)
