import type { Meta, StoryObj } from "@storybook/react";
import Button from "./index";

/**
 * Button component with multiple variants and sizes.
 *
 * Supports three visual styles (primary, secondary, ghost) and three sizes (sm, md, lg).
 * Includes loading and disabled states with proper accessibility attributes.
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    loading: {
      control: "boolean",
      description: "Whether the button shows a loading spinner",
    },
    onClick: {
      action: "clicked",
      description: "Click handler function",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button - main call-to-action
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Primary Button",
  },
};

/**
 * Secondary button - alternative action
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Secondary Button",
  },
};

/**
 * Ghost button - subtle action
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "Ghost Button",
  },
};

/**
 * Small size button
 */
export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Small Button",
  },
};

/**
 * Medium size button (default)
 */
export const Medium: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Medium Button",
  },
};

/**
 * Large size button
 */
export const Large: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Large Button",
  },
};

/**
 * Disabled button - cannot be clicked
 */
export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Disabled Button",
    disabled: true,
  },
};

/**
 * Loading button - shows spinner
 */
export const Loading: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Loading Button",
    loading: true,
  },
};

/**
 * All variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary" size="md">
        Primary
      </Button>
      <Button variant="secondary" size="md">
        Secondary
      </Button>
      <Button variant="ghost" size="md">
        Ghost
      </Button>
    </div>
  ),
};

/**
 * All sizes side by side
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};
