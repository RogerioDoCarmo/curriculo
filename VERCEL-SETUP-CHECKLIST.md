# Vercel Setup Checklist - Task 21.5

Quick reference checklist for configuring the Vercel project.

## Pre-Setup Requirements

- [ ] GitHub repository is pushed and accessible
- [ ] Vercel account created (sign up at vercel.com)
- [ ] Firebase project created with web app configured
- [ ] Sentry project created with DSN available
- [ ] Formspree form created with form ID available
- [ ] Hostinger account with access to DNS management for all 4 domains

## 1. Connect Repository

- [ ] Log in to Vercel
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository: `personal-resume-website`
- [ ] Verify framework preset: Next.js
- [ ] Verify build command: `npm run build`
- [ ] Verify output directory: `.next`

## 2. Environment Variables

Add these in Vercel Settings → Environment Variables:

### Firebase (8 variables)

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

### Sentry (1 variable)

- [ ] `NEXT_PUBLIC_SENTRY_DSN`

### Formspree (1 variable)

- [ ] `NEXT_PUBLIC_FORMSPREE_FORM_ID`

### Environment Selection

- [ ] All variables enabled for Production
- [ ] All variables enabled for Preview (recommended)

## 3. Build Settings

In Settings → General → Build & Development Settings:

- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x or higher

## 4. Custom Domains

### Add Domains in Vercel

- [ ] Add `rogeriodocarmo.com`
- [ ] Add `rogeriodocarmo.com.br`
- [ ] Add `rogeriodocarmo.xyz`
- [ ] Add `rogeriodocarmo.online`

### Configure DNS in Hostinger

For EACH domain, add these records:

**A Record:**

- [ ] Type: A
- [ ] Name: @
- [ ] Value: 76.76.21.21
- [ ] TTL: 3600

**CNAME Record:**

- [ ] Type: CNAME
- [ ] Name: www
- [ ] Value: cname.vercel-dns.com
- [ ] TTL: 3600

### Verify Domains

- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify all domains show "Valid Configuration" in Vercel
- [ ] Verify HTTPS certificates are issued (green padlock)

## 5. Git Configuration

In Settings → Git:

- [ ] Production Branch: `main`
- [ ] Automatic deployments enabled
- [ ] Preview deployments enabled for all branches

## 6. Test Deployment

- [ ] Trigger initial deployment (push to main or click "Redeploy")
- [ ] Monitor build logs for errors
- [ ] Verify build completes successfully
- [ ] Check deployment URL (your-project.vercel.app)

## 7. Functionality Testing

Test on Vercel deployment URL:

- [ ] Homepage loads correctly
- [ ] Language switching works (pt-BR, en, es)
- [ ] Theme toggle works (light/dark mode)
- [ ] Navigation works (all sections)
- [ ] Career path selector works
- [ ] Projects section displays correctly
- [ ] Contact form submits successfully
- [ ] Firebase Analytics tracks events (check Firebase Console)
- [ ] Sentry captures errors (trigger test error)
- [ ] All images load correctly
- [ ] Responsive design works (mobile, tablet, desktop)

## 8. Domain Testing

Once DNS propagates, test EACH domain:

### rogeriodocarmo.com

- [ ] Loads website correctly
- [ ] HTTPS works (green padlock)
- [ ] All functionality works

### rogeriodocarmo.com.br

- [ ] Loads website correctly
- [ ] HTTPS works (green padlock)
- [ ] All functionality works

### rogeriodocarmo.xyz

- [ ] Loads website correctly
- [ ] HTTPS works (green padlock)
- [ ] All functionality works

### rogeriodocarmo.online

- [ ] Loads website correctly
- [ ] HTTPS works (green padlock)
- [ ] All functionality works

## 9. Performance Verification

- [ ] Run Lighthouse audit (Performance score ≥ 90)
- [ ] Check First Contentful Paint < 1.5s
- [ ] Check Time to Interactive < 3s
- [ ] Verify images are optimized
- [ ] Verify JavaScript bundle < 200KB gzipped

## 10. Monitoring Setup

- [ ] Configure deployment notifications (Settings → Notifications)
- [ ] Set up Firebase Analytics dashboard
- [ ] Set up Sentry alerts for errors
- [ ] Monitor Vercel Analytics (if enabled)

## Common Issues & Quick Fixes

### Build Fails

- Clear Vercel cache: Settings → General → Clear Cache
- Verify all dependencies in package.json
- Check environment variables are set correctly

### Domain Not Working

- Verify DNS records in Hostinger
- Wait for DNS propagation (use dnschecker.org)
- Check domain verification in Vercel

### Environment Variables Not Working

- Verify variable names match exactly (case-sensitive)
- Redeploy after adding/changing variables
- Check variables are enabled for Production environment

## Completion Criteria

Task 21.5 is complete when:

- [x] GitHub repository connected to Vercel
- [x] All environment variables configured
- [x] Build settings configured correctly
- [x] All 4 custom domains added and verified
- [x] HTTPS certificates issued for all domains
- [x] Test deployment succeeds
- [x] All functionality tested and working
- [x] All domains tested and working

## Requirements Validated

- ✅ **Requirement 8.1**: Deploy to Vercel infrastructure
- ✅ **Requirement 8.3**: HTTPS certificates for all custom domains
- ✅ **Requirement 8.4**: CDN edge caching (automatic with Vercel)

---

**Next Task**: Task 21.6 - Set up domain configuration in Hostinger DNS

**Reference**: See `VERCEL-SETUP-GUIDE.md` for detailed instructions
