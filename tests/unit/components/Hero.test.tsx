/**
 * Unit tests for Hero component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero Component", () => {
  const defaultProps = {
    name: "John Doe",
    title: "React Native Developer",
    locale: "en",
  };

  it("renders the developer name as h1", () => {
    render(<Hero {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("John Doe");
  });

  it("renders the professional title", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("React Native Developer")).toBeInTheDocument();
  });

  it("renders a call-to-action link pointing to #projects", () => {
    render(<Hero {...defaultProps} />);
    const cta = screen.getByRole("link", { name: /view my work/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#projects");
  });

  it("renders the hero section with correct id", () => {
    render(<Hero {...defaultProps} />);
    const section = document.getElementById("home");
    expect(section).toBeInTheDocument();
  });

  it("has accessible section label", () => {
    render(<Hero {...defaultProps} />);
    const section = screen.getByRole("region", { name: /hero/i });
    expect(section).toBeInTheDocument();
  });

  it("renders with different name and title", () => {
    render(<Hero name="Jane Smith" title="Full Stack Engineer" locale="pt-BR" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jane Smith");
    expect(screen.getByText("Full Stack Engineer")).toBeInTheDocument();
  });

  it("applies animation class for fade-in effect", () => {
    render(<Hero {...defaultProps} />);
    // The animated container should have the animate-fade-in class
    const container = screen.getByRole("heading", { level: 1 }).closest("div");
    expect(container?.className).toMatch(/animate-fade-in/);
  });
});
