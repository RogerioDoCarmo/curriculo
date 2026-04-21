import type { Meta, StoryObj } from "@storybook/react";
import ThemeToggle from "./index";

/**
 * ThemeToggle component — button to switch between light and dark modes.
 *
 * Features:
 * - Sun icon (☀️) in dark mode (clicking switches to light)
 * - Moon icon (🌙) in light mode (clicking switches to dark)
 * - Smooth transition animations
 * - Keyboard accessible with focus indicators
 * - Persists theme preference to localStorage
 * - Detects system preference on first load
 *
 * Requirements: 17.5, 17.6, 17.8
 */
const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme toggle button
 */
export const Default: Story = {
  args: {},
};

/**
 * Theme toggle with custom styling
 */
export const WithCustomClass: Story = {
  args: {
    className: "shadow-lg",
  },
};

/**
 * Multiple theme toggles demonstrating different states
 */
export const MultipleToggles: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle />
        <span className="text-xs text-gray-600 dark:text-gray-400">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle className="shadow-md" />
        <span className="text-xs text-gray-600 dark:text-gray-400">With Shadow</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle className="scale-125" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Larger</span>
      </div>
    </div>
  ),
};

/**
 * Theme toggle in a navigation bar context
 */
export const InNavbar: Story = {
  render: () => (
    <nav className="flex items-center justify-between p-4 bg-background border-b border-border">
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
        <ThemeToggle />
      </div>
    </nav>
  ),
};

/**
 * Theme toggle with explanatory text
 */
export const WithExplanation: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-6 max-w-md">
      <h3 className="text-lg font-semibold">Theme Preferences</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Toggle between light and dark mode. Your preference will be saved for future visits.
      </p>
      <ThemeToggle />
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        Click the button to switch themes
      </p>
    </div>
  ),
};
