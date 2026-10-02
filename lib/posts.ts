/**
 * Pure helpers for the posts section (LinkedIn posts/articles, YouTube videos).
 *
 * Kept free of `window` and React so they are unit-testable and covered by
 * mutation testing, which is scoped to `lib/`.
 */

import type { NavSection } from "@/lib/nav-sections";
import type { Post, PostKind, PostPlatform } from "@/types/index";

/**
 * DOM id of the posts section. Typed as `NavSection` so renaming the section in
 * `lib/nav-sections.ts` breaks the build here instead of leaving a nav link
 * that scrolls nowhere.
 */
export const POSTS_SECTION_ID: NavSection = "posts";

/** How many of the newest posts the home page section shows; the rest live on the posts page. */
export const LATEST_POSTS_COUNT = 3;

/** Every supported platform, in the order their filter chips appear. */
export const POST_PLATFORMS: readonly PostPlatform[] = ["linkedin", "youtube"];

/** Every supported kind of publication. */
export const POST_KINDS: readonly PostKind[] = ["post", "article", "video"];

/** YouTube video ids are always 11 characters from this alphabet. */
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

/** Path prefixes under youtube.com that are followed directly by a video id. */
const YOUTUBE_ID_PATH_PREFIXES: ReadonlySet<string> = new Set(["embed", "shorts", "live"]);

// `includes` compares with SameValueZero, so non-string values are rejected
// without a separate typeof guard.
export function isPostPlatform(value: unknown): value is PostPlatform {
  return (POST_PLATFORMS as readonly unknown[]).includes(value);
}

export function isPostKind(value: unknown): value is PostKind {
  return (POST_KINDS as readonly unknown[]).includes(value);
}

/** Returns `candidate` when it looks like a YouTube video id, otherwise null. */
function asVideoId(candidate: string | null | undefined): string | null {
  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

/**
 * Extracts the video id from any common YouTube URL shape:
 * `youtube.com/watch?v=<id>`, `youtu.be/<id>`, and
 * `youtube.com/{embed,shorts,live}/<id>`. Returns null for anything else,
 * including malformed URLs and non-YouTube hosts.
 */
export function getYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^(www|m)\./, "");
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    return asVideoId(segments[0]);
  }
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") {
    return null;
  }
  if (segments[0] === "watch") {
    return asVideoId(parsed.searchParams.get("v"));
  }
  if (YOUTUBE_ID_PATH_PREFIXES.has(segments[0])) {
    return asVideoId(segments[1]);
  }
  return null;
}

/**
 * Privacy-enhanced embed URL: youtube-nocookie.com sets no tracking cookies
 * until the viewer actually presses play.
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/** The 480×360 thumbnail YouTube generates for every video. */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** The YouTube video id of a post, or null when it isn't a YouTube post. */
export function getPostVideoId(post: Pick<Post, "platform" | "url">): string | null {
  return post.platform === "youtube" ? getYouTubeVideoId(post.url) : null;
}

/**
 * The image to show for a post: its own cover image when set, otherwise the
 * video thumbnail for YouTube posts, otherwise undefined (the card then shows
 * a platform-branded placeholder).
 */
export function getPostImage(post: Pick<Post, "platform" | "url" | "image">): string | undefined {
  if (post.image) return post.image;
  const videoId = getPostVideoId(post);
  return videoId === null ? undefined : getYouTubeThumbnailUrl(videoId);
}

/**
 * Posts newest first, by date. Sorts here instead of trusting the caller's
 * order, so every list on the site agrees. Posts on the same day are ordered by
 * id: the order a directory listing returns files in differs between machines,
 * and the latest three must not change depending on where the site was built.
 * The input is left untouched.
 */
export function sortPostsNewestFirst<T extends Pick<Post, "id" | "date">>(
  posts: readonly T[]
): T[] {
  return posts.toSorted((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
}

/** The newest `count` posts, newest first. */
export function getLatestPosts<T extends Pick<Post, "id" | "date">>(
  posts: readonly T[],
  count: number = LATEST_POSTS_COUNT
): T[] {
  return sortPostsNewestFirst(posts).slice(0, count);
}

/** The platforms that actually have posts, in `POST_PLATFORMS` order. */
export function getPostPlatforms(posts: readonly Pick<Post, "platform">[]): PostPlatform[] {
  return POST_PLATFORMS.filter((platform) => posts.some((post) => post.platform === platform));
}

/** Posts on `platform`, or every post when `platform` is null. */
export function filterPostsByPlatform<T extends Pick<Post, "platform">>(
  posts: readonly T[],
  platform: PostPlatform | null
): T[] {
  return platform === null ? [...posts] : posts.filter((post) => post.platform === platform);
}

/** The primary language subtag: `"pt-BR"` → `"pt"`. */
function baseLanguage(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

/**
 * Whether a post is written in a different language from the page it's shown
 * on. Compares primary subtags only, so a `pt-BR` post on a `pt` page is not
 * flagged as foreign.
 */
export function isInOtherLanguage(postLanguage: string, locale: string): boolean {
  return baseLanguage(postLanguage) !== baseLanguage(locale);
}

/**
 * The name of `language` as written in `locale` — `"Portuguese"` in English,
 * `"portugués"` in Spanish. Uses the primary subtag so it reads "Portuguese"
 * rather than "Brazilian Portuguese". Falls back to the raw tag when the
 * runtime has no name for it.
 */
export function getLanguageName(language: string, locale: string): string {
  const base = baseLanguage(language);
  return (
    new Intl.DisplayNames([locale], { type: "language", fallback: "none" }).of(base) ?? language
  );
}

/**
 * Formats an ISO date (`"2026-09-13"`) as a short month and year in `locale`
 * (`"Sep 2026"` in English). Pinned to UTC: a date-only string parses as UTC
 * midnight, so formatting in the visitor's zone would show the previous day
 * west of Greenwich — and differ between the server render and hydration.
 * Returns the input unchanged when it isn't a valid date.
 */
export function formatPostDate(date: string, locale: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
