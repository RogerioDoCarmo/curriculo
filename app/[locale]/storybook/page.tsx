import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Component Library - Storybook",
  description: "Interactive component library and documentation built with Storybook",
};

/**
 * Storybook page - redirects to the static Storybook build
 *
 * Note: The Storybook static build is served from /storybook/
 * This page provides a Next.js route that redirects to it.
 *
 * To build and include Storybook in the site:
 * 1. Run: npm run build:with-storybook
 * 2. This will build Storybook, copy it to public/storybook, and build the site
 */
export default function StorybookPage() {
  // Redirect to the static Storybook build
  redirect("/storybook/");
}
