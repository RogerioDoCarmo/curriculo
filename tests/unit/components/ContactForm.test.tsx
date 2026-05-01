/**
 * Unit tests for ContactForm component
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ContactForm from "@/components/ContactForm";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const messages: AbstractIntlMessages = {
  forms: {
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send Message",
    success: "Message sent successfully!",
    error: "Failed to send message. Please try again.",
    sending: "Sending...",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    emailRequired: "Email is required",
    emailInvalid: "Email must be a valid email address",
    messageRequired: "Message is required",
    messageMinLength: "Message must be at least 10 characters",
    namePlaceholder: "Your name",
    emailPlaceholder: "your@email.com",
    messagePlaceholder: "Your message (at least 10 characters)",
    formAriaLabel: "Contact form",
    orUseForm: "Or use the form below to send me a message",
  },
  footer: {
    emailLabel: "Professional Email",
  },
};

function renderContactForm(locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ContactForm locale={locale} />
    </NextIntlClientProvider>
  );
}

describe("ContactForm Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders name, email, and message fields", () => {
    renderContactForm();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderContactForm();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation error when name is empty on submit", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when name is too short", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.type(screen.getByLabelText(/name/i), "A");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when email is empty on submit", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when email is invalid", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when message is empty on submit", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when message is too short", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.type(screen.getByLabelText(/message/i), "Short");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("shows inline error messages below each field", async () => {
    const user = userEvent.setup();
    renderContactForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      // All three errors should be visible
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();
    // Mock a slow fetch
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 500))
    );
    renderContactForm();
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });

  it("shows success message after successful submission", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderContactForm();
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderContactForm();
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
    });
  });

  it("shows error message when submission fails", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false });
    renderContactForm();
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });

  it("shows error message when network error occurs", async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    renderContactForm();
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });

  it("has accessible form with aria-label", () => {
    renderContactForm();
    const form = screen.getByRole("form", { name: /contact form/i });
    expect(form).toBeInTheDocument();
  });

  it("shows error inline below field on blur with invalid value", async () => {
    const user = userEvent.setup();
    renderContactForm();
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "bademail");
    await user.tab(); // blur
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("renders professional email label", () => {
    renderContactForm();
    expect(screen.getByText("Professional Email")).toBeInTheDocument();
  });

  it("renders correct email for English locale", () => {
    renderContactForm("en");
    expect(screen.getByText("contact@rogeriodocarmo.com")).toBeInTheDocument();
  });

  it("renders correct email for Portuguese locale", () => {
    renderContactForm("pt-BR");
    expect(screen.getByText("contato@rogeriodocarmo.com")).toBeInTheDocument();
  });
});
