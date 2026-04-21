# Domain Configuration Quick Reference

Quick reference card for configuring domains. Keep this handy while working.

## 🎯 Domains to Configure

| #   | Domain                | Type      | Status |
| --- | --------------------- | --------- | ------ |
| 1   | rogeriodocarmo.com    | Primary   | ⏳     |
| 2   | rogeriodocarmo.com.br | Secondary | ⏳     |
| 3   | rogeriodocarmo.xyz    | Secondary | ⏳     |
| 4   | rogeriodocarmo.online | Secondary | ⏳     |

## 📋 DNS Records Template

Copy this for each domain in Hostinger:

### Record 1: Root Domain

```
Type: A
Name: @ (or leave empty)
Value: [VERCEL_IP_HERE]
TTL: 3600
```

### Record 2: WWW Subdomain

```
Type: A
Name: www
Value: [VERCEL_IP_HERE]
TTL: 3600
```

## 🔗 Important Links

### Vercel

- **Dashboard**: https://vercel.com/
- **Project**: https://vercel.com/rogeriodocarmo/curriculo
- **Domains**: https://vercel.com/rogeriodocarmo/curriculo/settings/domains

### Hostinger

- **Login**: https://www.hostinger.com/
- **Domains**: https://hpanel.hostinger.com/domains

### Tools

- **DNS Checker**: https://dnschecker.org/
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Dig Tool**: https://toolbox.googleapps.com/apps/dig/

## ⚡ Quick Steps

### For Each Domain:

1. **Vercel** → Add domain → Note IP
2. **Hostinger** → DNS → Add 2 A records
3. **Wait** → 1-48 hours for propagation
4. **Verify** → Check DNS + HTTPS

## 🔍 Verification Commands

```bash
# Check DNS
dig rogeriodocarmo.com +short

# Check HTTPS
curl -I https://rogeriodocarmo.com

# Check all domains
for domain in rogeriodocarmo.com rogeriodocarmo.com.br rogeriodocarmo.xyz rogeriodocarmo.online; do
  echo "Checking $domain..."
  dig $domain +short
done
```

## ⏱️ Expected Timeline

| Step                         | Time                           |
| ---------------------------- | ------------------------------ |
| Add domain to Vercel         | 1 min                          |
| Configure DNS in Hostinger   | 5 min per domain               |
| DNS propagation              | 1-48 hours (usually 1-2 hours) |
| SSL certificate provisioning | Automatic after DNS            |
| Total per domain             | ~5-10 min + wait time          |

## 🚨 Common Issues

| Issue                | Solution                       |
| -------------------- | ------------------------------ |
| Domain not verifying | Wait longer, check DNS records |
| SSL not working      | Wait 24h, verify domain first  |
| Wrong IP             | Double-check Vercel dashboard  |
| Conflicting records  | Remove old A/CNAME records     |

## 📞 Support

- **Vercel**: https://vercel.com/support
- **Hostinger**: https://www.hostinger.com/contact

## ✅ Completion Criteria

- [ ] All 4 domains added to Vercel
- [ ] All 8 DNS records configured (2 per domain)
- [ ] All domains show ✅ in Vercel
- [ ] All domains accessible via HTTPS 🔒
- [ ] Primary domain set

---

**Print this page and keep it handy while configuring!**
