---
id: ai-agents-git-worktrees
platform: linkedin
kind: post
title: "Dois agentes de IA, um repositório Git"
description: "Como trabalhar em dois escopos ao mesmo tempo no mesmo código, com agentes de IA e git worktree, sem conflitos."
url: "https://www.linkedin.com/posts/rogeriodocarmo_dois-agentes-de-ia-um-reposit%C3%B3rio-git-zero-ugcPost-7509704418368368640-P4mv/"
language: pt-BR
featured: false
date: "2026-09-26"
---

Preciso fazer a rotina semanal de verificação de vulnerabilidades e dependências enquanto desenvolvo uma funcionalidade ou correção de bug, no mesmo código-fonte. Com agentes de código e prompts que os fazem trabalhar explicitamente em worktrees diferentes do Git, isso funciona sem problemas.

Por trás de cada prompt há um git worktree: o comando git worktree add <pasta> -b <branch> cria uma pasta nova ligada à mesma base .git, com sua própria branch — nada é clonado ou duplicado. O agente trabalha e comita ali; para reintegrar, faz o merge da branch a partir da worktree original e remove a pasta com git worktree remove. É o que permite rodar duas tarefas em paralelo sem medo de conflito.
