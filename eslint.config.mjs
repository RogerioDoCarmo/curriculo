import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      ".storybook/**",
      "storybook-static/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "lighthouse-report.json",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },
  {
    // Relax rules for config files
    files: ["*.config.{js,mjs,cjs,ts}", "jest.setup.js", "jest.environment.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
  },
  {
    // Relax rules for test files
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "tests/**/*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
  },
  {
    // Ignore unknown rules in inline comments (legacy Next.js rules)
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];
