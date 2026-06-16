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

### ⚠️ Edited the value but it still serves the old one? (Rollout vs. parameter value)

This is the most common gotcha in the Remote Config UI. A parameter can serve a
value from **two different places**, and a **Rollout always wins** over the plain
value you edit in the pencil dialog:

- **Parameter value** — what you set via the pencil (Edit) icon next to the
  parameter. This is what most people change.
- **Rollout** — a managed gradual-release that **pins the parameter to its own
  variant value**. While a rollout is active on `use_locale_specific_pdfs`,
  editing the parameter value has **no effect** on what clients receive — the
  rollout's variant overrides it.

**How to tell a rollout is active:** fetch the live config and look for a
`rolloutMetadata` / `experimentDescriptions` block in the response (see the
verify command below). If `affectedParameterKeys` lists
`use_locale_specific_pdfs`, a rollout is in control.

**How to fix it:**

1. In the Firebase Console, open **Remote Config → Rollouts** tab.
2. Find the rollout targeting `use_locale_specific_pdfs`.
3. **Stop / end** the rollout (or set its rollout value to the one you want —
   e.g. `true` — and let it reach 100%).
4. Back on the **Parameters** tab, confirm `use_locale_specific_pdfs` = `true`.
5. **Publish changes.** The template version number should increase.

After this, the live fetch returns the plain value with **no** `rolloutMetadata`
block.

### Verify the live value from the terminal

You don't need the UI to confirm what clients actually receive. Fetch the
published config directly with the public web client credentials (project number,
web `app_id`, and `NEXT_PUBLIC_FIREBASE_API_KEY` — all already in `.env.local`):

```bash
curl -s -X POST \
  "https://firebaseremoteconfig.googleapis.com/v1/projects/<PROJECT_NUMBER>/namespaces/firebase:fetch?key=<API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"<WEB_APP_ID>","app_instance_id":"diagnostic-check"}'
```

A healthy result looks like this — the value you expect and **no** rollout block:

```json
{
  "entries": { "use_locale_specific_pdfs": "true" },
  "state": "UPDATE",
  "templateVersion": "5"
}
```

If you instead see a `rolloutMetadata` array, a rollout is still overriding the
parameter — go back and end it (see above).

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
