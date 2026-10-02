---
id: scroll-minimap
platform: linkedin
kind: post
title: "Un minimapa de desplazamiento accesible"
description: "Un minimapa al estilo de los lectores de PDF que muestra dónde está cada sección de la página, navegable con teclado."
url: "https://www.linkedin.com/posts/rogeriodocarmo_nextjs-typescript-acessibilidade-ugcPost-7489457588682743808-vOrL/"
language: pt-BR
featured: false
date: "2026-08-01"
---

Una barra vertical fija (desde tablet) muestra proporcionalmente dónde está cada sección de la página, con un indicador arrastrable de la posición actual, un tooltip al pasar el ratón y clic para saltar a la sección.

El indicador es un role="slider" real, navegable con teclado, y el foco acompaña cada salto. En lugar de clonar el DOM en una miniatura, el minimapa solo calcula la posición y la altura de cada sección como porcentaje del documento — menos fidelidad visual a cambio de un cálculo más ligero y sin contenido duplicado para lectores de pantalla.
