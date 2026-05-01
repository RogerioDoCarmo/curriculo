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

  it("renders 'Get in Touch' email button", () => {
    render(<Hero {...defaultProps} />);
    const emailButton = screen.getByRole("link", { name: /get in touch/i });
    expect(emailButton).toBeInTheDocument();
  });

  it("'Get in Touch' button has mailto link with correct email for English locale", () => {
    render(<Hero {...defaultProps} locale="en" />);
    const emailButton = screen.getByRole("link", { name: /get in touch/i });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("'Get in Touch' button has mailto link with correct email for Portuguese locale", () => {
    render(<Hero {...defaultProps} locale="pt-BR" />);
    const emailButton = screen.getByRole("link", { name: /get in touch/i });
    expect(emailButton).toHaveAttribute("href", "mailto:contato@rogeriodocarmo.com");
  });

  it("'Get in Touch' button has mailto link with correct email for Spanish locale", () => {
    render(<Hero {...defaultProps} locale="es" />);
    const emailButton = screen.getByRole("link", { name: /get in touch/i });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("'Get in Touch' button has email icon with aria-hidden", () => {
    const { container } = render(<Hero {...defaultProps} />);
    const emailButton = screen.getByRole("link", { name: /get in touch/i });
    const svg = emailButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("displays professional email address below CTA buttons for English locale", () => {
    render(<Hero {...defaultProps} locale="en" />);
    expect(screen.getByText("contact@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("displays professional email address below CTA buttons for Portuguese locale", () => {
    render(<Hero {...defaultProps} locale="pt-BR" />);
    expect(screen.getByText("contato@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("displays professional email address below CTA buttons for Spanish locale", () => {
    render(<Hero {...defaultProps} locale="es" />);
    expect(screen.getByText("contact@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("professional email is a clickable mailto link", () => {
    render(<Hero {...defaultProps} locale="en" />);
    const emailLink = screen.getByRole("link", { name: "contact@rogeriodocarmo.com" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
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
