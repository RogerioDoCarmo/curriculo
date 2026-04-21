/**
 * Lazy-loaded component definitions for code splitting
 *
 * This file centralizes all dynamic imports for heavy components
 * to enable code splitting and improve initial page load performance.
 *
 * Requirements: 6.3, 6.4
 */

import dynamic from "next/dynamic";

/**
 * ExitIntentModal - Client-side only component
 * Disabled SSR since exit intent detection only works in browser
 */
export const LazyExitIntentModal = dynamic(() => import("@/components/ExitIntentModal"), {
  ssr: false,
  loading: () => null, // No loading state needed for exit intent
});

/**
 * TechStackSection - Heavy component with SSR enabled for SEO
 */
export const LazyTechStackSection = dynamic(() => import("@/components/TechStackSection"), {
  ssr: true,
  loading: () => (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  ),
});

/**
 * ProjectsSection - Heavy component with image galleries
 */
export const LazyProjectsSection = dynamic(() => import("@/components/ProjectsSection"), {
  ssr: true,
  loading: () => (
    <section className="py-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  ),
});

/**
 * ContactForm - Form component with validation
 */
export const LazyContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: true,
  loading: () => (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
    </div>
  ),
});

/**
 * ExperienceSection - Timeline component with career data
 */
export const LazyExperienceSection = dynamic(() => import("@/components/ExperienceSection"), {
  ssr: true,
  loading: () => (
    <section className="py-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-l-2 border-gray-300 dark:border-gray-600 pl-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  ),
});

/**
 * SkillsSection - Skills display component
 */
export const LazySkillsSection = dynamic(() => import("@/components/SkillsSection"), {
  ssr: true,
  loading: () => (
    <section className="py-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  ),
});

/**
 * NotificationPrompt - Client-side only notification permission prompt
 */
export const LazyNotificationPrompt = dynamic(() => import("@/components/NotificationPrompt"), {
  ssr: false,
  loading: () => null,
});
