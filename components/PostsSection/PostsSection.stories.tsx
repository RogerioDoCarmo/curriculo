import type { Meta, StoryObj } from "@storybook/react";
import type { Post } from "@/types/index";
import PostsSection from "./index";

/**
 * LinkedIn posts/articles and YouTube videos: a platform-filtered grid of
 * cards that open a detail dialog (with an embedded player for videos).
 */
const meta: Meta<typeof PostsSection> = {
  title: "Sections/PostsSection",
  component: PostsSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const linkedinPosts: Post[] = [
  {
    id: "deep-links-article",
    platform: "linkedin",
    kind: "article",
    title: "Implementing Deep Links in a Next.js Site",
    description:
      "How a seemingly simple feature called for changes to state management, browser history handling and test coverage.",
    url: "https://example.com/article",
    image: "/images/posts/deep-link-article-cover.webp",
    language: "pt-BR",
    featured: true,
    date: "2026-09-13",
  },
  {
    id: "scroll-minimap",
    platform: "linkedin",
    kind: "post",
    title: "An accessible scroll minimap",
    description: "A PDF-reader-style minimap showing where each section of the page sits.",
    url: "https://example.com/post",
    language: "en",
    featured: false,
    date: "2026-08-01",
  },
];

const youtubeVideo: Post = {
  id: "demo-video",
  platform: "youtube",
  kind: "video",
  title: "Demo video",
  description: "A walkthrough of the app.",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  language: "en",
  featured: false,
  date: "2026-09-20",
};

/** LinkedIn only — the platform filter stays hidden with a single platform. */
export const Default: Story = {
  args: { posts: linkedinPosts, locale: "en" },
};

/** Two platforms — the filter chips appear, and the video card shows its thumbnail. */
export const WithVideo: Story = {
  args: { posts: [youtubeVideo, ...linkedinPosts], locale: "en" },
};
