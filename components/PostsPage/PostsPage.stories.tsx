import type { Meta, StoryObj } from "@storybook/react";
import type { Post } from "@/types/index";
import PostsPage from "./index";

/**
 * The full posts list: every post newest first, grouped by platform with
 * filter chips, each opening the same detail dialog as the home page section.
 */
const meta: Meta<typeof PostsPage> = {
  title: "Pages/PostsPage",
  component: PostsPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const linkedinPosts: Post[] = [
  {
    id: "ai-agents-git-worktrees",
    platform: "linkedin",
    kind: "post",
    title: "Two AI agents, one Git repository",
    description: "How to work on two scopes of the same codebase at once, without conflicts.",
    url: "https://example.com/post",
    language: "pt-BR",
    featured: false,
    date: "2026-09-26",
  },
  {
    id: "deep-links-article",
    platform: "linkedin",
    kind: "article",
    title: "Implementing Deep Links in a Next.js Site",
    description: "How a seemingly simple feature called for changes to state management.",
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
    url: "https://example.com/minimap",
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

/** LinkedIn only — the YouTube chip is still offered and says there's nothing there yet. */
export const Default: Story = {
  args: { posts: linkedinPosts, locale: "en" },
};

/** Both platforms, so each chip filters to something. */
export const WithVideo: Story = {
  args: { posts: [youtubeVideo, ...linkedinPosts], locale: "en" },
};
