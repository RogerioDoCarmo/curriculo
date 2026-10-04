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

const p = (id: string, featured: boolean, date: string) => ({ id, featured, date });
const ids = (list: readonly { id: string }[]) => list.map((x) => x.id);

describe("HOME_PROJECTS_COUNT", () => {
  it("is three", () => {
    expect(HOME_PROJECTS_COUNT).toBe(3);
  });
});

describe("sortProjectsForDisplay", () => {
  it("puts featured projects first, then everything else", () => {
    const sorted = sortProjectsForDisplay([
      p("plain-new", false, "2026-10-04"),
      p("feat-old", true, "2017-01-01"),
    ]);
    expect(ids(sorted)).toEqual(["feat-old", "plain-new"]);
  });

  it("orders each group newest first", () => {
    const sorted = sortProjectsForDisplay([
      p("plain-old", false, "2017-09-01"),
      p("feat-old", true, "2021-06-01"),
      p("plain-new", false, "2026-10-04"),
      p("feat-new", true, "2026-08-18"),
    ]);
    expect(ids(sorted)).toEqual(["feat-new", "feat-old", "plain-new", "plain-old"]);
  });

  it("gives the same answer whichever way the projects arrive", () => {
    const input = [
      p("b", false, "2020-01-01"),
      p("a", true, "2019-01-01"),
      p("c", false, "2022-01-01"),
    ];
    expect(ids(sortProjectsForDisplay(input))).toEqual(["a", "c", "b"]);
    expect(ids(sortProjectsForDisplay([...input].reverse()))).toEqual(["a", "c", "b"]);
  });

  it("orders projects on the same date by id", () => {
    const sorted = sortProjectsForDisplay([
      p("z", false, "2026-01-01"),
      p("a", false, "2026-01-01"),
      p("m", false, "2026-01-01"),
    ]);
    expect(ids(sorted)).toEqual(["a", "m", "z"]);
  });

  it("lets the date win over the id, and the featured flag win over the date", () => {
    expect(
      ids(sortProjectsForDisplay([p("a", false, "2020-01-01"), p("z", false, "2021-01-01")]))
    ).toEqual(["z", "a"]);
    expect(
      ids(sortProjectsForDisplay([p("a", false, "2030-01-01"), p("z", true, "2000-01-01")]))
    ).toEqual(["z", "a"]);
  });

  it("keeps projects with the same featured flag, date and id in their original order", () => {
    const tagged = [1, 2, 3, 4].map((n) => ({ ...p("same", false, "2026-01-01"), n }));
    expect(sortProjectsForDisplay(tagged).map((x) => x.n)).toEqual([1, 2, 3, 4]);
  });

  it("returns a new array and leaves the input alone", () => {
    const input = [p("old", false, "2020-01-01"), p("new", false, "2026-01-01")];
    const sorted = sortProjectsForDisplay(input);
    expect(sorted).not.toBe(input);
    expect(ids(input)).toEqual(["old", "new"]);
  });

  it("handles an empty list", () => {
    expect(sortProjectsForDisplay([])).toEqual([]);
  });
});

describe("getHomeProjects", () => {
  const projects = [
    p("oldest", false, "2017-09-01"),
    p("feat-old", true, "2021-06-01"),
    p("recent", false, "2026-10-04"),
    p("feat-new", true, "2026-08-18"),
    p("middle", false, "2023-01-01"),
  ];

  it("returns the first three in display order", () => {
    expect(ids(getHomeProjects(projects))).toEqual(["feat-new", "feat-old", "recent"]);
  });

  it("honours an explicit count", () => {
    expect(ids(getHomeProjects(projects, 1))).toEqual(["feat-new"]);
    expect(getHomeProjects(projects, 0)).toEqual([]);
    expect(ids(getHomeProjects(projects, 10))).toHaveLength(5);
  });

  it("returns everything when there are fewer than the count", () => {
    expect(ids(getHomeProjects([p("only", false, "2020-01-01")]))).toEqual(["only"]);
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
