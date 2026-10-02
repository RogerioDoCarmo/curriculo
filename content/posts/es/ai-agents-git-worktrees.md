---
id: ai-agents-git-worktrees
platform: linkedin
kind: post
title: "Dos agentes de IA, un repositorio Git"
description: "Cómo trabajar en dos ámbitos del mismo código a la vez, con agentes de IA y git worktree, sin conflictos."
url: "https://www.linkedin.com/posts/rogeriodocarmo_dois-agentes-de-ia-um-reposit%C3%B3rio-git-zero-ugcPost-7509704418368368640-P4mv/"
language: pt-BR
featured: false
date: "2026-09-26"
---

Necesito hacer la rutina semanal de verificación de vulnerabilidades y dependencias mientras desarrollo una funcionalidad o corrijo un bug en el mismo código. Con agentes de código y prompts que los hacen trabajar explícitamente en worktrees distintos de Git, eso funciona sin problemas.

Detrás de cada prompt hay un git worktree: git worktree add <carpeta> -b <rama> crea una carpeta nueva ligada a la misma base .git, con su propia rama — nada se clona ni se duplica. El agente trabaja y hace commits ahí; para reintegrar, hace el merge de la rama desde la worktree original y elimina la carpeta con git worktree remove. Eso permite ejecutar dos tareas en paralelo sin miedo a conflictos.
