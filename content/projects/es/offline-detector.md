---
id: offline-detector
title: offline-detector
description: Detector de conectividad sin interfaz para React y React Native que confirma acceso real a internet, no solo la bandera online del navegador, con snackbar, banner e indicador ya listos. Publicado en npm, en desarrollo inicial (0.x)
featured: false
date: 2026-10-28
order: 2
technologies:
  - TypeScript
  - React
  - React Native
  - Jest
  - fast-check
  - Stryker
  - Playwright
  - Turborepo
  - pnpm
  - Docusaurus
  - GitHub Actions
  - Changesets
repoUrl: https://github.com/RogerioDoCarmo/offline-detector
liveUrl: https://rogeriodocarmo.github.io/offline-detector/demo/
videoUrl: https://youtu.be/D-3uEW5jEhE
images:
  - /images/projects/offline-detector.png
---

## Resumen

La mayoría de las bibliotecas de conectividad confían en `navigator.onLine`, que miente cada vez que la red está conectada pero no transmite datos. offline-detector confirma la conectividad con una pequeña sonda en su lugar, y entrega toda la experiencia de interfaz que la acompaña: un hook sin interfaz, callbacks y un snackbar, banner, indicador y pantalla completa opcional ya listos, para web y React Native desde una única familia de paquetes, sin código nativo.

Empieza en silencio — nada aparece al iniciar — y muestra un snackbar "Sin internet" con un botón Reintentar de un toque cuando la sonda falla, desapareciendo automáticamente a los 4 segundos cuando la conexión vuelve. Las cadenas en inglés, portugués de Brasil y español vienen incluidas, y cada una se puede sobrescribir con una única prop `strings`.

## Estado

offline-detector está en desarrollo inicial (0.x): publicado en npm y utilizable, pero la API todavía puede cambiar antes de la versión 1.0. Cuatro paquetes delimitados cubren cada capa — `core` (máquina de estados y sonda sin framework), `react` (provider y hooks), `web` (interfaz DOM) y `native` (interfaz React Native) — para que quien lo consume instale solo lo que necesita su plataforma. El código fuente es abierto bajo la licencia MIT.

## Ingeniería

- **Monorepo con Turborepo y workspaces de pnpm**: cuatro paquetes publicados que comparten una única configuración de TypeScript y lint, construidos con rslib.
- **Pruebas en todos los niveles**: pruebas unitarias y basadas en propiedades con Jest y fast-check, pruebas de mutación con Stryker, y flujos de extremo a extremo en Playwright con verificaciones de accesibilidad de axe sobre el estado offline en vivo.
- **Sitio de documentación en tres idiomas**: un sitio Docusaurus que cubre inicio rápido, referencia de API, tematización y SSR, además de una demo interactiva en vivo para las interfaces web y nativa.
- **CI/CD en GitHub Actions**: pipelines de lint, typecheck, pruebas unitarias, mutación y e2e, con Changesets gestionando el versionado y la publicación en npm.
- **Privado por defecto**: el único tráfico de red es la propia sonda de conectividad configurable — una solicitud `HEAD` sin cookies y sin datos personales, documentada en la política de privacidad.

## Enlaces

- [Documentación](https://rogeriodocarmo.github.io/offline-detector/) — inicio rápido, referencia de API, tematización, SSR
- [Demo en vivo](https://rogeriodocarmo.github.io/offline-detector/demo/) — prueba las interfaces web y nativa una junto a la otra
- [Código fuente en GitHub](https://github.com/RogerioDoCarmo/offline-detector) — licencia MIT
- [Política de privacidad](https://rogeriodocarmo.github.io/offline-detector/privacy-policy.html)
