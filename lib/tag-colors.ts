/**
 * Tag color utilities for technology badges
 * Groups technologies by theme and assigns colors
 */

export type TagTheme = "mobile" | "web" | "backend" | "devops" | "tools";

export interface TagColorConfig {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
}

/**
 * Color configurations for each theme
 */
export const TAG_COLORS: Record<TagTheme, TagColorConfig> = {
  mobile: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900",
    darkText: "dark:text-blue-300",
  },
  web: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    darkBg: "dark:bg-purple-900",
    darkText: "dark:text-purple-300",
  },
  backend: {
    bg: "bg-green-100",
    text: "text-green-700",
    darkBg: "dark:bg-green-900",
    darkText: "dark:text-green-300",
  },
  devops: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-900",
    darkText: "dark:text-orange-300",
  },
  tools: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    darkBg: "dark:bg-pink-900",
    darkText: "dark:text-pink-300",
  },
};

/**
 * Technology to theme mapping
 * Add technologies here to assign them specific colors
 */
const TECH_THEME_MAP: Record<string, TagTheme> = {
  // Mobile
  "React Native": "mobile",
  Flutter: "mobile",
  Swift: "mobile",
  Kotlin: "mobile",
  iOS: "mobile",
  Android: "mobile",
  "Android SDK": "mobile",
  "Android Architecture Components": "mobile",
  Expo: "mobile",
  "React Navigation": "mobile",
  Dart: "mobile",
  MobX: "mobile",
  "Material Design": "mobile",
  SQLite: "mobile",

  // Web
  React: "web",
  "Next.js": "web",
  "Next.js 16": "web",
  "Next.js 15": "web",
  "Next.js 14": "web",
  Vue: "web",
  Angular: "web",
  TypeScript: "web",
  JavaScript: "web",
  HTML: "web",
  CSS: "web",
  "Tailwind CSS": "web",
  SCSS: "web",
  Redux: "web",
  Zustand: "web",
  Webpack: "web",
  Vite: "web",
  "next-intl": "web",

  // Backend
  "Node.js": "backend",
  Express: "backend",
  NestJS: "backend",
  Python: "backend",
  Django: "backend",
  FastAPI: "backend",
  Java: "backend",
  "Spring Boot": "backend",
  PostgreSQL: "backend",
  MongoDB: "backend",
  MySQL: "backend",
  Redis: "backend",
  GraphQL: "backend",
  "REST API": "backend",
  Prisma: "backend",
  Firebase: "backend",
  "Firebase Analytics": "backend",
  "Firebase Crashlytics": "backend",
  "Data Processing": "backend",
  "Scientific Computing": "backend",

  // DevOps
  Docker: "devops",
  Kubernetes: "devops",
  AWS: "devops",
  Azure: "devops",
  GCP: "devops",
  "CI/CD": "devops",
  "GitHub Actions": "devops",
  Jenkins: "devops",
  Terraform: "devops",
  Nginx: "devops",
  Linux: "devops",
  Vercel: "devops",
  "GNSS/GPS": "devops",
  "NMEA Protocol": "devops",

  // Tools
  Git: "tools",
  GitHub: "tools",
  GitLab: "tools",
  Jira: "tools",
  Figma: "tools",
  Storybook: "tools",
  Jest: "tools",
  Playwright: "tools",
  Cypress: "tools",
  ESLint: "tools",
  Prettier: "tools",
  "VS Code": "tools",
  Postman: "tools",
  SonarQube: "tools",
  Sentry: "tools",
};

/**
 * Get the theme for a technology
 * Falls back to 'tools' if not found
 */
export function getTechTheme(tech: string): TagTheme {
  return TECH_THEME_MAP[tech] || "tools";
}

/**
 * Get color classes for a technology tag
 */
export function getTechColorClasses(tech: string): string {
  const theme = getTechTheme(tech);
  const colors = TAG_COLORS[theme];
  return `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`;
}

/**
 * Get color classes for a specific theme
 */
export function getThemeColorClasses(theme: TagTheme): string {
  const colors = TAG_COLORS[theme];
  return `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`;
}
