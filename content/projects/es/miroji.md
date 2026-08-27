---
id: miroji
title: Miroji
description: App de espejo con cámara frontal publicada en la App Store y en F-Droid, usada como caso de estudio de arquitectura hexagonal, pruebas automatizadas y CI/CD
featured: true
date: 2026-08-18
technologies:
  - React Native 0.81
  - Expo SDK 54
  - TypeScript
  - Jest
  - fast-check
  - Stryker
  - Maestro
  - GitHub Actions
  - SonarCloud
  - Chromatic
  - Storybook
  - EAS Build
repoUrl: https://github.com/RogerioDoCarmo/mirror_app
liveUrl: https://rogeriodocarmo.github.io/mirror_app/
appStoreUrl: https://apps.apple.com/us/app/miroji/id6774924907
fdroidUrl: https://f-droid.org/es/packages/com.rogeriodocarmo.miroji
images:
  - /images/projects/miroji.png
---

## Visión General

Miroji es una app de espejo que usa la cámara frontal del dispositivo. La funcionalidad es deliberadamente simple, y esa elección es el punto del proyecto: con el alcance de producto reducido al mínimo, el desafío pasa a ser enteramente de ingeniería — arquitectura, pruebas, automatización y el proceso de publicación en tiendas.

Está disponible en la App Store y en F-Droid, con todo el código abierto bajo licencia MIT.

## Dónde Descargar

- [App Store](https://apps.apple.com/us/app/miroji/id6774924907) — iPhone, iPad y Macs con Apple Silicon
- [F-Droid](https://f-droid.org/es/packages/com.rogeriodocarmo.miroji) — Android, compilado a partir del código fuente por el propio catálogo
- [Código fuente en GitHub](https://github.com/RogerioDoCarmo/mirror_app) — licencia MIT

## Características Principales

### Arquitectura Hexagonal

- Dominio puro, sin dependencias de React, Expo ni de ninguna biblioteca de interfaz
- Puertos y adaptadores que aíslan cámara, permisos y ubicación del núcleo de la aplicación
- Inyección de dependencias mediante React Context, permitiendo sustituir adaptadores en las pruebas sin mocks de plataforma
- TypeScript en modo estricto, con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`

### Pruebas en Cuatro Niveles

- 71 pruebas unitarias y de integración con 100% de cobertura en sentencias, ramas, funciones y líneas
- Pruebas basadas en propiedades con fast-check
- Pruebas de mutación con Stryker, midiendo la calidad de las pruebas y no solo la cobertura
- Pruebas E2E con Maestro, ejecutadas en iOS y Android en cada pull request

### Integración y Entrega Continuas

- Cinco workflows en GitHub Actions: CI, E2E, Chromatic, build EAS y distribución vía Firebase
- Quality gate en SonarCloud, con la cobertura reflejando las exclusiones de Jest
- Regresión visual en Chromatic, alimentada por un Storybook web además del Storybook on-device
- Distribución automática de builds a testers mediante Firebase App Distribution

### Privacidad

- La app no tiene ni una sola línea de código de red
- Nada se graba, almacena ni transmite: la imagen de la cámara existe solo en pantalla
- Superficie de permisos reducida a uno solo: `CAMERA`

### Internacionalización

- Interfaz completa en portugués, inglés, español y japonés
- Detección automática del idioma del dispositivo

## Desafíos Técnicos

1. **Publicación en F-Droid**: el catálogo compila las aplicaciones a partir del código fuente y no acepta dependencias propietarias. `expo-camera` depende de las bibliotecas de ML Kit de Google para la lectura de códigos de barras, lo que hacía inviable la publicación. Escribí un parche que elimina esas bibliotecas preservando la API pública del módulo, permitiendo que la app entrara en el catálogo sin ninguna anti-feature.

2. **Reducción del artefacto**: el APK bajó de 69 MB a 20 MB, combinando la eliminación de ML Kit, la restricción a arquitecturas ARM y el empaquetado legado de las bibliotecas nativas.

3. **Higiene de permisos**: un plugin de configuración de Expo elimina los permisos no utilizados solo de los builds de release, a través de un source set dedicado — preservando los permisos que el entorno de desarrollo necesita. La superficie declarada pasó de siete permisos a uno, verificada directamente en el artefacto generado.

4. **Build reproducible fuera de Expo**: un workflow genera un snapshot Gradle autocontenido del proyecto en un repositorio separado, que F-Droid compila con `gradlew` puro, sin depender de Node, pnpm ni Expo CLI en el entorno de build.

## Aprendizajes

- Arquitectura hexagonal aplicada a React Native, con un dominio testeable sin depender de mocks de plataforma
- Pruebas de mutación como métrica de la calidad de las pruebas, exponiendo aserciones que pasan sin verificar nada
- El proceso de revisión de un catálogo de software libre, con requisitos de compilación a partir del código fuente
- El ciclo completo de envío y revisión en las tiendas de aplicaciones, incluyendo políticas de privacidad y declaración de datos

## Impacto

- Publicada en la App Store, con compatibilidad verificada también en Macs con Apple Silicon
- Publicada en F-Droid, compilada por el propio catálogo y listada sin ninguna anti-feature
- 14 releases a lo largo de tres meses de desarrollo
- Base de código abierta y documentada, que sirve como referencia práctica de las prácticas descritas arriba
