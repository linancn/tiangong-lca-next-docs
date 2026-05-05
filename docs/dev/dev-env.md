---
sidebar_position: 1
---

# 开发环境配置

本页说明 `tiangong-lca-next-docs` 的本地开发环境，以及它与产品仓
`../tiangong-lca-next` 之间的 Node 基线关系。

如果您这次修改还涉及文档与产品行为对齐，请继续阅读
[Docs / Product 同步指南](./docs-product-sync)。

## Node 基线

当前有两层基线需要区分：

- **Docs 站点仓**：`package.json` 当前声明 `node >=20.19.0`
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
npm run build
```

如果这次修改影响了导航、侧边栏、链接结构或中英文镜像，也建议一并检查：

- `docs/intro.md`
- `docs/user-guide/overview.md`
- `sidebars.ts`

## 发布说明

仓库中的 `.github/workflows/build.yml` 使用基于 tag 的自动发布流程。创建符合 `v*` 规则的
标签并推送后，即可触发发布。

```bash
git tag
git tag v0.0.1
git push origin v0.0.1
```

Cloudflare Pages 相关自动部署仍依赖仓库环境中的：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
