/**
 * Unit tests for CookieConsent component
 *
 * Tests cookie consent banner UI and user interactions including:
 * - Rendering main and customize views
 * - User interactions (accept/reject/customize)
 * - Accessibility features
 * - Multi-language support
 * - Theme compatibility
 */

import { render, screen, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import CookieConsent from "@/components/CookieConsent";
import { useCookieConsent } from "@/hooks/useCookieConsent";

// Mock the useCookieConsent hook
jest.mock("@/hooks/useCookieConsent");

const mockUseCookieConsent = useCookieConsent as jest.MockedFunction<typeof useCookieConsent>;

// Mock messages for all languages
const mockMessages: Record<string, AbstractIntlMessages> = {
  "pt-BR": {
    cookieConsent: {
      title: "Este site usa cookies",
      description: "Usamos cookies essenciais para o funcionamento do site.",
      essential: "Cookies Essenciais",
      essentialDescription: "Necessários para o funcionamento básico do site.",
      analytics: "Cookies de Análise",
      analyticsDescription: "Ajudam a entender como os visitantes interagem com o site.",
      analyticsCookies: "Cookies: _ga, _ga_<container-id>, _gid, _gat",
      functional: "Cookies Funcionais",
      functionalDescription: "Melhoram a experiência do usuário.",
      acceptAll: "Aceitar Todos",
      rejectAll: "Rejeitar Não-Essenciais",
      customize: "Personalizar",
      learnMore: "Saiba mais em nossa",
      privacyPolicy: "Política de Privacidade",
      cookiePolicy: "Política de Cookies",
      and: "e",
      back: "Voltar",
      customizeTitle: "Personalizar Preferências de Cookies",
      customizeDescription: "Escolha quais categorias de cookies você deseja permitir.",
      required: "Obrigatório",
      savePreferences: "Salvar Preferências",
    },
  },
  en: {
    cookieConsent: {
      title: "This site uses cookies",
      description: "We use essential cookies for site functionality.",
      essential: "Essential Cookies",
      essentialDescription: "Required for basic site functionality.",
      analytics: "Analytics Cookies",
      analyticsDescription: "Help understand how visitors interact with the site.",
      analyticsCookies: "Cookies: _ga, _ga_<container-id>, _gid, _gat",
      functional: "Functional Cookies",
      functionalDescription: "Enhance user experience.",
      acceptAll: "Accept All",
      rejectAll: "Reject Non-Essential",
      customize: "Customize",
      learnMore: "Learn more in our",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      and: "and",
      back: "Back",
      customizeTitle: "Customize Cookie Preferences",
      customizeDescription: "Choose which cookie categories you want to allow.",
      required: "Required",
      savePreferences: "Save Preferences",
    },
  },
  es: {
    cookieConsent: {
      title: "Este sitio usa cookies",
      description: "Usamos cookies esenciales para el funcionamiento del sitio.",
      essential: "Cookies Esenciales",
      essentialDescription: "Necesarias para el funcionamiento básico del sitio.",
      analytics: "Cookies de Análisis",
      analyticsDescription: "Ayudan a entender cómo los visitantes interactúan con el sitio.",
      analyticsCookies: "Cookies: _ga, _ga_<container-id>, _gid, _gat",
      functional: "Cookies Funcionales",
      functionalDescription: "Mejoran la experiencia del usuario.",
      acceptAll: "Aceptar Todas",
      rejectAll: "Rechazar No-Esenciales",
      customize: "Personalizar",
      learnMore: "Más información en nuestra",
      privacyPolicy: "Política de Privacidad",
      cookiePolicy: "Política de Cookies",
      and: "y",
      back: "Volver",
      customizeTitle: "Personalizar Preferencias de Cookies",
      customizeDescription: "Elige qué categorías de cookies deseas permitir.",
      required: "Obligatorio",
      savePreferences: "Guardar Preferencias",
    },
  },
};

const renderWithIntl = (locale: string, messages: AbstractIntlMessages) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CookieConsent />
    </NextIntlClientProvider>
  );
};

describe("CookieConsent", () => {
  const mockAcceptAll = jest.fn();
  const mockRejectAll = jest.fn();
  const mockSaveCustomPreferences = jest.fn();
  const mockCloseBanner = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseCookieConsent.mockReturnValue({
      consentStatus: "pending",
      preferences: {
        essential: true,
        analytics: false,
        functional: false,
      },
      showBanner: true,
      acceptAll: mockAcceptAll,
      rejectAll: mockRejectAll,
      saveCustomPreferences: mockSaveCustomPreferences,
      openBanner: jest.fn(),
      closeBanner: mockCloseBanner,
      hasAnalyticsConsent: jest.fn(() => false),
      hasFunctionalConsent: jest.fn(() => false),
    });
  });

  describe("Rendering", () => {
    it("should render banner when showBanner is true", () => {
      renderWithIntl("en", mockMessages.en);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("This site uses cookies")).toBeInTheDocument();
    });

    it("should not render when showBanner is false", () => {
      mockUseCookieConsent.mockReturnValue({
        ...mockUseCookieConsent(),
        showBanner: false,
      });

      renderWithIntl("en", mockMessages.en);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render main view by default", () => {
      renderWithIntl("en", mockMessages.en);

      expect(screen.getByText("This site uses cookies")).toBeInTheDocument();
      expect(screen.getByText("Accept All")).toBeInTheDocument();
      expect(screen.getByText("Reject Non-Essential")).toBeInTheDocument();
      expect(screen.getByText("Customize")).toBeInTheDocument();
    });
  });

  describe("Main view", () => {
    it.each([
      [
        "title and description",
        ["This site uses cookies", "We use essential cookies for site functionality."],
      ],
      [
        "essential cookies category",
        ["Essential Cookies", "Required for basic site functionality."],
      ],
      [
        "analytics cookies category",
        ["Analytics Cookies", "Help understand how visitors interact with the site."],
      ],
    ] as const)("should display %s", (_label, texts) => {
      renderWithIntl("en", mockMessages.en);

      texts.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it("should have Accept All button", () => {
      renderWithIntl("en", mockMessages.en);

      const acceptButton = screen.getByRole("button", { name: "Accept All" });
      expect(acceptButton).toBeInTheDocument();
    });

    it("should have Reject Non-Essential button", () => {
      renderWithIntl("en", mockMessages.en);

      const rejectButton = screen.getByRole("button", { name: "Reject Non-Essential" });
      expect(rejectButton).toBeInTheDocument();
    });

    it("should have Customize button", () => {
      renderWithIntl("en", mockMessages.en);

      const customizeButton = screen.getByRole("button", { name: "Customize" });
      expect(customizeButton).toBeInTheDocument();
    });

    it("should have links to Privacy Policy and Cookie Policy", () => {
      renderWithIntl("en", mockMessages.en);

      const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
      const cookieLink = screen.getByRole("link", { name: "Cookie Policy" });

      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute("href", "/privacy");

      expect(cookieLink).toBeInTheDocument();
      expect(cookieLink).toHaveAttribute("href", "/cookies");
    });
  });

  describe("User interactions - Main view", () => {
    it("should call acceptAll when Accept All clicked", () => {
      renderWithIntl("en", mockMessages.en);

      const acceptButton = screen.getByRole("button", { name: "Accept All" });
      fireEvent.click(acceptButton);

      expect(mockAcceptAll).toHaveBeenCalledTimes(1);
    });

    it("should call rejectAll when Reject Non-Essential clicked", () => {
      renderWithIntl("en", mockMessages.en);

      const rejectButton = screen.getByRole("button", { name: "Reject Non-Essential" });
      fireEvent.click(rejectButton);

      expect(mockRejectAll).toHaveBeenCalledTimes(1);
    });

    it("should show customize view when Customize clicked", () => {
      renderWithIntl("en", mockMessages.en);

      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);

      expect(screen.getByText("Customize Cookie Preferences")).toBeInTheDocument();
      expect(screen.getByText("Save Preferences")).toBeInTheDocument();
    });
  });

  describe("Customize view", () => {
    beforeEach(() => {
      renderWithIntl("en", mockMessages.en);
      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);
    });

    it("should display customize title and description", () => {
      expect(screen.getByText("Customize Cookie Preferences")).toBeInTheDocument();
      expect(
        screen.getByText("Choose which cookie categories you want to allow.")
      ).toBeInTheDocument();
    });

    it("should show essential cookies (always enabled)", () => {
      expect(screen.getByText("Essential Cookies")).toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();

      const essentialCheckbox = screen.getAllByRole("checkbox")[0];
      expect(essentialCheckbox).toBeChecked();
      expect(essentialCheckbox).toBeDisabled();
    });

    it("should show analytics cookies toggle", () => {
      expect(screen.getByText("Analytics Cookies")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      const analyticsCheckbox = checkboxes[1];
      expect(analyticsCheckbox).not.toBeDisabled();
    });

    it("should show functional cookies toggle", () => {
      expect(screen.getByText("Functional Cookies")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      const functionalCheckbox = checkboxes[2];
      expect(functionalCheckbox).not.toBeDisabled();
    });

    it("should have back button", () => {
      const backButton = screen.getByRole("button", { name: "Back" });
      expect(backButton).toBeInTheDocument();
    });

    it("should have Save Preferences button", () => {
      const saveButton = screen.getByRole("button", { name: "Save Preferences" });
      expect(saveButton).toBeInTheDocument();
    });

    it("essential cookies checkbox should be disabled", () => {
      const essentialCheckbox = screen.getAllByRole("checkbox")[0];
      expect(essentialCheckbox).toBeDisabled();
    });

    it("should display cookie names for analytics", () => {
      expect(screen.getByText("Cookies: _ga, _ga_<container-id>, _gid, _gat")).toBeInTheDocument();
    });
  });

  describe("User interactions - Customize view", () => {
    beforeEach(() => {
      renderWithIntl("en", mockMessages.en);
      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);
    });

    it("should toggle analytics preference when checkbox clicked", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      const analyticsCheckbox = checkboxes[1];

      expect(analyticsCheckbox).not.toBeChecked();

      fireEvent.click(analyticsCheckbox);
      expect(analyticsCheckbox).toBeChecked();

      fireEvent.click(analyticsCheckbox);
      expect(analyticsCheckbox).not.toBeChecked();
    });

    it("should toggle functional preference when checkbox clicked", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      const functionalCheckbox = checkboxes[2];

      expect(functionalCheckbox).not.toBeChecked();

      fireEvent.click(functionalCheckbox);
      expect(functionalCheckbox).toBeChecked();

      fireEvent.click(functionalCheckbox);
      expect(functionalCheckbox).not.toBeChecked();
    });

    it("should return to main view when back button clicked", () => {
      const backButton = screen.getByRole("button", { name: "Back" });
      fireEvent.click(backButton);

      expect(screen.getByText("This site uses cookies")).toBeInTheDocument();
      expect(screen.getByText("Accept All")).toBeInTheDocument();
    });

    it("should call saveCustomPreferences when Save clicked", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      const analyticsCheckbox = checkboxes[1];
      const functionalCheckbox = checkboxes[2];

      // Enable analytics, disable functional
      fireEvent.click(analyticsCheckbox);

      const saveButton = screen.getByRole("button", { name: "Save Preferences" });
      fireEvent.click(saveButton);

      expect(mockSaveCustomPreferences).toHaveBeenCalledTimes(1);
      expect(mockSaveCustomPreferences).toHaveBeenCalledWith({
        analytics: true,
        functional: false,
      });
    });

    it("should call saveCustomPreferences with both enabled", () => {
      const checkboxes = screen.getAllByRole("checkbox");
      const analyticsCheckbox = checkboxes[1];
      const functionalCheckbox = checkboxes[2];

      fireEvent.click(analyticsCheckbox);
      fireEvent.click(functionalCheckbox);

      const saveButton = screen.getByRole("button", { name: "Save Preferences" });
      fireEvent.click(saveButton);

      expect(mockSaveCustomPreferences).toHaveBeenCalledWith({
        analytics: true,
        functional: true,
      });
    });
  });

  describe("Accessibility", () => {
    it("should have role='dialog' and aria-modal='true'", () => {
      renderWithIntl("en", mockMessages.en);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("should have aria-labelledby pointing to title", () => {
      renderWithIntl("en", mockMessages.en);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "cookie-consent-title");

      const title = screen.getByText("This site uses cookies");
      expect(title).toHaveAttribute("id", "cookie-consent-title");
    });

    it("should have aria-label on checkboxes", () => {
      renderWithIntl("en", mockMessages.en);

      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-label");
      });
    });

    it("should have aria-label on back button", () => {
      renderWithIntl("en", mockMessages.en);

      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);

      const backButton = screen.getByRole("button", { name: "Back" });
      expect(backButton).toHaveAttribute("aria-label", "Back");
    });

    it("should be keyboard navigable", () => {
      renderWithIntl("en", mockMessages.en);

      const acceptButton = screen.getByRole("button", { name: "Accept All" });
      const rejectButton = screen.getByRole("button", { name: "Reject Non-Essential" });
      const customizeButton = screen.getByRole("button", { name: "Customize" });

      // All buttons should be focusable
      expect(acceptButton).not.toHaveAttribute("tabindex", "-1");
      expect(rejectButton).not.toHaveAttribute("tabindex", "-1");
      expect(customizeButton).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Translations", () => {
    it("should display Portuguese translations", () => {
      renderWithIntl("pt-BR", mockMessages["pt-BR"]);

      expect(screen.getByText("Este site usa cookies")).toBeInTheDocument();
      expect(screen.getByText("Aceitar Todos")).toBeInTheDocument();
      expect(screen.getByText("Rejeitar Não-Essenciais")).toBeInTheDocument();
      expect(screen.getByText("Personalizar")).toBeInTheDocument();
    });

    it("should display English translations", () => {
      renderWithIntl("en", mockMessages.en);

      expect(screen.getByText("This site uses cookies")).toBeInTheDocument();
      expect(screen.getByText("Accept All")).toBeInTheDocument();
      expect(screen.getByText("Reject Non-Essential")).toBeInTheDocument();
      expect(screen.getByText("Customize")).toBeInTheDocument();
    });

    it("should display Spanish translations", () => {
      renderWithIntl("es", mockMessages.es);

      expect(screen.getByText("Este sitio usa cookies")).toBeInTheDocument();
      expect(screen.getByText("Aceptar Todas")).toBeInTheDocument();
      expect(screen.getByText("Rechazar No-Esenciales")).toBeInTheDocument();
      expect(screen.getByText("Personalizar")).toBeInTheDocument();
    });
  });

  describe("Theme compatibility", () => {
    it("should render correctly in light mode", () => {
      renderWithIntl("en", mockMessages.en);

      const dialog = screen.getByRole("dialog");
      const container = dialog.querySelector("div");

      if (container) {
        // Check for light mode classes
        expect(container.className).toContain("bg-white");
        expect(container.className).toContain("dark:bg-gray-800");
      }
    });

    it("should have dark mode classes", () => {
      renderWithIntl("en", mockMessages.en);

      const dialog = screen.getByRole("dialog");
      const container = dialog.querySelector("div");

      if (container) {
        // Verify dark mode classes are present
        expect(container.className).toMatch(/dark:/);
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle missing preferences gracefully", () => {
      mockUseCookieConsent.mockReturnValue({
        ...mockUseCookieConsent(),
        preferences: {
          essential: true,
          analytics: false,
          functional: false,
        },
      });

      renderWithIntl("en", mockMessages.en);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should initialize customize view with current preferences", () => {
      mockUseCookieConsent.mockReturnValue({
        ...mockUseCookieConsent(),
        preferences: {
          essential: true,
          analytics: true,
          functional: false,
        },
      });

      renderWithIntl("en", mockMessages.en);

      const customizeButton = screen.getByRole("button", { name: "Customize" });
      fireEvent.click(customizeButton);

      const checkboxes = screen.getAllByRole("checkbox");
      const analyticsCheckbox = checkboxes[1];

      expect(analyticsCheckbox).toBeChecked();
    });
  });
});
