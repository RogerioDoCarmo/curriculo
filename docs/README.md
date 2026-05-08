# Documentation

This directory contains documentation for the Personal Resume Website project.

## Available Documentation

### Firebase Remote Config

- **[Feature Flag Management Guide](./FEATURE-FLAG-MANAGEMENT.md)** - Complete guide for adding, testing, and managing feature flags
- **[Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md)** - Comprehensive guide for configuring feature flags in Firebase Console
- **[Toggle Feature Flag Quick Reference](./TOGGLE-FEATURE-FLAG.md)** - Quick reference for toggling the `use_locale_specific_pdfs` flag
- **[Remote Config Troubleshooting Guide](./REMOTE-CONFIG-TROUBLESHOOTING.md)** - Solutions to common Remote Config issues

### Feature Flags

The application uses Firebase Remote Config for dynamic feature flags. Currently implemented flags:

| Flag Name                  | Type    | Default | Description                                                                                        |
| -------------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------- |
| `use_locale_specific_pdfs` | Boolean | `false` | Controls whether to generate locale-specific PDF resumes (pt-BR, en, es) or a single universal PDF |

### Analytics Events

The application tracks feature flag usage with Firebase Analytics:

#### `feature_flag_checked`

Tracks when a feature flag is retrieved from Remote Config.

**Parameters:**

- `flag_name` (string): Name of the feature flag
- `flag_value` (boolean/string/number): Current value of the flag
- `locale` (string, optional): User's current locale

**Usage:**

```typescript
import { trackFeatureFlagChecked } from "@/lib/analytics";

trackFeatureFlagChecked({
  flag_name: "use_locale_specific_pdfs",
  flag_value: true,
  locale: "pt-BR",
});
```

#### `pdf_download`

Tracks when a user downloads a PDF resume.

**Parameters:**

- `locale` (string): Language of the downloaded PDF (pt-BR, en, es, or "universal")
- `feature_flag_enabled` (boolean): Whether locale-specific PDFs are enabled

**Usage:**

```typescript
import { trackPDFDownload } from "@/lib/analytics";

trackPDFDownload({
  locale: "pt-BR",
  feature_flag_enabled: true,
});
```

### Code References

**Feature Flag Implementation:**

- `lib/firebase.ts` - Firebase initialization and Remote Config setup
- `lib/feature-flags.ts` - Feature flag retrieval with caching and analytics
- `lib/analytics.ts` - Analytics tracking functions

**Default Values:**

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  use_locale_specific_pdfs: false,
};
```

**Cache Configuration:**

```typescript
// lib/feature-flags.ts
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// lib/firebase.ts
remoteConfig.settings = {
  minimumFetchIntervalMillis: process.env.NODE_ENV === "production" ? 3600000 : 0, // 1 hour in prod, 0 in dev
  fetchTimeoutMillis: 60000, // 60 seconds
};
```

## Quick Start

### 1. Add a New Feature Flag

Follow the [Feature Flag Management Guide](./FEATURE-FLAG-MANAGEMENT.md) to add a new feature flag:

1. **Define in code:** Add default value to `lib/firebase.ts`
2. **Use in code:** Import and use `getFeatureFlag()`
3. **Configure in Firebase:** Create parameter in Firebase Console
4. **Test locally:** Override default value or use development project
5. **Document:** Add to this README and code comments

### 2. Configure Firebase Remote Config

Follow the [Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md) to create the `use_locale_specific_pdfs` parameter in Firebase Console.

### 3. Toggle Feature Flag

Use the [Toggle Feature Flag Quick Reference](./TOGGLE-FEATURE-FLAG.md) for quick instructions on enabling/disabling the feature.

### 4. Monitor Usage

View analytics in Firebase Console:

1. Go to **Analytics → Events**
2. Search for `feature_flag_checked` to see flag usage
3. Search for `pdf_download` to see PDF download behavior

## Troubleshooting

For detailed troubleshooting, see the [Remote Config Troubleshooting Guide](./REMOTE-CONFIG-TROUBLESHOOTING.md).

### Quick Fixes

#### Flag Not Updating

**Problem:** Feature flag value doesn't change after updating in Firebase Console

**Solutions:**

1. Wait 5 minutes for cache to expire
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear cache in browser console:
   ```javascript
   clearFeatureFlagCache();
   ```

### Flag Returns Default Value

**Problem:** `getFeatureFlag()` always returns the default value

**Possible Causes:**

1. Firebase not configured (check environment variables)
2. Remote Config not initialized (check browser console for errors)
3. Network issues (check Network tab for failed requests)
4. SSR context (Remote Config only works in browser)

**Debug:**

```javascript
// Check Firebase configuration
const configured = isFirebaseConfigured();
console.log("Firebase configured:", configured);

// Check Remote Config instance
const config = await getFirebaseRemoteConfig();
console.log("Remote Config:", config);
```

### Analytics Not Tracking

**Problem:** Events not appearing in Firebase Analytics

**Possible Causes:**

1. User hasn't given analytics consent (check cookie consent)
2. Analytics not initialized (check browser console)
3. Ad blockers blocking Firebase requests
4. Analytics takes 24-48 hours to appear in console

**Debug:**

```javascript
// Check analytics consent
const consent = localStorage.getItem("cookie-consent");
console.log("Cookie consent:", consent);

// Check analytics instance
const analytics = await getFirebaseAnalytics();
console.log("Analytics:", analytics);
```

## Best Practices

### 1. Always Use Default Values

```typescript
// ✅ Good: Provides fallback
const enabled = await getFeatureFlag("use_locale_specific_pdfs", false);

// ❌ Bad: No fallback if Remote Config fails
const enabled = await getFeatureFlag("use_locale_specific_pdfs");
```

### 2. Cache Flag Values

```typescript
// ✅ Good: Cache flag value in component state
const [useLocalePDFs, setUseLocalePDFs] = useState(false);

useEffect(() => {
  getFeatureFlag("use_locale_specific_pdfs", false).then(setUseLocalePDFs);
}, []);

// ❌ Bad: Fetch flag on every render
const useLocalePDFs = await getFeatureFlag("use_locale_specific_pdfs", false);
```

### 3. Track Feature Usage

```typescript
// ✅ Good: Track when feature is used
const enabled = await getFeatureFlag("use_locale_specific_pdfs", false);
if (enabled) {
  trackPDFDownload({ locale: "pt-BR", feature_flag_enabled: true });
}

// ❌ Bad: No tracking, can't measure adoption
const enabled = await getFeatureFlag("use_locale_specific_pdfs", false);
```

### 4. Gradual Rollout

```typescript
// ✅ Good: Use percentage-based rollout in Firebase Console
// Start with 10%, monitor, then increase to 25%, 50%, 100%

// ❌ Bad: Enable for all users immediately
// Risk of widespread issues if feature has bugs
```

### 5. Document Flag Purpose

```typescript
// ✅ Good: Clear documentation
/**
 * Controls whether to generate locale-specific PDF resumes.
 * When enabled: Separate PDFs for pt-BR, en, es
 * When disabled: Single universal PDF
 */
const useLocalePDFs = await getFeatureFlag("use_locale_specific_pdfs", false);

// ❌ Bad: No documentation
const flag = await getFeatureFlag("use_locale_specific_pdfs", false);
```

## Related Resources

- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config)
- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Support

For questions or issues:

1. Check the troubleshooting section above
2. Review the [Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md)
3. Check browser console for error messages
4. Review Firebase Console for configuration issues

---

**Last Updated:** 2024-01-XX
**Maintained By:** Development Team
