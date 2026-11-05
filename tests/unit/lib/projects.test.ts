/**
 * Unit tests for lib/projects.ts — display order and filtering for the
 * projects section and page.
 *
 * Assertions use literal expected values (never values re-derived from the
 * module under test) so they hold up under mutation testing.
 */

import {
  HOME_PROJECTS_COUNT,
  filterProjectsByTechnology,
  getHomeProjects,
  getProjectTechnologies,
  sortProjectsForDisplay,
} from "@/lib/projects";

const p = (id: string, order: number) => ({ id, order });
const ids = (list: readonly { id: string }[]) => list.map((x) => x.id);

describe("HOME_PROJECTS_COUNT", () => {
  it("is three", () => {
    expect(HOME_PROJECTS_COUNT).toBe(3);
  });
});

describe("sortProjectsForDisplay", () => {
  it("orders by `order` ascending", () => {
    const sorted = sortProjectsForDisplay([p("c", 3), p("a", 1), p("b", 2)]);
    expect(ids(sorted)).toEqual(["a", "b", "c"]);
  });

  it("gives the same answer whichever way the projects arrive", () => {
    const input = [p("b", 2), p("a", 1), p("c", 3)];
    expect(ids(sortProjectsForDisplay(input))).toEqual(["a", "b", "c"]);
    expect(ids(sortProjectsForDisplay([...input].reverse()))).toEqual(["a", "b", "c"]);
  });

  it("orders projects with the same `order` value by id", () => {
    const sorted = sortProjectsForDisplay([p("z", 1), p("a", 1), p("m", 1)]);
    expect(ids(sorted)).toEqual(["a", "m", "z"]);
  });

  it("keeps projects with the same `order` and id in their original order", () => {
    const tagged = [1, 2, 3, 4].map((n) => ({ ...p("same", 1), n }));
    expect(sortProjectsForDisplay(tagged).map((x) => x.n)).toEqual([1, 2, 3, 4]);
  });

  it("returns a new array and leaves the input alone", () => {
    const input = [p("later", 2), p("first", 1)];
    const sorted = sortProjectsForDisplay(input);
    expect(sorted).not.toBe(input);
    expect(ids(input)).toEqual(["later", "first"]);
  });

  it("handles an empty list", () => {
    expect(sortProjectsForDisplay([])).toEqual([]);
  });
});

describe("getHomeProjects", () => {
  const projects = [p("fifth", 5), p("second", 2), p("fourth", 4), p("first", 1), p("third", 3)];

  it("returns the first three in display order", () => {
    expect(ids(getHomeProjects(projects))).toEqual(["first", "second", "third"]);
  });

  it("honours an explicit count", () => {
    expect(ids(getHomeProjects(projects, 1))).toEqual(["first"]);
    expect(getHomeProjects(projects, 0)).toEqual([]);
    expect(ids(getHomeProjects(projects, 10))).toHaveLength(5);
  });

  it("returns everything when there are fewer than the count", () => {
    expect(ids(getHomeProjects([p("only", 1)]))).toEqual(["only"]);
    expect(getHomeProjects([])).toEqual([]);
  });
});

describe("getProjectTechnologies", () => {
  it("lists each technology once, alphabetically", () => {
    expect(
      getProjectTechnologies([
        { technologies: ["Kotlin", "Java"] },
        { technologies: ["TypeScript", "Java"] },
        { technologies: ["Jest"] },
      ])
    ).toEqual(["Java", "Jest", "Kotlin", "TypeScript"]);
  });

  it("sorts case-insensitively where the locale does", () => {
    expect(getProjectTechnologies([{ technologies: ["b", "A", "c"] }])).toEqual(["A", "b", "c"]);
  });

  it("returns an empty list when there are no projects or no technologies", () => {
    expect(getProjectTechnologies([])).toEqual([]);
    expect(getProjectTechnologies([{ technologies: [] }])).toEqual([]);
  });
});

describe("filterProjectsByTechnology", () => {
  const projects = [
    { id: "a", technologies: ["Kotlin", "Jest"] },
    { id: "b", technologies: ["Java"] },
    { id: "c", technologies: ["Kotlin"] },
  ];

  it("keeps only the projects that use the technology, in their given order", () => {
    expect(ids(filterProjectsByTechnology(projects, "Kotlin"))).toEqual(["a", "c"]);
    expect(ids(filterProjectsByTechnology(projects, "Java"))).toEqual(["b"]);
  });

  it("returns every project, as a copy, for an empty technology", () => {
    const all = filterProjectsByTechnology(projects, "");
    expect(ids(all)).toEqual(["a", "b", "c"]);
    expect(all).not.toBe(projects);
  });

  it("matches a technology exactly, not as a substring", () => {
    expect(filterProjectsByTechnology(projects, "Kot")).toEqual([]);
    expect(filterProjectsByTechnology(projects, "kotlin")).toEqual([]);
  });

  it("returns nothing for a technology no project uses", () => {
    expect(filterProjectsByTechnology(projects, "COBOL")).toEqual([]);
  });
});
