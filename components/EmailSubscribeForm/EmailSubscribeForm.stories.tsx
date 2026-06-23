import type { Meta, StoryObj } from "@storybook/react";
import EmailSubscribeForm from "./index";

/**
 * Lightweight email-capture form (Formspree) used in the exit-intent modal and
 * at the bottom of the page. Renders inline, or with a message textarea.
 */
const meta: Meta<typeof EmailSubscribeForm> = {
  title: "Components/EmailSubscribeForm",
  component: EmailSubscribeForm,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline email + submit button. */
export const Inline: Story = {
  args: { placeholder: "your@email.com", buttonLabel: "Send" },
};

/** With an optional message textarea (used in the exit-intent modal). */
export const WithMessage: Story = {
  args: {
    showMessage: true,
    placeholder: "your@email.com",
    buttonLabel: "Contact me",
    messagePlaceholder: "Your message (optional)",
  },
};
