/**
 * Unit tests for LanguageSelector component
 * Tests language selection dropdown rendering and interaction
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelector from "@/components/LanguageSelector";

// Mock useLanguage hook
const mockSetLocale = jest.fn();
const mockUseLanguage = jest.fn();

jest.mock("@/hooks/useLanguage", () => ({
  useLanguage: (currentLocale: string) => mockUseLanguage(currentLocale),
}));

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

describe("LanguageSelector Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockSetLocale.mockClear();
    mockUseLanguage.mockReturnValue({
      locale: "pt-BR",
      setLocale: mockSetLocale,
      availableLocales: ["pt-BR", "en", "es"],
    });
  });

  it("should render language selector", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    const select = screen.getByRole("combobox", { name: /select language/i });
    expect(select).toBeInTheDocument();
  });

  it("should display current locale flag", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    expect(screen.getByText("🇧🇷")).toBeInTheDocument();
  });

  it("should show all available locales as options", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);

    expect(screen.getByRole("option", { name: /🇧🇷 Português \(BR\)/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /🇺🇸 English/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /🇪🇸 Español/i })).toBeInTheDocument();
  });

  it("should have correct value selected", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("pt-BR");
  });

  it("should call setLocale when selection changes", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLocale="pt-BR" />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "en");

    expect(mockSetLocale).toHaveBeenCalledWith("en");
  });

  it("should update flag when locale changes", () => {
    const { rerender } = render(<LanguageSelector currentLocale="pt-BR" />);
    expect(screen.getByText("🇧🇷")).toBeInTheDocument();

    mockUseLanguage.mockReturnValue({
      locale: "en",
      setLocale: mockSetLocale,
      availableLocales: ["pt-BR", "en", "es"],
    });

    rerender(<LanguageSelector currentLocale="en" />);
    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
  });

  it("should have accessible label", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveAccessibleName(/select language/i);
  });

  it("should have sr-only label for screen readers", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    const label = screen.getByText("Select language");
    expect(label).toHaveClass("sr-only");
  });

  it("should accept custom className", () => {
    render(<LanguageSelector currentLocale="pt-BR" className="custom-class" />);
    const container = screen.getByRole("combobox").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("should support switching to all available locales", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLocale="pt-BR" />);

    const select = screen.getByRole("combobox");

    // Switch to English
    await user.selectOptions(select, "en");
    expect(mockSetLocale).toHaveBeenCalledWith("en");

    // Switch to Spanish
    await user.selectOptions(select, "es");
    expect(mockSetLocale).toHaveBeenCalledWith("es");

    // Switch back to Portuguese
    await user.selectOptions(select, "pt-BR");
    expect(mockSetLocale).toHaveBeenCalledWith("pt-BR");
  });

  it("should display dropdown chevron", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    expect(screen.getByText("▾")).toBeInTheDocument();
  });

  it("should have proper ARIA attributes", () => {
    render(<LanguageSelector currentLocale="pt-BR" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-label", "Select language");
    expect(select).toHaveAttribute("id", "language-selector");
  });
});
