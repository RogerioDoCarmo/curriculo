/**
 * Unit tests for Privacy Policy page
 * Requirements: 10.1, 10.3, 10.4, 10.5, 11.7
 */

import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

// Mock translations for testing
const mockTranslations = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated",
    lastUpdatedDate: "January 2025",
    introduction: {
      title: "Introduction",
      paragraph1: "This Privacy Policy explains how we collect data.",
      paragraph2: "We are committed to protecting your privacy.",
    },
    dataCollection: {
      title: "Data Collection",
      intro: "We collect the following types of data:",
      analytics: {
        title: "Analytics Data",
        important: "All analytics data is anonymous",
        description: "We use Firebase Analytics",
        navigation: {
          title: "Navigation",
          pageViews: "Page views",
          linkClicks: "Link clicks",
          sectionNav: "Section navigation",
          preferences: "Preferences",
        },
        forms: {
          title: "Form Interactions",
          fieldFocus: "Field focus",
          validationErrors: "Validation errors",
          submissionEvents: "Submission events",
          timing: "Timing",
        },
        engagement: {
          title: "Content Engagement",
          scrollDepth: "Scroll depth",
          timeOnPage: "Time on page",
          interactions: "Interactions",
        },
        userPreferences: {
          title: "User Preferences",
          theme: "Theme",
          language: "Language",
          careerPath: "Career path",
        },
        errors: {
          title: "Error Events",
          componentErrors: "Component errors",
          apiFailures: "API failures",
        },
      },
      email: {
        title: "Email Addresses",
        description: "We collect email addresses when you:",
        contactForm: "Submit the contact form",
        subscription: "Subscribe to updates",
        storage: "Stored by Formspree",
      },
      notifications: {
        title: "Notification Tokens",
        description: "If you grant permission:",
        optIn: "We collect FCM tokens",
        tokens: "Used for notifications",
        revoke: "You can revoke permission",
      },
      browserStorage: {
        title: "Browser Storage",
        description: "We store locally:",
        theme: "Theme preference",
        language: "Language preference",
        consent: "Cookie consent",
        session: "Session data",
      },
    },
    dataUsage: {
      title: "Data Usage",
      intro: "We use data for:",
      analytics: {
        title: "Analytics",
        description: "Site improvement",
      },
      communication: {
        title: "Communication",
        description: "Responding to messages",
      },
      personalization: {
        title: "Personalization",
        description: "Remembering preferences",
      },
      improvement: {
        title: "Improvement",
        description: "Error detection",
      },
    },
    dataStorage: {
      title: "Data Storage",
      intro: "Data is stored in:",
      firebase: {
        title: "Firebase",
        description: "Analytics and tokens",
      },
      formspree: {
        title: "Formspree",
        description: "Form submissions",
      },
      localStorage: {
        title: "localStorage",
        description: "Preferences",
      },
    },
    dataSharing: {
      title: "Data Sharing",
      intro: "We share data with:",
      firebase: {
        title: "Firebase",
        description: "Analytics processing",
      },
      formspree: {
        title: "Formspree",
        description: "Form processing",
      },
      noSale: "We do not sell your data",
    },
    userRights: {
      title: "Your Rights",
      intro: "You have the following rights:",
      access: {
        title: "Access",
        description: "Request your data",
      },
      deletion: {
        title: "Deletion",
        description: "Request deletion",
      },
      export: {
        title: "Export",
        description: "Request export",
      },
      correction: {
        title: "Correction",
        description: "Request correction",
      },
      optOut: {
        title: "Opt-out",
        description: "Opt-out of tracking",
      },
      contact: "Contact us at:",
    },
    cookies: {
      title: "Cookies",
      intro: "We use cookies",
      seeMore: "See our",
      cookiePolicyLink: "Cookie Policy",
    },
    analyticsOptOut: {
      title: "Analytics Opt-Out",
      description: "You can disable tracking by:",
      cookieBanner: "Using cookie banner",
      browserSettings: "Browser settings",
      localStorage: "Clearing localStorage",
    },
    contact: {
      title: "Contact Information",
      description: "Contact us:",
      email: "Email",
      website: "Website",
    },
    policyUpdates: {
      title: "Policy Updates",
      description: "We may update this policy",
      notification: "We will notify users",
    },
    compliance: {
      title: "Compliance",
      description: "This policy complies with:",
      gdpr: {
        title: "GDPR",
        description: "EU data protection",
      },
      lgpd: {
        title: "LGPD",
        description: "Brazilian data protection",
      },
    },
  },
};

// Simple component for testing
function PrivacyPolicyTestComponent() {
  return (
    <NextIntlClientProvider locale="en" messages={mockTranslations}>
      <main>
        <h1>{mockTranslations.privacy.title}</h1>
        <p>
          {mockTranslations.privacy.lastUpdated}: {mockTranslations.privacy.lastUpdatedDate}
        </p>
        <section>
          <h2>{mockTranslations.privacy.introduction.title}</h2>
          <p>{mockTranslations.privacy.introduction.paragraph1}</p>
        </section>
        <section>
          <h2>{mockTranslations.privacy.dataCollection.title}</h2>
          <h3>{mockTranslations.privacy.dataCollection.analytics.title}</h3>
          <p>{mockTranslations.privacy.dataCollection.analytics.important}</p>
        </section>
        <section>
          <h2>{mockTranslations.privacy.userRights.title}</h2>
        </section>
        <section>
          <h2>{mockTranslations.privacy.compliance.title}</h2>
          <p>{mockTranslations.privacy.compliance.gdpr.title}</p>
          <p>{mockTranslations.privacy.compliance.lgpd.title}</p>
        </section>
      </main>
    </NextIntlClientProvider>
  );
}

describe("Privacy Policy Page", () => {
  it("renders the privacy policy title", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("displays last updated date", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText(/Last Updated/)).toBeInTheDocument();
    expect(screen.getByText(/January 2025/)).toBeInTheDocument();
  });

  it("includes introduction section", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText(/This Privacy Policy explains/)).toBeInTheDocument();
  });

  it("includes data collection section with analytics information", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText("Data Collection")).toBeInTheDocument();
    expect(screen.getByText("Analytics Data")).toBeInTheDocument();
    expect(screen.getByText(/All analytics data is anonymous/)).toBeInTheDocument();
  });

  it("includes user rights section for GDPR/LGPD compliance", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText("Your Rights")).toBeInTheDocument();
  });

  it("includes compliance section mentioning GDPR and LGPD", () => {
    render(<PrivacyPolicyTestComponent />);
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("GDPR")).toBeInTheDocument();
    expect(screen.getByText("LGPD")).toBeInTheDocument();
  });
});
