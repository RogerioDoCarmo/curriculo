# Quick Reference: Toggle Feature Flags

## Toggle `use_locale_specific_pdfs` Flag

> **Current default:** locale-specific PDFs are **on** — the published parameter
> and the in-app `defaultConfig` (`lib/firebase.ts`) are both `true`. A published
> `false` overrides the app default and acts as a kill-switch. See the
> [setup guide](./firebase-remote-config-setup.md) for details.

### 🚀 Enable Locale-Specific PDFs

**Effect:** Users see separate PDF download buttons for each language (pt-BR, en, es)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Remote Config** (left sidebar → Engage section)
4. Find parameter: `use_locale_specific_pdfs`
5. Click **Edit** (pencil icon)
6. Change value: `false` → `true`
7. Click **Publish changes**
8. Add description: "Enable locale-specific PDF generation"
9. Click **Publish**

**Rollout Time:**

- Development: Immediate
- Production: Up to 1 hour (due to fetch interval)
- Cached users: Up to 5 minutes (due to in-memory cache)

---

### 🔄 Disable Locale-Specific PDFs (Rollback)

**Effect:** Users see a single universal PDF download button

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Remote Config**
4. Find parameter: `use_locale_specific_pdfs`
5. Click **Edit** (pencil icon)
6. Change value: `true` → `false`
7. Click **Publish changes**
8. Add description: "Disable locale-specific PDF generation"
9. Click **Publish**

---

## Gradual Rollout Strategy

### Step 1: Enable for 10% of Users

1. In Remote Config, click **Add value for condition**
2. Create condition:
   - **Name:** `10% Rollout`
   - **Applies if:** User in random percentile → `<= 10`
   - **Value:** `true`
3. Keep default value as `false`
4. Publish changes

### Step 2: Monitor and Increase

1. Wait 24-48 hours
2. Check Firebase Analytics for `pdf_download` events
3. Monitor error rates in Sentry
4. If stable, increase to 25%, then 50%, then 100%

### Step 3: Full Rollout

1. Remove percentage condition
2. Set default value to `true`
3. Publish changes

---

## Monitoring

### View Feature Flag Usage

**Firebase Console → Analytics → Events**

Search for: `feature_flag_checked`

**Key Metrics:**

- Event count (how many times flag was checked)
- `flag_value` distribution (true vs false)
- `locale` breakdown (pt-BR, en, es)

### View PDF Downloads

**Firebase Console → Analytics → Events**

Search for: `pdf_download`

**Key Metrics:**

- Download count by locale
- `feature_flag_enabled` distribution
- User engagement comparison

---

## Troubleshooting

### Flag Not Updating?

**Quick Fixes:**

1. Wait 5 minutes (cache expiration)
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear cache in browser console:
   ```javascript
   clearFeatureFlagCache();
   ```

### Still Not Working?

**Check Configuration:**

1. Verify Firebase environment variables in Vercel
2. Check browser console for Firebase errors
3. Confirm parameter key is exactly: `use_locale_specific_pdfs`
4. Verify you published changes (not just saved draft)

---

## Emergency Rollback

If the feature causes issues:

1. **Immediate:** Set default value to `false` in Firebase Console
2. **Monitor:** Check error rates in Sentry
3. **Investigate:** Review error logs and user reports
4. **Fix:** Address issues in code
5. **Re-enable:** Follow gradual rollout strategy again

---

## Contact

For questions or issues:

- Check: [Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md)
- Review: [Feature Flag Implementation](../lib/feature-flags.ts)
- Consult: [Firebase Documentation](https://firebase.google.com/docs/remote-config)

---

**Last Updated:** 2026-06-15
