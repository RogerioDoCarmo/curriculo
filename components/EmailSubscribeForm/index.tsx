"use client";

/**
 * EmailSubscribeForm — lightweight email capture form using Formspree.
 * Used in the ExitIntentModal and at the bottom of the main page.
 *
 * When `showMessage` is true, renders an optional textarea whose content
 * is sent as the email body via Formspree's `message` field.
 */

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email";
  return "";
}

interface EmailSubscribeFormProps {
  /** Placeholder text for the email input */
  readonly placeholder?: string;
  /** Submit button label */
  readonly buttonLabel?: string;
  /** Success message shown after submission */
  readonly successMessage?: string;
  /** Additional CSS classes for the wrapper */
  readonly className?: string;
  /** When true, renders a message textarea below the email input */
  readonly showMessage?: boolean;
  /** Placeholder for the message textarea */
  readonly messagePlaceholder?: string;
}

export default function EmailSubscribeForm({
  placeholder = "your@email.com",
  buttonLabel = "Send",
  successMessage = "Thanks! I'll be in touch.",
  className = "",
  showMessage = false,
  messagePlaceholder = "Your message (optional)",
}: EmailSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    setStatus("submitting");
    setEmailError("");

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const endpoint = formId
      ? `https://formspree.io/f/${formId}`
      : "https://formspree.io/f/placeholder";

    const payload: Record<string, string> = {
      email,
      _subject: "New message from resume website",
      _replyto: email,
    };

    if (showMessage && message.trim()) {
      payload.message = message.trim();
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        aria-live="polite"
        className={`text-sm font-medium text-green-600 dark:text-green-400 ${className}`}
      >
        ✓ {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`flex flex-col gap-3 ${className}`}>
      {/* Email row */}
      <div className="flex gap-2">
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          placeholder={placeholder}
          aria-required="true"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "subscribe-email-error" : undefined}
          disabled={status === "submitting"}
          className="flex-1 min-w-0 rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        {/* Show button inline when no message textarea */}
        {!showMessage && (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="shrink-0 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {status === "submitting" ? "..." : buttonLabel}
          </button>
        )}
      </div>

      {emailError && (
        <p
          id="subscribe-email-error"
          role="alert"
          className="text-xs text-red-600 dark:text-red-400"
        >
          {emailError}
        </p>
      )}

      {/* Optional message textarea */}
      {showMessage && (
        <>
          <label htmlFor="subscribe-message" className="sr-only">
            Message
          </label>
          <textarea
            id="subscribe-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            rows={4}
            disabled={status === "submitting"}
            className="w-full resize-y rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="self-end rounded-md bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {status === "submitting" ? "Sending..." : buttonLabel}
          </button>
        </>
      )}

      {status === "error" && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
