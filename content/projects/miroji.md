---
id: miroji
title: Miroji
description: App de espelho com câmera frontal publicado na App Store e no F-Droid, usado como estudo de caso de arquitetura hexagonal, testes automatizados e CI/CD
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
images:
  - /images/projects/miroji.png
---

## Visão Geral

Miroji é um app de espelho que usa a câmera frontal do dispositivo. A funcionalidade é deliberadamente simples, e essa escolha é o ponto do projeto: com o escopo de produto reduzido ao mínimo, o desafio passa a ser inteiramente de engenharia — arquitetura, testes, automação e o processo de publicação em loja.

Está disponível na App Store e no F-Droid, com todo o código aberto sob licença MIT.

## Características Principais

### Arquitetura Hexagonal

- Domínio puro, sem dependências de React, Expo ou de qualquer biblioteca de interface
- Ports e adapters isolando câmera, permissões e localização do núcleo da aplicação
- Injeção de dependência via React Context, permitindo substituir adapters nos testes sem mocks de plataforma
- TypeScript em modo estrito, com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`

### Testes em Quatro Níveis

- 71 testes unitários e de integração com 100% de cobertura em statements, branches, funções e linhas
- Testes de propriedade com fast-check
- Testes de mutação com Stryker, medindo a qualidade dos testes e não apenas a cobertura
- Testes E2E com Maestro, executados em iOS e Android a cada pull request

### Integração e Entrega Contínuas

- Cinco workflows no GitHub Actions: CI, E2E, Chromatic, build EAS e distribuição via Firebase
- Quality gate no SonarCloud, com cobertura espelhando as exclusões do Jest
- Regressão visual no Chromatic, alimentada por um Storybook web além do Storybook on-device
- Distribuição automática de builds para testers via Firebase App Distribution

### Privacidade

- O app não possui nenhuma linha de código de rede
- Nada é gravado, armazenado ou transmitido: a imagem da câmera existe apenas em tela
- Superfície de permissões reduzida a uma única: `CAMERA`

### Internacionalização

- Interface completa em português, inglês, espanhol e japonês
- Detecção automática do idioma do dispositivo

## Desafios Técnicos

1. **Publicação no F-Droid**: o catálogo compila os aplicativos a partir do código-fonte e não aceita dependências proprietárias. O `expo-camera` depende das bibliotecas de ML Kit do Google para leitura de código de barras, o que inviabilizava a submissão. Escrevi um patch que remove essas bibliotecas preservando a API pública do módulo, permitindo que o app entrasse no catálogo sem nenhuma anti-feature.

2. **Redução do artefato**: o APK caiu de 69 MB para 20 MB, combinando a remoção do ML Kit, a restrição às arquiteturas ARM e o empacotamento legado das bibliotecas nativas.

3. **Higiene de permissões**: um plugin de configuração do Expo remove permissões não utilizadas apenas dos builds de release, através de um source set dedicado — preservando as permissões que o ambiente de desenvolvimento precisa. A superfície declarada saiu de sete permissões para uma, verificada diretamente no artefato gerado.

4. **Build reproduzível fora do Expo**: um workflow gera um snapshot Gradle autocontido do projeto em um repositório separado, que o F-Droid compila com `gradlew` puro, sem depender de Node, pnpm ou Expo CLI no ambiente de build.

## Aprendizados

- Arquitetura hexagonal aplicada a React Native, com um domínio testável sem depender de mocks de plataforma
- Testes de mutação como métrica da qualidade dos testes, expondo asserções que passam sem verificar nada
- O processo de revisão de um catálogo de software livre, com requisitos de compilação a partir do código-fonte
- O ciclo completo de submissão e revisão nas lojas de aplicativos, incluindo políticas de privacidade e declaração de dados

## Impacto

- Publicado na App Store, com compatibilidade verificada também em Macs com Apple Silicon
- Publicado no F-Droid, compilado pelo próprio catálogo e listado sem nenhuma anti-feature
- 14 releases ao longo de três meses de desenvolvimento
- Base de código aberta e documentada, servindo como referência prática das práticas descritas acima
