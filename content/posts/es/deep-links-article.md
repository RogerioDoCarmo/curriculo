---
id: deep-links-article
platform: linkedin
kind: article
title: "Implementando Deep Links en un sitio Next.js"
description: "Cómo una funcionalidad aparentemente simple exigió ajustes en la gestión de estado, el historial de navegación y la cobertura de pruebas."
url: "https://www.linkedin.com/pulse/implementando-deep-link-em-um-site-nextjs-ramos-rodrigues-do-carmo-qa7yf/"
image: /images/posts/deep-link-article-cover.webp
language: pt-BR
featured: true
date: "2026-09-13"
---

Artículo técnico sobre los deep links del portafolio: cada proyecto se puede abrir directamente desde un enlace (?project=<id>#projects), conservando el idioma, la posición de desplazamiento y el historial del navegador.

Explica la sincronización entre el estado del diálogo y la URL, el manejo de atrás/adelante y los cuatro niveles de pruebas usados para validarlo: pruebas basadas en propiedades, pruebas unitarias, mutation testing (100% de los mutantes eliminados) y pruebas end-to-end con Playwright.
