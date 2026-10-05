---
id: omnimorse
title: OmniMorse
description: Morse code translator for Android and iOS (type, speak or tap it in; play it back as sound, flash, screen or vibration), built as a case study in hexagonal architecture and testing. Currently in testing, not in the stores yet
featured: false
date: 2026-10-04
technologies:
  - React Native 0.86
  - Expo SDK 57
  - TypeScript
  - Kotlin
  - Jest
  - fast-check
  - Stryker
  - Maestro
  - GitHub Actions
  - EAS Build
  - Firebase Crashlytics
repoUrl: https://github.com/RogerioDoCarmo/morse_app
videoUrl: https://youtu.be/CcyTyHB7n_M
images:
  - /images/projects/omnimorse.png
---

## Overview

OmniMorse is a Morse code translator for Android and iOS. Type a message and watch it become dots and dashes, say it out loud and let the phone transcribe it, or tap it in yourself on a key that measures how long you hold it: a short press is a dot, a long one is a dash, with a cut-off you can tune to your own speed.

A message can go out as sound, as the camera flash, as a flashing screen or as vibration, all in step from one clock. The interface and speech input are available in English, Brazilian Portuguese and Spanish.

## Status

OmniMorse is in testing and is not in the app stores yet. The source code is open under the MIT license, and the project's [privacy policy](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html) is already published.

## Engineering

- **Hexagonal architecture** (ports and adapters): the domain is pure functions that import no framework, and ESLint enforces the dependency rule instead of discipline.
- **Testing at every level**: over a thousand unit and property-based tests, mutation testing with Stryker, and end-to-end flows in Maestro on both platforms.
- **Native code where it matters**: local Kotlin modules for vibration and volume control.
- **CI/CD on GitHub Actions**: builds with EAS, distribution to testers through TestFlight and Firebase App Distribution, and pipelines that generate the store screenshots and promo videos from the running app.
- **Private by default**: no account, no ads, no analytics. The only data that leaves the device is anonymous crash diagnostics, which can be switched off in Settings.

## Links

- [Source code on GitHub](https://github.com/RogerioDoCarmo/morse_app) — MIT license
- [Privacy policy](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html)
