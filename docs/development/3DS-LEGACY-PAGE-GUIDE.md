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

### 1. Create the publish branch

A dedicated orphan branch, isolated from everything else in this repo
(including `docs/`, which is **not** safe to publish wholesale — it holds
committed planning docs that shouldn't go out on the open web).

```bash
git checkout --orphan 3ds-pages
git rm -rf .
git commit --allow-empty -m "chore: initialize 3ds-pages branch"
git push origin 3ds-pages
git checkout develop
```

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
- **Enforce HTTPS:** decide based on a real-device test once the domain is
  live — the design doc's own testing found GitHub Pages loads with a mild
  SSL warning on the real Old 3DS (not a clean padlock like Cloudflare's),
  so forcing HTTPS should still work, but confirm on the actual console
  before relying on it. _(Record the result here once tested.)_

## Every time the content changes

```bash
npm run build:3ds
git worktree add ../3ds-pages-worktree 3ds-pages
cp -r legacy-3ds-dist/* ../3ds-pages-worktree/
cd ../3ds-pages-worktree
git add -A
git commit -m "chore: update 3DS legacy page"
git push
cd -
git worktree remove ../3ds-pages-worktree
```

This is intentionally manual — see the design doc's non-goals. If this
ever grows into something updated often, wiring it into a GitHub Actions
step (or GitHub's own Pages Git integration) is a reasonable next step,
but isn't part of this plan.
