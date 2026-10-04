import type { Meta, StoryObj } from "@storybook/react";
import type { Project } from "@/types/index";
import ProjectsPage from "./index";

/**
 * Every project in display order (featured first, then newest), with a
 * technology filter. Each card opens the same detail dialog as the home page.
 */
const meta: Meta<typeof ProjectsPage> = {
  title: "Pages/ProjectsPage",
  component: ProjectsPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const projects: Project[] = [
  {
    id: "android-study-app",
    title: "Android Native Crud",
    description: "Sample application built to study the Android environment.",
    technologies: ["Java", "Android SDK", "SQLite"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: false,
    date: "2017-09-01",
  },
  {
    id: "miroji",
    title: "Miroji",
    description: "Front-camera mirror app, a case study in hexagonal architecture.",
    technologies: ["React Native 0.81", "Expo SDK 54", "TypeScript", "Jest"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: true,
    date: "2026-08-18",
  },
  {
    id: "inct-gnss-app",
    title: "INCT GNSS App",
    description: "Android app for raw GNSS data collection and real-time positioning.",
    technologies: ["Java", "Android SDK", "GNSS/GPS"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: true,
    date: "2021-06-01",
  },
  {
    id: "omnimorse",
    title: "OmniMorse",
    description: "Morse code translator for Android and iOS, currently in testing.",
    technologies: ["React Native 0.86", "Expo SDK 57", "TypeScript", "Kotlin", "Jest"],
    images: [],
    repoUrl: "https://example.com/repo",
    featured: false,
    date: "2026-10-04",
  },
];

/** Four projects: the home page would show three, this page shows all of them. */
export const Default: Story = {
  args: { projects, locale: "en" },
};
