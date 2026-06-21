import type { Meta, StoryObj } from "@storybook/react";
import type { Experience } from "@/types/index";
import FeaturedExperience from "./index";

/**
 * FeaturedExperience pins `featured` experiences above the career-path selector.
 * Each card has a clickable organization logo and role title, a short intro, a
 * collapsible achievements (Conquistas) section, and technology tags.
 */
const meta: Meta<typeof FeaturedExperience> = {
  title: "Sections/FeaturedExperience",
  component: FeaturedExperience,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const inct: Experience = {
  id: "inct-gnss-navaer",
  type: "academic",
  organization: "INCT GNSS-NavAer",
  role: "Membro Pesquisador — Mestrado (UNESP)",
  location: "Presidente Prudente, BR",
  startDate: "2019-03-01",
  endDate: "2023-03-01",
  description:
    "Team member of [INCT GNSS-NavAer](https://inct-gnss-navaer.fct.unesp.br/), a GNSS research network coordinated by UNESP.\n- Listed on the official project team as a researcher affiliated with UNESP\n- Research on GNSS positioning with Android smartphones",
  achievements: [
    "Listed on the official project team as a researcher affiliated with UNESP",
    "Research on GNSS positioning with Android smartphones",
  ],
  technologies: ["GNSS/GPS", "RINEX", "Java", "Android SDK"],
  logo: "/images/logos/logo_inct_gnss_navaer.png",
  images: [
    "/images/experience/inct/placeholder-1.svg",
    "/images/experience/inct/placeholder-2.svg",
    "/images/experience/inct/placeholder-3.svg",
  ],
  organizationUrl: "https://inct-gnss-navaer.fct.unesp.br/",
  featured: true,
};

/**
 * Featured academic card (INCT GNSS-NavAer). `now` is fixed so the duration
 * string stays stable across snapshots.
 */
export const Default: Story = {
  args: {
    experiences: [inct],
    locale: "en",
    now: Date.UTC(2026, 5, 20),
  },
};

/**
 * No featured experiences — the section renders nothing.
 */
export const Empty: Story = {
  args: {
    experiences: [{ ...inct, featured: false }],
    locale: "en",
    now: Date.UTC(2026, 5, 20),
  },
};
