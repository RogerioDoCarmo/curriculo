import type { Meta, StoryObj } from "@storybook/react";
import ContactForm from "./index";

/**
 * Contact form (name / email / message) with client-side validation and a
 * submit button. Strings come from the next-intl provider configured globally
 * in `.storybook/preview.tsx`.
 */
const meta: Meta<typeof ContactForm> = {
  title: "Components/ContactForm",
  component: ContactForm,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { locale: "en" },
};
