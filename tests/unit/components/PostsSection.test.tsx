/**
 * Unit tests for PostsSection — the home page's latest-three posts section.
 * The platform filter and the full list live on the posts page (PostsPage.test).
 */

import React from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import PostsSection from "@/components/PostsSection";
import { trackExternalLinkClick, trackPostShare } from "@/lib/analytics";
import type { Post } from "@/types/index";

// Mock messages for next-intl — every key the components use.
const messages: AbstractIntlMessages = {
  sections: {
    posts: "Posts",
  },
  posts: {
    subtitle: "Articles, posts and videos I've published.",
    filterByPlatform: "Filter by platform",
    all: "All",
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
    viewAll: "View all posts",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    copyLinkFailed: "Couldn't copy the link",
  },
};

jest.mock("@/lib/analytics", () => ({
  trackExternalLinkClick: jest.fn(),
  trackPostShare: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    loading,
    fill: _fill,
    sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    loading?: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} data-loading={loading} data-sizes={sizes} {...rest} />,
}));

const newest: Post = {
  id: "newest",
  platform: "linkedin",
  kind: "article",
  title: "Newest post",
  description: "The newest short description.",
  longDescription: "The **full** write-up of the newest post.",
  url: "https://www.linkedin.com/pulse/newest",
  image: "/images/posts/newest.webp",
  language: "pt-BR",
  featured: true,
  date: "2026-09-26",
};

const video: Post = {
  id: "video",
  platform: "youtube",
  kind: "video",
  title: "Demo video",
  description: "A walkthrough of the app.",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  language: "en",
  featured: false,
  date: "2026-09-20",
};

const third: Post = {
  id: "third",
  platform: "linkedin",
  kind: "post",
  title: "Third post",
  description: "The third post.",
  url: "https://www.linkedin.com/posts/third",
  language: "en",
  featured: false,
  date: "2026-09-13",
};

const fourth: Post = {
  id: "fourth",
  platform: "linkedin",
  kind: "post",
  title: "Fourth post",
  description: "The fourth post.",
  url: "https://www.linkedin.com/posts/fourth",
  language: "en",
  featured: false,
  date: "2026-08-01",
};

const oldest: Post = {
  id: "oldest",
  platform: "linkedin",
  kind: "article",
  title: "Oldest post",
  description: "The oldest post.",
  url: "https://www.linkedin.com/pulse/oldest",
  language: "en",
  featured: false,
  date: "2024-06-27",
};

// Deliberately not in date order: the section must sort, not trust its input.
const samplePosts: Post[] = [fourth, newest, oldest, third, video];

function renderWithIntl(ui: React.ReactElement, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

const cardFor = (title: string) =>
  screen.getByRole("button", { name: `View details for ${title}` });

const cardTitles = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("PostsSection", () => {
  // The URL is reset between tests globally (see jest.setup.js) — this component
  // writes the open post into it, which would otherwise leak into the next test
  // and deep-link-open the dialog on mount.
  beforeEach(() => {
    jest.mocked(trackExternalLinkClick).mockClear();
    jest.mocked(trackPostShare).mockClear();
  });

  describe("rendering", () => {
    it("renders the section landmark with its heading and subtitle", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      const section = screen.getByRole("region", { name: "Posts" });
      expect(section).toHaveAttribute("id", "posts");
      expect(within(section).getByRole("heading", { level: 2, name: "Posts" })).toBeInTheDocument();
      expect(
        within(section).getByText("Articles, posts and videos I've published.")
      ).toBeInTheDocument();
    });

    it("shows only the latest three posts, newest first", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      expect(cardTitles()).toEqual(["Newest post", "Demo video", "Third post"]);
      expect(screen.queryByText("Fourth post")).not.toBeInTheDocument();
      expect(screen.queryByText("Oldest post")).not.toBeInTheDocument();
    });

    it("shows every post when there are three or fewer", () => {
      renderWithIntl(<PostsSection posts={[oldest, newest]} locale="en" />);
      expect(cardTitles()).toEqual(["Newest post", "Oldest post"]);
    });

    it("links to the posts page with the active locale", () => {
      // next/link drops the trailing slash under Jest (next.config.js isn't
      // loaded); the built page keeps it, which the E2E spec checks.
      const { unmount } = renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      expect(screen.getByRole("link", { name: "View all posts" }).getAttribute("href")).toMatch(
        /^\/en\/posts\/?$/
      );
      unmount();

      renderWithIntl(<PostsSection posts={samplePosts} locale="pt-BR" />, "pt-BR");
      expect(screen.getByRole("link", { name: "View all posts" }).getAttribute("href")).toMatch(
        /^\/pt-BR\/posts\/?$/
      );
    });

    it("leaves the platform filter to the posts page", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      expect(screen.queryByRole("group", { name: "Filter by platform" })).not.toBeInTheDocument();
    });

    it("shows platform, kind and localized date on each card", () => {
      renderWithIntl(<PostsSection posts={[newest]} locale="en" />);

      const card = cardFor("Newest post");
      expect(within(card).getByText("LinkedIn")).toBeInTheDocument();
      expect(within(card).getByText("Article")).toBeInTheDocument();
      const time = within(card).getByText("Sep 2026");
      expect(time.tagName).toBe("TIME");
      expect(time).toHaveAttribute("datetime", "2026-09-26");
    });

    it("formats the date in the page's locale", () => {
      renderWithIntl(<PostsSection posts={[newest]} locale="pt-BR" />, "pt-BR");
      expect(screen.getByText("set. de 2026")).toBeInTheDocument();
    });

    it("marks featured posts", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      expect(within(cardFor("Newest post")).getByText("Featured")).toBeInTheDocument();
      expect(within(cardFor("Third post")).queryByText("Featured")).not.toBeInTheDocument();
    });

    it("flags posts written in another language than the page", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      expect(within(cardFor("Newest post")).getByText("In Portuguese")).toBeInTheDocument();
      expect(within(cardFor("Third post")).queryByText(/^In /)).not.toBeInTheDocument();
    });

    it("doesn't flag a pt-BR post on the pt-BR page", () => {
      renderWithIntl(<PostsSection posts={[newest]} locale="pt-BR" />, "pt-BR");
      expect(screen.queryByText(/^In /)).not.toBeInTheDocument();
    });

    it("uses the cover image, the video thumbnail, or a placeholder", () => {
      const { container } = renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      const srcs = Array.from(container.querySelectorAll("img")).map((img) =>
        img.getAttribute("src")
      );
      // Newest has a cover, the video falls back to its thumbnail, "Third" has neither.
      expect(srcs).toEqual([
        "/images/posts/newest.webp",
        "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      ]);
    });

    it("lazy-loads card images", () => {
      const { container } = renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      for (const img of Array.from(container.querySelectorAll("img"))) {
        expect(img).toHaveAttribute("data-loading", "lazy");
      }
    });

    it("renders nothing when there are no posts", () => {
      const { container } = renderWithIntl(<PostsSection posts={[]} locale="en" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("detail dialog", () => {
    it("opens the clicked post with its long description", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Newest post"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Newest post" })).toBeInTheDocument();
      expect(within(dialog).getByText("full")).toBeInTheDocument();
      expect(within(dialog).getByText("In Portuguese")).toBeInTheDocument();
    });

    it("falls back to the short description when there is no long one", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Third post"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByText("The third post.")).toBeInTheDocument();
    });

    it("links out to a LinkedIn post in a new tab, announced to screen readers", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Newest post"));

      const dialog = await screen.findByRole("dialog");
      const link = within(dialog).getByRole("link", {
        name: "Read on LinkedIn (opens in a new tab)",
      });
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/pulse/newest");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("tracks the outbound click", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("link", { name: /Read on LinkedIn/ }));

      expect(trackExternalLinkClick).toHaveBeenCalledTimes(1);
      expect(trackExternalLinkClick).toHaveBeenCalledWith({
        url: "https://www.linkedin.com/pulse/newest",
        context: "posts",
      });
    });

    it("embeds a YouTube video with the privacy-enhanced player", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Demo video"));

      const dialog = await screen.findByRole("dialog");
      const player = within(dialog).getByTitle("Video: Demo video");
      expect(player.tagName).toBe("IFRAME");
      expect(player).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      expect(
        within(dialog).getByRole("link", { name: "Watch on YouTube (opens in a new tab)" })
      ).toHaveAttribute("href", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });

    it("shows no player for non-video posts", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Newest post"));

      const dialog = await screen.findByRole("dialog");
      expect(dialog.querySelector("iframe")).toBeNull();
    });

    it("steps through the three posts on screen, wrapping around", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Third post"));
      const dialog = await screen.findByRole("dialog");

      // Next from the last visible post wraps to the first — not on to "Fourth".
      await user.click(within(dialog).getByRole("button", { name: "Next post" }));
      expect(within(dialog).getByRole("heading", { name: "Newest post" })).toBeInTheDocument();

      // Previous from the first wraps to the last visible post — not to "Oldest".
      await user.click(within(dialog).getByRole("button", { name: "Previous post" }));
      expect(within(dialog).getByRole("heading", { name: "Third post" })).toBeInTheDocument();
    });

    it("hides prev/next when there is only one post", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={[newest]} locale="en" />);

      await user.click(cardFor("Newest post"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).queryByRole("button", { name: "Next post" })).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: "Previous post" })
      ).not.toBeInTheDocument();
    });

    it("closes with Escape", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(within(dialog).queryByRole("link", { name: /Read on/ })).not.toBeInTheDocument();
      });
    });
  });

  describe("deep link", () => {
    it("writes the open post into the URL, keeping the section hash", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await user.click(cardFor("Newest post"));
      await screen.findByRole("dialog");

      expect(window.location.search).toBe("?post=newest");
      expect(window.location.hash).toBe("#posts");
    });

    it("clears the post from the URL on close", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      await screen.findByRole("dialog");

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(window.location.search).toBe("");
      });
      expect(window.location.hash).toBe("#posts");
    });

    it("keeps the URL on the post shown by Prev/Next without stacking history", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");

      const pushSpy = jest.spyOn(window.history, "pushState");
      await user.click(within(dialog).getByRole("button", { name: "Next post" }));

      expect(window.location.search).toBe("?post=video");
      // Stepping replaces the entry rather than pushing a new one each time.
      expect(pushSpy).not.toHaveBeenCalled();
      pushSpy.mockRestore();
    });

    it("opens the deep-linked post on mount and scrolls to the section", async () => {
      window.history.replaceState(null, "", "/en/?post=video#posts");
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Demo video" })).toBeInTheDocument();
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: "start",
        behavior: "instant",
      });
    });

    it("opens a deep-linked post that has dropped off the latest three, without prev/next", async () => {
      window.history.replaceState(null, "", "/en/?post=oldest#posts");
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Oldest post" })).toBeInTheDocument();
      expect(within(dialog).queryByRole("button", { name: "Next post" })).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: "Previous post" })
      ).not.toBeInTheDocument();
    });

    it("ignores an unknown post id in the URL", async () => {
      window.history.replaceState(null, "", "/en/?post=does-not-exist#posts");
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      await waitFor(() => {
        expect(screen.getByText("Newest post")).toBeInTheDocument();
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("follows the URL on browser back", async () => {
      const user = userEvent.setup();
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      await screen.findByRole("dialog");

      // Simulate going back: the URL loses the param, then popstate fires.
      window.history.replaceState(null, "", "/#posts");
      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("reopens the post when forward navigation restores the param", async () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      window.history.replaceState(null, "", "/?post=third#posts");
      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Third post" })).toBeInTheDocument();
    });
  });

  describe("copy link", () => {
    /**
     * Installs a clipboard double. Must run *after* `userEvent.setup()`, which
     * installs a working stub of its own that would otherwise win.
     */
    const setClipboard = (value: unknown) => {
      Object.defineProperty(navigator, "clipboard", {
        value,
        configurable: true,
        writable: true,
      });
    };

    afterEach(() => {
      setClipboard(undefined);
    });

    it("copies the post's link to the posts page, not to the home page", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/en/posts/?post=newest");
      expect(await within(dialog).findByText("Link copied!")).toBeInTheDocument();
    });

    it("uses the active locale in the copied link", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      renderWithIntl(<PostsSection posts={samplePosts} locale="pt-BR" />, "pt-BR");
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/pt-BR/posts/?post=newest");
    });

    it("announces the confirmation in a polite live region", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      const status = await within(dialog).findByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveTextContent("Link copied!");
    });

    it("tracks a successful share", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      await waitFor(() => {
        expect(trackPostShare).toHaveBeenCalledWith({
          post_id: "newest",
          post_title: "Newest post",
        });
      });
    });

    it("shows an error message and tracks nothing when copying fails", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockRejectedValue(new Error("denied")) });

      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      await user.click(cardFor("Newest post"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(await within(dialog).findByText("Couldn't copy the link")).toBeInTheDocument();
      expect(trackPostShare).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("gives every card button an accessible name naming the post", () => {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      for (const title of ["Newest post", "Demo video", "Third post"]) {
        expect(cardFor(title)).toBeInTheDocument();
      }
    });

    it("hides decorative images and icons from assistive tech", () => {
      const { container } = renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);

      for (const img of Array.from(container.querySelectorAll("img"))) {
        expect(img).toHaveAttribute("alt", "");
      }
      for (const svg of Array.from(container.querySelectorAll("svg"))) {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  it("renders the swipe carousel instead of the grid on mobile", async () => {
    const original = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    try {
      renderWithIntl(<PostsSection posts={samplePosts} locale="en" />);
      // The infinite carousel renders each card in three copies; the grid renders one.
      await waitFor(() => {
        expect(screen.getAllByText("Demo video").length).toBeGreaterThan(1);
      });
      // Still only the latest three, however they are laid out.
      expect(screen.queryByText("Fourth post")).not.toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});
