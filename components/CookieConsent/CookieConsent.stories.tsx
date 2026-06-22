import type { Meta, StoryObj, Decorator } from "@storybook/react";
import CookieConsent from "./index";

/**
 * Cookie consent banner. It self-manages visibility via the `useCookieConsent`
 * hook (localStorage) and only renders while consent is "pending", so the
 * decorator clears any stored choice before each render.
 */
const resetConsent: Decorator = (Story) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("cookie-consent");
    window.localStorage.removeItem("cookie-preferences");
  }
  return <Story />;
};

const meta: Meta<typeof CookieConsent> = {
  title: "Components/CookieConsent",
  component: CookieConsent,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [resetConsent],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The initial banner (Accept / Reject / Customize). */
export const Banner: Story = {};
