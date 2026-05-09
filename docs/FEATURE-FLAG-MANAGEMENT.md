# Feature Flag Management Guide

## Overview

This guide explains how to add new feature flags, test them locally, and manage them in production. Feature flags allow you to control feature rollout, A/B test functionality, and quickly disable features without code deployment.

**Requirements:** 15.2

## Table of Contents

- [Adding New Feature Flags](#adding-new-feature-flags)
- [Testing Feature Flags Locally](#testing-feature-flags-locally)
- [Managing Flags in Production](#managing-flags-in-production)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Adding New Feature Flags

### Step 1: Define the Flag in Code

Add the flag's default value to the Remote Config defaults in `lib/firebase.ts`:

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  use_locale_specific_pdfs: false,
  // Add your new flag here
  enable_new_feature: false,
  api_endpoint: "https://api.example.com",
  max_retries: 3,
};
```

**Naming Conventions:**

- Use snake_case for flag names
- Use descriptive names that explain what the flag controls
- Prefix boolean flags with verbs: `enable_`, `use_`, `show_`, `allow_`
- ✅ Good: `enable_dark_mode`, `use_new_api`, `show_beta_features`
- ❌ Bad: `flag1`, `new_feature`, `test`

### Step 2: Use the Flag in Your Code

Import and use the `getFeatureFlag` function:

```typescript
import { getFeatureFlag } from "@/lib/feature-flags";

// In a React component
function MyComponent() {
  const [featureEnabled, setFeatureEnabled] = useState(false);

  useEffect(() => {
    getFeatureFlag("enable_new_feature", false).then(setFeatureEnabled);
  }, []);

  if (featureEnabled) {
    return <NewFeature />;
  }

  return <OldFeature />;
}

// In a utility function
async function fetchData() {
  const useNewAPI = await getFeatureFlag("use_new_api", false);
  const endpoint = useNewAPI ? "/api/v2/data" : "/api/v1/data";
  return fetch(endpoint);
}

// With different value types
const apiEndpoint = await getFeatureFlag("api_endpoint", "https://api.example.com");
const maxRetries = await getFeatureFlag("max_retries", 3);
const enableFeature = await getFeatureFlag("enable_feature", false);
```

### Step 3: Add Analytics Tracking (Optional)

If you want to track when users interact with the feature:

```typescript
import { logEvent } from "@/lib/analytics";

async function handleFeatureAction() {
  const enabled = await getFeatureFlag("enable_new_feature", false);

  if (enabled) {
    // Track feature usage
    logEvent("new_feature_used", {
      feature_name: "new_feature",
      user_locale: locale,
    });

    // Execute feature logic
    executeNewFeature();
  }
}
```

### Step 4: Configure in Firebase Console

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Remote Config** (left sidebar → Engage section)
4. Click **"Add parameter"**
5. Fill in the details:
   - **Parameter key:** `enable_new_feature` (must match code)
   - **Description:** Clear explanation of what the flag controls
   - **Data type:** Boolean, String, or Number
6. Set the **Default value** (usually `false` for new features)
7. Click **"Publish changes"**

### Step 5: Document the Flag

Add the flag to the documentation in `docs/README.md`:

```markdown
| Flag Name            | Type    | Default | Description                           |
| -------------------- | ------- | ------- | ------------------------------------- |
| `enable_new_feature` | Boolean | `false` | Enables the new feature for all users |
```

---

## Testing Feature Flags Locally

### Method 1: Override Default Values (Recommended)

The easiest way to test flags locally is to change the default value in `lib/firebase.ts`:

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  enable_new_feature: true, // Changed from false to true for testing
};
```

**Pros:**

- No Firebase configuration needed
- Works offline
- Fast iteration

**Cons:**

- Must remember to revert before committing
- Doesn't test Remote Config integration

### Method 2: Use Firebase Console (Development Project)

Create a separate Firebase project for development:

1. **Create Development Project:**
   - Go to Firebase Console
   - Create new project: `your-project-dev`
   - Copy configuration to `.env.local`

2. **Configure Development Flags:**
   - Set up Remote Config parameters
   - Use different default values than production
   - Test conditional rollouts

3. **Switch Between Projects:**

   ```bash
   # Development
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-dev

   # Production
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-prod
   ```

**Pros:**

- Tests full Remote Config integration
- Doesn't affect production
- Can test conditional logic

**Cons:**

- Requires Firebase setup
- Slower iteration
- Needs internet connection

### Method 3: Browser Console Override

For quick testing without code changes:

```javascript
// In browser console

// Clear cache to force refetch
clearFeatureFlagCache();

// The flag will use the default value from code
// To test different values, change the default in lib/firebase.ts
```

### Method 4: Mock in Tests

For unit and integration tests:

```typescript
// __tests__/MyComponent.test.tsx
import { getFeatureFlag } from "@/lib/feature-flags";

// Mock the feature flag function
jest.mock("@/lib/feature-flags", () => ({
  getFeatureFlag: jest.fn(),
}));

describe("MyComponent", () => {
  it("renders new feature when flag is enabled", async () => {
    // Mock flag as enabled
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText("New Feature")).toBeInTheDocument();
    });
  });

  it("renders old feature when flag is disabled", async () => {
    // Mock flag as disabled
    (getFeatureFlag as jest.Mock).mockResolvedValue(false);

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText("Old Feature")).toBeInTheDocument();
    });
  });
});
```

### Testing Checklist

Before deploying a new feature flag:

- [ ] Test with flag enabled (`true`)
- [ ] Test with flag disabled (`false`)
- [ ] Test with different value types (if applicable)
- [ ] Test cache behavior (wait 5 minutes or clear cache)
- [ ] Test offline behavior (should use default value)
- [ ] Test analytics tracking (check browser console)
- [ ] Test on mobile and desktop viewports
- [ ] Test with different locales (if locale-dependent)
- [ ] Write unit tests for both flag states
- [ ] Document the flag in README.md

---

## Managing Flags in Production

### Enabling a Feature Flag

See [TOGGLE-FEATURE-FLAG.md](./TOGGLE-FEATURE-FLAG.md) for detailed instructions.

**Quick Steps:**

1. Firebase Console → Remote Config
2. Find your parameter
3. Edit → Change value to `true`
4. Publish changes
5. Wait up to 1 hour for production users (5 minutes for cached users)

### Gradual Rollout Strategy

For safer deployments, use percentage-based rollout:

**Phase 1: 10% of Users**

1. Create condition in Firebase Console:
   - **Name:** `10% Rollout - New Feature`
   - **Applies if:** User in random percentile → `<= 10`
   - **Value:** `true`
2. Keep default value as `false`
3. Publish changes

**Phase 2: Monitor and Increase**

1. Wait 24-48 hours
2. Check Firebase Analytics for feature usage
3. Monitor error rates in Sentry
4. If stable, increase to 25%, then 50%, then 100%

**Phase 3: Full Rollout**

1. Remove percentage condition
2. Set default value to `true`
3. Publish changes

### Disabling a Feature Flag (Emergency Rollback)

If a feature causes issues:

1. **Immediate Action:**
   - Firebase Console → Remote Config
   - Edit parameter → Set to `false`
   - Publish changes

2. **Monitor:**
   - Check error rates in Sentry
   - Review user reports
   - Verify feature is disabled

3. **Investigate:**
   - Review error logs
   - Identify root cause
   - Fix issues in code

4. **Re-enable:**
   - Follow gradual rollout strategy again
   - Monitor closely

### Removing Old Feature Flags

When a feature is fully rolled out and stable:

1. **Remove from Remote Config:**
   - Firebase Console → Remote Config
   - Delete parameter
   - Publish changes

2. **Remove from Code:**
   - Remove flag check from code
   - Remove default value from `lib/firebase.ts`
   - Remove documentation from README.md

3. **Clean Up:**
   - Remove related analytics events
   - Update tests to remove flag mocks
   - Deploy code changes

---

## Best Practices

### 1. Always Provide Default Values

```typescript
// ✅ Good: Provides fallback
const enabled = await getFeatureFlag("enable_feature", false);

// ❌ Bad: No fallback if Remote Config fails
const enabled = await getFeatureFlag("enable_feature");
```

### 2. Use Descriptive Flag Names

```typescript
// ✅ Good: Clear purpose
const useNewAPI = await getFeatureFlag("use_new_api_v2", false);

// ❌ Bad: Unclear purpose
const flag = await getFeatureFlag("flag1", false);
```

### 3. Document Flag Purpose

```typescript
/**
 * Controls whether to use the new API v2 endpoint.
 * When enabled: Uses /api/v2/data with improved performance
 * When disabled: Uses /api/v1/data (legacy)
 */
const useNewAPI = await getFeatureFlag("use_new_api_v2", false);
```

### 4. Cache Flag Values in Components

```typescript
// ✅ Good: Cache in state
const [useNewFeature, setUseNewFeature] = useState(false);

useEffect(() => {
  getFeatureFlag("enable_new_feature", false).then(setUseNewFeature);
}, []);

// ❌ Bad: Fetch on every render
const useNewFeature = await getFeatureFlag("enable_new_feature", false);
```

### 5. Test Both Flag States

```typescript
// Always test both enabled and disabled states
describe("MyComponent", () => {
  it("works when flag is enabled", () => {
    // Test enabled state
  });

  it("works when flag is disabled", () => {
    // Test disabled state
  });
});
```

### 6. Use Gradual Rollout for Risky Changes

- Start with 10% of users
- Monitor for 24-48 hours
- Gradually increase if stable
- Have rollback plan ready

### 7. Clean Up Old Flags

- Remove flags after full rollout
- Don't accumulate unused flags
- Keep codebase clean

### 8. Monitor Flag Usage

- Track flag checks with analytics
- Monitor feature adoption
- Review flag usage regularly

---

## Troubleshooting

### Flag Not Updating After Publishing

**Symptom:** Flag value doesn't change after updating in Firebase Console

**Solutions:**

1. **Wait for cache expiration:**
   - In-memory cache: 5 minutes
   - Remote Config fetch: 1 hour (production)

2. **Force refresh:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear cache in console: `clearFeatureFlagCache()`

3. **Check fetch interval:**
   - Development: Immediate
   - Production: 1 hour

### Flag Always Returns Default Value

**Symptom:** `getFeatureFlag()` always returns the default value

**Possible Causes:**

1. **Firebase not configured:**
   - Check environment variables in `.env.local`
   - Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set

2. **Remote Config not initialized:**
   - Check browser console for Firebase errors
   - Verify Firebase SDK is loaded

3. **Network issues:**
   - Check browser Network tab
   - Look for failed Remote Config requests

4. **SSR context:**
   - Remote Config only works in browser
   - Server-side rendering will use default values

**Debug Steps:**

```javascript
// Check Firebase configuration
const configured = isFirebaseConfigured();
console.log("Firebase configured:", configured);

// Check Remote Config instance
const config = await getFirebaseRemoteConfig();
console.log("Remote Config:", config);

// Check flag value
const flag = await getFeatureFlag("enable_feature", false);
console.log("Flag value:", flag);
```

### Flag Not Found in Firebase Console

**Symptom:** Cannot find parameter in Remote Config

**Solutions:**

1. Verify you're in the correct Firebase project
2. Check that you published the parameter (not just saved as draft)
3. Refresh the Remote Config page
4. Check project permissions (need Editor or Owner role)

### Analytics Not Tracking Flag Usage

**Symptom:** `feature_flag_checked` events not appearing in Firebase Analytics

**Possible Causes:**

1. **User hasn't given analytics consent:**
   - Check cookie consent status
   - Verify analytics is enabled

2. **Analytics not initialized:**
   - Check browser console for errors
   - Verify Firebase Analytics is configured

3. **Ad blockers:**
   - Ad blockers may block Firebase requests
   - Test in incognito mode

4. **Analytics delay:**
   - Events take 24-48 hours to appear in console
   - Use DebugView for real-time testing

**Debug Steps:**

```javascript
// Check analytics consent
const consent = localStorage.getItem("cookie-consent");
console.log("Cookie consent:", consent);

// Check analytics instance
const analytics = await getFirebaseAnalytics();
console.log("Analytics:", analytics);
```

### Flag Causes Performance Issues

**Symptom:** Page loads slowly when checking flags

**Solutions:**

1. **Cache flag values:**
   - Store in component state
   - Don't fetch on every render

2. **Reduce flag checks:**
   - Check once per component mount
   - Reuse cached values

3. **Use default values:**
   - Provide sensible defaults
   - Don't block rendering on flag fetch

```typescript
// ✅ Good: Non-blocking with default
const [enabled, setEnabled] = useState(false); // Default state

useEffect(() => {
  getFeatureFlag("enable_feature", false).then(setEnabled);
}, []);

// Component renders immediately with default
return enabled ? <NewFeature /> : <OldFeature />;
```

### Flag Behavior Differs Between Environments

**Symptom:** Flag works in development but not in production

**Possible Causes:**

1. **Different Firebase projects:**
   - Development uses different project
   - Check `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

2. **Different fetch intervals:**
   - Development: Immediate
   - Production: 1 hour

3. **Cache differences:**
   - Development may have cleared cache
   - Production may have stale cache

**Solutions:**

1. Verify environment variables in Vercel
2. Check Firebase Console for both projects
3. Wait for cache expiration in production
4. Use same Firebase project for testing

---

## Related Documentation

- [Firebase Remote Config Setup Guide](./firebase-remote-config-setup.md) - Initial setup and configuration
- [Toggle Feature Flag Quick Reference](./TOGGLE-FEATURE-FLAG.md) - Quick reference for toggling flags
- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config) - Official Firebase docs
- [Feature Flag Implementation](../lib/feature-flags.ts) - Source code reference

---

## Examples

### Example 1: Simple Boolean Flag

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  enable_dark_mode: false,
};

// components/ThemeToggle.tsx
import { getFeatureFlag } from "@/lib/feature-flags";

function ThemeToggle() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    getFeatureFlag("enable_dark_mode", false).then(setDarkModeEnabled);
  }, []);

  if (!darkModeEnabled) {
    return null; // Hide toggle if feature is disabled
  }

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

### Example 2: String Flag for API Endpoint

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  api_endpoint: "https://api.example.com/v1",
};

// lib/api.ts
import { getFeatureFlag } from "@/lib/feature-flags";

async function fetchData() {
  const endpoint = await getFeatureFlag("api_endpoint", "https://api.example.com/v1");

  const response = await fetch(`${endpoint}/data`);
  return response.json();
}
```

### Example 3: Number Flag for Configuration

```typescript
// lib/firebase.ts
const REMOTE_CONFIG_DEFAULTS = {
  max_retries: 3,
  timeout_ms: 5000,
};

// lib/api.ts
import { getFeatureFlag } from "@/lib/feature-flags";

async function fetchWithRetry(url: string) {
  const maxRetries = await getFeatureFlag("max_retries", 3);
  const timeout = await getFeatureFlag("timeout_ms", 5000);

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
      return response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Example 4: Conditional Rendering with Flag

```typescript
// components/BetaFeature.tsx
import { getFeatureFlag } from "@/lib/feature-flags";

function BetaFeature() {
  const [showBeta, setShowBeta] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatureFlag("show_beta_features", false)
      .then(setShowBeta)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (!showBeta) {
    return null;
  }

  return (
    <div>
      <Badge>Beta</Badge>
      <NewFeature />
    </div>
  );
}
```

---

**Last Updated:** 2024-01-XX
**Maintained By:** Development Team
**Requirements:** 15.2
