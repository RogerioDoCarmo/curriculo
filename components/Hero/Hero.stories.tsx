import type { Meta, StoryObj } from "@storybook/react";
import Hero from "./index";

/**
 * Hero section — name, title, profile photo (the LCP), partner logos, and the
 * primary CTAs. Greeting/CTA strings are passed in already localized.
 */
const meta: Meta<typeof Hero> = {
  title: "Sections/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Rogério do Carmo",
    title: "Mobile React Native Developer",
    locale: "en",
    greeting: "Hi, I'm",
    ctaText: "View my work",
    contactText: "Get in touch",
  },
};
