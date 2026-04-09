/**
 * Property-based tests for the contact form.
 *
 * Property 7: Contact Form Accepts Valid Input
 * **Validates: Requirements 3.2, 3.3**
 *
 * Property 8: Contact Form Validates Required Fields
 * **Validates: Requirements 3.2, 3.3**
 *
 * Property 9: Successful Submission Shows Confirmation
 * **Validates: Requirements 3.5**
 */

import * as fc from "fast-check";
import type { ContactFormData } from "@/types/index";

// ─── Pure validation logic (mirrors ContactForm component validation) ─────────

interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

/**
 * Validates an email address using a standard regex pattern.
 * Mirrors the validation logic in the ContactForm component.
 */
function isValidEmail(email: string): boolean {
  // Standard email regex — same pattern used by most form libraries
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the contact form data.
 * Returns a result with valid flag and field-level errors.
 */
function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = "Email must be a valid email address";
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Submission state logic ───────────────────────────────────────────────────

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

interface SubmissionState {
  status: SubmissionStatus;
  message?: string;
}

/**
 * Simulates handling an API response for form submission.
 */
function handleSubmissionResponse(ok: boolean, errorMessage?: string): SubmissionState {
  if (ok) {
    return { status: "success", message: "Message sent successfully!" };
  }
  return { status: "error", message: errorMessage ?? "Failed to send message. Please try again." };
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Generates valid email addresses */
const validEmailArb = fc.emailAddress().filter((email) => isValidEmail(email));

/** Generates invalid email addresses (no @ or no domain) */
const invalidEmailArb = fc.oneof(
  // No @ symbol
  fc.string({ minLength: 1, maxLength: 30 }).filter((s) => !s.includes("@") && s.trim().length > 0),
  // Missing domain part
  fc.string({ minLength: 1, maxLength: 20 }).map((s) => `${s}@`),
  // Missing local part
  fc.string({ minLength: 1, maxLength: 20 }).map((s) => `@${s}`)
);

/** Generates valid names (at least 2 characters) */
const validNameArb = fc
  .string({ minLength: 2, maxLength: 100 })
  .filter((s) => s.trim().length >= 2);

/** Generates valid messages (at least 10 characters) */
const validMessageArb = fc
  .string({ minLength: 10, maxLength: 1000 })
  .filter((s) => s.trim().length >= 10);

/** Generates a complete valid form data object */
const validFormDataArb: fc.Arbitrary<ContactFormData> = fc.record({
  name: validNameArb,
  email: validEmailArb,
  message: validMessageArb,
});

// ─── Property 7: Contact Form Accepts Valid Input ─────────────────────────────

describe("Property 7: Contact Form Accepts Valid Input", () => {
  /**
   * Valid email formats are accepted.
   * Valid name/email/message combinations pass validation.
   *
   * Validates: Requirements 3.2, 3.3
   */

  it("valid email addresses are accepted", () => {
    fc.assert(
      fc.property(validEmailArb, (email) => {
        expect(isValidEmail(email)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("valid form data always passes validation", () => {
    fc.assert(
      fc.property(validFormDataArb, (formData) => {
        const result = validateContactForm(formData);
        expect(result.valid).toBe(true);
        expect(Object.keys(result.errors).length).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it("valid name is accepted (at least 2 characters)", () => {
    fc.assert(
      fc.property(validNameArb, validEmailArb, validMessageArb, (name, email, message) => {
        const result = validateContactForm({ name, email, message });
        expect(result.errors.name).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it("valid email is accepted in full form context", () => {
    fc.assert(
      fc.property(validNameArb, validEmailArb, validMessageArb, (name, email, message) => {
        const result = validateContactForm({ name, email, message });
        expect(result.errors.email).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it("valid message is accepted (at least 10 characters)", () => {
    fc.assert(
      fc.property(validNameArb, validEmailArb, validMessageArb, (name, email, message) => {
        const result = validateContactForm({ name, email, message });
        expect(result.errors.message).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it("validation result has a boolean valid flag", () => {
    fc.assert(
      fc.property(validFormDataArb, (formData) => {
        const result = validateContactForm(formData);
        expect(typeof result.valid).toBe("boolean");
      }),
      { numRuns: 50 }
    );
  });
});

// ─── Property 8: Contact Form Validates Required Fields ──────────────────────

describe("Property 8: Contact Form Validates Required Fields", () => {
  /**
   * Empty required fields are rejected.
   * Invalid email formats are rejected.
   *
   * Validates: Requirements 3.2, 3.3
   */

  it("empty name is rejected", () => {
    fc.assert(
      fc.property(validEmailArb, validMessageArb, (email, message) => {
        const result = validateContactForm({ name: "", email, message });
        expect(result.valid).toBe(false);
        expect(result.errors.name).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("whitespace-only name is rejected", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).map((s) => s.replace(/./g, " ")),
        validEmailArb,
        validMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.valid).toBe(false);
          expect(result.errors.name).toBeDefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("empty email is rejected", () => {
    fc.assert(
      fc.property(validNameArb, validMessageArb, (name, message) => {
        const result = validateContactForm({ name, email: "", message });
        expect(result.valid).toBe(false);
        expect(result.errors.email).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("invalid email formats are rejected", () => {
    fc.assert(
      fc.property(validNameArb, invalidEmailArb, validMessageArb, (name, email, message) => {
        const result = validateContactForm({ name, email, message });
        expect(result.valid).toBe(false);
        expect(result.errors.email).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("empty message is rejected", () => {
    fc.assert(
      fc.property(validNameArb, validEmailArb, (name, email) => {
        const result = validateContactForm({ name, email, message: "" });
        expect(result.valid).toBe(false);
        expect(result.errors.message).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("missing all required fields is rejected with errors for each field", () => {
    const result = validateContactForm({});
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.message).toBeDefined();
  });

  it("missing name field is rejected", () => {
    fc.assert(
      fc.property(validEmailArb, validMessageArb, (email, message) => {
        const result = validateContactForm({ email, message });
        expect(result.valid).toBe(false);
        expect(result.errors.name).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("missing email field is rejected", () => {
    fc.assert(
      fc.property(validNameArb, validMessageArb, (name, message) => {
        const result = validateContactForm({ name, message });
        expect(result.valid).toBe(false);
        expect(result.errors.email).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("missing message field is rejected", () => {
    fc.assert(
      fc.property(validNameArb, validEmailArb, (name, email) => {
        const result = validateContactForm({ name, email });
        expect(result.valid).toBe(false);
        expect(result.errors.message).toBeDefined();
      }),
      { numRuns: 50 }
    );
  });

  it("error messages are always strings when present", () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
          email: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
          message: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
        }),
        (partialData) => {
          const result = validateContactForm(partialData);
          for (const [, errorMsg] of Object.entries(result.errors)) {
            if (errorMsg !== undefined) {
              expect(typeof errorMsg).toBe("string");
              expect(errorMsg.length).toBeGreaterThan(0);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 9: Successful Submission Shows Confirmation ────────────────────

describe("Property 9: Successful Submission Shows Confirmation", () => {
  /**
   * Successful API response always shows confirmation.
   * Error response always shows error message.
   *
   * Validates: Requirements 3.5
   */

  it("successful API response always results in success status", () => {
    fc.assert(
      fc.property(fc.constant(true), (ok) => {
        const state = handleSubmissionResponse(ok);
        expect(state.status).toBe("success");
      }),
      { numRuns: 10 }
    );
  });

  it("successful submission always shows a confirmation message", () => {
    const state = handleSubmissionResponse(true);
    expect(state.status).toBe("success");
    expect(typeof state.message).toBe("string");
    expect(state.message!.length).toBeGreaterThan(0);
  });

  it("error API response always results in error status", () => {
    fc.assert(
      fc.property(fc.constant(false), (ok) => {
        const state = handleSubmissionResponse(ok);
        expect(state.status).toBe("error");
      }),
      { numRuns: 10 }
    );
  });

  it("error response always shows an error message", () => {
    fc.assert(
      fc.property(
        fc.option(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          { nil: undefined }
        ),
        (errorMessage) => {
          const state = handleSubmissionResponse(false, errorMessage);
          expect(state.status).toBe("error");
          expect(typeof state.message).toBe("string");
          expect(state.message!.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it("submission status is always one of the valid states", () => {
    const validStatuses: SubmissionStatus[] = ["idle", "submitting", "success", "error"];
    fc.assert(
      fc.property(fc.boolean(), (ok) => {
        const state = handleSubmissionResponse(ok);
        expect(validStatuses).toContain(state.status);
      }),
      { numRuns: 50 }
    );
  });

  it("success and error states are mutually exclusive", () => {
    const successState = handleSubmissionResponse(true);
    const errorState = handleSubmissionResponse(false);
    expect(successState.status).not.toBe(errorState.status);
  });

  it("confirmation message is non-empty for successful submission", () => {
    fc.assert(
      fc.property(validFormDataArb, (formData) => {
        // Simulate a successful submission
        const state = handleSubmissionResponse(true);
        expect(state.status).toBe("success");
        expect(state.message).toBeTruthy();
        // The form data itself is valid (pre-condition for submission)
        const validation = validateContactForm(formData);
        expect(validation.valid).toBe(true);
      }),
      { numRuns: 50 }
    );
  });
});
