---
id: gnss-skyplot
title: GNSS Skyplot
description: Globo 3D e skyplot polar em tempo real mostrando quais satélites GPS, Galileo, BeiDou e GLONASS estão acima de você agora, calculados inteiramente no navegador a partir das efemérides transmitidas do dia
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

## Visão Geral

O GNSS Skyplot responde a uma pergunta em tempo real: quais satélites de navegação estão acima de você agora? Ele desenha as constelações GPS, Galileo, BeiDou e GLONASS atuais em um globo 3D e em um skyplot polar lado a lado, ambos calculados ao vivo no navegador, sem depender de um servidor. Ao abrir, ele pede sua localização e, se você recusar, usa como padrão a estação PRU2, em Presidente Prudente.

## Funcionalidades Principais

### Céu ao Vivo

- Globo 3D e skyplot polar, atualizados juntos a partir de um único relógio
- Botões independentes para mostrar ou ocultar GPS, Galileo, BeiDou e GLONASS
- Máscara de elevação ajustável (15° por padrão) para esconder satélites baixos demais para serem úteis
- Janela de 24 horas com controle deslizante de tempo e um botão de reprodução, para percorrer um dia inteiro de passagens

### Privacidade por Padrão

- Sem conta, sem analytics, sem ida e volta ao servidor para a sua posição
- A localização é usada uma única vez, no navegador, para calcular a visibilidade, e nunca sai do aparelho

## Como Funciona

### Pipeline de Dados

Uma ação do GitHub Actions roda a cada 2 horas e baixa o arquivo de navegação transmitida combinado do IGS, disponibilizado pelo BKG, no formato RINEX 3.05. Um script escrito apenas com a biblioteca padrão do Python — sem nenhum parser de terceiros — reduz isso a cerca de 1 MB de parâmetros orbitais e publica direto no Vercel, de forma que o site sempre abre com as efemérides do dia já prontas.

### Cálculo de Órbita, no Navegador

Tudo depois disso roda na própria máquina de quem visita o site; nada além desse pequeno arquivo de efemérides chega a trafegar pela rede.

- **Algoritmo kepleriano de efemérides transmitidas** para GPS, Galileo e BeiDou, incluindo o tratamento misto GEO/IGSO/MEO do BeiDou
- **Integração numérica RK4 com perturbação J2** para o GLONASS, que transmite vetores de estado de posição e velocidade em vez de elementos keplerianos
- **Azimute e elevação** calculados a partir da posição do observador em WGS 84

O código de órbita dá continuidade ao trabalho com efemérides transmitidas da minha [pesquisa de mestrado em Ciências Cartográficas](http://hdl.handle.net/11449/243430) — que saiu de uma solução SPP em frequência única no Android para uma previsão de visibilidade multiconstelação rodando inteiramente no cliente.

## Engenharia

- HTML, CSS e módulos JavaScript puros — sem framework, sem etapa de build
- three.js r160 para o globo 3D; um canvas 2D para o skyplot polar
- Testes em todos os níveis: node:test para o JavaScript, `unittest` do Python para o pipeline de dados, e testes de ponta a ponta com Playwright rodando contra a Content Security Policy de produção do site
- Deploy contínuo no Vercel a cada push, atualmente na v0.2.1

## Links

- [Site ao vivo](https://gnss-skyplot.rogeriodocarmo.com)
