---
title: next-docs AI Working Guide
docType: contract
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when a task may change public Docusaurus documentation, site navigation, screenshots, or docs-product drift tracking
  - when deciding whether work belongs in this repository, in tiangong-lca-next, or in lca-workspace
  - when routing from the workspace root into tiangong-lca-next-docs
whenToUpdate:
  - when product/docs ownership boundaries change
  - when the bilingual public-doc workflow changes
  - when repo-local docpact governance or source docs change
checkPaths:
  - AGENTS.md
  - README.md
  - TODO.docs-system-gaps.md
  - .docpact/config.yaml
  - docs/agents/**
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
  - package.json
  - .githooks/**
  - scripts/docpact
  - scripts/docpact-gate.sh
  - scripts/install-git-hooks.sh
lastReviewedAt: 2026-07-08
lastReviewedCommit: 8246f72601ead64197bfdbc5bbc861fa4e92b0dc
lastReviewedNote: "Reviewed docs-impact issue #377 public docs and llms.txt changes; repo ownership, bilingual workflow, and publication boundary remain accurate."
related:
  - .docpact/config.yaml
  - docs/agents/repo-architecture.md
  - docs/agents/repo-validation.md
  - README.md
  - TODO.docs-system-gaps.md
---

## Repo Contract

`tiangong-lca-next-docs` owns the public TianGong LCA documentation site built with Docusaurus. Start here when the task may change published docs pages, navigation, screenshots, or the durable backlog that tracks docs drift against the product.

## AI Load Order

Load docs in this order:

1. `AGENTS.md`
2. `.docpact/config.yaml`
3. `docs/agents/repo-architecture.md`
4. `docs/agents/repo-validation.md`
5. `README.md` for maintainer workflow details
6. `TODO.docs-system-gaps.md` when the task is part of an existing drift item
7. the target page under `docs/**` and its English mirror under `i18n/en/docusaurus-plugin-content-docs/current/**`

Do not start by guessing product behavior from the docs repo alone.

## Repo Ownership

This repo owns:

- `docs/**` as the canonical Chinese public-doc source
- `i18n/en/docusaurus-plugin-content-docs/current/**` as the maintained English mirror
- `sidebars.ts`, `docusaurus.config.ts`, `src/**`, and `static/**` for docs-site structure and presentation
- `TODO.docs-system-gaps.md` for durable tracking of product/docs drift

This repo does not own:

- shipped product behavior
- product routes, API semantics, or hidden-role UI logic
- workspace integration state after merge

Route those tasks to:

- `tiangong-lca-next` for shipped product behavior and UI truth
- `lca-workspace` for root integration after merge

## Runtime Facts

- Repo-local documentation governance is encoded in `.docpact/config.yaml` and enforced locally by the pre-push docpact gate; `.github/workflows/ai-doc-lint.yml` is manual-dispatch fallback.
- Chinese docs are the source of truth for this site; English pages are maintained mirrors and must be updated in the same change
- The canonical local commands are `npm run lint`, `npm run build`, `npm run typecheck`, `npm run docs:llms:check`, and `npm run docs:publication-scope:check`
- `static/llms.txt`, `context7.json`, and `.github/workflows/publish-docs.yml` define the public AI-consumption and post-merge publication boundary
- Use Playwright or equivalent product verification only when text inspection of `../tiangong-lca-next` is not enough to confirm the current UI flow or screenshot target
- If a page is only partially fixed, update `TODO.docs-system-gaps.md` in the same working session
- For documentation-governance changes, run `scripts/docpact validate-config --root . --strict` and `scripts/docpact lint --root . --base origin/main --head HEAD --mode enforce`

## Hard Boundaries

- Do not document product behavior here without checking `../tiangong-lca-next`
- Do not update a Chinese page without updating the paired English mirror in the same change
- Do not leave durable drift notes only in chat when `TODO.docs-system-gaps.md` should be updated
- Do not treat a merged repo PR here as workspace-delivery complete if the root repo still needs a submodule bump
- Do not add internal agent docs, TODOs, plans, incidents, or governance runbooks to `static/llms.txt` or the Context7 source scope

## Workspace Integration

A merged PR in `tiangong-lca-next-docs` is repo-complete, not delivery-complete.

If the docs change must ship through the workspace:

1. merge the child PR into `tiangong-lca-next-docs`
2. update the `lca-workspace` submodule pointer deliberately
3. complete any later workspace-level validation that depends on the updated docs snapshot

## Local Docpact Push Gate

Install the versioned local hook once per checkout:

```bash
./scripts/install-git-hooks.sh
```

The `pre-push` hook runs `scripts/docpact-gate.sh`, which delegates CLI lookup to `scripts/docpact` and performs strict config validation plus enforced lint before the push leaves the machine. The wrapper checks `DOCPACT_BIN`, Cargo install locations, Homebrew install locations, and then `PATH`, so local agent shells should not fail only because bare `docpact` is unavailable. The default comparison base is `origin/main`. Override it for unusual stacks with `DOCPACT_BASE_REF=<ref>` or `scripts/docpact-gate.sh --base <ref>`. The gate writes its detailed report to a temporary file so normal pushes do not create `.docpact/runs/` artifacts.
