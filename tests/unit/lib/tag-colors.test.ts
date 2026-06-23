/**
 * Unit tests for tag-colors utilities.
 *
 * Every technology badge now shares one uniform blue palette, so the suite
 * asserts the literal class string (killing StringLiteral mutants on the
 * constant) and that the resolver returns it for any technology, known or not.
 * This suite doubles as the mutation-testing target for lib/tag-colors.ts.
 */

import { getTechColorClasses, TECH_TAG_CLASSES } from "@/lib/tag-colors";

/** The single palette every badge must resolve to (light + dark variants). */
const UNIFORM_BLUE = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

describe("TECH_TAG_CLASSES", () => {
  it("is the uniform blue palette", () => {
    expect(TECH_TAG_CLASSES).toBe(UNIFORM_BLUE);
  });
});

describe("getTechColorClasses", () => {
  it.each([
    "React Native",
    "TypeScript",
    "Java",
    "Docker",
    "Git",
    "Firebase",
    "GNSS/GPS",
    "CompletelyUnknownTech",
    "",
  ])("returns the uniform blue palette for %p", (tech) => {
    expect(getTechColorClasses(tech)).toBe(UNIFORM_BLUE);
  });
});
