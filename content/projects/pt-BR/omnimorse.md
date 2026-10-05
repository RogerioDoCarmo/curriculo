---
id: omnimorse
title: OmniMorse
description: Tradutor de código Morse para Android e iOS (digite, fale ou toque o código; reproduza como som, flash, tela ou vibração), construído como estudo de caso de arquitetura hexagonal e testes. Atualmente em teste, ainda fora das lojas
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
videoUrl: https://youtu.be/CcyTyHB7n_M
images:
  - /images/projects/omnimorse-pt-BR.png
---

## Visão Geral

OmniMorse é um tradutor de código Morse para Android e iOS. Digite uma mensagem e veja-a virar pontos e traços, fale em voz alta e deixe o celular transcrever, ou toque o código você mesmo em uma tecla que mede por quanto tempo você a mantém pressionada: um toque curto é um ponto, um longo é um traço, com um limite que você ajusta à sua própria velocidade.

Uma mensagem pode sair como som, como flash da câmera, como tela piscando ou como vibração, tudo em sincronia a partir de um único relógio. A interface e a entrada por voz estão disponíveis em português do Brasil, inglês e espanhol.

## Status

O OmniMorse está em fase de testes e ainda não está nas lojas de aplicativos. O código-fonte é aberto sob a licença MIT, e a [política de privacidade](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html) do projeto já está publicada.

## Engenharia

- **Arquitetura hexagonal** (portas e adaptadores): o domínio é feito de funções puras que não importam nenhum framework, e o ESLint impõe a regra de dependência em vez de depender de disciplina.
- **Testes em todos os níveis**: mais de mil testes unitários e baseados em propriedades, testes de mutação com Stryker e fluxos de ponta a ponta no Maestro nas duas plataformas.
- **Código nativo onde importa**: módulos locais em Kotlin para vibração e controle de volume.
- **CI/CD no GitHub Actions**: builds com EAS, distribuição para testadores via TestFlight e Firebase App Distribution, e pipelines que geram as capturas de tela e os vídeos promocionais das lojas a partir do app em execução.
- **Privado por padrão**: sem conta, sem anúncios, sem analytics. Os únicos dados que saem do aparelho são diagnósticos anônimos de falhas, que podem ser desativados nas Configurações.

## Links

- [Código-fonte no GitHub](https://github.com/RogerioDoCarmo/morse_app) — licença MIT
- [Política de privacidade](https://rogeriodocarmo.github.io/morse_app/privacy-policy.html)
