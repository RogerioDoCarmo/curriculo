/**
 * Unit tests for EmailSubscribeForm component.
 * Tests email validation, submission flow, success/error states.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("EmailSubscribeForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("rendering", () => {
    it("renders email input and submit button", () => {
      render(<EmailSubscribeForm />);
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("uses custom placeholder", () => {
      render(<EmailSubscribeForm placeholder="Enter your email" />);
      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });

    it("uses custom button label", () => {
      render(<EmailSubscribeForm buttonLabel="Subscribe" />);
      expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
    });

    it("does not render textarea by default", () => {
      render(<EmailSubscribeForm />);
      expect(screen.queryByRole("textbox", { name: /message/i })).not.toBeInTheDocument();
    });

    it("renders textarea when showMessage is true", () => {
      render(<EmailSubscribeForm showMessage />);
      expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
    });

    it("uses custom messagePlaceholder", () => {
      render(<EmailSubscribeForm showMessage messagePlaceholder="Say something..." />);
      expect(screen.getByPlaceholderText("Say something...")).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows error when submitting empty email", async () => {
      const user = userEvent.setup();
      render(<EmailSubscribeForm />);

      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<EmailSubscribeForm />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "not-an-email");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("clears error when user types a valid email", async () => {
      const user = userEvent.setup();
      render(<EmailSubscribeForm />);

      // Trigger error
      await user.click(screen.getByRole("button", { name: /send/i }));
      await waitFor(() => expect(screen.getByText(/email is required/i)).toBeInTheDocument());

      // Fix the error
      await user.type(screen.getByRole("textbox", { name: /email/i }), "valid@example.com");
      await waitFor(() => expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument());
    });
  });

  describe("submission", () => {
    it("submits valid email to Formspree and shows success", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<EmailSubscribeForm successMessage="Thanks! I'll be in touch." />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/thanks! i'll be in touch/i)).toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("formspree.io"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("test@example.com"),
        })
      );
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
      );

      render(<EmailSubscribeForm />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(screen.getByRole("button", { name: /\.\.\./i })).toBeDisabled();

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    });

    it("disables input during submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
      );

      render(<EmailSubscribeForm />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(input).toBeDisabled();

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    });

    it("shows error message on API failure", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      render(<EmailSubscribeForm />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it("shows error message on network failure", async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<EmailSubscribeForm />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it("clears email input after successful submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<EmailSubscribeForm />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => expect(screen.queryByRole("textbox")).not.toBeInTheDocument());
    });

    it("includes message in payload when showMessage is true", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<EmailSubscribeForm showMessage />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello there!");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.message).toBe("Hello there!");
      expect(body._replyto).toBe("test@example.com");
    });

    it("omits message field when textarea is empty", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<EmailSubscribeForm showMessage />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.message).toBeUndefined();
    });
  });

  describe("accessibility", () => {
    it("has accessible label for email input", () => {
      render(<EmailSubscribeForm />);
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    });

    it("marks input as invalid when there is an error", async () => {
      const user = userEvent.setup();
      render(<EmailSubscribeForm />);

      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
          "aria-invalid",
          "true"
        );
      });
    });

    it("success message has role=status for screen readers", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: true });

      render(<EmailSubscribeForm successMessage="Done!" />);

      await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });
    });
  });
});
