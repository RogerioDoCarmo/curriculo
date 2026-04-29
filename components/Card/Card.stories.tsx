import type { Meta, StoryObj } from "@storybook/react";
import Card from "./index";

/**
 * Card component provides a container with consistent styling.
 *
 * Features hover effects, optional title, and supports both light and dark themes.
 */
const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Optional title displayed at the top of the card",
    },
    children: {
      control: "text",
      description: "Content to display inside the card",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card with title
 */
export const WithTitle: Story = {
  args: {
    title: "Card Title",
    children: "This is the card content. It can contain any React elements.",
  },
};

/**
 * Card without title
 */
export const WithoutTitle: Story = {
  args: {
    children: "This card has no title, just content.",
  },
};

/**
 * Card with rich content
 */
export const WithRichContent: Story = {
  args: {
    title: "Project Card",
    children: (
      <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A modern, responsive personal resume website built with Next.js 16, TypeScript, and
          Tailwind CSS.
        </p>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            Next.js
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            TypeScript
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            Tailwind
          </span>
        </div>
      </div>
    ),
  },
};

/**
 * Multiple cards in a grid
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <Card title="Card 1">
        <p className="text-gray-600 dark:text-gray-300">First card content</p>
      </Card>
      <Card title="Card 2">
        <p className="text-gray-600 dark:text-gray-300">Second card content</p>
      </Card>
      <Card title="Card 3">
        <p className="text-gray-600 dark:text-gray-300">Third card content</p>
      </Card>
    </div>
  ),
};
