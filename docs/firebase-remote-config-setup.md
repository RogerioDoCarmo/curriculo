# Firebase Remote Config Setup Guide

## Overview

This guide documents how to configure the `use_locale_specific_pdfs` feature flag in Firebase Remote Config. This flag controls whether the application generates separate PDF resumes for each language (pt-BR, en, es) or uses a single universal PDF.

**Requirements:** 10.1

## Prerequisites

- Firebase project created and configured
- Firebase Console access with appropriate permissions
- Project ID: Check your `.env.local` file for `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## Step 1: Access Firebase Console

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Select your project from the project list
3. In the left sidebar, click on **"Remote Config"** under the "Engage" section

## Step 2: Create the Feature Flag Parameter

### 2.1 Add New Parameter

1. Click the **"Add parameter"** button
2. Fill in the parameter details:
   - **Parameter key:** `use_locale_specific_pdfs`
   - **Description:** "Controls whether to generate locale-specific PDF resumes (true) or a single universal PDF (false)"
   - **Data type:** Boolean

### 2.2 Set Default Value

1. In the "Default value" section, set the value to `true`
2. This matches the in-app `defaultConfig` in `lib/firebase.ts`
   (`use_locale_specific_pdfs: true`), so locale-specific PDFs are the default —
   including when Remote Config can't initialize. Publish `false` later only as a
   kill-switch to fall back to the single universal PDF.

> **Important:** The published Remote Config value always wins over the in-app
> `defaultConfig`. If this parameter is published as `false`, every locale falls
> back to the universal `resume.pdf` even though the app default is `true`. Keep
> the two in sync unless you are deliberately using `false` as a kill-switch.

### 2.3 Add Parameter Conditions (Optional)

You can create conditions to enable the feature for specific user segments:

**Example: Enable for specific locales**

1. Click **"Add value for condition"**
2. Create a new condition:
   - **Condition name:** `Portuguese Users`
   - **Applies if:** User in language → `pt-BR`
   - **Value:** `true`

**Example: Enable for testing**

1. Create another condition:
   - **Condition name:** `Development Environment`
   - **Applies if:** App → `your-app-id-dev`
   - **Value:** `true`

### 2.4 Save the Parameter

1. Review your configuration
2. Click **"Publish changes"** in the top right
3. Add a description for the change (e.g., "Add use_locale_specific_pdfs feature flag")
4. Click **"Publish"**

## Step 3: Verify Configuration

### 3.1 Check Parameter in Console

1. In Remote Config, verify the parameter appears in the list
2. Confirm the default value is `true`
3. Check that any conditions are correctly configured

### 3.2 Test in Application

Run the following code in your browser console to verify the flag is accessible:

```javascript
// With the parameter (or defaultConfig) set to true, this returns true
const flag = await getFeatureFlag("use_locale_specific_pdfs", true);
console.log("use_locale_specific_pdfs:", flag);
```

## Step 4: Toggle the Flag in Production

Locale-specific PDFs are **on by default** (the parameter and the in-app
`defaultConfig` are both `true`). Use the steps below to flip the flag as a
kill-switch or to re-enable it.

### To Enable the Feature (Locale-Specific PDFs)

1. Go to Firebase Console → Remote Config
2. Find the `use_locale_specific_pdfs` parameter
3. Click the **Edit** icon (pencil)
4. Change the default value from `false` to `true`
5. Click **"Publish changes"**
6. Add a description: "Enable locale-specific PDF generation"
7. Click **"Publish"**

**Effect:** Users will now see separate PDF download buttons for each language (pt-BR, en, es)

### To Disable the Feature (Universal PDF)

1. Go to Firebase Console → Remote Config
2. Find the `use_locale_specific_pdfs` parameter
3. Click the **Edit** icon (pencil)
4. Change the default value from `true` to `false`
5. Click **"Publish changes"**
6. Add a description: "Disable locale-specific PDF generation"
7. Click **"Publish"**

**Effect:** Users will see a single universal PDF download button

### Rollout Strategy (Gradual Deployment)

For safer rollouts, use percentage-based conditions:

1. Create a condition:
   - **Condition name:** `10% Rollout`
   - **Applies if:** User in random percentile → `<= 10`
   - **Value:** `true`
2. Publish changes
3. Monitor analytics and error rates
4. Gradually increase the percentage (25%, 50%, 75%, 100%)

## Step 5: Monitoring and Analytics

### Track Feature Flag Usage

The application automatically tracks feature flag usage with Firebase Analytics:

**Event:** `feature_flag_checked`
**Parameters:**

- `flag_name`: "use_locale_specific_pdfs"
- `flag_value`: true/false
- `locale`: Current user locale (pt-BR, en, es)

### View Analytics in Firebase Console

1. Go to Firebase Console → Analytics → Events
2. Search for `feature_flag_checked` event
3. View event count and parameters
4. Create custom reports to track:
   - Flag usage by locale
   - Flag value distribution
   - User engagement with PDF downloads

### Monitor PDF Downloads

**Event:** `pdf_download`
**Parameters:**

- `locale`: Language of the downloaded PDF (pt-BR, en, es, or "universal")
- `feature_flag_enabled`: true/false

**To view:**

1. Go to Firebase Console → Analytics → Events
2. Search for `pdf_download` event
3. Filter by `feature_flag_enabled` parameter to compare behavior

## Step 6: Troubleshooting

### Flag Not Updating in Application

**Symptom:** Application still shows old flag value after publishing changes

**Solutions:**

1. **Wait for cache expiration:** The app caches flag values for 5 minutes
2. **Clear browser cache:** Force refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Clear feature flag cache:** Run in browser console:
   ```javascript
   clearFeatureFlagCache();
   ```
4. **Check fetch interval:** In development, flags update immediately. In production, they update every hour.

### Flag Returns the Caller's Default Instead of the Published Value

**Symptom:** `getFeatureFlag()` ignores the published Remote Config value and
returns the caller's default (e.g. the footer serves the universal `resume.pdf`
for every locale).

**Possible Causes:**

1. **Firebase not configured:** Check environment variables in `.env.local`
2. **Remote Config not initialized:** Check browser console for Firebase errors
3. **Network issues:** Check browser Network tab for failed Remote Config requests
4. **SSR context:** Remote Config only works in the browser, not during
   server-side rendering / static export (the rendered HTML uses the in-app
   `defaultConfig`, then the client updates after fetch)
5. **Published value is actually `false`:** A published `false` is authoritative
   and overrides the in-app `true` default — by design. Set it to `true` and
   publish to re-enable.

> **Historical bug (fixed):** `getFeatureFlag` previously returned the caller's
> default whenever `fetchAndActivate()` resolved `false`, which happens on most
> repeat visits (nothing new to activate). It now always reads `getValue` and
> only honours the caller default when the value source is `"static"`.

**Debug Steps:**

1. Check Firebase initialization:
   ```javascript
   const configured = isFirebaseConfigured();
   console.log("Firebase configured:", configured);
   ```
2. Check Remote Config instance:
   ```javascript
   const config = await getFirebaseRemoteConfig();
   console.log("Remote Config:", config);
   ```
3. Check browser console for errors

### Parameter Not Found in Console

**Symptom:** Cannot find `use_locale_specific_pdfs` in Remote Config

**Solutions:**

1. Verify you're in the correct Firebase project
2. Check that you published the parameter (not just saved as draft)
3. Refresh the Remote Config page
4. Check project permissions (you need Editor or Owner role)

## Configuration Reference

### Parameter Details

| Property          | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| **Key**           | `use_locale_specific_pdfs`                               |
| **Type**          | Boolean                                                  |
| **Default**       | `true` (matches in-app `defaultConfig`)                  |
| **Description**   | Controls whether to generate locale-specific PDF resumes |
| **Code Location** | `lib/firebase.ts` (REMOTE_CONFIG_DEFAULTS)               |
| **Usage**         | `lib/feature-flags.ts` (getFeatureFlag)                  |

### Cache Settings

| Setting                                        | Value         | Location                                       |
| ---------------------------------------------- | ------------- | ---------------------------------------------- |
| **In-Memory Cache TTL**                        | 5 minutes     | `lib/feature-flags.ts` (CACHE_TTL)             |
| **Remote Config Fetch Interval (Production)**  | 1 hour        | `lib/firebase.ts` (minimumFetchIntervalMillis) |
| **Remote Config Fetch Interval (Development)** | 0 (immediate) | `lib/firebase.ts` (minimumFetchIntervalMillis) |
| **Fetch Timeout**                              | 60 seconds    | `lib/firebase.ts` (fetchTimeoutMillis)         |

### Environment Variables

Required environment variables for Remote Config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Best Practices

### 1. Use Descriptive Parameter Names

✅ Good: `use_locale_specific_pdfs`
❌ Bad: `flag1`, `pdf_feature`, `new_feature`

### 2. Document Parameter Purpose

Always add a clear description in Firebase Console explaining:

- What the flag controls
- Expected behavior when enabled/disabled
- Any dependencies or prerequisites

### 3. Test Before Production Rollout

1. Test in development environment first
2. Use percentage-based rollout for gradual deployment
3. Monitor analytics and error rates
4. Have a rollback plan ready

### 4. Version Control Configuration

Document all Remote Config changes in your repository:

- Update this file when adding new parameters
- Include parameter keys in code comments
- Track configuration changes in git commits

### 5. Monitor Flag Usage

- Set up Firebase Analytics events for flag checks
- Create custom dashboards to track feature adoption
- Monitor error rates when flags are toggled
- Review flag usage regularly and remove unused flags

## Related Documentation

- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config)
- [Feature Flag Implementation](../lib/feature-flags.ts)
- [Firebase Configuration](../lib/firebase.ts)
- [PDF Generation Feature](../components/PDFDownloadButton/index.tsx)

## Change Log

| Date       | Change                                                      | Author |
| ---------- | ----------------------------------------------------------- | ------ |
| 2024-01-XX | Initial parameter creation                                  | -      |
| 2024-01-XX | Enabled for 10% of users                                    | -      |
| 2024-01-XX | Enabled for all users                                       | -      |
| 2026-06-15 | Document default as `true`; align with in-app defaultConfig | -      |

---

**Last Updated:** 2026-06-15
**Maintained By:** Development Team
**Requirements:** 10.1
