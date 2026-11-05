---
id: offline-detector
title: offline-detector
description: Headless connectivity detector for React and React Native that confirms real internet access, not just the browser's online flag, with ready-made snackbar, banner and indicator UI. Published on npm, early development (0.x)
featured: false
date: 2026-10-28
order: 2
technologies:
  - TypeScript
  - React
  - React Native
  - Jest
  - fast-check
  - Stryker
  - Playwright
  - Turborepo
  - pnpm
  - Docusaurus
  - GitHub Actions
  - Changesets
repoUrl: https://github.com/RogerioDoCarmo/offline-detector
liveUrl: https://rogeriodocarmo.github.io/offline-detector/demo/
videoUrl: https://youtu.be/D-3uEW5jEhE
images:
  - /images/projects/offline-detector.png
---

## Overview

Most connectivity libraries trust `navigator.onLine`, which lies whenever a network is connected but carries no data. offline-detector confirms reachability with a small probe instead, then ships the full user-facing experience that goes with it: a headless hook, callbacks and ready-made snackbar, banner, indicator and optional full-screen UI, for web and React Native from one package family with no native code required.

It starts quiet — nothing shows at launch — and shows a "No internet" snackbar with a one-tap Retry when the probe fails, clearing automatically for 4 seconds once the connection comes back. English, Brazilian Portuguese and Spanish strings are bundled, every one overridable through a single `strings` prop.

## Status

offline-detector is in early development (0.x): published on npm and usable, but the API may still change before 1.0. Four scoped packages cover every layer — `core` (framework-free state machine and probe), `react` (provider and hooks), `web` (DOM UI) and `native` (React Native UI) — so a consumer installs only what their platform needs. The source is open under the MIT license.

## Engineering

- **Monorepo with Turborepo and pnpm workspaces**: four published packages sharing one TypeScript and lint configuration, built with rslib.
- **Testing at every level**: unit and property-based tests with Jest and fast-check, mutation testing with Stryker, and end-to-end flows in Playwright with axe accessibility checks on the live offline state.
- **Documentation site in three languages**: a Docusaurus site covering quick start, API reference, theming and SSR, plus a live interactive demo for both the web and native UI.
- **CI/CD on GitHub Actions**: lint, typecheck, unit, mutation and e2e pipelines, with Changesets managing versioning and npm publishing.
- **Private by default**: the only network traffic is the configurable reachability probe itself — a `HEAD` request with no cookies and no personal data, documented in the privacy policy.

## Links

- [Documentation](https://rogeriodocarmo.github.io/offline-detector/) — quick start, API reference, theming, SSR
- [Live demo](https://rogeriodocarmo.github.io/offline-detector/demo/) — try the web and native UI side by side
- [Source code on GitHub](https://github.com/RogerioDoCarmo/offline-detector) — MIT license
- [Privacy policy](https://rogeriodocarmo.github.io/offline-detector/privacy-policy.html)
