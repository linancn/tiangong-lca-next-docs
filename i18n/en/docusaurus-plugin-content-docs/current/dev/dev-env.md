---
sidebar_position: 1
---

# Developer Environment

This page explains the local setup for `tiangong-lca-next-docs` and how its Node baseline relates to
the product repo at `../tiangong-lca-next`.

If your work also involves aligning docs with product behaviour, continue with
[Docs / Product Sync Guide](./docs-product-sync).

## Node baseline

There are currently two baselines to keep in mind:

- **Docs site repo**: `package.json` currently declares `node >=20.19.0`
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
npm run build
```

If your change touches navigation, sidebar structure, links, or bilingual mirrors, also re-check:

- `docs/intro.md`
- `docs/user-guide/overview.md`
- `sidebars.ts`

## Release notes

The repository's `.github/workflows/build.yml` uses a tag-triggered publish flow. Create and push a
tag matching `v*` to trigger deployment.

```bash
git tag
git tag v0.0.1
git push origin v0.0.1
```

Cloudflare Pages deployment still depends on repository-level environment variables:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
