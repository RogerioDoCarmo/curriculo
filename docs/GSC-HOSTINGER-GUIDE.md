# Google Search Console Verification - Hostinger Specific Guide

## Overview

This guide provides step-by-step instructions for adding Google Search Console DNS TXT records specifically for domains registered with **Hostinger**.

---

## Prerequisites

- ✅ All 11 domains registered with Hostinger
- ✅ Access to your Hostinger account
- ✅ Google Search Console account

---

## Your 11 Domains

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

## Part 1: Get Verification Code from Google Search Console

### For Each Domain (Repeat 11 Times):

1. **Go to Google Search Console**
   - Visit: https://search.google.com/search-console
   - Sign in with your Google account

2. **Add New Property**
   - Click **"Add Property"** button (top-left dropdown)
   - Select **"URL prefix"** method
   - Enter: `https://rogeriodocarmo.com` (start with first domain)
   - Click **"Continue"**

3. **Select DNS Verification**
   - You'll see several verification methods
   - Look for **"Domain name provider"** or scroll down
   - Select **"Other"** or find the DNS TXT record option
   - You'll see a verification code like:
     ```
     google-site-verification=abc123xyz789defghijklmnop
     ```

4. **Copy the Verification Code**
   - Copy the ENTIRE code (everything after `google-site-verification=`)
   - Keep this tab open - you'll need to click "Verify" later

5. **Repeat for All Domains**
   - Open 11 tabs in Google Search Console
   - Get verification codes for all domains
   - Keep all tabs open

---

## Part 2: Add TXT Records in Hostinger

### Step-by-Step for Hostinger:

#### 1. Log in to Hostinger

- Go to: https://hpanel.hostinger.com/
- Enter your email and password
- Click **"Log In"**

#### 2. Navigate to DNS Zone Editor

**Option A: From Dashboard**

- Click on **"Domains"** in the top menu
- Find your domain (e.g., `rogeriodocarmo.com`)
- Click **"Manage"** next to the domain

**Option B: Direct Access**

- Go to **"Domains"** → **"DNS / Nameservers"**
- Select your domain from the dropdown

#### 3. Access DNS Records

- Look for **"DNS Zone Editor"** or **"Manage DNS Records"**
- Click on it
- You'll see a list of existing DNS records (A, CNAME, MX, etc.)

#### 4. Add New TXT Record

1. **Click "Add Record"** or **"Add New Record"** button

2. **Fill in the TXT Record Details:**

   | Field                    | Value                                             |
   | ------------------------ | ------------------------------------------------- |
   | **Type**                 | Select **"TXT"** from dropdown                    |
   | **Name**                 | Enter **"@"** (without quotes)                    |
   | **Value** or **Content** | Paste: `google-site-verification=abc123xyz789...` |
   | **TTL**                  | Leave default (usually 3600 or 14400)             |

   **Important Notes:**
   - ✅ Use **@** for the Name field (represents root domain)
   - ✅ Paste the FULL verification code including `google-site-verification=`
   - ✅ Do NOT add quotes around the value
   - ✅ Make sure there are no extra spaces

3. **Click "Add Record"** or **"Save"**

4. **Verify the Record Was Added**
   - You should see the new TXT record in the list
   - It will show:
     - Type: TXT
     - Name: @ or your domain name
     - Value: google-site-verification=...

#### 5. Repeat for All 11 Domains

**Important:** Each domain needs its own TXT record with its unique verification code from Google.

**Process:**

1. In Hostinger, go back to **"Domains"**
2. Select the next domain (e.g., `rogeriodocarmo.io`)
3. Go to **"DNS Zone Editor"**
4. Add TXT record with that domain's verification code
5. Repeat for all 11 domains

---

## Part 3: Wait for DNS Propagation

### Typical Wait Time for Hostinger:

- **Minimum**: 5-15 minutes
- **Average**: 15-30 minutes
- **Maximum**: Up to 24 hours (rare)

### Check DNS Propagation

**Method 1: Online Tool**

1. Go to: https://dnschecker.org/
2. Select **"TXT"** from the dropdown
3. Enter your domain: `rogeriodocarmo.com`
4. Click **"Search"**
5. Look for your `google-site-verification` code in the results
6. Check multiple locations - should show green checkmarks

**Method 2: Command Line (Mac/Linux)**

```bash
dig TXT rogeriodocarmo.com +short
```

**Method 3: Command Line (Windows)**

```cmd
nslookup -type=TXT rogeriodocarmo.com
```

**What to Look For:**
You should see your verification code in the output:

```
"google-site-verification=abc123xyz789..."
```

---

## Part 4: Verify in Google Search Console

### For Each Domain:

1. **Go back to Google Search Console tab**
   - The tab where you got the verification code

2. **Click "Verify" Button**
   - If successful: ✅ **"Ownership verified"**
   - If failed: Wait 10-15 more minutes and try again

3. **Troubleshooting Failed Verification**
   - Check DNS propagation (use dnschecker.org)
   - Verify the TXT record value is correct in Hostinger
   - Make sure you used **@** for the Name field
   - Wait longer (up to 1 hour)
   - Try removing and re-adding the TXT record

4. **Repeat for All 11 Domains**

---

## Part 5: Submit Sitemaps

### After Each Domain is Verified:

1. **In Google Search Console**
   - Select the verified property from the dropdown
   - Click **"Sitemaps"** in the left sidebar (under "Indexing")

2. **Add Sitemap**
   - In the "Add a new sitemap" field, enter: `sitemap.xml`
   - Click **"Submit"**

3. **Verify Submission**
   - Status should show **"Success"** or **"Fetched"**
   - You'll see the number of discovered URLs

4. **Repeat for All 11 Domains**

---

## Hostinger-Specific Tips

### 💡 Tip 1: Batch Processing

Since all domains are in Hostinger, you can:

1. Open multiple browser tabs for each domain's DNS editor
2. Add all TXT records in quick succession
3. Then verify all domains in Google Search Console

### 💡 Tip 2: DNS Propagation

Hostinger typically propagates DNS changes within 15-30 minutes, but can take up to 24 hours.

### 💡 Tip 3: Multiple TXT Records

You can have multiple TXT records for the same domain. This is useful for:

- Google Search Console
- Bing Webmaster Tools
- Email verification (SPF, DKIM)
- Other services

### 💡 Tip 4: Don't Delete TXT Records

Keep the TXT records permanently. Google needs them for ongoing verification.

### 💡 Tip 5: Hostinger Support

If you have issues:

- Hostinger Live Chat: Available 24/7
- Hostinger Knowledge Base: https://support.hostinger.com/
- Search for: "How to add TXT record"

---

## Visual Guide: Hostinger DNS Zone Editor

### What You'll See in Hostinger:

```
┌─────────────────────────────────────────────────────────────┐
│ DNS Zone Editor - rogeriodocarmo.com                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Add Record] button                                          │
│                                                              │
│ Existing Records:                                            │
│ ┌──────┬──────┬─────────────────────────┬──────┐           │
│ │ Type │ Name │ Value                   │ TTL  │ Actions   │
│ ├──────┼──────┼─────────────────────────┼──────┤           │
│ │ A    │ @    │ 76.76.21.21            │ 3600 │ Edit Del  │
│ │ A    │ www  │ 76.76.21.21            │ 3600 │ Edit Del  │
│ │ MX   │ @    │ mail.example.com       │ 3600 │ Edit Del  │
│ │ TXT  │ @    │ google-site-verif...   │ 3600 │ Edit Del  │ ← Your new record
│ └──────┴──────┴─────────────────────────┴──────┘           │
└─────────────────────────────────────────────────────────────┘
```

### When Adding New TXT Record:

```
┌─────────────────────────────────────────────────────────────┐
│ Add New DNS Record                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Type: [TXT ▼]                                               │
│                                                              │
│ Name: [@                                    ]                │
│                                                              │
│ Value: [google-site-verification=abc123xyz789...          ] │
│                                                              │
│ TTL: [3600                                  ]                │
│                                                              │
│                    [Cancel]  [Add Record]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Verification Tracking Checklist

Use this to track your progress:

| #   | Domain                | GSC Property | TXT Added | DNS Propagated | Verified | Sitemap |
| --- | --------------------- | ------------ | --------- | -------------- | -------- | ------- |
| 1   | rogeriodocarmo.com    | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 2   | rogeriodocarmo.io     | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 3   | rogeriodocarmo.info   | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 4   | rogeriodocarmo.click  | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 5   | rogeriodocarmo.shop   | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 6   | rogeriodocarmo.org    | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 7   | rogeriodocarmo.net    | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 8   | rogeriodocarmo.tech   | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 9   | rogeriodocarmo.com.br | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 10  | rogeriodocarmo.online | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |
| 11  | rogeriodocarmo.xyz    | [ ]          | [ ]       | [ ]            | [ ]      | [ ]     |

---

## Troubleshooting

### ❌ Can't Find DNS Zone Editor in Hostinger

**Solution:**

1. Go to **hPanel** (Hostinger control panel)
2. Click **"Domains"** in the top menu
3. Find your domain in the list
4. Click **"Manage"** button
5. Look for **"DNS / Nameservers"** section
6. Click **"DNS Zone Editor"** or **"Manage DNS"**

### ❌ TXT Record Not Showing in DNS Checker

**Possible Causes:**

- DNS hasn't propagated yet → Wait 15-30 more minutes
- TXT record was added incorrectly → Check Hostinger DNS editor
- Wrong Name field → Should be **@** not blank or domain name

**Solution:**

1. Log back into Hostinger
2. Go to DNS Zone Editor
3. Verify the TXT record exists and value is correct
4. Wait 30 minutes and check again

### ❌ Google Says "Verification Failed"

**Possible Causes:**

- DNS not propagated → Wait longer
- Wrong verification code → Double-check you copied the full code
- TXT record syntax error → Check for extra spaces or quotes

**Solution:**

1. Use dnschecker.org to verify TXT record is live
2. Make sure the verification code matches exactly
3. Wait 1 hour and try again
4. If still failing, remove and re-add the TXT record in Hostinger

### ❌ Multiple Domains, Same Verification Code?

**Answer:** No! Each domain gets a unique verification code from Google Search Console. You must:

1. Add each domain as a separate property in GSC
2. Get a unique verification code for each
3. Add a separate TXT record for each domain in Hostinger

---

## Quick Reference Card

### Hostinger TXT Record Settings:

```
Type:  TXT
Name:  @
Value: google-site-verification=YOUR_CODE_HERE
TTL:   3600 (or default)
```

### Hostinger URLs:

- **Login**: https://hpanel.hostinger.com/
- **Support**: https://support.hostinger.com/
- **Live Chat**: Available in hPanel (bottom-right corner)

### DNS Propagation Check:

- **Online**: https://dnschecker.org/ (select TXT)
- **Command**: `dig TXT yourdomain.com +short`

---

## Timeline Estimate

For all 11 domains:

| Task                         | Time per Domain | Total Time     |
| ---------------------------- | --------------- | -------------- |
| Get GSC verification codes   | 2 min           | 22 min         |
| Add TXT records in Hostinger | 2 min           | 22 min         |
| Wait for DNS propagation     | 15-30 min       | 15-30 min      |
| Verify in GSC                | 1 min           | 11 min         |
| Submit sitemaps              | 1 min           | 11 min         |
| **Total**                    | -               | **~1-2 hours** |

**Pro Tip:** Do all GSC properties first, then all Hostinger TXT records, then wait for propagation, then verify all at once.

---

## Next Steps After Verification

1. ✅ Monitor "Pages" report in GSC for indexing status
2. ✅ Check "Performance" tab after 48 hours for search analytics
3. ✅ Set up email alerts for crawl errors
4. ✅ Use URL Inspection tool for important pages
5. ✅ Review "Coverage" report weekly

---

## Need Help?

- **Hostinger Support**: Live chat in hPanel (24/7)
- **Hostinger Tutorials**: https://support.hostinger.com/en/collections/1742614-dns
- **Google Search Console Help**: https://support.google.com/webmasters

---

**Date Started:** **\*\*\*\***\_**\*\*\*\***

**Date Completed:** **\*\*\*\***\_**\*\*\*\***

**Notes:**
