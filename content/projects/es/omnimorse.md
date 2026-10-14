---
id: omnimorse
title: OmniMorse
description: Traductor de código Morse para Android e iOS (escribe, habla o toca el código; reprodúcelo como sonido, flash, pantalla o vibración), creado como caso de estudio de arquitectura hexagonal y pruebas. Disponible ya en la App Store
featured: false
date: 2026-10-04
technologies:
  - React Native 0.86
  - Expo SDK 57
  - TypeScript
  - Kotlin
  - Jest
  - fast-check
  - Stryker
  - Maestro
  - GitHub Actions
  - EAS Build
  - Firebase Crashlytics
repoUrl: https://github.com/RogerioDoCarmo/morse_app
appStoreUrl: https://apps.apple.com/us/app/omni-morse/id6805992452
videoUrl: https://youtu.be/CcyTyHB7n_M
images:
  - /images/projects/omnimorse-es.png
---

## Descripción general

OmniMorse es un traductor de código Morse para Android e iOS. Escribe un mensaje y míralo convertirse en puntos y rayas, dilo en voz alta y deja que el teléfono lo transcriba, o tócalo tú mismo en una tecla que mide cuánto tiempo la mantienes pulsada: una pulsación corta es un punto, una larga es una raya, con un umbral que puedes ajustar a tu propia velocidad.

Un mensaje puede salir como sonido, como flash de la cámara, como pantalla parpadeante o como vibración, todo sincronizado desde un único reloj. La interfaz y la entrada por voz están disponibles en español, portugués de Brasil e inglés.

## Estado

OmniMorse ya está disponible en la App Store para iOS. La versión para Android todavía está en pruebas a través de Firebase App Distribution y aún no se ha publicado en Google Play. El código fuente es abierto bajo la licencia MIT, y la [política de privacidad](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html) del proyecto ya está publicada.

## Ingeniería

- **Arquitectura hexagonal** (puertos y adaptadores): el dominio está hecho de funciones puras que no importan ningún framework, y ESLint impone la regla de dependencia en lugar de depender de la disciplina.
- **Pruebas en todos los niveles**: más de mil pruebas unitarias y basadas en propiedades, pruebas de mutación con Stryker y flujos de extremo a extremo en Maestro en ambas plataformas.
- **Código nativo donde importa**: módulos locales en Kotlin para la vibración y el control del volumen.
- **CI/CD en GitHub Actions**: compilaciones con EAS, distribución a testers mediante TestFlight y Firebase App Distribution, y pipelines que generan las capturas de pantalla y los videos promocionales de las tiendas a partir de la app en ejecución.
- **Privada por defecto**: sin cuenta, sin anuncios, sin analíticas. Los únicos datos que salen del dispositivo son diagnósticos anónimos de fallos, que se pueden desactivar en Ajustes.

## Enlaces

- [App Store](https://apps.apple.com/us/app/omni-morse/id6805992452) — iPhone y iPad
- [Código fuente en GitHub](https://github.com/RogerioDoCarmo/morse_app) — licencia MIT
- [Política de privacidad](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html)
