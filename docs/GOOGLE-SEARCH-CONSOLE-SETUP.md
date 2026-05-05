# Google Search Console Setup Guide

## Overview

This guide walks you through submitting your website to Google Search Console and verifying your sitemap for all four domains.

## Prerequisites

- ✅ Sitemap.xml is generated and accessible at `/sitemap.xml`
- ✅ Robots.txt includes sitemap URL
- ✅ Website is deployed and live on all domains

## Domains to Submit

You need to add each domain as a separate property in Google Search Console (11 domains total):

1. `https://rogeriodocarmo.com` (Primary)
2. `https://rogeriodocarmo.io`
3. `https://rogeriodocarmo.info`
4. `https://rogeriodocarmo.click`
5. `https://rogeriodocarmo.shop`
6. `https://rogeriodocarmo.org`
7. `https://rogeriodocarmo.net`
8. `https://rogeriodocarmo.tech`
9. `https://rogeriodocarmo.com.br`
10. `https://rogeriodocarmo.online`
11. `https://rogeriodocarmo.xyz`

---

## Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. If this is your first time, you'll see a welcome screen

---

## Step 2: Add Property (Repeat for Each Domain)

### Option A: URL Prefix Method (Recommended for Static Sites)

1. Click **"Add Property"** button (or the property dropdown in the top-left)
2. Select **"URL prefix"** option
3. Enter the full URL: `https://rogeriodocarmo.com`
4. Click **"Continue"**

### Option B: Domain Property Method (Advanced)

This method covers all subdomains and protocols but requires DNS verification.

1. Click **"Add Property"**
2. Select **"Domain"** option
3. Enter: `rogeriodocarmo.com`
4. Click **"Continue"**
5. Follow DNS TXT record verification (see Step 3)

---

## Step 3: Verify Domain Ownership

Google will present several verification methods. Choose the one that works best for you:

### Method 1: HTML File Upload (Recommended for Static Sites)

1. Download the HTML verification file provided by Google
2. Upload it to your `public/` folder in your Next.js project
3. Commit and deploy the changes
4. Verify the file is accessible: `https://rogeriodocarmo.com/google[...].html`
5. Click **"Verify"** in Google Search Console

**Implementation:**

```bash
# Download the file from Google Search Console
# Move it to your public folder
mv ~/Downloads/google*.html public/

# Commit and deploy
git add public/google*.html
git commit -m "Add Google Search Console verification file"
git push origin main
```

### Method 2: HTML Meta Tag (Alternative)

1. Copy the meta tag provided by Google
2. Add it to your `app/[locale]/layout.tsx` in the `<head>` section
3. Deploy the changes
4. Click **"Verify"** in Google Search Console

**Implementation:**

```tsx
// In app/[locale]/layout.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    // ... existing metadata
    verification: {
      google: "YOUR_VERIFICATION_CODE_HERE", // Add this line
    },
  };
}
```

### Method 3: Google Analytics (If Already Installed)

1. If you have Google Analytics tracking code on your site
2. Select **"Google Analytics"** verification method
3. Click **"Verify"**

### Method 4: Google Tag Manager (If Already Installed)

1. If you have Google Tag Manager on your site
2. Select **"Google Tag Manager"** verification method
3. Click **"Verify"**

### Method 5: DNS TXT Record (For Domain Property)

1. Copy the TXT record provided by Google
2. Add it to your domain's DNS settings (via your domain registrar)
3. Wait for DNS propagation (can take up to 48 hours)
4. Click **"Verify"**

**DNS Record Example:**

```
Type: TXT
Host: @ (or your domain)
Value: google-site-verification=XXXXXXXXXXXXX
TTL: 3600
```

---

## Step 4: Submit Sitemap

Once your property is verified:

1. In Google Search Console, select your property from the dropdown
2. Navigate to **"Sitemaps"** in the left sidebar (under "Indexing")
3. In the "Add a new sitemap" field, enter: `sitemap.xml`
4. Click **"Submit"**

### Expected Result

- Status should change to **"Success"** or **"Fetched"**
- You'll see the number of discovered URLs
- Processing may take a few hours to complete

### Sitemap URLs for Each Domain

- `https://rogeriodocarmo.com/sitemap.xml`
- `https://rogeriodocarmo.io/sitemap.xml`
- `https://rogeriodocarmo.info/sitemap.xml`
- `https://rogeriodocarmo.click/sitemap.xml`
- `https://rogeriodocarmo.shop/sitemap.xml`
- `https://rogeriodocarmo.org/sitemap.xml`
- `https://rogeriodocarmo.net/sitemap.xml`
- `https://rogeriodocarmo.tech/sitemap.xml`
- `https://rogeriodocarmo.com.br/sitemap.xml`
- `https://rogeriodocarmo.online/sitemap.xml`
- `https://rogeriodocarmo.xyz/sitemap.xml`

---

## Step 5: Verify Sitemap Submission

After submitting, check the sitemap status:

1. Go to **"Sitemaps"** section
2. Look for your sitemap in the list
3. Check the status column:
   - ✅ **"Success"**: Sitemap processed successfully
   - ⚠️ **"Couldn't fetch"**: Check URL accessibility
   - ⚠️ **"Has errors"**: Review error details

### Expected Pages in Sitemap

Your sitemap should include:

- 6 pages total (2 pages × 3 locales)
  - Homepage: `/pt-BR/`, `/en/`, `/es/`
  - Tech Stack: `/pt-BR/tech-stack`, `/en/tech-stack`, `/es/tech-stack`

---

## Step 6: Repeat for All Domains

You need to repeat Steps 2-5 for each of your **11 domains**:

### Checklist

- [ ] `https://rogeriodocarmo.com` - Property added and verified
- [ ] `https://rogeriodocarmo.com` - Sitemap submitted
- [ ] `https://rogeriodocarmo.io` - Property added and verified
- [ ] `https://rogeriodocarmo.io` - Sitemap submitted
- [ ] `https://rogeriodocarmo.info` - Property added and verified
- [ ] `https://rogeriodocarmo.info` - Sitemap submitted
- [ ] `https://rogeriodocarmo.click` - Property added and verified
- [ ] `https://rogeriodocarmo.click` - Sitemap submitted
- [ ] `https://rogeriodocarmo.shop` - Property added and verified
- [ ] `https://rogeriodocarmo.shop` - Sitemap submitted
- [ ] `https://rogeriodocarmo.org` - Property added and verified
- [ ] `https://rogeriodocarmo.org` - Sitemap submitted
- [ ] `https://rogeriodocarmo.net` - Property added and verified
- [ ] `https://rogeriodocarmo.net` - Sitemap submitted
- [ ] `https://rogeriodocarmo.tech` - Property added and verified
- [ ] `https://rogeriodocarmo.tech` - Sitemap submitted
- [ ] `https://rogeriodocarmo.com.br` - Property added and verified
- [ ] `https://rogeriodocarmo.com.br` - Sitemap submitted
- [ ] `https://rogeriodocarmo.online` - Property added and verified
- [ ] `https://rogeriodocarmo.online` - Sitemap submitted
- [ ] `https://rogeriodocarmo.xyz` - Property added and verified
- [ ] `https://rogeriodocarmo.xyz` - Sitemap submitted

---

## Troubleshooting

### Issue: "Couldn't fetch sitemap"

**Possible causes:**

- Sitemap URL is incorrect
- Website is not accessible
- Robots.txt is blocking Googlebot

**Solutions:**

1. Verify sitemap is accessible: `curl https://rogeriodocarmo.com/sitemap.xml`
2. Check robots.txt: `curl https://rogeriodocarmo.com/robots.txt`
3. Ensure no firewall or CDN rules are blocking Google's crawlers

### Issue: "Sitemap has errors"

**Possible causes:**

- Invalid XML format
- URLs return 404 errors
- URLs redirect to different locations

**Solutions:**

1. Validate sitemap XML: Use [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
2. Test each URL in the sitemap manually
3. Check for redirect chains

### Issue: "Verification failed"

**Possible causes:**

- Verification file not accessible
- Meta tag not in `<head>` section
- DNS record not propagated

**Solutions:**

1. For HTML file: Verify file is in `public/` folder and deployed
2. For meta tag: Check page source to confirm tag is present
3. For DNS: Wait 24-48 hours for propagation, check with `dig` command

---

## Next Steps

After successful submission:

1. **Wait 24-48 hours** for initial indexing
2. **Monitor Coverage Report**: Check "Pages" section for indexing status
3. **Request Indexing**: Use URL Inspection tool for important pages
4. **Set Up Alerts**: Enable email notifications for crawl errors
5. **Review Performance**: Check "Performance" tab for search analytics

---

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Central](https://developers.google.com/search)

---

## Verification Status Log

Track your verification progress here:

| Domain                        | Property Added | Verified | Verification Method | Sitemap Submitted | Status  |
| ----------------------------- | -------------- | -------- | ------------------- | ----------------- | ------- |
| https://rogeriodocarmo.com    | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.io     | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.info   | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.click  | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.shop   | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.org    | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.net    | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.tech   | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.com.br | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.online | [ ]            | [ ]      |                     | [ ]               | Pending |
| https://rogeriodocarmo.xyz    | [ ]            | [ ]      |                     | [ ]               | Pending |

**Date Started:** **\*\***\_**\*\***

**Date Completed:** **\*\***\_**\*\***

**Notes:**
