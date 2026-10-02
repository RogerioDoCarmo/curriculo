"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/index";
import SwipeCarousel from "@/components/SwipeCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePostDialog } from "@/hooks/usePostDialog";
import { getPostsPagePath } from "@/lib/post-deep-link";
import { POSTS_SECTION_ID, getLatestPosts } from "@/lib/posts";
import { PostCard, PostDialog } from "./PostParts";

interface PostsSectionProps {
  /** Every post: only the latest are shown, but a deep link can open any of them. */
  readonly posts: Post[];
  readonly locale: string;
}

/**
 * The home page's posts section: the latest three posts as cards (a swipe
 * carousel on phones), a detail dialog, and a link to the posts page that holds
 * the rest and lets visitors group them by platform.
 */
export default function PostsSection({ posts, locale }: PostsSectionProps) {
  const t = useTranslations();
  const { selectedPost, open, close, step } = usePostDialog(posts, POSTS_SECTION_ID);
  // Below the `sm` breakpoint, swap the grid for a one-card-per-swipe carousel.
  const isMobile = useMediaQuery("(max-width: 639px)");

  if (posts.length === 0) return null;

  const latest = getLatestPosts(posts);

  const postsContent = isMobile ? (
    /* Mobile: one card per swipe, looping infinitely. */
    <SwipeCarousel
      ariaLabel={t("sections.posts")}
      itemClassName="w-[85%]"
      showControls
      prevLabel={t("posts.previousPost")}
      nextLabel={t("posts.nextPost")}
      items={latest.map((post) => ({
        key: post.id,
        node: <PostCard post={post} locale={locale} onClick={() => open(post)} />,
      }))}
    />
  ) : (
    /* Desktop: grid. */
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {latest.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} onClick={() => open(post)} />
      ))}
    </div>
  );

  return (
    <section
      id={POSTS_SECTION_ID}
      tabIndex={-1}
      aria-labelledby="posts-title"
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="posts-title" className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("sections.posts")}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{t("posts.subtitle")}</p>

        {postsContent}

        <div className="mt-8 flex justify-center">
          <Link
            href={getPostsPagePath(locale)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("posts.viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Prev/Next step through the posts on screen */}
        <PostDialog
          post={selectedPost}
          navPosts={latest}
          locale={locale}
          onClose={close}
          onStep={step}
        />
      </div>
    </section>
  );
}
