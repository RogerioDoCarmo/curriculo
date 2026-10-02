---
id: deep-links-article
platform: linkedin
kind: article
title: "Implementando Deep Link em um site Next.js"
description: "Como um recurso aparentemente simples exigiu ajustes no gerenciamento de estado, no histórico de navegação e na cobertura de testes."
url: "https://www.linkedin.com/pulse/implementando-deep-link-em-um-site-nextjs-ramos-rodrigues-do-carmo-qa7yf/"
image: /images/posts/deep-link-article-cover.webp
language: pt-BR
featured: true
date: "2026-09-13"
---

Artigo técnico sobre os deep links do portfólio: cada projeto pode ser aberto direto por um link (?project=<id>#projects), preservando idioma, posição de rolagem e o histórico do navegador.

O artigo cobre o sincronismo entre o estado do modal e a URL, o tratamento de voltar/avançar e os quatro níveis de teste usados para validar a implementação: testes de propriedade, testes de unidade, mutation testing (100% dos mutantes eliminados) e testes end-to-end com Playwright.
