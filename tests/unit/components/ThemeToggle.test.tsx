/**
 * Unit tests for ThemeToggle component
 * Tests theme toggle button rendering and interaction
 */

import React, { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/hooks/useTheme";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should render toggle button", () => {
    render(<ThemeToggle />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should show moon icon in light mode", () => {
    render(<ThemeToggle />, { wrapper });
    const icon = screen.getByRole("img", { name: /moon/i });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("🌙");
  });

  it("should show sun icon in dark mode", async () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />, { wrapper });

    // Wait for theme to be applied
    await screen.findByRole("img", { name: /sun/i });
    const icon = screen.getByRole("img", { name: /sun/i });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("☀️");
  });

  it("should have correct aria-label in light mode", () => {
    render(<ThemeToggle />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("should have correct aria-label in dark mode", async () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />, { wrapper });

    await screen.findByRole("img", { name: /sun/i });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("should toggle theme when clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />, { wrapper });

    const button = screen.getByRole("button");

    // Initially light mode (moon icon)
    expect(screen.getByRole("img", { name: /moon/i })).toBeInTheDocument();

    // Click to switch to dark mode
    await user.click(button);

    // Wait for theme to update
    await waitFor(() => {
      expect(screen.getByRole("img", { name: /sun/i })).toBeInTheDocument();
    });
  });

  it("should toggle theme multiple times", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />, { wrapper });

    const button = screen.getByRole("button");

    // Light → Dark
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("img", { name: /sun/i })).toBeInTheDocument();
    });

    // Dark → Light
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("img", { name: /moon/i })).toBeInTheDocument();
    });

    // Light → Dark again
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("img", { name: /sun/i })).toBeInTheDocument();
    });
  });

  it("should accept custom className", () => {
    render(<ThemeToggle className="custom-class" />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should have proper button type", () => {
    render(<ThemeToggle />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("should have title attribute matching aria-label", () => {
    render(<ThemeToggle />, { wrapper });
    const button = screen.getByRole("button");
    const ariaLabel = button.getAttribute("aria-label");
    const title = button.getAttribute("title");
    expect(title).toBe(ariaLabel);
  });

  it("should persist theme change to localStorage", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />, { wrapper });

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });
});
