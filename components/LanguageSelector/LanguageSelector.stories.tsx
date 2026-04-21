import type { Meta, StoryObj } from "@storybook/react";
import LanguageSelector from "./index";
import type { SupportedLocale } from "@/types/index";

/**
 * LanguageSelector component — dropdown for switching between supported locales.
 *
 * Features:
 * - Supports Brazilian Portuguese (pt-BR), English (en), and Spanish (es)
 * - Flag icons for visual recognition
 * - Persists language preference to localStorage
 * - Detects browser language on first visit
 * - Keyboard accessible with proper ARIA labels
 * - Integrates with next-intl for internationalization
 *
 * Requirements: 11.5
 */
const meta: Meta<typeof LanguageSelector> = {
  title: "Components/LanguageSelector",
  component: LanguageSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentLocale: {
      control: "select",
      options: ["pt-BR", "en", "es"],
      description: "Currently selected locale",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the selector",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default language selector with Brazilian Portuguese
 */
export const Default: Story = {
  args: {
    currentLocale: "pt-BR" as SupportedLocale,
  },
};

/**
 * Language selector with English selected
 */
export const English: Story = {
  args: {
    currentLocale: "en" as SupportedLocale,
  },
};

/**
 * Language selector with Spanish selected
 */
export const Spanish: Story = {
  args: {
    currentLocale: "es" as SupportedLocale,
  },
};

/**
 * Language selector with custom styling
 */
export const WithCustomClass: Story = {
  args: {
    currentLocale: "pt-BR" as SupportedLocale,
    className: "shadow-lg",
  },
};

/**
 * Multiple language selectors showing all supported locales
 */
export const AllLocales: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">Portuguese (BR):</span>
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">English:</span>
        <LanguageSelector currentLocale={"en" as SupportedLocale} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">Spanish:</span>
        <LanguageSelector currentLocale={"es" as SupportedLocale} />
      </div>
    </div>
  ),
};

/**
 * Language selector in a navigation bar context
 */
export const InNavbar: Story = {
  render: () => (
    <nav className="flex items-center justify-between p-4 bg-background border-b border-border min-w-[600px]">
      <div className="text-lg font-bold">My Website</div>
      <div className="flex items-center gap-4">
        <a href="#" className="text-sm hover:underline">
          Home
        </a>
        <a href="#" className="text-sm hover:underline">
          About
        </a>
        <a href="#" className="text-sm hover:underline">
          Contact
        </a>
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      </div>
    </nav>
  ),
};

/**
 * Language selector with explanatory text
 */
export const WithExplanation: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-6 max-w-md">
      <h3 className="text-lg font-semibold">Language Preferences</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Select your preferred language. The website supports Brazilian Portuguese, English, and
        Spanish.
      </p>
      <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        Your preference will be saved for future visits
      </p>
    </div>
  ),
};

/**
 * Language selector combined with theme toggle
 */
export const WithThemeToggle: Story = {
  render: () => {
    // Import ThemeToggle dynamically to avoid circular dependencies
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ThemeToggle = require("../ThemeToggle").default;
    return (
      <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
        <div className="w-px h-6 bg-border" />
        <ThemeToggle />
      </div>
    );
  },
};
