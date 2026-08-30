---
title: next-docs Validation Guide
docType: guide
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when validating public content, navigation, presentation, metadata, search, publishing, or governance changes
  - when selecting proof for a next-docs pull request
whenToUpdate:
  - when package scripts, output contracts, browser coverage, or CI behavior change
checkPaths:
  - AGENTS.md
  - .docpact/config.yaml
  - package.json
  - .nvmrc
  - scripts/build.mjs
  - scripts/check-env.mjs
  - scripts/*.test.mjs
  - scripts/verify-out.mjs
  - scripts/check-links.mjs
  - scripts/check-links.test.mjs
  - scripts/check-screenshots.mjs
  - app/**
  - components/**
  - lib/**
  - content/docs/**
  - public/**
  - context7.json
  - .github/workflows/**
  - .githooks/**
lastReviewedAt: 2026-08-30
lastReviewedCommit: ceb3b05325fa8467f350e87b08935a0b2b3bd909
lastReviewedNote: "Reviewed for PR #160 follow-up: browser proof now covers mobile title wrapping and localized TIDAS overview entry targets; toolchain and publication validation are unchanged."
related:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/agents/repo-architecture.md
---

Review note, 2026-08-30: Static output proof asserts plain-language two-task navigation, locale-aligned TIDAS and glossary links, and one five-step first-use exercise.

## Validation guide

## Canonical commands

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
DEPLOY_ENV=ci CANONICAL_ORIGIN=http://localhost:3000 NEXT_PUBLIC_SEARCH_MODE=static pnpm build
```

`pnpm build` includes fail-closed bounded Node 24 and exact package-tool/environment validation, the general Node contract/link tests, static export, `verify:out`, and `check:links`. Screenshot-validator tests intentionally remain outside `pnpm test`, `pnpm build`, pull-request CI, and release CI. Use `pnpm test:env`, `pnpm test:toolchain`, or `pnpm test:links` for regular focused diagnosis; the docs-impact mapped/replay worker owns `pnpm test:screenshots` when visual evidence is present.

## Proof by change type

- Public content: update all four locale variants; run lint and the complete build.
- Toolchain, package manager, environment checker, or CI actions: run a clean frozen install, `pnpm test:env`, `pnpm test:toolchain`, lint, typecheck, and the complete static build. Node must satisfy `>=24.18.0 <25`; EdgeOne must use `24.18.0` plus direct `pnpm install --frozen-lockfile`, local `.nvmrc` must select major `24`, reviewed GitHub workflows remain on `24.19.0`, pnpm stays exactly `11.24.0`, TypeScript exactly `7.0.2`, and markdownlint exactly local `0.23.2`; external actions must use reviewed executable commit SHAs.
- Links, anchors, navigation, or assets: run link unit tests and the complete build. `check:links` must report zero missing pages, fragments, or local assets, zero path-relative document links, zero source-locale mismatches, and identical normalized internal-document target sets across the four variants of each page.
- Docs-impact screenshots: the mapped/replay worker runs `pnpm test:screenshots`, then invokes `pnpm check:screenshots -- --manifest <visual-result.json> --diff-file <name-status> --base-ref <ref> --json`. Added assets must be content-addressed and referenced by all four locale siblings; replacement must use a new hash path and may delete the old asset only after all remaining MDX references are gone; reuse must not mutate the asset.
- Layout, CSS, brand, search dialog, or responsive behavior: run typecheck and build, then inspect a real browser at 390px, 1440px, 1633px, 2048px, and 2560px in light and dark themes. Confirm keyboard focus, language switching, search, mobile menu, and zero horizontal overflow.
- Landing visual contract: assert `data-hero-signature="lca-concept-map"`, exactly one `data-primary-action`, and a single semantic HTML `main`. The primary action must compute to `background-image: none`, `box-shadow: none`, and `transform: none`; the Next signature must not match the TIDAS hero signature.
- LCA concept geometry: while the hero is in two-column mode, the rightmost rendered title glyph must remain inside `[data-hero-copy]` and at least 24px away from `[data-concept-map]`; `[data-concept-connector]` must retain a rendered stroke width of at least 1.2px.
- Documentation-root hub: all four `/{lang}/docs/` outputs must contain `[data-docs-portal="lca-task-hub"]`, `[data-docs-portal-map="lca-task-route"]`, `[data-docs-portal-map-v2="two-lca-journeys"]`, and both `[data-docs-journey]` values. Visible copy must use task language while the `journey` strings remain compatibility markers only. Each internal portal link must stay in its locale; the two beginner TIDAS steps must link to that locale's `core-modules/` and `tool/` overviews rather than opening a field-level Schema page directly, and each terminology card must link to that locale's overview glossary. All targets must resolve, remain visible at 390px, and produce no horizontal overflow at 390px, 1440px, 1633px, 2048px, or 2560px in light and dark themes.
- Quick-start route: all four `/{lang}/docs/quick-start/` outputs must contain `[data-quick-start-guide="first-session-route"]`, `[data-quick-start-map-v2="golden-path"]`, prerequisite, sample, and recovery markers, one solid application entry action, and the same five canonical action targets. They must not contain a first-task branch. `[data-quick-start-map="three-stage-onboarding"]` is asserted only as a compatibility marker. Browser proof must show the first-use explanation, readable step outcomes and completion criteria, visible keyboard focus, no fixed-height overlap in German or French, and no horizontal overflow at the standard five widths in both themes.
- Terminology: all four `/{lang}/docs/overview/glossary/` pages must exist in localized overview metadata, cite the JRC ILCD General Guide, define the same core concepts, and distinguish structure checks, content completeness, review, data quality, and methodological compliance. Link checks must keep each locale on its own glossary and TIDAS documentation.
- Automatic category directories: all 36 localized category roots (eight top-level sections plus the nested case-introduction section, across four locales) must expose `[data-category-directory]` and a `data-category-count` equal to the non-index entries in their localized `meta*.json`. Every meta target must be emitted in order with a localized title and non-empty metadata or first-paragraph summary. Browser proof must cover the two-column User Guide and a nested-folder category, with no self-links, empty grid cells, overlap, or horizontal overflow.
- Metadata or route changes: inspect generated HTML for canonical, `x-default`, all real locale alternatives, and Open Graph image metadata; confirm sitemap entries and negative 404 contracts.
- Production publishing or search reconciliation: run the complete build, verify deployed `/llms.txt` and `/search-records.json` expose the expected SHA, assert indexable robots/canonical metadata, then confirm locale-isolated Algolia search.
- Preview reconciliation: assert the same deployed SHA but require `Disallow: /`, page `noindex`, and production-origin canonical/sitemap URLs; confirm the production-state job is skipped.
- Governance: validate and lint Docpact after the implementation diff is final.

## Docpact

```bash
scripts/docpact validate-config --root . --strict --format json
scripts/docpact lint --root . --base origin/main --head HEAD --mode enforce --format json
```

Use an absolute root when invoked outside the repository. Save a report only when diagnostics need drill-down.

## Local pre-push gate

```bash
./scripts/install-git-hooks.sh
```

The hook runs strict configuration validation and enforced documentation-governance lint against `origin/main` by default.
