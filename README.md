# Personal Resume Website

<!-- Build & Deployment Status -->

[![CI](https://github.com/RogerioDoCarmo/curriculo/actions/workflows/ci.yml/badge.svg)](https://github.com/RogerioDoCarmo/curriculo/actions/workflows/ci.yml)
[![Vercel](https://deploy-badge.vercel.app/?url=https://rogeriodocarmo.com&name=Vercel)](https://rogeriodocarmo.com)

<!-- Code Quality -->

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=RogerioDoCarmo_curriculo)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=coverage)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=RogerioDoCarmo_curriculo&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=RogerioDoCarmo_curriculo)

<!-- Tech Stack -->

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

<!-- Project Info -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9.0-green?logo=node.js)](https://nodejs.org/)
[![Code Size](https://img.shields.io/github/languages/code-size/RogerioDoCarmo/curriculo)](https://github.com/RogerioDoCarmo/curriculo)
[![Last Commit](https://img.shields.io/github/last-commit/RogerioDoCarmo/curriculo)](https://github.com/RogerioDoCarmo/curriculo/commits/main)

A modern, responsive personal resume website built with Next.js 16, TypeScript, and Tailwind CSS. This website serves as both a professional portfolio and a functional resume, optimized for recruiters, AI agents, and human visitors.

## Development Progress

This project follows an incremental development approach with checkpoints to validate progress:

| Checkpoint   | Tag                   | Status         | Description                            |
| ------------ | --------------------- | -------------- | -------------------------------------- |
| Checkpoint 1 | `v0.1.0-checkpoint-1` | ✅ Complete    | Project setup and core infrastructure  |
| Checkpoint 2 | `v0.2.0-checkpoint-2` | ✅ Complete    | Content management, i18n, theme system |
| Checkpoint 3 | `v0.3.0-checkpoint-3` | ✅ Complete    | Core UI components, layout, forms      |
| Checkpoint 4 | _(validation only)_   | ✅ Complete    | Core functionality validation          |
| Checkpoint 5 | `v0.5.0-checkpoint-5` | ✅ Complete    | Firebase integration                   |
| Checkpoint 6 | TBD                   | 🔄 In Progress | SEO, accessibility, responsive design  |
| Checkpoint 7 | TBD                   | ⏳ Pending     | Final testing and deployment           |

See [tasks.md](.kiro/specs/personal-resume-website/tasks.md) for detailed implementation plan.

## Features

- **Multi-Language Support**: Brazilian Portuguese (pt-BR), English (en), Spanish (es)
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Career Path Selection**: Toggle between Professional Developer and Academic career paths
- **Portfolio Showcase**: Interactive project gallery with detailed views
- **Contact Form**: Integrated with Formspree for email delivery
- **SEO Optimized**: Structured data, sitemap, and meta tags
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Performance**: 90+ Lighthouse score with lazy loading
- **Print/PDF Export**: Professional print styling for resume export
- **Analytics**: Firebase Analytics and Vercel Analytics integration
- **Error Monitoring**: Firebase Crashlytics and Sentry integration
- **Push Notifications**: Firebase Cloud Messaging for new content
- **Deployment Notifications**: Automated push notifications on successful deployments (via Firebase Admin SDK in CI/CD)
- **URL Anchor Navigation**: Deep linking to specific sections
- **Tech Stack Explanation**: Simple explanations of technologies used

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Content**: Markdown files with Gray-matter parsing
- **Internationalization**: next-intl
- **Testing**: Jest, React Testing Library, Playwright, fast-check
- **Component Documentation**: Storybook 8
- **Analytics**: Firebase Analytics + Vercel Analytics
- **Error Monitoring**: Firebase Crashlytics + Sentry
- **Forms**: Formspree with react-hook-form
- **Push Notifications**: Firebase Cloud Messaging
- **CI/CD**: GitHub Actions + SonarQube Cloud
- **Deployment**: Vercel with custom domains
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Project Structure

```
personal-resume-website/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   └── api/                      # API routes
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   └── sections/                 # Page sections
├── content/                      # Markdown content files
├── messages/                     # i18n translation files
├── lib/                          # Utility functions
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── styles/                       # Additional stylesheets
├── tests/                        # Test files
├── .storybook/                   # Storybook configuration
└── .github/                      # GitHub Actions workflows
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd personal-resume-website

# Install dependencies
npm install
# or
yarn install
```

### ⚠️ Important: Branch Protection

**The `main` and `develop` branches are protected.**

Always create a feature branch before making changes:

```bash
# Check current branch
git branch --show-current

# Create feature branch (if on main/develop)
git checkout -b feature/your-feature-name
```

See [docs/GIT-WORKFLOW.md](./docs/GIT-WORKFLOW.md) for complete Git workflow guide.

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
# or
yarn build
```

### Production

```bash
npm start
# or
yarn start
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run property-based tests
npm run test:properties

# Run Lighthouse performance tests (all-in-one: builds, serves, tests)
npm run test:lighthouse:full

# Run Lighthouse tests manually (requires production build)
npm run build && npm run serve  # Terminal 1
npm run test:lighthouse         # Terminal 2
```

**Note**: Lighthouse tests must run against the production build (`npm run serve`), not the dev server (`npm run dev`). Use `test:lighthouse:full` for convenience.

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines and best practices.

## Deployment

The website is deployed on Vercel with automatic deployments from the main branch. The site is accessible through **11 custom domains**, all pointing to the same deployment:

- **rogeriodocarmo.com** (primary)
- rogeriodocarmo.io
- rogeriodocarmo.info
- rogeriodocarmo.click
- rogeriodocarmo.shop
- rogeriodocarmo.org
- rogeriodocarmo.net
- rogeriodocarmo.tech
- rogeriodocarmo.com.br
- rogeriodocarmo.online
- rogeriodocarmo.xyz

See [docs/DOMAINS.md](./docs/DOMAINS.md) for complete domain configuration and management guide.

### Environment Variables

See `.env.example` for required environment variables. Create `.env.local` for local development.

## Code Quality

- **Test Coverage**: Minimum 80% enforced in CI/CD
- **Code Quality**: SonarQube with 90% quality rating (A) requirement
- **Linting**: ESLint with Next.js recommended rules
- **Formatting**: Prettier with consistent formatting
- **Type Safety**: TypeScript strict mode

See [CONTRIBUTING.md](./CONTRIBUTING.md) for code style guidelines and development workflow.

## License

MIT

## Documentation

- [TESTING.md](./TESTING.md) - Comprehensive testing guide and best practices
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Code style guidelines and development workflow
- [docs/BADGES.md](./docs/BADGES.md) - **Explanation of all quality badges** (16 badges)
- [docs/GIT-WORKFLOW.md](./docs/GIT-WORKFLOW.md) - **Git workflow and branch protection guide** ⚠️
- [docs/DOMAINS.md](./docs/DOMAINS.md) - **Domain configuration and management** (11 domains)
- [docs/SEO-SUBMISSION-GUIDE.md](./docs/SEO-SUBMISSION-GUIDE.md) - Search engine submission guide
- [.kiro/docs/test-patterns.md](./.kiro/docs/test-patterns.md) - Quick reference for test patterns
- [.kiro/docs/code-quality-fixes.md](./.kiro/docs/code-quality-fixes.md) - Code quality improvements log
