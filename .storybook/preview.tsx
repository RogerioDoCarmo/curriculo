import React from "react";
import { ThemeProvider } from "../hooks/useTheme";
import "../app/globals.css";

/**
 * Global decorator that wraps all stories with ThemeProvider.
 * Required for any component that uses the useTheme hook.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withThemeProvider = (Story: React.ComponentType<any>) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
);

const preview = {
  decorators: [withThemeProvider],
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
