/**
 * Unit tests for lib/posts.ts — the pure helpers behind the posts section.
 *
 * Assertions use literal expected values (never values re-derived from the
 * module under test) so they hold up under mutation testing.
 */

import {
  LATEST_POSTS_COUNT,
  POSTS_SECTION_ID,
  POST_KINDS,
  POST_PLATFORMS,
  filterPostsByPlatform,
  formatPostDate,
  getLanguageName,
  getLatestPosts,
  getPostImage,
  getPostPlatforms,
  getPostVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  isInOtherLanguage,
  isPostKind,
  isPostPlatform,
  sortPostsNewestFirst,
} from "@/lib/posts";
import type { PostPlatform } from "@/types/index";

const VIDEO_ID = "dQw4w9WgXcQ";

describe("constants", () => {
  it("anchors the section on the 'posts' id", () => {
    expect(POSTS_SECTION_ID).toBe("posts");
  });

  it("lists platforms in filter-chip order", () => {
    expect(POST_PLATFORMS).toEqual(["linkedin", "youtube"]);
  });

  it("lists every kind of publication", () => {
    expect(POST_KINDS).toEqual(["post", "article", "video"]);
  });
});

describe("isPostPlatform", () => {
  it.each(["linkedin", "youtube"])("accepts %s", (value) => {
    expect(isPostPlatform(value)).toBe(true);
  });

  it.each(["LinkedIn", "twitter", "", " linkedin", 1, null, undefined, ["linkedin"]])(
    "rejects %p",
    (value) => {
      expect(isPostPlatform(value)).toBe(false);
    }
  );
});

describe("isPostKind", () => {
  it.each(["post", "article", "video"])("accepts %s", (value) => {
    expect(isPostKind(value)).toBe(true);
  });

  it.each(["Post", "short", "", 0, null, undefined])("rejects %p", (value) => {
    expect(isPostKind(value)).toBe(false);
  });
});

describe("getYouTubeVideoId", () => {
  it.each([
    [`https://www.youtube.com/watch?v=${VIDEO_ID}`],
    [`https://youtube.com/watch?v=${VIDEO_ID}`],
    [`https://m.youtube.com/watch?v=${VIDEO_ID}`],
    [`https://www.youtube.com/watch?feature=share&v=${VIDEO_ID}&t=42`],
    [`https://youtu.be/${VIDEO_ID}`],
    [`https://youtu.be/${VIDEO_ID}?si=abc123`],
    [`https://www.youtube.com/embed/${VIDEO_ID}`],
    [`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`],
    [`https://www.youtube.com/shorts/${VIDEO_ID}`],
    [`https://www.youtube.com/live/${VIDEO_ID}?feature=shared`],
  ])("extracts the id from %s", (url) => {
    expect(getYouTubeVideoId(url)).toBe(VIDEO_ID);
  });

  it("accepts ids containing - and _", () => {
    expect(getYouTubeVideoId("https://youtu.be/a-b_c-d_e-f")).toBe("a-b_c-d_e-f");
  });

  it.each([
    ["a malformed URL", "not a url"],
    ["an empty string", ""],
    ["a non-YouTube host", `https://vimeo.com/watch?v=${VIDEO_ID}`],
    ["a lookalike host", `https://notyoutube.com/watch?v=${VIDEO_ID}`],
    ["a lookalike youtu.be host", `https://evil-youtu.be/${VIDEO_ID}`],
    ["a watch URL without v", "https://www.youtube.com/watch"],
    ["an empty v", "https://www.youtube.com/watch?v="],
    ["a too-short id", "https://youtu.be/abc"],
    ["a too-long id", `https://youtu.be/${VIDEO_ID}x`],
    ["an id with invalid characters", "https://youtu.be/dQw4w9WgX.Q"],
    ["a bare youtu.be", "https://youtu.be/"],
    ["a channel URL", "https://www.youtube.com/@rogeriodocarmo"],
    ["an embed prefix without id", "https://www.youtube.com/embed/"],
    ["an id after an unknown prefix", `https://www.youtube.com/playlist/${VIDEO_ID}`],
    ["a linkedin URL", "https://www.linkedin.com/posts/someone_activity-123"],
  ])("returns null for %s", (_label, url) => {
    expect(getYouTubeVideoId(url)).toBeNull();
  });

  it("only strips a leading www./m. prefix, not one elsewhere in the host", () => {
    expect(getYouTubeVideoId(`https://wwwyoutube.com/watch?v=${VIDEO_ID}`)).toBeNull();
    expect(getYouTubeVideoId(`https://www.m.youtube.com/watch?v=${VIDEO_ID}`)).toBeNull();
  });

  it("doesn't let a mid-host 'm.' collapse a lookalike into youtube.com", () => {
    // Unanchored, stripping the first "m." would turn this into "youtube.com".
    expect(getYouTubeVideoId(`https://youtube.cm.om/watch?v=${VIDEO_ID}`)).toBeNull();
  });
});

describe("YouTube URL builders", () => {
  it("builds the privacy-enhanced embed URL", () => {
    expect(getYouTubeEmbedUrl(VIDEO_ID)).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("builds the hqdefault thumbnail URL", () => {
    expect(getYouTubeThumbnailUrl(VIDEO_ID)).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
  });
});

describe("getPostVideoId", () => {
  it("returns the id for a YouTube post", () => {
    expect(getPostVideoId({ platform: "youtube", url: `https://youtu.be/${VIDEO_ID}` })).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("ignores a YouTube URL on a non-YouTube post", () => {
    expect(
      getPostVideoId({ platform: "linkedin", url: `https://youtu.be/${VIDEO_ID}` })
    ).toBeNull();
  });

  it("returns null for a YouTube post with an unrecognised URL", () => {
    expect(getPostVideoId({ platform: "youtube", url: "https://youtube.com/@me" })).toBeNull();
  });
});

describe("getPostImage", () => {
  it("prefers the post's own cover image", () => {
    expect(
      getPostImage({
        platform: "youtube",
        url: `https://youtu.be/${VIDEO_ID}`,
        image: "/images/posts/cover.webp",
      })
    ).toBe("/images/posts/cover.webp");
  });

  it("falls back to the video thumbnail for YouTube posts", () => {
    expect(getPostImage({ platform: "youtube", url: `https://youtu.be/${VIDEO_ID}` })).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
  });

  it("treats an empty image as unset", () => {
    expect(
      getPostImage({ platform: "youtube", url: `https://youtu.be/${VIDEO_ID}`, image: "" })
    ).toBe("https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("returns undefined for a LinkedIn post without a cover", () => {
    expect(
      getPostImage({ platform: "linkedin", url: "https://www.linkedin.com/pulse/x" })
    ).toBeUndefined();
  });

  it("returns undefined for a YouTube post whose URL has no video id", () => {
    expect(getPostImage({ platform: "youtube", url: "https://youtube.com/@me" })).toBeUndefined();
  });
});

describe("sortPostsNewestFirst", () => {
  const at = (id: string, date: string) => ({ id, date });

  it("orders by date, newest first", () => {
    const sorted = sortPostsNewestFirst([
      at("b", "2026-08-01"),
      at("a", "2026-09-26"),
      at("c", "2024-06-27"),
    ]);
    expect(sorted.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("orders a newer post that sorts lower alphabetically correctly", () => {
    // Guards the comparator's sign: ascending would give 2024 first.
    expect(sortPostsNewestFirst([at("old", "2024-01-01"), at("new", "2025-01-01")])[0].id).toBe(
      "new"
    );
    expect(sortPostsNewestFirst([at("new", "2025-01-01"), at("old", "2024-01-01")])[0].id).toBe(
      "new"
    );
  });

  it("orders posts on the same date by id, whatever order they came in", () => {
    expect(
      sortPostsNewestFirst([at("y", "2026-01-01"), at("x", "2026-01-01")]).map((p) => p.id)
    ).toEqual(["x", "y"]);
    expect(
      sortPostsNewestFirst([at("x", "2026-01-01"), at("y", "2026-01-01")]).map((p) => p.id)
    ).toEqual(["x", "y"]);
  });

  it("lets the date win over the id", () => {
    expect(
      sortPostsNewestFirst([at("a", "2026-01-01"), at("z", "2026-02-01")]).map((p) => p.id)
    ).toEqual(["z", "a"]);
  });

  it("keeps posts with the same date and id in their original order", () => {
    const tagged = [1, 2, 3, 4].map((n) => ({ ...at("same", "2026-01-01"), n }));
    expect(sortPostsNewestFirst(tagged).map((p) => p.n)).toEqual([1, 2, 3, 4]);
  });

  it("returns a new array and leaves the input alone", () => {
    const input = [at("old", "2020-01-01"), at("new", "2026-01-01")];
    const sorted = sortPostsNewestFirst(input);
    expect(sorted).not.toBe(input);
    expect(input.map((p) => p.id)).toEqual(["old", "new"]);
  });

  it("handles an empty list", () => {
    expect(sortPostsNewestFirst([])).toEqual([]);
  });
});

describe("getLatestPosts", () => {
  const at = (id: string, date: string) => ({ id, date });
  const posts = [
    at("b", "2026-08-01"),
    at("d", "2024-06-27"),
    at("a", "2026-09-26"),
    at("c", "2026-09-13"),
    at("e", "2023-01-01"),
  ];

  it("shows three by default", () => {
    expect(LATEST_POSTS_COUNT).toBe(3);
    expect(getLatestPosts(posts)).toHaveLength(3);
  });

  it("returns the newest first, whatever order they came in", () => {
    expect(getLatestPosts(posts).map((p) => p.id)).toEqual(["a", "c", "b"]);
  });

  it("honours an explicit count", () => {
    expect(getLatestPosts(posts, 1).map((p) => p.id)).toEqual(["a"]);
    expect(getLatestPosts(posts, 5).map((p) => p.id)).toEqual(["a", "c", "b", "d", "e"]);
    expect(getLatestPosts(posts, 0)).toEqual([]);
  });

  it("returns everything when there are fewer than the count", () => {
    expect(getLatestPosts([at("x", "2026-01-01"), at("y", "2026-02-01")]).map((p) => p.id)).toEqual(
      ["y", "x"]
    );
    expect(getLatestPosts([])).toEqual([]);
  });

  it("picks the same posts for a day with more than fit, however they were listed", () => {
    const sameDay = [at("c", "2026-09-13"), at("a", "2026-09-13"), at("b", "2026-09-13")];
    expect(getLatestPosts(sameDay, 2).map((p) => p.id)).toEqual(["a", "b"]);
    expect(getLatestPosts([...sameDay].reverse(), 2).map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("does not reorder the input", () => {
    const input = [at("old", "2020-01-01"), at("new", "2026-01-01")];
    getLatestPosts(input);
    expect(input.map((p) => p.id)).toEqual(["old", "new"]);
  });
});

describe("getPostPlatforms", () => {
  const p = (platform: PostPlatform) => ({ platform });

  it("returns an empty list for no posts", () => {
    expect(getPostPlatforms([])).toEqual([]);
  });

  it("lists each present platform once", () => {
    expect(getPostPlatforms([p("linkedin"), p("linkedin"), p("linkedin")])).toEqual(["linkedin"]);
  });

  it("orders platforms by POST_PLATFORMS, not by first appearance", () => {
    expect(getPostPlatforms([p("youtube"), p("linkedin"), p("youtube")])).toEqual([
      "linkedin",
      "youtube",
    ]);
  });

  it("omits platforms with no posts", () => {
    expect(getPostPlatforms([p("youtube")])).toEqual(["youtube"]);
  });
});

describe("filterPostsByPlatform", () => {
  const posts = [
    { id: "a", platform: "linkedin" as const },
    { id: "b", platform: "youtube" as const },
    { id: "c", platform: "linkedin" as const },
  ];

  it("returns every post, in order, when no platform is selected", () => {
    expect(filterPostsByPlatform(posts, null).map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("returns a copy rather than the input array", () => {
    expect(filterPostsByPlatform(posts, null)).not.toBe(posts);
  });

  it("keeps only the selected platform's posts", () => {
    expect(filterPostsByPlatform(posts, "linkedin").map((p) => p.id)).toEqual(["a", "c"]);
    expect(filterPostsByPlatform(posts, "youtube").map((p) => p.id)).toEqual(["b"]);
  });
});

describe("isInOtherLanguage", () => {
  it("is false for the same tag", () => {
    expect(isInOtherLanguage("pt-BR", "pt-BR")).toBe(false);
  });

  it("compares primary subtags only, case-insensitively", () => {
    expect(isInOtherLanguage("pt-BR", "pt")).toBe(false);
    expect(isInOtherLanguage("PT-br", "pt-PT")).toBe(false);
  });

  it("is true for a different language", () => {
    expect(isInOtherLanguage("pt-BR", "en")).toBe(true);
    expect(isInOtherLanguage("pt-BR", "es")).toBe(true);
    expect(isInOtherLanguage("en", "pt-BR")).toBe(true);
  });
});

describe("getLanguageName", () => {
  it("names the primary language in the page's locale", () => {
    expect(getLanguageName("pt-BR", "en")).toBe("Portuguese");
    expect(getLanguageName("pt-BR", "es")).toBe("portugués");
    expect(getLanguageName("en", "pt-BR")).toBe("inglês");
  });

  it("falls back to the raw tag when the runtime has no name for it", () => {
    expect(getLanguageName("zz-ZZ", "en")).toBe("zz-ZZ");
  });
});

describe("formatPostDate", () => {
  it("formats as short month and year in the page's locale", () => {
    expect(formatPostDate("2026-09-13", "en")).toBe("Sep 2026");
    expect(formatPostDate("2026-09-13", "es")).toBe("sept 2026");
    expect(formatPostDate("2026-09-13", "pt-BR")).toBe("set. de 2026");
  });

  it("stays on the first of the month instead of drifting into the previous one", () => {
    expect(formatPostDate("2026-08-01", "en")).toBe("Aug 2026");
    expect(formatPostDate("2024-01-01", "en")).toBe("Jan 2024");
  });

  it("returns the input unchanged when it isn't a date", () => {
    expect(formatPostDate("not a date", "en")).toBe("not a date");
  });
});
