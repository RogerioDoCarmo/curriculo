---
id: deep-links-post
platform: linkedin
kind: post
title: "Deep links in the portfolio"
description: "Every project on the site can now be opened straight from a link, with no scrolling to find it."
url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7505004384020529152/"
language: pt-BR
featured: false
date: "2026-09-13"
---

I added deep links to my personal site: every project can now be opened straight from a link. It sounds simple, but it needed changes to how the dialog manages state and to the browser's navigation history.

To validate it I used four levels of testing: property-based tests, unit tests written for mutation testing, mutation testing itself (100% of mutants killed) and end-to-end tests in a real browser.
