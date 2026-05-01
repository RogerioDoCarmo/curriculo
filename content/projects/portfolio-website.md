---
id: portfolio-website
title: Personal Resume Website
description: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
featured: true
date: 2024-03-01
technologies:
  - Next.js 16
  - TypeScript
  - Tailwind CSS
  - Firebase Analytics
  - Firebase Crashlytics
  - Sentry
  - Vercel
  - Jest
  - Playwright
  - next-intl
repoUrl: https://github.com/RogerioDoCarmo/curriculo
liveUrl: https://rogeriodocarmo.com
images:
  - /images/projects/portfolio-1.jpg
---

## Visão Geral

Este website de currículo pessoal foi desenvolvido como uma plataforma profissional completa para apresentar experiência, projetos e habilidades. O projeto demonstra expertise em desenvolvimento frontend moderno, seguindo as melhores práticas de performance, acessibilidade e SEO.

## Características Principais

### Internacionalização (i18n)

- Suporte completo para 3 idiomas: Português (pt-BR), Inglês (en) e Espanhol (es)
- Detecção automática de idioma do navegador
- Persistência de preferência de idioma
- URLs localizadas para melhor SEO

### Tema Escuro/Claro

- Alternância suave entre modos claro e escuro
- Detecção automática de preferência do sistema
- Persistência de preferência do usuário
- Prevenção de FOUC (Flash of Unstyled Content)

### Performance e SEO

- Geração estática com Next.js 16 (SSG)
- Bundle JavaScript otimizado (<200KB gzipped)
- Lighthouse Score: 93+ (Performance)
- First Contentful Paint < 1.5s
- Sitemap.xml e robots.txt automáticos
- Structured Data (Schema.org)

### Monitoramento e Analytics

- Firebase Analytics para rastreamento de usuários
- Firebase Crashlytics para monitoramento de erros
- Sentry para error tracking detalhado
- Métricas de performance em tempo real

### Acessibilidade

- Conformidade WCAG AA
- Navegação por teclado completa
- ARIA labels apropriados
- Contraste de cores adequado
- Suporte a leitores de tela

### Testes Abrangentes

- 90%+ de cobertura de testes
- Testes unitários com Jest
- Testes E2E com Playwright
- Testes de propriedade com fast-check
- CI/CD automatizado com GitHub Actions

## Desafios Técnicos

1. **Migração Next.js 14 → 16**: Atualização bem-sucedida com melhorias de performance de 22% no tempo de build
2. **Compatibilidade ESM**: Resolução de problemas de compatibilidade entre next-intl e Jest
3. **Otimização de Bundle**: Redução de 1.6% no tamanho do bundle através de code splitting e lazy loading
4. **Acessibilidade**: Implementação completa de padrões WCAG AA com testes automatizados

## Aprendizados

- Arquitetura de aplicações Next.js 16 com App Router
- Implementação de internacionalização escalável
- Otimização de performance para Lighthouse 90+
- Configuração de pipelines CI/CD robustos
- Integração de múltiplos serviços de monitoramento

## Impacto

- Website profissional acessível em 4 domínios
- Experiência de usuário otimizada em 3 idiomas
- Performance excepcional (Lighthouse 93+)
- Monitoramento completo de erros e analytics
- Base de código bem testada e documentada
