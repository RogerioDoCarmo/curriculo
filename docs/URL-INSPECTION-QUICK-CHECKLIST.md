# URL Inspection & Monitoring - Quick Checklist

**Domain**: rogeriodocarmo.com  
**Date**: May 5, 2026

Use this checklist to complete Task 32.8 quickly.

---

## ✅ Google Search Console - URL Inspection

### Step 1: Inspect All Pages

Go to [Google Search Console](https://search.google.com/search-console) → Select `rogeriodocarmo.com` → Use "Inspect any URL" search bar

- [ ] **Homepage (Portuguese)**: `https://rogeriodocarmo.com/`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

- [ ] **Homepage (English)**: `https://rogeriodocarmo.com/en`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

- [ ] **Homepage (Spanish)**: `https://rogeriodocarmo.com/es`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

- [ ] **Tech Stack (Portuguese)**: `https://rogeriodocarmo.com/pt-BR/tech-stack`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

- [ ] **Tech Stack (English)**: `https://rogeriodocarmo.com/en/tech-stack`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

- [ ] **Tech Stack (Spanish)**: `https://rogeriodocarmo.com/es/tech-stack`
  - Status: **\*\***\_\_\_**\*\***
  - Issues: **\*\***\_\_\_**\*\***

---

## ✅ Request Indexing (If Needed)

For any page showing "URL is not on Google" or "Discovered - currently not indexed":

- [ ] Homepage (Portuguese) - Request indexing
- [ ] Homepage (English) - Request indexing
- [ ] Homepage (Spanish) - Request indexing
- [ ] Tech Stack (Portuguese) - Request indexing
- [ ] Tech Stack (English) - Request indexing
- [ ] Tech Stack (Spanish) - Request indexing

**Note**: Click "Request Indexing" button after inspecting each URL. Wait 1-2 minutes for live test.

---

## ✅ Google Search Console - Email Notifications

Go to [Google Search Console](https://search.google.com/search-console) → Settings (⚙️) → Users and permissions

- [ ] Verify your email is listed as property owner
- [ ] Enable **Site issues** notifications
- [ ] Enable **Manual actions** notifications
- [ ] Enable **Security issues** notifications
- [ ] Enable **Coverage issues** notifications
- [ ] (Optional) Enable **Performance** notifications
- [ ] Check inbox for test email from `search-console-noreply@google.com`
- [ ] Mark email as "Not Spam" if needed

---

## ✅ Bing Webmaster Tools - Email Alerts

Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) → Settings → Notifications

- [ ] Enable **Crawl errors** alerts
- [ ] Enable **Malware detected** alerts
- [ ] Enable **Manual actions** alerts
- [ ] Enable **Indexing issues** alerts
- [ ] (Optional) Enable **Weekly reports**
- [ ] (Optional) Enable **SEO opportunities**
- [ ] Save settings
- [ ] Check inbox for test email from Bing

---

## ✅ Coverage Reports - Initial Check

### Google Search Console

Go to [Google Search Console](https://search.google.com/search-console) → Coverage (or Pages)

- [ ] Check **Valid pages** count: **\_** (target: 6)
- [ ] Check **Excluded pages** count: **\_** (should decrease over time)
- [ ] Check **Error pages** count: **\_** (target: 0)
- [ ] Review any errors or warnings
- [ ] Verify sitemap status: **\*\***\_\_\_**\*\***

### Bing Webmaster Tools

Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) → Site Scan

- [ ] Run site scan
- [ ] Check **SEO issues** count: **\_** (target: 0)
- [ ] Check **Crawl errors** count: **\_** (target: 0)
- [ ] Review recommendations
- [ ] Verify sitemap status: **\*\***\_\_\_**\*\***

---

## 📅 Weekly Monitoring Schedule (First Month)

### Week 1

- [ ] **Day 1-2**: Complete all setup tasks above
- [ ] **Day 3-4**: Check coverage reports
- [ ] **Day 5-7**: Re-inspect URLs, check for progress

### Week 2

- [ ] Review GSC Coverage report
- [ ] Review Bing Site Scan
- [ ] Check email notifications
- [ ] Test `site:rogeriodocarmo.com` search

### Week 3

- [ ] Review GSC Coverage report
- [ ] Review Bing Site Scan
- [ ] Check indexed page count (should be increasing)
- [ ] Address any new issues

### Week 4

- [ ] Review GSC Coverage report
- [ ] Review Bing Site Scan
- [ ] Verify all 6 pages are indexed
- [ ] Check search performance data (if available)

---

## 📊 Success Criteria

Task 32.8 is complete when:

- ✅ All 6 URLs inspected in Google Search Console
- ✅ Indexing requested for priority pages (if needed)
- ✅ Email notifications enabled in GSC
- ✅ Email alerts enabled in Bing Webmaster Tools
- ✅ Initial coverage reports reviewed
- ✅ Weekly monitoring schedule established

---

## 🚨 Common Issues & Quick Fixes

| Issue                                | Quick Fix                                                     |
| ------------------------------------ | ------------------------------------------------------------- |
| "URL is not on Google"               | Request indexing, wait 3-7 days                               |
| "Discovered - currently not indexed" | Request indexing, add internal links                          |
| "Server error (5xx)"                 | Check Vercel deployment, review logs                          |
| "Redirect error"                     | Test redirects, check Vercel config                           |
| No email notifications               | Check spam folder, verify email address                       |
| Sitemap not found                    | Verify `https://rogeriodocarmo.com/sitemap.xml` is accessible |

---

## 📚 Full Documentation

For detailed instructions, see:

- [URL Inspection & Monitoring Guide](./URL-INSPECTION-MONITORING-GUIDE.md) - Complete guide
- [Search Visibility Test Results](./SEARCH-VISIBILITY-TEST.md) - Latest test results
- [Google Search Console Setup](./GOOGLE-SEARCH-CONSOLE-SETUP.md) - GSC setup guide

---

**Completion Date**: **\*\***\_\_\_**\*\***  
**Completed By**: **\*\***\_\_\_**\*\***  
**Notes**: **\*\***\_\_\_**\*\***
