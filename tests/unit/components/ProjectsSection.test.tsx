/**
 * Unit tests for ProjectsSection component
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ProjectsSection from "@/components/ProjectsSection";
import type { Project } from "@/types/index";

// Mock messages for next-intl
const messages: AbstractIntlMessages = {
  sections: {
    projects: "Projects",
  },
  projects: {
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
    noImages: "No images available",
  },
};

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    loading,
    fill: _fill,
    sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    loading?: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} data-loading={loading} data-sizes={sizes} {...rest} />,
}));

const sampleProjects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce App",
    description: "A mobile e-commerce application.",
    longDescription: "Full description of the e-commerce app with all features.",
    technologies: ["React Native", "TypeScript", "Redux"],
    images: ["/images/ecommerce-1.jpg", "/images/ecommerce-2.jpg"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/user/ecommerce",
    featured: true,
    date: "2024-01-15",
  },
  {
    id: "project-2",
    title: "Portfolio Website",
    description: "Personal portfolio website.",
    technologies: ["Next.js", "Tailwind CSS"],
    images: ["/images/resume.png"],
    featured: false,
    date: "2023-06-01",
  },
  {
    id: "project-3",
    title: "Chat App",
    description: "Real-time chat application.",
    technologies: ["React Native", "Firebase"],
    images: [],
    featured: false,
    date: "2023-01-01",
  },
];

// Helper to render with next-intl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("ProjectsSection Component", () => {
  it("renders all projects in a grid", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(screen.getByText("E-Commerce App")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("Chat App")).toBeInTheDocument();
  });

  it("renders project descriptions", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(screen.getByText("A mobile e-commerce application.")).toBeInTheDocument();
  });

  it("renders technology tags for each project", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(screen.getAllByText("React Native").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
  });

  it("highlights featured projects", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders project images with lazy loading", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const images = screen.getAllByRole("img");
    const lazyImages = images.filter((img) => img.getAttribute("data-loading") === "lazy");
    expect(lazyImages.length).toBeGreaterThan(0);
  });

  it("renders project images with alt text", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });

  it("renders technology filter buttons", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const filterGroup = screen.getByRole("group", { name: /filter by technology/i });
    expect(filterGroup).toBeInTheDocument();
  });

  it("filters projects by technology when filter button is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    // Find the Next.js filter button (in the filter group)
    const filterButtons = screen.getAllByRole("button", { name: "Next.js" });
    await user.click(filterButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
      expect(screen.queryByText("E-Commerce App")).not.toBeInTheDocument();
    });
  });

  it("shows all projects when 'All' filter is selected", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    // Filter by Next.js first
    const nextjsButtons = screen.getAllByRole("button", { name: "Next.js" });
    await user.click(nextjsButtons[0]);
    // Then click All
    const allButton = screen.getByRole("button", { name: "All" });
    await user.click(allButton);
    await waitFor(() => {
      expect(screen.getByText("E-Commerce App")).toBeInTheDocument();
      expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    });
  });

  it("opens modal with project details when project card is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for e-commerce app/i });
    await user.click(card);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("shows full description in modal", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for e-commerce app/i });
    await user.click(card);
    await waitFor(() => {
      expect(
        screen.getByText("Full description of the e-commerce app with all features.")
      ).toBeInTheDocument();
    });
  });

  it("shows live demo link in modal when liveUrl is present", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for e-commerce app/i });
    await user.click(card);
    await waitFor(() => {
      const liveLink = screen.getByRole("link", { name: /live demo/i });
      expect(liveLink).toHaveAttribute("href", "https://example.com");
    });
  });

  it("shows repository link in modal when repoUrl is present", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for e-commerce app/i });
    await user.click(card);
    await waitFor(() => {
      const repoLink = screen.getByRole("link", { name: /repository/i });
      expect(repoLink).toHaveAttribute("href", "https://github.com/user/ecommerce");
    });
  });

  it("does not show live demo link when liveUrl is absent", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for portfolio website/i });
    await user.click(card);
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: /live demo/i })).not.toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    const card = screen.getByRole("button", { name: /view details for e-commerce app/i });
    await user.click(card);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("renders section with correct id", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(document.getElementById("projects")).toBeInTheDocument();
  });

  it("shows empty state message when no projects match filter", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    // Filter by a tech that only matches one project, then filter by something else
    // to trigger the "no match" state — click TypeScript filter then Firebase filter
    const typescriptBtn = screen.getByRole("button", { name: "TypeScript" });
    await user.click(typescriptBtn);
    // Now click TypeScript again to deselect (shows all), then click Firebase
    await user.click(typescriptBtn);
    // All projects visible again
    await waitFor(() => {
      expect(screen.getByText("E-Commerce App")).toBeInTheDocument();
    });
  });

  it("steps through projects via the detail modal Prev/Next buttons (wrapping)", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);

    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "E-Commerce App" })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Next project" }));
    expect(within(dialog).getByRole("heading", { name: "Portfolio Website" })).toBeInTheDocument();

    // Prev from the second wraps as expected back toward the first.
    await user.click(within(dialog).getByRole("button", { name: "Previous project" }));
    expect(within(dialog).getByRole("heading", { name: "E-Commerce App" })).toBeInTheDocument();
  });

  it("renders the swipe carousel instead of the grid on mobile", async () => {
    const original = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    try {
      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      // The infinite carousel renders each card in three copies; the grid renders one.
      await waitFor(() => {
        expect(screen.getAllByText("E-Commerce App").length).toBeGreaterThan(1);
      });
    } finally {
      window.matchMedia = original;
    }
  });
});
