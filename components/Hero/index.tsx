"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  readonly name: string;
  readonly title: string;
  readonly locale: string;
}

export default function Hero({ name, title, locale }: HeroProps) {
  // Get locale-specific email
  const email = locale === "pt-BR" ? "contato@rogeriodocarmo.com" : "contact@rogeriodocarmo.com";

  return (
    <section
      id="home"
      aria-label="Hero section"
      className="flex min-h-[80vh] items-center justify-center px-4 py-16 md:px-8 lg:px-16"
    >
      <div className="animate-fade-in flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between md:gap-16 w-full max-w-5xl">
        {/* Text content */}
        <div className="text-center md:text-left md:flex-1">
          <p className="mb-2 text-lg font-medium text-primary-600 dark:text-primary-400">
            Hello, I&apos;m
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            {name}
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">{title}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-lg font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              View My Work
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-600 px-6 py-3 text-lg font-medium text-primary-600 transition-colors duration-200 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
            >
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
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              Get in Touch
            </a>
          </div>
          {/* Professional Email Display */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <a
              href={`mailto:${email}`}
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {email}
            </a>
          </p>
        </div>

        {/* Profile photo */}
        <div className="flex-shrink-0">
          <div className="relative h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48">
            <Image
              src="/images/profile/rogeriodocarmo.jpg"
              alt="Rogério do Carmo — Mobile React Native Developer"
              fill
              sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 192px"
              className="rounded-full object-cover object-top shadow-xl ring-4 ring-primary-200 dark:ring-primary-800"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
