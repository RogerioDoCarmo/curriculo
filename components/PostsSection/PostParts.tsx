"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ExternalLink, Link2, Play } from "lucide-react";
import type { Post, PostPlatform } from "@/types/index";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import MarkdownText from "@/components/MarkdownText";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { trackExternalLinkClick, trackPostShare } from "@/lib/analytics";
import { buildPostShareUrl } from "@/lib/post-deep-link";
import {
  formatPostDate,
  getLanguageName,
  getPostImage,
  getPostVideoId,
  getYouTubeEmbedUrl,
  isInOtherLanguage,
} from "@/lib/posts";

/**
 * Pieces shared by the home page section (latest three) and the posts page
 * (everything, filterable): filter chip, card, and the detail dialog.
 */

// ─── FilterButton ────────────────────────────────────────────────────────────

/**
 * A platform filter chip. Rendered in two branches so `aria-pressed` is a
 * literal "true"/"false" string — static a11y linters can't evaluate JSX
 * expressions and would flag `aria-pressed={expr}` as an invalid value.
 */
export function FilterButton({
  label,
  active,
  onClick,
}: {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  const className = [
    "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
    active
      ? "bg-primary-600 text-white dark:bg-primary-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
  ].join(" ");
  const props = { onClick, className };

  return active ? (
    <button type="button" {...props} aria-pressed="true">
      {label}
    </button>
  ) : (
    <button type="button" {...props} aria-pressed="false">
      {label}
    </button>
  );
}

// ─── PlatformIcon ────────────────────────────────────────────────────────────

/** Brand marks (Simple Icons paths); lucide-react no longer ships brand icons. */
const PLATFORM_ICON_PATHS: Record<PostPlatform, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

export function PlatformIcon({
  platform,
  className,
}: {
  readonly platform: PostPlatform;
  readonly className: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={PLATFORM_ICON_PATHS[platform]} />
    </svg>
  );
}

/** Placeholder backgrounds for posts with no cover image, in each brand's colour. */
const PLATFORM_PLACEHOLDER_CLASSES: Record<PostPlatform, string> = {
  linkedin: "bg-linear-to-br from-sky-600 to-blue-800",
  youtube: "bg-linear-to-br from-red-500 to-red-700",
};

/** Small brand-coloured text for the platform name in card metadata. */
const PLATFORM_TEXT_CLASSES: Record<PostPlatform, string> = {
  linkedin: "text-sky-700 dark:text-sky-400",
  youtube: "text-red-600 dark:text-red-400",
};

// ─── PostMeta ────────────────────────────────────────────────────────────────

/** Platform · kind · date line, shared by the card and the detail dialog. */
function PostMeta({ post, locale }: { readonly post: Post; readonly locale: string }) {
  const t = useTranslations();
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
      <span
        className={`inline-flex items-center gap-1 font-medium ${PLATFORM_TEXT_CLASSES[post.platform]}`}
      >
        <PlatformIcon platform={post.platform} className="h-4 w-4" />
        {t(`posts.platform.${post.platform}`)}
      </span>
      <span aria-hidden="true">·</span>
      <span>{t(`posts.kind.${post.kind}`)}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
    </p>
  );
}

// ─── PostCard ────────────────────────────────────────────────────────────────

export interface PostCardProps {
  readonly post: Post;
  readonly locale: string;
  readonly onClick: () => void;
}

export function PostCard({ post, locale, onClick }: PostCardProps) {
  const t = useTranslations();
  const image = getPostImage(post);
  const isVideo = getPostVideoId(post) !== null;
  const otherLanguage = isInOtherLanguage(post.language, locale);

  return (
    <Card
      className={[
        "group h-full cursor-pointer transition-all duration-200",
        post.featured ? "ring-2 ring-primary-200 dark:ring-primary-800" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t("posts.viewDetails")} ${post.title}`}
        className="block w-full text-left"
      >
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center ${PLATFORM_PLACEHOLDER_CLASSES[post.platform]}`}
            >
              <PlatformIcon platform={post.platform} className="h-14 w-14 text-white/90" />
            </div>
          )}
          {isVideo && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white">
                <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
              </span>
            </span>
          )}
        </div>

        <div className="mb-2">
          <PostMeta post={post} locale={locale} />
        </div>
        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          {post.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {post.description}
        </p>
        {(post.featured || otherLanguage) && (
          <div className="flex flex-wrap gap-1">
            {post.featured && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {t("posts.featured")}
              </span>
            )}
            {otherLanguage && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {t("posts.inLanguage", { language: getLanguageName(post.language, locale) })}
              </span>
            )}
          </div>
        )}
      </button>
    </Card>
  );
}

// ─── PostDetail (dialog content) ─────────────────────────────────────────────

interface PostDetailProps {
  readonly post: Post;
  readonly locale: string;
}

function PostDetail({ post, locale }: PostDetailProps) {
  const t = useTranslations();
  const { copied, failed, copy } = useCopyToClipboard();
  const videoId = getPostVideoId(post);
  const image = getPostImage(post);
  const platformName = t(`posts.platform.${post.platform}`);
  const linkLabel =
    videoId === null
      ? t("posts.readOn", { platform: platformName })
      : t("posts.watchOn", { platform: platformName });

  // The share URL is built on click, never during render: `window.location`
  // doesn't exist on the server and would desync the markup on hydration.
  const handleCopyLink = async () => {
    const shareUrl = buildPostShareUrl({
      origin: window.location.origin,
      locale,
      postId: post.id,
    });
    const succeeded = await copy(shareUrl);
    if (succeeded) {
      trackPostShare({ post_id: post.id, post_title: post.title });
    }
  };

  let copyStatusMessage = "";
  let copyStatusClasses = "";
  if (copied) {
    copyStatusMessage = t("posts.linkCopied");
    copyStatusClasses = "text-green-600 dark:text-green-400";
  } else if (failed) {
    copyStatusMessage = t("posts.copyLinkFailed");
    copyStatusClasses = "text-red-600 dark:text-red-400";
  }

  let media: React.ReactNode = null;
  if (videoId !== null) {
    // The player only loads once the reader opens the dialog, and from the
    // youtube-nocookie domain, so merely visiting the page sets no YouTube cookies.
    media = (
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
        <iframe
          src={getYouTubeEmbedUrl(videoId)}
          title={t("posts.videoTitle", { title: post.title })}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  } else if (image) {
    media = (
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 672px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {media}

      <PostMeta post={post} locale={locale} />

      <MarkdownText text={post.longDescription || post.description} />

      {isInOtherLanguage(post.language, locale) && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("posts.inLanguage", { language: getLanguageName(post.language, locale) })}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackExternalLinkClick({ url: post.url, context: "posts" })}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          {linkLabel}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t("posts.opensInNewTab")}</span>
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={`${t("posts.copyLink")} — ${post.title}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {t("posts.copyLink")}
        </button>
        {/* Always mounted so assistive tech is watching before the text lands. */}
        <span role="status" aria-live="polite" className={`text-sm ${copyStatusClasses}`}>
          {copyStatusMessage}
        </span>
      </div>
    </div>
  );
}

// ─── PostDialog ──────────────────────────────────────────────────────────────

interface PostDialogProps {
  /** The open post, or null when the dialog is closed. */
  readonly post: Post | null;
  /** The posts Prev/Next steps through (the ones currently on screen). */
  readonly navPosts: readonly Post[];
  readonly locale: string;
  readonly onClose: () => void;
  readonly onStep: (post: Post) => void;
}

/**
 * The post detail dialog. Prev/Next step through `navPosts`, wrapping, and only
 * appear when the open post is one of them — a deep link can open a post that
 * isn't on screen (an older one, on the home page), where stepping from it
 * would have no meaningful neighbour.
 */
export function PostDialog({ post, navPosts, locale, onClose, onStep }: PostDialogProps) {
  const t = useTranslations();
  const index = post ? navPosts.findIndex((p) => p.id === post.id) : -1;
  const canNav = index >= 0 && navPosts.length > 1;

  const step = (delta: 1 | -1) => {
    onStep(navPosts[(index + delta + navPosts.length) % navPosts.length]);
  };

  return (
    <Modal
      isOpen={!!post}
      onClose={onClose}
      title={post?.title}
      onPrev={canNav ? () => step(-1) : undefined}
      onNext={canNav ? () => step(1) : undefined}
      prevLabel={t("posts.previousPost")}
      nextLabel={t("posts.nextPost")}
    >
      {post && <PostDetail post={post} locale={locale} />}
    </Modal>
  );
}
