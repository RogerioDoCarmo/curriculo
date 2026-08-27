---
id: miroji
title: Miroji
description: Front-camera mirror app published on the App Store and F-Droid, used as a case study in hexagonal architecture, automated testing and CI/CD
featured: true
date: 2026-08-18
technologies:
  - React Native 0.81
  - Expo SDK 54
  - TypeScript
  - Jest
  - fast-check
  - Stryker
  - Maestro
  - GitHub Actions
  - SonarCloud
  - Chromatic
  - Storybook
  - EAS Build
repoUrl: https://github.com/RogerioDoCarmo/mirror_app
liveUrl: https://rogeriodocarmo.github.io/mirror_app/
appStoreUrl: https://apps.apple.com/us/app/miroji/id6774924907
fdroidUrl: https://f-droid.org/en/packages/com.rogeriodocarmo.miroji
images:
  - /images/projects/miroji.png
---

## Overview

Miroji is a mirror app that uses the device's front camera. The feature set is deliberately simple, and that choice is the point of the project: with the product scope reduced to a minimum, the challenge becomes entirely an engineering one — architecture, testing, automation and the store publishing process.

It is available on the App Store and on F-Droid, with all source code open under the MIT license.

## Where to Download

- [App Store](https://apps.apple.com/us/app/miroji/id6774924907) — iPhone, iPad and Apple Silicon Macs
- [F-Droid](https://f-droid.org/en/packages/com.rogeriodocarmo.miroji) — Android, built from source by the catalogue itself
- [Source code on GitHub](https://github.com/RogerioDoCarmo/mirror_app) — MIT license

## Key Features

### Hexagonal Architecture

- Pure domain, with no dependencies on React, Expo or any UI library
- Ports and adapters isolating camera, permissions and location from the application core
- Dependency injection through React Context, allowing adapters to be swapped in tests without platform mocks
- TypeScript in strict mode, with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`

### Testing at Four Levels

- 71 unit and integration tests with 100% coverage of statements, branches, functions and lines
- Property-based tests with fast-check
- Mutation testing with Stryker, measuring test quality rather than coverage alone
- E2E tests with Maestro, running on iOS and Android on every pull request

### Continuous Integration and Delivery

- Five GitHub Actions workflows: CI, E2E, Chromatic, EAS build and Firebase distribution
- SonarCloud quality gate, with coverage mirroring the Jest exclusions
- Visual regression on Chromatic, fed by a web Storybook alongside the on-device Storybook
- Automatic build distribution to testers through Firebase App Distribution

### Privacy

- The app contains no networking code whatsoever
- Nothing is recorded, stored or transmitted: the camera image exists only on screen
- Permission surface reduced to a single one: `CAMERA`

### Internationalization

- Full interface in Portuguese, English, Spanish and Japanese
- Automatic device language detection

## Technical Challenges

1. **Publishing on F-Droid**: the catalogue builds apps from source and does not accept proprietary dependencies. `expo-camera` depends on Google's ML Kit libraries for barcode scanning, which made submission impossible. I wrote a patch that removes those libraries while preserving the module's public API, allowing the app into the catalogue with no anti-features.

2. **Artifact size reduction**: the APK went from 69 MB to 20 MB, combining the ML Kit removal, restricting to ARM architectures and legacy packaging of the native libraries.

3. **Permission hygiene**: an Expo config plugin removes unused permissions from release builds only, through a dedicated source set — preserving the permissions the development environment needs. The declared surface went from seven permissions down to one, verified directly in the generated artifact.

4. **Reproducible build outside Expo**: a workflow generates a self-contained Gradle snapshot of the project in a separate repository, which F-Droid builds with plain `gradlew`, without depending on Node, pnpm or the Expo CLI in the build environment.

## Takeaways

- Hexagonal architecture applied to React Native, with a domain testable without relying on platform mocks
- Mutation testing as a measure of test quality, exposing assertions that pass without verifying anything
- The review process of a free software catalogue, with build-from-source requirements
- The full submission and review cycle on app stores, including privacy policies and data disclosure

## Impact

- Published on the App Store, with compatibility also verified on Apple Silicon Macs
- Published on F-Droid, built by the catalogue itself and listed with no anti-features
- 14 releases over three months of development
- Open, documented codebase serving as a practical reference for the practices described above
