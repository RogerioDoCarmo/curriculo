---
id: gnss-skyplot
title: GNSS Skyplot
description: Globo 3D y skyplot polar en tiempo real que muestra qué satélites GPS, Galileo, BeiDou y GLONASS están sobre ti ahora mismo, calculados enteramente en el navegador a partir de las efemérides transmitidas del día
featured: true
mockData: false
date: 2026-11-02
order: 3
technologies:
  - JavaScript
  - three.js
  - Python
  - RINEX 3.05
  - GNSS/GPS
  - Galileo
  - BeiDou
  - GLONASS
  - GitHub Actions
  - Playwright
images:
  - /images/projects/gnss-skyplot.png
liveUrl: https://gnss-skyplot.rogeriodocarmo.com
videoUrl: https://youtu.be/1diU8lZBDQc
---

## Visión General

GNSS Skyplot responde a una pregunta en tiempo real: ¿qué satélites de navegación están sobre ti ahora mismo? Dibuja las constelaciones GPS, Galileo, BeiDou y GLONASS actuales en un globo 3D y en un skyplot polar lado a lado, ambos calculados en vivo en el navegador, sin depender de un servidor. Al abrir, pide tu ubicación y, si la rechazas, usa como valor predeterminado la estación PRU2, en Presidente Prudente (Brasil).

## Funcionalidades Principales

### Cielo en Vivo

- Globo 3D y skyplot polar, actualizados juntos desde un único reloj
- Botones independientes para mostrar u ocultar GPS, Galileo, BeiDou y GLONASS
- Máscara de elevación ajustable (15° por defecto) para ocultar satélites demasiado bajos para ser útiles
- Ventana de 24 horas con control deslizante de tiempo y un botón de reproducción, para recorrer un día entero de pasadas

### Privacidad por Diseño

- Sin cuenta, sin analíticas, sin ida y vuelta al servidor por tu posición
- La ubicación se usa una sola vez, en el navegador, para calcular la visibilidad, y nunca sale del dispositivo

## Cómo Funciona

### Flujo de Datos

Una tarea de GitHub Actions se ejecuta cada 2 horas y descarga el archivo de navegación transmitida combinado del IGS, publicado por el BKG, en formato RINEX 3.05. Un script escrito solo con la biblioteca estándar de Python —sin ningún analizador de terceros— lo reduce a cerca de 1 MB de parámetros orbitales y lo despliega directo en Vercel, de modo que el sitio siempre abre con las efemérides del día ya listas.

### Cálculo de Órbita, en el Navegador

Todo lo que viene después se ejecuta en la propia máquina de quien visita el sitio; nada más que ese pequeño archivo de efemérides llega a viajar por la red.

- **Algoritmo kepleriano de efemérides transmitidas** para GPS, Galileo y BeiDou, incluido el manejo mixto GEO/IGSO/MEO de BeiDou
- **Integración numérica RK4 con perturbación J2** para GLONASS, que transmite vectores de estado de posición y velocidad en lugar de elementos keplerianos
- **Azimut y elevación** calculados a partir de la posición del observador en WGS 84

El código de órbita continúa el trabajo con efemérides transmitidas de mi [investigación de maestría en Ciencias Cartográficas](http://hdl.handle.net/11449/243430): pasó de una solución SPP de frecuencia única en Android a una predicción de visibilidad multiconstelación que corre enteramente en el cliente.

## Ingeniería

- HTML, CSS y módulos JavaScript puros: sin framework, sin paso de compilación
- three.js r160 para el globo 3D; un canvas 2D para el skyplot polar
- Pruebas en todos los niveles: node:test para el JavaScript, `unittest` de Python para el flujo de datos, y pruebas de extremo a extremo con Playwright que corren contra la Content Security Policy de producción del sitio
- Despliegue continuo en Vercel en cada push, actualmente en la v0.2.1

## Enlaces

- [Sitio en vivo](https://gnss-skyplot.rogeriodocarmo.com)
