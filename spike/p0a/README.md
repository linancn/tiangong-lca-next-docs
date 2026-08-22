# P0A Spike：Fumadocs 16 + Next.js 16.3 + TypeScript 7 静态导出兼容性验证

> 追踪 Issue：[linancn/tiangong-lca-next-docs#131](https://github.com/linancn/tiangong-lca-next-docs/issues/131)
> 方案：[../PLAN-v4.md](../PLAN-v4.md) §10 P0A
> 本目录是**临时验证脚手架**，不作为生产骨架合并（v4 §10：P1 才落正式目录）。

## 状态：本地验证全绿 ✅（EdgeOne Preview 真实构建待控制台操作）

## 运行方式

```bash
cd spike/p0a
pnpm install --frozen-lockfile

# ci/static 模式（默认 fixture）
DEPLOY_ENV=ci \
CANONICAL_ORIGIN=http://localhost:3000 \
NEXT_PUBLIC_SEARCH_MODE=static \
pnpm build:spike

# production/algolia fixture（占位密钥）
DEPLOY_ENV=production \
CANONICAL_ORIGIN=https://docs.tiangong.earth \
NEXT_PUBLIC_SEARCH_MODE=algolia \
NEXT_PUBLIC_ALGOLIA_APP_ID=FIXTUREAPPID \
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=fixturesearchkey \
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=tiangong-lca-docs \
pnpm build:spike
```

`build:spike` = `check-env.mjs`（环境契约校验）→ `next build` → `verify-out.mjs`
（38 项 out/ 结构断言）。

## 已验证项（v4 §10 P0A 清单）

| 项 | 结果 | 证据 |
| --- | --- | --- |
| **TS 7.0.2 硬门禁** | ✅ PASS | `tsc --noEmit` 零错误；`next build` 内置 TS 检查（tsc CLI 路径）通过；无任何 TS6 回退 |
| 四语言静态参数 | ✅ | `/zh /en /de /fr` landing + `/{lang}/docs/...` 全部枚举生成 |
| `fallbackLanguage: null` | ✅ | de/fr 深层路由（video-demo、quick-start）**不生成**（verify-out 负向断言） |
| VideoEmbed | ✅ | 类型安全组件替代旧站内联 iframe（bilibili 源） |
| OG 图 | ✅ | 10 张 `/og/{lang}/docs/.../image.png` 构建期预渲染 |
| robots / sitemap | ✅ | 非 prod 整站 disallow + noindex；prod 暴露绝对 sitemap URL |
| llms.txt | ✅ | 含 `# Source Commit: <sha>`（v4 §3.3 回读契约） |
| search-records.json | ✅ | schemaVersion/sourceCommit/digest/countsByLocale/tag=locale（v4 §7） |
| 环境契约 | ✅ | 正/负向双 fixture（ci/static + production/algolia）；mismatch/缺失均拒绝构建 |
| out/ 结构 | ✅ | trailing slash 页面 + 无尾斜杠根文件端点 + 404.html + 无 /agents/ 泄漏 |
| html lang 映射 | ✅ | `/zh/` → `lang="zh-CN"`（v4 §5.1） |

## 关键发现（P1 必读）

1. **TS7 兼容性确认**：`experimental.useTypeScriptCli` 是真实配置键且在
   Next 16.3.2 中**默认开启**；显式声明保持与 v4 §4 一致。tsc 7.0.2 的
   报错均为普通类型错误（可修），无工具链不兼容。
2. **fumadocs-mdx 15.3.1 的 vite/rolldown/satteri 全是可选 peer**：Next
   集成路径走 esbuild+unified，依赖图比 peer 声明更轻。
3. **metadata 路由（robots.ts/sitemap.ts）在 `output: 'export'` 下必须显式
   `export const dynamic = 'force-static'`**——v4 §4 预言命中，不能假设自动静态化。
4. **OG 路由末段必须固定 `image.png`**（官方示例 getPageImageUrl 同款）：
   否则 `/og/en/docs`（文件）与 `/og/en/docs/<page>`（目录）在 out/ 复制阶段
   EISDIR 冲突。
5. **EdgeOne 不注入 `SOURCE_COMMIT`**：构建包装器（spike-build.mjs）从
   `git rev-parse HEAD` 推导并导出给 next build——纯 check-env 校验不够，
   构建环境必须真正拿到该值（本次 38 项检查最初 2 项失败的真实根因）。
6. **搜索对话框 v16 API**：`useDocsSearch().query.data` 类型含 `'empty'`
   字面量状态（映射为 `[]` 走空态渲染）；Algolia 过滤必须用 `tag: locale`
   （`locale` 参数不形成 filter，v4 §7.2 与实现一致）；`search-algolia`
   预制组件自带 `showAlgolia`（Powered by，满足 v4 §7.3 免费层归属）。
7. **pnpm 11 行为**：自动生成 `pnpm-workspace.yaml`（minimumReleaseAge
   供应链保护，需将新发布的 fumadocs 包加入 exclude）；`allowBuilds` 拦截
   esbuild postinstall 需显式 `esbuild: true`。
8. **版本 delta（待 EdgeOne 实测关闭）**：本地 Node 24.19.0 vs EdgeOne
   预装 24.18.0（edgeone.json 已钉 24.18.0）；pnpm 11.22.0 本地一致，
   EdgeOne 实际版本须在 Preview 构建日志断言（v4 §6.2）。

## 待办（用户/控制台动作）

- [ ] EdgeOne Makers 建项目连本分支，Root Directory `spike/p0a`，跑 Preview 构建
- [ ] 确认 Global/China 控制面与 Acceleration Region / ICP 约束
- [ ] Preview 构建日志断言 node/pnpm/git 实际版本
- [x] Push 分支 + Draft PR 验证 GitHub Actions 全绿（PR #132 validate ✅ 2026-08-22）
