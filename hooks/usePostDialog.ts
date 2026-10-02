"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types/index";
import { buildPostHistoryUrl, readPostParam } from "@/lib/post-deep-link";

/**
 * State for the post detail dialog, mirrored into the URL as `?post=<id>` so a
 * post can be linked to and the Back button closes it.
 *
 * `posts` is every post that may be linked to, not only the ones on screen: the
 * home page shows the latest three but still opens a deep link to an older one.
 * `hash` is the section to keep in the URL (the home page's `#posts`); the
 * posts page passes none.
 */
export function usePostDialog(posts: readonly Post[], hash?: string) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  /**
   * Mirrors the open post into the URL without navigating.
   *
   * The no-op guard compares against the live URL rather than a remembered
   * value, so it can never drift out of step with history: clearing the
   * selection makes the dialog fire its close event a second time, and a back
   * navigation closes the dialog when the URL has *already* dropped the param —
   * pushing there would truncate the forward entry the reader just came from.
   */
  const syncUrl = useCallback(
    (postId: string | null, mode: "push" | "replace") => {
      if (readPostParam(window.location.search) === postId) return;

      const url = buildPostHistoryUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        postId,
        hash,
      });
      if (mode === "push") {
        window.history.pushState(null, "", url);
      } else {
        window.history.replaceState(null, "", url);
      }
    },
    [hash]
  );

  const open = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      syncUrl(post.id, "push");
    },
    [syncUrl]
  );

  const close = useCallback(() => {
    setSelectedPost(null);
    syncUrl(null, "push");
  }, [syncUrl]);

  /** Moves to another post inside the open dialog. Replaces, so stepping doesn't flood history. */
  const step = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      syncUrl(post.id, "replace");
    },
    [syncUrl]
  );

  // Deep link: `?post=<id>` opens that post's dialog on arrival. Runs once —
  // later param changes come through popstate instead.
  const deepLinkHandledRef = useRef(false);
  useEffect(() => {
    if (deepLinkHandledRef.current) return;
    deepLinkHandledRef.current = true;

    const id = readPostParam(window.location.search);
    if (id === null) return;
    // An unknown id is ignored: the page renders normally, dialog stays closed.
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    // Scroll first, and instantly: the page has `scroll-behavior: smooth`, and
    // the modal's body scroll lock would cancel an animated scroll partway
    // through, leaving the reader parked at the top of the page instead.
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    setSelectedPost(post);
  }, [posts, hash]);

  // Back/forward moves through the opened posts; state follows the URL here,
  // never the other way around (pushing from this handler would fight history).
  useEffect(() => {
    const handlePopstate = () => {
      const id = readPostParam(window.location.search);
      setSelectedPost(id === null ? null : (posts.find((p) => p.id === id) ?? null));
    };
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [posts]);

  return { selectedPost, open, close, step };
}
