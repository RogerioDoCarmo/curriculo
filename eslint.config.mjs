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
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
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
];
