---
id: scroll-minimap
platform: linkedin
kind: post
title: "An accessible scroll minimap"
description: "A PDF-reader-style minimap showing where each section of the page sits, fully keyboard navigable."
url: "https://www.linkedin.com/posts/rogeriodocarmo_nextjs-typescript-acessibilidade-ugcPost-7489457588682743808-vOrL/"
language: pt-BR
featured: false
date: "2026-08-01"
---

A fixed vertical bar (tablet and up) shows, to scale, where each section of the page sits, with a draggable thumb marking the current viewport, a tooltip on hover and click-to-jump.

The thumb is a real role="slider", keyboard navigable, and focus follows every jump. Rather than cloning the DOM into a miniature, the minimap only computes each section's position and height as a percentage of the document — less visual fidelity in exchange for a lighter calculation and no duplicated content for screen readers.
