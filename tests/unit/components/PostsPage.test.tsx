/**
 * Unit tests for PostsPage — every post, grouped by platform.
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import PostsPage from "@/components/PostsPage";
import type { Post } from "@/types/index";

const messages: AbstractIntlMessages = {
  posts: {
    pageHeading: "All posts",
    pageSubtitle: "Every post, grouped by platform.",
    filterByPlatform: "Filter by platform",
    all: "All",
    emptyPlatform: "No {platform} posts yet.",
    platform: { linkedin: "LinkedIn", youtube: "YouTube" },
    kind: { post: "Post", article: "Article", video: "Video" },
    viewDetails: "View details for",
    previousPost: "Previous post",
    nextPost: "Next post",
    featured: "Featured",
    inLanguage: "In {language}",
    readOn: "Read on {platform}",
    watchOn: "Watch on {platform}",
    opensInNewTab: "(opens in a new tab)",
    videoTitle: "Video: {title}",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    copyLinkFailed: "Couldn't copy the link",
  },
};

jest.mock("@/lib/analytics", () => ({
  trackExternalLinkClick: jest.fn(),
  trackPostShare: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...rest} />,
}));

const post = (overrides: Partial<Post> & Pick<Post, "id" | "title" | "date">): Post => ({
  platform: "linkedin",
  kind: "post",
  description: `${overrides.title} description.`,
  url: `https://www.linkedin.com/posts/${overrides.id}`,
  language: "en",
  featured: false,
  ...overrides,
});

const linkedinNew = post({ id: "li-new", title: "LinkedIn newest", date: "2026-09-26" });
const video = post({
  id: "yt-1",
  title: "YouTube video",
  date: "2026-09-20",
  platform: "youtube",
  kind: "video",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
});
const linkedinMid = post({ id: "li-mid", title: "LinkedIn middle", date: "2026-08-01" });
const linkedinOld = post({ id: "li-old", title: "LinkedIn oldest", date: "2024-06-27" });

const allPosts: Post[] = [linkedinOld, linkedinNew, video, linkedinMid];
const linkedinOnly: Post[] = [linkedinOld, linkedinNew, linkedinMid];

function renderPage(posts: Post[], locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PostsPage posts={posts} locale={locale} />
    </NextIntlClientProvider>
  );
}

const cardTitles = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const chip = (name: string) =>
  within(screen.getByRole("group", { name: "Filter by platform" })).getByRole("button", { name });
const cardFor = (title: string) =>
  screen.getByRole("button", { name: `View details for ${title}` });

describe("PostsPage", () => {
  // The URL is reset between tests globally (see jest.setup.js).

  describe("rendering", () => {
    it("renders the page heading as the h1, with its subtitle", () => {
      renderPage(allPosts);

      expect(screen.getByRole("heading", { level: 1, name: "All posts" })).toBeInTheDocument();
      expect(screen.getByText("Every post, grouped by platform.")).toBeInTheDocument();
    });

    it("lists every post, newest first — not only the latest three", () => {
      renderPage(allPosts);
      expect(cardTitles()).toEqual([
        "LinkedIn newest",
        "YouTube video",
        "LinkedIn middle",
        "LinkedIn oldest",
      ]);
    });
  });

  describe("platform filter", () => {
    it("offers All plus every platform, even one with no posts yet", () => {
      renderPage(linkedinOnly);

      const labels = within(screen.getByRole("group", { name: "Filter by platform" }))
        .getAllByRole("button")
        .map((b) => b.textContent);
      expect(labels).toEqual(["All", "LinkedIn", "YouTube"]);
    });

    it("starts with All pressed", () => {
      renderPage(allPosts);

      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
      expect(chip("LinkedIn")).toHaveAttribute("aria-pressed", "false");
      expect(chip("YouTube")).toHaveAttribute("aria-pressed", "false");
    });

    it("shows only the chosen platform's posts", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);

      await user.click(chip("LinkedIn"));

      expect(chip("LinkedIn")).toHaveAttribute("aria-pressed", "true");
      expect(chip("All")).toHaveAttribute("aria-pressed", "false");
      expect(cardTitles()).toEqual(["LinkedIn newest", "LinkedIn middle", "LinkedIn oldest"]);

      await user.click(chip("YouTube"));
      expect(cardTitles()).toEqual(["YouTube video"]);
    });

    it("toggles back to all posts when the active platform is clicked again", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);

      await user.click(chip("LinkedIn"));
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);

      await user.click(chip("LinkedIn"));
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
    });

    it("returns to all posts from All", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);

      await user.click(chip("YouTube"));
      await user.click(chip("All"));

      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    });

    it("says so when a platform has no posts yet", async () => {
      const user = userEvent.setup();
      renderPage(linkedinOnly);

      await user.click(chip("YouTube"));

      expect(screen.getByRole("status")).toHaveTextContent("No YouTube posts yet.");
      expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
    });

    it("writes the chosen platform into the URL, replacing rather than pushing history", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);
      const pushSpy = jest.spyOn(window.history, "pushState");

      await user.click(chip("YouTube"));
      expect(window.location.search).toBe("?platform=youtube");

      await user.click(chip("All"));
      expect(window.location.search).toBe("");

      expect(pushSpy).not.toHaveBeenCalled();
      pushSpy.mockRestore();
    });

    it("preselects the platform named in the URL", async () => {
      window.history.replaceState(null, "", "/en/posts/?platform=youtube");
      renderPage(allPosts);

      await waitFor(() => {
        expect(chip("YouTube")).toHaveAttribute("aria-pressed", "true");
      });
      expect(cardTitles()).toEqual(["YouTube video"]);
    });

    it("shows everything when the URL names an unknown platform", async () => {
      window.history.replaceState(null, "", "/en/posts/?platform=myspace");
      renderPage(allPosts);

      await waitFor(() => {
        expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
      });
      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
    });

    it("keeps an open post in the URL when the filter changes", async () => {
      window.history.replaceState(null, "", "/en/posts/?post=li-new");
      const user = userEvent.setup();
      renderPage(allPosts);
      await screen.findByRole("dialog");

      // Filter via the page behind the dialog (the chips stay in the DOM).
      await user.click(chip("LinkedIn"));

      expect(window.location.search).toBe("?post=li-new&platform=linkedin");
    });
  });

  describe("detail dialog", () => {
    it("opens a post and records it in the URL without a hash", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);

      await user.click(cardFor("LinkedIn newest"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "LinkedIn newest" })).toBeInTheDocument();
      expect(window.location.search).toBe("?post=li-new");
      expect(window.location.hash).toBe("");
    });

    it("steps through every post, wrapping around", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);
      await user.click(cardFor("LinkedIn oldest"));
      const dialog = await screen.findByRole("dialog");

      await user.click(within(dialog).getByRole("button", { name: "Next post" }));
      expect(within(dialog).getByRole("heading", { name: "LinkedIn newest" })).toBeInTheDocument();

      await user.click(within(dialog).getByRole("button", { name: "Previous post" }));
      expect(within(dialog).getByRole("heading", { name: "LinkedIn oldest" })).toBeInTheDocument();
    });

    it("steps only through the filtered posts", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);
      await user.click(chip("LinkedIn"));
      await user.click(cardFor("LinkedIn newest"));
      const dialog = await screen.findByRole("dialog");

      // The video sits between these two by date, but is filtered out.
      await user.click(within(dialog).getByRole("button", { name: "Next post" }));

      expect(within(dialog).getByRole("heading", { name: "LinkedIn middle" })).toBeInTheDocument();
    });

    it("plays a YouTube video in the dialog", async () => {
      const user = userEvent.setup();
      renderPage(allPosts);

      await user.click(cardFor("YouTube video"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByTitle("Video: YouTube video")).toHaveAttribute(
        "src",
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      );
    });
  });

  describe("deep link", () => {
    it("opens the linked post on arrival, even an old one", async () => {
      window.history.replaceState(null, "", "/en/posts/?post=li-old");
      renderPage(allPosts);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "LinkedIn oldest" })).toBeInTheDocument();
    });

    it("doesn't scroll anywhere: the page has no section hash", async () => {
      window.history.replaceState(null, "", "/en/posts/?post=li-old");
      renderPage(allPosts);

      await screen.findByRole("dialog");
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    });

    it("ignores an unknown post id", async () => {
      window.history.replaceState(null, "", "/en/posts/?post=nope");
      renderPage(allPosts);

      await waitFor(() => {
        expect(screen.getByText("LinkedIn newest")).toBeInTheDocument();
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("copies a link to this post on the posts page", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      renderPage(allPosts);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
        writable: true,
      });

      await user.click(cardFor("YouTube video"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/en/posts/?post=yt-1");
      Object.defineProperty(navigator, "clipboard", {
        value: undefined,
        configurable: true,
        writable: true,
      });
    });
  });
});
