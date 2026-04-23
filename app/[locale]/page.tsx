import { unstable_setRequestLocale } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { LazyExitIntentModal, LazyTechStackSection } from "@/lib/lazy-components";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

interface HomePageProps {
  readonly params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  unstable_setRequestLocale(locale);

  return (
    <>
      <article className="flex min-h-screen flex-col items-center justify-center p-8">
        <header>
          <h1 className="text-4xl font-bold text-center">Personal Resume Website</h1>
        </header>
        <section className="mt-4">
          <p className="text-muted-foreground text-center">
            A modern, responsive personal resume website built with Next.js 14, TypeScript, and
            Tailwind CSS.
          </p>
        </section>
      </article>

      {/* Tech Stack Section - Lazy loaded for code splitting */}
      <LazyTechStackSection />

      {/* Email capture section at the bottom of the page */}
      <section
        id="stay-in-touch"
        aria-labelledby="stay-in-touch-title"
        className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border"
      >
        <div className="mx-auto max-w-md text-center">
          <h2 id="stay-in-touch-title" className="text-2xl font-bold text-foreground mb-2">
            Stay in touch
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Leave your email and I&apos;ll reach out about opportunities or collaborations.
          </p>
          <EmailSubscribeForm
            placeholder="your@email.com"
            buttonLabel="Send"
            successMessage="Thanks! I'll be in touch soon."
            showMessage={true}
            messagePlaceholder="Write a message, ask a question, or just say hi..."
          />
        </div>
      </section>

      {/* Exit Intent Modal - Lazy loaded, client-side only */}
      <LazyExitIntentModal
        enabled={true}
        resumeUrl="/resume.pdf"
        linkedInUrl="https://linkedin.com/in/rogeriodocarmo"
        githubUrl="https://github.com/RogerioDoCarmo"
      />
    </>
  );
}
