---
sidebar_position: 1
title: Developer Environment
docType: guide
scope: repo
status: active
authoritative: true
owner: next-docs
language: en
whenToUse:
  - when setting up local next-docs development or validation commands
  - when publishing docs, llms.txt, or Context7 source updates
whenToUpdate:
  - when package scripts, build commands, publish workflow, or publication-scope checks change
checkPaths:
  - package.json
  - .github/workflows/build.yml
  - .github/workflows/publish-docs.yml
  - scripts/generate-llms-txt.mjs
  - scripts/check-publication-scope.mjs
  - context7.json
  - static/llms.txt
lastReviewedAt: 2026-07-08
lastReviewedCommit: 8246f72601ead64197bfdbc5bbc861fa4e92b0dc
lastReviewedNote: "Reviewed docs-impact issue #377 public docs and llms.txt changes; local development guidance remains aligned with the Chinese source."
related:
  - docs/dev/dev-env.md
  - docs/agents/repo-validation.md
---

This page explains the local setup for `tiangong-lca-next-docs` and how its Node baseline relates to
the product repo at `../tiangong-lca-next`.

If your work also involves aligning docs with product behaviour, continue with
[Docs / Product Sync Guide](./docs-product-sync).

## Node baseline

There are currently two baselines to keep in mind:

- **Docs site repo**: `package.json` currently declares `node >=18.0`
- **Product repo `../tiangong-lca-next`**: the current engineering baseline is **Node 24**

### Recommended approach

If you are only doing light maintenance in the docs repo, Node 18+ is technically enough.

If you also need to:

- inspect the real implementation in `../tiangong-lca-next`
- switch between the two repos
- investigate drift between docs and shipped behaviour

then use **Node 24** across both repos to avoid version churn.

## Install dependencies

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

nvm install 24
nvm alias default 24
nvm use 24

npm ci
```

## Common commands

### Local development

```bash
npm run start
```

The local site normally runs at `http://localhost:3000/`.

### Markdown lint

```bash
npm run lint
```

### Generate and check the AI docs index

```bash
npm run docs:llms
npm run docs:llms:check
```

`docs:llms` generates `static/llms.txt` from the public Docusaurus docs. `docs:llms:check`
confirms that the committed index still matches the current public-doc source.

### Check publication scope

```bash
npm run docs:publication-scope:check
```

This command checks `static/llms.txt`, `sidebars.ts`, `context7.json`, and `build/llms.txt` when a
build exists. It prevents internal agent docs, TODOs, plans, incident records, or governance
execution material from entering the public AI-consumption scope.

### Auto-fix lintable Markdown issues

```bash
npm run lint:fix
```

### TypeScript check

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

`npm run build` runs `npm run docs:llms` through `prebuild` first, so hosted platforms that only
invoke the standard build command still publish an `llms.txt` file with the current build commit.

### Serve the built site locally

```bash
npm run serve
```

### Generate translation scaffolding

```bash
npm run write-translations -- --locale en
```

## Minimum verification for doc changes

For public-doc content changes, run at least:

```bash
npm run lint
npm run docs:llms:check
npm run docs:publication-scope:check
npm run build
```

If your change touches navigation, sidebar structure, links, or bilingual mirrors, also re-check:

- `docs/intro.md`
- `docs/user-guide/overview.md`
- `sidebars.ts`

## Release notes

The repository's `.github/workflows/publish-docs.yml` runs the post-merge publish loop on every
push to `main`:

1. Generate and check `static/llms.txt`
2. Run the publication-scope check
3. Run lint, typecheck, and the Docusaurus build
4. Deploy Cloudflare Pages
5. Verify the public `/llms.txt`
6. Refresh Context7, or leave a visible follow-up when the secret is missing or refresh fails

The repository still keeps `.github/workflows/build.yml` for tag-triggered release publishing. Create
and push a tag matching `v*` to trigger that flow.

```bash
git tag
git tag v0.0.1
git push origin v0.0.1
```

Cloudflare Pages deployment still depends on repository-level environment variables:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CONTEXT7_API_KEY` for automatic Context7 refresh. If it is missing, the workflow leaves a pending follow-up.

Optional repository variable:

- `CONTEXT7_LIBRARY_NAME`, defaulting to the Context7 library id form `/${{ github.repository }}`
