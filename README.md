# TianGong LCA Docs

This repository contains the public Docusaurus site for TianGong LCA.

## Source of truth

- Chinese public-doc source: `docs/**`
- English mirror: `i18n/en/docusaurus-plugin-content-docs/current/**`
- Product behaviour source: `../tiangong-lca-next`

The English tree is a maintained mirror, not a fire-and-forget translation dump. If a public page
changes in Chinese, update the English mirror in the same change.

## Environment

- Docs repo runtime: `package.json` currently allows `node >=20.19.0`
- Recommended workspace baseline: **Node 24**

If you are working across both docs and `../tiangong-lca-next`, use Node 24 to avoid switching
versions.

## Install

```bash
nvm install 24
nvm use 24
npm ci
```

## Common commands

```bash
npm run start
npm run lint
npm run lint:fix
npm run typecheck
npm run build
npm run serve
```

## Recommended verification

For public-doc changes, run at least:

```bash
npm run lint
npm run build
```

If navigation or page structure changes, also check:

- `sidebars.ts`
- `docs/intro.md`
- `docs/user-guide/overview.md`

## Translation scaffolding

```bash
npm run write-translations -- --locale en
```

Use scaffolding only as a starting point. Final English content should be reviewed and edited
manually.

## Docs / Product sync

For the full maintainer workflow, read:

- `docs/dev/docs-product-sync.md`
- `TODO.docs-system-gaps.md`

The default online verification target is `https://lca.tiangong.earth/`.

## Publish

```bash
git tag
git tag v0.0.1
git push origin v0.0.1
```
