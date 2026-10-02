---
id: ai-agents-git-worktrees
platform: linkedin
kind: post
title: "Two AI agents, one Git repository"
description: "How to work on two scopes of the same codebase at once, with AI agents and git worktree, without conflicts."
url: "https://www.linkedin.com/posts/rogeriodocarmo_dois-agentes-de-ia-um-reposit%C3%B3rio-git-zero-ugcPost-7509704418368368640-P4mv/"
language: pt-BR
featured: false
date: "2026-09-26"
---

I often need to run the weekly vulnerability and dependency check while building a feature or fixing a bug in the same codebase. With coding agents and prompts that make them work explicitly in different Git worktrees, that works without problems.

Behind each prompt there is a git worktree: git worktree add <folder> -b <branch> creates a new folder tied to the same .git base, with its own branch — nothing is cloned or duplicated. The agent works and commits there; to bring it back, it merges the branch from the original worktree and removes the folder with git worktree remove. That is what lets two tasks run in parallel without fear of conflicts.
