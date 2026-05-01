/**
 * Unit tests for HomePageContent component
 * Tests the client-side wrapper that renders all homepage sections
 */

import { render, screen } from "@testing-library/react";
import HomePageContent from "@/app/[locale]/HomePageContent";
import type { Experience, Project, Skill } from "@/types/index";

// Mock lazy-loaded components
jest.mock("@/lib/lazy-components", () => ({
  LazyTechStackSection: () => <div data-testid="tech-stack-section">Tech Stack</div>,
  LazyExitIntentModal: ({ locale, linkedInUrl, githubUrl }: any) => (
    <div
      data-testid="exit-intent-modal"
      data-locale={locale}
      data-linkedin={linkedInUrl}
      data-github={githubUrl}
    >
      Exit Intent Modal
    </div>
  ),
}));

// Mock all child components
jest.mock("@/components/Hero", () => ({
  __esModule: true,
  default: ({ name, title, locale, greeting, ctaText, contactText }: any) => (
    <div
      data-testid="hero"
      data-name={name}
      data-title={title}
      data-locale={locale}
      data-greeting={greeting}
      data-cta={ctaText}
      data-contact={contactText}
    >
      Hero Component
    </div>
  ),
}));

jest.mock("@/components/CareerPathSelector", () => ({
  __esModule: true,
  default: () => <div data-testid="career-path-selector">Career Path Selector</div>,
}));

jest.mock("@/components/ExperienceSection", () => ({
  __esModule: true,
  default: ({ careerPath, experiences, locale }: any) => (
    <div
      data-testid="experience-section"
      data-career-path={careerPath}
      data-locale={locale}
      data-experiences-count={experiences.length}
    >
      Experience Section
    </div>
  ),
}));

jest.mock("@/components/SkillsSection", () => ({
  __esModule: true,
  default: ({ skills, locale }: any) => (
    <div data-testid="skills-section" data-locale={locale} data-skills-count={skills.length}>
      Skills Section
    </div>
  ),
}));

jest.mock("@/components/ProjectsSection", () => ({
  __esModule: true,
  default: ({ projects, locale }: any) => (
    <div data-testid="projects-section" data-locale={locale} data-projects-count={projects.length}>
      Projects Section
    </div>
  ),
}));

jest.mock("@/components/ContactForm", () => ({
  __esModule: true,
  default: () => <div data-testid="contact-form">Contact Form</div>,
}));

jest.mock("@/components/BackToTopButton", () => ({
  __esModule: true,
  default: () => <button data-testid="back-to-top">Back to Top</button>,
}));

describe("HomePageContent Component", () => {
  const mockExperiences: Experience[] = [
    {
      id: "exp-1",
      role: "Senior Developer",
      organization: "Tech Corp",
      location: "Remote",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Developed mobile apps",
      achievements: ["Achievement 1"],
      technologies: ["React Native"],
      type: "professional",
    },
  ];

  const mockProjects: Project[] = [
    {
      id: "proj-1",
      title: "Portfolio Website",
      description: "Personal website",
      technologies: ["Next.js", "TypeScript"],
      link: "https://example.com",
      github: "https://github.com/example",
      image: "/images/project.png",
      featured: true,
    },
  ];

  const mockSkills: Skill[] = [
    {
      category: "Frontend",
      skills: [
        { name: "React", level: "advanced" },
        { name: "TypeScript", level: "intermediate" },
      ],
    },
  ];

  const defaultProps = {
    locale: "en",
    heroTitle: "Frontend Mobile React Native Developer",
    heroGreeting: "Hello, I'm",
    heroCtaText: "View My Work",
    heroContactText: "Get in Touch",
    contactTitle: "Get in Touch",
    contactSubtitle: "Have a project in mind or want to chat? Send me a message!",
    experiences: mockExperiences,
    projects: mockProjects,
    skills: mockSkills,
  };

  describe("Component Rendering", () => {
    it("renders all main sections", () => {
      render(<HomePageContent {...defaultProps} />);

      expect(screen.getByTestId("hero")).toBeInTheDocument();
      expect(screen.getByTestId("career-path-selector")).toBeInTheDocument();
      expect(screen.getByTestId("experience-section")).toBeInTheDocument();
      expect(screen.getByTestId("skills-section")).toBeInTheDocument();
      expect(screen.getByTestId("projects-section")).toBeInTheDocument();
      // Tech Stack section moved to separate page
      expect(screen.queryByTestId("tech-stack-section")).not.toBeInTheDocument();
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
      expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
      expect(screen.getByTestId("exit-intent-modal")).toBeInTheDocument();
    });

    it("renders contact section with correct structure", () => {
      render(<HomePageContent {...defaultProps} />);

      const contactSection = screen.getByRole("region", { name: "Get in Touch" });
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveAttribute("id", "contact");
    });

    it("renders contact section heading", () => {
      render(<HomePageContent {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Get in Touch" });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute("id", "contact-title");
    });

    it("renders contact section subtitle", () => {
      render(<HomePageContent {...defaultProps} />);

      expect(
        screen.getByText("Have a project in mind or want to chat? Send me a message!")
      ).toBeInTheDocument();
    });
  });

  describe("Props Passing", () => {
    it("passes correct props to Hero component", () => {
      render(<HomePageContent {...defaultProps} />);

      const hero = screen.getByTestId("hero");
      expect(hero).toHaveAttribute("data-name", "Rogério do Carmo");
      expect(hero).toHaveAttribute("data-title", "Frontend Mobile React Native Developer");
      expect(hero).toHaveAttribute("data-locale", "en");
      expect(hero).toHaveAttribute("data-greeting", "Hello, I'm");
      expect(hero).toHaveAttribute("data-cta", "View My Work");
      expect(hero).toHaveAttribute("data-contact", "Get in Touch");
    });

    it("passes correct props to ExperienceSection", () => {
      render(<HomePageContent {...defaultProps} />);

      const experienceSection = screen.getByTestId("experience-section");
      expect(experienceSection).toHaveAttribute("data-career-path", "professional");
      expect(experienceSection).toHaveAttribute("data-locale", "en");
      expect(experienceSection).toHaveAttribute("data-experiences-count", "1");
    });

    it("passes correct props to SkillsSection", () => {
      render(<HomePageContent {...defaultProps} />);

      const skillsSection = screen.getByTestId("skills-section");
      expect(skillsSection).toHaveAttribute("data-locale", "en");
      expect(skillsSection).toHaveAttribute("data-skills-count", "1");
    });

    it("passes correct props to ProjectsSection", () => {
      render(<HomePageContent {...defaultProps} />);

      const projectsSection = screen.getByTestId("projects-section");
      expect(projectsSection).toHaveAttribute("data-locale", "en");
      expect(projectsSection).toHaveAttribute("data-projects-count", "1");
    });

    it("passes correct props to ExitIntentModal", () => {
      render(<HomePageContent {...defaultProps} />);

      const modal = screen.getByTestId("exit-intent-modal");
      expect(modal).toHaveAttribute("data-locale", "en");
      expect(modal).toHaveAttribute("data-linkedin", "https://www.linkedin.com/in/rogeriodocarmo/");
      expect(modal).toHaveAttribute("data-github", "https://github.com/RogerioDoCarmo/curriculo");
    });
  });

  describe("Internationalization", () => {
    it("renders with Portuguese locale", () => {
      const ptProps = {
        ...defaultProps,
        locale: "pt-BR",
        heroTitle: "Desenvolvedor Frontend Mobile React Native",
        heroGreeting: "Olá, eu sou",
        heroCtaText: "Ver Meu Trabalho",
        heroContactText: "Entre em Contato",
        contactTitle: "Entre em Contato",
        contactSubtitle: "Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!",
      };

      render(<HomePageContent {...ptProps} />);

      const hero = screen.getByTestId("hero");
      expect(hero).toHaveAttribute("data-locale", "pt-BR");
      expect(hero).toHaveAttribute("data-greeting", "Olá, eu sou");
      expect(hero).toHaveAttribute("data-cta", "Ver Meu Trabalho");
      expect(hero).toHaveAttribute("data-contact", "Entre em Contato");

      expect(screen.getByRole("heading", { name: "Entre em Contato" })).toBeInTheDocument();
      expect(
        screen.getByText("Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!")
      ).toBeInTheDocument();
    });

    it("renders with Spanish locale", () => {
      const esProps = {
        ...defaultProps,
        locale: "es",
        heroTitle: "Desarrollador Frontend Mobile React Native",
        heroGreeting: "Hola, soy",
        heroCtaText: "Ver Mi Trabajo",
        heroContactText: "Ponte en Contacto",
        contactTitle: "Ponte en Contacto",
        contactSubtitle: "¿Tienes un proyecto en mente o quieres charlar? ¡Envíame un mensaje!",
      };

      render(<HomePageContent {...esProps} />);

      const hero = screen.getByTestId("hero");
      expect(hero).toHaveAttribute("data-locale", "es");
      expect(hero).toHaveAttribute("data-greeting", "Hola, soy");
      expect(hero).toHaveAttribute("data-cta", "Ver Mi Trabajo");
      expect(hero).toHaveAttribute("data-contact", "Ponte en Contacto");

      expect(screen.getByRole("heading", { name: "Ponte en Contacto" })).toBeInTheDocument();
      expect(
        screen.getByText("¿Tienes un proyecto en mente o quieres charlar? ¡Envíame un mensaje!")
      ).toBeInTheDocument();
    });
  });

  describe("Data Handling", () => {
    it("handles empty experiences array", () => {
      const propsWithNoExperiences = {
        ...defaultProps,
        experiences: [],
      };

      render(<HomePageContent {...propsWithNoExperiences} />);

      const experienceSection = screen.getByTestId("experience-section");
      expect(experienceSection).toHaveAttribute("data-experiences-count", "0");
    });

    it("handles empty projects array", () => {
      const propsWithNoProjects = {
        ...defaultProps,
        projects: [],
      };

      render(<HomePageContent {...propsWithNoProjects} />);

      const projectsSection = screen.getByTestId("projects-section");
      expect(projectsSection).toHaveAttribute("data-projects-count", "0");
    });

    it("handles empty skills array", () => {
      const propsWithNoSkills = {
        ...defaultProps,
        skills: [],
      };

      render(<HomePageContent {...propsWithNoSkills} />);

      const skillsSection = screen.getByTestId("skills-section");
      expect(skillsSection).toHaveAttribute("data-skills-count", "0");
    });

    it("handles multiple experiences", () => {
      const multipleExperiences: Experience[] = [
        ...mockExperiences,
        {
          id: "exp-2",
          role: "Junior Developer",
          organization: "Startup Inc",
          location: "São Paulo",
          startDate: "2018-01",
          endDate: "2020-01",
          description: "Built web apps",
          achievements: [],
          technologies: ["React"],
          type: "professional",
        },
      ];

      const propsWithMultipleExperiences = {
        ...defaultProps,
        experiences: multipleExperiences,
      };

      render(<HomePageContent {...propsWithMultipleExperiences} />);

      const experienceSection = screen.getByTestId("experience-section");
      expect(experienceSection).toHaveAttribute("data-experiences-count", "2");
    });
  });

  describe("Accessibility", () => {
    it("contact section has proper ARIA labeling", () => {
      render(<HomePageContent {...defaultProps} />);

      const contactSection = screen.getByRole("region", { name: "Get in Touch" });
      expect(contactSection).toHaveAttribute("aria-labelledby", "contact-title");
    });

    it("contact heading has correct ID for aria-labelledby", () => {
      render(<HomePageContent {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Get in Touch" });
      expect(heading).toHaveAttribute("id", "contact-title");
    });

    it("all sections are rendered in correct semantic order", () => {
      const { container } = render(<HomePageContent {...defaultProps} />);

      const sections = container.querySelectorAll("[data-testid]");
      const sectionOrder = Array.from(sections).map((section) =>
        section.getAttribute("data-testid")
      );

      // Tech Stack section moved to separate page
      expect(sectionOrder).toEqual([
        "hero",
        "career-path-selector",
        "experience-section",
        "skills-section",
        "projects-section",
        "contact-form",
        "back-to-top",
        "exit-intent-modal",
      ]);
    });
  });

  describe("Component Integration", () => {
    it("renders without crashing with all props", () => {
      const { container } = render(<HomePageContent {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("maintains component structure with different locales", () => {
      const { rerender } = render(<HomePageContent {...defaultProps} locale="en" />);
      expect(screen.getByTestId("hero")).toBeInTheDocument();

      rerender(<HomePageContent {...defaultProps} locale="pt-BR" />);
      expect(screen.getByTestId("hero")).toBeInTheDocument();

      rerender(<HomePageContent {...defaultProps} locale="es" />);
      expect(screen.getByTestId("hero")).toBeInTheDocument();
    });
  });
});
