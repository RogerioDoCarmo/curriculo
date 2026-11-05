---
id: offline-detector-release-post
platform: linkedin
kind: post
title: "Launching offline-detector"
description: "An open-source connectivity detector for React and React Native that confirms real internet access, not just the OS's online flag — with ready-made UI and a hook for custom ones."
url: "https://www.linkedin.com/posts/rogeriodocarmo_react-reactnative-typescript-ugcPost-7523925227072978944-Qxb9/"
language: pt-BR
featured: false
date: "2026-11-04"
---

The launch announcement for offline-detector, an open-source library that checks for real internet access with a small test request instead of trusting the browser's or OS's online flag, and shows it with a snackbar, banner, indicator or full-screen view — plus a "back online" message once the connection returns. A `useNetworkStatus` hook exposes the same state for anyone building their own UI.

Built with TypeScript, React 19 and React Native 0.86 (Expo SDK 57), with no native code and no dependencies such as Reanimated, published as separate npm packages for its core, React, web and React Native bindings. Tested with Jest, fast-check, Playwright with axe, and Stryker mutation testing, and documented with Docusaurus in three languages. Still at 0.x, so the API may change before 1.0.
