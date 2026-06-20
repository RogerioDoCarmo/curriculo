import type { Meta, StoryObj } from "@storybook/react";
import BanksSection from "./index";

/**
 * BanksSection renders an auto-scrolling, hover-pausing marquee of the client
 * banks whose apps benefited from the work in the current professional role.
 * Each logo links out to the institution and shows its country flag.
 */
const meta: Meta<typeof BanksSection> = {
  title: "Sections/BanksSection",
  component: BanksSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default carousel with all six institutions.
 */
export const Default: Story = {};
