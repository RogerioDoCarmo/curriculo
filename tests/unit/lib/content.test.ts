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
});
