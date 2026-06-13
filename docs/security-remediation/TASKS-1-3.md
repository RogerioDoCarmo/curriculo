# Security Remediation — Tasks 1–3

> These are non-code operational tasks. This file stays local and untracked.  
> Context: findings from the domain security audit run on 2026-05-31.

## Progress Summary (verified live 2026-06-13)

| Task                                            | Status                 | Notes                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task 1 — Fix .com.br WHOIS email exposure       | ✅ Complete            | Verified via `whois`: handle RRRCC now shows `contato@rogeriodocarmo.com`; Gmail gone. Name + partial CPF still visible (Registro.br structural limit, expected).                                                                                                                                                                                                                                   |
| Task 2 — SPF + DMARC on 8 unprotected domains   | ✅ Complete            | Verified via `dig`: all 8 return `v=spf1 -all` and `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`                                                                                                                                                                                                                                                                                                |
| Task 3 — Enforce DMARC on .com / .net / .com.br | ✅ Complete            | `p=reject; sp=reject; adkim=s; aspf=s; rua=…` enforced and **fully converged on all 3** (verified 2026-06-13: .com 12/12, .com.br 12/12, .net 20/20 samples `p=reject`, zero stale `p=none`). Pre-flight auth stack verified healthy (SPF + DKIM `hostingermail1` + MX align for Hostinger, the sole sender), so no legitimate mail is rejected. `rua` retained to catch any future unknown sender. |
| Optional — HSTS preload submission              | ✅ Submitted (pending) | Submitted 2026-06-13; hstspreload.org status = `pending` (in queue). Header live (`max-age=63072000; includeSubDomains; preload`). ⚠️ Must keep this header in place through enrollment or the domain gets dropped from the list.                                                                                                                                                                   |

---

## Task 1 — Fix .com.br WHOIS Personal Data Exposure (CRITICAL)

**What's exposed:** Full name, partial CPF (`***.253.868-**`), and your personal email
(`rogerio.carmo02@gmail.com`) are publicly visible in the Registro.br WHOIS database.
This data is scraped by spam lists and phishing kits.

### Step-by-step fix

**Option A — Change registrant contact to a non-personal email (recommended, fastest)**

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com) → Domains → rogeriodocarmo.com.br
2. Open **Manage** → **Contact Information** (or **WHOIS Privacy**)
3. Change the **owner e-mail** field to a dedicated alias — e.g. create
   `domains@rogeriodocarmo.com` via Hostinger Email and use that instead of your Gmail.
4. Confirm the change via the verification email sent to your current Gmail.
5. Run `whois rogeriodocarmo.com.br | grep e-mail` to verify the new email appears.

> **Note:** Registro.br (.com.br) does not offer full WHOIS privacy (name and partial CPF
> will still be visible). Changing the email is the only field you can fully control.
> The CPF middle digits exposure is a structural limitation of Registro.br — it cannot be
> fully hidden. Keep monitoring if this becomes a concern.

**Option B — Request WHOIS privacy via Hostinger support**

Some Hostinger resellers can request Registro.br to suppress or proxy registrant data.
Contact Hostinger support chat and ask:

> "Can you enable WHOIS privacy for my .com.br domain rogeriodocarmo.com.br registered
> through HSTDOMAINS? I want to suppress my personal email from the public WHOIS record."

If they say yes, follow their instructions. This is not guaranteed — it depends on whether
HSTDOMAINS has this capability enabled with NIC.br.

### Verification

```bash
whois rogeriodocarmo.com.br | grep -E "(e-mail|owner|person)"
```

Expected: the e-mail line should show your alias, not `rogerio.carmo02@gmail.com`.

---

## Task 2 — Add SPF + DMARC to 8 Unprotected Domains (HIGH)

**What's at risk:** Anyone can send spoofed email appearing to come from
`@rogeriodocarmo.io`, `.info`, `.click`, `.shop`, `.org`, `.tech`, `.online`, `.xyz`.
Since you don't send email from these domains, the fix is to publish a "reject all senders"
policy.

### Step-by-step fix

Do this for each of the 8 domains via Hostinger DNS Manager:

**Domains to fix:**

- rogeriodocarmo.io
- rogeriodocarmo.info
- rogeriodocarmo.click
- rogeriodocarmo.shop
- rogeriodocarmo.org
- rogeriodocarmo.tech
- rogeriodocarmo.online
- rogeriodocarmo.xyz

**For each domain in [hpanel.hostinger.com](https://hpanel.hostinger.com) → Domains → DNS Zone:**

#### Record 1 — SPF (blocks sending)

```
Type:  TXT
Name:  @
Value: v=spf1 -all
TTL:   3600
```

> `-all` means "no server is authorized to send from this domain — reject everything."

#### Record 2 — DMARC (instructs receiving servers to reject spoofed mail)

```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;
TTL:   3600
```

> `p=reject` — discard spoofed emails outright (not just flag them).  
> `sp=reject` — applies the same policy to subdomains.  
> `adkim=s` / `aspf=s` — strict alignment (prevents subdomain spoofing bypass).

### Verification (after DNS propagation, wait ~1 hour)

```bash
for domain in rogeriodocarmo.io rogeriodocarmo.info rogeriodocarmo.click rogeriodocarmo.shop rogeriodocarmo.org rogeriodocarmo.tech rogeriodocarmo.online rogeriodocarmo.xyz; do
  echo "=== $domain ==="
  echo "SPF:   $(dig TXT $domain +short | grep spf)"
  echo "DMARC: $(dig TXT _dmarc.$domain +short)"
done
```

Expected output for each domain:

```
SPF:   "v=spf1 -all"
DMARC: "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;"
```

---

## Task 3 — Enforce DMARC on .com, .net, .com.br (MEDIUM)

**Current state (2026-06-04):** SPF, DKIM, and DMARC are fully configured on all 3 domains.
DMARC is in pre-flight monitoring mode (`p=none`) with aggregate reporting active since
2026-06-04. Ready to enforce after ~2026-06-18.

**Authentication stack confirmed:**

- SPF: `v=spf1 include:_spf.mail.hostinger.com ~all` ✅
- DKIM: `hostingermail1._domainkey` (RSA 2048-bit) ✅
- DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@rogeriodocarmo.com;` ✅
- Reports go to alias `dmarc@rogeriodocarmo.com` → forwarded to `contato@rogeriodocarmo.com`

**Affected domains:**

- rogeriodocarmo.com
- rogeriodocarmo.net
- rogeriodocarmo.com.br

### Pre-flight check ✅ Done

1. ~~Set up a DMARC reporting inbox~~ — alias `dmarc@rogeriodocarmo.com` created,
   forwarding to `contato@rogeriodocarmo.com`.
2. **Wait until ~2026-06-18** and check `contato@rogeriodocarmo.com` for aggregate report
   emails. Review at [dmarcian.com](https://dmarcian.com) free tier.
3. Confirm that only Hostinger mail servers appear as legitimate senders. If you see
   unexpected sources, investigate before enforcing.

### Step-by-step fix (after pre-flight)

In Hostinger DNS Manager, update the `_dmarc` TXT record for each domain:

**rogeriodocarmo.com** and **rogeriodocarmo.net:**

```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:dmarc@rogeriodocarmo.com;
TTL:   3600
```

**rogeriodocarmo.com.br** (same value):

```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:dmarc@rogeriodocarmo.com;
TTL:   3600
```

> Keep `rua` even after enforcement — it lets you catch any legitimate sender you may have
> forgotten (e.g., a newsletter tool, a form submission service, etc.).

### Verification

```bash
for domain in rogeriodocarmo.com rogeriodocarmo.net rogeriodocarmo.com.br; do
  echo "$domain: $(dig TXT _dmarc.$domain +short)"
done
```

Expected: `"v=DMARC1; p=reject; ..."`

---

## Optional — HSTS Preload List Submission

The `vercel.json` security headers (implemented in the `feat/security-headers` branch) add
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

The `preload` directive declares your intent to join the browser HSTS preload list, but you
must also submit manually:

1. Go to [hstspreload.org](https://hstspreload.org)
2. Enter `rogeriodocarmo.com`
3. Verify all eligibility checks pass (max-age ≥ 31536000, includeSubDomains, preload directive present)
4. Submit

Once accepted (can take weeks to months to reach all browsers), the domain will load via
HTTPS even on the very first visit, before any TLS handshake.

---

## Domain Expiry Reminder

Monitor auto-renewal for these domains — they expire soonest:

| Domain                | Expires    |
| --------------------- | ---------- |
| rogeriodocarmo.online | 2026-12-15 |
| rogeriodocarmo.xyz    | 2026-12-15 |
| rogeriodocarmo.io     | 2027-04-30 |
| rogeriodocarmo.click  | 2027-04-30 |
| rogeriodocarmo.tech   | 2027-04-30 |

Check auto-renewal status in [hpanel.hostinger.com](https://hpanel.hostinger.com) → Domains.
