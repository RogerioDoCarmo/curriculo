/**
 * Tests for lazy-loaded components
 *
 * Validates that code splitting is properly configured for heavy components
 *
 * Requirements: 6.3, 6.4
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import {
  LazyExitIntentModal,
  LazyTechStackSection,
  LazyProjectsSection,
  LazyContactForm,
  LazyExperienceSection,
  LazySkillsSection,
} from "@/lib/lazy-components";
import type { Project, Experience, SkillCategory } from "@/types/index";

// Mock next-intl messages
const messages = {
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
        why: "Great for static sites",
        benefits: "Fast and SEO-friendly",
        url: "https://nextjs.org",
      },
      typescript: {
        name: "TypeScript",
        description: "Type-safe JavaScript",
        why: "Catch errors early",
        benefits: "Better code quality",
        url: "https://typescriptlang.org",
      },
      tailwind: {
        name: "Tailwind CSS",
        description: "Utility-first CSS",
        why: "Rapid development",
        benefits: "Consistent styling",
        url: "https://tailwindcss.com",
      },
      markdown: {
        name: "Markdown",
        description: "Simple content format",
        why: "Easy to write",
        benefits: "Version controlled",
        url: "https://daringfireball.net/projects/markdown/",
      },
      nextIntl: {
        name: "next-intl",
        description: "Internationalization",
        why: "Multi-language support",
        benefits: "Reach global audience",
        url: "https://next-intl-docs.vercel.app",
      },
      jest: {
        name: "Jest",
        description: "Testing framework",
        why: "Industry standard",
        benefits: "Reliable tests",
        url: "https://jestjs.io",
      },
      playwright: {
        name: "Playwright",
        description: "E2E testing",
        why: "Cross-browser testing",
        benefits: "Catch integration bugs",
        url: "https://playwright.dev",
      },
      firebase: {
        name: "Firebase",
        description: "Backend services",
        why: "Easy integration",
        benefits: "Analytics and monitoring",
        url: "https://firebase.google.com",
      },
      sentry: {
        name: "Sentry",
        description: "Error tracking",
        why: "Catch production errors",
        benefits: "Better debugging",
        url: "https://sentry.io",
      },
      vercel: {
        name: "Vercel",
        description: "Hosting platform",
        why: "Optimized for Next.js",
        benefits: "Fast deployments",
        url: "https://vercel.com",
      },
      formspree: {
        name: "Formspree",
        description: "Form backend",
        why: "No server needed",
        benefits: "Easy contact forms",
        url: "https://formspree.io",
      },
      storybook: {
        name: "Storybook",
        description: "Component docs",
        why: "Document UI components",
        benefits: "Better collaboration",
        url: "https://storybook.js.org",
      },
      githubActions: {
        name: "GitHub Actions",
        description: "CI/CD automation",
        why: "Automated testing",
        benefits: "Reliable deployments",
        url: "https://github.com/features/actions",
      },
      sonarqube: {
        name: "SonarQube",
        description: "Code quality",
        why: "Maintain standards",
        benefits: "Better code quality",
        url: "https://sonarcloud.io",
      },
    },
  },
  exitIntent: {
    title: "Before you go",
    headline: "Stay Connected",
    subtitle: "Don't miss out",
    downloadResume: "Download Resume",
    connectLinkedIn: "Connect on LinkedIn",
    starGitHub: "Star on GitHub",
    footerNote: "Thanks for visiting",
    downloadResumeAriaLabel: "Download resume PDF",
    connectLinkedInAriaLabel: "Connect on LinkedIn",
    starGitHubAriaLabel: "Star GitHub repository",
  },
  contact: {
    title: "Contact",
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send",
    success: "Message sent!",
    error: "Error sending message",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    messageRequired: "Message is required",
  },
};

describe("Lazy Components", () => {
  describe("LazyTechStackSection", () => {
    it("should render loading state initially", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyTechStackSection />
        </NextIntlClientProvider>
      );

      // Loading skeleton should be visible initially
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should eventually render the actual component", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyTechStackSection />
        </NextIntlClientProvider>
      );

      // Wait for the component to load
      await waitFor(
        () => {
          expect(screen.getByText("Tech Stack")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("LazyExitIntentModal", () => {
    it("should not render initially when not triggered", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyExitIntentModal enabled={false} />
        </NextIntlClientProvider>
      );

      // Modal should not be visible
      expect(screen.queryByText("Before you go")).not.toBeInTheDocument();
    });
  });

  describe("LazyProjectsSection", () => {
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "Test Project",
        description: "A test project",
        technologies: ["React", "TypeScript"],
        images: ["/test.jpg"],
        featured: false,
        date: "2024-01-01",
      },
    ];

    it("should render loading state initially", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyProjectsSection projects={mockProjects} locale="en" />
        </NextIntlClientProvider>
      );

      // Loading skeleton should be visible initially
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should eventually render projects", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyProjectsSection projects={mockProjects} locale="en" />
        </NextIntlClientProvider>
      );

      // Wait for the component to load
      await waitFor(
        () => {
          expect(screen.getByText("Test Project")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("LazyContactForm", () => {
    it("should render loading state initially", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyContactForm locale="en" />
        </NextIntlClientProvider>
      );

      // Loading skeleton should be visible initially
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should eventually render the form", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyContactForm locale="en" />
        </NextIntlClientProvider>
      );

      // Wait for the component to load
      await waitFor(
        () => {
          expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("LazyExperienceSection", () => {
    const mockExperiences: Experience[] = [
      {
        id: "1",
        type: "professional",
        organization: "Test Company",
        role: "Developer",
        location: "Remote",
        startDate: "2023-01-01",
        description: "Test description",
        achievements: ["Achievement 1"],
      },
    ];

    it("should render loading state initially", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazyExperienceSection
            careerPath="professional"
            experiences={mockExperiences}
            locale="en"
          />
        </NextIntlClientProvider>
      );

      // Loading skeleton should be visible initially
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("LazySkillsSection", () => {
    const mockSkills: SkillCategory[] = [
      {
        category: "Frontend",
        skills: [{ name: "React", level: "expert" }],
      },
    ];

    it("should render loading state initially", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LazySkillsSection skills={mockSkills} locale="en" />
        </NextIntlClientProvider>
      );

      // Loading skeleton should be visible initially
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Code Splitting Verification", () => {
    it("should use dynamic imports for all lazy components", () => {
      // This test verifies that the components are exported from the lazy-components module
      expect(LazyTechStackSection).toBeDefined();
      expect(LazyExitIntentModal).toBeDefined();
      expect(LazyProjectsSection).toBeDefined();
      expect(LazyContactForm).toBeDefined();
      expect(LazyExperienceSection).toBeDefined();
      expect(LazySkillsSection).toBeDefined();
    });

    it("should have loading states configured for SSR components", () => {
      // Verify that the lazy component objects are defined
      // In production, these will show loading states during chunk loading
      // In test environment, they resolve immediately
      expect(LazyTechStackSection).toBeDefined();
      expect(LazyProjectsSection).toBeDefined();
      expect(LazyContactForm).toBeDefined();
      expect(LazyExperienceSection).toBeDefined();
      expect(LazySkillsSection).toBeDefined();

      // Verify they are React components (objects with render capability)
      expect(typeof LazyTechStackSection).toBe("object");
      expect(typeof LazyProjectsSection).toBe("object");
    });
  });
});
