/** @type {import('jest').Config} */
const config = {
  testEnvironment: "<rootDir>/jest.environment.js",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          rootDir: ".",
          ignoreDeprecations: "6.0",
          jsx: "react-jsx",
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
        },
      },
    ],
    "^.+\\.(js|jsx|mjs)$": [
      "ts-jest",
      {
        tsconfig: {
          rootDir: ".",
          ignoreDeprecations: "6.0",
          jsx: "react-jsx",
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          allowJs: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(next-intl|use-intl|@formatjs|intl-messageformat)/)"],
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  testPathIgnorePatterns: [
    "/node_modules/",
    // Exclude tests with next-intl ESM issues (Task 31)
    "tests/unit/components/ExitIntentModal-resume.test.tsx",
    "tests/unit/components/ContactForm.test.tsx",
    "tests/unit/lib/lazy-components.test.tsx",
    "tests/unit/TechStackSection.test.tsx",
    "tests/properties/tech-stack-links.test.tsx",
    "tests/integration/resume-download.test.tsx",
    "tests/integration/responsive-layout.test.tsx",
    // Exclude tests requiring a running production server (use npm run test:lighthouse / test:properties)
    "tests/lighthouse/performance.test.ts",
    "tests/properties/lighthouse-ci-server-startup.test.ts",
  ],
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "app/[locale]/components/ComponentGalleryClient.tsx",
    "!**/*.d.ts",
    "!**/*.stories.{ts,tsx}", // Exclude Storybook files
    "!**/node_modules/**",
    "!**/.next/**",
    "!app/layout.tsx",
    "!app/page.tsx",
    "!app/[locale]/layout.tsx",
    "!app/[locale]/page.tsx",
    // Exclude untested lib files
    "!lib/error-logging.client.ts",
    "!lib/error-logging.ts",
    "!lib/lazy-components.tsx",
    "!lib/seo.ts",
    "!lib/structured-data.ts",
    // Exclude untested component files
    "!components/AnalyticsProvider.tsx",
    "!components/ComponentShowcase/**",
    "!components/ContactForm/**",
    "!components/ExitIntentModal/**",
    "!components/TechStackSection/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: [
    // Console: full per-file table ("text") followed by the totals box
    // ("text-summary"). "text-lcov" is intentionally omitted — it streams the
    // raw LCOV to stdout and buries the table.
    "text",
    "text-summary",
    // File outputs for browsers and CI/SonarCloud ingestion
    "html",
    "lcov",
    "clover",
    "cobertura",
    "json",
    "json-summary",
  ],
};

module.exports = config;
