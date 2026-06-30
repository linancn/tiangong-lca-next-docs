---
sidebar_position: 1
title: 开发环境配置
docType: guide
scope: repo
status: active
authoritative: true
owner: next-docs
language: zh-CN
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
lastReviewedAt: 2026-07-01
lastReviewedCommit: b52261c56f0bf6c7455a5f16c667c317c2b8966e
related:
  - i18n/en/docusaurus-plugin-content-docs/current/dev/dev-env.md
  - docs/agents/repo-validation.md
---

本页说明 `tiangong-lca-next-docs` 的本地开发环境，以及它与产品仓
`../tiangong-lca-next` 之间的 Node 基线关系。

如果您这次修改还涉及文档与产品行为对齐，请继续阅读
[Docs / Product 同步指南](./docs-product-sync)。

## Node 基线

当前有两层基线需要区分：

- **Docs 站点仓**：`package.json` 当前声明 `node >=18.0`
- **产品仓 `../tiangong-lca-next`**：工程基线当前是 **Node 24**

### 推荐做法

如果您只在 docs 仓内做简单站点维护，理论上 Node 18 及以上即可。

如果您需要同时：

- 对照 `../tiangong-lca-next` 的真实实现
- 在两个仓库之间来回切换
- 排查文档与系统行为差异

建议直接统一使用 **Node 24**，这样不会在 docs 仓和产品仓之间反复切换版本。

## 安装依赖

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

nvm install 24
nvm alias default 24
nvm use 24

npm ci
```

## 常用命令

### 本地调试

```bash
npm run start
```

本地站点默认运行在 `http://localhost:3000/`。

### Markdown 检查

```bash
npm run lint
```

### 生成和检查 AI 文档索引

```bash
npm run docs:llms
npm run docs:llms:check
```

`docs:llms` 会从公开 Docusaurus 文档生成 `static/llms.txt`。`docs:llms:check`
用于确认已提交的索引与当前公开文档内容一致。

### 检查公开发布范围

```bash
npm run docs:publication-scope:check
```

该命令会检查 `static/llms.txt`、`sidebars.ts`、`context7.json` 以及存在时的
`build/llms.txt`，防止内部 agent 文档、TODO、计划、事故记录或治理执行材料进入公开 AI
消费范围。

### 自动修复可修复的 Markdown 问题

```bash
npm run lint:fix
```

### TypeScript 检查

```bash
npm run typecheck
```

### 生产构建

```bash
npm run build
```

`npm run build` 会先通过 `prebuild` 自动执行 `npm run docs:llms`，确保托管平台只调用
标准构建命令时，发布产物中的 `llms.txt` 也会写入当前构建 commit。

### 本地预览构建产物

```bash
npm run serve
```

### 生成翻译骨架

```bash
npm run write-translations -- --locale en
```

## 修改文档时的最小校验

涉及公开文档内容变更时，至少建议执行：

```bash
npm run lint
npm run docs:llms:check
npm run docs:publication-scope:check
npm run build
```

如果这次修改影响了导航、侧边栏、链接结构或中英文镜像，也建议一并检查：

- `docs/intro.md`
- `docs/user-guide/overview.md`
- `sidebars.ts`

## 发布说明

仓库中的 `.github/workflows/publish-docs.yml` 会在 `main` 收到 push 后自动执行发布闭环：

1. 生成并检查 `static/llms.txt`
2. 运行公开范围检查
3. 执行 lint、typecheck、Docusaurus build
4. 部署 Cloudflare Pages
5. 验证公开站点的 `/llms.txt`
6. 刷新 Context7，或在缺少 secret / refresh 失败时留下可见 follow-up

仓库仍保留 `.github/workflows/build.yml` 的 tag 发布流程，适合版本式 release。创建符合
`v*` 规则的标签并推送后，即可触发该流程。

```bash
git tag
git tag v0.0.1
git push origin v0.0.1
```

Cloudflare Pages 相关自动部署仍依赖仓库环境中的：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CONTEXT7_API_KEY`（用于自动刷新 Context7；缺失时 workflow 会保留 pending follow-up）

可选仓库变量：

- `CONTEXT7_LIBRARY_NAME`（默认使用 `/${{ github.repository }}` 形式的 Context7 library id）
