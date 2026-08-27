---
id: inct-gnss-app
title: INCT GNSS App
description: Aplicación Android para la recolección y el procesamiento de datos GNSS brutos en tiempo real, con generación de archivos RINEX y Posicionamiento por Punto Simple (PPS)
featured: true
mockData: false
date: 2021-06-01
technologies:
  - Java
  - Android SDK
  - GNSS/GPS
  - RINEX 3.04
  - Google Maps API
  - Método de los Mínimos Cuadrados (MMC)
  - Servidor SUPL
  - Geocoding
images:
  - /images/projects/inct-gnss-app.png
---

## Visión General

Aplicación Android desarrollada durante la investigación de maestría en Ciencias Cartográficas en la UNESP. El INCT-GNSS-APP es una herramienta científica completa para la recolección de datos GNSS brutos, la generación de archivos RINEX y el procesamiento de posicionamiento en tiempo real utilizando el método de Posicionamiento por Punto Simple (PPS).

## Funcionalidades Principales

### Recolección de Datos GNSS Brutos

- Recolección en tiempo real de datos brutos de múltiples constelaciones GNSS
- Generación de archivos de datos brutos compatibles con el formato de la GNSS Analysis App
- Almacenamiento de observables de todas las constelaciones y frecuencias disponibles
- Interfaz intuitiva para el monitoreo de la recolección en tiempo real

### Generación de Archivo RINEX

- **Generación en tiempo real** de archivos RINEX de observación en la versión 3.04
- Inclusión de observables de **pseudodistancia** y **fase de la onda portadora** en la frecuencia L1
- Compatibilidad con los estándares internacionales de intercambio de datos GNSS
- Encabezado RINEX rellenado automáticamente con coordenadas cartesianas

### Posicionamiento por Punto Simple (PPS) en Tiempo Real

La aplicación implementa el método de PPS en tiempo real con las siguientes características:

- **Método de recepción común** para el cálculo de pseudodistancias
- **Ajuste por el Método de los Mínimos Cuadrados (MMC)**
- Utilización de pseudodistancias en la frecuencia L1 de la constelación GPS
- **Integración con Google Maps** para la visualización de posiciones

#### Coordenada Inicial de Referencia

- Solicitud automática de la última ubicación conocida del dispositivo
- Utilización de la API 23 de Android para obtener la ubicación de mayor exactitud
- Fuentes: chipset GNSS, red de telefonía móvil o WiFi
- Marcador azul en el mapa con un radio igual a la precisión horizontal
- Conversión a coordenadas cartesianas para su uso en el ajuste

#### Obtención de Efemérides

- Descarga automática de efemérides transmitidas vía Internet
- Utilización del **servidor SUPL de Google**
- Coordenada inicial enviada al servidor para la obtención de las efemérides

### Configuraciones Avanzadas

La aplicación ofrece configuraciones personalizables para el procesamiento:

- **Ángulo mínimo de elevación** de los satélites
- **Modelos de corrección ionosférica** (opcional)
- **Modelos de corrección troposférica** (opcional)
- **Coordenada de referencia** personalizable para el procesamiento
- **Función de ponderación** para el ajuste
- **Prueba Chi-Cuadrado** para la validación estadística

### Visualización y Resultados

- **Presentación textual** de los resultados de cada época procesada
- **Marcador rojo** en Google Maps para cada posición estimada
- **Geocoding inverso** para obtener la dirección asociada a cada coordenada
- Visualización en tiempo real del procesamiento

## Archivos Generados

Al finalizar el procesamiento, el INCT-GNSS-APP crea un **archivo ZIP** que contiene:

1. **Datos GNSS brutos** en el formato de la GNSS Analysis App (texto)
2. **Archivo RINEX** de observación versión 3.04 para GPS (L1)
3. **Resultados del PPS** en formato CSV
4. **Coordenadas de los satélites** utilizados en el PPS
5. **Residuos del ajuste** por el MMC
6. **Archivo KML** con coordenadas para su visualización en Google Earth
7. **Efemérides SUPL** utilizadas (binario)
8. **Configuraciones** definidas para la ejecución (binario)
9. **Datos GNSS brutos** de todas las constelaciones y frecuencias (binario)

### Archivo CSV de Resultados

El archivo CSV generado contiene:

**Sección de Encabezado** (líneas iniciadas con "#"):

- Modelos de corrección ionosférica y troposférica aplicados
- Máscara de elevación utilizada
- Función de ponderación del ajuste
- Información de la prueba Chi-Cuadrado

**Sección de Datos** (para cada época procesada):

- Tiempo GPS
- Número de satélites utilizados y lista de los satélites
- Coordenadas geocéntricas cartesianas (X, Y, Z) y desviaciones estándar
- Coordenadas geodésicas (latitud, longitud, altitud) en WGS 84
- Error del reloj del receptor (segundos y metros)
- Varianza a posteriori del ajuste
- Resultado de la prueba Chi-Cuadrado

## Compartición e Integración

- **Compartición nativa** del archivo ZIP mediante la interfaz Android
- **Carga a una base de datos en la nube** (opcional)
- Formato de archivo compatible con herramientas de posprocesamiento
- Integración con flujos de trabajo de investigación científica

## Aplicación Científica

- Desarrollado como parte de la [disertación de maestría](http://hdl.handle.net/11449/243430) en Ciencias Cartográficas (UNESP)
- Herramienta para la evaluación de la calidad de las medidas GNSS en smartphones Android
- Utilizado en investigaciones sobre posicionamiento con dispositivos de bajo costo
- Base para análisis estadísticos y validación de algoritmos de posicionamiento
- Lee más detalles técnicos en la [disertación completa](http://hdl.handle.net/11449/243430)

## Impacto Académico

- Contribuyó a publicaciones científicas sobre GNSS en smartphones
- Facilitó la recolección y el procesamiento de datos para investigadores
- Demostró la viabilidad del posicionamiento científico con dispositivos móviles
- Herramienta de código abierto para la comunidad académica
