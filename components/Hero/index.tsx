"use client";

import React from "react";

interface HeroProps {
  name: string;
  title: string;
  locale: string;
}

export default function Hero({ name, title }: HeroProps) {
  return (
    <section
      id="home"
      aria-label="Hero section"
      className="flex min-h-[80vh] items-center justify-center px-4 py-16 md:justify-start md:px-8 lg:px-16"
    >
      <div className="animate-fade-in max-w-2xl text-center md:text-left">
        <p className="mb-2 text-lg font-medium text-primary-600 dark:text-primary-400">
          Hello, I&apos;m
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
          {name}
        </h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">{title}</p>
        <a
          href="#projects"
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-lg font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          View My Work
        </a>
      </div>
    </section>
  );
}
