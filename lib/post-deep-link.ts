/**
 * Deep-link helpers for the posts section and the posts page.
 *
 * A shared post link looks like `https://site/<locale>/posts/?post=<id>`: the
 * query param names the post whose dialog should open. The same param works on
 * the home page (`/<locale>/?post=<id>#posts`). On the posts page a second
 * param, `?platform=linkedin`, preselects the platform filter. The site is a
 * static export with no middleware, so both are read and written client-side.
 *
 * Kept as pure string functions (no `window`) so they are testable and covered
 * by mutation testing, which is scoped to `lib/`.
 */

import { isPostPlatform } from "@/lib/posts";
import { stripTrailingSlashes } from "@/lib/project-deep-link";
import type { PostPlatform } from "@/types/index";

/** Query-string key naming the post whose dialog should be open. */
export const POST_QUERY_PARAM = "post";

/** Query-string key naming the platform the posts page is filtered to. */
export const PLATFORM_QUERY_PARAM = "platform";

/** Reads a param, treating a present-but-empty value like an absent one. */
function readParam(search: string, key: string): string | null {
  const value = new URLSearchParams(search).get(key);
  return value === "" ? null : value;
}

/** Returns `search` with `key` set to `value`, or removed when `value` is null or empty. */
function withParam(search: string, key: string, value: string | null): string {
  const params = new URLSearchParams(search);
  if (value === null || value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

/** The post id out of a location search string (`"?post=ai-agents"`), or null. */
export function readPostParam(search: string): string | null {
  return readParam(search, POST_QUERY_PARAM);
}

/**
 * The platform out of a location search string, or null when it's absent or
 * not a platform we know — an unknown value falls back to showing everything
 * rather than an empty page.
 */
export function readPlatformParam(search: string): PostPlatform | null {
  const value = readParam(search, PLATFORM_QUERY_PARAM);
  return isPostPlatform(value) ? value : null;
}

/** `search` with the post param set to `postId`, or removed when null. Other params are kept. */
export function withPostParam(search: string, postId: string | null): string {
  return withParam(search, POST_QUERY_PARAM, postId);
}

/** `search` with the platform param set, or removed when null. Other params are kept. */
export function withPlatformParam(search: string, platform: PostPlatform | null): string {
  return withParam(search, PLATFORM_QUERY_PARAM, platform);
}

/**
 * Builds the same-page URL to write into history when a post opens or closes.
 * Keeps the path and any unrelated params (such as the platform filter), and
 * appends `hash` when given — the home page passes its section id so back and
 * forward still land on the section.
 */
export function buildPostHistoryUrl(params: {
  readonly pathname: string;
  readonly search: string;
  readonly postId: string | null;
  readonly hash?: string;
}): string {
  const { pathname, search, postId, hash } = params;
  const suffix = hash ? `#${hash}` : "";
  return `${pathname}${withPostParam(search, postId)}${suffix}`;
}

/**
 * Path of the posts page. The trailing slash matches `trailingSlash: true` in
 * next.config.js, so visitors don't eat a redirect.
 */
export function getPostsPagePath(locale: string): string {
  return `/${locale}/posts/`;
}

/**
 * Builds the absolute URL to hand to someone else, e.g.
 * `https://site.dev/en/posts/?post=ai-agents-git-worktrees`. Always points at
 * the posts page, which lists every post, so it works for old posts that have
 * dropped off the home page's latest three.
 */
export function buildPostShareUrl(params: {
  readonly origin: string;
  readonly locale: string;
  readonly postId: string;
}): string {
  const { origin, locale, postId } = params;
  const base = stripTrailingSlashes(origin);
  return `${base}${getPostsPagePath(locale)}?${POST_QUERY_PARAM}=${encodeURIComponent(postId)}`;
}
