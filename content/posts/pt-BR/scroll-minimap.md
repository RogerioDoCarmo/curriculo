---
id: scroll-minimap
platform: linkedin
kind: post
title: "Minimap de rolagem acessível"
description: "Um minimap inspirado nos leitores de PDF que mostra onde cada seção da página está, navegável por teclado."
url: "https://www.linkedin.com/posts/rogeriodocarmo_nextjs-typescript-acessibilidade-ugcPost-7489457588682743808-vOrL/"
language: pt-BR
featured: false
date: "2026-08-01"
---

Uma barra vertical fixa (a partir de tablet) mostra proporcionalmente onde cada seção da página está, com uma "thumb" arrastável indicando a posição atual, tooltip ao passar o mouse e clique para pular direto para a seção.

A thumb é um role="slider" de verdade, navegável por teclado, e o foco acompanha cada salto. Em vez de clonar o DOM numa miniatura, o minimap calcula apenas a posição e a altura de cada seção como porcentagem do documento — menos fidelidade visual em troca de um cálculo mais leve e sem conteúdo duplicado para leitores de tela.
