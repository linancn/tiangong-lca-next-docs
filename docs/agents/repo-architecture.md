---
title: next-docs Repository Architecture
docType: reference
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when changing routing, locale behavior, content loading, search, metadata, or the documentation presentation
  - when checking boundaries between public documentation and shipped product behavior
whenToUpdate:
  - when public-site structure, locale policy, publishing, or output contracts change
checkPaths:
  - AGENTS.md
  - .docpact/config.yaml
  - app/**
  - components/**
  - lib/**
  - content/docs/**
  - public/**
  - manifests/p0b/categories.json
  - manifests/p0b/site-routes.json
  - manifests/p0b/greenfield-deny.json
  - scripts/build.mjs
  - scripts/check-env.mjs
  - scripts/*.test.mjs
  - scripts/verify-out.mjs
  - scripts/check-links.mjs
  - scripts/check-screenshots.mjs
  - package.json
  - next.config.ts
  - edgeone.json
  - context7.json
  - .github/workflows/**
lastReviewedAt: 2026-08-30
lastReviewedCommit: ceb3b05325fa8467f350e87b08935a0b2b3bd909
lastReviewedNote: "Reviewed for PR #160 follow-up: TIDAS task steps now enter through localized beginner overviews before field-level details, and the mobile title can wrap without changing route, runtime, or publication boundaries."
related:
  - AGENTS.md
  - .docpact/config.yaml
  - docs/agents/repo-validation.md
---

Review note, 2026-08-30: Home chooses between two plain-language tasks, DocsPortal owns their complete five-step maps, Quick Start owns one first-use exercise, and Overview owns the central terminology page.

## Architecture

## Runtime and routes

The site uses Next.js App Router with Fumadocs and exports static files to `out/`.

- `app/(entry)/**` owns `/`, the `x-default` entry that renders the full Chinese home without a redirect.
- `app/(locale)/[lang]/**` owns `/{lang}/` and `/{lang}/docs/**` for `zh`, `en`, `de`, and `fr`.
- `lib/source.ts` loads dot-locale MDX from `content/docs/**` with no locale fallback.
- `app/llms.txt`, `app/search-records.json`, `app/api/search`, `app/robots.ts`, `app/sitemap.ts`, and `app/og/**` are generated public endpoints.
- Canonical URLs, language alternatives, `x-default`, and Open Graph images are produced by the layouts, document metadata, and `lib/metadata.ts`.

Retired paths are intentionally absent. No application or hosting configuration may introduce redirects, rewrites, or compatibility copies.

## Presentation

`components/SiteBrand`, `components/DocsHome`, and `components/DocsPortal` are the shared shell and entry-point components. `lib/layout.shared.tsx` supplies the same brand, search, theme, language, documentation, and repository controls to `HomeLayout` and `DocsLayout`. Landing and documentation hubs reuse Fumadocs `buttonVariants`, `Card`, and `Cards`; they do not maintain parallel button or card primitives.

`app/global.css` owns the shared contract:

- an explicit centered 72rem shell and responsive gutters;
- neutral Carbon-style layers with the original TianGong plum retained as a solid interaction color;
- light/dark behavior and visible keyboard focus;
- logo plus `TianGong LCA / Documentation` brand lockup;
- low-radius, border-defined controls without gradients, glow, shadow, or lift animation;
- mobile-safe document pagination.

`components/lca-concept-map.tsx` owns the TianGong LCA hero signature. Its abstract reference-data → process-relations → product-system → LCIA-results topology is intentionally different from the TIDAS data-system/schema signature. The `data-hero-signature="lca-concept-map"` marker makes that distinction testable while shell widths, control placement, brand treatment, and accessibility behavior remain aligned between the sites.

The four `content/docs/index*.mdx` sources render `components/docs-portal.tsx` inside the normal Fumadocs document layout. Home states the platform boundary and asks what the reader wants to complete; it does not duplicate the stages. The portal owns two complete maps: assessing a product from goal/scope through interpretation/report, and publishing reusable data from sources and intended use through TIDAS formatting, structure/reference checks, review/publication, and import/export/reuse. Each step labels whether it is a method choice, platform action, TIDAS data-format action, or a combination of platform work and professional judgement. Cross-site TIDAS targets use the same explicit locale. Beginner steps enter through the TIDAS core-module and tool overviews; those pages lead onward to field-level specification and validation details when the reader needs them. The current markers are `data-docs-portal-map-v2="two-lca-journeys"` and `data-docs-journey`; the earlier `data-docs-portal="lca-task-hub"` and `data-docs-portal-map="lca-task-route"` remain output compatibility markers.

The four `content/docs/quick-start/index*.mdx` sources render `components/quick-start-guide.tsx` as a category-level first-use exercise. It takes 10–15 minutes: sign in, review the methanol example source, find any visible open process, distinguish its reference flow and quantity from a study functional unit, and inspect the LCIA method and coverage. Prerequisites, sample limits, step outcomes, completion criteria, recovery, and an optional video make the exercise usable without branching or requiring video playback. The current marker is `data-quick-start-map-v2="golden-path"` with `data-quick-start-guide="first-session-route"`; `data-quick-start-map="three-stage-onboarding"` is retained only so existing output consumers do not break.

The four `content/docs/overview/glossary*.mdx` sources are the centralized beginner terminology layer. They define the same LCA concepts in each locale from JRC ILCD primary sources and explicitly separate data-structure checks, content completeness, human review, data quality, and named methodological compliance. Entry pages link to this layer; Schema, CLI, contracts, and runtime identifiers remain in advanced documentation.

The `overview`, `user-guide`, `data-collection`, `integration`, `openapi`, `deploy-and-dev`, `faq`, and `changelog` roots, plus the nested `data-collection/case-introduction` root, render `components/category-directory.tsx`. Each MDX variant supplies only its locale and category slug. The server component locates the category folder in `source.getPageTree(lang)`, preserves current `meta*.json` order, includes direct pages and folder index pages, and normalizes emitted links to locale-absolute trailing-slash URLs. Titles and descriptions are read from the child page; when description metadata is absent, a bounded first sentence is derived from `structuredData`. Future child-page additions, removals, renames, ordering changes, and copy updates therefore require no category-index edit.

## Content and locales

Chinese is the canonical authoring source. The same logical page uses:

```text
page.mdx
page.en.mdx
page.de.mdx
page.fr.mdx
```

All four variants must change together when structure, links, examples, or user-visible facts change. Locale metadata files follow the same suffix convention.

Screenshot evidence is stored once under `public/assets/docs/<sha256-prefix>/<semantic-name>.png` and referenced through `/assets/docs/**` by the complete locale family. `scripts/check-screenshots.mjs` validates manifest bindings, references, image metadata, privacy evidence, and add/replace/reuse diff semantics. Replacement creates a new hash path and removes the previous asset only when no current MDX source still references it.

## Build and publication

`scripts/build.mjs` performs this fail-closed sequence:

1. validate bounded Node 24, exact pnpm and TypeScript, deployment environment, and source identity;
2. run every Node environment/toolchain/link contract test;
3. run `next build` static export;
4. validate deterministic routes, endpoints, search records, AI index, SEO files, and greenfield deny paths;
5. validate source-locale link topology and every generated local page, fragment, and asset reference with browser URL semantics.

The package graph contains exact local markdownlint rather than dynamic npx installation. GitHub workflows retain reviewed Node `24.19.0`, exact pnpm `11.24.0`, and immutable executable action commits; local Node major `24`, EdgeOne `24.18.0`, and CI `24.19.0` all satisfy the same `>=24.18.0 <25` runtime contract.

The three retained `manifests/p0b/*.json` files are immutable build contracts for information architecture, expected routes, and retired-path denial. One-time rewrite inventories and executors were removed after cutover; Git history remains the audit source.

EdgeOne Makers builds and deploys from Git. The managed Node runtime supplies pnpm, so `edgeone.json` invokes the frozen pnpm install directly without running `corepack enable`; Corepack setup remains a local contributor concern. GitHub workflows validate pull requests and first reconcile any allowlisted deployment against its source SHA and environment-specific indexing policy. Preview stays `noindex` and canonicalizes to production. Only the production origin can start the separate production-environment job that replaces Algolia data and refreshes Context7; preview reconciliation is validation-only.

## Ownership boundaries

- `tiangong-lca-next` owns product behavior, route truth, API semantics, and user-interface behavior.
- `tiangong-lca-next-docs` owns the public explanation and site implementation.
- `lca-workspace` owns the integrated child commit and completion state.
