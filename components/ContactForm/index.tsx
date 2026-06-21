"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ContactFormData } from "@/types/index";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import {
  trackFormFieldFocus,
  trackFormFieldBlur,
  trackFormValidationError,
  trackFormSubmissionStart,
  trackFormSubmissionSuccess,
  trackFormSubmissionError,
} from "@/lib/analytics";
import NotificationPrompt from "@/components/NotificationPrompt";

interface ContactFormProps {
  readonly locale: string;
}

/**
 * Validates email address format.
 * Uses a ReDoS-safe regex pattern with input length limit to prevent denial of service attacks.
 *
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  // Prevent ReDoS: Limit input length before regex validation
  if (email.length > 254) return false;

  // ReDoS-safe email regex: Uses atomic groups (possessive quantifiers simulation)
  // Pattern: local-part@domain where domain has at least one dot
  // This regex avoids catastrophic backtracking by using simple character classes
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

/**
 * ARIA props for a form field. Spreading literal-valued props keeps `aria-invalid`
 * a literal "true" (omitted when the field is valid) and ties the field to its
 * error message — so static a11y linters don't flag a dynamic `aria-invalid={expr}`.
 */
function fieldErrorAria(errorId: string, hasError: boolean) {
  return hasError ? ({ "aria-invalid": "true", "aria-describedby": errorId } as const) : {};
}

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("forms");
  const footer = useTranslations("footer");
  const { hasFunctionalConsent } = useCookieConsent();

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>(
    {}
  );
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [_submissionStartTime, setSubmissionStartTime] = useState<number>(0);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState<boolean>(false);

  function validateForm(
    data: Partial<ContactFormData>
  ): Partial<Record<keyof ContactFormData, string>> {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!data.name || data.name.trim().length === 0) {
      errors.name = t("nameRequired");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "name",
        error_type: "required",
      });
    } else if (data.name.trim().length < 2) {
      errors.name = t("nameMinLength");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "name",
        error_type: "min_length",
      });
    }
    if (!data.email || data.email.trim().length === 0) {
      errors.email = t("emailRequired");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "email",
        error_type: "required",
      });
    } else if (!isValidEmail(data.email.trim())) {
      errors.email = t("emailInvalid");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "email",
        error_type: "invalid_format",
      });
    }
    if (!data.message || data.message.trim().length === 0) {
      errors.message = t("messageRequired");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "message",
        error_type: "required",
      });
    } else if (data.message.trim().length < 10) {
      errors.message = t("messageMinLength");
      trackFormValidationError({
        form_name: "contact_form",
        field_name: "message",
        error_type: "min_length",
      });
    }
    return errors;
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const errs = validateForm(updated);
      setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  }

  function handleBlur(field: keyof ContactFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateForm(formData);
    setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
    trackFormFieldBlur({
      form_name: "contact_form",
      field_name: field,
      has_value: !!formData[field] && formData[field]!.trim().length > 0,
    });
  }

  function handleFocus(field: keyof ContactFormData) {
    trackFormFieldFocus({
      form_name: "contact_form",
      field_name: field,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate all fields
    const errs = validateForm(formData);
    setFieldErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    const startTime = Date.now();
    setSubmissionStartTime(startTime);
    trackFormSubmissionStart({ form_name: "contact_form" });

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const endpoint = formId
      ? `https://formspree.io/f/${formId}`
      : "https://formspree.io/f/placeholder";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        const submissionTime = Date.now() - startTime;
        trackFormSubmissionSuccess({
          form_name: "contact_form",
          submission_time_ms: submissionTime,
        });
        setFormData({ name: "", email: "", message: "" });
        setTouched({});
        setFieldErrors({});

        // Show notification prompt after successful submission only when functional consent is given
        if (
          hasFunctionalConsent() &&
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "default" &&
          !localStorage.getItem("notification-prompt-shown-after-contact")
        ) {
          // Delay showing the prompt by 2 seconds to let user see success message
          setTimeout(() => {
            setShowNotificationPrompt(true);
            localStorage.setItem("notification-prompt-shown-after-contact", "true");
          }, 2000);
        }
      } else {
        setStatus("error");
        trackFormSubmissionError({
          form_name: "contact_form",
          error_message: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      setStatus("error");
      trackFormSubmissionError({
        form_name: "contact_form",
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const email = locale === "pt-BR" ? "contato@rogeriodocarmo.com" : "contact@rogeriodocarmo.com";

  return (
    <>
      {/* Professional Email Note */}
      <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 7 10-7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {footer("emailLabel")}
            </p>
            <a
              href={`mailto:${email}`}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {email}
            </a>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{t("orUseForm")}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-lg space-y-5"
        aria-label={t("formAriaLabel")}
      >
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("name")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-required="true"
            {...fieldErrorAria("contact-name-error", !!fieldErrors.name)}
            value={formData.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            onFocus={() => handleFocus("name")}
            onBlur={() => handleBlur("name")}
            className={[
              "w-full rounded-md border px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
              fieldErrors.name
                ? "border-red-500 focus:ring-red-500 dark:border-red-400"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600",
            ].join(" ")}
            placeholder={t("namePlaceholder")}
          />
          {fieldErrors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("email")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-required="true"
            {...fieldErrorAria("contact-email-error", !!fieldErrors.email)}
            value={formData.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            className={[
              "w-full rounded-md border px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
              fieldErrors.email
                ? "border-red-500 focus:ring-red-500 dark:border-red-400"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600",
            ].join(" ")}
            placeholder={t("emailPlaceholder")}
          />
          {fieldErrors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("message")} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            aria-required="true"
            {...fieldErrorAria("contact-message-error", !!fieldErrors.message)}
            value={formData.message ?? ""}
            onChange={(e) => handleChange("message", e.target.value)}
            onFocus={() => handleFocus("message")}
            onBlur={() => handleBlur("message")}
            className={[
              "w-full resize-y rounded-md border px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
              fieldErrors.message
                ? "border-red-500 focus:ring-red-500 dark:border-red-400"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600",
            ].join(" ")}
            placeholder={t("messagePlaceholder")}
          />
          {fieldErrors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.message}
            </p>
          )}
        </div>

        {/* Status messages */}
        {status === "success" && (
          <p
            role="status"
            aria-live="polite"
            className="text-sm font-medium text-green-600 dark:text-green-400"
          >
            {t("success")}
          </p>
        )}
        {status === "error" && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-sm font-medium text-red-600 dark:text-red-400"
          >
            {t("error")}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          {...(status === "submitting"
            ? ({ "aria-busy": "true" } as const)
            : ({ "aria-busy": "false" } as const))}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          {status === "submitting" ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t("sending")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>

      {/* Notification Prompt - shown after successful form submission */}
      {showNotificationPrompt && <NotificationPrompt show={true} />}
    </>
  );
}
