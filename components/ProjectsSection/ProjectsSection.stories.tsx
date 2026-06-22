import type { Meta, StoryObj } from "@storybook/react";
import type { Project } from "@/types/index";
import ProjectsSection from "./index";

/**
 * Projects portfolio: a technology-filtered grid of project cards that open a
 * detail modal on click.
 */
const meta: Meta<typeof ProjectsSection> = {
  title: "Sections/ProjectsSection",
  component: ProjectsSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const projects: Project[] = [
  {
    id: "inct-gnss-app",
    title: "INCT GNSS App",
    description: "Android app for raw GNSS data collection and real-time positioning.",
    technologies: ["Java", "Android SDK", "GNSS"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: true,
    date: "2023-06-01",
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description: "This resume site — Next.js, TypeScript, Tailwind, next-intl.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: false,
    date: "2024-01-01",
  },
  {
    id: "study-app",
    title: "Study App",
    description: "Android study companion with spaced repetition.",
    technologies: ["Kotlin", "Android SDK"],
    images: [],
    featured: false,
    date: "2022-03-01",
  },
];

export const Default: Story = {
  args: { projects, locale: "en" },
};
