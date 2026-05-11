import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../components/**/*.mdx", "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/nextjs-vite",
  core: {
    disableTelemetry: true,
  },
  // Configure base path for deployment at /storybook/
  managerHead: (head) => `
    ${head}
    <base href="/storybook/" />
  `,
  previewHead: (head) => `
    ${head}
    <base href="/storybook/" />
  `,
  viteFinal: async (config) => {
    config.base = "/storybook/";
    return config;
  },
};
export default config;
