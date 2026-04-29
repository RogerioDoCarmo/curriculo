import type { Meta, StoryObj } from "@storybook/react";
import HighlightedText from "./index";

/**
 * HighlightedText component highlights matching substrings within text.
 *
 * Features:
 * - Case-insensitive matching
 * - Highlights all occurrences
 * - Falls back to regular text if highlight not found
 * - Escapes special regex characters
 */
const meta: Meta<typeof HighlightedText> = {
  title: "Components/HighlightedText",
  component: HighlightedText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The full text content",
    },
    highlight: {
      control: "text",
      description: "The substring to highlight (case-insensitive)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic highlighting
 */
export const Basic: Story = {
  args: {
    text: "This is a sample text with some words to highlight.",
    highlight: "sample",
  },
};

/**
 * Multiple occurrences
 */
export const MultipleOccurrences: Story = {
  args: {
    text: "React is great. I love React. React makes development easy.",
    highlight: "React",
  },
};

/**
 * Case insensitive matching
 */
export const CaseInsensitive: Story = {
  args: {
    text: "TypeScript, typescript, TYPESCRIPT - all should be highlighted.",
    highlight: "typescript",
  },
};

/**
 * No match - fallback to regular text
 */
export const NoMatch: Story = {
  args: {
    text: "This text does not contain the search term.",
    highlight: "missing",
  },
};

/**
 * Empty highlight - shows regular text
 */
export const EmptyHighlight: Story = {
  args: {
    text: "This text has no highlight applied.",
    highlight: "",
  },
};

/**
 * Highlighting a phrase
 */
export const HighlightPhrase: Story = {
  args: {
    text: "Next.js is a React framework for building web applications.",
    highlight: "React framework",
  },
};

/**
 * Long text with highlighting
 */
export const LongText: Story = {
  args: {
    text: "A modern, responsive personal resume website built with Next.js 16, TypeScript, and Tailwind CSS. The site features multi-language support, dark mode, Firebase integration, comprehensive testing, and CI/CD automation.",
    highlight: "Next.js",
  },
};
