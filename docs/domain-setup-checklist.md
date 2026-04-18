# Domain Setup Checklist - Task 21.6

Track your progress configuring custom domains for the personal resume website.

## 📋 Pre-Configuration

- [ ] Vercel project is deployed and accessible
- [ ] Access to Vercel dashboard (https://vercel.com/)
- [ ] Access to Hostinger account
- [ ] All 4 domains registered in Hostinger

## 🌐 Domain 1: rogeriodocarmo.com (Primary)

### Vercel Configuration

- [ ] Added domain to Vercel project
- [ ] Noted Vercel IP address: `___________________`
- [ ] Domain shows in Vercel domains list

### Hostinger DNS Configuration

- [ ] Logged into Hostinger
- [ ] Navigated to DNS management for rogeriodocarmo.com
- [ ] Removed conflicting A records (if any)
- [ ] Added A record: `@` → `[Vercel IP]` (TTL: 3600)
- [ ] Added A record: `www` → `[Vercel IP]` (TTL: 3600)
- [ ] Saved DNS changes

### Verification

- [ ] DNS propagation started (check: https://dnschecker.org/)
- [ ] Vercel shows "Valid Configuration" ✅
- [ ] HTTPS working: https://rogeriodocarmo.com 🔒
- [ ] HTTPS working: https://www.rogeriodocarmo.com 🔒
- [ ] Set as primary domain in Vercel

## 🌐 Domain 2: rogeriodocarmo.com.br

### Vercel Configuration

- [ ] Added domain to Vercel project
- [ ] Noted Vercel IP address: `___________________`
- [ ] Domain shows in Vercel domains list

### Hostinger DNS Configuration

- [ ] Logged into Hostinger
- [ ] Navigated to DNS management for rogeriodocarmo.com.br
- [ ] Removed conflicting A records (if any)
- [ ] Added A record: `@` → `[Vercel IP]` (TTL: 3600)
- [ ] Added A record: `www` → `[Vercel IP]` (TTL: 3600)
- [ ] Saved DNS changes

### Verification

- [ ] DNS propagation started (check: https://dnschecker.org/)
- [ ] Vercel shows "Valid Configuration" ✅
- [ ] HTTPS working: https://rogeriodocarmo.com.br 🔒
- [ ] HTTPS working: https://www.rogeriodocarmo.com.br 🔒

## 🌐 Domain 3: rogeriodocarmo.xyz

### Vercel Configuration

- [ ] Added domain to Vercel project
- [ ] Noted Vercel IP address: `___________________`
- [ ] Domain shows in Vercel domains list

### Hostinger DNS Configuration

- [ ] Logged into Hostinger
- [ ] Navigated to DNS management for rogeriodocarmo.xyz
- [ ] Removed conflicting A records (if any)
- [ ] Added A record: `@` → `[Vercel IP]` (TTL: 3600)
- [ ] Added A record: `www` → `[Vercel IP]` (TTL: 3600)
- [ ] Saved DNS changes

### Verification

- [ ] DNS propagation started (check: https://dnschecker.org/)
- [ ] Vercel shows "Valid Configuration" ✅
- [ ] HTTPS working: https://rogeriodocarmo.xyz 🔒
- [ ] HTTPS working: https://www.rogeriodocarmo.xyz 🔒

## 🌐 Domain 4: rogeriodocarmo.online

### Vercel Configuration

- [ ] Added domain to Vercel project
- [ ] Noted Vercel IP address: `___________________`
- [ ] Domain shows in Vercel domains list

### Hostinger DNS Configuration

- [ ] Logged into Hostinger
- [ ] Navigated to DNS management for rogeriodocarmo.online
- [ ] Removed conflicting A records (if any)
- [ ] Added A record: `@` → `[Vercel IP]` (TTL: 3600)
- [ ] Added A record: `www` → `[Vercel IP]` (TTL: 3600)
- [ ] Saved DNS changes

### Verification

- [ ] DNS propagation started (check: https://dnschecker.org/)
- [ ] Vercel shows "Valid Configuration" ✅
- [ ] HTTPS working: https://rogeriodocarmo.online 🔒
- [ ] HTTPS working: https://www.rogeriodocarmo.online 🔒

## ✅ Final Verification

### Content Consistency

- [ ] All 4 domains serve identical content
- [ ] Navigation works on all domains
- [ ] Images load on all domains
- [ ] Forms work on all domains
- [ ] Language switching works on all domains

### SSL/HTTPS

- [ ] All domains have valid SSL certificates
- [ ] No mixed content warnings
- [ ] HSTS enabled (automatic with Vercel)
- [ ] Certificate auto-renewal configured (automatic with Vercel)

### SEO Configuration

- [ ] Primary domain set to rogeriodocarmo.com
- [ ] Canonical URLs point to primary domain
- [ ] Sitemap accessible on all domains
- [ ] robots.txt accessible on all domains

### Performance

- [ ] All domains load quickly (< 3s)
- [ ] No redirect loops
- [ ] CDN working correctly

## 🔧 Troubleshooting Log

Use this section to note any issues encountered:

### Domain 1 Issues:

```
Date: ___________
Issue: ___________________________________________
Solution: _________________________________________
```

### Domain 2 Issues:

```
Date: ___________
Issue: ___________________________________________
Solution: _________________________________________
```

### Domain 3 Issues:

```
Date: ___________
Issue: ___________________________________________
Solution: _________________________________________
```

### Domain 4 Issues:

```
Date: ___________
Issue: ___________________________________________
Solution: _________________________________________
```

## 📊 DNS Propagation Status

Check propagation status for each domain:

| Domain                | Status     | Checked At   | Notes          |
| --------------------- | ---------- | ------------ | -------------- |
| rogeriodocarmo.com    | ⏳ Pending | ****\_\_**** | ******\_****** |
| rogeriodocarmo.com.br | ⏳ Pending | ****\_\_**** | ******\_****** |
| rogeriodocarmo.xyz    | ⏳ Pending | ****\_\_**** | ******\_****** |
| rogeriodocarmo.online | ⏳ Pending | ****\_\_**** | ******\_****** |

**Status Legend:**

- ⏳ Pending - DNS changes not yet propagated
- 🔄 In Progress - Partially propagated
- ✅ Complete - Fully propagated globally
- ❌ Failed - Configuration error

## 🎯 Quick Commands

### Check DNS Propagation

```bash
# Check A record for each domain
dig rogeriodocarmo.com +short
dig rogeriodocarmo.com.br +short
dig rogeriodocarmo.xyz +short
dig rogeriodocarmo.online +short

# Should all return the same Vercel IP
```

### Test HTTPS

```bash
# Check SSL certificate for each domain
curl -I https://rogeriodocarmo.com
curl -I https://rogeriodocarmo.com.br
curl -I https://rogeriodocarmo.xyz
curl -I https://rogeriodocarmo.online

# All should return 200 OK with valid SSL
```

### Verify Content

```bash
# Check if content is identical
curl -s https://rogeriodocarmo.com | md5sum
curl -s https://rogeriodocarmo.com.br | md5sum
curl -s https://rogeriodocarmo.xyz | md5sum
curl -s https://rogeriodocarmo.online | md5sum

# All MD5 hashes should match
```

## 📝 Notes

Use this space for additional notes:

```
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
```

## ✨ Completion

- [ ] All 4 domains configured and verified
- [ ] All checkboxes above are checked
- [ ] Documentation updated
- [ ] Task 21.6 marked as complete in tasks.md
- [ ] Ready to proceed to Task 21.7

**Completed By:** ********\_\_\_********
**Date:** ********\_\_\_********
**Time Taken:** ********\_\_\_********

---

**Next Steps:**

1. Mark Task 21.6 as complete
2. Proceed to Task 21.7: Write property test for multi-domain consistency
3. Update project documentation with live domain URLs
