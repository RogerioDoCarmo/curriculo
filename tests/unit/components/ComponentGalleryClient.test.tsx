import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentGalleryClient from "@/app/[locale]/components/ComponentGalleryClient";
import { NextIntlClientProvider } from "next-intl";

// Mock the components to avoid complex dependencies
jest.mock("@/components/Button", () => {
  return function MockButton({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant: string;
    size: string;
  }) {
    return (
      <button onClick={onClick} data-variant={variant} data-size={size}>
        {children}
      </button>
    );
  };
});

jest.mock("@/components/Modal", () => {
  return function MockModal({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        {title && <h2>{title}</h2>}
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    );
  };
});

jest.mock("@/components/Card", () => {
  return function MockCard({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
      <div data-testid="card">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    );
  };
});

jest.mock("@/components/HighlightedText", () => {
  return function MockHighlightedText({ text }: { text: string; highlight: string }) {
    return <span>{text}</span>;
  };
});

jest.mock("@/components/LanguageSelector", () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">Language Selector</div>;
  };
});

jest.mock("@/components/ThemeToggle", () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  };
});

jest.mock("@/components/ComponentShowcase", () => {
  return function MockComponentShowcase({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) {
    return (
      <section data-testid="component-showcase">
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </section>
    );
  };
});

const messages = {
  ComponentGallery: {
    heading: "Component Gallery",
    subheading: "Explore our component library",
    button: {
      title: "Button Component",
      description: "Interactive button component",
      primary: "Primary",
      secondary: "Secondary",
      ghost: "Ghost",
      small: "Small",
      medium: "Medium",
      large: "Large",
      disabled: "Disabled",
      loading: "Loading",
    },
    card: {
      title: "Card Component",
      description: "Container component",
      withTitle: "Card with Title",
      withoutTitle: "Card without title content",
      content: "Card content",
    },
    highlightedText: {
      title: "Highlighted Text",
      description: "Text highlighting component",
      example1: "This is highlighted text",
      example2: "Example with",
      highlighted: "highlighted",
    },
    modal: {
      title: "Modal Component",
      description: "Dialog component",
      openButton: "Open Modal",
      exampleTitle: "Example Modal",
      exampleContent: "This is modal content",
    },
    languageSelector: {
      title: "Language Selector",
      description: "Language switching component",
    },
    themeToggle: {
      title: "Theme Toggle",
      description: "Dark/light mode toggle",
    },
  },
};

describe("ComponentGalleryClient", () => {
  const renderWithIntl = (locale: "en" | "pt-BR" | "es" = "en") => {
    return render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ComponentGalleryClient locale={locale} />
      </NextIntlClientProvider>
    );
  };

  it("renders the page header", () => {
    renderWithIntl();
    expect(screen.getByText("Component Gallery")).toBeInTheDocument();
    expect(screen.getByText("Explore our component library")).toBeInTheDocument();
  });

  it("renders all component showcases", () => {
    renderWithIntl();
    expect(screen.getByText("Button Component")).toBeInTheDocument();
    expect(screen.getByText("Card Component")).toBeInTheDocument();
    expect(screen.getByText("Highlighted Text")).toBeInTheDocument();
    expect(screen.getByText("Modal Component")).toBeInTheDocument();
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it.each([
    ["variants", ["Primary", "Secondary", "Ghost"]],
    ["sizes", ["Small", "Medium", "Large"]],
    ["states", ["Disabled", "Loading"]],
  ] as const)("renders button %s", (_label, texts) => {
    renderWithIntl();
    texts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("opens and closes basic modal", async () => {
    const user = userEvent.setup();
    renderWithIntl();

    // Modal should not be visible initially
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

    // Click the open button
    const openButton = screen.getByText("Open Modal");
    await user.click(openButton);

    // Modal should be visible
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
    expect(screen.getByText("Example Modal")).toBeInTheDocument();
    expect(screen.getByText("This is modal content")).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    // Modal should be hidden
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it.each([
    ["confirmation", "Confirmation Modal", "Confirm Action"],
    ["info", "Info Modal", "Information"],
    ["form", "Form Modal", "Contact Form"],
  ] as const)("opens and closes %s modal", async (_label, openButtonText, modalText) => {
    const user = userEvent.setup();
    renderWithIntl();

    const openButton = screen.getByText(openButtonText);
    await user.click(openButton);

    // Modal should be visible
    await waitFor(() => {
      expect(screen.getByText(modalText)).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    // Modal should be hidden
    await waitFor(() => {
      expect(screen.queryByText(modalText)).not.toBeInTheDocument();
    });
  });

  it("renders cards", () => {
    renderWithIntl();
    expect(screen.getByText("Card with Title")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders highlighted text examples", () => {
    renderWithIntl();
    expect(screen.getByText("This is highlighted text")).toBeInTheDocument();
  });

  it("renders language selector", () => {
    renderWithIntl();
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    renderWithIntl();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders with different locales", () => {
    const { rerender } = render(
      <NextIntlClientProvider locale="pt-BR" messages={messages}>
        <ComponentGalleryClient locale="pt-BR" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Component Gallery")).toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="es" messages={messages}>
        <ComponentGalleryClient locale="es" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Component Gallery")).toBeInTheDocument();
  });
});
