# Design Document: Personal Resume Website

## Overview

The personal resume website is a static, performance-optimized web application built to showcase a mobile React Native developer's professional experience, skills, and projects. The site serves as both a portfolio piece and a functional resume accessible to recruiters, AI agents, and potential employers.

### Core Design Principles

1. **Static-First Architecture**: Generate static HTML/CSS/JS for maximum performance and reliability
2. **Content Flexibility**: Enable easy content updates without code changes
3. **Multi-Audience Optimization**: Serve human visitors, AI agents, ATS systems, and search engines effectively
4. **Progressive Enhancement**: Ensure core content is accessible even without JavaScript
5. **Developer Portfolio**: Code quality and architecture demonstrate professional capabilities

### Tech Stack Decisions

#### Framework: Next.js 14 (App Router)

- **Rationale**: Next.js provides excellent static site generation (SSG), built-in image optimization, automatic code splitting, and strong SEO support. The App Router offers better performance and developer experience.
- **Static Export**: Use `output: 'export'` to generate pure static files for Vercel deployment
- **Alternatives Considered**: Gatsby (more complex, slower builds), Create React App (lacks SSG features), Astro (less React ecosystem support)

#### Styling: Tailwind CSS + CSS Modules

- **Rationale**: Tailwind provides rapid development with utility classes and excellent dark mode support. CSS Modules handle component-specific styles when needed.
- **Dark Mode**: Use Tailwind's `dark:` variant with `class` strategy for manual theme switching
- **Print Styles**: Dedicated print stylesheet using CSS `@media print`

#### Content Management: Markdown + Gray-Matter

- **Rationale**: Markdown files in the repository provide version control, easy editing, and no external dependencies. Gray-matter parses frontmatter for structured metadata.
- **Structure**: Content stored in `/content` directory with separate files for projects, experience, education
- **Build Integration**: Content parsed at build time and injected into static pages
- **Alternatives Considered**: Headless CMS (adds complexity and external dependency), JSON files (less readable for content editing)

#### Internationalization: next-intl

- **Rationale**: Lightweight, Next.js-optimized i18n library with static generation support
- **Languages**: Brazilian Portuguese (pt-BR, default), English (en), Spanish (es)
- **Detection**: Browser language detection on first visit, manual override with persistence
- **Structure**: Translation files in `/messages` directory (pt-BR.json, en.json, es.json)

#### Testing Framework: Jest + React Testing Library + Playwright

- **Unit/Integration Testing**: Jest is the industry standard with mature ecosystem, extensive documentation, and excellent React support. RTL encourages testing user behavior over implementation details.
- **E2E Testing**: Playwright provides fast, reliable cross-browser testing with excellent debugging tools
- **Property Testing**: fast-check library for property-based tests
- **Coverage**: Minimum 90% code coverage enforced in CI/CD
- **Configuration**: Next.js has built-in Jest support with `next/jest` configuration
- **Testing Best Practices**:
  - **ALWAYS use `waitFor` instead of `act()`**: When testing async state updates, wrap assertions in `waitFor()` from `@testing-library/react`
  - **Never use `act()` directly**: React Testing Library's utilities handle `act()` internally
  - **Suppress `act()` warnings**: Configure Jest setup to suppress expected React 18 `act()` warnings that occur during state updates
  - **Example pattern**:

    ```typescript
    // ✓ CORRECT: Use waitFor for async state updates
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText("Updated")).toBeInTheDocument();
    });

    // ✗ INCORRECT: Don't use act() directly
    await act(async () => {
      await user.click(button);
    });
    ```

#### Component Documentation: Storybook 8

- **Rationale**: Industry standard for component documentation, supports React and provides interactive playground
- **Deployment**: Storybook built and deployed alongside main site

#### Analytics: Firebase Analytics + Vercel Analytics

- **Rationale**: Firebase Analytics provides detailed user behavior tracking and integrates with Crashlytics. Vercel Analytics tracks Core Web Vitals. Using both demonstrates proficiency with multiple analytics platforms.
- **Events**: Track page views, contact form submissions, project clicks, language changes, theme toggles, career path selections
- **Firebase-specific**: User engagement metrics, conversion funnels, audience segmentation

#### Error Monitoring: Firebase Crashlytics + Sentry

- **Rationale**: Firebase Crashlytics provides crash reporting and integrates with Firebase Analytics for user context. Sentry offers detailed error tracking with source maps. Using both demonstrates comprehensive error monitoring strategy.
- **Configuration**: Client-side only (static site has no server-side runtime)
- **Firebase-specific**: Crash-free users percentage, crash velocity alerts

#### Form Handling: Formspree

- **Rationale**: Static-site-friendly form backend that sends submissions to email without requiring server infrastructure
- **Validation**: Client-side validation with react-hook-form before submission

#### Push Notifications: Firebase Cloud Messaging (FCM)

- **Rationale**: Demonstrates real-time notification capabilities. Notifies visitors when new content is published while they have the site open.
- **Use case**: Learning and showcase purposes - shows proficiency with FCM and service workers
- **Implementation**: Service worker for background notifications, foreground notification handler

#### CI/CD: GitHub Actions + SonarQube Cloud

- **Rationale**: GitHub Actions integrates seamlessly with GitHub repository. SonarQube Cloud provides code quality analysis without self-hosting.
- **Free Tier**: SonarQube Cloud is free for public open-source projects (no credit card required)
- **Quality Gate**: Minimum 90% quality rating (A), zero critical issues
- **Setup**: Sign up at sonarcloud.io with your GitHub account and import your repository

## Environment Variables and Security

### Environment Variable Strategy

The application uses environment variables to securely store API keys, credentials, and configuration values. Next.js supports multiple environment files for different contexts:

- `.env.local` - Local development secrets (never committed to Git)
- `.env.example` - Template with placeholder values (committed to Git)
- Vercel Dashboard - Production environment variables

### Required Environment Variables

#### Firebase Configuration (Public)

These variables are prefixed with `NEXT_PUBLIC_` to be accessible in the browser. They are safe to expose as they identify your Firebase project but don't grant write access:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
```

#### Firebase Admin SDK (Private - CI/CD only)

These are used in GitHub Actions to send FCM notifications when new content is published:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"
```

#### Sentry Configuration (Public)

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

#### Formspree Configuration (Public)

```bash
NEXT_PUBLIC_FORMSPREE_FORM_ID=your-form-id
```

#### SonarQube Configuration (Private - CI/CD only)

```bash
SONAR_TOKEN=your-sonarqube-token
SONAR_HOST_URL=https://sonarcloud.io
```

### Environment File Structure

**.env.example** (committed to repository):

```bash
# Firebase Configuration (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here

# Sentry Configuration (get from Sentry Dashboard)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Formspree Configuration (get from Formspree Dashboard)
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id_here

# Firebase Admin SDK (for CI/CD notifications - DO NOT use in browser)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"

# SonarQube Configuration (for CI/CD only)
SONAR_TOKEN=your_sonarqube_token
SONAR_HOST_URL=https://sonarcloud.io
```

**.env.local** (local development, never committed):

```bash
# Copy .env.example to .env.local and fill in your actual values
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=personal-resume-dev.firebaseapp.com
# ... rest of actual values
```

**.gitignore** (ensure these lines exist):

```
# Environment variables
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### Vercel Environment Variables Configuration

In the Vercel dashboard, configure environment variables for each deployment environment:

**Production Environment**:

- Add all `NEXT_PUBLIC_*` variables
- These will be embedded in the static build

**Preview/Development Environments**:

- Can use separate Firebase project for testing
- Use test Formspree form
- Use separate Sentry project

### GitHub Secrets Configuration

In GitHub repository settings → Secrets and variables → Actions, add:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SONAR_TOKEN`
- `VERCEL_TOKEN` (for deployment)
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Security Best Practices

1. **Never commit secrets**: Always use `.env.local` for sensitive values
2. **Use .env.example**: Provide a template for other developers
3. **Rotate keys regularly**: Update API keys periodically
4. **Limit permissions**: Use Firebase security rules to restrict access
5. **Monitor usage**: Check Firebase and Sentry dashboards for unusual activity
6. **Public vs Private**: Only use `NEXT_PUBLIC_` prefix for values safe to expose in browser
7. **CI/CD isolation**: Keep CI/CD secrets (SonarQube, Firebase Admin) separate from browser variables

### Accessing Environment Variables in Code

**Client-side (browser)**:

```typescript
// Only NEXT_PUBLIC_ prefixed variables are available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

**Build-time (Node.js)**:

```typescript
// All environment variables are available during build
const sonarToken = process.env.SONAR_TOKEN;
const firebaseAdminKey = process.env.FIREBASE_PRIVATE_KEY;
```

**Type safety**:

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_FORMSPREE_FORM_ID: string;
    // CI/CD only
    FIREBASE_PRIVATE_KEY?: string;
    SONAR_TOKEN?: string;
  }
}
```

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Visitor Browser"
        A[Browser Request]
        B[Static HTML/CSS/JS]
        C[React Hydration]
    end

    subgraph "Vercel CDN"
        D[Edge Cache]
        E[Static Files]
    end

    subgraph "Build Process"
        F[Content Files]
        G[Next.js Build]
        H[Static Export]
    end

    subgraph "External Services"
        I[Formspree API]
        J[Firebase Analytics]
        K[Firebase Crashlytics]
        L[Firebase Cloud Messaging]
        M[Vercel Analytics]
        N[Sentry]
    end

    A --> D
    D --> E
    E --> B
    B --> C
    C --> I
    C --> J
    C --> K
    C --> L
    C --> M
    C --> N
    F --> G
    G --> H
    H --> E
```

### Directory Structure

```
personal-resume-website/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Homepage
│   │   └── projects/             # Projects pages
│   ├── api/                      # API routes (if needed for build-time data)
│   └── globals.css               # Global styles and Tailwind imports
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ThemeToggle/
│   ├── sections/                 # Page sections
│   │   ├── Hero/
│   │   ├── Experience/
│   │   ├── Projects/
│   │   ├── Skills/
│   │   └── Contact/
│   ├── CareerPathSelector/       # Career path selection component
│   ├── ExitIntentModal/          # Exit intent detection
│   └── LanguageSelector/         # Language switcher
├── content/                      # Markdown content files
│   ├── projects/
│   │   ├── project-1.md
│   │   └── project-2.md
│   ├── experience/
│   │   ├── professional.md
│   │   └── academic.md
│   └── skills.md
├── messages/                     # i18n translation files
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
├── lib/                          # Utility functions
│   ├── content.ts                # Content parsing utilities
│   ├── analytics.ts              # Analytics helpers (Firebase + Vercel)
│   ├── firebase.ts               # Firebase SDK initialization
│   ├── notifications.ts          # FCM notification handlers
│   └── structured-data.ts        # Schema.org JSON-LD generation
├── hooks/                        # Custom React hooks
│   ├── useTheme.ts               # Theme management
│   ├── useExitIntent.ts          # Exit intent detection
│   └── useLanguage.ts            # Language management
├── public/                       # Static assets
│   ├── images/
│   ├── resume.json               # JSON Resume format
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── firebase-messaging-sw.js  # FCM service worker
│   └── manifest.json             # PWA manifest for notifications
├── styles/                       # Additional stylesheets
│   └── print.css                 # Print-specific styles
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── properties/               # Property-based tests
├── .storybook/                   # Storybook configuration
├── .github/
│   └── workflows/
│       ├── ci.yml                # CI pipeline
│       └── deploy.yml            # Deployment pipeline
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── vitest.config.ts              # Vitest configuration
└── package.json
```

## Components and Interfaces

### Core Components

#### 1. Layout Components

**RootLayout**

- Purpose: Provides theme context, language context, and global layout structure
- Props: `{ children: ReactNode, locale: string }`
- Responsibilities: Theme provider initialization, font loading, metadata generation

**Header**

- Purpose: Site navigation and controls with URL anchor support
- Props: `{ locale: string }`
- Features: Language selector, theme toggle, navigation links with anchor navigation
- Anchor Navigation:
  - Updates URL hash when navigating to sections (e.g., `/#projects`, `/#experience`)
  - Highlights active section in navigation based on scroll position
  - Supports deep linking to all major sections
  - Uses smooth scrolling (500-800ms duration) for anchor navigation
  - Handles browser back/forward navigation correctly
- Responsive Navigation:
  - **Desktop (≥768px)**: Horizontal navbar at the top of the page
  - **Mobile (<768px)**: Left sidebar that slides in from the left
  - Hamburger menu button to toggle sidebar on mobile
  - Smooth slide-in/out animation for sidebar
  - Overlay/backdrop when sidebar is open
  - Close sidebar on link click or backdrop click
- Integration: Uses `useAnchorNavigation` hook for URL hash management

**Footer**

- Purpose: Contact information, social links, and site navigation
- Props: `{ locale: string }`
- Features:
  - Social media icons (LinkedIn, GitHub, Twitter)
  - Copyright notice
  - Text-based sitemap with links to all major sections
  - Multi-column layout on desktop, stacked on mobile
  - Sitemap sections: About, Projects, Experience, Skills, Contact, Languages
  - Helps users navigate and improves SEO

#### 2. Content Components

**Hero**

- Purpose: Display name, title, and career path selector
- Props: `{ name: string, title: string, locale: string }`
- Features: Animated introduction, career path selection

**CareerPathSelector**

- Purpose: Toggle between professional and academic career paths
- Props: `{ onSelect: (path: 'professional' | 'academic') => void, selected: string }`
- State: Selected career path
- Features: Smooth transition between paths, persists selection in session storage

**ExperienceSection**

- Purpose: Display work experience or academic background with visual timeline
- Props: `{ careerPath: 'professional' | 'academic', experiences: Experience[], locale: string }`
- Features:
  - Visual timeline with milestone markers
  - Chronological order (most recent first)
  - Expandable details for each experience
  - Date formatting with duration calculation
  - Highlights important milestones (degrees, promotions, major achievements)
  - Responsive: Vertical timeline on all screen sizes

**Timeline** (UI Component)

- Purpose: Visual representation of chronological events
- Props: `{ items: TimelineItem[], orientation: 'vertical' | 'horizontal' }`
- Features:
  - Vertical line connecting timeline items
  - Circular markers for each milestone
  - Different marker styles for different event types (education, work, achievement)
  - Date labels positioned alongside markers
  - Content cards for each timeline item
  - Smooth animations on scroll
  - Accessible with proper ARIA labels

**ProjectsSection**

- Purpose: Showcase portfolio projects
- Props: `{ projects: Project[], locale: string }`
- Features: Grid layout, project cards, modal for details, filtering by technology

**SkillsSection**

- Purpose: Display technical skills by category
- Props: `{ skills: SkillCategory[], locale: string }`
- Features: Categorized display, skill level indicators, search/filter

**ContactForm**

- Purpose: Enable visitor contact
- Props: `{ locale: string }`
- State: Form data, validation errors, submission status
- Features: Client-side validation, Formspree integration, success/error feedback

**TechStackSection**

- Purpose: Explain the technologies used to build the website in simple terms
- Props: `{ locale: string }`
- Features:
  - Organized by category (Framework, Styling, Content, Testing, etc.)
  - Simple, non-technical explanations for each technology
  - Technology logos/icons with visual recognition
  - Benefits explained in plain language
  - Responsive grid/card layout
  - Available in all supported languages (pt-BR, en, es)
  - Links to official documentation for curious visitors
  - Accessible with proper heading structure
- State: Form data, validation errors, submission status
- Features: Client-side validation, Formspree integration, success/error feedback

#### 3. UI Components

**ThemeToggle**

- Purpose: Switch between light and dark modes
- Props: `{ className?: string }`
- Features: Sun/moon icon, smooth transition, persists preference

**LanguageSelector**

- Purpose: Change site language
- Props: `{ currentLocale: string, availableLocales: string[] }`
- Features: Dropdown menu, flag icons, persists preference

**Button**

- Purpose: Reusable button component
- Props: `{ variant: 'primary' | 'secondary' | 'ghost', size: 'sm' | 'md' | 'lg', children: ReactNode, onClick?: () => void }`
- Features: Multiple variants, loading state, disabled state

**HighlightedText**

- Purpose: Display text with specific parts highlighted in bold
- Props: `{ text: string, highlight: string, className?: string }`
- Features:
  - Takes full text content and substring to highlight
  - Automatically finds and bolds the specified substring
  - Case-insensitive matching by default
  - Supports multiple occurrences of the highlight text
  - Falls back to regular text if highlight not found
  - Accessible with proper semantic markup
  - Example: `<HighlightedText text="I love React Native development" highlight="React Native" />`
  - Renders: "I love **React Native** development"

**BackToTopButton**

- Purpose: Floating button to scroll back to top of page
- Props: `{ className?: string, threshold?: number }`
- Features:
  - Fixed position in bottom-right corner of viewport
  - Appears when user scrolls down more than threshold (default: 300px)
  - Hidden when at top of page
  - Smooth scroll animation to top on click (500-800ms duration)
  - Upward arrow icon indicating purpose
  - Follows current theme (light/dark mode)
  - Keyboard accessible (Tab navigation)
  - ARIA labels for screen readers
  - Hidden in print media

**Card**

- Purpose: Container for content sections
- Props: `{ title?: string, children: ReactNode, className?: string }`
- Features: Consistent styling, hover effects, responsive

**Modal**

- Purpose: Display overlay content
- Props: `{ isOpen: boolean, onClose: () => void, children: ReactNode, title?: string }`
- Features: Focus trap, ESC to close, backdrop click to close, accessible

**ExitIntentModal**

- Purpose: Display content when exit intent detected
- Props: `{ content: ReactNode, onDismiss: () => void }`
- Features: Exit intent detection, session-based display, mobile-disabled

#### 4. Utility Components

**StructuredData**

- Purpose: Inject Schema.org JSON-LD into page head
- Props: `{ type: 'Person' | 'WebSite', data: object }`
- Features: Generates valid JSON-LD, supports multiple schema types

**SEOHead**

- Purpose: Manage page metadata
- Props: `{ title: string, description: string, keywords: string[], ogImage?: string, locale: string }`
- Features: Meta tags, Open Graph tags, Twitter cards, canonical URLs

### Data Models

#### Project

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string;
}
```

#### Experience

```typescript
interface Experience {
  id: string;
  type: "professional" | "academic";
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string; // undefined means current
  description: string;
  achievements: string[];
  technologies?: string[];
}
```

#### SkillCategory

```typescript
interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}
```

#### ContactFormData

```typescript
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

#### TechStackItem

```typescript
interface TechStackItem {
  id: string;
  name: string;
  category:
    | "framework"
    | "styling"
    | "content"
    | "testing"
    | "analytics"
    | "deployment"
    | "monitoring";
  description: string; // Simple, non-technical description (1-2 sentences)
  whyChosen: string; // Why this technology was chosen for this project
  benefits: string[]; // How it benefits the website
  icon?: string; // Icon name or URL for the technology
  documentationUrl?: string; // Link to official documentation
  logoUrl?: string; // URL to technology logo/icon
}
```

#### TimelineItem

```typescript
interface TimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string; // Organization or institution name
  description: string;
  type: "education" | "work" | "achievement" | "milestone";
  icon?: string; // Optional icon name
  highlighted?: boolean; // For important milestones
}
```

### Custom Hooks

#### useTheme

```typescript
function useTheme(): {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
};
```

- Manages theme state
- Persists to localStorage
- Applies theme class to document root
- Detects system preference on first load

#### useExitIntent

```typescript
function useExitIntent(options: { enabled: boolean; threshold: number; minTimeOnPage: number }): {
  showModal: boolean;
  dismissModal: () => void;
};
```

- Tracks mouse movement
- Detects exit intent
- Manages session-based display
- Disabled on mobile

#### useLanguage

```typescript
function useLanguage(): {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
};
```

- Manages language state
- Persists to localStorage
- Integrates with next-intl

#### useMediaQuery

```typescript
function useMediaQuery(query: string): boolean;
```

- Detects media query matches
- Used for responsive behavior
- SSR-safe with hydration handling

#### useAnchorNavigation

```typescript
function useAnchorNavigation(sections: string[]): {
  currentSection: string;
  navigateTo: (sectionId: string) => void;
  isActive: (sectionId: string) => boolean;
};
```

- Manages URL hash-based navigation
- Updates URL hash without page reload
- Tracks active section based on scroll position
- Handles browser history navigation (back/forward)
- Integrates with Next.js router for locale-aware URLs

## Data Models

### Content File Structure

#### Project Markdown File

```markdown
---
id: project-1
title: E-Commerce Mobile App
description: React Native e-commerce app with payment integration
featured: true
date: 2024-01-15
technologies:
  - React Native
  - TypeScript
  - Redux
  - Stripe
liveUrl: https://example.com
repoUrl: https://github.com/user/project
images:
  - /images/projects/project-1-1.jpg
  - /images/projects/project-1-2.jpg
---

Detailed project description goes here...

## Features

- Feature 1
- Feature 2

## Challenges

- Challenge 1
- Challenge 2
```

#### Experience Markdown File

```markdown
---
type: professional
organization: Tech Company Inc
role: Senior React Native Developer
location: Remote
startDate: 2022-03-01
endDate: 2024-01-15
technologies:
  - React Native
  - TypeScript
  - GraphQL
---

Description of role and responsibilities...

### Achievements

- Achievement 1
- Achievement 2
```

### JSON Resume Format

The site will generate and serve a `/resume.json` file following the [JSON Resume schema](https://jsonresume.org/schema/):

```json
{
  "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  "basics": {
    "name": "Developer Name",
    "label": "Mobile React Native Developer",
    "email": "email@example.com",
    "phone": "+55 (11) 99999-9999",
    "url": "https://rogeriodocarmo.com",
    "summary": "Professional summary...",
    "location": {
      "city": "City",
      "countryCode": "BR"
    },
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "username",
        "url": "https://linkedin.com/in/username"
      }
    ]
  },
  "work": [],
  "education": [],
  "skills": [],
  "languages": []
}
```

### Schema.org Structured Data

The site will embed JSON-LD structured data for AI agents and search engines:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Developer Name",
  "jobTitle": "Mobile React Native Developer",
  "url": "https://rogeriodocarmo.com",
  "sameAs": ["https://linkedin.com/in/username", "https://github.com/username"],
  "knowsAbout": ["React Native", "TypeScript", "Mobile Development"],
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "University Name"
    }
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Company Name"
    }
  ]
}
```

## Multi-Language Implementation

### Language Detection Flow

```mermaid
graph TD
    A[User Visits Site] --> B{Locale in URL?}
    B -->|Yes| C[Use URL Locale]
    B -->|No| D{Saved Preference?}
    D -->|Yes| E[Use Saved Locale]
    D -->|No| F[Detect Browser Language]
    F --> G{Supported Language?}
    G -->|Yes| H[Use Detected Language]
    G -->|No| I[Use Default pt-BR]
    C --> J[Render Page]
    E --> J
    H --> J
    I --> J
    J --> K[User Changes Language?]
    K -->|Yes| L[Save to localStorage]
    L --> M[Navigate to New Locale]
    M --> J
```

### Translation File Structure

Each language file (`messages/{locale}.json`) contains nested translation keys:

```json
{
  "nav": {
    "home": "Home",
    "projects": "Projects",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Hello, I'm",
    "title": "Mobile React Native Developer",
    "cta": "View My Work"
  },
  "careerPath": {
    "title": "Choose a Career Path",
    "professional": "Professional Developer",
    "academic": "Academic Background"
  },
  "contact": {
    "title": "Get in Touch",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "submit": "Send Message",
    "success": "Message sent successfully!",
    "error": "Failed to send message. Please try again."
  }
}
```

### Implementation Details

- **URL Structure**: `/{locale}/path` (e.g., `/en/projects`, `/pt-BR/projects`)
- **Default Locale**: Brazilian Portuguese (pt-BR) - no locale prefix in URL
- **Language Persistence**: localStorage key `preferred-locale`
- **Middleware**: Next.js middleware handles locale detection and redirects
- **Static Generation**: All pages pre-rendered for all supported locales

## Dark Mode Implementation

### Theme System Architecture

```mermaid
graph LR
    A[Page Load] --> B{Saved Preference?}
    B -->|Yes| C[Apply Saved Theme]
    B -->|No| D[Detect System Preference]
    D --> E{prefers-color-scheme: dark?}
    E -->|Yes| F[Apply Dark Mode]
    E -->|No| G[Apply Light Mode]
    C --> H[Render Page]
    F --> H
    G --> H
    H --> I[User Toggles Theme]
    I --> J[Update DOM Class]
    J --> K[Save to localStorage]
    K --> H
```

### Implementation Strategy

**Tailwind Configuration**:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class", // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: "#ffffff",
        foreground: "#000000",
        // Dark mode colors (applied with dark: prefix)
        "dark-background": "#0a0a0a",
        "dark-foreground": "#ededed",
      },
    },
  },
};
```

**Theme Provider**:

- Context provider wraps entire app
- Manages theme state and persistence
- Applies `dark` class to `<html>` element
- Prevents flash of unstyled content (FOUC) with inline script

**FOUC Prevention**:

```html
<script>
  // Inline script in <head> to apply theme before render
  (function () {
    const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  })();
</script>
```

**Color Contrast Requirements**:

- Light mode: Dark text (#1a1a1a) on light background (#ffffff) = 16.1:1 ratio
- Dark mode: Light text (#ededed) on dark background (#0a0a0a) = 15.8:1 ratio
- Both exceed WCAG AA requirement of 4.5:1

## CI/CD Pipeline Design

### GitHub Actions Workflow

```mermaid
graph TD
    A[Push to Branch] --> B[Checkout Code]
    B --> C[Install Dependencies]
    C --> D[Run Linting]
    C --> E[Run Type Check]
    C --> F[Run Tests]
    F --> G[Generate Coverage]
    G --> H{Coverage >= 90%?}
    H -->|No| I[Fail Pipeline]
    H -->|Yes| J[Run SonarQube Analysis]
    J --> K{Quality Gate Pass?}
    K -->|No| L[Fail Pipeline]
    K -->|Yes| M{Branch = main?}
    M -->|Yes| N[Build Static Site]
    M -->|No| O[End Pipeline]
    N --> P[Deploy to Vercel]
    P --> Q[Invalidate CDN Cache]
    Q --> R[Success Notification]
    I --> S[Failure Notification]
    L --> S
```

### CI Workflow (.github/workflows/ci.yml)

**Triggers**: Push to any branch, pull request to main

**Jobs**:

1. **Lint**: ESLint, Prettier check
2. **Type Check**: TypeScript compilation
3. **Test**: Vitest with coverage report
4. **SonarQube**: Code quality analysis
5. **Build**: Next.js static export (main branch only)

**Quality Gates**:

- ESLint: Zero errors (warnings allowed)
- TypeScript: Zero type errors
- Test Coverage: Minimum 90%
- SonarQube Quality Rating: Minimum A (90%)
- SonarQube Critical Issues: Zero

### SonarQube Configuration

**sonar-project.properties**:

```properties
sonar.projectKey=personal-resume-website
sonar.organization=your-org
sonar.sources=app,components,lib,hooks
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.stories.tsx
sonar.qualitygate.wait=true
```

**Quality Gate Conditions**:

- Coverage on New Code: >= 90%
- Maintainability Rating: A
- Reliability Rating: A
- Security Rating: A
- Critical Issues: 0
- Blocker Issues: 0

### Deployment Workflow

**Vercel Integration**:

- Automatic deployments on push to main
- Preview deployments for pull requests
- Environment variables configured in Vercel dashboard
- Custom domains configured with DNS settings

**Domain Configuration**:
All four domains point to the same Vercel deployment:

- rogeriodocarmo.com (primary)
- rogeriodocarmo.com.br
- rogeriodocarmo.xyz
- rogeriodocarmo.online

**Build Configuration**:

```javascript
// next.config.js
module.exports = {
  output: "export", // Static export
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better compatibility
};
```

## Firebase Integration

### Firebase Services Used

The project integrates three Firebase services to demonstrate proficiency with Firebase ecosystem:

1. **Firebase Analytics**: User behavior tracking and engagement metrics
2. **Firebase Crashlytics**: Crash reporting and stability monitoring
3. **Firebase Cloud Messaging (FCM)**: Push notifications for new content

### Firebase Configuration

**Firebase SDK Initialization** (`lib/firebase.ts`):

```typescript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (client-side only)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Messaging (client-side only)
let messaging;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, analytics, messaging };
```

### Firebase Analytics Implementation

**Analytics Helper** (`lib/analytics.ts`):

```typescript
import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export function trackPageView(url: string) {
  try {
    // Firebase Analytics
    if (analytics) {
      firebaseLogEvent(analytics, "page_view", {
        page_path: url,
        page_title: document.title,
      });
    }

    // Vercel Analytics
    if (typeof window !== "undefined" && window.va) {
      window.va("pageview", { path: url });
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

export function trackEvent(name: string, properties?: object) {
  try {
    // Firebase Analytics
    if (analytics) {
      firebaseLogEvent(analytics, name, properties);
    }

    // Vercel Analytics
    if (typeof window !== "undefined" && window.va) {
      window.va("event", { name, data: properties });
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

// Specific event trackers
export function trackContactFormSubmission(success: boolean) {
  trackEvent("contact_form_submission", { success });
}

export function trackProjectClick(projectId: string, projectTitle: string) {
  trackEvent("project_click", {
    project_id: projectId,
    project_title: projectTitle,
  });
}

export function trackLanguageChange(from: string, to: string) {
  trackEvent("language_change", { from_language: from, to_language: to });
}

export function trackThemeToggle(theme: "light" | "dark") {
  trackEvent("theme_toggle", { theme });
}

export function trackCareerPathSelection(path: "professional" | "academic") {
  trackEvent("career_path_selection", { career_path: path });
}
```

### Firebase Crashlytics Implementation

**Crashlytics Integration**:

```typescript
// lib/firebase.ts (add to existing file)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Note: Crashlytics is primarily for mobile apps (iOS/Android)
// For web, we use Firebase's error reporting through Analytics
// Combined with Sentry for detailed web error tracking

export function logError(error: Error, context?: object) {
  try {
    // Log to Firebase Analytics as error event
    if (analytics) {
      firebaseLogEvent(analytics, "exception", {
        description: error.message,
        fatal: false,
        ...context,
      });
    }

    // Also log to Sentry for detailed tracking
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
      });
    }
  } catch (e) {
    console.error("Error logging failed:", e);
  }
}

export function setUserProperties(properties: object) {
  try {
    if (analytics) {
      Object.entries(properties).forEach(([key, value]) => {
        setUserProperties(analytics, { [key]: value });
      });
    }
  } catch (error) {
    console.error("Failed to set user properties:", error);
  }
}
```

### Firebase Cloud Messaging (FCM) Implementation

**Service Worker** (`public/firebase-messaging-sw.js`):

```javascript
// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Navigate to the site
  event.waitUntil(clients.openWindow("/"));
});
```

**Notification Handler** (`lib/notifications.ts`):

```typescript
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging not available");
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", token);

      // Store token in localStorage for later use
      localStorage.setItem("fcm_token", token);

      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
}

export function setupForegroundNotifications() {
  if (!messaging) return;

  // Handle foreground messages
  onMessage(messaging, (payload) => {
    console.log("Received foreground message:", payload);

    // Show custom notification UI
    showNotificationBanner({
      title: payload.notification?.title || "New Content Available",
      body: payload.notification?.body || "Check out the latest updates!",
      action: () => {
        // Reload page to show new content
        window.location.reload();
      },
    });
  });
}

function showNotificationBanner(notification: { title: string; body: string; action: () => void }) {
  // Create and show a custom notification banner in the UI
  // This could be a toast notification or banner component
  const banner = document.createElement("div");
  banner.className = "notification-banner";
  banner.innerHTML = `
    <div class="notification-content">
      <h4>${notification.title}</h4>
      <p>${notification.body}</p>
      <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
      <button id="notification-action">View</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("notification-action")?.addEventListener("click", () => {
    notification.action();
    banner.remove();
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => banner.remove(), 10000);
}
```

**Notification Component** (`components/NotificationPrompt.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission, setupForegroundNotifications } from '@/lib/notifications';

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);

      // Show prompt if permission not yet requested
      if (Notification.permission === 'default') {
        // Wait a bit before showing prompt (don't annoy users immediately)
        setTimeout(() => setShowPrompt(true), 10000);
      }

      // Setup foreground notifications if permission granted
      if (Notification.permission === 'granted') {
        setupForegroundNotifications();
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setPermission('granted');
      setShowPrompt(false);
      setupForegroundNotifications();
    }
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="notification-prompt">
      <div className="notification-prompt-content">
        <h3>Stay Updated</h3>
        <p>Get notified when new projects are added to the portfolio</p>
        <div className="notification-prompt-actions">
          <button onClick={() => setShowPrompt(false)}>Maybe Later</button>
          <button onClick={handleEnableNotifications} className="primary">
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Triggering Notifications on Content Updates

**Build-time Notification Trigger**:

When new content is added and the site is rebuilt, trigger FCM notifications to subscribed users:

```typescript
// scripts/notify-content-update.ts
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function notifyContentUpdate(contentType: "project" | "experience", title: string) {
  const message = {
    notification: {
      title: "New Content Available!",
      body: `Check out the new ${contentType}: ${title}`,
    },
    topic: "content_updates", // All subscribed users
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// Call this in your CI/CD pipeline after detecting new content
// Example: notifyContentUpdate('project', 'E-Commerce Mobile App');
```

**GitHub Actions Integration**:

Add to your CI/CD workflow to send notifications when new content is detected:

```yaml
# .github/workflows/deploy.yml
- name: Check for new content
  id: content_check
  run: |
    # Compare content files with previous commit
    NEW_PROJECTS=$(git diff HEAD~1 HEAD --name-only | grep "content/projects" | wc -l)
    echo "new_projects=$NEW_PROJECTS" >> $GITHUB_OUTPUT

- name: Send FCM notification
  if: steps.content_check.outputs.new_projects > 0
  run: |
    node scripts/notify-content-update.js
  env:
    FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
    FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
    FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
```

### Firebase Security and Best Practices

1. **Environment Variables**: Store all Firebase config in environment variables
2. **Security Rules**: Not applicable (no Firestore/Storage used)
3. **Rate Limiting**: FCM has built-in rate limits
4. **User Privacy**:
   - Request notification permission explicitly
   - Provide clear opt-out mechanism
   - Don't track personally identifiable information
5. **Error Handling**: All Firebase calls wrapped in try-catch
6. **Graceful Degradation**: Site works fully without Firebase services

### Firebase Dashboard Monitoring

Monitor these metrics in Firebase Console:

- **Analytics**: User engagement, retention, conversion funnels
- **Crashlytics**: Crash-free users percentage, error trends
- **Cloud Messaging**: Notification delivery rates, open rates

## Structured Data and SEO Optimization

### SEO Strategy

**Meta Tags**:

- Title: "Developer Name | Mobile React Native Developer"
- Description: Compelling summary with keywords
- Keywords: React Native, Mobile Developer, TypeScript, iOS, Android, etc.
- Canonical URL: Primary domain (rogeriodocarmo.com)

**Open Graph Tags**:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Developer Name | Mobile React Native Developer" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://rogeriodocarmo.com/og-image.jpg" />
<meta property="og:url" content="https://rogeriodocarmo.com" />
```

**Twitter Card Tags**:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

### Structured Data Implementation

**Person Schema**:
Embedded in every page to provide comprehensive information about the developer:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Developer Name",
  "jobTitle": "Mobile React Native Developer",
  "description": "Professional summary...",
  "url": "https://rogeriodocarmo.com",
  "email": "email@example.com",
  "telephone": "+55-11-99999-9999",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://linkedin.com/in/username",
    "https://github.com/username",
    "https://twitter.com/username"
  ],
  "knowsAbout": [
    "React Native",
    "TypeScript",
    "Mobile Development",
    "iOS Development",
    "Android Development"
  ],
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "University Name",
      "sameAs": "https://university-website.com"
    }
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Mobile Developer",
    "occupationLocation": {
      "@type": "Country",
      "name": "Brazil"
    }
  }
}
```

**WebSite Schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Developer Name Portfolio",
  "url": "https://rogeriodocarmo.com",
  "description": "Personal portfolio and resume website",
  "inLanguage": ["pt-BR", "en", "es"]
}
```

### Semantic HTML Structure

```html
<html lang="pt-BR">
  <head>
    <!-- Meta tags, structured data -->
  </head>
  <body>
    <header>
      <nav aria-label="Main navigation">
        <!-- Navigation links -->
      </nav>
    </header>

    <main>
      <article>
        <header>
          <h1>Developer Name</h1>
          <p>Mobile React Native Developer</p>
        </header>

        <section aria-labelledby="experience-heading">
          <h2 id="experience-heading">Experience</h2>
          <!-- Experience content -->
        </section>

        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          <!-- Projects content -->
        </section>

        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading">Skills</h2>
          <!-- Skills content -->
        </section>

        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <!-- Contact form -->
        </section>
      </article>
    </main>

    <footer>
      <!-- Footer content -->
    </footer>
  </body>
</html>
```

### Sitemap Generation

Next.js will generate `sitemap.xml` at build time:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://rogeriodocarmo.com/</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://rogeriodocarmo.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://rogeriodocarmo.com/en/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://rogeriodocarmo.com/es/" />
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs for each page and locale -->
</urlset>
```

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://rogeriodocarmo.com/sitemap.xml
```

## Print and PDF Optimization

### Print Stylesheet Strategy

**Separate Print CSS** (`styles/print.css`):

```css
@media print {
  /* Hide non-essential elements */
  nav,
  .theme-toggle,
  .language-selector,
  .exit-intent-modal,
  footer .social-links,
  button:not(.print-visible) {
    display: none !important;
  }

  /* Reset to print-friendly styles */
  * {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Typography for print */
  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.5;
  }

  h1 {
    font-size: 24pt;
  }
  h2 {
    font-size: 18pt;
  }
  h3 {
    font-size: 14pt;
  }

  /* Page breaks */
  h1,
  h2,
  h3 {
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  section {
    page-break-inside: avoid;
  }

  /* Margins for standard paper */
  @page {
    margin: 0.5in;
    size: letter; /* or A4 */
  }

  /* Expand collapsed content */
  details {
    display: block;
  }

  details summary {
    display: none;
  }

  details[open] > *:not(summary) {
    display: block;
  }

  /* Print URLs for links */
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 10pt;
    color: #666;
  }

  /* Contact information prominent */
  .contact-info {
    border-top: 2px solid black;
    padding-top: 12pt;
    margin-top: 12pt;
  }
}
```

### PDF Export Considerations

- Single-column layout for consistent pagination
- No fixed positioning or absolute positioning
- Expand all collapsible sections
- Include all contact information
- Remove interactive elements (buttons, forms)
- Ensure sufficient contrast for grayscale printing
- Page breaks before major sections
- Keep section headings with their content

## Exit Intent Detection

### Implementation Strategy

**Exit Intent Hook** (`hooks/useExitIntent.ts`):

```typescript
interface ExitIntentOptions {
  enabled: boolean;
  threshold: number; // pixels from top
  minTimeOnPage: number; // milliseconds
  onExitIntent: () => void;
}

function useExitIntent(options: ExitIntentOptions) {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  useEffect(() => {
    // Track time on page
    const startTime = Date.now();
    const timer = setInterval(() => {
      setTimeOnPage(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!options.enabled || hasTriggered) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Check if cursor is moving toward top edge
      if (
        e.clientY <= options.threshold &&
        e.movementY < 0 && // Moving upward
        timeOnPage >= options.minTimeOnPage
      ) {
        setHasTriggered(true);
        options.onExitIntent();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [options, hasTriggered, timeOnPage]);

  return { hasTriggered };
}
```

**Exit Intent Modal Content**:

- Headline: "Before you go..."
- Subheadline: "Stay connected with my work"
- Actions:
  - Download resume (PDF)
  - Connect on LinkedIn
  - Star GitHub repository
  - Subscribe to updates (if newsletter implemented)
- Close button (X icon)
- Backdrop click to dismiss

**Configuration**:

- Threshold: 20 pixels from top
- Minimum time on page: 5 seconds
- Disabled on mobile (viewport width < 768px)
- Session-based: Only shows once per session
- Accessible: Focus trap, ESC key to close, ARIA labels

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Image alt text and ARIA labels** (9.1, 9.5): Both relate to accessibility of non-text content. Combined into a single comprehensive property about accessible markup.

2. **Heading hierarchy** (9.2, 20.8): Both requirements specify proper heading structure. Combined into one property.

3. **Portfolio display properties** (2.1, 2.2, 2.3): All three test that project data is rendered correctly. Combined into a single property about complete project rendering.

4. **Semantic HTML** (7.5, 20.3): Both require semantic HTML5 elements. Combined into one property.

5. **Theme persistence and language persistence** (11.6, 17.7): Both are round-trip properties about preference storage. Kept separate as they test different features, but follow the same pattern.

6. **Content management properties** (21.5, 21.6): Both relate to content system capabilities. Combined into one property about content flexibility.

### Property 1: Career Path Selection Displays Correct Content

For any career path selection (professional or academic) and any content data for that path, selecting the path should display all the content associated with that path including experience entries, roles, dates, and descriptions.

**Validates: Requirements 1.3, 1.4**

### Property 2: Skills Organized by Category

For any set of skills with category labels, the rendered output should group skills under their respective category headings in a structured format.

**Validates: Requirements 1.5**

### Property 3: Career Path Switching Without Reload

For any career path switch action, the content should update without triggering a full page navigation or reload event.

**Validates: Requirements 1.7**

### Property 4: Complete Project Rendering

For any project with data fields (title, description, technologies, images), the rendered output should contain all non-empty fields from the project data.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 5: Project Links Rendered When Present

For any project with a live demo URL or repository URL, the rendered output should contain clickable anchor elements with those URLs as href attributes.

**Validates: Requirements 2.5**

### Property 6: Project Details Expansion

For any project in the portfolio, clicking or activating the project should reveal additional details not visible in the initial card view.

**Validates: Requirements 2.4**

### Property 7: Contact Form Accepts Valid Input

For any valid contact form data (non-empty name, valid email format, non-empty message), the form should accept and store the input values without validation errors.

**Validates: Requirements 3.2**

### Property 8: Contact Form Validates Required Fields

For any form submission attempt, the validation logic should check all required fields (name, email, message) and reject submissions with empty or invalid values.

**Validates: Requirements 3.3**

### Property 9: Successful Submission Shows Confirmation

For any successful form submission (validation passed, API call succeeded), the UI should display a confirmation message to the user.

**Validates: Requirements 3.5**

### Property 10: Responsive Image Optimization

For any viewport width, the images loaded should use the appropriate source or srcset that matches the viewport size category (mobile, tablet, desktop).

**Validates: Requirements 4.5**

### Property 11: Multi-Domain Content Consistency

For any of the configured domains (rogeriodocarmo.com, rogeriodocarmo.com.br, rogeriodocarmo.xyz, rogeriodocarmo.online), the content served should be identical.

**Validates: Requirements 5.5**

### Property 12: Lazy Loading for Below-Fold Images

For any image element that is positioned below the initial viewport (below the fold), the image should have the loading="lazy" attribute set.

**Validates: Requirements 6.3**

### Property 13: Semantic HTML Structure

For any page content, the HTML should use semantic HTML5 elements (article, section, header, nav, main, footer) to structure content rather than generic div elements.

**Validates: Requirements 7.5, 20.3**

### Property 14: All Images Have Alt Text

For any img element in the rendered output, the element should have an alt attribute with descriptive text, or role="presentation" if decorative.

**Validates: Requirements 9.1**

### Property 15: Proper Heading Hierarchy

For any page, the heading elements should follow a logical hierarchy where h1 appears first, followed by h2 for major sections, h3 for subsections, with no skipped levels.

**Validates: Requirements 9.2, 20.8**

### Property 16: Focusable Elements Have Focus Indicators

For any interactive element (button, link, input, select), the element should have visible focus styles defined in CSS (outline or custom focus indicator).

**Validates: Requirements 9.4**

### Property 17: Interactive Elements Have Accessible Labels

For any interactive element without visible text content (icon buttons, image links), the element should have an aria-label, aria-labelledby, or title attribute.

**Validates: Requirements 9.5**

### Property 18: Analytics Events for User Actions

For any tracked user action (form submission, project link click), an analytics event should be sent with appropriate event name and parameters.

**Validates: Requirements 10.3, 10.4**

### Property 19: Errors Logged to Monitoring Service

For any runtime error that occurs, the error should be captured and sent to the error monitoring service with stack trace and context.

**Validates: Requirements 10.5**

### Property 20: Browser Language Detection

For any Accept-Language header value, the language detector should parse it and extract the primary language code (e.g., "pt-BR" from "pt-BR,pt;q=0.9,en;q=0.8").

**Validates: Requirements 11.2**

### Property 21: Supported Language Display

For any visitor with a browser language that matches a supported locale (pt-BR, en, es), the site should display content in that language on first visit.

**Validates: Requirements 11.3**

### Property 22: Unsupported Language Fallback

For any visitor with a browser language that is not in the supported list, the site should display content in the default language (pt-BR).

**Validates: Requirements 11.4**

### Property 23: Language Preference Persistence

For any language selection change, the preference should be saved to localStorage and restored on subsequent visits, creating a round-trip: select language → save → reload → language restored.

**Validates: Requirements 11.6**

### Property 24: Complete Translation Coverage

For any translation key used in the application code, that key should exist in all supported language files (pt-BR.json, en.json, es.json) with a non-empty value.

**Validates: Requirements 11.7**

### Property 25: Component Documentation Completeness

For any reusable UI component in the components/ui directory, a corresponding Storybook story file should exist documenting the component.

**Validates: Requirements 13.1**

### Property 26: Component Variant Documentation

For any component that accepts a variant prop (e.g., Button with primary/secondary/ghost variants), the Storybook stories should include examples of each variant.

**Validates: Requirements 13.2**

### Property 27: Component Prop Documentation

For any component with props, the Storybook story should include JSDoc comments or Storybook ArgTypes documenting each prop's purpose and type.

**Validates: Requirements 13.3**

### Property 28: Component Usage Examples

For any documented component, the Storybook stories should include at least one realistic usage example showing the component in context.

**Validates: Requirements 13.4**

### Property 29: System Theme Detection

For any prefers-color-scheme media query value (light or dark), the theme system should detect it correctly and apply the corresponding theme on first visit.

**Validates: Requirements 17.2**

### Property 30: Theme Toggle Presence

For any page in the application, the theme toggle control should be present and visible in the UI.

**Validates: Requirements 17.5**

### Property 31: Theme Toggle Switches Themes

For any current theme state (light or dark), clicking the theme toggle should switch to the opposite theme.

**Validates: Requirements 17.6**

### Property 32: Theme Preference Persistence

For any theme selection, the preference should be saved to localStorage and restored on subsequent visits, creating a round-trip: select theme → save → reload → theme restored.

**Validates: Requirements 17.7**

### Property 33: Theme Changes Without Reload

For any theme toggle action, the theme should change by updating the DOM class without triggering a page navigation or reload event.

**Validates: Requirements 17.8**

### Property 34: Dark Mode Styles Applied

For any UI component, when dark mode is active, the component should have dark mode CSS classes or styles applied.

**Validates: Requirements 17.10**

### Property 35: Print Mode Hides Non-Essential Elements

For any non-essential UI element (navigation, theme toggle, interactive controls), the element should have CSS display: none or visibility: hidden in print media queries.

**Validates: Requirements 18.2**

### Property 36: Print Mode Expands Collapsed Content

For any collapsible or interactive content element (details, accordions, modals), the content should be fully expanded and visible in print media queries.

**Validates: Requirements 18.7**

### Property 37: Exit Intent Detection Tracks Mouse Movement

For any mouse movement event, when exit intent detection is enabled, the detector should track the cursor position and velocity.

**Validates: Requirements 19.1**

### Property 38: Exit Intent Triggers at Threshold

For any cursor position at or above the exit threshold (top 20 pixels) with upward velocity, the exit intent detector should trigger the exit intent event.

**Validates: Requirements 19.2**

### Property 39: Exit Intent Modal Shows Once Per Session

For any session, the exit intent modal should display on the first exit intent detection, and not display again after being dismissed.

**Validates: Requirements 19.3, 19.5**

### Property 40: Exit Intent Respects Minimum Time

For any time on page less than the minimum threshold (5 seconds), the exit intent detector should not trigger even if exit conditions are met.

**Validates: Requirements 19.9**

### Property 41: Structured Data Completeness

For any Schema.org Person structured data, the JSON-LD should include all essential properties: name, jobTitle, skills, work experience, education, and contact information.

**Validates: Requirements 20.2**

### Property 42: Machine-Readable Skills Structure

For any skills list, the data should be structured as a consistent array or list format with uniform naming conventions for technologies.

**Validates: Requirements 20.5**

### Property 43: Structured Data Provides Complete Information

For any structured data embedded in the page, an AI agent or ATS system should be able to extract all essential candidate information (name, title, experience, education, skills, contact) without requiring visual rendering or JavaScript execution.

**Validates: Requirements 20.7**

### Property 44: Work Experience Microdata

For any work experience entry, the HTML should include microdata or RDFa annotations with properties for organization, role, and date range.

**Validates: Requirements 20.9**

### Property 45: Content-Driven Project Addition

For any new project added to the content source (markdown files), the project should appear on the website after build without requiring changes to React component code.

**Validates: Requirements 21.5**

### Property 46: Content Field Support

For any project content entry, the content management system should support and render all standard fields: title, description, technologies array, images array, and links.

**Validates: Requirements 21.6**

### Property 47: Static Content Generation

For any content data in the content source, the build process should transform it into static HTML pages with no runtime database queries or API calls required.

**Validates: Requirements 21.9**

### Property 48: No Runtime Content API Calls

For any page load, the application should serve all content from static files without making API calls to fetch content data.

**Validates: Requirements 21.10**

## Error Handling

### Error Handling Strategy

The application follows a layered error handling approach:

1. **User Input Validation**: Prevent errors at the source
2. **Graceful Degradation**: Provide fallbacks when features fail
3. **Error Boundaries**: Catch React errors and display fallback UI
4. **Error Monitoring**: Log errors for debugging and improvement

### Error Categories and Handling

#### 1. Form Validation Errors

**Scenario**: User submits invalid contact form data

**Handling**:

- Client-side validation with react-hook-form
- Display inline error messages below each field
- Prevent form submission until validation passes
- Error messages localized in all supported languages

**Example**:

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

#### 2. Form Submission Errors

**Scenario**: Formspree API call fails

**Handling**:

- Catch network errors and API errors
- Display user-friendly error message
- Provide retry button
- Log error to Sentry with context
- Fallback: Display email address for manual contact

**Example**:

```typescript
try {
  await submitToFormspree(data);
  setStatus("success");
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: "ContactForm" },
    extra: { formData: data },
  });
  setStatus("error");
  setErrorMessage(t("contact.error"));
}
```

#### 3. Content Loading Errors

**Scenario**: Content file is missing or malformed

**Handling**:

- Validate content at build time
- Fail build if critical content is missing
- Provide default/placeholder content for optional fields
- Log warnings for missing optional content

**Example**:

```typescript
function loadProject(slug: string): Project {
  try {
    const content = fs.readFileSync(`content/projects/${slug}.md`, "utf-8");
    const { data, content: body } = matter(content);
    return validateProject({ ...data, body });
  } catch (error) {
    console.error(`Failed to load project: ${slug}`, error);
    throw new Error(`Project not found: ${slug}`);
  }
}
```

#### 4. Image Loading Errors

**Scenario**: Project image fails to load

**Handling**:

- Use Next.js Image component with error handling
- Display placeholder image on error
- Log error to Sentry
- Provide alt text for accessibility

**Example**:

```typescript
<Image
  src={project.image}
  alt={project.title}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.jpg';
    Sentry.captureMessage(`Image load failed: ${project.image}`);
  }}
/>
```

#### 5. Analytics/Monitoring Service Errors

**Scenario**: Analytics or Sentry initialization fails

**Handling**:

- Wrap analytics calls in try-catch
- Fail silently (don't break user experience)
- Log to console in development
- Provide no-op fallback functions

**Example**:

```typescript
export function trackEvent(name: string, properties?: object) {
  try {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track(name, properties);
    }
  } catch (error) {
    console.error("Analytics error:", error);
    // Don't throw - analytics failures shouldn't break the app
  }
}
```

#### 6. Theme/Language Persistence Errors

**Scenario**: localStorage is unavailable or quota exceeded

**Handling**:

- Wrap localStorage access in try-catch
- Fall back to session-only state
- Detect system preferences as fallback
- Continue functioning without persistence

**Example**:

```typescript
function saveTheme(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.warn("Failed to save theme preference:", error);
    // Continue without persistence
  }
}

function loadTheme(): Theme {
  try {
    return (localStorage.getItem("theme") as Theme) || detectSystemTheme();
  } catch (error) {
    return detectSystemTheme();
  }
}
```

#### 7. React Component Errors

**Scenario**: Component throws error during render

**Handling**:

- Error boundary components at strategic levels
- Display fallback UI with error message
- Log error to Sentry with component stack
- Provide recovery action (reload page)

**Example**:

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Error Boundary Placement

```
<RootErrorBoundary>
  <App>
    <Header />
    <Main>
      <SectionErrorBoundary name="hero">
        <Hero />
      </SectionErrorBoundary>
      <SectionErrorBoundary name="experience">
        <Experience />
      </SectionErrorBoundary>
      <SectionErrorBoundary name="projects">
        <Projects />
      </SectionErrorBoundary>
      <SectionErrorBoundary name="contact">
        <Contact />
      </SectionErrorBoundary>
    </Main>
    <Footer />
  </App>
</RootErrorBoundary>
```

### Build-Time Error Handling

**Content Validation**:

- Validate all markdown frontmatter against schemas
- Ensure required fields are present
- Validate date formats
- Check that referenced images exist
- Fail build on critical errors

**Type Safety**:

- TypeScript strict mode enabled
- No implicit any
- Strict null checks
- Type check in CI/CD pipeline

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit/integration tests and property-based tests to achieve comprehensive coverage:

- **Unit/Integration Tests**: Verify specific examples, edge cases, and error conditions
- **Property-Based Tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs and validate specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Testing Framework Configuration

**Jest Configuration**:

```typescript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.stories.{js,jsx,ts,tsx}",
    "!**/*.config.{js,ts}",
    "!**/node_modules/**",
  ],
  coverageThresholds: {
    global: {
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
  coverageReporters: ["text", "json", "html", "lcov"],
};

module.exports = createJestConfig(customJestConfig);
```

**Property-Based Testing Library**: fast-check

**Configuration**: Minimum 100 iterations per property test (due to randomization)

**Test Tagging**: Each property test must include a comment referencing the design property:

```typescript
// Feature: personal-resume-website, Property 1: Career Path Selection Displays Correct Content
```

### Test Organization

```
tests/
├── unit/                           # Unit tests (Jest)
│   ├── lib/
│   │   ├── content.test.ts         # Content parsing utilities
│   │   ├── analytics.test.ts       # Analytics helpers
│   │   └── structured-data.test.ts # Schema.org generation
│   ├── hooks/
│   │   ├── useTheme.test.ts
│   │   ├── useExitIntent.test.ts
│   │   └── useLanguage.test.ts
│   └── components/
│       ├── ui/
│       │   ├── Button.test.tsx
│       │   ├── Card.test.tsx
│       │   └── Modal.test.tsx
│       └── sections/
│           ├── Hero.test.tsx
│           ├── Experience.test.tsx
│           └── Contact.test.tsx
├── integration/                    # Integration tests (Jest)
│   ├── career-path-selection.test.tsx
│   ├── contact-form-submission.test.tsx
│   ├── theme-switching.test.tsx
│   └── language-switching.test.tsx
├── properties/                     # Property-based tests (Jest + fast-check)
│   ├── content-rendering.property.test.ts
│   ├── form-validation.property.test.ts
│   ├── theme-persistence.property.test.ts
│   ├── language-detection.property.test.ts
│   ├── accessibility.property.test.ts
│   └── structured-data.property.test.ts
└── e2e/                            # End-to-end tests (Playwright)
    ├── language-switching.spec.ts
    ├── theme-switching.spec.ts
    ├── career-path-navigation.spec.ts
    ├── contact-form-flow.spec.ts
    ├── exit-intent.spec.ts
    ├── print-pdf.spec.ts
    └── cross-browser.spec.ts
```

### Property-Based Test Examples

#### Property 1: Career Path Selection Displays Correct Content

```typescript
// Feature: personal-resume-website, Property 1: Career Path Selection Displays Correct Content
import { fc } from 'fast-check';
import { render } from '@testing-library/react';

describe('Career Path Selection Property Tests', () => {
  it('selecting a career path displays all associated content', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('professional', 'academic'),
        fc.array(fc.record({
          organization: fc.string({ minLength: 1 }),
          role: fc.string({ minLength: 1 }),
          startDate: fc.date(),
          description: fc.string({ minLength: 1 }),
        })),
        (careerPath, experiences) => {
          const { getByText } = render(
            <ExperienceSection careerPath={careerPath} experiences={experiences} />
          );

          // Verify all experiences are rendered
          experiences.forEach(exp => {
            expect(getByText(exp.organization)).toBeInTheDocument();
            expect(getByText(exp.role)).toBeInTheDocument();
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property 23: Language Preference Persistence (Round-Trip)

```typescript
// Feature: personal-resume-website, Property 23: Language Preference Persistence
import { fc } from "fast-check";
import { renderHook, act } from "@testing-library/react";

describe("Language Preference Persistence Property Tests", () => {
  it("language preference persists across sessions", () => {
    fc.assert(
      fc.property(fc.constantFrom("pt-BR", "en", "es"), (locale) => {
        // Save language
        const { result: saveResult } = renderHook(() => useLanguage());
        act(() => {
          saveResult.current.setLocale(locale);
        });

        // Simulate page reload by unmounting and remounting
        const { result: loadResult } = renderHook(() => useLanguage());

        // Verify language was restored
        expect(loadResult.current.locale).toBe(locale);
      }),
      { numRuns: 100 }
    );
  });
});
```

#### Property 24: Complete Translation Coverage

```typescript
// Feature: personal-resume-website, Property 24: Complete Translation Coverage
import { fc } from "fast-check";

describe("Translation Coverage Property Tests", () => {
  it("all translation keys exist in all language files", () => {
    fc.assert(
      fc.property(fc.constantFrom("pt-BR", "en", "es"), async (locale) => {
        const messages = await import(`@/messages/${locale}.json`);
        const allKeys = extractAllKeys(messages);

        // Check that all keys have non-empty values
        allKeys.forEach((key) => {
          const value = getNestedValue(messages, key);
          expect(value).toBeTruthy();
          expect(typeof value).toBe("string");
        });
      }),
      { numRuns: 100 }
    );
  });
});
```

#### Property 41: Structured Data Completeness

```typescript
// Feature: personal-resume-website, Property 41: Structured Data Completeness
import { fc } from "fast-check";

describe("Structured Data Property Tests", () => {
  it("structured data includes all essential properties", () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          jobTitle: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          skills: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        }),
        (personData) => {
          const structuredData = generatePersonSchema(personData);

          expect(structuredData["@context"]).toBe("https://schema.org");
          expect(structuredData["@type"]).toBe("Person");
          expect(structuredData.name).toBe(personData.name);
          expect(structuredData.jobTitle).toBe(personData.jobTitle);
          expect(structuredData.email).toBe(personData.email);
          expect(structuredData.knowsAbout).toEqual(personData.skills);
          expect(structuredData.worksFor).toBeDefined();
          expect(structuredData.alumniOf).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

#### Contact Form Validation

```typescript
describe('ContactForm', () => {
  it('displays error for empty name field', async () => {
    const { getByLabelText, getByRole, getByText } = render(<ContactForm />);

    const submitButton = getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);

    expect(getByText(/name is required/i)).toBeInTheDocument();
  });

  it('displays error for invalid email format', async () => {
    const { getByLabelText, getByRole, getByText } = render(<ContactForm />);

    const emailInput = getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');

    const submitButton = getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);

    expect(getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

#### Theme Toggle

```typescript
describe('ThemeToggle', () => {
  it('switches from light to dark mode when clicked', async () => {
    const { getByRole } = render(<ThemeToggle />);

    // Initial state is light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const toggle = getByRole('button', { name: /toggle theme/i });
    await userEvent.click(toggle);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

#### Exit Intent Detection

```typescript
describe("useExitIntent", () => {
  it("does not trigger before minimum time on page", () => {
    const onExitIntent = vi.fn();
    renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 5000,
        onExitIntent,
      })
    );

    // Simulate mouse movement to top edge immediately
    fireEvent.mouseMove(document, { clientY: 10, movementY: -5 });

    expect(onExitIntent).not.toHaveBeenCalled();
  });

  it("triggers when cursor moves to top edge after minimum time", async () => {
    vi.useFakeTimers();
    const onExitIntent = vi.fn();

    renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 5000,
        onExitIntent,
      })
    );

    // Wait for minimum time
    vi.advanceTimersByTime(5000);

    // Simulate mouse movement to top edge
    fireEvent.mouseMove(document, { clientY: 10, movementY: -5 });

    expect(onExitIntent).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
```

### Integration Test Examples

#### Career Path Selection Flow

```typescript
describe('Career Path Selection', () => {
  it('allows switching between professional and academic paths', async () => {
    const { getByRole, getByText } = render(<HomePage />);

    // Initially shows professional path
    expect(getByText(/professional developer/i)).toBeInTheDocument();

    // Switch to academic path
    const academicButton = getByRole('button', { name: /academic/i });
    await userEvent.click(academicButton);

    // Verify academic content is displayed
    expect(getByText(/master's degree/i)).toBeInTheDocument();
    expect(getByText(/cartographic science/i)).toBeInTheDocument();

    // Switch back to professional path
    const professionalButton = getByRole('button', { name: /professional/i });
    await userEvent.click(professionalButton);

    // Verify professional content is displayed
    expect(getByText(/professional developer/i)).toBeInTheDocument();
  });
});
```

#### Contact Form Submission

```typescript
describe('Contact Form Submission', () => {
  it('submits form and displays success message', async () => {
    // Mock Formspree API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const { getByLabelText, getByRole, getByText } = render(<ContactForm />);

    // Fill out form
    await userEvent.type(getByLabelText(/name/i), 'John Doe');
    await userEvent.type(getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(getByLabelText(/message/i), 'Hello, I would like to connect!');

    // Submit form
    const submitButton = getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);

    // Verify success message
    await waitFor(() => {
      expect(getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

### Edge Case Tests

#### Responsive Breakpoints

```typescript
describe('Responsive Layout', () => {
  it('displays mobile layout at 767px width', () => {
    global.innerWidth = 767;
    global.dispatchEvent(new Event('resize'));

    const { container } = render(<HomePage />);

    // Verify mobile-specific elements
    expect(container.querySelector('.mobile-menu')).toBeInTheDocument();
    expect(container.querySelector('.desktop-nav')).not.toBeInTheDocument();
  });

  it('displays tablet layout at 768px width', () => {
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));

    const { container } = render(<HomePage />);

    // Verify tablet-specific layout
    expect(container.querySelector('.tablet-layout')).toBeInTheDocument();
  });

  it('displays desktop layout at 1025px width', () => {
    global.innerWidth = 1025;
    global.dispatchEvent(new Event('resize'));

    const { container } = render(<HomePage />);

    // Verify desktop-specific elements
    expect(container.querySelector('.desktop-nav')).toBeInTheDocument();
    expect(container.querySelector('.mobile-menu')).not.toBeInTheDocument();
  });
});
```

#### Exit Intent Mobile Disabled

```typescript
describe("Exit Intent on Mobile", () => {
  it("does not trigger on mobile viewport", () => {
    global.innerWidth = 767;
    const onExitIntent = vi.fn();

    renderHook(() =>
      useExitIntent({
        enabled: true,
        threshold: 20,
        minTimeOnPage: 0,
        onExitIntent,
      })
    );

    // Simulate mouse movement to top edge
    fireEvent.mouseMove(document, { clientY: 10, movementY: -5 });

    expect(onExitIntent).not.toHaveBeenCalled();
  });
});
```

### Test Coverage Requirements

- **Minimum Coverage**: 90% across lines, functions, branches, and statements
- **Enforcement**: Coverage thresholds enforced in CI/CD pipeline
- **Exclusions**: Test files, Storybook stories, configuration files
- **Reporting**: Coverage reports generated in HTML and LCOV formats

### E2E Test Examples with Playwright

#### Language Switching Flow

```typescript
// e2e/language-switching.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Language Switching", () => {
  test("switches between all supported languages", async ({ page }) => {
    await page.goto("/");

    // Verify default language (pt-BR)
    await expect(page.locator("h1")).toContainText("Olá");

    // Switch to English
    await page.click('[aria-label="Language selector"]');
    await page.click("text=English");
    await expect(page.locator("h1")).toContainText("Hello");

    // Switch to Spanish
    await page.click('[aria-label="Language selector"]');
    await page.click("text=Español");
    await expect(page.locator("h1")).toContainText("Hola");

    // Verify language persists after reload
    await page.reload();
    await expect(page.locator("h1")).toContainText("Hola");
  });
});
```

#### Theme Switching Flow

```typescript
// e2e/theme-switching.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("switches between light and dark mode", async ({ page }) => {
    await page.goto("/");

    // Verify initial theme
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    // Toggle to dark mode
    await page.click('[aria-label="Toggle theme"]');
    await expect(html).toHaveClass(/dark/);

    // Verify dark mode persists after reload
    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });
});
```

#### Exit Intent Detection

```typescript
// e2e/exit-intent.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Exit Intent", () => {
  test("shows modal when cursor moves to top edge", async ({ page }) => {
    await page.goto("/");

    // Wait for minimum time on page
    await page.waitForTimeout(5000);

    // Move mouse to top edge to trigger exit intent
    await page.mouse.move(500, 5);

    // Verify modal appears
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator("text=/before you go/i")).toBeVisible();

    // Close modal
    await page.click('[aria-label="Close"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("does not show modal on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page.waitForTimeout(5000);
    await page.mouse.move(200, 5);

    // Modal should not appear on mobile
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

#### Print/PDF Testing

```typescript
// e2e/print-pdf.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Print/PDF Output", () => {
  test("generates clean PDF with print styles", async ({ page }) => {
    await page.goto("/");

    // Generate PDF
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: false,
    });

    expect(pdf).toBeTruthy();

    // Verify print styles hide non-essential elements
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("nav")).toBeHidden();
    await expect(page.locator('[aria-label="Toggle theme"]')).toBeHidden();
  });
});
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Continuous Testing

- **Pre-commit**: Run unit tests on staged files (via husky + lint-staged)
- **Pull Request**: Run full Jest test suite + Playwright E2E tests on all branches
- **Main Branch**: Run tests + coverage + SonarQube analysis + cross-browser E2E tests
- **Deployment**: Only deploy if all tests pass

### Manual Testing Checklist

Some requirements cannot be fully automated and require manual verification:

- **Visual Design**: Verify aesthetic quality and "proper formatting"
- **Color Contrast**: Use tools like WebAIM Contrast Checker to verify WCAG AA compliance
- **Performance Metrics**: Run Lighthouse audits to verify FCP, TTI, and performance score
- **Cross-Browser Testing**: Test on Chrome, Firefox, Safari, Edge
- **Screen Reader Testing**: Test with NVDA, JAWS, or VoiceOver
- **Print Output**: Verify PDF export looks professional and complete
- **Multi-Domain Access**: Verify all four domains serve the site correctly
