# Firebase Remote Config Troubleshooting Guide

## Overview

This guide provides solutions to common Firebase Remote Config issues. Use this when feature flags aren't working as expected.

**Requirements:** 15.2

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Common Issues](#common-issues)
- [Configuration Issues](#configuration-issues)
- [Network Issues](#network-issues)
- [Cache Issues](#cache-issues)
- [Analytics Issues](#analytics-issues)
- [Environment Issues](#environment-issues)
- [Advanced Debugging](#advanced-debugging)

---

## Quick Diagnostics

Run these commands in your browser console to quickly diagnose issues:

```javascript
// 1. Check if Firebase is configured
const configured = isFirebaseConfigured();
console.log("Firebase configured:", configured);

// 2. Check Remote Config instance
const config = await getFirebaseRemoteConfig();
console.log("Remote Config:", config);

// 3. Check a specific flag
const flag = await getFeatureFlag("use_locale_specific_pdfs", false);
console.log("Flag value:", flag);

// 4. Clear cache and retry
clearFeatureFlagCache();
const freshFlag = await getFeatureFlag("use_locale_specific_pdfs", false);
console.log("Fresh flag value:", freshFlag);

// 5. Check analytics consent
const consent = localStorage.getItem("cookie-consent");
console.log("Cookie consent:", consent);
```

---

## Common Issues

### Issue 1: Flag Not Updating After Publishing

**Symptom:**

- Changed flag value in Firebase Console
- Published changes successfully
- Application still shows old value

**Root Causes:**

1. **In-memory cache not expired** (5 minute TTL)
2. **Remote Config fetch interval not reached** (1 hour in production)
3. **Browser cache not cleared**
4. **Service worker serving stale content**

**Solutions:**

**Solution 1: Wait for Cache Expiration**

```
In-memory cache: 5 minutes
Remote Config fetch: 1 hour (production), 0 (development)
```

**Solution 2: Force Refresh**

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Solution 3: Clear Cache Programmatically**

```javascript
// In browser console
clearFeatureFlagCache();

// Then reload the page
location.reload();
```

**Solution 4: Clear Service Worker Cache**

```javascript
// In browser console
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

// Then reload
location.reload();
```

**Solution 5: Use Incognito/Private Mode**

- Open site in incognito/private browsing mode
- No cache or service workers
- Fresh Remote Config fetch

**Prevention:**

- Use development environment for testing (immediate fetch)
- Document cache behavior for team
- Use gradual rollout to minimize impact

---

### Issue 2: Flag Always Returns Default Value

**Symptom:**

- `getFeatureFlag()` always returns the default value
- Never fetches from Remote Config
- No errors in console

**Root Causes:**

1. **Firebase not configured** (missing environment variables)
2. **Remote Config not initialized** (Firebase SDK error)
3. **Network blocked** (firewall, ad blocker, CORS)
4. **SSR context** (server-side rendering)
5. **Parameter not published** (saved as draft)

**Solutions:**

**Solution 1: Check Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Verify in browser console:

```javascript
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
```

**Solution 2: Check Firebase Initialization**

```javascript
// In browser console
const configured = isFirebaseConfigured();
console.log("Firebase configured:", configured);

if (!configured) {
  console.error("Firebase is not configured. Check environment variables.");
}
```

**Solution 3: Check Network Requests**

1. Open browser DevTools → Network tab
2. Filter by "firebaseremoteconfig"
3. Look for failed requests (red)
4. Check request/response details

**Solution 4: Disable Ad Blockers**

- Ad blockers may block Firebase requests
- Test in incognito mode without extensions
- Whitelist Firebase domains:
  - `firebaseremoteconfig.googleapis.com`
  - `firebaseinstallations.googleapis.com`

**Solution 5: Verify Parameter is Published**

1. Go to Firebase Console → Remote Config
2. Check parameter exists
3. Verify it's published (not draft)
4. Check "Last published" timestamp

**Solution 6: Check SSR Context**

Remote Config only works in browser, not during server-side rendering:

```typescript
// ✅ Good: Check if in browser
if (typeof window !== "undefined") {
  const flag = await getFeatureFlag("enable_feature", false);
}

// ✅ Good: Use in useEffect (client-side only)
useEffect(() => {
  getFeatureFlag("enable_feature", false).then(setFlag);
}, []);

// ❌ Bad: Use during SSR
const flag = await getFeatureFlag("enable_feature", false); // Returns default during SSR
```

---

### Issue 3: Flag Not Found in Firebase Console

**Symptom:**

- Cannot find parameter in Remote Config
- Parameter disappeared after publishing
- Search returns no results

**Root Causes:**

1. **Wrong Firebase project** (multiple projects)
2. **Parameter not published** (saved as draft)
3. **Insufficient permissions** (viewer role)
4. **Browser cache issue** (stale console view)

**Solutions:**

**Solution 1: Verify Correct Project**

1. Check project name in top-left corner
2. Verify project ID matches `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   ```
3. Switch projects if needed

**Solution 2: Check Draft Status**

1. Look for "Unpublished changes" banner
2. Click "Publish changes" if present
3. Verify parameter appears after publishing

**Solution 3: Check Permissions**

Required role: **Editor** or **Owner**

1. Go to Firebase Console → Project Settings → Users and permissions
2. Check your role
3. Request Editor/Owner access if needed

**Solution 4: Refresh Console**

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try different browser
4. Use incognito mode

**Solution 5: Search by Key**

1. Use search box in Remote Config
2. Search for exact parameter key
3. Check "All parameters" tab (not just conditions)

---

### Issue 4: Conditional Rollout Not Working

**Symptom:**

- Created percentage-based condition
- Users not seeing expected behavior
- All users getting same value

**Root Causes:**

1. **Condition not applied** (default value used)
2. **Condition logic incorrect** (wrong operator)
3. **User not in target segment** (locale, app version)
4. **Cache serving old value** (not refetched)

**Solutions:**

**Solution 1: Verify Condition Configuration**

1. Firebase Console → Remote Config
2. Click parameter → View conditions
3. Check condition is active (not disabled)
4. Verify condition logic:
   - **Percentile:** `<= 10` for 10% rollout
   - **Locale:** Matches user's locale
   - **App version:** Matches deployed version

**Solution 2: Check Condition Priority**

Conditions are evaluated top-to-bottom:

1. First matching condition wins
2. Reorder conditions if needed
3. More specific conditions should be first

**Solution 3: Test Condition Logic**

```javascript
// Check user's locale
console.log("User locale:", navigator.language);

// Check if user is in percentile
// Firebase uses consistent hashing, so same user always gets same percentile
```

**Solution 4: Clear Cache**

```javascript
clearFeatureFlagCache();
location.reload();
```

**Solution 5: Use Firebase Console Test**

1. Firebase Console → Remote Config
2. Click parameter → "Test on device"
3. Enter installation ID
4. See which condition matches

---

## Configuration Issues

### Missing Environment Variables

**Symptom:** Firebase not initializing

**Check:**

```javascript
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
```

**Fix:**

1. Copy `.env.example` to `.env.local`
2. Fill in values from Firebase Console
3. Restart development server
4. Verify in Vercel dashboard for production

### Wrong Firebase Project

**Symptom:** Parameters not found or different values

**Check:**

```javascript
console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

**Fix:**

1. Verify project ID in Firebase Console
2. Update `.env.local` with correct project ID
3. Restart development server

### Invalid API Key

**Symptom:** Firebase initialization fails

**Check Browser Console:**

```
Firebase: Error (auth/invalid-api-key)
```

**Fix:**

1. Go to Firebase Console → Project Settings → General
2. Copy correct API key
3. Update `.env.local`
4. Restart development server

---

## Network Issues

### Firewall Blocking Firebase

**Symptom:** Network requests fail

**Check Network Tab:**

- Look for failed requests to `firebaseremoteconfig.googleapis.com`
- Status: `(failed)` or `net::ERR_BLOCKED_BY_CLIENT`

**Fix:**

1. Whitelist Firebase domains in firewall
2. Contact IT/network admin
3. Test on different network

### Ad Blocker Blocking Firebase

**Symptom:** Requests blocked by browser extension

**Check:**

1. Open DevTools → Network tab
2. Look for blocked requests
3. Check ad blocker icon for blocked count

**Fix:**

1. Disable ad blocker for your domain
2. Whitelist Firebase domains
3. Test in incognito mode without extensions

### CORS Issues

**Symptom:** CORS error in console

**Check:**

```
Access to fetch at 'https://firebaseremoteconfig.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Fix:**

1. Verify domain is authorized in Firebase Console
2. Go to Project Settings → Authorized domains
3. Add your domain (including localhost for development)
4. Wait a few minutes for changes to propagate

---

## Cache Issues

### Stale Cache After Update

**Symptom:** Old value persists after publishing

**Solutions:**

1. **Wait 5 minutes** (in-memory cache TTL)
2. **Clear cache:** `clearFeatureFlagCache()`
3. **Hard refresh:** `Ctrl+Shift+R`
4. **Incognito mode:** Test without cache

### Service Worker Caching

**Symptom:** Old values even after cache clear

**Check:**

```javascript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log("Service workers:", registrations.length);
});
```

**Fix:**

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => registration.unregister());
});

// Then reload
location.reload();
```

### Browser Cache

**Symptom:** Stale static assets

**Fix:**

1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use incognito mode

---

## Analytics Issues

### Events Not Appearing

**Symptom:** `feature_flag_checked` events not in Firebase Analytics

**Root Causes:**

1. **Analytics consent not given** (cookie consent)
2. **Analytics not initialized** (Firebase error)
3. **Ad blocker blocking analytics** (privacy extension)
4. **Analytics delay** (24-48 hours to appear)

**Solutions:**

**Solution 1: Check Analytics Consent**

```javascript
const consent = localStorage.getItem("cookie-consent");
console.log("Cookie consent:", consent);

// Should be "accepted" or similar
```

**Solution 2: Check Analytics Initialization**

```javascript
const analytics = await getFirebaseAnalytics();
console.log("Analytics:", analytics);

if (!analytics) {
  console.error("Analytics not initialized");
}
```

**Solution 3: Use DebugView**

1. Enable debug mode:
   ```javascript
   // In browser console
   window["ga-disable-GA_MEASUREMENT_ID"] = false;
   ```
2. Go to Firebase Console → Analytics → DebugView
3. See events in real-time

**Solution 4: Check Ad Blockers**

- Disable ad blockers
- Test in incognito mode
- Whitelist Firebase Analytics domains

**Solution 5: Wait for Processing**

- Events take 24-48 hours to appear in reports
- Use DebugView for immediate feedback
- Check "Events" tab, not "Realtime"

---

## Environment Issues

### Development vs Production Differences

**Symptom:** Works in development, fails in production

**Root Causes:**

1. **Different Firebase projects** (dev vs prod)
2. **Different environment variables** (Vercel vs local)
3. **Different fetch intervals** (0 vs 1 hour)
4. **Different cache behavior** (cleared vs persistent)

**Solutions:**

**Solution 1: Verify Environment Variables**

Development (`.env.local`):

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-dev
```

Production (Vercel dashboard):

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-prod
```

**Solution 2: Check Fetch Intervals**

```typescript
// lib/firebase.ts
remoteConfig.settings = {
  minimumFetchIntervalMillis:
    process.env.NODE_ENV === "production"
      ? 3600000 // 1 hour in production
      : 0, // Immediate in development
};
```

**Solution 3: Test Production Build Locally**

```bash
npm run build
npm run start

# Test with production settings
```

**Solution 4: Check Vercel Logs**

1. Vercel Dashboard → Project → Deployments
2. Click deployment → View Function Logs
3. Look for Firebase errors

### SSR vs Client-Side Differences

**Symptom:** Different values during SSR and client-side

**Root Cause:** Remote Config only works in browser

**Solution:**

```typescript
// ✅ Good: Client-side only
useEffect(() => {
  getFeatureFlag("enable_feature", false).then(setFlag);
}, []);

// ✅ Good: Check if in browser
if (typeof window !== "undefined") {
  const flag = await getFeatureFlag("enable_feature", false);
}

// ❌ Bad: During SSR
const flag = await getFeatureFlag("enable_feature", false);
```

---

## Advanced Debugging

### Enable Firebase Debug Logging

```javascript
// In browser console
localStorage.setItem("firebase:debug", "true");

// Reload page to see debug logs
location.reload();

// Disable debug logging
localStorage.removeItem("firebase:debug");
```

### Inspect Remote Config State

```javascript
// Get Remote Config instance
const config = await getFirebaseRemoteConfig();

// Check settings
console.log("Settings:", config.settings);

// Check default config
console.log("Default config:", config.defaultConfig);

// Check last fetch status
console.log("Last fetch status:", config.lastFetchStatus);

// Check last fetch time
console.log("Last fetch time:", new Date(config.fetchTimeMillis));
```

### Monitor Network Requests

1. Open DevTools → Network tab
2. Filter by "firebase"
3. Look for:
   - `firebaseremoteconfig.googleapis.com` (Remote Config)
   - `firebaseinstallations.googleapis.com` (Installation ID)
   - `google-analytics.com` (Analytics)
4. Check request/response details
5. Look for error status codes

### Check Feature Flag Cache

```javascript
// Feature flag cache is private, but you can test it
const flag1 = await getFeatureFlag("enable_feature", false);
console.log("First fetch:", flag1);

// Should be cached (no network request)
const flag2 = await getFeatureFlag("enable_feature", false);
console.log("Cached fetch:", flag2);

// Clear cache
clearFeatureFlagCache();

// Should fetch again (network request)
const flag3 = await getFeatureFlag("enable_feature", false);
console.log("Fresh fetch:", flag3);
```

### Test Fetch and Activate

```javascript
// Manually fetch and activate
const { fetchAndActivate, getValue } = await import("firebase/remote-config");
const config = await getFirebaseRemoteConfig();

const activated = await fetchAndActivate(config);
console.log("Activated:", activated);

const value = getValue(config, "use_locale_specific_pdfs");
console.log("Value:", value.asBoolean());
```

---

## Getting Help

### Before Asking for Help

1. **Check this guide** for common issues
2. **Run diagnostics** in browser console
3. **Check Firebase Console** for configuration
4. **Review logs** in browser DevTools
5. **Test in incognito mode** to rule out cache

### Information to Provide

When reporting an issue, include:

1. **Environment:**
   - Development or production
   - Browser and version
   - Operating system

2. **Configuration:**
   - Firebase project ID
   - Parameter key
   - Expected vs actual value

3. **Diagnostics:**
   - Browser console output
   - Network tab screenshots
   - Firebase Console screenshots

4. **Steps to Reproduce:**
   - What you did
   - What you expected
   - What actually happened

### Resources

- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
- [Feature Flag Management Guide](./FEATURE-FLAG-MANAGEMENT.md)
- [Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md)

---

## Checklist for Troubleshooting

Use this checklist to systematically debug issues:

- [ ] Check if Firebase is configured (`isFirebaseConfigured()`)
- [ ] Verify environment variables are set
- [ ] Check Remote Config instance exists
- [ ] Verify parameter exists in Firebase Console
- [ ] Check parameter is published (not draft)
- [ ] Clear feature flag cache (`clearFeatureFlagCache()`)
- [ ] Hard refresh browser (`Ctrl+Shift+R`)
- [ ] Check browser console for errors
- [ ] Check Network tab for failed requests
- [ ] Disable ad blockers and test
- [ ] Test in incognito mode
- [ ] Verify correct Firebase project
- [ ] Check fetch interval (1 hour in production)
- [ ] Wait for cache expiration (5 minutes)
- [ ] Check analytics consent
- [ ] Verify not in SSR context
- [ ] Check service worker cache
- [ ] Review Vercel logs (production)
- [ ] Test with different browser
- [ ] Test on different network

---

**Last Updated:** 2024-01-XX
**Maintained By:** Development Team
**Requirements:** 15.2
