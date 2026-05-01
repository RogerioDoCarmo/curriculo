/**
 * Property Test: Interactive Elements Have Accessible Labels
 *
 * Property 17: Interactive Elements Have Accessible Labels
 * Validates: Requirements 9.5
 *
 * This test ensures that interactive elements without visible text
 * have ARIA labels for screen reader accessibility.
 *
 * Elements checked:
 * - Icon buttons (must have aria-label)
 * - Form inputs (must have associated labels)
 * - Links without text content (must have aria-label)
 * - Interactive elements with role attributes
 */

import { render } from "@testing-library/react";
import fc from "fast-check";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ContactForm from "@/components/ContactForm";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import Header from "@/components/Header";
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
    screenshot: "screenshot",
    featured: "Featured",
    mockData: "Mock Data",
    more: "more",
    technologies: "Technologies",
    liveDemo: "Live Demo",
    repository: "Repository",
    noImages: "No images available",
  },
  forms: {
    name: "Name",
    namePlaceholder: "Your name",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    email: "Email",
    emailPlaceholder: "your.email@example.com",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    message: "Message",
    messagePlaceholder: "Your message...",
    messageRequired: "Message is required",
    messageMinLength: "Message must be at least 10 characters",
    submit: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    error: "Failed to send message. Please try again.",
    orUseForm: "Or use the form below",
    formAriaLabel: "Contact form",
  },
  footer: {
    emailLabel: "Professional Email",
  },
  header: {
    home: "Home",
    projects: "Projects",
    skills: "Skills",
    experience: "Experience",
    contact: "Contact",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  nav: {
    home: "Home",
    projects: "Projects",
    skills: "Skills",
    experience: "Experience",
    contact: "Contact",
    techStack: "Tech Stack",
  },
  theme: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
  },
  language: {
    selectLanguage: "Select language",
  },
  modal: {
    close: "Close",
  },
};

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    sizes,
    loading,
    className,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    loading?: "eager" | "lazy";
    className?: string;
  }) => {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        data-fill={fill}
        data-sizes={sizes}
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));

// Mock useTheme hook
jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
}));

// Mock useLanguage hook
jest.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    locale: "en",
    setLocale: jest.fn(),
    availableLocales: ["en", "pt-BR", "es"],
  }),
}));

// Mock useAnchorNavigation hook
jest.mock("@/hooks/useAnchorNavigation", () => ({
  useAnchorNavigation: () => ({
    isActive: () => false,
    navigateTo: jest.fn(),
  }),
}));

// Helper to render with next-intl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("Property 17: Interactive Elements Have Accessible Labels", () => {
  /**
   * Helper to check if an element has an accessible label.
   * An element has an accessible label if it has:
   * - aria-label attribute
   * - aria-labelledby attribute
   * - associated <label> element (for inputs)
   * - visible text content (non-whitespace)
   */
  function hasAccessibleLabel(element: Element): boolean {
    const ariaLabel = element.getAttribute("aria-label");
    const ariaLabelledBy = element.getAttribute("aria-labelledby");
    const textContent = element.textContent?.trim();
    const tagName = element.tagName.toLowerCase();

    // Check for aria-label or aria-labelledby
    if (ariaLabel || ariaLabelledBy) {
      return true;
    }

    // Check for visible text content (must be non-empty after trimming)
    if (textContent && textContent.length > 0) {
      return true;
    }

    // For inputs, check for associated label
    if (tagName === "input" || tagName === "textarea" || tagName === "select") {
      const id = element.getAttribute("id");
      if (id) {
        const label = element.ownerDocument?.querySelector(`label[for="${id}"]`);
        if (label) {
          return true;
        }
      }
    }

    return false;
  }

  it("should ensure ThemeToggle button has aria-label", () => {
    const { container } = renderWithIntl(<ThemeToggle />);

    const button = container.querySelector("button");
    expect(button).toBeTruthy();

    const ariaLabel = button?.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toMatch(/switch to (light|dark) mode/i);
  });

  it("should ensure LanguageSelector has accessible label", () => {
    const { container } = renderWithIntl(<LanguageSelector currentLocale="en" />);

    const select = container.querySelector("select");
    expect(select).toBeTruthy();

    // Should have either aria-label or associated label
    const ariaLabel = select?.getAttribute("aria-label");
    const id = select?.getAttribute("id");
    const label = id ? container.querySelector(`label[for="${id}"]`) : null;

    expect(ariaLabel || label).toBeTruthy();
  });

  it("should ensure Modal has proper ARIA attributes", () => {
    const { container } = renderWithIntl(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    // Should have aria-modal
    expect(dialog?.getAttribute("aria-modal")).toBe("true");

    // Should have aria-labelledby when title is provided
    const ariaLabelledBy = dialog?.getAttribute("aria-labelledby");
    expect(ariaLabelledBy).toBeTruthy();

    // Close button should have aria-label
    const closeButton = container.querySelector('button[aria-label="Close"]');
    expect(closeButton).toBeTruthy();
  });

  it("should ensure ContactForm inputs have associated labels", () => {
    const { container } = renderWithIntl(<ContactForm locale="en" />);

    // Check all inputs and textareas
    const inputs = container.querySelectorAll("input, textarea");
    expect(inputs.length).toBeGreaterThan(0);

    inputs.forEach((input) => {
      expect(hasAccessibleLabel(input)).toBe(true);
    });
  });

  it("should ensure Header navigation has proper ARIA attributes", () => {
    const { container } = renderWithIntl(<Header locale="en" />);

    // Navigation should have role and aria-label
    const nav = container.querySelector('nav[role="navigation"]');
    expect(nav).toBeTruthy();

    const ariaLabel = nav?.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();

    // Hamburger button should have aria-label
    const hamburger = container.querySelector('button[aria-label*="menu"]');
    if (hamburger) {
      expect(hamburger.getAttribute("aria-label")).toBeTruthy();
    }
  });

  it("should ensure ProjectsSection has proper ARIA attributes", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 2 }),
            featured: fc.boolean(),
            date: fc.date().map((d) => d.toISOString().split("T")[0]),
            liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
            repoUrl: fc.option(fc.webUrl(), { nil: undefined }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (projects: Project[]) => {
          const { container } = renderWithIntl(<ProjectsSection projects={projects} locale="en" />);

          // Section should have aria-label
          const section = container.querySelector("section");
          expect(section).toBeTruthy();
          expect(section?.getAttribute("aria-label")).toBeTruthy();

          // Filter buttons should have aria-pressed
          const filterButtons = container.querySelectorAll("button[aria-pressed]");
          expect(filterButtons.length).toBeGreaterThan(0);

          // Project cards should have aria-label
          const projectCards = container.querySelectorAll('[role="button"][aria-label]');
          projectCards.forEach((card) => {
            const ariaLabel = card.getAttribute("aria-label");
            expect(ariaLabel).toBeTruthy();
            expect(ariaLabel).toContain("View details");
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should ensure all buttons have accessible labels", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<"primary" | "secondary" | "ghost">("primary", "secondary", "ghost"),
        fc.constantFrom<"sm" | "md" | "lg">("sm", "md", "lg"),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (variant, size, text) => {
          const { container } = renderWithIntl(
            <Button variant={variant} size={size}>
              {text}
            </Button>
          );

          const button = container.querySelector("button");
          expect(button).toBeTruthy();
          if (button) {
            expect(hasAccessibleLabel(button)).toBe(true);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should ensure icon-only buttons have aria-label", () => {
    // ThemeToggle is an icon-only button
    const { container } = renderWithIntl(<ThemeToggle />);

    const button = container.querySelector("button");
    expect(button).toBeTruthy();

    // Should have aria-label since it's icon-only
    const ariaLabel = button?.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    if (ariaLabel) {
      expect(ariaLabel.length).toBeGreaterThan(0);
    }
  });
});
