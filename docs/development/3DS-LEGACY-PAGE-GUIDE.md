# 3DS Legacy Page — Publish Guide

Why this page exists, and why it's not just a Vercel route: see
[`docs/superpowers/specs/2026-11-22-3ds-legacy-page-design.md`](../superpowers/specs/2026-11-22-3ds-legacy-page-design.md).
In short — Rogério's original ("Old") Nintendo 3DS browser was tested
directly against the live site and against `vercel.com`, and both fail at
the TLS layer. GitHub Pages was tested the same way and works. This page
is generated from the same content sources as the main site
(`messages/en.json`, `content/experience`, `content/projects`,
`content/skills`) but published entirely separately, to
`3ds.rogeriodocarmo.com`.

## One-time setup

### 1. Create the publish branch — done

Following this repo's normal Git Flow, `3ds-pages` was branched **from
`develop`** (shared history, not a disconnected orphan) with one empty
commit, then merged straight back into `develop` — a true no-op on
`develop`'s files, since the commit changed nothing. The branch stays
active afterward (unlike a typical short-lived feature branch, which
gets deleted once merged): it's the long-lived GitHub Pages publish
target. Done as of 2026-11-22:

```bash
git checkout -b 3ds-pages develop
git commit --allow-empty -m "chore: initialize 3ds-pages publish branch"
git push -u origin 3ds-pages
git checkout develop
git merge 3ds-pages   # fast-forward, no file changes
```

It's also protected by a dedicated GitHub ruleset ("3ds-pages Protection"):
deletion and force-push/history-rewrite are blocked, but plain pushes
(what "Every time the content changes" below does) are allowed — lighter
than the `main`/`develop` ruleset, which also requires a PR and CI checks
that don't make sense for a generated-static-file branch.

Because `3ds-pages` shares history with `develop`, its current tree is
still the **entire** source repo (app/, docs/, etc.), not an empty one —
`docs/` is **not** safe to publish wholesale, since it holds committed
planning docs that shouldn't go out on the open web. The first publish
step below (`git rm -rf .` in the worktree, before copying the generated
files in) clears that down to just the generated page every time, so
nothing beyond `index.html`, `hero.jpg`, and `CNAME` is ever actually
served — `git history` existing isn't the same as GitHub Pages serving
it; Pages only serves the branch's current tree snapshot.

### 2. Hostinger DNS

In Hostinger's DNS zone editor for `rogeriodocarmo.com`, add:

| Type  | Host  | Target                     |
| ----- | ----- | -------------------------- |
| CNAME | `3ds` | `rogeriodocarmo.github.io` |

(Hostinger's panel doesn't support delegating a subdomain via NS records —
only plain record types like this CNAME. See the design doc's "What we
learned" section for why that ruled out Cloudflare Pages.)

### 3. GitHub repo settings → Pages

In this repo's **Settings → Pages**:

- **Source:** branch `3ds-pages`, folder `/ (root)`.
- **Custom domain:** `3ds.rogeriodocarmo.com`.
- Wait for GitHub to provision the certificate (can take a few minutes).
- **Enforce HTTPS:** tested on the real Old 3DS on 2026-11-23 —
  `https://3ds.rogeriodocarmo.com/` loads (with the same mild SSL warning
  modal seen during the design doc's earlier GitHub Pages testing; not a
  clean padlock), and the page works past that warning. Decision: **enforce
  HTTPS**. Enabled on 2026-11-24:

  ```bash
  gh api -X PUT repos/RogerioDoCarmo/curriculo/pages -F "https_enforced=true"
  ```

  (`-F`, not `-f` — the field is a boolean, and `-f` sends it as a string,
  which the API rejects.)

  **If this returns `404 "The certificate does not exist yet"` for a long
  time** (this instance sat stuck for over 24h, well past GitHub's own
  "can take a few minutes" and even past the occasional "up to 24 hours"
  outlier): check `gh api repos/<owner>/<repo>/pages --jq .status` first —
  `"built"` with no `pending_domain_unverified_at` and no
  `protected_domain_state` rules out an actual misconfiguration (also check
  CAA records don't block Let's Encrypt: `curl -s
"https://dns.google/resolve?name=<domain>&type=CAA"` — CAA lookups follow
  the CNAME chain, so a GitHub Pages domain inherits `*.github.io`'s CAA,
  which already allows `letsencrypt.org`). If the build is healthy and CAA
  isn't the issue, the fix that worked here was clearing and re-adding the
  custom domain to force GitHub to restart verification and re-request the
  cert — not removing/re-adding the DNS CNAME, just the Pages API's `cname`
  field:

  ```bash
  gh api -X PUT repos/<owner>/<repo>/pages -F "cname="
  sleep 5
  gh api -X PUT repos/<owner>/<repo>/pages -F "cname=<domain>"
  ```

  This briefly takes the custom domain off Pages (falls back to serving on
  `<owner>.github.io` for a minute) before re-adding it. In this case the
  certificate turned out to already be `"approved"` server-side the moment
  verification re-ran — the stuck state was in GitHub's own Pages record,
  not in DNS or the cert pipeline itself. The `https_enforced=true` PUT
  then succeeded immediately. The re-add can also leave the `status` as
  `"errored"` on a stale build record even though the live site is already
  serving 200s on the new cert — verify with a direct `curl -sv
https://<domain>/` rather than trusting `status` alone, and if it is
  stale, clear it with a fresh manual build:

  ```bash
  gh api -X POST repos/<owner>/<repo>/pages/builds
  ```

## Every time the content changes

```bash
npm run build:3ds
git worktree add ../3ds-pages-worktree 3ds-pages
cd ../3ds-pages-worktree
git rm -rf .
cp -r ../website/legacy-3ds-dist/* .
git add -A
git commit -m "chore: update 3DS legacy page"
git push
cd -
git worktree remove ../3ds-pages-worktree
```

`git rm -rf .` here only touches the throwaway worktree, never `develop`
— it's what keeps the published tree down to just the three generated
files on every publish, regardless of what `3ds-pages` inherited from
`develop` at branch time.

This is intentionally manual — see the design doc's non-goals. If this
ever grows into something updated often, wiring it into a GitHub Actions
step (or GitHub's own Pages Git integration) is a reasonable next step,
but isn't part of this plan.
