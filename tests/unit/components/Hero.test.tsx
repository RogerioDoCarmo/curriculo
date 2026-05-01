/**
 * Unit tests for Hero component
 */

import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero Component", () => {
  const defaultProps = {
    name: "John Doe",
    title: "React Native Developer",
    locale: "en",
    greeting: "Hello, I'm",
    ctaText: "View My Work",
    contactText: "Get in Touch",
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

  it("renders the greeting text", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
  });

  it("renders translated greeting for Portuguese", () => {
    render(<Hero {...defaultProps} locale="pt-BR" greeting="Olá, eu sou" />);
    expect(screen.getByText("Olá, eu sou")).toBeInTheDocument();
  });

  it("renders translated greeting for Spanish", () => {
    render(<Hero {...defaultProps} locale="es" greeting="Hola, soy" />);
    expect(screen.getByText("Hola, soy")).toBeInTheDocument();
  });

  it("renders a call-to-action link pointing to #projects", () => {
    render(<Hero {...defaultProps} />);
    const cta = screen.getByRole("link", { name: "View My Work" });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#projects");
  });

  it("renders translated CTA text for Portuguese", () => {
    render(<Hero {...defaultProps} ctaText="Ver Meu Trabalho" />);
    const cta = screen.getByRole("link", { name: "Ver Meu Trabalho" });
    expect(cta).toBeInTheDocument();
  });

  it("renders translated CTA text for Spanish", () => {
    render(<Hero {...defaultProps} ctaText="Ver Mi Trabajo" />);
    const cta = screen.getByRole("link", { name: "Ver Mi Trabajo" });
    expect(cta).toBeInTheDocument();
  });

  it("renders contact button with translated text", () => {
    render(<Hero {...defaultProps} />);
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
    expect(emailButton).toBeInTheDocument();
  });

  it("renders translated contact button for Portuguese", () => {
    render(<Hero {...defaultProps} contactText="Entre em Contato" />);
    const emailButton = screen.getByRole("link", { name: "Entre em Contato" });
    expect(emailButton).toBeInTheDocument();
  });

  it("renders translated contact button for Spanish", () => {
    render(<Hero {...defaultProps} contactText="Ponte en Contacto" />);
    const emailButton = screen.getByRole("link", { name: "Ponte en Contacto" });
    expect(emailButton).toBeInTheDocument();
  });

  it("contact button has mailto link with correct email for English locale", () => {
    render(<Hero {...defaultProps} locale="en" />);
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("contact button has mailto link with correct email for Portuguese locale", () => {
    render(<Hero {...defaultProps} locale="pt-BR" contactText="Entre em Contato" />);
    const emailButton = screen.getByRole("link", { name: "Entre em Contato" });
    expect(emailButton).toHaveAttribute("href", "mailto:contato@rogeriodocarmo.com");
  });

  it("contact button has mailto link with correct email for Spanish locale", () => {
    render(<Hero {...defaultProps} locale="es" contactText="Ponte en Contacto" />);
    const emailButton = screen.getByRole("link", { name: "Ponte en Contacto" });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("contact button has email icon with aria-hidden", () => {
    render(<Hero {...defaultProps} />);
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
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
    render(
      <Hero
        name="Jane Smith"
        title="Full Stack Engineer"
        locale="pt-BR"
        greeting="Olá, eu sou"
        ctaText="Ver Meu Trabalho"
        contactText="Entre em Contato"
      />
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jane Smith");
    expect(screen.getByText("Full Stack Engineer")).toBeInTheDocument();
  });

  it("applies animation class for fade-in effect", () => {
    render(<Hero {...defaultProps} />);
    const section = screen.getByRole("region", { name: /hero/i });
    const animatedDiv = section.querySelector(".animate-fade-in");
    expect(animatedDiv).toBeInTheDocument();
  });

  it("renders profile photo with correct alt text", () => {
    render(<Hero {...defaultProps} />);
    const photo = screen.getByRole("img", { name: /rogério do carmo/i });
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", expect.stringContaining("rogeriodocarmo.png"));
  });

  it("profile photo has rounded-full class for circular display", () => {
    render(<Hero {...defaultProps} />);
    const photo = screen.getByRole("img", { name: /rogério do carmo/i });
    expect(photo.className).toMatch(/rounded-full/);
  });

  it("all required props are provided", () => {
    const { container } = render(<Hero {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("does not render without required translation props", () => {
    // TypeScript should prevent this, but test runtime behavior
    const incompleteProps = {
      name: "John Doe",
      title: "Developer",
      locale: "en",
    } as any;

    const { container } = render(<Hero {...incompleteProps} />);
    // Component should still render but with undefined text
    expect(container.firstChild).toBeInTheDocument();
  });
});
