/**
 * Unit tests for TechStackSection component
 *
 * Tests:
 * - All technology items are displayed
 * - Categories are organized correctly
 * - Descriptions are non-technical and understandable
 * - Responsive layout behavior
 * - Accessibility features
 *
 * Requirements: 23.1, 23.2, 23.5, 23.8, 23.9
 */

import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import TechStackSection from "@/components/TechStackSection";

const messages = {
  techStack: {
    title: "Tech Stack",
    subtitle: "Technologies used to build this website",
    categories: {
      framework: "Framework & Core Technologies",
      styling: "Styling & Design",
      content: "Content Management",
      internationalization: "Internationalization",
      testing: "Testing & Quality",
      analytics: "Analytics & Monitoring",
      deployment: "Deployment & Hosting",
    },
    technologies: {
      nextjs: {
        name: "Next.js",
        description: "A React framework that makes building websites faster and easier",
        why: "Chosen for its excellent performance and developer experience",
        benefits: "Fast page loads, automatic improvements, easy deployment",
        url: "https://nextjs.org",
      },
      typescript: {
        name: "TypeScript",
        description: "A programming language that helps catch errors before they happen",
        why: "Chosen for better code quality and developer experience",
        benefits: "Fewer bugs, better editor support, easier refactoring",
        url: "https://www.typescriptlang.org",
      },
      tailwind: {
        name: "Tailwind CSS",
        description: "A styling tool that helps create beautiful designs quickly",
        why: "Chosen for rapid development and consistent design",
        benefits: "Clean code, responsive design, easy customization",
        url: "https://tailwindcss.com",
      },
      markdown: {
        name: "Markdown",
        description: "A simple way to write and format content",
        why: "Chosen for easy content updates without coding",
        benefits: "Simple syntax, version control friendly, portable",
        url: "https://daringfireball.net/projects/markdown",
      },
      nextIntl: {
        name: "next-intl",
        description: "A tool that translates the website into multiple languages",
        why: "Chosen for seamless multi-language support",
        benefits: "Easy translations, automatic language detection, SEO friendly",
        url: "https://next-intl-docs.vercel.app",
      },
      jest: {
        name: "Jest",
        description: "A testing tool that ensures code works correctly",
        why: "Chosen for comprehensive testing capabilities",
        benefits: "Fast tests, good error messages, wide adoption",
        url: "https://jestjs.io",
      },
      playwright: {
        name: "Playwright",
        description: "A tool for testing websites in real browsers automatically",
        why: "Chosen for reliable end-to-end testing",
        benefits: "Cross-browser testing, fast execution, easy debugging",
        url: "https://playwright.dev",
      },
      firebase: {
        name: "Firebase",
        description: "A platform that tracks website usage and sends notifications",
        why: "Chosen for powerful analytics and engagement features",
        benefits: "Real-time data, easy integration, reliable service",
        url: "https://firebase.google.com",
      },
      sentry: {
        name: "Sentry",
        description: "A tool that monitors and reports errors on the website",
        why: "Chosen for reliable error tracking and monitoring",
        benefits: "Real-time alerts, detailed error reports, easy integration",
        url: "https://sentry.io",
      },
      vercel: {
        name: "Vercel",
        description: "A hosting service that makes the website fast and available worldwide",
        why: "Chosen for excellent performance and automatic deployments",
        benefits: "Global CDN, automatic HTTPS, zero configuration",
        url: "https://vercel.com",
      },
      formspree: {
        name: "Formspree",
        description: "A service that handles contact form submissions without a backend",
        why: "Chosen for simple and reliable form handling",
        benefits: "No backend needed, spam protection, email notifications",
        url: "https://formspree.io",
      },
      storybook: {
        name: "Storybook",
        description: "A tool for building and testing UI components in isolation",
        why: "Chosen for better component development and documentation",
        benefits: "Visual testing, component documentation, easy collaboration",
        url: "https://storybook.js.org",
      },
      githubActions: {
        name: "GitHub Actions",
        description: "A tool that automates testing and deployment workflows",
        why: "Chosen for seamless CI/CD integration with GitHub",
        benefits: "Automated testing, easy deployment, free for open source",
        url: "https://github.com/features/actions",
      },
      sonarqube: {
        name: "SonarQube",
        description: "A tool that checks code quality and security automatically",
        why: "Chosen for maintaining high code quality standards",
        benefits: "Code quality metrics, security scanning, technical debt tracking",
        url: "https://www.sonarqube.org",
      },
    },
  },
};

describe("TechStackSection", () => {
  const renderComponent = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TechStackSection />
      </NextIntlClientProvider>
    );
  };

  describe("Content Display", () => {
    it("should display the section title", () => {
      renderComponent();
      expect(screen.getByText("Tech Stack")).toBeInTheDocument();
    });

    it("should display the section subtitle", () => {
      renderComponent();
      expect(screen.getByText("Technologies used to build this website")).toBeInTheDocument();
    });

    it("should display all technology categories", () => {
      renderComponent();

      expect(screen.getByText("Framework & Core Technologies")).toBeInTheDocument();
      expect(screen.getByText("Styling & Design")).toBeInTheDocument();
      expect(screen.getByText("Content Management")).toBeInTheDocument();
      expect(screen.getByText("Internationalization")).toBeInTheDocument();
      expect(screen.getByText("Testing & Quality")).toBeInTheDocument();
      expect(screen.getByText("Analytics & Monitoring")).toBeInTheDocument();
      expect(screen.getByText("Deployment & Hosting")).toBeInTheDocument();
    });

    it("should display all technology items", () => {
      renderComponent();

      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
      expect(screen.getByText("Markdown")).toBeInTheDocument();
      expect(screen.getByText("next-intl")).toBeInTheDocument();
      expect(screen.getByText("Jest")).toBeInTheDocument();
      expect(screen.getByText("Firebase")).toBeInTheDocument();
      expect(screen.getByText("Vercel")).toBeInTheDocument();
    });

    it("should display technology descriptions", () => {
      renderComponent();

      expect(
        screen.getByText(/A React framework that makes building websites faster/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/A styling tool that helps create beautiful designs/)
      ).toBeInTheDocument();
    });

    it('should display "Why chosen" explanations', () => {
      renderComponent();

      expect(screen.getByText(/Chosen for its excellent performance/)).toBeInTheDocument();
      expect(screen.getByText(/Chosen for rapid development/)).toBeInTheDocument();
    });

    it("should display benefits", () => {
      renderComponent();

      expect(screen.getByText(/Fast page loads/)).toBeInTheDocument();
      expect(screen.getByText(/Clean code/)).toBeInTheDocument();
    });
  });

  describe("Organization", () => {
    it("should organize technologies by category", () => {
      const { container } = renderComponent();

      // Check that categories exist as section containers
      const categories = container.querySelectorAll("[data-category]");
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should group related technologies together", () => {
      renderComponent();

      // Next.js should be in Framework category
      const nextjsElement = screen.getByText("Next.js").closest("[data-category]");
      expect(nextjsElement).toHaveAttribute("data-category", "framework");

      // Tailwind should be in Styling category
      const tailwindElement = screen.getByText("Tailwind CSS").closest("[data-category]");
      expect(tailwindElement).toHaveAttribute("data-category", "styling");
    });
  });

  describe("Non-Technical Language", () => {
    it("should use simple, understandable descriptions", () => {
      renderComponent();

      // Check that descriptions avoid technical jargon
      const description = screen.getByText(/A React framework that makes building websites faster/);
      expect(description.textContent).not.toMatch(/SSR|SSG|hydration|bundle/i);
    });

    it("should explain benefits in plain language", () => {
      renderComponent();

      const benefits = screen.getByText(/Fast page loads/);
      expect(benefits.textContent).not.toMatch(/optimization|minification|tree-shaking/i);
    });
  });

  describe("Responsive Layout", () => {
    it("should have responsive grid classes", () => {
      const { container } = renderComponent();

      const grid = container.querySelector('[data-testid="tech-stack-grid"]');
      expect(grid).toHaveClass(/grid/);
      expect(grid).toHaveClass(/md:/); // Has medium breakpoint classes
    });

    it("should have responsive card layout", () => {
      const { container } = renderComponent();

      const cards = container.querySelectorAll('[data-testid="tech-card"]');
      expect(cards.length).toBeGreaterThan(0);

      // Cards should exist and be properly structured
      cards.forEach((card) => {
        expect(card.tagName).toBe("ARTICLE");
        expect(card.className).toBeTruthy();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      const { container } = renderComponent();

      // Main title should be h2
      const mainHeading = container.querySelector("h2");
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent("Tech Stack");

      // Category headings should be h3
      const categoryHeadings = container.querySelectorAll("h3");
      expect(categoryHeadings.length).toBeGreaterThan(0);
    });

    it("should have ARIA labels for the section", () => {
      const { container } = renderComponent();

      const section = container.querySelector("section");
      expect(section).toHaveAttribute("aria-labelledby");
    });

    it("should have semantic HTML structure", () => {
      const { container } = renderComponent();

      // Should use section element
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();

      // Should use article elements for tech items
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("should have accessible links with proper attributes", () => {
      const { container } = renderComponent();

      const links = container.querySelectorAll('a[href^="http"]');
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("Theme Compatibility", () => {
    it("should have dark mode classes", () => {
      const { container } = renderComponent();

      // Check for dark: variant classes
      const elementsWithDarkMode = container.querySelectorAll('[class*="dark:"]');
      expect(elementsWithDarkMode.length).toBeGreaterThan(0);
    });
  });

  describe("Print Media", () => {
    it("should not have print:hidden class on main content", () => {
      const { container } = renderComponent();

      const section = container.querySelector("section");
      expect(section).not.toHaveClass("print:hidden");
    });
  });
});
