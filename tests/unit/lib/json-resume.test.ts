import { generateJsonResume } from "@/lib/json-resume";

describe("generateJsonResume", () => {
  it("should generate valid JSON Resume schema", async () => {
    const resume = await generateJsonResume();

    expect(resume).toHaveProperty("$schema");
    expect(resume.$schema).toContain("jsonresume");
  });

  it("should include basics section", async () => {
    const resume = await generateJsonResume();

    expect(resume.basics).toBeDefined();
    expect(resume.basics.name).toBeDefined();
    expect(resume.basics.label).toBeDefined();
  });

  it("should include work section", async () => {
    const resume = await generateJsonResume();

    expect(resume.work).toBeDefined();
    expect(Array.isArray(resume.work)).toBe(true);
  });

  it("should include education section", async () => {
    const resume = await generateJsonResume();

    expect(resume.education).toBeDefined();
    expect(Array.isArray(resume.education)).toBe(true);
  });

  it("should include skills section", async () => {
    const resume = await generateJsonResume();

    expect(resume.skills).toBeDefined();
    expect(Array.isArray(resume.skills)).toBe(true);
  });

  it("should include languages section", async () => {
    const resume = await generateJsonResume();

    expect(resume.languages).toBeDefined();
    expect(Array.isArray(resume.languages)).toBe(true);
    expect(resume.languages.length).toBeGreaterThan(0);
  });

  it("should have valid structure for work entries", async () => {
    const resume = await generateJsonResume();

    if (resume.work.length > 0) {
      const workEntry = resume.work[0];
      expect(workEntry).toHaveProperty("name");
      expect(workEntry).toHaveProperty("position");
      expect(workEntry).toHaveProperty("startDate");
    }
  });

  it("should have valid structure for education entries", async () => {
    const resume = await generateJsonResume();

    if (resume.education.length > 0) {
      const eduEntry = resume.education[0];
      expect(eduEntry).toHaveProperty("institution");
      expect(eduEntry).toHaveProperty("studyType");
    }
  });

  it("should have valid structure for skills", async () => {
    const resume = await generateJsonResume();

    if (resume.skills.length > 0) {
      const skill = resume.skills[0];
      expect(skill).toHaveProperty("name");
      expect(skill).toHaveProperty("keywords");
    }
  });

  it("should have valid structure for languages", async () => {
    const resume = await generateJsonResume();

    const language = resume.languages[0];
    expect(language).toHaveProperty("language");
    expect(language).toHaveProperty("fluency");
  });
});
