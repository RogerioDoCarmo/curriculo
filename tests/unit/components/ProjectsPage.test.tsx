/**
 * Unit tests for ProjectsPage — every project, filterable by technology.
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ProjectsPage from "@/components/ProjectsPage";
import type { Project } from "@/types/index";

const messages: AbstractIntlMessages = {
  projects: {
    pageHeading: "All projects",
    pageSubtitle: "Everything I've built.",
    filterByTech: "Filter by technology",
    all: "All",
    noMatch: "No projects match your filter",
    viewDetails: "View details for",
    previousProject: "Previous project",
    nextProject: "Next project",
    screenshot: "screenshot",
    featured: "Featured",
    mockData: "Mock Data",
    more: "more",
    technologies: "Technologies",
    liveDemo: "Live Demo",
    repository: "Repository",
    appStore: "Download on the App Store",
    fdroid: "Get it on F-Droid",
    playStore: "Get it on Google Play",
    noImages: "No images available",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    copyLinkFailed: "Couldn't copy the link",
  },
};

jest.mock("@/lib/analytics", () => ({
  trackProjectShare: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...rest} />,
}));

const project = (
  id: string,
  title: string,
  featured: boolean,
  date: string,
  technologies: string[]
): Project => ({
  id,
  title,
  description: `${title} description.`,
  technologies,
  images: [],
  featured,
  date,
});

// Deliberately not in display order. Display order is featured first, then newest.
const featuredOld = project("featured-old", "Featured Old", true, "2021-06-01", [
  "Java",
  "TypeScript",
]);
const featuredNew = project("featured-new", "Featured New", true, "2026-08-18", [
  "Kotlin",
  "TypeScript",
]);
const recent = project("recent", "Recent", false, "2026-10-04", ["Kotlin", "Jest"]);
const oldest = project("oldest", "Oldest", false, "2017-09-01", ["Java"]);

const allProjects: Project[] = [oldest, featuredOld, recent, featuredNew];

function renderPage(projects: Project[], locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProjectsPage projects={projects} locale={locale} />
    </NextIntlClientProvider>
  );
}

const cardTitles = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const chip = (name: string) =>
  within(screen.getByRole("group", { name: "Filter by technology" })).getByRole("button", {
    name,
  });
const cardFor = (title: string) =>
  screen.getByRole("button", { name: `View details for ${title}` });

describe("ProjectsPage", () => {
  // The URL is reset between tests globally (see jest.setup.js).

  describe("rendering", () => {
    it("renders the page heading as the h1, with its subtitle", () => {
      renderPage(allProjects);

      expect(screen.getByRole("heading", { level: 1, name: "All projects" })).toBeInTheDocument();
      expect(screen.getByText("Everything I've built.")).toBeInTheDocument();
    });

    it("lists every project in display order: featured first, then newest", () => {
      renderPage(allProjects);
      expect(cardTitles()).toEqual(["Featured New", "Featured Old", "Recent", "Oldest"]);
    });

    it("says so when there are no projects", () => {
      renderPage([]);

      expect(screen.getByRole("status")).toHaveTextContent("No projects match your filter");
      expect(screen.queryByRole("group", { name: "Filter by technology" })).not.toBeInTheDocument();
    });
  });

  describe("technology filter", () => {
    it("offers All plus each technology once, alphabetically", () => {
      renderPage(allProjects);

      const labels = within(screen.getByRole("group", { name: "Filter by technology" }))
        .getAllByRole("button")
        .map((b) => b.textContent);
      expect(labels).toEqual(["All", "Java", "Jest", "Kotlin", "TypeScript"]);
    });

    it("starts with All pressed", () => {
      renderPage(allProjects);

      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
      expect(chip("Kotlin")).toHaveAttribute("aria-pressed", "false");
    });

    it("shows only the projects using the chosen technology, still in display order", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);

      await user.click(chip("Kotlin"));

      expect(chip("Kotlin")).toHaveAttribute("aria-pressed", "true");
      expect(chip("All")).toHaveAttribute("aria-pressed", "false");
      expect(cardTitles()).toEqual(["Featured New", "Recent"]);
    });

    it("toggles back to every project when the active technology is clicked again", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);

      await user.click(chip("Java"));
      expect(cardTitles()).toEqual(["Featured Old", "Oldest"]);

      await user.click(chip("Java"));
      expect(cardTitles()).toHaveLength(4);
      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
    });

    it("returns to every project from All", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);

      await user.click(chip("Jest"));
      await user.click(chip("All"));

      expect(cardTitles()).toHaveLength(4);
    });

    it("writes the chosen technology into the URL, replacing rather than pushing history", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);
      const pushSpy = jest.spyOn(window.history, "pushState");

      await user.click(chip("Kotlin"));
      expect(window.location.search).toBe("?tech=Kotlin");

      await user.click(chip("All"));
      expect(window.location.search).toBe("");

      expect(pushSpy).not.toHaveBeenCalled();
      pushSpy.mockRestore();
    });

    it("preselects the technology named in the URL", async () => {
      window.history.replaceState(null, "", "/en/projects/?tech=Jest");
      renderPage(allProjects);

      await waitFor(() => {
        expect(chip("Jest")).toHaveAttribute("aria-pressed", "true");
      });
      expect(cardTitles()).toEqual(["Recent"]);
    });

    it("shows everything when the URL names a technology no project uses", async () => {
      window.history.replaceState(null, "", "/en/projects/?tech=COBOL");
      renderPage(allProjects);

      await waitFor(() => {
        expect(cardTitles()).toHaveLength(4);
      });
      expect(chip("All")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("detail dialog and deep links", () => {
    it("opens a project and records it in the URL without a hash", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);

      await user.click(cardFor("Featured New"));

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Featured New" })).toBeInTheDocument();
      expect(window.location.search).toBe("?project=featured-new");
      expect(window.location.hash).toBe("");
    });

    it("keeps the technology filter in the URL while a project is open", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);

      await user.click(chip("Kotlin"));
      await user.click(cardFor("Recent"));
      await screen.findByRole("dialog");

      expect(window.location.search).toBe("?tech=Kotlin&project=recent");
    });

    it("steps through every project, wrapping around", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);
      await user.click(cardFor("Oldest"));
      const dialog = await screen.findByRole("dialog");

      await user.click(within(dialog).getByRole("button", { name: "Next project" }));
      expect(within(dialog).getByRole("heading", { name: "Featured New" })).toBeInTheDocument();

      await user.click(within(dialog).getByRole("button", { name: "Previous project" }));
      expect(within(dialog).getByRole("heading", { name: "Oldest" })).toBeInTheDocument();
    });

    it("steps only through the filtered projects", async () => {
      const user = userEvent.setup();
      renderPage(allProjects);
      await user.click(chip("Java"));
      await user.click(cardFor("Featured Old"));
      const dialog = await screen.findByRole("dialog");

      // "Recent" and "Featured New" sit between these two, but are filtered out.
      await user.click(within(dialog).getByRole("button", { name: "Next project" }));

      expect(within(dialog).getByRole("heading", { name: "Oldest" })).toBeInTheDocument();
    });

    it("opens the linked project on arrival, even one the home page leaves out", async () => {
      window.history.replaceState(null, "", "/en/projects/?project=oldest");
      renderPage(allProjects);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "Oldest" })).toBeInTheDocument();
    });

    it("doesn't scroll anywhere: the page has no section hash", async () => {
      window.history.replaceState(null, "", "/en/projects/?project=oldest");
      renderPage(allProjects);

      await screen.findByRole("dialog");
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    });

    it("ignores an unknown project id", async () => {
      window.history.replaceState(null, "", "/en/projects/?project=nope");
      renderPage(allProjects);

      await waitFor(() => {
        expect(screen.getByText("Featured New")).toBeInTheDocument();
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("copies a link to this project on the projects page", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      renderPage(allProjects);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
        writable: true,
      });

      await user.click(cardFor("Featured Old"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/en/projects/?project=featured-old");
      Object.defineProperty(navigator, "clipboard", {
        value: undefined,
        configurable: true,
        writable: true,
      });
    });
  });
});
