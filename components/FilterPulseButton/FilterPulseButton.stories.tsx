import type { Meta, StoryObj } from "@storybook/react";
import FilterPulseButton from "./index";
import FilterPulseOverlay from "@/components/FilterPulseOverlay";

/**
 * FilterPulseButton component — triggers a one-shot circular filter-pulse
 * animation. Which registered filter it plays (see lib/filterPulses.ts)
 * defaults to DEFAULT_FILTER_PULSE_ID and can be overridden per instance.
 */
const meta: Meta<typeof FilterPulseButton> = {
  title: "Components/FilterPulseButton",
  component: FilterPulseButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the button",
    },
    filterId: {
      control: "text",
      description: "Which registered filter (lib/filterPulses.ts) to trigger",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const InNavbar: Story = {
  render: (args) => (
    <nav className="flex items-center gap-2 rounded-md border border-border bg-background p-3">
      <span className="text-sm text-foreground">Rogério do Carmo</span>
      <div className="flex-1" />
      <FilterPulseButton {...args} />
    </nav>
  ),
};

/**
 * Renders the button together with the real overlay it drives — click it to
 * see the actual grow/shrink filter pulse play out.
 */
export const LiveDemo: Story = {
  render: (args) => (
    <div className="relative flex h-64 w-80 items-center justify-center overflow-hidden rounded-md border border-border bg-background p-6">
      <p className="text-sm text-foreground">Click the button to trigger the pulse.</p>
      <div className="absolute top-3 right-3">
        <FilterPulseButton {...args} />
      </div>
      <FilterPulseOverlay />
    </div>
  ),
};
