/**
 * Integration tests for responsive layout
 *
 * Tests that components have appropriate responsive classes
 * for mobile (< 768px), tablet (768px-1024px), and desktop (> 1024px)
 *
 * Note: Jest/RTL uses JSDOM which doesn't actually render at different
 * viewport sizes. These tests verify that responsive CSS classes are present.
 * For true viewport testing, use Playwright E2E tests.
 *
 * Requirements: 4.1, 4.2, 4.3
 */

import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/hooks/useTheme";
import Header from "@/components/Header";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import type { Project, SkillCategory } from "@/types/index";

// Mock Next.js router for LanguageSelector
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/en",
    query: {},
    asPath: "/en",
  })),
  usePathname: jest.fn(() => "/en"),
}));

const messages = {
  nav: {
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    contact: "Contact",
    techStack: "Tech Stack",
  },
  techStack: {
    title: "Tech Stack",
    subtitle: "Technologies used",
    categories: {
      framework: "Framework",
      styling: "Styling",
      content: "Content",
      internationalization: "i18n",
      testing: "Testing",
      analytics: "Analytics",
      deployment: "Deployment",
    },
    technologies: {
      nextjs: {
        name: "Next.js",
        description: "React framework",
        why: "Performance",
        benefits: "Fast",
        url: "https://nextjs.org",
      },
      typescript: {
        name: "TypeScript",
        description: "Typed JavaScript",
        why: "Type safety",
        benefits: "Fewer bugs",
        url: "https://www.typescriptlang.org",
      },
      tailwind: {
        name: "Tailwind CSS",
        description: "Utility-first CSS",
        why: "Rapid development",
        benefits: "Customizable",
        url: "https://tailwindcss.com",
      },
      markdown: {
        name: "Markdown",
        description: "Content format",
        why: "Simple editing",
        benefits: "Easy to write",
        url: "https://daringfireball.net/projects/markdown/",
      },
      nextIntl: {
        name: "next-intl",
        description: "Internationalization",
        why: "Multi-language support",
        benefits: "Easy i18n",
        url: "https://next-intl-docs.vercel.app",
      },
      jest: {
        name: "Jest",
        description: "Testing framework",
        why: "Reliable testing",
        benefits: "Fast tests",
        url: "https://jestjs.io",
      },
      playwright: {
        name: "Playwright",
        description: "E2E testing",
        why: "Cross-browser testing",
        benefits: "Reliable E2E",
        url: "https://playwright.dev",
      },
      firebase: {
        name: "Firebase",
        description: "Analytics platform",
        why: "User insights",
        benefits: "Real-time data",
        url: "https://firebase.google.com",
      },
      vercel: {
        name: "Vercel",
        description: "Deployment platform",
        why: "Easy deployment",
        benefits: "Fast CDN",
        url: "https://vercel.com",
      },
      sentry: {
        name: "Sentry",
        description: "Error monitoring",
        why: "Track errors",
        benefits: "Better debugging",
        url: "https://sentry.io",
      },
      formspree: {
        name: "Formspree",
        description: "Form backend",
        why: "Easy forms",
        benefits: "No backend needed",
        url: "https://formspree.io",
      },
      storybook: {
        name: "Storybook",
        description: "Component documentation",
        why: "Visual testing",
        benefits: "Better docs",
        url: "https://storybook.js.org",
      },
      githubActions: {
        name: "GitHub Actions",
        description: "CI/CD pipeline",
        why: "Automated workflows",
        benefits: "Continuous integration",
        url: "https://github.com/features/actions",
      },
      sonarqube: {
        name: "SonarQube",
        description: "Code quality",
        why: "Code analysis",
        benefits: "Better code quality",
        url: "https://www.sonarqube.org",
      },
    },
  },
  projects: {
    title: "Projects",
    filterAll: "All",
  },
  skills: {
    title: "Skills",
    searchPlaceholder: "Search skills",
  },
};

const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "Test Project 1",
    description: "A test project",
    technologies: ["React", "TypeScript"],
    images: ["/test-image-1.jpg"],
    featured: false,
    date: "2024-01-01",
  },
  {
    id: "project-2",
    title: "Test Project 2",
    description: "Another test project",
    technologies: ["Next.js", "Tailwind"],
    images: ["/test-image-2.jpg"],
    featured: true,
    date: "2024-01-02",
  },
];

const mockSkills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "advanced" },
      { name: "TypeScript", level: "advanced" },
      { name: "Next.js", level: "intermediate" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: "intermediate" },
      { name: "Python", level: "beginner" },
    ],
  },
];

describe("Responsive Layout Integration Tests", () => {
  const renderWithIntl = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        <NextIntlClientProvider locale="en" messages={messages}>
          {component}
        </NextIntlClientProvider>
      </ThemeProvider>
    );
  };

  describe("Mobile layout (< 768px)", () => {
    it("Header should have mobile-specific classes", () => {
      const { container } = renderWithIntl(<Header locale="en" />);

      // Note: In JSDOM, window.innerWidth defaults to desktop size
      // So the hamburger button won't render, but we can verify responsive structure
      // The desktop nav should be present
      const desktopNav = container.querySelector('nav[aria-label="Main navigation"]');
      expect(desktopNav).toBeInTheDocument();

      // Verify header container has responsive padding classes (on the inner div)
      const headerContent = container.querySelector("header > div");
      expect(headerContent?.className).toMatch(/px-4/);
    });

    it("TechStackSection should have single-column grid on mobile", () => {
      const { container } = renderWithIntl(<TechStackSection />);

      const grid = container.querySelector('[data-testid="tech-stack-grid"]');
      expect(grid).toHaveClass("grid-cols-1");
    });

    it("Components should have mobile padding classes", () => {
      const { container } = renderWithIntl(<TechStackSection />);

      // Check for responsive padding (px-4, sm:px-6, lg:px-8)
      const section = container.querySelector("section");
      expect(section?.className).toMatch(/px-4/);
    });
  });

  describe("Tablet layout (768px - 1024px)", () => {
    it("TechStackSection should have 2-column grid on tablet", () => {
      const { container } = renderWithIntl(<TechStackSection />);

      const grid = container.querySelector('[data-testid="tech-stack-grid"]');
      expect(grid).toHaveClass("md:grid-cols-2");
    });

    it("Header should have tablet padding classes", () => {
      const { container } = renderWithIntl(<Header locale="en" />);

      const headerContent = container.querySelector('[class*="sm:px-6"]');
      expect(headerContent).toBeInTheDocument();
    });

    it("ProjectsSection should have 2-column grid on tablet", () => {
      const { container } = renderWithIntl(<ProjectsSection projects={mockProjects} locale="en" />);

      const grid = container.querySelector('[class*="sm:grid-cols-2"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Desktop layout (> 1024px)", () => {
    it("TechStackSection should have 3-column grid on desktop", () => {
      const { container } = renderWithIntl(<TechStackSection />);

      const grid = container.querySelector('[data-testid="tech-stack-grid"]');
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("Header should have desktop padding classes", () => {
      const { container } = renderWithIntl(<Header locale="en" />);

      const headerContent = container.querySelector('[class*="lg:px-8"]');
      expect(headerContent).toBeInTheDocument();
    });

    it("ProjectsSection should have 3-column grid on desktop", () => {
      const { container } = renderWithIntl(<ProjectsSection projects={mockProjects} locale="en" />);

      const grid = container.querySelector('[class*="lg:grid-cols-3"]');
      expect(grid).toBeInTheDocument();
    });

    it("SkillsSection should have 3-column grid on desktop", () => {
      const { container } = renderWithIntl(<SkillsSection skills={mockSkills} locale="en" />);

      const grid = container.querySelector('[class*="lg:grid-cols-3"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Responsive breakpoint consistency", () => {
    it("All grid components should follow mobile-first approach", () => {
      const techStack = renderWithIntl(<TechStackSection />);
      const projects = renderWithIntl(<ProjectsSection projects={mockProjects} locale="en" />);
      const skills = renderWithIntl(<SkillsSection skills={mockSkills} locale="en" />);

      // All should have grid layout with responsive columns
      // Mobile-first means starting with single column (grid-cols-1) or having responsive classes
      [techStack, projects, skills].forEach(({ container }) => {
        const grids = container.querySelectorAll('[class*="grid"]');
        expect(grids.length).toBeGreaterThan(0);

        // At least one grid should have responsive column classes (sm:, md:, lg:)
        const hasResponsiveGrid = Array.from(grids).some(
          (grid) =>
            grid.className.includes("sm:grid-cols") ||
            grid.className.includes("md:grid-cols") ||
            grid.className.includes("lg:grid-cols")
        );
        expect(hasResponsiveGrid).toBe(true);
      });
    });

    it("Responsive padding should be consistent across sections", () => {
      const techStack = renderWithIntl(<TechStackSection />);

      const section = techStack.container.querySelector("section");

      // Should have mobile, tablet, and desktop padding
      expect(section?.className).toMatch(/px-4/); // mobile
      expect(section?.className).toMatch(/sm:px-6/); // tablet
      expect(section?.className).toMatch(/lg:px-8/); // desktop
    });
  });

  describe("Touch target sizes for mobile", () => {
    it("Header hamburger button should have adequate touch target", () => {
      const { container } = renderWithIntl(<Header locale="en" />);

      // Note: In JSDOM, window.innerWidth defaults to desktop, so hamburger won't render
      // Instead, verify that interactive elements have adequate sizing
      const buttons = container.querySelectorAll("button");

      // All buttons should exist and have proper sizing classes
      expect(buttons.length).toBeGreaterThan(0);

      // Verify buttons have size classes (w-*, h-*, p-*, etc.)
      buttons.forEach((button) => {
        const hasSize =
          button.className.includes("w-") ||
          button.className.includes("h-") ||
          button.className.includes("p-");
        expect(hasSize).toBe(true);
      });
    });
  });
});
