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
  - package.json
  - sidebars.ts
  - docusaurus.config.ts
  - docs/**
  - i18n/en/docusaurus-plugin-content-docs/current/**
  - TODO.docs-system-gaps.md
  - .githooks/pre-push
  - scripts/docpact-gate.sh
  - scripts/install-git-hooks.sh
lastReviewedAt: 2026-05-08
lastReviewedCommit: 77fb69cdd95f467f5f4841cf8e0b42b451dba3ce
related:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/agents/repo-architecture.md
---

# next-docs Validation Guide

The canonical local commands are:

```bash
npm run lint
npm run build
npm run typecheck
```

Use the narrowest command set that proves the touched area.

## Required Validation Shape

- Public docs changes require checking the Chinese source and English mirror together.
- Navigation or site-config changes require at least typecheck and build when feasible.
- Product-behavior documentation changes require checking `../tiangong-lca-next` when behavior is ambiguous.
- Partial fixes to product/docs drift must update `TODO.docs-system-gaps.md`.
- Documentation-governance changes require docpact validation.

## Docpact Validation

Run these commands for governance changes:

```bash
docpact validate-config --root . --strict
docpact lint --root . --base origin/main --head HEAD --mode enforce
```

The repository PR workflow runs the same docpact config validation and PR-shaped lint gate.

## Local Docpact Push Gate

Install the versioned local hook once per checkout:

```bash
./scripts/install-git-hooks.sh
```

The `pre-push` hook runs `scripts/docpact-gate.sh`, which performs strict config validation and `docpact lint --mode enforce` before the push leaves the machine. The default comparison base is `origin/main`. Override it for unusual stacks with `DOCPACT_BASE_REF=<ref>` or `scripts/docpact-gate.sh --base <ref>`. The gate writes its detailed report to a temporary file so normal pushes do not create `.docpact/runs/` artifacts.
