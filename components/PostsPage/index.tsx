"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Post, PostPlatform } from "@/types/index";
import { usePostDialog } from "@/hooks/usePostDialog";
import { readPlatformParam, withPlatformParam } from "@/lib/post-deep-link";
import { POST_PLATFORMS, filterPostsByPlatform, sortPostsNewestFirst } from "@/lib/posts";
import { FilterButton, PostCard, PostDialog } from "@/components/PostsSection/PostParts";

interface PostsPageProps {
  readonly posts: Post[];
  readonly locale: string;
}

/**
 * Every post, newest first, grouped by platform with filter chips. Unlike the
 * home page section it lists all platforms even when one has no posts yet, so
 * a visitor sees that YouTube exists and is empty rather than not at all.
 * The chosen platform lives in the URL (`?platform=linkedin`) so a filtered
 * view can be linked to.
 */
export default function PostsPage({ posts, locale }: PostsPageProps) {
  const t = useTranslations();
  const { selectedPost, open, close, step } = usePostDialog(posts);
  const [platformFilter, setPlatformFilter] = useState<PostPlatform | null>(null);

  // Read the URL after mount, not in the initial state: the server render has
  // no query string, and starting from it would mismatch on hydration.
  useEffect(() => {
    setPlatformFilter(readPlatformParam(window.location.search));
  }, []);

  const choosePlatform = (platform: PostPlatform | null) => {
    setPlatformFilter(platform);
    // Replace, not push: flipping filters shouldn't bury the Back button.
    const search = withPlatformParam(window.location.search, platform);
    window.history.replaceState(null, "", `${window.location.pathname}${search}`);
  };

  const filtered = filterPostsByPlatform(sortPostsNewestFirst(posts), platformFilter);

  return (
    <section aria-labelledby="posts-page-title" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1
          id="posts-page-title"
          className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {t("posts.pageHeading")}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{t("posts.pageSubtitle")}</p>

        <fieldset className="mb-8 flex min-w-0 flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">{t("posts.filterByPlatform")}</legend>
          <FilterButton
            label={t("posts.all")}
            active={platformFilter === null}
            onClick={() => choosePlatform(null)}
          />
          {POST_PLATFORMS.map((platform) => (
            <FilterButton
              key={platform}
              label={t(`posts.platform.${platform}`)}
              active={platformFilter === platform}
              onClick={() => choosePlatform(platform === platformFilter ? null : platform)}
            />
          ))}
        </fieldset>

        {filtered.length === 0 ? (
          <output className="block text-gray-500 dark:text-gray-400">
            {t("posts.emptyPlatform", {
              platform: platformFilter ? t(`posts.platform.${platformFilter}`) : "",
            })}
          </output>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} onClick={() => open(post)} />
            ))}
          </div>
        )}

        {/* Prev/Next step through the (filtered) posts on screen */}
        <PostDialog
          post={selectedPost}
          navPosts={filtered}
          locale={locale}
          onClose={close}
          onStep={step}
        />
      </div>
    </section>
  );
}
