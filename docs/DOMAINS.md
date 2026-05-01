# Domain Configuration

## Overview

This website is accessible through **11 custom domains**, all pointing to the same Vercel deployment. All domains serve identical content with proper HTTPS certificates.

## Active Domains

| Domain                | TLD     | Status  | Purpose                    |
| --------------------- | ------- | ------- | -------------------------- |
| rogeriodocarmo.com    | .com    | ✅ Live | Primary domain             |
| rogeriodocarmo.io     | .io     | ✅ Live | Tech-focused alternative   |
| rogeriodocarmo.info   | .info   | ✅ Live | Information portal         |
| rogeriodocarmo.click  | .click  | ✅ Live | Modern alternative         |
| rogeriodocarmo.shop   | .shop   | ✅ Live | Portfolio showcase         |
| rogeriodocarmo.org    | .org    | ✅ Live | Professional alternative   |
| rogeriodocarmo.net    | .net    | ✅ Live | Network alternative        |
| rogeriodocarmo.tech   | .tech   | ✅ Live | Technology-focused         |
| rogeriodocarmo.com.br | .com.br | ✅ Live | Brazilian market (primary) |
| rogeriodocarmo.online | .online | ✅ Live | Online presence            |
| rogeriodocarmo.xyz    | .xyz    | ✅ Live | Modern alternative         |

## Primary Domain

**rogeriodocarmo.com** is designated as the primary domain for:

- SEO canonical URLs
- Social media sharing
- Email signatures
- Business cards
- Official documentation

### Canonical URLs

The application uses **rogeriodocarmo.com** as the canonical domain in:

- `<link rel="canonical">` tags
- Open Graph `og:url` tags
- Sitemap URLs
- Structured data (Schema.org)

Example from `app/[locale]/layout.tsx`:

```typescript
const SITE_URL = "https://rogeriodocarmo.com";

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = locale === "pt-BR" ? SITE_URL : `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "pt-BR": SITE_URL,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
      },
    },
    // ...
  };
}
```

## SEO Considerations

### Search Engine Submission

Each domain should be submitted separately to:

- **Google Search Console**: Add as separate properties
- **Bing Webmaster Tools**: Add as separate sites
- **Yandex Webmaster** (optional): Add as separate sites

See [SEO-SUBMISSION-GUIDE.md](./SEO-SUBMISSION-GUIDE.md) for detailed instructions.

### Duplicate Content Prevention

To prevent duplicate content penalties:

1. **Canonical Tags**: All pages use canonical URLs pointing to rogeriodocarmo.com
2. **Consistent Content**: All domains serve identical content
3. **Hreflang Tags**: Proper language/region targeting for locales
4. **Sitemap**: Each domain has its own sitemap pointing to canonical URLs

### Domain-Specific Sitemaps

Each domain serves its own sitemap at `/sitemap.xml`:

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

All sitemaps reference the canonical URLs (rogeriodocarmo.com).

## Testing Domains

### Verify Domain Accessibility

Test each domain:

```bash
# Test primary domain
curl -I https://rogeriodocarmo.com

# Test all domains
for domain in com io info click shop org net tech com.br online xyz; do
  if [ "$domain" = "com.br" ]; then
    echo "Testing rogeriodocarmo.com.br"
    curl -I https://rogeriodocarmo.com.br
  else
    echo "Testing rogeriodocarmo.$domain"
    curl -I https://rogeriodocarmo.$domain
  fi
done
```

### Verify HTTPS Certificates

Check SSL/TLS certificates:

```bash
# Check certificate for each domain
openssl s_client -connect rogeriodocarmo.com:443 -servername rogeriodocarmo.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### Verify Canonical Tags

Check that all domains use canonical URLs:

```bash
# Check canonical tag on each domain
curl -s https://rogeriodocarmo.io | grep -o '<link rel="canonical"[^>]*>'
```

Expected output should reference `https://rogeriodocarmo.com`.

## Domain Management

### Adding New Domains

To add a new domain:

1. **Purchase Domain**: Register through domain registrar (e.g., Hostinger, Namecheap)
2. **Configure DNS**: Point to Vercel nameservers or add A/CNAME records
3. **Add to Vercel**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter domain name
   - Follow verification steps
4. **Update Documentation**: Add to this file and SEO-SUBMISSION-GUIDE.md
5. **Submit to Search Engines**: Add to Google Search Console and Bing Webmaster Tools

### Removing Domains

To remove a domain:

1. **Remove from Vercel**: Project Settings → Domains → Remove
2. **Update DNS**: Remove A/CNAME records
3. **Update Documentation**: Remove from this file
4. **Remove from Search Engines**: Delete property from Google Search Console and Bing Webmaster Tools

### Domain Renewal

All domains require annual renewal. Set up auto-renewal to prevent expiration:

- **Renewal Period**: Annually
- **Auto-Renewal**: Enabled (recommended)
- **Expiration Alerts**: Enable email notifications 30 days before expiration

## Analytics and Monitoring

### Domain-Specific Analytics

While all domains serve the same content, you can track domain-specific traffic in:

- **Google Analytics**: Filter by hostname dimension
- **Vercel Analytics**: View traffic by domain
- **Firebase Analytics**: Custom event parameter for domain

### Monitoring Checklist

Weekly monitoring:

- [ ] All domains resolve correctly
- [ ] HTTPS certificates are valid
- [ ] No DNS propagation issues
- [ ] Search Console shows no errors
- [ ] Traffic is distributed across domains

## Troubleshooting

### Domain Not Resolving

**Issue**: Domain doesn't load or shows DNS error

**Solutions**:

1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records in domain registrar
3. Check Vercel domain configuration
4. Wait 24-48 hours for DNS propagation

### SSL Certificate Error

**Issue**: Browser shows "Not Secure" or certificate error

**Solutions**:

1. Verify domain is added in Vercel
2. Check SSL certificate status in Vercel dashboard
3. Wait for automatic certificate provisioning (can take up to 24 hours)
4. Contact Vercel support if issue persists

### Duplicate Content Warnings

**Issue**: Search Console reports duplicate content

**Solutions**:

1. Verify canonical tags are present on all pages
2. Check that canonical URLs point to rogeriodocarmo.com
3. Ensure all domains serve identical content
4. Submit sitemaps for all domains

## Best Practices

### Do's ✅

- ✅ Use rogeriodocarmo.com as canonical domain in all metadata
- ✅ Keep all domains pointing to the same deployment
- ✅ Monitor all domains for SSL certificate expiration
- ✅ Submit each domain separately to search engines
- ✅ Enable auto-renewal for all domains
- ✅ Test all domains after DNS changes

### Don'ts ❌

- ❌ Don't serve different content on different domains
- ❌ Don't use different canonical URLs for different domains
- ❌ Don't forget to renew domains before expiration
- ❌ Don't remove domains without updating documentation
- ❌ Don't ignore DNS propagation time (24-48 hours)

## Related Documentation

- [SEO-SUBMISSION-GUIDE.md](./SEO-SUBMISSION-GUIDE.md) - Search engine submission guide
- [CI-CD-PIPELINE.md](./CI-CD-PIPELINE.md) - Deployment pipeline documentation
- [SECURITY-CHECKLIST.md](./SECURITY-CHECKLIST.md) - Security best practices

---

**Last Updated**: 2026-04-30  
**Total Domains**: 11  
**Primary Domain**: rogeriodocarmo.com
