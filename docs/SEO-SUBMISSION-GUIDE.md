# SEO Submission Guide

## Overview

This guide provides step-by-step instructions for submitting your sitemap and robots.txt to major search engines to improve SEO and ensure your site is properly indexed.

## Prerequisites

Before submitting to search engines, verify:

- ✅ Site is deployed to production
- ✅ All four domains are working:
  - https://rogeriodocarmo.com
  - https://rogeriodocarmo.com.br
  - https://rogeriodocarmo.xyz
  - https://rogeriodocarmo.online
- ✅ Sitemap is accessible: `/sitemap.xml`
- ✅ Robots.txt is accessible: `/robots.txt`

## Quick Links

### Search Engine Webmaster Tools

- **Google Search Console**: https://search.google.com/search-console
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **Yandex Webmaster** (optional): https://webmaster.yandex.com/

### Your Sitemap URLs

- Primary: `https://rogeriodocarmo.com/sitemap.xml`
- Brazil: `https://rogeriodocarmo.com.br/sitemap.xml`
- XYZ: `https://rogeriodocarmo.xyz/sitemap.xml`
- Online: `https://rogeriodocarmo.online/sitemap.xml`

### Your Robots.txt URLs

- Primary: `https://rogeriodocarmo.com/robots.txt`
- Brazil: `https://rogeriodocarmo.com.br/robots.txt`
- XYZ: `https://rogeriodocarmo.xyz/robots.txt`
- Online: `https://rogeriodocarmo.online/robots.txt`

---

## Step 1: Verify Sitemap and Robots.txt

### Check Sitemap

1. Open your browser and visit: `https://rogeriodocarmo.com/sitemap.xml`
2. Verify the XML loads correctly
3. Check that all pages are listed:
   - Homepage (3 locales: `/`, `/en`, `/es`)
   - All routes for each locale
4. Verify `lastmod`, `changefreq`, and `priority` are set
5. Repeat for all four domains

### Check Robots.txt

1. Visit: `https://rogeriodocarmo.com/robots.txt`
2. Verify it contains:

   ```
   User-agent: *
   Allow: /

   Sitemap: https://rogeriodocarmo.com/sitemap.xml
   ```

3. Repeat for all four domains

---

## Step 2: Submit to Google Search Console

### Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Choose **"URL prefix"** method
4. Enter: `https://rogeriodocarmo.com`
5. Click **"Continue"**

### Verify Ownership

Choose one of these verification methods:

#### Option 1: HTML File Upload (Recommended for Static Sites)

1. Download the HTML verification file
2. Upload to `/public/` directory in your project
3. Deploy to production
4. Click **"Verify"** in Search Console

#### Option 2: HTML Meta Tag

1. Copy the meta tag provided
2. Add to `app/[locale]/layout.tsx` in the `<head>` section
3. Deploy to production
4. Click **"Verify"** in Search Console

#### Option 3: Google Analytics

1. If you already have Google Analytics installed
2. Select this option
3. Click **"Verify"**

### Submit Sitemap

1. After verification, go to **"Sitemaps"** in the left sidebar
2. Enter sitemap URL: `https://rogeriodocarmo.com/sitemap.xml`
3. Click **"Submit"**
4. Wait for processing (may take a few hours to a few days)
5. Check status: should show "Success" with number of discovered URLs

### Repeat for All Domains

Add each domain as a separate property:

- `https://rogeriodocarmo.com` ✅
- `https://rogeriodocarmo.com.br`
- `https://rogeriodocarmo.xyz`
- `https://rogeriodocarmo.online`

---

## Step 3: Submit to Bing Webmaster Tools

### Add Site

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Click **"Add a site"**
4. Enter: `https://rogeriodocarmo.com`

### Verify Ownership

Choose one of these methods:

#### Option 1: XML File

1. Download the XML verification file
2. Upload to `/public/` directory
3. Deploy to production
4. Click **"Verify"**

#### Option 2: Meta Tag

1. Copy the meta tag
2. Add to `app/[locale]/layout.tsx`
3. Deploy to production
4. Click **"Verify"**

#### Option 3: CNAME Record

1. Add CNAME record to your DNS settings
2. Wait for DNS propagation (up to 48 hours)
3. Click **"Verify"**

### Submit Sitemap

1. After verification, go to **"Sitemaps"** section
2. Click **"Submit sitemap"**
3. Enter: `https://rogeriodocarmo.com/sitemap.xml`
4. Click **"Submit"**
5. Check status after a few hours

### Repeat for All Domains

Add each domain separately in Bing Webmaster Tools.

---

## Step 4: Submit to Yandex (Optional)

**Note**: Only necessary if targeting Russian-speaking audience.

1. Go to [Yandex Webmaster](https://webmaster.yandex.com/)
2. Sign in with Yandex account
3. Click **"Add site"**
4. Enter: `https://rogeriodocarmo.com`
5. Verify ownership (similar to Google/Bing)
6. Navigate to **"Indexing"** → **"Sitemap files"**
7. Add sitemap URL: `https://rogeriodocarmo.com/sitemap.xml`
8. Click **"Add"**

---

## Step 5: Monitor Indexing Status

### Google Search Console

**Wait 24-48 hours after submission**, then:

1. Go to **"Coverage"** or **"Pages"** report
2. Check **"Valid"** pages count
   - Should match your sitemap page count (9 pages: 3 locales × 3 routes)
3. Review any **"Errors"** or **"Warnings"**
4. Check **"Enhancements"** for structured data issues
5. Use **"URL Inspection"** tool to test specific pages

### Bing Webmaster Tools

**Wait 24-48 hours after submission**, then:

1. Go to **"Site Explorer"**
2. Check indexed pages count
3. Review **"URL Inspection"** for crawl errors
4. Check **"SEO Reports"** for issues

### Test Search Visibility

**Google Search**:

```
site:rogeriodocarmo.com
```

**Bing Search**:

```
site:rogeriodocarmo.com
```

Verify:

- All pages appear in results
- Meta descriptions are correct
- Titles are correct
- Structured data appears (rich snippets)

---

## Step 6: Set Up Monitoring

### Google Search Console

1. Go to **"Settings"** → **"Users and permissions"**
2. Add team members if needed
3. Go to **"Settings"** → **"Email notifications"**
4. Enable notifications for:
   - Critical site errors
   - Manual actions
   - Security issues
   - New messages

### Bing Webmaster Tools

1. Go to **"Settings"** → **"Email preferences"**
2. Enable email alerts for:
   - Crawl errors
   - Security issues
   - Site messages

### Weekly Monitoring (First Month)

Check these metrics weekly:

- ✅ Indexed pages count
- ✅ Coverage errors
- ✅ Crawl errors
- ✅ Structured data issues
- ✅ Mobile usability issues
- ✅ Core Web Vitals

After the first month, check monthly.

---

## Step 7: Request Indexing for Important Pages

### Google Search Console

1. Go to **"URL Inspection"** tool
2. Enter URL: `https://rogeriodocarmo.com/`
3. Click **"Request Indexing"**
4. Repeat for important pages:
   - `/en` (English homepage)
   - `/es` (Spanish homepage)
   - `/en#projects` (Projects section)
   - `/en#experience` (Experience section)

**Note**: You can only request indexing for a limited number of URLs per day (quota varies).

### Bing Webmaster Tools

1. Go to **"URL Submission"**
2. Enter URLs (up to 10 per day for free accounts)
3. Click **"Submit"**

---

## Troubleshooting

### Sitemap Not Found

**Error**: "Sitemap could not be read"

**Solutions**:

1. Verify sitemap URL is accessible in browser
2. Check for HTTPS certificate issues
3. Verify sitemap XML is valid (use [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html))
4. Check robots.txt doesn't block sitemap

### Pages Not Indexed

**Error**: "Discovered - currently not indexed"

**Solutions**:

1. Wait longer (can take weeks for new sites)
2. Request indexing manually via URL Inspection
3. Check for crawl errors in Coverage report
4. Verify robots.txt allows crawling
5. Check for `noindex` meta tags in pages
6. Improve page quality and content

### Verification Failed

**Error**: "Verification failed"

**Solutions**:

1. Clear browser cache and try again
2. Verify file/meta tag is in production (not just local)
3. Check file permissions (should be publicly accessible)
4. Wait a few minutes and retry
5. Try alternative verification method

### Duplicate Content Issues

**Error**: "Duplicate without user-selected canonical"

**Solutions**:

1. Add canonical tags to all pages
2. Use `rel="alternate" hreflang` for multi-language pages
3. Ensure all four domains point to same content (not duplicates)
4. Consider setting one domain as primary in Search Console

---

## Best Practices

### Do's ✅

- ✅ Submit sitemap within 24 hours of site launch
- ✅ Update sitemap whenever you add/remove pages
- ✅ Monitor Search Console weekly for first month
- ✅ Fix crawl errors promptly
- ✅ Keep structured data valid
- ✅ Maintain good Core Web Vitals scores
- ✅ Use descriptive, unique meta descriptions
- ✅ Implement proper canonical tags
- ✅ Use hreflang tags for multi-language content

### Don'ts ❌

- ❌ Don't submit sitemap multiple times per day
- ❌ Don't ignore Search Console warnings
- ❌ Don't use duplicate content across domains
- ❌ Don't block important pages in robots.txt
- ❌ Don't use `noindex` on pages you want indexed
- ❌ Don't forget to update sitemap after major changes
- ❌ Don't ignore mobile usability issues
- ❌ Don't use black-hat SEO techniques

---

## Expected Timeline

| Action                      | Timeline    |
| --------------------------- | ----------- |
| Sitemap submission          | Immediate   |
| Sitemap processing          | 1-24 hours  |
| First pages indexed         | 24-48 hours |
| Full site indexed           | 1-4 weeks   |
| Appearing in search results | 2-8 weeks   |
| Ranking improvements        | 3-6 months  |

**Note**: New sites take longer to index than established sites.

---

## Additional Resources

### Google Resources

- [Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Structured Data Guide](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

### Bing Resources

- [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
- [Bing SEO Guide](https://www.bing.com/webmasters/help/bing-seo-guide-c3c3c3c3)

### Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Robots.txt Tester](https://support.google.com/webmasters/answer/6062598)

---

## Checklist

Use this checklist to track your progress:

- [ ] Verified sitemap.xml is accessible on all domains
- [ ] Verified robots.txt is accessible on all domains
- [ ] Added property in Google Search Console for primary domain
- [ ] Verified ownership in Google Search Console
- [ ] Submitted sitemap to Google Search Console
- [ ] Added properties for all 4 domains in Google Search Console
- [ ] Added site in Bing Webmaster Tools for primary domain
- [ ] Verified ownership in Bing Webmaster Tools
- [ ] Submitted sitemap to Bing Webmaster Tools
- [ ] Added all 4 domains in Bing Webmaster Tools
- [ ] (Optional) Submitted to Yandex Webmaster
- [ ] Set up email notifications in Google Search Console
- [ ] Set up email notifications in Bing Webmaster Tools
- [ ] Requested indexing for important pages
- [ ] Tested site search visibility (site:rogeriodocarmo.com)
- [ ] Documented submission details in SEO-SUBMISSION-LOG.md
- [ ] Set up weekly monitoring schedule

---

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review Search Console Help documentation
3. Search for specific error messages in Google/Bing forums
4. Consider consulting an SEO specialist for complex issues

---

**Last Updated**: 2026-04-30
**Version**: 1.0.0
