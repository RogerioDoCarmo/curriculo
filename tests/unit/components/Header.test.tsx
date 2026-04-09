/**
 * Integration tests for Header component — responsive navigation
 *
 * TDD RED phase: these tests are written BEFORE the Header component exists.
 * All tests are expected to fail until the component is implemented.
 *
 * Tests cover:
 * - Responsive layout (mobile sidebar vs desktop navbar)
 * - Hamburger menu toggle
 * - Sidebar close on nav link click
 * - Sidebar close on backdrop click
 * - Presence of LanguageSelector and ThemeToggle
 * - Navigation links: Home, Projects, Experience, Skills, Contact, Tech Stack
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.experience": "Experience",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "nav.techStack": "Tech Stack",
    };
    return translations[key] ?? key;
  },
}));

// Mock useAnchorNavigation hook
jest.mock("@/hooks/useAnchorNavigation", () => ({
  useAnchorNavigation: () => ({
    currentSection: "",
    navigateTo: jest.fn(),
    isActive: () => false,
  }),
}));

// Mock useTheme so ThemeToggle renders without a provider
jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useLanguage so LanguageSelector renders without side-effects
jest.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    locale: "en",
    setLocale: jest.fn(),
    availableLocales: ["en", "pt-BR", "es"],
  }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Set window.innerWidth and fire a resize event. */
function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
}

const DEFAULT_LOCALE = "en";

function renderHeader() {
  return render(<Header locale={DEFAULT_LOCALE} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Header — responsive navigation", () => {
  afterEach(() => {
    // Reset to a desktop-like width after each test
    setViewportWidth(1280);
  });

  // -------------------------------------------------------------------------
  // 1. Mobile menu appears at viewport < 768px
  // -------------------------------------------------------------------------
  it("shows mobile hamburger button at viewport < 768px", () => {
    setViewportWidth(375);
    renderHeader();

    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });
    expect(hamburger).toBeInTheDocument();
  });

  it("hides desktop nav at viewport < 768px", () => {
    setViewportWidth(375);
    renderHeader();

    // Desktop nav should not be visible (hidden via CSS class or not rendered)
    const desktopNav = screen.queryByRole("navigation", { name: /desktop/i });
    expect(desktopNav).not.toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 2. Desktop nav appears at viewport >= 1024px
  // -------------------------------------------------------------------------
  it("shows desktop navigation at viewport >= 1024px", () => {
    setViewportWidth(1280);
    renderHeader();

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("does not show hamburger button at viewport >= 1024px", () => {
    setViewportWidth(1280);
    renderHeader();

    const hamburger = screen.queryByRole("button", { name: /open menu|toggle menu|menu/i });
    // Either not in DOM or hidden — we check it's not visible
    if (hamburger) {
      expect(hamburger).not.toBeVisible();
    } else {
      expect(hamburger).not.toBeInTheDocument();
    }
  });

  // -------------------------------------------------------------------------
  // 3. Hamburger menu button toggles sidebar open/closed
  // -------------------------------------------------------------------------
  it("opens sidebar when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    setViewportWidth(375);
    renderHeader();

    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });
    await user.click(hamburger);

    await waitFor(() => {
      const sidebar = screen.getByRole("dialog", { name: /navigation|menu/i });
      expect(sidebar).toBeInTheDocument();
    });
  });

  it("closes sidebar when hamburger button is clicked again", async () => {
    const user = userEvent.setup();
    setViewportWidth(375);
    renderHeader();

    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });

    // Open
    await user.click(hamburger);
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /navigation|menu/i })).toBeInTheDocument();
    });

    // Close
    await user.click(hamburger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /navigation|menu/i })).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 4. Sidebar closes when a nav link is clicked
  // -------------------------------------------------------------------------
  it("closes sidebar when a navigation link is clicked", async () => {
    const user = userEvent.setup();
    setViewportWidth(375);
    renderHeader();

    // Open sidebar
    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });
    await user.click(hamburger);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /navigation|menu/i })).toBeInTheDocument();
    });

    // Click a nav link inside the sidebar
    const projectsLink = screen.getByRole("link", { name: /projects/i });
    await user.click(projectsLink);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /navigation|menu/i })).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 5. Sidebar closes when backdrop is clicked
  // -------------------------------------------------------------------------
  it("closes sidebar when backdrop is clicked", async () => {
    const user = userEvent.setup();
    setViewportWidth(375);
    renderHeader();

    // Open sidebar
    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });
    await user.click(hamburger);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /navigation|menu/i })).toBeInTheDocument();
    });

    // Click the backdrop
    const backdrop = screen.getByTestId("sidebar-backdrop");
    await user.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /navigation|menu/i })).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 6. LanguageSelector and ThemeToggle are present in header
  // -------------------------------------------------------------------------
  it("renders LanguageSelector in the header", () => {
    renderHeader();

    const languageSelector = screen.getByRole("combobox", { name: /select language/i });
    expect(languageSelector).toBeInTheDocument();
  });

  it("renders ThemeToggle in the header", () => {
    renderHeader();

    const themeToggle = screen.getByRole("button", {
      name: /switch to dark mode|switch to light mode/i,
    });
    expect(themeToggle).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 7. Navigation links: Home, Projects, Experience, Skills, Contact, Tech Stack
  // -------------------------------------------------------------------------
  it("renders all navigation links on desktop", () => {
    setViewportWidth(1280);
    renderHeader();

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tech stack/i })).toBeInTheDocument();
  });

  it("renders all navigation links inside mobile sidebar", async () => {
    const user = userEvent.setup();
    setViewportWidth(375);
    renderHeader();

    // Open sidebar to reveal nav links
    const hamburger = screen.getByRole("button", { name: /open menu|toggle menu|menu/i });
    await user.click(hamburger);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /navigation|menu/i })).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tech stack/i })).toBeInTheDocument();
  });

  it("navigation links point to correct anchor hrefs", () => {
    setViewportWidth(1280);
    renderHeader();

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#home")
    );
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#projects")
    );
    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#experience")
    );
    expect(screen.getByRole("link", { name: /skills/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#skills")
    );
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#contact")
    );
    expect(screen.getByRole("link", { name: /tech stack/i })).toHaveAttribute(
      "href",
      expect.stringContaining("#tech-stack")
    );
  });
});
