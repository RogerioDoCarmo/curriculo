import {
  escapeHtml,
  formatExperienceLine,
  formatProjectLine,
  formatSkillLine,
  renderThreeDsHtml,
  type ThreeDsPageInput,
} from "@/lib/threeds-page";
import type { Experience, Project, SkillCategory } from "@/types/index";

test("escapeHtml escapes the five HTML-significant characters", () => {
  expect(escapeHtml(`<a>&'"</a>`)).toBe("&lt;a&gt;&amp;&#39;&quot;&lt;/a&gt;");
});

test("formatExperienceLine renders a closed date range", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2020-01-01",
    endDate: "2021-06-01",
    description: "",
    achievements: [],
  } as Experience;
  expect(formatExperienceLine(exp)).toBe("Engineer — Acme (2020–2021)");
});

test("formatExperienceLine renders an open-ended entry as Present", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2022-01-01",
    endDate: undefined,
    description: "",
    achievements: [],
  } as Experience;
  expect(formatExperienceLine(exp)).toBe("Engineer — Acme (2022–Present)");
});

test("formatProjectLine joins title and description", () => {
  const project = {
    id: "p",
    title: "Miroji",
    description: "A mirror app.",
    technologies: [],
    images: [],
    featured: false,
  } as Project;
  expect(formatProjectLine(project)).toBe("Miroji — A mirror app.");
});

test("formatSkillLine joins category and skill names", () => {
  const category = {
    category: "Mobile",
    skills: [{ name: "React Native" }, { name: "Flutter" }],
  } as SkillCategory;
  expect(formatSkillLine(category)).toBe("Mobile: React Native, Flutter");
});

const baseInput: ThreeDsPageInput = {
  name: "Rogério do Carmo",
  title: "Mobile React Native Developer",
  subtitle: "Specialist in building cross-platform mobile applications.",
  heroImageSrc: "hero.jpg",
  experiences: [],
  projects: [],
  skills: [],
};

test("renders with no CSS and no script tags", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).not.toContain("<style");
  expect(html).not.toContain("<script");
});

test("renders the escaped name, title, and hero image", () => {
  const html = renderThreeDsHtml({ ...baseInput, name: "A & B" });
  expect(html).toContain("<h1>A &amp; B</h1>");
  expect(html).toContain('<img src="hero.jpg"');
});

test("renders one <li> per experience entry, in order given", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2020-01-01",
    endDate: undefined,
    description: "",
    achievements: [],
  } as Experience;
  const html = renderThreeDsHtml({ ...baseInput, experiences: [exp] });
  expect(html).toContain("<li>Engineer — Acme (2020–Present)</li>");
});

test("renders a link to the live site using SITE_URL", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).toContain('<a href="https://rogeriodocarmo.com">');
});

test("renders a noindex directive so search engines skip this duplicate-content page", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).toContain('<meta name="robots" content="noindex">');
});

test("renders a valid, non-empty page when all lists are empty", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).toContain("<h1>Rogério do Carmo</h1>");
  expect(html).toContain("<ul></ul>");
});
