---
id: offline-detector
title: offline-detector
description: Detector de conectividade headless para React e React Native que confirma acesso real à internet, não apenas a flag online do navegador, com snackbar, banner e indicador prontos. Publicado no npm, em desenvolvimento inicial (0.x)
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

## Visão Geral

A maioria das bibliotecas de conectividade confia no `navigator.onLine`, que mente sempre que a rede está conectada mas não entrega dados. O offline-detector confirma a conectividade com um pequeno probe em vez disso, e entrega toda a experiência de interface que acompanha essa confirmação: um hook headless, callbacks e um snackbar, banner, indicador e tela cheia opcional já prontos, para web e React Native a partir de uma única família de pacotes, sem código nativo.

Ele começa silencioso — nada aparece ao iniciar — e mostra um snackbar "Sem internet" com um botão Tentar novamente de um toque quando o probe falha, desaparecendo automaticamente após 4 segundos quando a conexão volta. As strings em inglês, português do Brasil e espanhol já vêm embutidas, e cada uma pode ser substituída por uma única prop `strings`.

## Status

O offline-detector está em desenvolvimento inicial (0.x): publicado no npm e utilizável, mas a API ainda pode mudar antes da versão 1.0. Quatro pacotes escopados cobrem cada camada — `core` (máquina de estados e probe sem framework), `react` (provider e hooks), `web` (interface DOM) e `native` (interface React Native) — para que quem consome instale só o que a sua plataforma precisa. O código-fonte é aberto sob a licença MIT.

## Engenharia

- **Monorepo com Turborepo e workspaces do pnpm**: quatro pacotes publicados compartilhando uma única configuração de TypeScript e lint, construídos com rslib.
- **Testes em todos os níveis**: testes unitários e baseados em propriedades com Jest e fast-check, testes de mutação com Stryker, e fluxos de ponta a ponta no Playwright com verificações de acessibilidade do axe no estado offline ao vivo.
- **Site de documentação em três idiomas**: um site Docusaurus cobrindo início rápido, referência de API, tematização e SSR, além de uma demo interativa ao vivo para as interfaces web e nativa.
- **CI/CD no GitHub Actions**: pipelines de lint, typecheck, testes unitários, mutação e e2e, com o Changesets gerenciando versionamento e publicação no npm.
- **Privado por padrão**: o único tráfego de rede é o próprio probe de conectividade configurável — uma requisição `HEAD` sem cookies e sem dados pessoais, documentada na política de privacidade.

## Links

- [Documentação](https://rogeriodocarmo.github.io/offline-detector/) — início rápido, referência de API, tematização, SSR
- [Demo ao vivo](https://rogeriodocarmo.github.io/offline-detector/demo/) — experimente as interfaces web e nativa lado a lado
- [Código-fonte no GitHub](https://github.com/RogerioDoCarmo/offline-detector) — licença MIT
- [Política de privacidade](https://rogeriodocarmo.github.io/offline-detector/privacy-policy.html)
