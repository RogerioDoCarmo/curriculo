/**
 * Unit tests for BackToTopButton component
 * TDD Red phase - tests written before implementation
 *
 * Component location: components/BackToTopButton/index.tsx
 * Props: { className?: string, threshold?: number }
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackToTopButton from "@/components/BackToTopButton";

// Mock useTheme hook
jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn(), toggleTheme: jest.fn() }),
}));

// Mock window.scrollTo
const scrollToMock = jest.fn();
Object.defineProperty(window, "scrollTo", {
  value: scrollToMock,
  writable: true,
});

// Helper: simulate a scroll event at a given Y position
function simulateScroll(scrollY: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true });
  fireEvent.scroll(window);
}

describe("BackToTopButton Component", () => {
  beforeEach(() => {
    scrollToMock.mockClear();
    // Reset scroll position to top before each test
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  // 1. Button is hidden when at top of page (scroll position = 0)
  it("should be hidden when at top of page (scrollY = 0)", () => {
    render(<BackToTopButton />);
    const button = screen.queryByRole("button", { name: /back to top/i });
    // Button should not be visible / not in DOM when at top
    expect(button).not.toBeInTheDocument();
  });

  // 2. Button appears after scrolling past threshold (default 300px)
  it("should appear after scrolling past default threshold of 300px", async () => {
    render(<BackToTopButton />);

    simulateScroll(301);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });
  });

  // 3. Button is hidden again when scrolling back to top
  it("should hide again when scrolling back to top after appearing", async () => {
    render(<BackToTopButton />);

    // Scroll down past threshold
    simulateScroll(400);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });

    // Scroll back to top
    simulateScroll(0);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /back to top/i })).not.toBeInTheDocument();
    });
  });

  // 4. Clicking button calls window.scrollTo with smooth behavior
  it("should call window.scrollTo with smooth behavior when clicked", async () => {
    const user = userEvent.setup();
    render(<BackToTopButton />);

    simulateScroll(400);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /back to top/i }));

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: "smooth" })
    );
  });

  // 5. Button is keyboard accessible (has tabIndex, responds to Enter key)
  it("should be keyboard accessible with tabIndex and respond to Enter key", async () => {
    render(<BackToTopButton />);

    simulateScroll(400);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).toHaveAttribute("tabIndex", "0");

    // Simulate Enter key press
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith(
        expect.objectContaining({ top: 0, behavior: "smooth" })
      );
    });
  });

  // 6. Button has ARIA label for screen readers
  it("should have an ARIA label for screen readers", async () => {
    render(<BackToTopButton />);

    simulateScroll(400);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).toHaveAttribute("aria-label");
    expect(button.getAttribute("aria-label")).toMatch(/back to top/i);
  });

  // 7. Button accepts custom threshold prop
  it("should accept a custom threshold prop and appear only after that threshold", async () => {
    render(<BackToTopButton threshold={500} />);

    // Below custom threshold — should not appear
    simulateScroll(400);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /back to top/i })).not.toBeInTheDocument();
    });

    // At/above custom threshold — should appear
    simulateScroll(501);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });
  });

  // 8. Button has correct CSS class for print media hiding (print:hidden)
  it("should have print:hidden Tailwind class to hide in print media", async () => {
    render(<BackToTopButton />);

    simulateScroll(400);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button.className).toMatch(/print:hidden/);
  });
});
