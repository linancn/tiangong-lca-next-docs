---
title: Docs/System Gap TODO
docType: backlog
scope: repo
status: active
authoritative: false
owner: next-docs
language: en
whenToUse:
  - when recording durable product/docs drift discovered during docs maintenance
  - when a docs impact worker finds user-visible product behavior that is not yet covered by public docs
whenToUpdate:
  - when public docs drift is found, reprioritized, verified, or closed
  - when publication checks reveal a user-facing documentation gap that needs follow-up work
checkPaths:
  - TODO.docs-system-gaps.md
  - docs/**
  - i18n/en/docusaurus-plugin-content-docs/current/**
  - scripts/generate-llms-txt.mjs
  - scripts/check-publication-scope.mjs
  - context7.json
  - static/llms.txt
lastReviewedAt: 2026-07-08
lastReviewedCommit: 8246f72601ead64197bfdbc5bbc861fa4e92b0dc
lastReviewedNote: "Reviewed docs-impact issue #377 dataset-versioning and CLI import coverage; no new system-gap backlog item remains after public docs updates."
related:
  - AGENTS.md
  - README.md
  - docs/dev/docs-product-sync.md
---

## Docs/System Gap TODO

This file is a long-term maintenance backlog for gaps between:

- the public documentation site in `tiangong-lca-next-docs`
- the shipped product behavior in `../tiangong-lca-next`

Use it as the durable place to record documentation drift. Do not treat chat history as the source
of truth once a gap has been identified.

## How To Use This File

- Add a new item when product behavior exists in `tiangong-lca-next` but the docs site is missing,
  stale, misleading, or fragmented.
- Update the item in the same working session when a gap changes status, scope, or priority.
- Keep references concrete: point to product files, routes, and doc files.
- Prefer one durable item per gap area instead of scattered notes.
- Keep internal maintenance notes here at repo root. Do not place them under `docs/**` unless they
  are meant to be published on the site.
- Publication pipeline changes (`llms.txt`, Context7, or publish workflow) do not replace this
  backlog; if they reveal stale or missing user-facing documentation, add or update an item here.

## Verification Notes

- Default online verification target: `https://lca.tiangong.earth/`
- `../tiangong-lca-next` currently publishes directly from `main`, so docs maintenance normally uses
  the product repo's `main` branch as the implementation source of truth without a separate
  production-parity check.
- Verification credentials may exist in the repo-root `.env` file as:
  - `TIANGONG_LCA_USERNAME`
  - `TIANGONG_LCA_PASSWORD`
  - `TIANGONG_LCA_API_KEY`
- Treat these as secrets. Record variable names only, never their values.
- If a gap requires live UI confirmation or refreshed screenshots, prefer Playwright over guesswork.
- When adding or replacing screenshots, follow the style of existing docs screenshots and add red
  boxes or callouts when that makes the instructional focus clearer.
- Unless the documentation task specifically needs to compare locales, use the product's English UI
  for screenshots, even when updating Chinese docs.
- For local or tightly cropped screenshots, do not force a full-screen composition just to hit a
  fixed canvas size. Preserve clarity by using higher capture density and repo-consistent PNG
  density metadata instead.
- The public docs site is primarily for human readers, so use screenshots when they materially
  improve comprehension, but do not require screenshots on every page.

## Status Legend

- `[ ]` Not started
- `[-]` Partially covered
- `[x]` Covered and verified
- `[?]` Needs product confirmation

## Active Backlog

### [x] P0 Account Profile And API Key

Problem:
The product account page includes a dedicated `Generate API Key` tab with password verification and
one-time key display, but the public account guide only documents basic info, password change, and
email change.

System evidence:

- `../tiangong-lca-next/src/pages/Account/index.tsx`

Docs currently involved:

- `docs/user-guide/account-profile.md`
- `docs/MCP/lca_remote.md`
- `docs/openapi/tidas-package-import.md`

Needed:

- Add a dedicated API Key section to the account guide.
- Explain where the entry is, what verification is required, and that the key should be copied and
  stored securely because it is not shown again.
- Link the account guide to MCP and OpenAPI pages instead of documenting API Key generation only in
  integration docs.

Resolution:

- `docs/user-guide/account-profile.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/account-profile.md`
- Account guide now documents the `Generate API Key` tab, password re-verification, one-time key
  display, and links to the MCP/OpenAPI usage guides.

### [x] P0 TIDAS ZIP Import/Export And Task Center

Problem:
The product has global TIDAS ZIP import, global TIDAS ZIP export, and a shared task center, but the
docs site mainly covers ordinary JSON import/export plus API import. The UI flow is under-documented.

System evidence:

- `../tiangong-lca-next/src/app.tsx`
- `../tiangong-lca-next/src/components/ImportTidasPackage/index.tsx`
- `../tiangong-lca-next/src/components/ExportTidasPackage/index.tsx`
- `../tiangong-lca-next/src/components/LcaTaskCenter/index.tsx`

Docs currently involved:

- `docs/user-guide/key-functions-introduction.md`
- `docs/openapi/tidas-package-import.md`

Needed:

- Add a user-facing guide for ZIP import/export from the product UI.
- Document export scopes, asynchronous task behavior, report download, and failure-report reading.
- Extend the top-bar controls guide so users can discover these entries from the UI.

Resolution:

- `docs/user-guide/tidas-zip-workflows.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/tidas-zip-workflows.md`
- `docs/user-guide/key-functions-introduction.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/key-functions-introduction.md`
- `sidebars.ts`
- Public docs now describe the ZIP import/export modal flow, scope restrictions, task-center
  behavior, and troubleshooting reports.

### [x] P0 Process Analysis Workspace

Problem:
The product contains a hidden route for process analysis with LCIA profile review, process comparison,
grouped analysis, and contribution path analysis. The docs site has no dedicated page for this
workspace.

System evidence:

- `../tiangong-lca-next/config/routes.ts`
- `../tiangong-lca-next/src/pages/Processes/Analysis/index.tsx`

Docs currently involved:

- `docs/user-guide/lcia.md`
- `docs/user-guide/overview.md`

Needed:

- Add a dedicated analysis page under the user guide.
- Distinguish simple LCIA result viewing from advanced analysis workflows.
- Document the meaning of current-user, open-data, and all-data scopes where applicable.

Resolution:

- `docs/user-guide/process-analysis.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/process-analysis.md`
- `docs/user-guide/lcia.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/lcia.md`
- `sidebars.ts`
- Docs now split basic LCIA result viewing from the advanced process-analysis workspace and document
  the four analysis tabs plus data-scope options.

### [x] P0 Review Workspace For Reviewer Roles

Problem:
The docs describe the review process at a high level, but the product exposes different review
workspaces for `review-admin` and `review-member`, each with different tabs and responsibilities.

System evidence:

- `../tiangong-lca-next/src/pages/Review/index.tsx`

Docs currently involved:

- `docs/user-guide/data-review.md`

Needed:

- Add a role-based review workspace guide.
- Explain tab differences for unassigned, assigned, reviewed, pending, rejected, and member
  management views.
- Clarify which actions belong to authors, reviewers, team admins, and review admins.

Resolution:

- `docs/user-guide/data-review.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/data-review.md`
- Review docs now explain the separate `review-admin` and `review-member` workspaces, tab meaning,
  and how the submitter workflow connects to the review workspace.

### [x] P0 System Management Workspace

Problem:
The product contains a hidden system-management page for system-level teams and members, but the docs
site has no public or maintainer-facing explanation of this capability.

System evidence:

- `../tiangong-lca-next/config/routes.ts`
- `../tiangong-lca-next/src/pages/ManageSystem/index.tsx`

Docs currently involved:

- none

Needed:

- Decide whether this should be public documentation, restricted maintainer documentation, or remain
  undocumented.
- If documented, explain roles, member operations, and intended audience.
- If intentionally undocumented, record the decision here and avoid accidental public mentions.

Resolution:

- Decision: document it publicly, but clearly mark it as a hidden workspace for system-level roles.
- `docs/user-guide/system-management.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/system-management.md`
- `sidebars.ts`
- Public docs now explain the audience, hidden entry point, display-management purpose, and member
  role operations.

### [x] P1 Global Top Bar Control Map

Problem:
The current control guide documents dark mode, language, docs entry, and notifications, but not the
global package import/export actions or the task center that now live in the same top bar.

System evidence:

- `../tiangong-lca-next/src/app.tsx`
- `../tiangong-lca-next/src/components/RightContent/index.tsx`

Docs currently involved:

- `docs/user-guide/key-functions-introduction.md`

Needed:

- Expand the top-bar section into a complete control map.
- Keep screenshots and labels current with the real header layout.

Resolution:

- `docs/user-guide/key-functions-introduction.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/key-functions-introduction.md`
- The top-bar guide now documents the real global control order, notification tabs, avatar-menu
  entries, and links to the ZIP workflow guide.

### [x] P1 High-Value Screenshot Coverage For New Guides

Problem:
The rewritten guides for hidden workspaces and top-bar workflows were text-complete, but several of
them still lacked current screenshots. That reduced clarity for human readers, especially on entry
points, modal workflows, and role-gated pages.

System evidence:

- `https://lca.tiangong.earth/`
- `docs/dev/docs-product-sync.md`
- `AGENTS.md`

Docs currently involved:

- `docs/user-guide/key-functions-introduction.md`
- `docs/user-guide/tidas-zip-workflows.md`
- `docs/user-guide/account-profile.md`
- `docs/user-guide/process-analysis.md`
- `docs/user-guide/data-review.md`
- `docs/user-guide/system-management.md`

Needed:

- Add screenshots only where they materially improve human comprehension.
- Mark the relevant region with red boxes or numbered callouts.
- Keep Chinese and English docs aligned, including mirrored image assets.

Resolution:

- Added current screenshots for the top-bar control map, TIDAS ZIP import modal, TIDAS ZIP export
  modal, account API Key tab, process-analysis workspace, review-member workspace tabs, and system
  management tabs under both `docs/user-guide/img/` and
  `i18n/en/docusaurus-plugin-content-docs/current/user-guide/img/`.
- Inserted those images into the corresponding Chinese and English guides with numbered
  explanations.
- Kept the screenshot strategy selective: high-value pages now have visuals, but the repo still does
  not treat screenshots as mandatory on every doc page.

### [x] P1 Permissions And Data-Space Matrix

Problem:
Permission boundaries are currently spread across multiple pages. Users must piece together behavior
for Open Data, Commercial Data, My Data, Team Data, review roles, and system roles.

System evidence:

- `../tiangong-lca-next/config/routes.ts`
- `../tiangong-lca-next/src/pages/Review/index.tsx`
- `../tiangong-lca-next/src/pages/ManageSystem/index.tsx`

Docs currently involved:

- `docs/user-guide/data.md`
- `docs/user-guide/team-function.md`
- `docs/user-guide/data-review.md`

Needed:

- Add one consolidated permissions matrix or a dedicated page.
- Cover view, copy, edit, contribute, import, export, submit-for-review, and admin actions.

Resolution:

- `docs/user-guide/permissions-and-data-scopes.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/permissions-and-data-scopes.md`
- `docs/user-guide/data.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/data.md`
- `docs/user-guide/team-function.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/team-function.md`
- `sidebars.ts`
- The docs site now has a consolidated permissions page covering data spaces, team roles, review
  roles, system roles, and analysis data scopes.

### [x] P1 Contributor Guide For The Docs/Product Sync Model

Problem:
The public docs repo has only a thin development page. It does not explain that this site is manually
synchronized with the product repo, where drift is likely to appear, or how contributors should check
the product before editing docs.

System evidence:

- `../tiangong-lca-next/AGENTS.md`
- `docusaurus.config.ts`
- `sidebars.ts`

Docs currently involved:

- `docs/dev/dev-env.md`
- `README.md`

Needed:

- Add a maintainer or contributor guide for docs/product synchronization.
- Explain source-of-truth boundaries between `docs/**`, `i18n/en/**`, and `../tiangong-lca-next`.
- Document which product files are common drift hotspots.

Resolution:

- `docs/dev/docs-product-sync.md`
- `i18n/en/docusaurus-plugin-content-docs/current/dev/docs-product-sync.md`
- `README.md`
- `sidebars.ts`
- Maintainer docs now explain source-of-truth boundaries, live verification target, `.env`
  variable handling, screenshot policy, and common product drift hotspots.

### [x] P1 Chinese/English LCIA Parity

Problem:
The English LCIA page already covers both process-level and model-level calculation, while the Chinese
page is still narrower and does not fully match the shipped behavior.

System evidence:

- `../tiangong-lca-next/src/pages/Processes/Components/*`
- `../tiangong-lca-next/src/pages/LifeCycleModels/Components/*`

Docs currently involved:

- `docs/user-guide/lcia.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/lcia.md`

Needed:

- Reconcile the Chinese and English pages.
- Decide whether the Chinese page is the source and update English, or vice versa, then keep both in
  sync in the same change.

Resolution:

- `docs/user-guide/lcia.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/lcia.md`
- `docs/user-guide/process-analysis.md`
- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/process-analysis.md`
- Chinese and English now use the same page split: `lcia.md` for direct LCIA result viewing and
  `process-analysis.md` for advanced analysis workflows.

### [x] P1 Dev Environment Baseline Drift

Problem:
The docs repo still tells readers to use Node 22 for development, while the product-side engineering
baseline currently states Node 24.

System evidence:

- `../tiangong-lca-next/AGENTS.md`

Docs currently involved:

- `docs/dev/dev-env.md`

Needed:

- Re-verify the intended docs-repo and product-repo Node baselines.
- Update the developer guide to distinguish docs-site runtime requirements from product runtime
  requirements if they intentionally differ.

Resolution:

- `docs/dev/dev-env.md`
- `i18n/en/docusaurus-plugin-content-docs/current/dev/dev-env.md`
- `README.md`
- Developer docs now distinguish the docs repo's `node >=18.0` runtime declaration from the product
  repo's Node 24 engineering baseline and recommend Node 24 for cross-repo work.

### [x] P2 English-Orphan Page Cleanup

Problem:
There is at least one English-only page without a matching Chinese source page, which makes long-term
maintenance harder and obscures the intended source-of-truth workflow.

System evidence:

- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/tiangong-data.md`

Docs currently involved:

- `i18n/en/docusaurus-plugin-content-docs/current/user-guide/tiangong-data.md`

Needed:

- Decide whether to restore a Chinese source page, merge the page into an existing document, or
  delete it if obsolete.
- Record the decision here when resolved.

Resolution:

- Decision: delete the obsolete English-only page and keep `user-guide/data-use.md` as the canonical
  bilingual page for this topic.
- Removed: `i18n/en/docusaurus-plugin-content-docs/current/user-guide/tiangong-data.md`

## Completed

- P0 Account Profile And API Key
- P0 TIDAS ZIP Import/Export And Task Center
- P0 Process Analysis Workspace
- P0 Review Workspace For Reviewer Roles
- P0 System Management Workspace
- P1 Global Top Bar Control Map
- P1 Chinese/English LCIA Parity
- P1 Permissions And Data-Space Matrix
- P1 Contributor Guide For The Docs/Product Sync Model
- P1 Dev Environment Baseline Drift
- P2 English-Orphan Page Cleanup
