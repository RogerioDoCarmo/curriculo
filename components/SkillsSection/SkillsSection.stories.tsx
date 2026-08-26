import type { Meta, StoryObj } from "@storybook/react";
import type { SkillCategory } from "@/types/index";
import SkillsSection from "./index";

/**
 * SkillsSection shows skill categories as cards that expand independently, with
 * a live name filter that auto-expands matching categories.
 */
const meta: Meta<typeof SkillsSection> = {
  title: "Sections/SkillsSection",
  component: SkillsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const skills: SkillCategory[] = [
  {
    category: "Mobile Development",
    skills: [
      { name: "React Native", level: "expert" },
      { name: "Flutter", level: "advanced" },
      { name: "TypeScript", level: "expert" },
    ],
  },
  {
    category: "Frontend Web",
    skills: [
      { name: "Next.js", level: "advanced" },
      { name: "Tailwind CSS", level: "advanced" },
    ],
  },
  {
    category: "Backend & Tooling",
    skills: [
      { name: "Node.js", level: "intermediate" },
      { name: "Firebase", level: "intermediate" },
    ],
  },
];

export const Default: Story = {
  args: {
    skills,
    locale: "en",
  },
};
