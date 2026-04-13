# Personal Resume Website

A modern, responsive personal resume website built with Next.js 14, TypeScript, and Tailwind CSS. This website serves as both a professional portfolio and a functional resume, optimized for recruiters, AI agents, and human visitors.

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

- **Framework**: Next.js 14 (App Router) with TypeScript
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
```

## Deployment

The website is configured for deployment on Vercel with automatic deployments from the main branch. Custom domains are configured through the Vercel dashboard.

### Environment Variables

See `.env.example` for required environment variables. Create `.env.local` for local development.

## Code Quality

- **Test Coverage**: Minimum 90% enforced in CI/CD
- **Code Quality**: SonarQube with 90% quality rating (A) requirement
- **Linting**: ESLint with Next.js recommended rules
- **Formatting**: Prettier with consistent formatting
- **Type Safety**: TypeScript strict mode

## License

MIT
