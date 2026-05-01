/**
 * Integration test for ContactForm component
 * Tests the complete form submission flow including validation, API calls, and state management
 *
 * Task 9.5: Write integration test for contact form flow
 * - Test complete flow: fill form → submit → see confirmation
 * - Test error handling for API failures
 * - Test form reset after successful submission
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ContactForm from "@/components/ContactForm";

// Mock messages for next-intl
const messages: AbstractIntlMessages = {
  forms: {
    name: "Name",
    namePlaceholder: "Your name",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    email: "Email",
    emailPlaceholder: "your.email@example.com",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    message: "Message",
    messagePlaceholder: "Your message...",
    messageRequired: "Message is required",
    messageMinLength: "Message must be at least 10 characters",
    submit: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    error: "Failed to send message. Please try again.",
    orUseForm: "Or use the form below",
    formAriaLabel: "Contact form",
  },
  footer: {
    emailLabel: "Professional Email",
  },
};

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper to render with next-intl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("ContactForm Integration Tests", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("Complete form submission flow", () => {
    it("fills form, submits, and sees success confirmation", async () => {
      const user = userEvent.setup();

      // Mock successful API response with a slight delay to catch loading state
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      renderWithIntl(<ContactForm locale="en" />);

      // Step 1: Fill out the form
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john.doe@example.com");
      await user.type(
        messageInput,
        "This is a test message that is long enough to pass validation."
      );

      // Verify inputs are filled
      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john.doe@example.com");
      expect(messageInput).toHaveValue(
        "This is a test message that is long enough to pass validation."
      );

      // Step 2: Submit the form
      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Step 3: Verify loading state appears
      await waitFor(() => {
        expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument();
      });

      // Step 4: Verify success confirmation appears
      await waitFor(
        () => {
          expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Step 5: Verify form was reset
      await waitFor(() => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(messageInput).toHaveValue("");
      });

      // Verify fetch was called with correct data
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("John Doe"),
        })
      );
    });

    it("shows validation errors before submission", async () => {
      const user = userEvent.setup();
      renderWithIntl(<ContactForm locale="en" />);

      // Try to submit empty form
      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Verify validation errors appear
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });

      // Verify fetch was NOT called
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("validates individual fields on blur", async () => {
      const user = userEvent.setup();
      renderWithIntl(<ContactForm locale="en" />);

      // Fill email with invalid value and blur
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      await user.tab(); // Trigger blur

      // Verify email validation error appears
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error handling for API failures", () => {
    it("shows error message when API returns error response", async () => {
      const user = userEvent.setup();

      // Mock failed API response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      renderWithIntl(<ContactForm locale="en" />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Verify error message appears
      await waitFor(
        () => {
          expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verify form was NOT reset (user can retry)
      expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
    });

    it("shows error message when network request fails", async () => {
      const user = userEvent.setup();

      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      renderWithIntl(<ContactForm locale="en" />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Verify error message appears
      await waitFor(
        () => {
          expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("allows retry after error", async () => {
      const user = userEvent.setup();

      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      renderWithIntl(<ContactForm locale="en" />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
      });

      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Retry submission
      await user.click(submitButton);

      // Verify success message appears
      await waitFor(
        () => {
          expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Form reset after successful submission", () => {
    it("clears all fields after successful submission", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      renderWithIntl(<ContactForm locale="en" />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      // Fill form
      await user.type(nameInput, "Jane Smith");
      await user.type(emailInput, "jane.smith@example.com");
      await user.type(messageInput, "Another test message with enough characters.");

      // Submit
      await user.click(screen.getByRole("button", { name: /send message/i }));

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Verify all fields are cleared
      await waitFor(() => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(messageInput).toHaveValue("");
      });
    });

    it("clears validation errors after successful submission", async () => {
      const user = userEvent.setup();

      renderWithIntl(<ContactForm locale="en" />);

      // First, trigger validation errors
      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      // Now fill form correctly
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      await user.click(submitButton);

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Verify validation errors are gone
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/message is required/i)).not.toBeInTheDocument();
    });

    it("allows submitting a new message after successful submission", async () => {
      const user = userEvent.setup();

      // First submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      renderWithIntl(<ContactForm locale="en" />);

      await user.type(screen.getByLabelText(/name/i), "First User");
      await user.type(screen.getByLabelText(/email/i), "first@example.com");
      await user.type(screen.getByLabelText(/message/i), "First message with enough text.");

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Second submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await user.type(screen.getByLabelText(/name/i), "Second User");
      await user.type(screen.getByLabelText(/email/i), "second@example.com");
      await user.type(screen.getByLabelText(/message/i), "Second message with enough text.");

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Verify fetch was called twice
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accessibility during form flow", () => {
    it("maintains focus management throughout submission flow", async () => {
      const user = userEvent.setup();

      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      renderWithIntl(<ContactForm locale="en" />);

      // Fill and submit
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      const submitButton = screen.getByRole("button", { name: /send message/i });
      await user.click(submitButton);

      // Verify button is disabled during submission
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /sending\.\.\./i });
        expect(button).toBeDisabled();
      });

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Verify button is re-enabled after submission
      await waitFor(() => {
        const button = screen.getByRole("button", { name: /send message/i });
        expect(button).not.toBeDisabled();
      });
    });

    it("announces success message to screen readers", async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      renderWithIntl(<ContactForm locale="en" />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "This is a test message that is long enough."
      );

      await user.click(screen.getByRole("button", { name: /send message/i }));

      // Verify success message has appropriate role or aria-live
      await waitFor(() => {
        const successMessage = screen.getByText(/message sent successfully/i);
        expect(successMessage).toBeInTheDocument();
        // The message should be in a region that's announced to screen readers
        expect(
          successMessage.closest('[role="status"]') || successMessage.closest("[aria-live]")
        ).toBeTruthy();
      });
    });
  });
});
