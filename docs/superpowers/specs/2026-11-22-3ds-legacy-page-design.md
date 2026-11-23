# 3DS legacy text page — design

## Intent / why

Rogério wants his personal resume site to be reachable from the browser on
his original ("Old") Nintendo 3DS, for personal nostalgia — with room to
grow into a small side project later (e.g. logging real Old-3DS visits).
Since the full modern site cannot realistically render there, the fallback
is a minimal, text-only page — effectively a human-readable sitemap of the
real site — served on its own subdomain, `3ds.rogeriodocarmo.com`.

## What we learned (constraints)

Empirical testing on the real console (not guesswork) established:

- The Old 3DS's browser (NetFront, ~2011) **can** complete modern TLS 1.2
  HTTPS handshakes and render basic HTML — it successfully loaded
  `example.com` and `badssl.com`.
- It **cannot** load anything on the current site's host: `rogeriodocarmo.com`
  and even the unrelated `vercel.com` both fail with an SSL error and a
  blank screen. This is a **Vercel edge TLS/cipher-suite problem**, not a
  problem with this domain's certificate, DNS, or Let's Encrypt generally
  (`badssl.com` also uses Let's Encrypt and works fine).
- `pages.cloudflare.com` (Cloudflare Pages, Cloudflare's edge) loads cleanly
  — padlock shown, no warning. Cloudflare's edge TLS config is compatible;
  Vercel's is not, and nothing we control in this repo's Vercel project can
  fix that (it's platform-level cipher hardening).
- `pages.github.com` (GitHub Pages) also loads — same mild SSL warning as
  `example.com`/`badssl.com`, but it loads, including an image.
- Hostinger (the domain's actual DNS provider) does **not** support
  delegating a single subdomain to another provider via NS records — only
  plain A/CNAME/TXT records, or a full nameserver change for the whole
  domain. Moving the whole domain's DNS to Cloudflare was explicitly ruled
  out (too big a change for this side project). That removes Cloudflare
  Pages as an option: its managed-cert custom domains need the hostname's
  zone to actually live on Cloudflare.

**Conclusion:** this page cannot be served from the existing Vercel
deployment. It needs a separate host whose custom-domain HTTPS cert can be
provisioned with nothing more than a plain CNAME record at Hostinger.
GitHub Pages satisfies that (confirmed working on the real device) and
needs no server to maintain and no DNS provider change.

## Goals

- `3ds.rogeriodocarmo.com` loads over HTTPS on a real Old 3DS and shows a
  readable, text-only rundown of what's on the main site (sections,
  one-line summaries, links).
- The hero section's profile photo is included on the page (confirmed
  images do render on the real device via GitHub Pages). Everything else
  on the page stays plain text, no other images.
- The page's text is generated from the same content sources the main site
  already uses (`messages/en.json`, `content/`), not hand-duplicated prose
  that will drift out of sync.
- Zero risk to the live site: no changes to Vercel, the apex domain's DNS,
  HSTS, or CSP.

- Blog posts (`content/posts/`) — explicitly skipped; the page covers only
  the static "about me" sections (experience, projects, skills, etc.),
  not the open-ended post list.

## Non-goals

- Making the full site itself load on Old 3DS (established as infeasible
  via Vercel; out of scope here).
- Multi-language support on this page (English only — novelty audience).
- Moving the domain's DNS management away from Hostinger (explicitly
  ruled out — too big a change for this side project).
- CI/CD automation for this page's deploy (manual deploy for now; trivial
  to automate later if the side project grows).
- Visitor logging / analytics on this page (explicitly future "side
  project" scope, not this change).
- A complete mirror of every project/experience/skill entry — the page is
  deliberately terse (section headers + one-line summaries + a handful of
  links), both for readability and because NetFront-era hardware is
  memory-constrained; this should be verified on the real device once
  built, same as the TLS findings above.

## Anti-goals

- Don't let this page's build or deploy become a dependency of the main
  site's build, CI, or release process.
- Don't touch `vercel.json`'s CSP/HSTS or any existing route to make this
  work — if it needs that, the approach is wrong.

## Approaches considered (hosting)

1. **Keep it on Vercel** (new route in the existing Next.js app). Rejected:
   proven by direct device testing to fail at the TLS layer regardless of
   page content.
2. **Separate VPS/self-hosted box, plain HTTP or custom TLS.** Would work,
   but needs ongoing server maintenance (patching, uptime) for a novelty
   page, when a free managed option already tests clean on the real device.
3. **Cloudflare Pages.** Rejected after further checking: its managed-cert
   custom domains require the hostname's zone to live on Cloudflare, and
   Hostinger's panel can't delegate just the `3ds` subdomain there without
   moving the whole domain's DNS — explicitly ruled out as too big a change
   for this side project.
4. **GitHub Pages.** Chosen. Proven to load on the real Old 3DS (mild SSL
   warning, same as `example.com`/`badssl.com`, but it renders, including
   an image). Needs only a plain CNAME record at Hostinger pointing to the
   GitHub Pages target — no DNS provider change, no zone move, no server
   to run.

## Decided

- **Hosting:** GitHub Pages, serving from this same GitHub repo (a
  dedicated branch or a `/docs`-style folder — exact mechanics left to the
  builder), separate from the Vercel deployment.
- **DNS:** one plain CNAME record for `3ds.rogeriodocarmo.com` at Hostinger,
  pointing at the GitHub Pages target host, plus the matching `CNAME` file
  GitHub Pages expects in the published folder. Nothing else about the
  domain's DNS, nameservers, or existing records changes.
- **Content generation:** a Node script in this repo
  (`scripts/generate-3ds-page.mjs`) reads `messages/en.json` (nav/sections
  labels and one-line copy) and the existing `content/` directories
  (experience, projects, skills — **not** posts, see Goals) to emit one
  self-contained static HTML file — no CSS framework, no JS, inline/minimal
  markup only, deliberately terse (section headers + one-line summaries,
  not a full dump). Output goes to a location that is **not** part of the
  Next.js app or its `out/` export, so it can never get swept into the
  Vercel build.
- **Hero image:** the existing source asset
  (`public/images/profile/rogeriodocarmo.png`, ~1.1 MB) is far too large to
  ship as-is to memory/bandwidth-constrained 2011 hardware. The generator
  produces and embeds a separately resized/re-encoded copy sized for this
  page specifically (small pixel dimensions, likely JPEG rather than PNG —
  exact target left to the builder), not the original file.
- **Links:** ordinary `<a href="https://rogeriodocarmo.com/...">` links to
  the live site are included in the generated page. They won't resolve
  from a real Old 3DS today (expected, given the Vercel TLS finding above)
  but are harmless and work for anyone else (New 3DS, emulators, other
  visitors) who lands on the page.
- **Deploy:** manual for now — generate the file, publish it to the GitHub
  Pages source (push to the branch/folder GitHub Pages serves from), run by
  hand whenever the page needs updating. Not wired into GitHub Actions
  automation yet.
- **Verification:** once built, load the real generated page on the actual
  3DS (not just test sites) to confirm both the TLS warning-but-loads
  behavior and that the terse content renders/fits reasonably on the
  console's small screen — consistent with how every finding in this
  design was established by testing on the real device, not assumption.

## Left to the builder (plan stage)

- Exact HTML structure/wording of the generated page (heading, per-section
  summaries, link list) — should read naturally as a "sitemap," pulling
  directly from `messages/en.json`'s `sections`/`nav` keys plus short
  summaries sourced from `content/experience`, `content/projects`,
  `content/skills`.
- Exact npm script wiring (`package.json` script name for running the
  generator) and where the generated output/publish source sits relative
  to the repo root and the existing GitHub Actions workflows (e.g. whether
  it lives on a dedicated `gh-pages`-style branch, kept clearly separate
  from the `main`/`develop` Git Flow this repo otherwise uses).
- The one-time setup steps only Rogério can perform (adding the CNAME
  record in Hostinger's panel; enabling GitHub Pages for this repo and
  setting its custom domain + "Enforce HTTPS" in GitHub's repo settings)
  — likely suited to a short interactive walkthrough rather than something
  this session can do unattended, since neither panel is reachable via
  tools available here.
- Whether GitHub Pages' own "Enforce HTTPS" option should be left on or
  off, given the real device shows a warning before loading — confirm on
  the real 3DS once the custom domain is live either way.
- Exact resize target (dimensions/format/quality) for the hero image copy,
  and whether it's generated at build time (e.g. via `sharp`, already a
  likely transitive dependency through Next.js image handling) or
  committed as a pre-made static file — verify the final size/rendering on
  the real device.
- Whether the generated page needs a `robots.txt`/noindex treatment (likely
  yes, to keep a near-duplicate text copy of the main site's content out of
  search results) — flagged for the plan, not decided here.
