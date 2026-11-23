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
- **Enforce HTTPS:** decide based on a real-device test once the domain is
  live — the design doc's own testing found GitHub Pages loads with a mild
  SSL warning on the real Old 3DS (not a clean padlock like Cloudflare's),
  so forcing HTTPS should still work, but confirm on the actual console
  before relying on it. _(Record the result here once tested.)_

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
