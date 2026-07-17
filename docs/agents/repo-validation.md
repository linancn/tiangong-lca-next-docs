---
title: next-docs Validation Guide
docType: guide
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when validating public docs, site structure, bilingual mirror, screenshot, or documentation-governance changes
  - when selecting proof for a next-docs PR
whenToUpdate:
  - when Docusaurus validation commands change
  - when bilingual mirror or product/docs drift proof expectations change
  - when docpact governance rules or CI behavior change
checkPaths:
  - AGENTS.md
  - .docpact/config.yaml
  - .github/workflows/ai-doc-lint.yml
  - .github/workflows/publish-docs.yml
  - package.json
  - context7.json
  - scripts/generate-llms-txt.mjs
  - scripts/check-publication-scope.mjs
  - scripts/publication-policy.mjs
  - sidebars.ts
  - docusaurus.config.ts
  - docs/**
  - i18n/en/docusaurus-plugin-content-docs/current/**
  - TODO.docs-system-gaps.md
  - .githooks/pre-push
  - scripts/docpact
  - scripts/docpact-gate.sh
  - scripts/install-git-hooks.sh
lastReviewedAt: 2026-07-08
lastReviewedCommit: 8246f72601ead64197bfdbc5bbc861fa4e92b0dc
lastReviewedNote: "Reviewed docs-impact issue #377 validation evidence; required local commands and docpact guidance remain accurate."
related:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/agents/repo-architecture.md
---

## next-docs Validation Guide

The canonical local commands are:

```bash
npm run lint
npm run build
npm run typecheck
npm run docs:llms:check
npm run docs:publication-scope:check
```

Use the narrowest command set that proves the touched area.

## Required Validation Shape

- Public docs changes require checking the Chinese source and English mirror together.
- Navigation or site-config changes require at least typecheck and build when feasible.
- Publication pipeline changes require `npm run docs:llms:check` and `npm run docs:publication-scope:check`; if they affect build output, also run `npm run build` and rerun the publication-scope check afterward.
- `static/llms.txt` must list only public docs pages, and `context7.json` must keep Context7 scoped to public docs with internal agent, TODO, plan, incident, and governance execution records excluded.
- Product-behavior documentation changes require checking `../tiangong-lca-next` when behavior is ambiguous.
- Partial fixes to product/docs drift must update `TODO.docs-system-gaps.md`.
- Documentation-governance changes require docpact validation.

## Docpact Validation

Run these commands for governance changes:

```bash
scripts/docpact validate-config --root . --strict
scripts/docpact lint --root . --base origin/main --head HEAD --mode enforce
```

The manual `ai-doc-lint` workflow delegates to the same local docpact gate when remote reproduction is needed.

## Local Docpact Push Gate

Install the versioned local hook once per checkout:

```bash
./scripts/install-git-hooks.sh
```

The `pre-push` hook runs `scripts/docpact-gate.sh`, which delegates CLI lookup to `scripts/docpact` and performs strict config validation plus enforced lint before the push leaves the machine. The wrapper checks `DOCPACT_BIN`, Cargo install locations, Homebrew install locations, and then `PATH`, so local agent shells should not fail only because bare `docpact` is unavailable. The default comparison base is `origin/main`. Override it for unusual stacks with `DOCPACT_BASE_REF=<ref>` or `scripts/docpact-gate.sh --base <ref>`. The gate writes its detailed report to a temporary file so normal pushes do not create `.docpact/runs/` artifacts.
