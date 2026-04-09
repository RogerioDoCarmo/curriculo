/**
 * Unit tests for Button component
 * TDD Red phase - tests written before implementation
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/Button";

describe("Button Component", () => {
  // --- Variants ---
  describe("variants", () => {
    it("should render primary variant", () => {
      render(
        <Button variant="primary" size="md">
          Click me
        </Button>
      );
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("primary");
    });

    it("should render secondary variant", () => {
      render(
        <Button variant="secondary" size="md">
          Click me
        </Button>
      );
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("secondary");
    });

    it("should render ghost variant", () => {
      render(
        <Button variant="ghost" size="md">
          Click me
        </Button>
      );
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("ghost");
    });
  });

  // --- Sizes ---
  describe("sizes", () => {
    it("should render sm size", () => {
      render(
        <Button variant="primary" size="sm">
          Small
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("sm");
    });

    it("should render md size", () => {
      render(
        <Button variant="primary" size="md">
          Medium
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("md");
    });

    it("should render lg size", () => {
      render(
        <Button variant="primary" size="lg">
          Large
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("lg");
    });
  });

  // --- Children ---
  it("should render children", () => {
    render(
      <Button variant="primary" size="md">
        Hello World
      </Button>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  // --- Click handler ---
  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Click
      </Button>
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // --- Disabled state ---
  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(
        <Button variant="primary" size="md" disabled>
          Disabled
        </Button>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should NOT call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button variant="primary" size="md" disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // --- Loading state ---
  describe("loading state", () => {
    it("should show loading indicator when loading is true", () => {
      render(
        <Button variant="primary" size="md" loading>
          Submit
        </Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      // Loading indicator should be present (spinner or loading text)
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("should be disabled when loading", () => {
      render(
        <Button variant="primary" size="md" loading>
          Submit
        </Button>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should NOT call onClick when loading", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button variant="primary" size="md" loading onClick={handleClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // --- Type attribute ---
  it("should default to type='button'", () => {
    render(
      <Button variant="primary" size="md">
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("should support type='submit'", () => {
    render(
      <Button variant="primary" size="md" type="submit">
        Submit
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("should support type='reset'", () => {
    render(
      <Button variant="primary" size="md" type="reset">
        Reset
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  // --- Custom className ---
  it("should apply custom className", () => {
    render(
      <Button variant="primary" size="md" className="my-custom-class">
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  // --- Accessibility ---
  it("should have correct role (button)", () => {
    render(
      <Button variant="primary" size="md">
        Accessible
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should have focus indicator classes", () => {
    render(
      <Button variant="primary" size="md">
        Focus
      </Button>
    );
    const button = screen.getByRole("button");
    // Focus ring classes (Tailwind focus-visible utilities)
    expect(button.className).toMatch(/focus/);
  });

  // --- Async click interaction ---
  it("should handle async onClick correctly", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Async
      </Button>
    );

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
