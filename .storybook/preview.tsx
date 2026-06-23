import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "../hooks/useTheme";
import messages from "../messages/en.json";
import "../app/globals.css";

/**
 * Global decorator that wraps all stories with the i18n (next-intl) and theme
 * providers, so components using `useTranslations` or `useTheme` render in
 * Storybook. Stories default to the English message catalog.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withProviders = (Story: React.ComponentType<any>) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  </NextIntlClientProvider>
);

const preview = {
  decorators: [withProviders],
  parameters: {
    // Provide a mock Next.js router for all stories.
    // @storybook/nextjs-vite intercepts next/navigation hooks using this config.
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/en",
        segments: [["locale", "en"]],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },
};

export default preview;
