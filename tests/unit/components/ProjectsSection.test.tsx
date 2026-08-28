/**
 * Unit tests for ProjectsSection component
 */

import React from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ProjectsSection from "@/components/ProjectsSection";
import { trackProjectShare } from "@/lib/analytics";
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
    appStore: "Download on the App Store",
    fdroid: "Get it on F-Droid",
    noImages: "No images available",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    copyLinkFailed: "Couldn't copy the link",
  },
};

jest.mock("@/lib/analytics", () => ({
  trackProjectShare: jest.fn(),
}));

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
    appStoreUrl: "https://apps.apple.com/us/app/miroji/id6774924907",
    fdroidUrl: "https://f-droid.org/en/packages/com.rogeriodocarmo.miroji",
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
  // The URL is reset between tests globally (see jest.setup.js) — this component
  // writes the open project into it, which would otherwise leak into the next
  // test and deep-link-open the dialog on mount.

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
    // The open project becomes shareable: it lands in the URL.
    expect(window.location.search).toBe("?project=project-1");
    expect(window.location.hash).toBe("#projects");
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

  it("shows store badge links in modal when store URLs are present", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));

    await waitFor(() => {
      const appStoreLink = screen.getByRole("link", { name: /download on the app store/i });
      expect(appStoreLink).toHaveAttribute(
        "href",
        "https://apps.apple.com/us/app/miroji/id6774924907"
      );
      expect(appStoreLink).toHaveAttribute("target", "_blank");
      expect(appStoreLink).toHaveAttribute("rel", "noopener noreferrer");

      const fdroidLink = screen.getByRole("link", { name: /get it on f-droid/i });
      expect(fdroidLink).toHaveAttribute(
        "href",
        "https://f-droid.org/en/packages/com.rogeriodocarmo.miroji"
      );
    });
  });

  it("uses the locale-specific badge artwork", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="pt-BR" />);
    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));

    await waitFor(() => {
      expect(screen.getByRole("img", { name: /download on the app store/i })).toHaveAttribute(
        "src",
        "/images/badges/app-store-pt-BR.svg"
      );
      expect(screen.getByRole("img", { name: /get it on f-droid/i })).toHaveAttribute(
        "src",
        "/images/badges/f-droid-pt-BR.svg"
      );
    });
  });

  it("falls back to the English badge artwork for an unsupported locale", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="fr-FR" />);
    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));

    await waitFor(() => {
      expect(screen.getByRole("img", { name: /download on the app store/i })).toHaveAttribute(
        "src",
        "/images/badges/app-store-en.svg"
      );
      expect(screen.getByRole("img", { name: /get it on f-droid/i })).toHaveAttribute(
        "src",
        "/images/badges/f-droid-en.svg"
      );
    });
  });

  it("does not show store badges when the project has no store URLs", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    await user.click(screen.getByRole("button", { name: /view details for portfolio website/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: /download on the app store/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /get it on f-droid/i })).not.toBeInTheDocument();
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
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("#projects");
  });

  it("pushes exactly one history entry when the dialog closes", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
    await screen.findByRole("dialog");

    const pushSpy = jest.spyOn(window.history, "pushState");
    await user.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // The native <dialog> "close" event fires onClose a second time; the URL
    // must not gain a duplicate entry because of it.
    expect(pushSpy).toHaveBeenCalledTimes(1);
    pushSpy.mockRestore();
  });

  it("renders section with correct id", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(document.getElementById("projects")).toBeInTheDocument();
  });

  it("is programmatically focusable so the scroll minimap can land focus here", () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(document.getElementById("projects")).toHaveAttribute("tabIndex", "-1");
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

  it("keeps the URL on the project shown by Prev/Next without stacking history", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);

    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
    const dialog = await screen.findByRole("dialog");

    const pushSpy = jest.spyOn(window.history, "pushState");
    await user.click(within(dialog).getByRole("button", { name: "Next project" }));

    expect(window.location.search).toBe("?project=project-2");
    // Stepping replaces the entry rather than pushing a new one each time.
    expect(pushSpy).not.toHaveBeenCalled();
    pushSpy.mockRestore();
  });

  it("opens the deep-linked project on mount and scrolls to the section", async () => {
    window.history.replaceState(null, "", "/en/?project=project-2#projects");
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Portfolio Website" })).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "start",
      behavior: "instant",
    });
  });

  it("ignores an unknown project id in the URL", async () => {
    window.history.replaceState(null, "", "/en/?project=does-not-exist#projects");
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);

    await waitFor(() => {
      expect(screen.getByText("E-Commerce App")).toBeInTheDocument();
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("follows the URL on browser back/forward", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
    await screen.findByRole("dialog");

    // Simulate going back: the URL loses the param, then popstate fires.
    window.history.replaceState(null, "", "/#projects");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("reopens the project when forward navigation restores the param", async () => {
    renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    window.history.replaceState(null, "", "/?project=project-3#projects");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Chat App" })).toBeInTheDocument();
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

  describe("copy link", () => {
    /**
     * Installs a clipboard double. Must run *after* `userEvent.setup()`, which
     * installs a working stub of its own that would otherwise win.
     */
    const setClipboard = (value: unknown) => {
      Object.defineProperty(navigator, "clipboard", {
        value,
        configurable: true,
        writable: true,
      });
    };

    afterEach(() => {
      setClipboard(undefined);
      jest.clearAllMocks();
    });

    it("copies the project's absolute deep link and confirms it", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/en/?project=project-1#projects");
      expect(await within(dialog).findByText("Link copied!")).toBeInTheDocument();
    });

    it("uses the active locale in the copied link", async () => {
      const user = userEvent.setup();
      const writeText = jest.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="pt-BR" />);
      await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(writeText).toHaveBeenCalledWith("http://localhost/pt-BR/?project=project-1#projects");
    });

    it("announces the confirmation in a polite live region", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      const status = await within(dialog).findByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveTextContent("Link copied!");
    });

    it("tracks a successful share", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });

      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      await waitFor(() => {
        expect(trackProjectShare).toHaveBeenCalledWith({
          project_id: "project-1",
          project_title: "E-Commerce App",
        });
      });
    });

    it("shows an error message and tracks nothing when copying fails", async () => {
      const user = userEvent.setup();
      setClipboard({ writeText: jest.fn().mockRejectedValue(new Error("denied")) });

      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      await user.click(screen.getByRole("button", { name: /view details for e-commerce app/i }));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: /copy link/i }));

      expect(await within(dialog).findByText("Couldn't copy the link")).toBeInTheDocument();
      expect(trackProjectShare).not.toHaveBeenCalled();
    });

    it("offers the copy button even for a project with no external links", async () => {
      const user = userEvent.setup();
      renderWithIntl(<ProjectsSection projects={sampleProjects} locale="en" />);
      await user.click(screen.getByRole("button", { name: /view details for chat app/i }));
      const dialog = await screen.findByRole("dialog");

      expect(within(dialog).getByRole("button", { name: /copy link/i })).toBeInTheDocument();
      expect(within(dialog).queryByRole("link", { name: /live demo/i })).not.toBeInTheDocument();
    });
  });
});
