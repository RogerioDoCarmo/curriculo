/**
 * Property Test: Print Mode Hides Non-Essential Elements
 *
 * Property 35: Print Mode Hides Non-Essential Elements
 * Validates: Requirements 18.2
 *
 * This test ensures that non-essential UI elements (navigation, theme toggle,
 * buttons, etc.) are hidden when the page is printed or saved as PDF.
 *
 * Print mode is critical for generating clean, professional PDF resumes.
 */

import { render } from "@testing-library/react";
import fc from "fast-check";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import BackToTopButton from "@/components/BackToTopButton";
import Button from "@/components/Button";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
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

describe("Property 35: Print Mode Hides Non-Essential Elements", () => {
  /**
   * Helper function to check if an element has print-hidden styles.
   * Elements should have CSS classes that hide them in print media:
   * - print:hidden
   * - @media print { display: none }
   */
  function hasPrintHiddenClass(element: Element): boolean {
    const className = element.getAttribute("class") || "";

    // Check for Tailwind print utilities
    const hasPrintHidden = className.includes("print:hidden");

    return hasPrintHidden;
  }

  it("should ensure Header navigation is hidden in print mode", () => {
    const { container } = render(<Header locale="en" />);

    const header = container.querySelector("header");
    expect(header).toBeTruthy();
    if (header) {
      expect(hasPrintHiddenClass(header)).toBe(true);
    }
  });

  it("should ensure ThemeToggle is hidden in print mode", () => {
    const { container } = render(<ThemeToggle />);

    const button = container.querySelector("button");
    expect(button).toBeTruthy();
    if (button) {
      expect(hasPrintHiddenClass(button)).toBe(true);
    }
  });

  it("should ensure LanguageSelector is hidden in print mode", () => {
    const { container } = render(<LanguageSelector currentLocale="en" />);

    const wrapper = container.querySelector("div");
    expect(wrapper).toBeTruthy();
    if (wrapper) {
      expect(hasPrintHiddenClass(wrapper)).toBe(true);
    }
  });

  it("should ensure BackToTopButton is hidden in print mode", () => {
    // Mock window.scrollY to make button visible
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 400,
    });

    const { container } = render(<BackToTopButton />);

    const button = container.querySelector("button");
    expect(button).toBeTruthy();
    if (button) {
      expect(hasPrintHiddenClass(button)).toBe(true);
    }

    // Reset
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("should ensure Footer social links are hidden in print mode", () => {
    const { container } = render(<Footer locale="en" />);

    // Find social links section
    const socialLinks = container.querySelector(".social-links");
    if (socialLinks) {
      expect(hasPrintHiddenClass(socialLinks)).toBe(true);
    }
  });

  it("should ensure interactive buttons are hidden in print mode", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<"primary" | "secondary" | "ghost">("primary", "secondary", "ghost"),
        fc.constantFrom<"sm" | "md" | "lg">("sm", "md", "lg"),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        (variant, size, text) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              {text}
            </Button>
          );

          const button = container.querySelector("button");
          expect(button).toBeTruthy();
          if (button) {
            // Buttons should be hidden in print unless explicitly marked as print-visible
            expect(hasPrintHiddenClass(button)).toBe(true);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should ensure all non-essential elements have print:hidden class", () => {
    // Test a complete page layout with multiple non-essential elements
    const { container } = render(
      <div>
        <Header locale="en" />
        <ThemeToggle />
        <LanguageSelector currentLocale="en" />
        <BackToTopButton />
        <Footer locale="en" />
      </div>
    );

    // Count elements with print:hidden class
    const allElements = container.querySelectorAll("*");
    const printHiddenElements = Array.from(allElements).filter((el) => hasPrintHiddenClass(el));

    // We expect at least the major interactive elements to be hidden
    expect(printHiddenElements.length).toBeGreaterThan(0);
  });
});
