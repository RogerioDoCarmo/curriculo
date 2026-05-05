# Google Search Console - DNS TXT Record Verification Guide

## Quick Start

This guide shows you how to verify your domains in Google Search Console using DNS TXT records - the most reliable method for multiple domains.

---

## Why DNS TXT Record Method?

✅ **Most Reliable** - No dependency on website files or routing  
✅ **One-Time Setup** - Stays verified permanently  
✅ **Works for All Domains** - Each domain gets its own record  
✅ **No Deployment Needed** - Just update DNS settings  
✅ **No Caching Issues** - Independent of CDN or server caching

---

## Your 11 Domains to Verify

1. rogeriodocarmo.com (Primary)
2. rogeriodocarmo.io
3. rogeriodocarmo.info
4. rogeriodocarmo.click
5. rogeriodocarmo.shop
6. rogeriodocarmo.org
7. rogeriodocarmo.net
8. rogeriodocarmo.tech
9. rogeriodocarmo.com.br
10. rogeriodocarmo.online
11. rogeriodocarmo.xyz

---

## Step-by-Step Process

### Step 1: Add Property in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Select **"URL prefix"** method
4. Enter: `https://rogeriodocarmo.com` (start with your primary domain)
5. Click **"Continue"**

### Step 2: Select DNS Verification Method

1. Google will show several verification methods
2. Scroll down and select **"Domain name provider"** or **"Other"**
3. Look for the **DNS TXT record** option
4. You'll see a verification code like:
   ```
   google-site-verification=abc123xyz789...
   ```
5. **Copy this code** (you'll need it in the next step)

### Step 3: Add TXT Record to Your DNS

#### Where to Add the Record

Log in to your **domain registrar** (where you purchased the domain). Common registrars:

- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Route 53 (AWS)
- etc.

#### DNS Record Settings

Add a new DNS record with these settings:

| Field             | Value                                       |
| ----------------- | ------------------------------------------- |
| **Type**          | TXT                                         |
| **Name/Host**     | @ (or leave blank, or use your domain name) |
| **Value/Content** | `google-site-verification=abc123xyz789...`  |
| **TTL**           | 3600 (or use default)                       |

#### Example for Different Registrars

**GoDaddy:**

- Type: TXT
- Host: @
- TXT Value: google-site-verification=abc123xyz789...
- TTL: 1 Hour

**Namecheap:**

- Type: TXT Record
- Host: @
- Value: google-site-verification=abc123xyz789...
- TTL: Automatic

**Cloudflare:**

- Type: TXT
- Name: @
- Content: google-site-verification=abc123xyz789...
- TTL: Auto

### Step 4: Wait for DNS Propagation

- **Minimum wait**: 5-15 minutes
- **Maximum wait**: Up to 48 hours (rare)
- **Typical wait**: 15-30 minutes

#### Check DNS Propagation

You can verify the TXT record is live using these methods:

**Method 1: Online Tool**

- Visit: https://dnschecker.org/
- Select "TXT" record type
- Enter your domain
- Check if the verification code appears

**Method 2: Command Line (Mac/Linux)**

```bash
dig TXT rogeriodocarmo.com +short
```

**Method 3: Command Line (Windows)**

```cmd
nslookup -type=TXT rogeriodocarmo.com
```

You should see your verification code in the results.

### Step 5: Verify in Google Search Console

1. Go back to Google Search Console
2. Click **"Verify"** button
3. If successful, you'll see: ✅ **"Ownership verified"**
4. If it fails, wait a few more minutes and try again

---

## Repeat for All 11 Domains

You need to repeat Steps 1-5 for each domain. **Important notes:**

- ✅ Each domain gets a **different verification code** from Google
- ✅ You need to add a **separate TXT record** for each domain
- ✅ Use the same DNS registrar account (if all domains are with the same registrar)
- ✅ You can add multiple properties in parallel

---

## Verification Tracking Checklist

| #   | Domain                | Property Added | TXT Record Added | Verified | Sitemap Submitted |
| --- | --------------------- | -------------- | ---------------- | -------- | ----------------- |
| 1   | rogeriodocarmo.com    | [ ]            | [ ]              | [ ]      | [ ]               |
| 2   | rogeriodocarmo.io     | [ ]            | [ ]              | [ ]      | [ ]               |
| 3   | rogeriodocarmo.info   | [ ]            | [ ]              | [ ]      | [ ]               |
| 4   | rogeriodocarmo.click  | [ ]            | [ ]              | [ ]      | [ ]               |
| 5   | rogeriodocarmo.shop   | [ ]            | [ ]              | [ ]      | [ ]               |
| 6   | rogeriodocarmo.org    | [ ]            | [ ]              | [ ]      | [ ]               |
| 7   | rogeriodocarmo.net    | [ ]            | [ ]              | [ ]      | [ ]               |
| 8   | rogeriodocarmo.tech   | [ ]            | [ ]              | [ ]      | [ ]               |
| 9   | rogeriodocarmo.com.br | [ ]            | [ ]              | [ ]      | [ ]               |
| 10  | rogeriodocarmo.online | [ ]            | [ ]              | [ ]      | [ ]               |
| 11  | rogeriodocarmo.xyz    | [ ]            | [ ]              | [ ]      | [ ]               |

---

## After Verification: Submit Sitemaps

Once each domain is verified:

1. In Google Search Console, select the verified property
2. Go to **"Sitemaps"** (left sidebar under "Indexing")
3. Enter: `sitemap.xml`
4. Click **"Submit"**

Your sitemap URLs:

- https://rogeriodocarmo.com/sitemap.xml
- https://rogeriodocarmo.io/sitemap.xml
- https://rogeriodocarmo.info/sitemap.xml
- https://rogeriodocarmo.click/sitemap.xml
- https://rogeriodocarmo.shop/sitemap.xml
- https://rogeriodocarmo.org/sitemap.xml
- https://rogeriodocarmo.net/sitemap.xml
- https://rogeriodocarmo.tech/sitemap.xml
- https://rogeriodocarmo.com.br/sitemap.xml
- https://rogeriodocarmo.online/sitemap.xml
- https://rogeriodocarmo.xyz/sitemap.xml

---

## Troubleshooting

### ❌ Verification Failed

**Possible causes:**

- DNS record not propagated yet → Wait 15-30 more minutes
- Wrong TXT record value → Double-check you copied the full code
- TXT record added to wrong domain → Verify you're editing the correct domain's DNS

**Solutions:**

1. Wait longer (up to 1 hour)
2. Check DNS propagation with `dig` or online tools
3. Verify the TXT record value matches exactly (no extra spaces)
4. Try removing and re-adding the TXT record

### ❌ Can't Find DNS Settings

**Solution:**

- Log in to your domain registrar (where you bought the domain)
- Look for: "DNS Management", "DNS Settings", "Name Servers", or "Advanced DNS"
- If using Cloudflare or another DNS provider, log in there instead

### ❌ Multiple TXT Records

**Question:** Can I have multiple TXT records for the same domain?

**Answer:** Yes! You can have multiple TXT records. This is useful if you need to verify with multiple services (Google, Bing, etc.)

---

## Pro Tips

💡 **Batch Processing**: Open all 11 domains in Google Search Console and get all verification codes first, then add all TXT records at once

💡 **Keep Records**: Don't delete the TXT records after verification - they need to stay for ongoing verification

💡 **Documentation**: Save your verification codes in a secure note for future reference

💡 **Monitoring**: Set up email alerts in Google Search Console for each property to get notified of issues

---

## Next Steps After Verification

1. ✅ Submit sitemaps for all domains
2. ✅ Wait 24-48 hours for initial indexing
3. ✅ Check "Pages" report for indexing status
4. ✅ Use URL Inspection tool for important pages
5. ✅ Monitor "Performance" tab for search analytics

---

## Need Help?

- [Google Search Console Help](https://support.google.com/webmasters)
- [DNS TXT Record Guide](https://support.google.com/a/answer/183895)
- [DNS Propagation Checker](https://dnschecker.org/)

---

**Date Started:** **\*\*\*\***\_**\*\*\*\***

**Date Completed:** **\*\*\*\***\_**\*\*\*\***

**Notes:**
