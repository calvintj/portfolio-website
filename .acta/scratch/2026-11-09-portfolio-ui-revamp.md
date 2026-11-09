---
id: SCR-0001
hash: d16mbbv
title: Portfolio UI revamp
status: brainstorming
created: "2026-11-09 14:18:05"
schema: "1"
started: "2026-11-09 14:18:09"
---
# Portfolio UI revamp

## Words

### 2026-11-09

User request (2026-11-09): "this is my portfolio website, i think the UI style has quite out of date, please use your creativity and revamp my portfolio website"

## Context

## Log

### 2026-11-09

Q1 direction: Editorial chosen (warm paper, big serif name, mono metadata, numbered sections, hairline rules, one ink accent).

### 2026-11-09

Q2 theme: follow system + navbar toggle, choice remembered.
Q3 scope: no Content type/API changes; restyle /admin into the new visual style too.

### 2026-11-09

Approach: semantic CSS tokens in globals.css mapped to Tailwind v4 @theme, data-theme on <html>, inline pre-paint script in layout. No new deps. Rejected: dark: variant everywhere (noise), next-themes (extra dep).

## Open questions
