---
title: next-docs Repo Architecture
docType: reference
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when deciding whether public documentation, navigation, screenshots, or docs drift work belongs here
  - when checking boundaries between public docs and shipped product behavior
whenToUpdate:
  - when public docs ownership changes
  - when bilingual mirror expectations change
  - when site structure or product/docs drift tracking changes
checkPaths:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/**
  - i18n/en/docusaurus-plugin-content-docs/current/**
  - sidebars.ts
  - docusaurus.config.ts
  - src/**
  - static/**
  - context7.json
  - .github/workflows/publish-docs.yml
  - scripts/generate-llms-txt.mjs
  - scripts/check-publication-scope.mjs
  - scripts/publication-policy.mjs
  - scripts/check-screenshots.mjs
  - scripts/check-screenshots.test.mjs
  - TODO.docs-system-gaps.md
  - .githooks/pre-push
  - scripts/docpact
  - scripts/docpact-gate.sh
  - scripts/install-git-hooks.sh
lastReviewedAt: 2026-08-22
lastReviewedCommit: b89fa47360347726e1de3fe62c983b16b40a268f
lastReviewedNote: "Reviewed for P0A spike Issue #131: architecture contracts unchanged; spike/ holds a temporary Fumadocs/TS7 verification app (issue #131) that will be superseded by the P1 production skeleton."
related:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/agents/repo-validation.md
---

## next-docs Repo Architecture

`tiangong-lca-next-docs` owns the public TianGong LCA documentation site built with Docusaurus.

## Owned Surfaces

- `docs/**` is the canonical Chinese public-doc source.
- `i18n/en/docusaurus-plugin-content-docs/current/**` is the maintained English mirror and should change with its paired Chinese page.
- `sidebars.ts`, `docusaurus.config.ts`, `src/**`, and `static/**` define site structure, presentation, screenshots, and custom site behavior.
- `scripts/check-screenshots.mjs` validates visual evidence without moving screenshots out of their existing page-local `img/` directories. Ordinary Chinese and English mirror assets remain byte-identical; replacements preserve their prior composition, while additions name an existing same-class reference image.
- `static/llms.txt`, `context7.json`, `.github/workflows/publish-docs.yml`, and `scripts/*llms*` / `scripts/*publication*` define the public AI-consumption and post-merge publication boundary.
- `TODO.docs-system-gaps.md` is the durable backlog for product/docs drift.

## Non-Owner Boundaries

- `tiangong-lca-next` owns shipped product behavior, route truth, API semantics, and UI control behavior.
- `lca-workspace` owns root integration state and submodule pointer updates.

Do not document product behavior here without checking the product repository when the current behavior is ambiguous.

## Integration Semantics

A merged PR in this repository is repo-complete only. If the updated docs site snapshot must ship through the workspace, root integration must deliberately update the `tiangong-lca-next-docs` submodule pointer after merge.

## Local Docpact Push Gate

This repository has a versioned local `pre-push` hook under `.githooks/pre-push` that delegates to `scripts/docpact-gate.sh`. The gate resolves the CLI through `scripts/docpact`, so local agent shells do not need bare `docpact` on `PATH`. The hook is a local developer guard for docpact config validation and enforced doc-governance linting; ordinary PRs and pushes rely on the local gate; `.github/workflows/ai-doc-lint.yml` is manual-dispatch fallback for remote reproduction.
