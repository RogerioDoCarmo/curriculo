---
id: deep-links-article
platform: linkedin
kind: article
title: "Implementing Deep Links in a Next.js Site"
description: "How a seemingly simple feature called for changes to state management, browser history handling and test coverage."
url: "https://www.linkedin.com/pulse/implementando-deep-link-em-um-site-nextjs-ramos-rodrigues-do-carmo-qa7yf/"
image: /images/posts/deep-link-article-cover.webp
language: pt-BR
featured: true
date: "2026-09-13"
---

A technical write-up of the portfolio's deep links: every project can be opened straight from a link (?project=<id>#projects), keeping the language, scroll position and browser history intact.

It covers keeping the dialog state and the URL in sync, handling back/forward navigation, and the four levels of testing used to validate it: property-based tests, unit tests, mutation testing (100% of mutants killed) and end-to-end tests with Playwright.
