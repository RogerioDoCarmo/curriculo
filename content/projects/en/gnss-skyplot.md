---
id: gnss-skyplot
title: GNSS Skyplot
description: Real-time 3D globe and polar skyplot showing which GPS, Galileo, BeiDou and GLONASS satellites are above you right now, computed entirely in the browser from today's broadcast ephemerides
featured: true
mockData: false
date: 2026-11-02
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

## Overview

GNSS Skyplot answers one question in real time: which navigation satellites are above you right now? It renders the current GPS, Galileo, BeiDou and GLONASS constellations on a 3D globe and a polar skyplot side by side, both computed live in the browser rather than fetched from a server. On load it asks for your location and, if you say no, falls back to the PRU2 station in Presidente Prudente, Brazil.

## Key Features

### Live Sky View

- A 3D globe and a polar skyplot, updated together from one shared clock
- Independent toggles for GPS, Galileo, BeiDou and GLONASS
- An adjustable elevation mask (15° by default) to hide satellites too low to be useful
- A 24-hour window with a time slider and a play button, to scrub through a full day of passes

### Privacy by Design

- No account, no analytics, no server round-trip for your position
- Location is used once, in the browser, to compute visibility, and never leaves the device

## How It Works

### Data Pipeline

A GitHub Actions job runs every 2 hours and downloads the IGS merged broadcast navigation file from BKG, in RINEX 3.05 format. A script written against Python's standard library only — no third-party parser — reduces it to about 1 MB of orbit parameters and deploys straight to Vercel, so the site always opens with today's ephemerides already in place.

### Orbit Computation, in the Browser

Everything after that runs on the visitor's own machine; nothing but that small ephemeris file ever crosses the network.

- **Keplerian broadcast algorithm** for GPS, Galileo and BeiDou, including BeiDou's mixed GEO/IGSO/MEO handling
- **RK4 numerical integration with J2 perturbation** for GLONASS, which broadcasts position and velocity state vectors instead of Keplerian elements
- **Azimuth and elevation** resolved from the observer's WGS 84 position

The orbit code continues the broadcast-ephemeris work from my [master's research in Cartographic Sciences](http://hdl.handle.net/11449/243430) — moved from a single-frequency Android SPP solution to multi-constellation visibility prediction running entirely client-side.

## Engineering

- Plain HTML, CSS and JavaScript modules — no framework, no build step
- three.js r160 for the 3D globe; a 2D canvas for the polar skyplot
- Tests at every level: node:test for the JavaScript, Python's `unittest` for the data pipeline, and Playwright end-to-end tests that run against the site's production Content Security Policy
- Continuous deployment to Vercel on every push, currently at v0.2.1

## Links

- [Live site](https://gnss-skyplot.rogeriodocarmo.com)
