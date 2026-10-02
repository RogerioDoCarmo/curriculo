/**
 * Unit tests for lib/post-deep-link.ts — URL helpers for the posts deep links.
 *
 * Assertions use literal expected values (never values re-derived from the
 * module under test) so they hold up under mutation testing.
 */

import {
  PLATFORM_QUERY_PARAM,
  POST_QUERY_PARAM,
  buildPostHistoryUrl,
  buildPostShareUrl,
  getPostsPagePath,
  readPlatformParam,
  readPostParam,
  withPlatformParam,
  withPostParam,
} from "@/lib/post-deep-link";

describe("constants", () => {
  it("names the query params", () => {
    expect(POST_QUERY_PARAM).toBe("post");
    expect(PLATFORM_QUERY_PARAM).toBe("platform");
  });
});

describe("readPostParam", () => {
  it("reads the post id", () => {
    expect(readPostParam("?post=ai-agents")).toBe("ai-agents");
  });

  it("finds it among other params", () => {
    expect(readPostParam("?platform=youtube&post=demo&x=1")).toBe("demo");
  });

  it("decodes percent-encoding", () => {
    expect(readPostParam("?post=a%20b")).toBe("a b");
  });

  it.each(["", "?", "?post=", "?platform=youtube", "?project=miroji"])(
    "returns null for %p",
    (search) => {
      expect(readPostParam(search)).toBeNull();
    }
  );
});

describe("readPlatformParam", () => {
  it.each(["linkedin", "youtube"])("reads %s", (platform) => {
    expect(readPlatformParam(`?platform=${platform}`)).toBe(platform);
  });

  it.each([
    ["absent", ""],
    ["empty", "?platform="],
    ["unknown", "?platform=myspace"],
    ["wrong case", "?platform=LinkedIn"],
    ["another param only", "?post=linkedin"],
  ])("returns null when the platform is %s", (_label, search) => {
    expect(readPlatformParam(search)).toBeNull();
  });
});

describe("withPostParam", () => {
  it("adds the param to an empty search", () => {
    expect(withPostParam("", "ai-agents")).toBe("?post=ai-agents");
  });

  it("replaces an existing value", () => {
    expect(withPostParam("?post=old", "new")).toBe("?post=new");
  });

  it("keeps unrelated params", () => {
    expect(withPostParam("?platform=youtube", "demo")).toBe("?platform=youtube&post=demo");
  });

  it("encodes the id", () => {
    expect(withPostParam("", "a b&c")).toBe("?post=a+b%26c");
  });

  it("removes the param for null, leaving a clean empty string", () => {
    expect(withPostParam("?post=demo", null)).toBe("");
  });

  it("removes the param for an empty id, keeping the others", () => {
    expect(withPostParam("?post=demo&platform=youtube", "")).toBe("?platform=youtube");
  });

  it("is a no-op removal when the param was never there", () => {
    expect(withPostParam("?platform=youtube", null)).toBe("?platform=youtube");
  });
});

describe("withPlatformParam", () => {
  it("adds the platform", () => {
    expect(withPlatformParam("", "linkedin")).toBe("?platform=linkedin");
  });

  it("keeps an open post in the URL", () => {
    expect(withPlatformParam("?post=demo", "youtube")).toBe("?post=demo&platform=youtube");
  });

  it("removes the platform for null, keeping the rest", () => {
    expect(withPlatformParam("?post=demo&platform=youtube", null)).toBe("?post=demo");
    expect(withPlatformParam("?platform=youtube", null)).toBe("");
  });
});

describe("buildPostHistoryUrl", () => {
  it("keeps the path and appends the post", () => {
    expect(buildPostHistoryUrl({ pathname: "/en/posts/", search: "", postId: "demo" })).toBe(
      "/en/posts/?post=demo"
    );
  });

  it("appends the hash when one is given", () => {
    expect(
      buildPostHistoryUrl({ pathname: "/en/", search: "", postId: "demo", hash: "posts" })
    ).toBe("/en/?post=demo#posts");
  });

  it("keeps the hash on close, with no dangling question mark", () => {
    expect(
      buildPostHistoryUrl({ pathname: "/en/", search: "?post=demo", postId: null, hash: "posts" })
    ).toBe("/en/#posts");
  });

  it("adds no hash when none is given", () => {
    expect(
      buildPostHistoryUrl({ pathname: "/en/posts/", search: "?post=demo", postId: null })
    ).toBe("/en/posts/");
  });

  it("treats an empty hash as none", () => {
    expect(buildPostHistoryUrl({ pathname: "/en/", search: "", postId: "demo", hash: "" })).toBe(
      "/en/?post=demo"
    );
  });

  it("keeps unrelated params such as the platform filter", () => {
    expect(
      buildPostHistoryUrl({ pathname: "/en/posts/", search: "?platform=youtube", postId: "demo" })
    ).toBe("/en/posts/?platform=youtube&post=demo");
  });
});

describe("getPostsPagePath", () => {
  it.each([
    ["en", "/en/posts/"],
    ["pt-BR", "/pt-BR/posts/"],
    ["es", "/es/posts/"],
  ])("builds the path for %s, with a trailing slash", (locale, expected) => {
    expect(getPostsPagePath(locale)).toBe(expected);
  });
});

describe("buildPostShareUrl", () => {
  it("builds an absolute link to the post on the posts page", () => {
    expect(
      buildPostShareUrl({ origin: "https://rogeriodocarmo.com", locale: "en", postId: "demo" })
    ).toBe("https://rogeriodocarmo.com/en/posts/?post=demo");
  });

  it("uses the locale in the path", () => {
    expect(
      buildPostShareUrl({ origin: "https://rogeriodocarmo.com", locale: "pt-BR", postId: "demo" })
    ).toBe("https://rogeriodocarmo.com/pt-BR/posts/?post=demo");
  });

  it("tolerates trailing slashes on the origin", () => {
    expect(
      buildPostShareUrl({ origin: "http://localhost:3000///", locale: "es", postId: "x" })
    ).toBe("http://localhost:3000/es/posts/?post=x");
  });

  it("percent-encodes the id", () => {
    expect(buildPostShareUrl({ origin: "https://x.dev", locale: "en", postId: "a b&c" })).toBe(
      "https://x.dev/en/posts/?post=a%20b%26c"
    );
  });

  it("round-trips through readPostParam", () => {
    const url = buildPostShareUrl({ origin: "https://x.dev", locale: "en", postId: "a b&c/é" });
    expect(readPostParam(new URL(url).search)).toBe("a b&c/é");
  });
});
