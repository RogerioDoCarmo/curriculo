/**
 * Unit tests for the project deep-link URL helpers.
 *
 * Assertions are literal strings rather than expressions built from the module's
 * own exports, so mutations to the source can't make the expectation move with
 * it (this module is inside Stryker's `lib/**` mutate scope).
 */

import {
  PROJECT_QUERY_PARAM,
  PROJECTS_SECTION_ID,
  TECH_QUERY_PARAM,
  buildProjectHistoryUrl,
  buildProjectShareUrl,
  buildProjectsPageShareUrl,
  getProjectsPagePath,
  readProjectParam,
  readTechParam,
  withProjectParam,
  withTechParam,
} from "@/lib/project-deep-link";

describe("project-deep-link", () => {
  describe("constants", () => {
    it("names the query param 'project'", () => {
      expect(PROJECT_QUERY_PARAM).toBe("project");
    });

    it("targets the 'projects' section id", () => {
      expect(PROJECTS_SECTION_ID).toBe("projects");
    });
  });

  describe("readProjectParam", () => {
    it("reads the id from a search string", () => {
      expect(readProjectParam("?project=miroji")).toBe("miroji");
    });

    it("reads the id without a leading question mark", () => {
      expect(readProjectParam("project=miroji")).toBe("miroji");
    });

    it("picks the param out from among other params", () => {
      expect(readProjectParam("?utm=news&project=inct-gnss-app&ref=x")).toBe("inct-gnss-app");
    });

    it("decodes a percent-encoded value", () => {
      expect(readProjectParam("?project=a%20b")).toBe("a b");
    });

    it("returns null when the param is absent", () => {
      expect(readProjectParam("?utm=news")).toBeNull();
    });

    it("returns null for an empty search string", () => {
      expect(readProjectParam("")).toBeNull();
    });

    it("returns null for a bare question mark", () => {
      expect(readProjectParam("?")).toBeNull();
    });

    it("returns null when the param is present but empty", () => {
      expect(readProjectParam("?project=")).toBeNull();
    });
  });

  describe("withProjectParam", () => {
    it("adds the param to an empty search string", () => {
      expect(withProjectParam("", "miroji")).toBe("?project=miroji");
    });

    it("replaces an existing value", () => {
      expect(withProjectParam("?project=android-study-app", "miroji")).toBe("?project=miroji");
    });

    it("preserves unrelated params when adding", () => {
      expect(withProjectParam("?utm=news", "miroji")).toBe("?utm=news&project=miroji");
    });

    it("removes the param when the id is null", () => {
      expect(withProjectParam("?project=miroji", null)).toBe("");
    });

    it("removes the param when the id is an empty string", () => {
      expect(withProjectParam("?project=miroji", "")).toBe("");
    });

    it("preserves unrelated params when removing", () => {
      expect(withProjectParam("?utm=news&project=miroji", null)).toBe("?utm=news");
    });

    it("returns an empty string rather than a dangling question mark", () => {
      expect(withProjectParam("", null)).toBe("");
    });

    it("encodes a value that needs escaping", () => {
      expect(withProjectParam("", "a b")).toBe("?project=a+b");
    });
  });

  describe("buildProjectHistoryUrl", () => {
    it("builds a same-page URL carrying the param and the section hash", () => {
      expect(buildProjectHistoryUrl({ pathname: "/en/", search: "", projectId: "miroji" })).toBe(
        "/en/?project=miroji#projects"
      );
    });

    it("drops the param but keeps the hash when nothing is open", () => {
      expect(
        buildProjectHistoryUrl({ pathname: "/en/", search: "?project=miroji", projectId: null })
      ).toBe("/en/#projects");
    });

    it("keeps unrelated params", () => {
      expect(
        buildProjectHistoryUrl({
          pathname: "/pt-BR/",
          search: "?utm=news",
          projectId: "android-study-app",
        })
      ).toBe("/pt-BR/?utm=news&project=android-study-app#projects");
    });

    it("uses the pathname it is given", () => {
      expect(buildProjectHistoryUrl({ pathname: "/es/", search: "", projectId: "miroji" })).toBe(
        "/es/?project=miroji#projects"
      );
    });
  });

  describe("buildProjectShareUrl", () => {
    it("builds an absolute, shareable link", () => {
      expect(
        buildProjectShareUrl({
          origin: "https://rogeriodocarmo.dev",
          locale: "en",
          projectId: "miroji",
        })
      ).toBe("https://rogeriodocarmo.dev/en/?project=miroji#projects");
    });

    it("uses the locale it is given", () => {
      expect(
        buildProjectShareUrl({
          origin: "https://example.dev",
          locale: "pt-BR",
          projectId: "miroji",
        })
      ).toBe("https://example.dev/pt-BR/?project=miroji#projects");
    });

    it("does not double the slash when the origin ends in one", () => {
      expect(
        buildProjectShareUrl({ origin: "https://example.dev/", locale: "es", projectId: "miroji" })
      ).toBe("https://example.dev/es/?project=miroji#projects");
    });

    it("collapses several trailing slashes on the origin", () => {
      expect(
        buildProjectShareUrl({
          origin: "https://example.dev///",
          locale: "en",
          projectId: "miroji",
        })
      ).toBe("https://example.dev/en/?project=miroji#projects");
    });

    it("percent-encodes an id that needs it", () => {
      expect(
        buildProjectShareUrl({ origin: "https://example.dev", locale: "en", projectId: "a b" })
      ).toBe("https://example.dev/en/?project=a%20b#projects");
    });

    it("strips only the trailing run of slashes, leaving the path intact", () => {
      expect(
        buildProjectShareUrl({
          origin: "https://example.dev/app///",
          locale: "en",
          projectId: "miroji",
        })
      ).toBe("https://example.dev/app/en/?project=miroji#projects");
    });

    it("reduces an origin that is nothing but slashes to an empty base", () => {
      expect(buildProjectShareUrl({ origin: "///", locale: "en", projectId: "miroji" })).toBe(
        "/en/?project=miroji#projects"
      );
    });

    it("leaves an empty origin empty", () => {
      expect(buildProjectShareUrl({ origin: "", locale: "en", projectId: "miroji" })).toBe(
        "/en/?project=miroji#projects"
      );
    });
  });
});

describe("project-deep-link — the projects page", () => {
  describe("buildProjectHistoryUrl hash option", () => {
    it("ends on the projects hash by default (the home page section)", () => {
      expect(buildProjectHistoryUrl({ pathname: "/en/", search: "", projectId: "miroji" })).toBe(
        "/en/?project=miroji#projects"
      );
    });

    it("uses a hash that is given", () => {
      expect(
        buildProjectHistoryUrl({ pathname: "/en/", search: "", projectId: "miroji", hash: "x" })
      ).toBe("/en/?project=miroji#x");
    });

    it("adds no hash at all for null (the projects page has no section)", () => {
      expect(
        buildProjectHistoryUrl({
          pathname: "/en/projects/",
          search: "",
          projectId: "miroji",
          hash: null,
        })
      ).toBe("/en/projects/?project=miroji");
    });

    it("closes cleanly on the page: no dangling question mark, no hash", () => {
      expect(
        buildProjectHistoryUrl({
          pathname: "/en/projects/",
          search: "?project=miroji",
          projectId: null,
          hash: null,
        })
      ).toBe("/en/projects/");
    });

    it("keeps the technology filter while a project opens or closes", () => {
      expect(
        buildProjectHistoryUrl({
          pathname: "/en/projects/",
          search: "?tech=Kotlin",
          projectId: "miroji",
          hash: null,
        })
      ).toBe("/en/projects/?tech=Kotlin&project=miroji");
      expect(
        buildProjectHistoryUrl({
          pathname: "/en/projects/",
          search: "?tech=Kotlin&project=miroji",
          projectId: null,
          hash: null,
        })
      ).toBe("/en/projects/?tech=Kotlin");
    });
  });

  describe("technology param", () => {
    it("is named 'tech'", () => {
      expect(TECH_QUERY_PARAM).toBe("tech");
    });

    it.each([
      ["?tech=Kotlin", "Kotlin"],
      ["?project=miroji&tech=Expo%20SDK%2057", "Expo SDK 57"],
      ["?tech=GNSS%2FGPS", "GNSS/GPS"],
    ])("reads %s as %p", (search, expected) => {
      expect(readTechParam(search)).toBe(expected);
    });

    it.each(["", "?", "?tech=", "?project=miroji"])("reads %p as null", (search) => {
      expect(readTechParam(search)).toBeNull();
    });

    it("writes a technology, encoding spaces and slashes", () => {
      expect(withTechParam("", "Kotlin")).toBe("?tech=Kotlin");
      expect(withTechParam("", "Expo SDK 57")).toBe("?tech=Expo+SDK+57");
      expect(withTechParam("", "GNSS/GPS")).toBe("?tech=GNSS%2FGPS");
    });

    it("replaces an existing value and keeps other params", () => {
      expect(withTechParam("?tech=Java&project=miroji", "Kotlin")).toBe(
        "?tech=Kotlin&project=miroji"
      );
    });

    it("removes the param for null or an empty string, leaving the rest", () => {
      expect(withTechParam("?tech=Java", null)).toBe("");
      expect(withTechParam("?tech=Java&project=miroji", "")).toBe("?project=miroji");
    });

    it("round-trips through readTechParam", () => {
      expect(readTechParam(withTechParam("", "Expo SDK 57"))).toBe("Expo SDK 57");
    });
  });

  describe("getProjectsPagePath", () => {
    it.each([
      ["en", "/en/projects/"],
      ["pt-BR", "/pt-BR/projects/"],
      ["es", "/es/projects/"],
    ])("builds the path for %s, with a trailing slash", (locale, expected) => {
      expect(getProjectsPagePath(locale)).toBe(expected);
    });
  });

  describe("buildProjectsPageShareUrl", () => {
    it("builds an absolute link to the project on the projects page", () => {
      expect(
        buildProjectsPageShareUrl({
          origin: "https://rogeriodocarmo.com",
          locale: "en",
          projectId: "omnimorse",
        })
      ).toBe("https://rogeriodocarmo.com/en/projects/?project=omnimorse");
    });

    it("uses the locale, tolerates trailing slashes and percent-encodes the id", () => {
      expect(
        buildProjectsPageShareUrl({
          origin: "http://localhost:3000///",
          locale: "pt-BR",
          projectId: "a b",
        })
      ).toBe("http://localhost:3000/pt-BR/projects/?project=a%20b");
    });

    it("round-trips through readProjectParam", () => {
      const url = buildProjectsPageShareUrl({
        origin: "https://x.dev",
        locale: "en",
        projectId: "a b&c/é",
      });
      expect(readProjectParam(new URL(url).search)).toBe("a b&c/é");
    });
  });
});
