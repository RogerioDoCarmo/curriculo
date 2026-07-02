import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getProjects, getExperiences, getSkills } from "@/lib/content";

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
      await expect(getProjects("nonexistent-dir")).resolves.toEqual([]);
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
        "projects/old.md",
        `---\nid: old\ntitle: Old\ndescription: d\ndate: "2020-01-01"\ntechnologies: [React]\nfeatured: false\n---\nBody`
      );
      write(
        dir,
        "projects/new.md",
        `---\nid: new\ntitle: New\ndescription: d\ndate: "2024-01-01"\ntechnologies: [Next.js]\nimages: [a.png]\nfeatured: true\nliveUrl: https://x.dev\nrepoUrl: https://github.com/x\n---\nBody`
      );
      const projects = await getProjects(dir);
      expect(projects.map((p) => p.id)).toEqual(["new", "old"]);
      expect(projects[0].technologies).toEqual(["Next.js"]);
      expect(projects[0].featured).toBe(true);
    });

    it("falls back to empty array when project frontmatter fields are not arrays", async () => {
      const dir = makeContentDir();
      write(
        dir,
        "projects/p.md",
        `---\nid: p\ntitle: T\ndescription: d\ndate: 2024-01-01\ntechnologies: notalist\n---\nBody`
      );
      const [project] = await getProjects(dir);
      expect(project.technologies).toEqual([]);
      expect(project.images).toEqual([]);
    });

    it("rethrows validation errors for projects missing a required field", async () => {
      const dir = makeContentDir();
      write(dir, "projects/bad.md", `---\nid: x\ndescription: no title\ndate: 2024-01-01\n---\n`);
      await expect(getProjects(dir)).rejects.toThrow(/Content validation error/);
    });

    it("skips malformed project files and warns in development", async () => {
      setNodeEnv("development");
      const dir = makeContentDir();
      // A directory named "*.md" is listed but readFileSync throws EISDIR — a
      // non-validation error, exercising the skip-and-warn branch.
      fs.mkdirSync(path.join(dir, "projects", "broken.md"), { recursive: true });
      const projects = await getProjects(dir);
      expect(projects).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it("warns when the projects directory is missing in development", async () => {
      setNodeEnv("development");
      const dir = makeContentDir(); // exists, but has no projects/ subdir
      await expect(getProjects(dir)).resolves.toEqual([]);
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
        "projects/empty.md",
        `---\nid: e\ntitle: T\ndescription: d\ndate: "2024-01-01"\n---\n`
      );
      const [project] = await getProjects(dir);
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
      write(dir, "projects/plain.md", `Just a plain body with no frontmatter.\n`);
      await expect(getProjects(dir)).rejects.toThrow(/Content validation error/);
    });

    it("treats an unterminated frontmatter block as empty data (validation error)", async () => {
      const dir = makeContentDir();
      // Opening `---` but no closing delimiter → parseFrontmatter returns
      // data: {} and the original string as content.
      write(dir, "projects/unterminated.md", `---\nid: x\ntitle: T\nno closing delimiter here`);
      await expect(getProjects(dir)).rejects.toThrow(/Content validation error/);
    });
  });
});
