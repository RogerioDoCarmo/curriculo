/**
 * Unit tests for CareerPathSelector component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import CareerPathSelector from "@/components/CareerPathSelector";
import type { CareerPath } from "@/types/index";

// Mock messages for next-intl
const messages: AbstractIntlMessages = {
  careerPath: {
    title: "Career Path Selector",
    professional: "Professional",
    academic: "Academic",
  },
};

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

// Helper to render with next-intl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("CareerPathSelector Component", () => {
  beforeEach(() => {
    sessionStorageMock.clear();
  });

  it("renders Professional and Academic buttons", () => {
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    expect(screen.getByRole("tab", { name: /professional/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /academic/i })).toBeInTheDocument();
  });

  it("marks the selected tab as active (aria-selected=true)", () => {
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    const profTab = screen.getByRole("tab", { name: /professional/i });
    const acadTab = screen.getByRole("tab", { name: /academic/i });
    expect(profTab).toHaveAttribute("aria-selected", "true");
    expect(acadTab).toHaveAttribute("aria-selected", "false");
  });

  it("marks academic tab as active when selected='academic'", () => {
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="academic" />);
    const profTab = screen.getByRole("tab", { name: /professional/i });
    const acadTab = screen.getByRole("tab", { name: /academic/i });
    expect(acadTab).toHaveAttribute("aria-selected", "true");
    expect(profTab).toHaveAttribute("aria-selected", "false");
  });

  it("calls onSelect with 'academic' when Academic tab is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    await user.click(screen.getByRole("tab", { name: /academic/i }));
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith("academic");
    });
  });

  it("calls onSelect with 'professional' when Professional tab is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="academic" />);
    await user.click(screen.getByRole("tab", { name: /professional/i }));
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith("professional");
    });
  });

  it("persists selection to sessionStorage on click", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    await user.click(screen.getByRole("tab", { name: /academic/i }));
    await waitFor(() => {
      expect(sessionStorageMock.getItem("careerPath")).toBe("academic");
    });
  });

  it("restores selection from sessionStorage on mount", async () => {
    sessionStorageMock.setItem("careerPath", "academic");
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith("academic");
    });
  });

  it("has tablist role with accessible label", () => {
    const onSelect = jest.fn();
    renderWithIntl(<CareerPathSelector onSelect={onSelect} selected="professional" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute("aria-label");
  });
});
