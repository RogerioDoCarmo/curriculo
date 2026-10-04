import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getProjects, getPosts, getExperiences, getSkills } from "@/lib/content";
import { getYouTubeVideoId } from "@/lib/posts";

describe("Content Management System", () => {
  describe("getProjects", () => {
    it("should return array of projects", async () => {
      const projects = await getProjects();

      expect(Array.isArray(projects)).toBe(true);
    });

    it("should parse project frontmatter correctly", async () => {
      const projects = await getProjects();

      if (projects.length > 0) {
        const project = projects[0];
        expect(project).toHaveProperty("id");
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("technologies");
        expect(Array.isArray(project.technologies)).toBe(true);
      }
    });

    it("should include featured flag", async () => {
      const projects = await getProjects();

      if (projects.length > 0) {
        const project = projects[0];
        expect(project).toHaveProperty("featured");
        expect(typeof project.featured).toBe("boolean");
      }
    });

    it("should parse date field", async () => {
      const projects = await getProjects();

      if (projects.length > 0) {
        const project = projects[0];
        expect(project).toHaveProperty("date");
      }
    });

    it("exposes the same project ids in every supported locale", async () => {
      const [ptBR, en, es] = await Promise.all([
        getProjects("pt-BR"),
        getProjects("en"),
        getProjects("es"),
      ]);

      const ids = (list: Awaited<ReturnType<typeof getProjects>>) =>
        list.map((project) => project.id).toSorted((a, b) => a.localeCompare(b));

      expect(ptBR.length).toBeGreaterThan(0);
      expect(ids(en)).toEqual(ids(ptBR));
      expect(ids(es)).toEqual(ids(ptBR));
    });

    it("returns locale-specific project copy for each supported locale", async () => {
      const [ptBR, en, es] = await Promise.all([
        getProjects("pt-BR"),
        getProjects("en"),
        getProjects("es"),
      ]);

      const descriptionFor = (list: Awaited<ReturnType<typeof getProjects>>, id: string): string =>
        list.find((project) => project.id === id)?.description ?? "";

      // Same project, three distinct translations of the same field.
      const translations = [
        descriptionFor(ptBR, "miroji"),
        descriptionFor(en, "miroji"),
        descriptionFor(es, "miroji"),
      ];
      translations.forEach((description) => expect(description).not.toBe(""));
      expect(new Set(translations).size).toBe(3);
    });
  });

  describe("getExperiences", () => {
    it("should return professional experiences", async () => {
      const experiences = await getExperiences("professional");

      expect(Array.isArray(experiences)).toBe(true);
    });

    it("should return academic experiences", async () => {
      const experiences = await getExperiences("academic");

      expect(Array.isArray(experiences)).toBe(true);
    });

    it("should parse experience frontmatter correctly", async () => {
      const experiences = await getExperiences("professional");

      if (experiences.length > 0) {
        const exp = experiences[0];
        expect(exp).toHaveProperty("id");
        expect(exp).toHaveProperty("type");
        expect(exp).toHaveProperty("organization");
        expect(exp).toHaveProperty("role");
        expect(exp).toHaveProperty("location");
        expect(exp).toHaveProperty("startDate");
        expect(exp).toHaveProperty("description");
        expect(exp).toHaveProperty("achievements");
        expect(Array.isArray(exp.achievements)).toBe(true);
      }
    });

    it("should filter by experience type", async () => {
      const professional = await getExperiences("professional");
      const academic = await getExperiences("academic");

      professional.forEach((exp) => {
        expect(exp.type).toBe("professional");
      });

      academic.forEach((exp) => {
        expect(exp.type).toBe("academic");
      });
    });

    it("should handle optional endDate field", async () => {
      const experiences = await getExperiences("professional");

      if (experiences.length > 0) {
        const exp = experiences[0];
        // endDate is optional - just check it exists as a property
        expect("endDate" in exp).toBe(true);
      }
    });

    it("should handle optional technologies field", async () => {
      const experiences = await getExperiences("professional");

      if (experiences.length > 0) {
        const exp = experiences[0];
        // technologies is optional
        if (exp.technologies) {
          expect(Array.isArray(exp.technologies)).toBe(true);
        }
      }
    });
  });

  describe("getSkills", () => {
    it("should return array of skill categories", async () => {
      const skills = await getSkills();

      expect(Array.isArray(skills)).toBe(true);
    });

    it("should parse skill categories correctly", async () => {
      const skills = await getSkills();

      if (skills.length > 0) {
        const category = skills[0];
        expect(category).toHaveProperty("category");
        expect(category).toHaveProperty("skills");
        expect(Array.isArray(category.skills)).toBe(true);
      }
    });

    it("should parse individual skills correctly", async () => {
      const skills = await getSkills();

      if (skills.length > 0 && skills[0].skills.length > 0) {
        const skill = skills[0].skills[0];
        expect(skill).toHaveProperty("name");
        expect(typeof skill.name).toBe("string");
      }
    });

    it("should handle optional skill level", async () => {
      const skills = await getSkills();

      if (skills.length > 0 && skills[0].skills.length > 0) {
        const skill = skills[0].skills[0];
        // level is optional
        if (skill.level) {
          expect(["beginner", "intermediate", "advanced", "expert"]).toContain(skill.level);
        }
      }
    });

    it("should handle optional years of experience", async () => {
      const skills = await getSkills();

      if (skills.length > 0 && skills[0].skills.length > 0) {
        const skill = skills[0].skills[0];
        // yearsOfExperience is optional
        if (skill.yearsOfExperience !== undefined) {
          expect(typeof skill.yearsOfExperience).toBe("number");
        }
      }
    });
  });

  describe("Error handling", () => {
    it("should handle missing content directory gracefully", async () => {
      // This should not throw - it should return empty arrays
      await expect(getProjects(undefined, "nonexistent-dir")).resolves.toEqual([]);
    });

    it("should handle invalid markdown files gracefully", async () => {
      // The function should handle malformed files without crashing
      const projects = await getProjects();
      expect(Array.isArray(projects)).toBe(true);
    });
  });

  describe("Parsing branches (temp fixtures)", () => {
    const tmpDirs: string[] = [];
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
    let warnSpy: jest.SpyInstance;

    // NODE_ENV is typed read-only; cast to assign it for the dev-only branches.
    const setNodeEnv = (value: string | undefined): void => {
      (process.env as Record<string, string | undefined>).NODE_ENV = value;
    };

    const makeContentDir = (): string => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
      tmpDirs.push(dir);
      return dir;
    };

    const write = (dir: string, rel: string, body: string): void => {
      const full = path.join(dir, rel);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, body);
    };

    beforeEach(() => {
      warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
      setNodeEnv(ORIGINAL_NODE_ENV);
    });

    afterAll(() => {
      tmpDirs.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true }));
    });

    it("parses a valid project and sorts multiple projects by date (newest first)", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/old.md",
        `---\nid: old\ntitle: Old\ndescription: d\ndate: "2020-01-01"\ntechnologies: [React]\nfeatured: false\n---\nBody`
      );
      write(
        dir,
        "projects/pt-BR/new.md",
        `---\nid: new\ntitle: New\ndescription: d\ndate: "2024-01-01"\ntechnologies: [Next.js]\nimages: [a.png]\nfeatured: true\nliveUrl: https://x.dev\nrepoUrl: https://github.com/x\n---\nBody`
      );
      const projects = await getProjects(undefined, dir);
      expect(projects.map((p) => p.id)).toEqual(["new", "old"]);
      expect(projects[0].technologies).toEqual(["Next.js"]);
      expect(projects[0].featured).toBe(true);
    });

    it("parses the optional videoUrl and leaves it undefined when absent", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/with.md",
        `---
id: with
title: T
description: d
date: "2024-02-01"
videoUrl: https://youtu.be/CcyTyHB7n_M
---
Body`
      );
      write(
        dir,
        "projects/pt-BR/without.md",
        `---
id: without
title: T
description: d
date: "2024-01-01"
---
Body`
      );
      const projects = await getProjects(undefined, dir);
      expect(projects.map((p) => [p.id, p.videoUrl])).toEqual([
        ["with", "https://youtu.be/CcyTyHB7n_M"],
        ["without", undefined],
      ]);
    });

    it("falls back to empty array when project frontmatter fields are not arrays", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/p.md",
        `---\nid: p\ntitle: T\ndescription: d\ndate: 2024-01-01\ntechnologies: notalist\n---\nBody`
      );
      const [project] = await getProjects(undefined, dir);
      expect(project.technologies).toEqual([]);
      expect(project.images).toEqual([]);
    });

    it("rethrows validation errors for projects missing a required field", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/bad.md",
        `---\nid: x\ndescription: no title\ndate: 2024-01-01\n---\n`
      );
      await expect(getProjects(undefined, dir)).rejects.toThrow(/Content validation error/);
    });

    it("skips malformed project files and warns in development", async () => {
      setNodeEnv("development");
      const dir = makeContentDir();
      // A directory named "*.md" is listed but readFileSync throws EISDIR — a
      // non-validation error, exercising the skip-and-warn branch.
      fs.mkdirSync(path.join(dir, "projects", "pt-BR", "broken.md"), { recursive: true });
      const projects = await getProjects(undefined, dir);
      expect(projects).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("warns when the projects directory is missing in development", async () => {
      setNodeEnv("development");
      const dir = makeContentDir(); // exists, but has no projects/ subdir
      await expect(getProjects(undefined, dir)).resolves.toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("parses experiences, splits achievements, and filters by type", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "experience/pt-BR/job.md",
        `---\nid: job\ntype: professional\norganization: Org\nrole: Dev\nlocation: Remote\nstartDate: 2022-01-01\nendDate: 2023-01-01\ntechnologies: [React Native]\n---\nIntro\n\n### Conquistas\n- Did a thing\n- Did another`
      );
      write(
        dir,
        "experience/pt-BR/school.md",
        `---\nid: school\ntype: academic\norganization: Uni\nrole: Student\nlocation: City\nstartDate: 2018-01-01\n---\nStudied`
      );
      const all = await getExperiences(undefined, "pt-BR", dir);
      expect(all).toHaveLength(2);

      const professional = await getExperiences("professional", "pt-BR", dir);
      expect(professional).toHaveLength(1);
      expect(professional[0].achievements).toEqual(["Did a thing", "Did another"]);
    });

    it("falls back to the root experience directory when the locale folder is absent", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "experience/job.md",
        `---\nid: job\ntype: professional\norganization: Org\nrole: Dev\nlocation: Remote\nstartDate: 2022-01-01\n---\nBody`
      );
      const experiences = await getExperiences(undefined, "fr-FR", dir);
      expect(experiences).toHaveLength(1);
    });

    it("rethrows validation errors for an invalid experience type", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "experience/pt-BR/bad.md",
        `---\nid: bad\ntype: invalid\norganization: Org\nrole: Dev\nlocation: Remote\nstartDate: 2022-01-01\n---\nBody`
      );
      await expect(getExperiences(undefined, "pt-BR", dir)).rejects.toThrow(
        /Content validation error/
      );
    });

    it("warns when the experience directory is missing in development", async () => {
      setNodeEnv("development");
      const experiences = await getExperiences(undefined, "pt-BR", "nonexistent-dir");
      expect(experiences).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("leaves longDescription undefined when a project has an empty body", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/empty.md",
        `---\nid: e\ntitle: T\ndescription: d\ndate: "2024-01-01"\n---\n`
      );
      const [project] = await getProjects(undefined, dir);
      expect(project.longDescription).toBeUndefined();
    });

    it("skips malformed experience files and warns in development", async () => {
      setNodeEnv("development");
      const dir = makeContentDir();
      // A directory named "*.md" is listed but readFileSync throws EISDIR — a
      // non-validation error, exercising the skip-and-warn branch.
      fs.mkdirSync(path.join(dir, "experience", "pt-BR", "broken.md"), { recursive: true });
      const experiences = await getExperiences(undefined, "pt-BR", dir);
      expect(experiences).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("returns parsed skill categories and warns/throws on bad input", async () => {
      // Missing skills file in development → warn + empty array
      setNodeEnv("development");
      const emptyDir = makeContentDir();
      await expect(getSkills(undefined, emptyDir)).resolves.toEqual([]);
      expect(warnSpy).toHaveBeenCalled();

      // categories not an array → validation error
      const badDir = makeContentDir();
      write(badDir, "skills.md", `---\ncategories: nope\n---\n`);
      await expect(getSkills(undefined, badDir)).rejects.toThrow(/Content validation error/);

      // valid categories → returned as-is
      const goodDir = makeContentDir();
      write(
        goodDir,
        "skills.md",
        `---\ncategories:\n  - category: Frontend\n    skills:\n      - name: React\n---\n`
      );
      const skills = await getSkills(undefined, goodDir);
      expect(skills).toHaveLength(1);
      expect(skills[0].category).toBe("Frontend");
    });

    it("treats a file with no frontmatter delimiter as empty data (validation error)", async () => {
      const dir = makeContentDir();
      // No leading `---`, so parseFrontmatter returns data: {} and the whole
      // file as content; the missing `id` then trips required-field validation.
      write(dir, "projects/pt-BR/plain.md", `Just a plain body with no frontmatter.\n`);
      await expect(getProjects(undefined, dir)).rejects.toThrow(/Content validation error/);
    });

    it("reads projects from the requested locale directory", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/app.md",
        `---\nid: app\ntitle: Aplicativo\ndescription: Descrição\ndate: "2024-01-01"\n---\nCorpo`
      );
      write(
        dir,
        "projects/en/app.md",
        `---\nid: app\ntitle: Application\ndescription: Description\ndate: "2024-01-01"\n---\nBody`
      );

      const [english] = await getProjects("en", dir);
      expect(english.title).toBe("Application");
      expect(english.longDescription).toBe("Body");
    });

    it("defaults to the pt-BR locale directory when no locale is given", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/app.md",
        `---\nid: app\ntitle: Aplicativo\ndescription: Descrição\ndate: "2024-01-01"\n---\nCorpo`
      );
      write(
        dir,
        "projects/en/app.md",
        `---\nid: app\ntitle: Application\ndescription: Description\ndate: "2024-01-01"\n---\nBody`
      );

      const [defaulted] = await getProjects(undefined, dir);
      expect(defaulted.title).toBe("Aplicativo");
    });

    it("falls back to the pt-BR directory when the requested locale is absent", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/app.md",
        `---\nid: app\ntitle: Aplicativo\ndescription: Descrição\ndate: "2024-01-01"\n---\nCorpo`
      );

      const [fallback] = await getProjects("fr-FR", dir);
      expect(fallback.title).toBe("Aplicativo");
    });

    it("falls back to the legacy flat projects directory when no locale folder exists", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/legacy.md",
        `---\nid: legacy\ntitle: Legacy\ndescription: d\ndate: "2024-01-01"\n---\nBody`
      );

      const [legacy] = await getProjects("en", dir);
      expect(legacy.title).toBe("Legacy");
    });

    it("parses the optional store URLs of a project", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/stores.md",
        `---\nid: stores\ntitle: T\ndescription: d\ndate: "2024-01-01"\nappStoreUrl: https://apps.apple.com/us/app/miroji/id6774924907\nplayStoreUrl: https://play.google.com/store/apps/details?id=com.rogeriodocarmo.miroji\nfdroidUrl: https://f-droid.org/pt/packages/com.rogeriodocarmo.miroji\n---\nBody`
      );
      const [withStores] = await getProjects(undefined, dir);
      expect(withStores.appStoreUrl).toBe("https://apps.apple.com/us/app/miroji/id6774924907");
      expect(withStores.playStoreUrl).toBe(
        "https://play.google.com/store/apps/details?id=com.rogeriodocarmo.miroji"
      );
      expect(withStores.fdroidUrl).toBe(
        "https://f-droid.org/pt/packages/com.rogeriodocarmo.miroji"
      );
    });

    it("leaves the store URLs undefined when a project omits them", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/pt-BR/nostores.md",
        `---\nid: nostores\ntitle: T\ndescription: d\ndate: "2024-01-01"\n---\nBody`
      );
      const [withoutStores] = await getProjects(undefined, dir);
      expect(withoutStores.appStoreUrl).toBeUndefined();
      expect(withoutStores.playStoreUrl).toBeUndefined();
      expect(withoutStores.fdroidUrl).toBeUndefined();
    });

    it("treats an unterminated frontmatter block as empty data (validation error)", async () => {
      const dir = makeContentDir();
      // Opening `---` but no closing delimiter → parseFrontmatter returns
      // data: {} and the original string as content.
      write(
        dir,
        "projects/pt-BR/unterminated.md",
        `---\nid: x\ntitle: T\nno closing delimiter here`
      );
      await expect(getProjects(undefined, dir)).rejects.toThrow(/Content validation error/);
    });

    describe("getPosts", () => {
      const POST_FRONTMATTER = [
        "id: deep-links",
        "platform: linkedin",
        "kind: article",
        "title: Deep links",
        "description: A deep dive",
        'url: "https://www.linkedin.com/pulse/deep-links"',
        "language: pt-BR",
        'date: "2026-09-13"',
      ];

      /** A valid post file, with `overrides` replacing or (when null) removing lines by key. */
      const postFile = (overrides: Record<string, string | null> = {}, body = "Body"): string => {
        const lines = POST_FRONTMATTER.filter((line) => !(line.split(":")[0] in overrides));
        for (const [key, value] of Object.entries(overrides)) {
          if (value !== null) lines.push(`${key}: ${value}`);
        }
        return `---\n${lines.join("\n")}\n---\n${body}`;
      };

      it("parses every field of a valid post", async () => {
        const dir = makeContentDir();
        write(
          dir,
          "posts/en/deep-links.md",
          postFile({ image: "/images/posts/cover.webp", featured: "true" }, "\n  Long body  \n")
        );

        await expect(getPosts("en", dir)).resolves.toEqual([
          {
            id: "deep-links",
            platform: "linkedin",
            kind: "article",
            title: "Deep links",
            description: "A deep dive",
            longDescription: "Long body",
            url: "https://www.linkedin.com/pulse/deep-links",
            image: "/images/posts/cover.webp",
            language: "pt-BR",
            featured: true,
            date: "2026-09-13",
          },
        ]);
      });

      it("defaults the optional fields", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/p.md", postFile({}, "   "));

        const [post] = await getPosts(undefined, dir);
        expect(post.image).toBeUndefined();
        expect(post.longDescription).toBeUndefined();
        expect(post.featured).toBe(false);
      });

      it("sorts posts newest first", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/a.md", postFile({ id: "old", date: '"2024-06-27"' }));
        write(dir, "posts/pt-BR/b.md", postFile({ id: "new", date: '"2026-09-13"' }));
        write(dir, "posts/pt-BR/c.md", postFile({ id: "mid", date: '"2026-06-28"' }));

        const posts = await getPosts(undefined, dir);
        expect(posts.map((p) => p.id)).toEqual(["new", "mid", "old"]);
      });

      it("reads the requested locale, falling back to pt-BR", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/p.md", postFile({ title: "Em português" }));
        write(dir, "posts/en/p.md", postFile({ title: "In English" }));

        expect((await getPosts("en", dir))[0].title).toBe("In English");
        expect((await getPosts("fr-FR", dir))[0].title).toBe("Em português");
      });

      it("returns an empty list, silently, when there is no posts directory outside development", async () => {
        setNodeEnv("production");
        const dir = makeContentDir();

        await expect(getPosts("en", dir)).resolves.toEqual([]);
        expect(warnSpy).not.toHaveBeenCalled();
      });

      it("labels the missing-directory warning with the content type", async () => {
        setNodeEnv("development");
        const dir = makeContentDir();

        await getProjects("en", dir);

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining("[content] Projects directory not found:")
        );
      });

      it("skips a malformed file silently outside development", async () => {
        setNodeEnv("production");
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/good.md", postFile());
        write(dir, "posts/pt-BR/bad.md", "---\nid: [unclosed\n---\nBody");

        expect((await getPosts(undefined, dir)).map((p) => p.id)).toEqual(["deep-links"]);
        expect(warnSpy).not.toHaveBeenCalled();
      });

      it("warns about a missing posts directory in development", async () => {
        setNodeEnv("development");
        const dir = makeContentDir();

        await getPosts("en", dir);

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining("[content] Posts directory not found:")
        );
      });

      it("ignores files that aren't markdown", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/p.md", postFile());
        write(dir, "posts/pt-BR/notes.txt", postFile({ id: "txt" }));

        expect((await getPosts(undefined, dir)).map((p) => p.id)).toEqual(["deep-links"]);
      });

      it.each(["id", "platform", "kind", "title", "description", "url", "language", "date"])(
        "rejects a post missing the required %s field",
        async (field) => {
          const dir = makeContentDir();
          write(dir, "posts/pt-BR/p.md", postFile({ [field]: null }));

          await expect(getPosts(undefined, dir)).rejects.toThrow(
            `required field "${field}" is missing or empty`
          );
        }
      );

      it("rejects an unknown platform, naming the allowed ones", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/p.md", postFile({ platform: "twitter" }));

        await expect(getPosts(undefined, dir)).rejects.toThrow(
          'field "platform" must be one of linkedin, youtube, got "twitter".'
        );
      });

      it("rejects an unknown kind, naming the allowed ones", async () => {
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/p.md", postFile({ kind: "short" }));

        await expect(getPosts(undefined, dir)).rejects.toThrow(
          'field "kind" must be one of post, article, video, got "short".'
        );
      });

      it("skips a file whose YAML can't be parsed", async () => {
        setNodeEnv("development");
        const dir = makeContentDir();
        write(dir, "posts/pt-BR/good.md", postFile());
        write(dir, "posts/pt-BR/bad.md", "---\nid: [unclosed\n---\nBody");

        expect((await getPosts(undefined, dir)).map((p) => p.id)).toEqual(["deep-links"]);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Skipping malformed file"));
      });
    });
  });

  describe("getProjects (real content)", () => {
    it("gives OmniMorse the same YouTube video in every locale, and it is a real video link", async () => {
      for (const locale of ["pt-BR", "en", "es"]) {
        const omnimorse = (await getProjects(locale)).find((p) => p.id === "omnimorse");
        expect(omnimorse?.videoUrl).toBe("https://youtu.be/CcyTyHB7n_M");
        expect(getYouTubeVideoId(omnimorse?.videoUrl ?? "")).toBe("CcyTyHB7n_M");
      }
    });

    it("only uses video URLs that point at YouTube", async () => {
      for (const project of await getProjects("en")) {
        if (project.videoUrl) {
          expect(getYouTubeVideoId(project.videoUrl)).not.toBeNull();
        }
      }
    });
  });

  describe("getPosts (real content)", () => {
    it("ships the same post ids, platforms and URLs in every supported locale", async () => {
      const [ptBR, en, es] = await Promise.all([getPosts("pt-BR"), getPosts("en"), getPosts("es")]);
      const shape = (list: Awaited<ReturnType<typeof getPosts>>) =>
        list.map(({ id, platform, kind, url, image, language, date }) => ({
          id,
          platform,
          kind,
          url,
          image,
          language,
          date,
        }));

      expect(ptBR.length).toBeGreaterThan(0);
      expect(shape(en)).toEqual(shape(ptBR));
      expect(shape(es)).toEqual(shape(ptBR));
    });

    it("translates the titles rather than copying the pt-BR ones", async () => {
      const [ptBR, en] = await Promise.all([getPosts("pt-BR"), getPosts("en")]);
      const titleFor = (list: typeof ptBR, id: string) => list.find((p) => p.id === id)?.title;

      expect(titleFor(en, "deep-links-article")).toBe("Implementing Deep Links in a Next.js Site");
      expect(titleFor(ptBR, "deep-links-article")).toBe(
        "Implementando Deep Link em um site Next.js"
      );
    });

    it("stores every date as an ISO yyyy-mm-dd string", async () => {
      for (const post of await getPosts("en")) {
        expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it("points every cover image at a file that exists under public/", async () => {
      for (const post of await getPosts("en")) {
        if (post.image) {
          expect(fs.existsSync(path.join(process.cwd(), "public", post.image))).toBe(true);
        }
      }
    });
  });
});
