# Domain Configuration Guide

This guide explains how to configure custom domains for the personal resume website on Vercel.

## Overview

The website is accessible through four custom domains:

- **rogeriodocarmo.com** (primary domain)
- **rogeriodocarmo.com.br**
- **rogeriodocarmo.xyz**
- **rogeriodocarmo.online**

All domains point to the same Vercel deployment and serve identical content.

## Prerequisites

- Vercel project deployed and running
- Domain names registered with Hostinger
- Access to Hostinger DNS management
- Access to Vercel project settings

## Step 1: Add Domains to Vercel

### 1.1 Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project
3. Click "Settings" tab
4. Click "Domains" in the left sidebar

### 1.2 Add Each Domain

For each of the four domains, follow these steps:

1. Click "Add Domain" button
2. Enter the domain name (e.g., `rogeriodocarmo.com`)
3. Click "Add"
4. Vercel will display the required DNS configuration

### 1.3 Note DNS Records

Vercel will provide DNS records similar to:

**For root domain (example.com):**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Important**: The actual IP address may differ. Always use the values provided by Vercel.

## Step 2: Configure DNS in Hostinger

### 2.1 Access Hostinger DNS Management

1. Log in to [Hostinger](https://www.hostinger.com/)
2. Go to "Domains" section
3. Select the domain you want to configure
4. Click "DNS / Name Servers"

### 2.2 Configure DNS Records

For each domain, add the following DNS records:

#### Root Domain Configuration

**A Record for root domain:**

```
Type: A
Name: @ (or leave empty)
Value: [Vercel IP from Step 1.3]
TTL: 3600 (or Auto)
```

**A Record for www subdomain:**

```
Type: A
Name: www
Value: [Vercel IP from Step 1.3]
TTL: 3600 (or Auto)
```

**Alternative: CNAME for www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### 2.3 Remove Conflicting Records

Before adding new records, remove any existing A or CNAME records that might conflict:

- Remove old A records pointing to different IPs
- Remove old CNAME records for @ or www
- Keep MX records (for email) if you have them

### 2.4 Save Changes

1. Click "Add Record" or "Save" after entering each record
2. Wait for confirmation message
3. Repeat for all four domains

## Step 3: Domain-Specific Configuration

### rogeriodocarmo.com (Primary Domain)

```
A Record:
  Name: @
  Value: [Vercel IP]
  TTL: 3600

A Record:
  Name: www
  Value: [Vercel IP]
  TTL: 3600
```

### rogeriodocarmo.com.br

```
A Record:
  Name: @
  Value: [Vercel IP]
  TTL: 3600

A Record:
  Name: www
  Value: [Vercel IP]
  TTL: 3600
```

### rogeriodocarmo.xyz

```
A Record:
  Name: @
  Value: [Vercel IP]
  TTL: 3600

A Record:
  Name: www
  Value: [Vercel IP]
  TTL: 3600
```

### rogeriodocarmo.online

```
A Record:
  Name: @
  Value: [Vercel IP]
  TTL: 3600

A Record:
  Name: www
  Value: [Vercel IP]
  TTL: 3600
```

## Step 4: Verify Configuration

### 4.1 Check DNS Propagation

DNS changes can take 24-48 hours to propagate globally, but usually complete within 1-2 hours.

**Check propagation status:**

- Use [DNS Checker](https://dnschecker.org/)
- Enter your domain name
- Select "A" record type
- Verify the IP matches Vercel's IP

### 4.2 Verify in Vercel

1. Go to Vercel → Settings → Domains
2. Each domain should show:
   - ✅ "Valid Configuration" status
   - 🔒 SSL certificate provisioned
   - Green checkmark indicator

### 4.3 Test HTTPS Certificates

Vercel automatically provisions SSL certificates for all domains:

1. Visit each domain in your browser:
   - https://rogeriodocarmo.com
   - https://rogeriodocarmo.com.br
   - https://rogeriodocarmo.xyz
   - https://rogeriodocarmo.online

2. Verify:
   - 🔒 Padlock icon appears in address bar
   - Certificate is valid (click padlock to view)
   - No security warnings

### 4.4 Test Content Consistency

Verify all domains serve identical content:

```bash
# Test each domain
curl -I https://rogeriodocarmo.com
curl -I https://rogeriodocarmo.com.br
curl -I https://rogeriodocarmo.xyz
curl -I https://rogeriodocarmo.online

# All should return 200 OK
```

## Step 5: Configure Primary Domain

### 5.1 Set Primary Domain in Vercel

1. Go to Vercel → Settings → Domains
2. Find `rogeriodocarmo.com` in the list
3. Click the three dots (⋯) menu
4. Select "Set as Primary Domain"

This ensures:

- Canonical URLs point to the primary domain
- SEO benefits are consolidated
- Redirects work correctly

### 5.2 Configure WWW Redirect (Optional)

To redirect www to non-www (or vice versa):

1. In Vercel Domains settings
2. Click on the www subdomain
3. Enable "Redirect to" option
4. Select the root domain as redirect target

## Troubleshooting

### Domain Not Verifying

**Problem**: Domain shows "Invalid Configuration" in Vercel

**Solutions**:

1. Double-check DNS records in Hostinger
2. Ensure A record points to correct Vercel IP
3. Wait for DNS propagation (up to 48 hours)
4. Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### SSL Certificate Not Provisioning

**Problem**: HTTPS not working, certificate errors

**Solutions**:

1. Wait 24 hours for automatic provisioning
2. Verify domain is correctly configured
3. Check Vercel dashboard for certificate status
4. Contact Vercel support if issue persists

### DNS Propagation Taking Too Long

**Problem**: DNS changes not visible after several hours

**Solutions**:

1. Check TTL values (lower = faster propagation)
2. Use different DNS checker tools
3. Try accessing from different networks
4. Clear browser cache and DNS cache

### Conflicting DNS Records

**Problem**: Domain not resolving or pointing to wrong server

**Solutions**:

1. Remove all old A and CNAME records
2. Ensure only Vercel's records are present
3. Check for wildcard (\*) records that might conflict
4. Verify nameservers are correct

## DNS Record Reference

### A Record

- **Purpose**: Points domain to IP address
- **Use for**: Root domain (@) and www subdomain
- **Example**: `@ → 76.76.21.21`

### CNAME Record

- **Purpose**: Points domain to another domain
- **Use for**: www subdomain (alternative to A record)
- **Example**: `www → cname.vercel-dns.com`
- **Note**: Cannot be used for root domain (@)

### TTL (Time To Live)

- **Purpose**: How long DNS records are cached
- **Recommended**: 3600 seconds (1 hour)
- **Lower values**: Faster propagation, more DNS queries
- **Higher values**: Slower propagation, fewer DNS queries

## Security Best Practices

1. **Always use HTTPS**: Vercel provides free SSL certificates
2. **Enable HSTS**: Vercel enables this by default
3. **Monitor certificates**: Vercel auto-renews, but monitor expiration
4. **Use strong passwords**: For Hostinger and Vercel accounts
5. **Enable 2FA**: On both Hostinger and Vercel accounts

## Maintenance

### Regular Checks

- **Monthly**: Verify all domains are accessible
- **Quarterly**: Check SSL certificate expiration dates
- **Annually**: Review DNS configuration for optimization

### Monitoring

- Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- Monitor SSL certificate expiration
- Track DNS propagation issues

## Related Documentation

- [Vercel Custom Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Hostinger DNS Management Guide](https://support.hostinger.com/en/articles/1583227-how-to-manage-dns-records)
- [DNS Propagation Checker](https://dnschecker.org/)
- [SSL Certificate Checker](https://www.sslshopper.com/ssl-checker.html)

## Support

If you encounter issues:

1. **Vercel Support**: https://vercel.com/support
2. **Hostinger Support**: https://www.hostinger.com/contact
3. **Community Forums**: Vercel Discord, Hostinger Community

## Completion Checklist

- [ ] All 4 domains added to Vercel
- [ ] DNS A records configured in Hostinger for all domains
- [ ] DNS propagation verified (dnschecker.org)
- [ ] All domains show "Valid Configuration" in Vercel
- [ ] HTTPS working on all domains (🔒 icon visible)
- [ ] Primary domain set to rogeriodocarmo.com
- [ ] Content consistency verified across all domains
- [ ] SSL certificates auto-renewed and valid
- [ ] Uptime monitoring configured (optional)
