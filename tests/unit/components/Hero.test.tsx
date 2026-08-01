/**
 * Unit tests for Hero component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import Hero from "@/components/Hero";
import { trackHeroCTAClick, trackExternalLinkClick, trackFooterLinkClick } from "@/lib/analytics";

jest.mock("@/lib/analytics", () => ({
  trackHeroCTAClick: jest.fn(),
  trackExternalLinkClick: jest.fn(),
  trackFooterLinkClick: jest.fn(),
}));

// Helper to render component with next-intl provider
const renderWithIntl = (
  component: React.ReactElement,
  locale: string,
  messages: AbstractIntlMessages = {}
) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("Hero Component", () => {
  const defaultProps = {
    name: "John Doe",
    title: "React Native Developer",
    greeting: "Hello, I'm",
    ctaText: "View My Work",
    contactText: "Get in Touch",
  };

  it("renders the developer name as h1", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("John Doe");
  });

  it("renders the professional title", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("React Native Developer")).toBeInTheDocument();
  });

  it("renders the greeting text", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
  });

  it("renders translated greeting for Portuguese", () => {
    renderWithIntl(<Hero {...defaultProps} greeting="Olá, eu sou" />, "pt-BR");
    expect(screen.getByText("Olá, eu sou")).toBeInTheDocument();
  });

  it("renders translated greeting for Spanish", () => {
    renderWithIntl(<Hero {...defaultProps} greeting="Hola, soy" />, "es");
    expect(screen.getByText("Hola, soy")).toBeInTheDocument();
  });

  it("renders a call-to-action link pointing to #projects", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const cta = screen.getByRole("link", { name: "View My Work" });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#projects");
  });

  it("renders translated CTA text for Portuguese", () => {
    renderWithIntl(<Hero {...defaultProps} ctaText="Ver Meu Trabalho" />, "pt-BR");
    const cta = screen.getByRole("link", { name: "Ver Meu Trabalho" });
    expect(cta).toBeInTheDocument();
  });

  it("renders translated CTA text for Spanish", () => {
    renderWithIntl(<Hero {...defaultProps} ctaText="Ver Mi Trabajo" />, "es");
    const cta = screen.getByRole("link", { name: "Ver Mi Trabajo" });
    expect(cta).toBeInTheDocument();
  });

  it("renders contact button with translated text", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
    expect(emailButton).toBeInTheDocument();
  });

  it("renders translated contact button for Portuguese", () => {
    renderWithIntl(<Hero {...defaultProps} contactText="Entre em Contato" />, "pt-BR");
    const emailButton = screen.getByRole("link", { name: "Entre em Contato" });
    expect(emailButton).toBeInTheDocument();
  });

  it("renders translated contact button for Spanish", () => {
    renderWithIntl(<Hero {...defaultProps} contactText="Ponte en Contacto" />, "es");
    const emailButton = screen.getByRole("link", { name: "Ponte en Contacto" });
    expect(emailButton).toBeInTheDocument();
  });

  it("contact button has mailto link with correct email for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("contact button has mailto link with correct email for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} contactText="Entre em Contato" />, "pt-BR");
    const emailButton = screen.getByRole("link", { name: "Entre em Contato" });
    expect(emailButton).toHaveAttribute("href", "mailto:contato@rogeriodocarmo.com");
  });

  it("contact button has mailto link with correct email for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} contactText="Ponte en Contacto" />, "es");
    const emailButton = screen.getByRole("link", { name: "Ponte en Contacto" });
    expect(emailButton).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("contact button has email icon with aria-hidden", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const emailButton = screen.getByRole("link", { name: "Get in Touch" });
    const svg = emailButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
    if (svg) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("displays professional email address below CTA buttons for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("contact@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("displays professional email address below CTA buttons for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "pt-BR");
    expect(screen.getByText("contato@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("displays professional email address below CTA buttons for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "es");
    expect(screen.getByText("contact@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("professional email is a clickable mailto link", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const emailLink = screen.getByRole("link", { name: "contact@rogeriodocarmo.com" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:contact@rogeriodocarmo.com");
  });

  it("renders the hero section with correct id", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const section = document.getElementById("home");
    expect(section).toBeInTheDocument();
  });

  it("is programmatically focusable so the scroll minimap can land focus here", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(document.getElementById("home")).toHaveAttribute("tabIndex", "-1");
  });

  it("has accessible section label", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const section = screen.getByRole("region", { name: /hero/i });
    expect(section).toBeInTheDocument();
  });

  it("renders with different name and title", () => {
    renderWithIntl(
      <Hero
        name="Jane Smith"
        title="Full Stack Engineer"
        greeting="Olá, eu sou"
        ctaText="Ver Meu Trabalho"
        contactText="Entre em Contato"
      />,
      "pt-BR"
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jane Smith");
    expect(screen.getByText("Full Stack Engineer")).toBeInTheDocument();
  });

  it("applies animation class for fade-in effect", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const section = screen.getByRole("region", { name: /hero/i });
    const animatedDiv = section.querySelector(".animate-fade-in");
    expect(animatedDiv).toBeInTheDocument();
  });

  it("renders profile photo with correct alt text", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const photo = screen.getByRole("img", { name: /rogério do carmo/i });
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", expect.stringContaining("rogeriodocarmo.png"));
  });

  it("profile photo has rounded-lg class for squared display", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const photo = screen.getByRole("img", { name: /rogério do carmo/i });
    expect(photo.className).toMatch(/rounded-lg/);
  });

  it("renders education section with UNESP logo for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "pt-BR");
    expect(screen.getByText("Bacharel em Ciência da Computação")).toBeInTheDocument();
    expect(screen.getByText("Mestre em Ciências Cartográficas")).toBeInTheDocument();
    const unespLogo = screen.getByAltText("UNESP Logo");
    expect(unespLogo).toBeInTheDocument();
  });

  it("renders education section with UNESP logo for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("Bachelor in Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Master in Cartographic Sciences")).toBeInTheDocument();
    const unespLogo = screen.getByAltText("UNESP Logo");
    expect(unespLogo).toBeInTheDocument();
  });

  it("renders dissertation link for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "pt-BR");
    expect(screen.getByText("Dissertação de mestrado completa:")).toBeInTheDocument();
    const dissertationLink = screen.getByRole("link", {
      name: /Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android/i,
    });
    expect(dissertationLink).toBeInTheDocument();
    expect(dissertationLink).toHaveAttribute("href", "http://hdl.handle.net/11449/243430");
    expect(dissertationLink).toHaveAttribute("target", "_blank");
    expect(dissertationLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders dissertation link for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("Complete master's dissertation:")).toBeInTheDocument();
    const dissertationLink = screen.getByRole("link", {
      name: /Evaluation of GNSS measurement quality and positioning in Android smartphones/i,
    });
    expect(dissertationLink).toBeInTheDocument();
    expect(dissertationLink).toHaveAttribute("href", "http://hdl.handle.net/11449/243430");
    expect(dissertationLink).toHaveAttribute("target", "_blank");
    expect(dissertationLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders download dissertation button for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "pt-BR");
    const downloadButton = screen.getByRole("link", { name: /baixar dissertação/i });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute(
      "href",
      "/academic/masters_degree_dissertation_rogerio_do_carmo.pdf"
    );
    expect(downloadButton).toHaveAttribute("target", "_blank");
    expect(downloadButton).toHaveAttribute("rel", "noopener noreferrer");
    expect(downloadButton).toHaveTextContent("Baixar Dissertação (PDF)");
  });

  it("renders download dissertation button for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    const downloadButton = screen.getByRole("link", { name: /download.*dissertation/i });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute(
      "href",
      "/academic/masters_degree_dissertation_rogerio_do_carmo.pdf"
    );
    expect(downloadButton).toHaveAttribute("target", "_blank");
    expect(downloadButton).toHaveAttribute("rel", "noopener noreferrer");
    expect(downloadButton).toHaveTextContent("Download Dissertation (PDF)");
  });

  it("renders current job section for Portuguese locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "pt-BR");
    expect(screen.getByText("Desenvolvedor Mobile Sênior")).toBeInTheDocument();
    expect(screen.getByText("2023 - 2026 (3 anos)")).toBeInTheDocument();
    const companyLogo = screen.getByAltText("Company Logo");
    expect(companyLogo).toBeInTheDocument();
  });

  it("renders current job section for English locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(screen.getByText("Senior Mobile Developer")).toBeInTheDocument();
    expect(screen.getByText("2023 - 2026 (3 years)")).toBeInTheDocument();
    const companyLogo = screen.getByAltText("Company Logo");
    expect(companyLogo).toBeInTheDocument();
  });

  it("renders current job section for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "es");
    expect(screen.getByText("Desarrollador Mobile Senior")).toBeInTheDocument();
    expect(screen.getByText("2023 - 2026 (3 años)")).toBeInTheDocument();
    const companyLogo = screen.getByAltText("Company Logo");
    expect(companyLogo).toBeInTheDocument();
  });

  it("renders education section with UNESP logo for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "es");
    expect(screen.getByText("Licenciado en Ciencias de la Computación")).toBeInTheDocument();
    expect(screen.getByText("Máster en Ciencias Cartográficas")).toBeInTheDocument();
    const unespLogo = screen.getByAltText("UNESP Logo");
    expect(unespLogo).toBeInTheDocument();
  });

  it("renders dissertation link for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "es");
    expect(screen.getByText("Disertación de maestría completa:")).toBeInTheDocument();
    const dissertationLink = screen.getByRole("link", {
      name: /Evaluación de la calidad de las medidas y posicionamiento GNSS en smartphones Android/i,
    });
    expect(dissertationLink).toBeInTheDocument();
    expect(dissertationLink).toHaveAttribute("href", "http://hdl.handle.net/11449/243430");
    expect(dissertationLink).toHaveAttribute("target", "_blank");
    expect(dissertationLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders download dissertation button for Spanish locale", () => {
    renderWithIntl(<Hero {...defaultProps} />, "es");
    const downloadButton = screen.getByRole("link", { name: /descargar disertación/i });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute(
      "href",
      "/academic/masters_degree_dissertation_rogerio_do_carmo.pdf"
    );
    expect(downloadButton).toHaveAttribute("target", "_blank");
    expect(downloadButton).toHaveAttribute("rel", "noopener noreferrer");
    expect(downloadButton).toHaveTextContent("Descargar Disertación (PDF)");
  });

  it("all required props are provided", () => {
    const { container } = renderWithIntl(<Hero {...defaultProps} />, "en");
    expect(container.firstChild).toBeInTheDocument();
  });

  it("does not render without required translation props", () => {
    // TypeScript should prevent this, but test runtime behavior
    const incompleteProps = {
      name: "John Doe",
      title: "Developer",
    } as any;

    const { container } = renderWithIntl(<Hero {...incompleteProps} />, "en");
    // Component should still render but with undefined text
    expect(container.firstChild).toBeInTheDocument();
  });

  describe("analytics tracking on click", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("tracks the UNESP logo external link click", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(
        screen.getByRole("link", { name: /UNESP - Universidade Estadual Paulista/i })
      );
      expect(trackExternalLinkClick).toHaveBeenCalledWith({
        url: "https://www2.unesp.br/",
        context: "hero_unesp_logo",
      });
    });

    it("tracks the bachelor and master degree link clicks", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(screen.getByRole("link", { name: "Bachelor in Computer Science" }));
      fireEvent.click(screen.getByRole("link", { name: "Master in Cartographic Sciences" }));
      expect(trackExternalLinkClick).toHaveBeenCalledWith(
        expect.objectContaining({ context: "hero_bachelor_degree" })
      );
      expect(trackExternalLinkClick).toHaveBeenCalledWith(
        expect.objectContaining({ context: "hero_master_degree" })
      );
    });

    it("tracks the dissertation link click", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(
        screen.getByRole("link", {
          name: /Evaluation of GNSS measurement quality and positioning in Android smartphones/i,
        })
      );
      expect(trackExternalLinkClick).toHaveBeenCalledWith({
        url: "http://hdl.handle.net/11449/243430",
        context: "hero_dissertation_link",
      });
    });

    it("tracks the dissertation PDF download as a footer link click", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(screen.getByRole("link", { name: /download.*dissertation/i }));
      expect(trackFooterLinkClick).toHaveBeenCalledWith(
        expect.objectContaining({
          link_url: "/academic/masters_degree_dissertation_rogerio_do_carmo.pdf",
          link_type: "dissertation_download",
        })
      );
    });

    it("tracks the Topaz logo, title and date link clicks", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(screen.getByRole("link", { name: "Topaz Evolution" }));
      fireEvent.click(screen.getByRole("link", { name: "Senior Mobile Developer" }));
      fireEvent.click(screen.getByRole("link", { name: "2023 - 2026 (3 years)" }));
      for (const context of ["hero_topaz_logo", "hero_topaz_text", "hero_topaz_date"]) {
        expect(trackExternalLinkClick).toHaveBeenCalledWith(expect.objectContaining({ context }));
      }
    });

    it("tracks the primary CTA click with view_projects action", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(screen.getByRole("link", { name: "View My Work" }));
      expect(trackHeroCTAClick).toHaveBeenCalledWith({
        cta_text: "View My Work",
        cta_action: "view_projects",
      });
    });

    it("tracks the contact button click with contact_email action", () => {
      renderWithIntl(<Hero {...defaultProps} />, "en");
      fireEvent.click(screen.getByRole("link", { name: "Get in Touch" }));
      expect(trackHeroCTAClick).toHaveBeenCalledWith({
        cta_text: "Get in Touch",
        cta_action: "contact_email",
      });
    });
  });
});
