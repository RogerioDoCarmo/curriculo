# Security Checklist

Periodic security review for the personal resume website project.
Run through this checklist every **3 months** or after any suspected security incident.

---

## Monthly Checks

### Firebase Console

- [ ] Review Firebase Analytics for unusual traffic spikes or unexpected geographic origins
- [ ] Check Firebase Console → Usage & Billing for unexpected usage
- [ ] Review Firebase Authentication → Authorized domains — ensure only your domains are listed:
  - `rogeriodocarmo.com`
  - `rogeriodocarmo.com.br`
  - `rogeriodocarmo.xyz`
  - `rogeriodocarmo.online`
  - `localhost` (development only)

### Vercel Dashboard

- [ ] Review deployment logs for unexpected deployments
- [ ] Check Vercel Analytics for unusual traffic patterns

---

## Quarterly Checks (Every 3 Months)

### Rotate Secrets

#### 1. Firebase Admin SDK Private Key

1. Go to [Firebase Console](https://console.firebase.google.com) → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the new JSON file
4. Update `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` in:
   - GitHub repository → Settings → Secrets and variables → Actions
   - Your local `.env.local`
5. Delete the old service account key from Firebase Console

#### 2. Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com) → Settings → Tokens
2. Create a new token
3. Update `VERCEL_TOKEN` in GitHub repository secrets
4. Delete the old token from Vercel

#### 3. SonarCloud Token

1. Go to [SonarCloud](https://sonarcloud.io) → My Account → Security
2. Generate a new token
3. Update `SONAR_TOKEN` in GitHub repository secrets
4. Revoke the old token

#### 4. Formspree

1. Go to [Formspree](https://formspree.io) → your form settings
2. Review form submissions for spam
3. Rotate the form endpoint if compromised

---

## Firebase API Key Restrictions (One-time setup, verify quarterly)

Firebase client-side API keys are public by design but should be restricted to your domains:

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Click on your Firebase API key
3. Under "Application restrictions" → select "HTTP referrers (websites)"
4. Add allowed referrers:
   - `https://rogeriodocarmo.com/*`
   - `https://rogeriodocarmo.com.br/*`
   - `https://rogeriodocarmo.xyz/*`
   - `https://rogeriodocarmo.online/*`
   - `http://localhost:3000/*` (development)
5. Under "API restrictions" → restrict to only the APIs your app uses:
   - Firebase Management API
   - Cloud Messaging API
   - Google Analytics API
6. Save changes

---

## Git & Repository Checks

- [ ] Run `git log --all --oneline -- ".env*"` — verify no `.env.local` files were ever committed
- [ ] Run `git log --all --oneline -- "*.pem"` — verify no certificate files were committed
- [ ] Review `.gitignore` still covers: `.env*.local`, `*.pem`, `.vercel/`
- [ ] Check GitHub repository → Settings → Secrets — remove any unused or expired secrets

---

## Dependency Audit

```bash
npm audit
```

- [ ] Review and fix any high/critical vulnerabilities
- [ ] Update dependencies with known vulnerabilities:
  ```bash
  npm audit fix
  ```

### Known Issues (Documented)

#### PostCSS Vulnerability (FIXED ✅)

**Status**: Fixed in commit 269abf7  
**Version**: Updated from 8.5.8 to 8.5.10  
**Severity**: MEDIUM  
**CVE**: XSS via Unescaped `</style>` in CSS Stringify Output

---

## What's Safe to Be Public (No Action Needed)

These values appear in the browser bundle and are intentionally public:

- `NEXT_PUBLIC_FIREBASE_API_KEY` — identifies your Firebase project, protected by domain restrictions and Firebase Security Rules
- `NEXT_PUBLIC_FIREBASE_APP_ID` — public identifier
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` — Analytics measurement ID
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` — public key for FCM web push
- `NEXT_PUBLIC_SENTRY_DSN` — public endpoint for error reporting
- `NEXT_PUBLIC_FORMSPREE_FORM_ID` — public form endpoint

---

## Incident Response

If you suspect a secret has been compromised:

1. **Immediately rotate** the affected secret (see Quarterly Checks above)
2. Check service logs for unauthorized usage:
   - Firebase Console → Usage
   - Vercel → Deployments
   - SonarCloud → Activity
3. Review GitHub Actions run history for unexpected workflow executions
4. If Firebase Admin SDK key was compromised: revoke it immediately in Firebase Console → Service Accounts

---

Last reviewed: _fill in date_
