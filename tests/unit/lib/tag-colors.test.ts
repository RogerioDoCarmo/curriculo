/**
 * Unit tests for tag-colors utilities.
 *
 * Covers theme resolution, the technology->class mapping, and the per-theme
 * class lookup including the fallback path. Assertions use literal expected
 * values (rather than reading back the module's own constants) so that
 * mutating a color string or a theme mapping is detected — this suite doubles
 * as the mutation-testing target for lib/tag-colors.ts.
 *
 * Note on equivalent mutants: getTechTheme falls back to "tools" via
 * `TECH_THEME_MAP[tech] || "tools"`, so blanking a value that is already
 * "tools" produces no observable change. Those tools-themed entries are
 * therefore deliberately not asserted by mapping (they are exercised through
 * getTechColorClasses instead).
 */

import {
  getTechTheme,
  getTechColorClasses,
  getThemeColorClasses,
  TAG_COLORS,
  type TagTheme,
  type TagColorConfig,
} from "@/lib/tag-colors";

const THEMES: TagTheme[] = ["mobile", "web", "backend", "devops", "tools"];

/** Exact class strings each theme must resolve to, asserted literally. */
const EXPECTED_THEME_CLASSES: Record<TagTheme, string> = {
  mobile: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  web: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  backend: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  devops: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  tools: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
};

/** Exact TAG_COLORS config each theme must expose, asserted literally. */
const EXPECTED_TAG_COLORS: Record<TagTheme, TagColorConfig> = {
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
 * Every non-tools technology in TECH_THEME_MAP with its expected theme.
 * Blanking any of these values flips getTechTheme to the "tools" fallback, so
 * an exhaustive table kills the corresponding StringLiteral mutants.
 */
const NON_TOOLS_TECH: ReadonlyArray<readonly [string, TagTheme]> = [
  // Mobile
  ["React Native", "mobile"],
  ["Flutter", "mobile"],
  ["Swift", "mobile"],
  ["Kotlin", "mobile"],
  ["iOS", "mobile"],
  ["Android", "mobile"],
  ["Android SDK", "mobile"],
  ["Android Architecture Components", "mobile"],
  ["Expo", "mobile"],
  ["React Navigation", "mobile"],
  ["Dart", "mobile"],
  ["MobX", "mobile"],
  ["Material Design", "mobile"],
  ["SQLite", "mobile"],
  // Web
  ["React", "web"],
  ["Next.js", "web"],
  ["Next.js 16", "web"],
  ["Next.js 15", "web"],
  ["Next.js 14", "web"],
  ["Vue", "web"],
  ["Angular", "web"],
  ["TypeScript", "web"],
  ["JavaScript", "web"],
  ["HTML", "web"],
  ["CSS", "web"],
  ["Tailwind CSS", "web"],
  ["SCSS", "web"],
  ["Redux", "web"],
  ["Zustand", "web"],
  ["Webpack", "web"],
  ["Vite", "web"],
  ["next-intl", "web"],
  // Backend
  ["Java", "backend"],
  ["Spring Boot", "backend"],
  ["Express", "backend"],
  ["NestJS", "backend"],
  ["Python", "backend"],
  ["Django", "backend"],
  ["FastAPI", "backend"],
  ["PostgreSQL", "backend"],
  ["MongoDB", "backend"],
  ["MySQL", "backend"],
  ["Redis", "backend"],
  ["GraphQL", "backend"],
  ["REST API", "backend"],
  ["Prisma", "backend"],
  ["Firebase", "backend"],
  ["Firebase Analytics", "backend"],
  ["Firebase Crashlytics", "backend"],
  ["Data Processing", "backend"],
  ["Scientific Computing", "backend"],
  // DevOps
  ["Docker", "devops"],
  ["Kubernetes", "devops"],
  ["AWS", "devops"],
  ["Azure", "devops"],
  ["GCP", "devops"],
  ["CI/CD", "devops"],
  ["GitHub Actions", "devops"],
  ["Jenkins", "devops"],
  ["Terraform", "devops"],
  ["Nginx", "devops"],
  ["Linux", "devops"],
  ["Vercel", "devops"],
  ["GNSS/GPS", "devops"],
  ["NMEA Protocol", "devops"],
];

/** Tools-themed technologies — asserted via classes since the mapping is equivalent. */
const TOOLS_TECH = [
  "Git",
  "GitHub",
  "GitLab",
  "Jira",
  "Figma",
  "Storybook",
  "Jest",
  "Playwright",
  "Cypress",
  "ESLint",
  "Prettier",
  "VS Code",
  "Postman",
  "SonarQube",
  "Sentry",
] as const;

describe("getTechTheme", () => {
  it.each(NON_TOOLS_TECH)("maps %s to the %s theme", (tech, theme) => {
    expect(getTechTheme(tech)).toBe(theme);
  });

  it("falls back to 'tools' for an unknown technology", () => {
    expect(getTechTheme("CompletelyUnknownTech")).toBe("tools");
  });
});

describe("TAG_COLORS", () => {
  it.each(THEMES)("exposes the exact config for the %s theme", (theme) => {
    expect(TAG_COLORS[theme]).toEqual(EXPECTED_TAG_COLORS[theme]);
  });
});

describe("getThemeColorClasses", () => {
  it.each(THEMES)("returns the exact configured classes for the %s theme", (theme) => {
    expect(getThemeColorClasses(theme)).toBe(EXPECTED_THEME_CLASSES[theme]);
  });

  it("returns the tools palette for an unexpected theme value (default branch)", () => {
    // Force the default branch with an out-of-union value.
    expect(getThemeColorClasses("unexpected" as TagTheme)).toBe(EXPECTED_THEME_CLASSES.tools);
  });
});

describe("getTechColorClasses", () => {
  it.each([...NON_TOOLS_TECH, ...TOOLS_TECH.map((t) => [t, "tools"] as const)])(
    "resolves %s to its theme palette",
    (tech, theme) => {
      expect(getTechColorClasses(tech)).toBe(EXPECTED_THEME_CLASSES[theme as TagTheme]);
    }
  );

  it("uses the tools palette for an unknown technology", () => {
    expect(getTechColorClasses("NopeNotReal")).toBe(EXPECTED_THEME_CLASSES.tools);
  });
});
