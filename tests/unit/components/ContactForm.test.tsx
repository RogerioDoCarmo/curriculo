/**
 * Unit tests for ContactForm component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ContactForm Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders name, email, and message fields", () => {
    render(<ContactForm locale="en" />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<ContactForm locale="en" />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation error when name is empty on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when name is too short", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.type(screen.getByLabelText(/name/i), "A");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when email is empty on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when email is invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when message is empty on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when message is too short", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    await user.type(screen.getByLabelText(/message/i), "Short");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it("shows inline error messages below each field", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
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
    render(<ContactForm locale="en" />);
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
    render(<ContactForm locale="en" />);
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
    render(<ContactForm locale="en" />);
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
    render(<ContactForm locale="en" />);
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
    render(<ContactForm locale="en" />);
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

  it("renders section with correct id", () => {
    render(<ContactForm locale="en" />);
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("has accessible form with aria-label", () => {
    render(<ContactForm locale="en" />);
    const form = screen.getByRole("form", { name: /contact form/i });
    expect(form).toBeInTheDocument();
  });

  it("shows error inline below field on blur with invalid value", async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="en" />);
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "bademail");
    await user.tab(); // blur
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });
});
