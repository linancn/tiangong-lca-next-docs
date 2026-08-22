<!-- markdownlint-disable MD013 -->

# 方案 v4（评审修订稿）：Next.js 16 + Fumadocs 16 + TypeScript 7 静态文档站迁移与 EdgeOne Makers 发布

> 状态：**待 P0A/P0B/P0C 验证，不是实施定稿**
> 评审日期：2026-08-22
> 目标仓库：`tiangong-lca-next-docs`
> 基线 commit：`e44e9b4d12197665265a88713f9ca7a5d52264f5`
> 负责人：P0A 前必须具名指派 Delivery 与 Platform/DNS owner 并验证权限；Search、Docs Governance 与 Workspace Integration owner 最迟在 P0B 指派
> 目标托管：EdgeOne Makers（原 EdgeOne Pages）Global 控制面；若实际项目属于 China 控制面，必须重新核验运行时版本和区域约束。

## 1. 结论与核心修订

从 Docusaurus 迁移到 Next.js/Fumadocs、由 EdgeOne Makers 完成构建和部署，这个方向可行；但 v3 不能按原文实施，主要原因是：

1. `pnpm build && pnpm docs:search:sync` 发生在部署之前，Algolia 与线上发布并不原子。
2. EdgeOne Git 自动部署不会等待独立的 GitHub Actions；只有配置了分支保护和 required checks，Actions 才是进入 `main` 前的真实门禁。
3. 公开内容不是"39 zh + 37 en"：真实公开源是 37 zh + 37 en，另有 2 个内部 agent 治理文档，不能进入 Fumadocs、llms、Context7、sitemap 或 Algolia。
4. v3 在"全新 `/{lang}/docs/...`"与"沿用旧链接"之间摇摆；v4 明确选择全新路由，旧链接不在范围内。
5. 当前 537 行发布 workflow 还维护线上 commit 验证、durable Issue 状态和 Context7 状态，不能只删除 deploy 后就称为"瘦身完成"。
6. main 与 tag workflow 仍包含旧托管发布入口，是 v3 遗漏的第二发布者；EdgeOne 切换前必须彻底移除。
7. `fallbackLanguage: 'en'` 不等于德语、法语已经翻译；将 fallback 页放进 sitemap、hreflang 和搜索会产生重复内容及错误语言结果。
8. Docpact、publication-scope、llms、截图校验和 Context7 都写死了旧目录，治理改造必须发生在搬文件之前，不能留到最后收尾。

v4 采用四条发布原则：

- EdgeOne Makers 只负责可复现的安装、构建和部署，构建过程不写外部生产系统。
- GitHub required checks 负责代码进入 `main` 前的门禁；EdgeOne Preview 负责人工评审，不等同于门禁。
- 生产站成功暴露精确 commit 后，GitHub post-deploy reconciliation 才更新 Algolia、刷新 Context7 并标记发布完成。
- EdgeOne Makers 是唯一托管和构建平台；DNS 操作保持 provider-neutral，只修改 `docs.tiangong.earth` 的目标记录，不把整个域名的 NS 迁移混入 docs 项目。

## 2. 当前基线与迁移清单

以下数字来自上述基线 commit。P0B 必须用该 commit 的干净 checkout 重新生成并提交可审计 manifest；若实施前决定换基线，先更新本文和所有计数，不使用会移动的"当前 main"作为证据：

| 项目 | 当前事实 | v4 要求 |
| --- | ---: | --- |
| 中文公开 Markdown | 37 | 正文语义和实际引用资源全部进入新内容树；路由与锚点按新站重新生成 |
| 英文公开 Markdown | 37 | 与中文页面一一核对 |
| 内部治理 Markdown | 2 | `docs/agents/**`；保留在治理区，禁止进入公开内容源 |
| 中文媒体 | 127 PNG + 3 MP4 | 记录路径、引用者、大小和 SHA-256 |
| 英文媒体 | 122 PNG + 3 MP4 | 解释 5 个中文独有 PNG；只在 hash 相同且语义相同的情况下合并 |
| Docusaurus generated-index | 10 | 提取标题、描述和顺序，按新信息架构生成分类首页 |
| 显式 heading ID | 11 | 识别并移除旧语法，按新页面标题重新生成锚点 |
| 自定义 MDX/JSX | 中英文各 1 个 iframe 演示页 | 转为类型安全且可访问的 `VideoEmbed` |
| llms 公开记录 | 74 | 新生成器仍只包含真实公开页面 |

这里的 10 个 generated-index 是 10 组逻辑分类语义；新站按 locale 发布矩阵渲染，因此不是"总共再加 10 个 HTML"或"74+10 就是总 URL"。分类页进入站点、导航、sitemap 和新 route manifest，但默认标记 `llms: false`、`search: false`，避免把导航摘要与正文重复索引。llms 的 74 是迁移前 zh/en 正文基线；首发若已有 de/fr 真实正文，目标计数按 page×locale manifest 增加。

已观察到旧构建产物中存在 `/agents/**` 页面和 sitemap 条目。v4 将其视为需要同时修复的既有发布范围问题：CI 必须验证 `out/**`、`sitemap.xml`、`llms.txt`、`search-records.json` 和 Context7 配置均不包含 agent、TODO、计划、事故或治理执行材料，并验证新站根本不生成 `/agents/**`。

迁移脚本必须支持 `--dry-run`、冲突检测和幂等重跑，并输出至少包含以下字段的 manifest：

```text
sourcePath, targetPath, locale, public, targetRoute,
publishToSite, publishToSitemap, publishToLlms,
publishToSearch, publishToContext7, sourceHash, targetHash,
referencedAssets[], transformedSyntax[]
```

禁止从本地 ignored 的 `package-lock.json`、旧 `build/` 或 `.docusaurus/` 推导迁移结果。

## 3. 目标、非目标与成功标准

### 3.1 目标

- 使用 Next.js 16 App Router、Fumadocs 16 和 TypeScript 7 输出纯静态 `out/`。
- 支持 `zh`、`en`、`de`、`fr` 四个 locale；de/fr 首发各有经过审核的 landing page，其他页面只索引真实存在且经过审核的翻译。
- EdgeOne Production 发布精确对应 `main` commit；Preview 与 Production 环境、变量和域名隔离。
- 保留现有 llms、Context7、publication-scope、截图资产证据、Docpact 和 durable Issue 状态闭环。
- 新 URL、locale landing、分类页和系统端点由单一 `site-routes.json` 定义；旧 URL 不作为正向路由或兼容验收输入，只进入 greenfield deny 负向验收。
- 生产搜索与站点按 commit 最终一致；失败时可恢复上一 verified 搜索 artifact，且发布状态可见、可重试。
- 首次切换失败时在约定 RTO 内恢复到前一个已验证的新站 EdgeOne deployment `F-1` 和对应搜索 artifact；不恢复旧 Docusaurus 站。

### 3.2 非目标

- 本轮不承诺在 4–8 个工程日内完成人工审核过的 37 页德语和 37 页法语翻译。
- 本轮不把 Algolia 站内搜索等同于 Google/Bing/IndexNow 收录。
- 本轮不把 `tiangong-lca-next` 的 de/fr 文档入口或 workspace submodule 更新混入 docs 仓同一个 PR。
- 本轮不引入 SSR、ISR、Server Actions、运行时 middleware/proxy 或默认 Next Image Optimization。
- 本轮不提供跨托管商灾备；EdgeOne 平台级不可用不在本方案的回滚覆盖范围内。权威 DNS 服务本身的迁移是独立基础设施任务。
- 本轮不保留旧站 bookmark、外部 backlink 或既有搜索排名带来的 URL 权重；旧路径失效是已接受的 greenfield 结果。

### 3.3 可量化成功标准

- 干净 checkout 在本地、GitHub Actions 和真实 EdgeOne Preview 上使用冻结 lockfile 构建成功。
- `next typegen && tsc --noEmit` 和 `next build` 均由 TypeScript 7.0.2 执行并通过。
- 37 zh + 37 en 页面、de/fr landing、10 个分类语义、全部有效媒体，以及 11 处 heading-ID 旧语法的内容级转换通过新内容 manifest 校验；输出锚点由新页面生成。
- `site-routes.json` 中每个新路由均输出到预期静态文件，canonical 唯一，页面使用统一尾斜杠，根文件端点不加尾斜杠。
- Preview 响应含 `noindex`；Production 的 canonical、hreflang、robots 和 sitemap 只列真实语言页面。
- 线上 `/llms.txt` 与 `/search-records.json` 都包含当前生产 commit，且发布完成前会回读验证。
- Algolia 使用无停机替换并等待任务完成；按 locale 的 smoke query 不混搜。
- `/agents/**`、内部文件名和拒绝片段不出现在任何公开产物。
- DNS、证书、搜索或 Context7 任一关键检查失败时，不标记 `docs-publish-complete`。

## 4. 技术栈与版本策略

截至 2026-08-22，已核验的核心运行时直接依赖如下。它们使用精确版本，不能使用 `latest`、`^` 或 `~`。P0A 开始时须重新查询官方发布/安全公告和 npm registry；若已有更新的兼容稳定版，先更新本表并重跑 spike，不能把本评审日期的快照永久当成"latest"。P1 引入的 lint、Playwright、类型包等直接开发依赖也必须在 P0A 确认当日最新兼容稳定版并写入完整 dependency manifest。传递依赖由提交的 `pnpm-lock.yaml` 固定。

| 组件 | 目标版本 | 约束 |
| --- | ---: | --- |
| Node.js | 24.18.0 | 仅在 Global Makers 项目真实 Preview 验证后定稿；China 控制面能力不能从 Global 文档推断 |
| pnpm | 11.22.0 | `packageManager` 只表达目标；P0A 必须证明 EdgeOne 实际执行的精确版本 |
| Next.js | 16.3.2 | 静态导出；启用 TypeScript CLI 路径 |
| React / React DOM | 19.2.8 | 精确版本 |
| TypeScript | 7.0.2 | 硬门禁，不静默回退 TypeScript 6 |
| fumadocs-core / fumadocs-ui | 16.15.0 | UI 与 core 保持同版 |
| fumadocs-mdx | 15.3.1 | npm peer 声明支持 `fumadocs-core ^16.7.0`、Next 15/16；仍须实测完整链路 |
| Tailwind CSS / PostCSS 插件 | 4.3.3 | 精确版本 |
| algoliasearch | 5.57.0 | 浏览器端 `/lite`；写入端只在 post-deploy job 使用 |

建议的关键配置：

```ts
// next.config.ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    useTypeScriptCli: true,
  },
};

export default nextConfig;
```

`experimental.useTypeScriptCli` 不能遗漏：TypeScript 7 不再提供旧的 JavaScript compiler API，Next.js 需要调用项目本地 `tsc` CLI。`typescript.ignoreBuildErrors` 必须保持 `false`。

静态导出的所有动态路由都必须由 `generateStaticParams()` 完整枚举，并设置 `dynamicParams = false`。P0A 应对 sitemap、robots、OG、llms、搜索记录和文档 catch-all 路由逐一验证，不得假设它们会自动静态化。

## 5. URL、locale 与 SEO 契约

### 5.1 Locale 映射

| Fumadocs locale | URL 前缀 | `html lang` | Crowdin code | 首发内容策略 |
| --- | --- | --- | --- | --- |
| `zh` | `/zh/` | `zh-CN` | 源语言 | 37 页完整 |
| `en` | `/en/` | `en` | `en` | 37 页完整 |
| `de` | `/de/` | `de` | `de` | 只发布已翻译并审核的页面 |
| `fr` | `/fr/` | `fr` | `fr` | 只发布已翻译并审核的页面 |

de/fr 首发各自至少包含经过人工审核的 locale landing page。某个深层页面没有目标语言版本时，该 route 不生成，语言切换器将该目标语言标为 unavailable，不导航到其他页面，也不生成隐式英文 fallback 页面。

配置使用：

```ts
defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en', 'de', 'fr'],
  hideLocale: 'never',
  fallbackLanguage: null,
});
```

不使用 `hideLocale: 'default-locale'`：Fumadocs 在 Next.js 中依靠 middleware/proxy 隐藏前缀，而纯静态导出不应依赖该运行时能力。

### 5.2 路由结构

采用全新、明确分层的 URL，不以现有站点路径为约束：

```text
app/page.tsx                              # /：直接渲染静态语言入口
app/[lang]/(home)/page.tsx                # /zh/、/en/、/de/、/fr/
app/[lang]/docs/[[...slug]]/page.tsx      # /{lang}/docs/...
```

搜索使用 Fumadocs dialog，不保留独立 `/search` 页面。页面 canonical 统一使用尾斜杠；`llms.txt`、`robots.txt`、`sitemap.xml`、`deploy-manifest.json` 和搜索记录等根文件端点不加尾斜杠。

现有 10 个 generated-index 只作为标题、描述和信息架构输入，生成新站显式分类页；不继承旧 slug：

```text
overview
quick-start
user-guide
data-collection
data-collection/case-introduction
integration
openapi
deploy-and-dev
faq
changelog
```

### 5.3 新站 route manifest

从新内容树、locale 发布矩阵、分类页和系统端点生成并版本化 `site-routes.json`。manifest 记录 `route`、`locale`、`pageType`、canonical、是否进入 sitemap/llms/search/Context7，以及预期输出文件和 hash。

旧 URL、旧锚点和旧媒体直链不属于目标输出。旧路径没有对应新页面时直接 404；不保留旧路径副本，也不把旧站 sitemap 当成新路由验收输入。迁移脚本可以读取旧内容和导航语义，但目标路径完全由新信息架构决定。

CI 只验证新 manifest 中的路由全部生成、canonical 唯一、locale 隔离、分类页/正文数量准确、系统端点不与文档 catch-all 冲突，以及 `/agents/**` 等内部路径不存在。

另生成只用于负向验收的 `greenfield-deny.json`：在实施前从固定基线一次性收集全部旧页面、全部旧媒体路径和显式 anchor alias，并只排除根 `/`、locale landing、`llms.txt` 等由新站明确重新定义的端点。旧媒体路径无条件进入 deny，不能因新实现碰巧复用而从集合消失。validate 必须证明 `edgeone.json` 没有 `redirects`/`rewrites`，`out/` 没有 deny 路径副本，本地静态服务访问 deny 页面/媒体返回 404 且无 `Location`，生成 DOM/配置没有人为添加旧 anchor alias。该 deny 文件冻结 hash，不能提供旧→新映射。

### 5.4 SEO 规则

- 每个页面的 canonical 指向当前语言的唯一生产 URL。
- `hreflang` 只列真实存在的语言版本；`x-default` 明确指向根语言入口 `/`。
- sitemap 不包含英文 fallback 冒充的 de/fr 页面，也不包含内部或 Preview URL。
- Preview 输出 `robots.txt` 禁止抓取，并设置 `X-Robots-Tag: noindex, nofollow` 或等价页面 metadata。
- Production `robots.txt` 包含绝对的 `https://docs.tiangong.earth/sitemap.xml`。
- IndexNow 若后续采用，作为 post-deploy 独立集成；不假定 EdgeOne Makers 原生提供该能力。

## 6. 构建、部署与发布状态机

### 6.1 PR 与切换后的常规发布时序

```text
PR / branch push
├─ GitHub validate（required check）
│  └─ lint + tests + typegen/tsc + static build + route/publication checks
└─ EdgeOne Preview（并行的评审环境，不是 required check）

main merge（仅 required checks 通过后允许，且仅在 DNS 已切到 Makers 后走此日常流程）
└─ EdgeOne Production Auto Deploy
   └─ 生产域暴露精确 commit
      └─ GitHub post-deploy reconciliation
         ├─ 回读 llms/search-records/sitemap/关键页面并验证 commit
         ├─ 原子替换 Algolia 记录并 smoke test
         ├─ 刷新 Context7
         └─ 标记 docs-publish-complete；任一步失败则 blocked
```

GitHub `main` 分支必须：强制 PR、禁止直推、将 `validate` 设为 required check，并要求分支最新或使用 merge queue。否则"Actions 是门禁"的表述不成立。

EdgeOne Preview 需要在 Environment Management 中显式绑定非生产分支规则并开启 Auto Deploy。官方并未保证 Git 集成会自动把 Preview URL 写回 GitHub PR；评审入口应在 runbook 中写清楚。Preview 如果需要长期稳定地址，应绑定专用 Preview 自定义域，而不是依赖可能短期有效的系统预览链接。

### 6.2 EdgeOne 配置

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "outputDirectory": "out",
  "nodeVersion": "24.18.0"
}
```

`edgeone.json` 只包含上面的安装、构建、输出目录和 Node 配置。`nodeVersion: 24.18.0` 只有在目标确认为 Global 控制面且 P0A 真实构建通过后才能提交。

构建输入使用同一显式契约，脚本不得各自猜测环境：

| 变量 | 约束 |
| --- | --- |
| `SOURCE_COMMIT` | 必须是 40 位 Git SHA；由受验证的平台变量或 `git rev-parse HEAD` 设置，缺失/`unknown` 直接失败 |
| `SOURCE_DATE_EPOCH` | 使用该 commit 的时间戳，避免墙钟 `generatedAt` 破坏同 commit 可复现摘要 |
| `DEPLOY_ENV` | 仅 `ci`、`preview`、`production`；决定 noindex、搜索后端和验证策略 |
| `CANONICAL_ORIGIN` | Production 固定 `https://docs.tiangong.earth`；Preview 使用已登记的 preview origin 或在 noindex 下指向 production canonical |
| `SEARCH_MODE` | `ci/preview=static`，`production=algolia`；与 `DEPLOY_ENV` 不一致时构建失败 |

构建同时生成 `out/deploy-manifest.json`，记录 `sourceCommit`、确定性内容摘要以及 llms、search records、sitemap、robots 和关键页面的 hash。post-deploy 通过该 manifest 证明同一部署，而不是要求每个静态文件都自行嵌入 SHA。Preview 和 Production 的环境变量矩阵在 EdgeOne Environment Management 与 CI fixture 中各验证一次。

reconciliation 另接收显式 `VERIFY_ORIGIN`：P3/首次切换使用已登记的 EdgeOne platform/candidate origin，首次切换 complete 后的日常流程才使用 `https://docs.tiangong.earth`。origin 必须在配置 allowlist 中，并同时验证 deploy manifest 与预期 EdgeOne candidate 身份；不能只凭"碰巧有同一 SHA"推断当前请求来自哪个托管平台。

P0A 必须在 EdgeOne 构建日志中打印并断言：

```bash
node --version
pnpm --version
git rev-parse HEAD
```

若平台未按 `packageManager` 使用精确 pnpm 11.22.0，应在真实 Preview 验证 Corepack/显式安装方案后再定稿；不能把"支持 pnpm 11"写成"必然使用 11.22.0"。不要使用 `.nvmrc` 改 Node，因为 EdgeOne 官方说明这种方式不会同时提供对应预装包管理器。

EdgeOne 新部署会自动使边缘缓存失效，常规发布不增加额外 purge 步骤。

### 6.3 GitHub workflows

将现有发布闭环拆成两个职责明确的 job/workflow：

#### PR `validate`

1. full-history checkout；
2. 安装目标 Node 和精确 pnpm；
3. `pnpm install --frozen-lockfile`；
4. migration/content/route manifest check；
5. Markdown lint + code lint；
6. llms、publication-scope、截图资产单测/校验；
7. `next typegen && tsc --noEmit`；
8. `pnpm build`；
9. 对 `out/` 运行内部内容排除、链接、`site-routes.json`、`greenfield-deny.json`、sitemap、robots、canonical、hreflang 和搜索记录 schema 检查；
10. Playwright 覆盖桌面/移动端、亮/暗色、语言切换、键盘导航和代表性页面视觉回归。

PR concurrency 按 PR 编号隔离，并取消同一 PR 的旧运行。

#### `main` post-deploy reconciliation

保留当前 workflow 中的来源 PR/Issue 解析、`docs-publish-*`、线上 llms commit 回读、Context7 状态、失败 Issue 和 summary；删除全部旧托管凭据检查、部署命令和相关分支。

P3 先以 `workflow_dispatch`/fixture 和 EdgeOne `VERIFY_ORIGIN` 演练此逻辑，不能在 CNAME 尚未指向 Makers 时启用 `main push` 生产域观察。首次 go/no-go 前删除现有 main/tag 旧托管部署 job 和 secrets，再按 §6.4 完成 `F-1`、`F` 与切流；首次切换 complete 后才启用下面的日常 `main push` reconciliation。

流程为：

```text
pending
→ 等待 https://docs.tiangong.earth/llms.txt 暴露目标 GITHUB_SHA
→ 校验关键 URL、sitemap、robots、search-records.json 的同一 SHA
→ Algolia replaceAllObjects + wait + locale smoke query
→ Context7 refresh
→ complete
```

日常状态统一为：`pending → waiting-edgeone → validating-live → syncing-search → refreshing-context7 → complete`。终态另有 `blocked`、`superseded` 和 `rolled-back`。现有 `docs-publish-pending|complete|blocked` label 表达顶层状态，细分 phase、release generation、SHA、证据和恢复命令写入同一 durable Issue/PR comment；不能混用未定义的 `partial`。

main observer 使用单独的串行 concurrency group，`cancel-in-progress: false`。每次 push 分配单调 release generation；轮询阶段若发现当前 `main` 已不是该 SHA，立即以 `superseded` 收口且不执行外部副作用。进入 Algolia/Context7 临界区后，新运行排队，旧运行必须等待远端任务完成；不能用取消 GitHub job 来假装取消已提交的异步操作。

该串行边界不是 main workflow 私有：`main push`、`workflow_dispatch`、首次切换、手工 `reconcile --target-sha`、rollback、retry 和 cleanup 全部必须调用同一 release controller，竞争同一个全局 concurrency group/lease，并用 release generation 做 compare-and-set。任何路径在已提交远端任务达到终态前都不能释放 lease，禁止通过控制台绕过互斥直接写生产索引或 durable 状态。

正常发布在搜索写入前、写入后和标记 complete 前都重新断言 `desired main SHA == live SHA == release SHA`。如果中途已有新站上线，旧运行标记 superseded；下一串行运行负责把索引推进到新 SHA。各阶段 timeout、退避、最大站点领先搜索窗口和升级阈值必须在 P4 演练后写入 runbook，未填写不得进入 DNS go/no-go。

回滚使用显式 recovery CAS，而不是伪装成正常发布：全局 lease 中记录 `{rollbackOf: F, target: F-1, generation: G}`，要求 current main 仍为被冻结的 `F`，且 live 只能处于 `F` 或 `F-1`。只有携带该 tuple 的 `reconcile --target-sha F-1 --rollback-of F --generation G` 可以临时把站点和搜索恢复到 `F-1`。随后必须通过受审 revert/fix 形成新 main commit `R`，让 EdgeOne 与搜索重新部署为 `R`；在 `main == live == index == R` 前保持冻结，rolled-back 不等于 complete。

组合失败也必须收敛：若 release M 因 main 已推进到 N 而 superseded，但 N 随后部署失败、生产仍停在安全的 M，则 N 保持 blocked，并立即以 recovery 模式执行 `reconcile --target-sha M`，用 M 的 artifact 将搜索对齐 live M；若 M artifact/安全证据不可用，则回滚到上一 verified tuple 或关闭搜索。P4 必须演练该分支，不能假设"下一发布一定成功"。

Context7 refresh API 当前只证明请求被接受，并非 commit-specific 完成回执。请求前后都要重新校验 current main/live SHA；若被新 release 取代则以 superseded 收口，由下一运行再次刷新。`complete` 记录 refresh accepted，观察期另用 freshness 检查证明可用性，不伪造不存在的精确 Context7 commit 证明。

EdgeOne `deployment.succeeded/failed` Notification Webhook 可作为更快的成功/失败信号，但其载荷不含 commit SHA、部署 URL或环境名，因此不能替代线上精确 commit 回读。v4 首版不为它新增 Cloud Function；若后续采用，接收端必须验证 Bearer Token，并按 deployment ID/内容摘要幂等。

#### tag workflow

P1 即删除 `.github/workflows/build.yml` 的旧托管 deploy job 和所有相关 secrets，阻止第二发布者。若版本 tag 仍有业务用途，只保留 docpact/lint/typecheck/build 验证并统一改为 Node/pnpm；回滚不依赖该 workflow。

### 6.4 首次 DNS 切换状态机

首次迁移不能使用上面的生产域轮询，因为切 CNAME 前 canonical 域尚未指向 Makers。首次切换只使用两个连续通过全部验收的新站 deployment：`F-1` 作为 rollback candidate，`F` 作为最终 candidate。

| 状态 | Guard / 动作 | 成功下一状态 | 失败状态 |
| --- | --- | --- | --- |
| `rollback-candidate-validated` | 新站 commit `F-1` 在 EdgeOne 通过完整 route/content/search/SEO 验收；保存 deployment ID、构建 artifact 和搜索 artifact | `candidate-deployed` | `blocked` |
| `candidate-deployed` | EdgeOne Production 候选通过平台域或临时自定义域暴露目标 SHA | `candidate-validated` | `blocked` |
| `candidate-validated` | 全量路由、内部内容、SEO、媒体和跨地域 smoke 通过 | `search-staged` | `blocked` |
| `search-staged` | 从 `F` 候选域读取同 SHA 记录，填充新 Algolia 索引并验证；保留 `F-1` 搜索 artifact | `go-no-go` | `blocked` |
| `go-no-go` | main/tag 冻结、具名 owner 签字、`F-1` deployment/搜索 artifact 可恢复、timeout/RTO 已填写 | `dns-switching` | `blocked` |
| `dns-switching` | 在权威 DNS 中只改 `docs` 记录到 Makers | `validating-platform` | `blocked-platform` |
| `validating-platform` | 多探针确认 DNS、TLS 和 EdgeOne identity；本方案不提供跨托管商 fallback | `validating-public` | `blocked-platform` |
| `validating-public` | 生产域稳定暴露 `F`，搜索/关键页/内部范围/llms/sitemap/robots 全绿 | `refreshing-context7` | `rolled-back`（EdgeOne 内恢复 `F-1`） |
| `refreshing-context7` | 为当前 main 请求 Context7 refresh，并记录 API 接受状态 | `complete` | `blocked` |
| `complete` | 解除 main 冻结，进入常规发布状态机和观察期 | — | — |

首次切换期间不得依赖 `main` push observer 去等待尚未切流的生产域。内容/搜索失败在 EdgeOne 内恢复到同一新路由体系的 `F-1` 并重放其搜索 artifact；DNS、TLS 或 EdgeOne 平台级失败进入 `blocked-platform`，这是 EdgeOne-only 方案明确接受的无跨平台回滚风险。旧 Docusaurus 站不参与任何回滚。

### 6.5 Owner、超时与 go/no-go 前置表

Delivery 与 Platform/DNS owner 及真实控制面权限是 P0A 前置门禁；P0B 再把其余角色映射到具名人员。P4 必须填入并演练数值。任何 `TBD` 未关闭时不得切 DNS。

| 项目 | Accountable role | P4 必须产出的证据 |
| --- | --- | --- |
| 整体 go/no-go 与 incident command | Delivery owner | 签字、冻结窗口、升级渠道、break-glass 审计路径 |
| EdgeOne、域名、TLS | Platform/DNS owner | 控制面/区域/ICP、权威 DNS 变更、CAA、跨地域探针、DNS/TLS timeout、EdgeOne 内回滚 RTO |
| Algolia | Search owner | 最小权限 key、task timeout、最大不一致窗口、前后快照和恢复演练 |
| GitHub 分支保护与 environment | Delivery owner | required checks、merge queue/strict branch、串行锁、双人审批 |
| Context7 与 Docpact | Docs Governance owner | refresh 接受/重试语义、freshness 复核、规则验证证据 |
| 产品入口与 workspace 指针 | Product / Integration owner | 独立 Issue/PR、eligible commit、root 集成退出证据 |

P4 的 go/no-go 表至少定义：EdgeOne/live-SHA/Algolia/Context7/DNS 每阶段 timeout 与退避，critical URL 成功率和 5xx/404 阈值，至少三个相关地域的 SHA/TLS 稳定窗口，最大可接受搜索滞后，blocked-age 升级阈值，以及站点、索引、DNS 各自的 RTO/RPO。长期 SEO 排名只做观察项，不作为 3–7 天清理窗口的即时硬门禁。

## 7. Algolia 一致性与权限设计

### 7.1 一致性模型

v4 明确采用"部署后最终一致"，不再声称 EdgeOne 与 Algolia 是数据库事务式原子发布：

1. `pnpm build` 只生成 `out/search-records.json`，不访问 Algolia。
2. 文件包含 `schemaVersion`、`sourceCommit`、由 `SOURCE_DATE_EPOCH` 派生的 `generatedAt`、记录数和内容摘要；同一 commit 重建必须得到同一 digest。
3. 日常 post-deploy job 只有在生产域已暴露同一 `sourceCommit` 后才开始写索引；首次切换则从已验证的 EdgeOne 候选域预填新的 v4 索引。
4. 每个 `search-records-<sha>.json` 都保存为保留期覆盖回滚窗口的 release artifact，并记录上一已验证站点 SHA、索引摘要/记录数和 Context7 状态组成的 release tuple。
5. 使用 Fumadocs `sync()` 将 `DocumentRecord` 展开为段落记录；该实现内部调用 Algolia `replaceAllObjects`。串行等待远端替换完成，不允许后续 release 并发写同一索引。
6. 将 `sourceCommit`、内容摘要和各 locale 计数写入可回读的索引 metadata/sentinel，随后按每个已发布 locale 做查询和 URL smoke test，再标记完成。

失败必须按发生位置区分：提交替换前失败时当前 verified 索引不变；远端任务状态不明时先查询/等待同一幂等操作，不盲目重提；替换已完成但 metadata 或 smoke 失败时，立即用上一已验证 artifact 重新同步对应记录，或按 runbook 暂时关闭搜索。任何一种都标记 blocked，并在站点与索引 commit 再次一致前禁止 complete。

这允许"站点短暂领先搜索"，但不会出现"部署失败、搜索先指向新站"的反向错误。若业务将来要求站点与索引同一瞬间切换，需要另行设计 commit 专属索引并评估 Algolia 索引配额，不在本次范围内。

### 7.2 多语言记录

构建产物中的每个 Fumadocs `DocumentRecord` 至少包含：

```text
_id, title, description, structured, url, tag, extra_data.sourceCommit
```

`_id` 必须包含 locale/URL；Fumadocs 展开段落时会据此生成稳定 `objectID`，避免语言间碰撞。Fumadocs Algolia 客户端应使用 `tag: lang`，而不是只传 `locale: lang`；当前 API 中 `locale` 本身不会自动形成 Algolia filter。

Preview 不得写生产索引，并固定使用 Fumadocs 浏览器本地静态搜索，以便评审 PR 新内容。Production 使用 Algolia；两种后端共享同一个搜索 UI 契约和 locale smoke suite。禁止使用"缺 write key 就静默跳过"掩盖 Production 配置错误。

多语言记录必须单独验证：为 `zh` 与 `en` 各准备一个仅在对应语言出现的独有词（例如产品名与中文专名），索引替换后断言 `zh` 查询不返回 `en` 记录、`en` 查询不返回 `zh` 记录，并抽查 objectID 前缀与 locale 一致。该 smoke 套件在 P3 建立，并作为每次 reconcile 的必跑检查。

### 7.3 密钥

生产搜索配置使用同一版本化 fixture，静态 bundle 与 reconciliation 必须逐项相等：

| 用途 | 变量 | 规则 |
| --- | --- | --- |
| 浏览器 | `NEXT_PUBLIC_ALGOLIA_APP_ID` | 与写入端 app ID 相同，可公开 |
| 浏览器 | `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | 仅 search ACL、限制索引/来源，可公开 |
| 浏览器 | `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | 新站固定 `tiangong-lca-docs` |
| reconciliation | `ALGOLIA_APP_ID` | 必须等于 public app ID |
| reconciliation | `ALGOLIA_INDEX_NAME` | 必须等于 bundle index name；candidate、daily、restore 共用同一契约 |
| reconciliation | `ALGOLIA_WRITE_KEY` | GitHub `production` environment secret，永不进入 EdgeOne/bundle |

`SEARCH_MODE=static` 时所有 Algolia public 变量必须为空；`SEARCH_MODE=algolia` 时缺少或映射不一致立即构建失败。CI 对 preview、`F-1`、candidate `F`、production、restore 五种 fixture 做 schema 与选择测试。

- EdgeOne 构建环境不配置 Algolia write key。
- write key 存在 GitHub `production` environment，只授予经 SDK 实测所需的最小 ACL，并限制到生产索引及 `replaceAllObjects` 所需临时索引。
- 浏览器只使用 search-only key；按索引和允许来源限制。
- 不使用 Algolia Admin key。
- Production 缺 write key 必须阻断 publish complete；Preview 明确不需要 write key。

Algolia attribution 要按实际订阅类型和届时生效的条款核验。Fumadocs 集成指南要求 free tier 展示 logo，而 Algolia PoweredBy 文档明确列出 community/open-source/not-for-profit/DocSearch 计划；在账户条款核清前，首发默认展示 "Search by Algolia"，不得自行省略。

## 8. 内容、导航、媒体与 Crowdin 迁移

### 8.1 内容布局

内容契约采用 dot locale 文件：

```text
content/docs/foo.mdx       # zh 源
content/docs/foo.en.mdx
content/docs/foo.de.mdx
content/docs/foo.fr.mdx
content/docs/meta.json
content/docs/meta.en.json
content/docs/meta.de.json
content/docs/meta.fr.json
```

中文和英文公开页进入 `content/docs/**`；`docs/agents/**` 留在治理区。分类首页使用显式 `index.mdx`，不能依赖 `meta.json` 自动生成可路由页面。

### 8.2 脚本

至少需要四类脚本，而不是笼统的"三个机械脚本"：

1. `inventory`：生成页面、路由、frontmatter、heading ID、媒体和 hash 基线；
2. `migrate`：执行路径、扩展名、frontmatter、heading ID、资源迁移，并把现有 iframe JSX 转为类型安全且可访问的 `VideoEmbed`；
3. `navigation`：生成 locale-aware meta 与 10 个分类首页；
4. `content-check`：确认 37+37 源页面的正文、图片语义和必需 metadata 都被目标页面吸收，并验证新 route manifest、引用资源、媒体 hash 和公开范围；不比较旧/新 URL 或锚点。

源文件在 content-check 全绿前不得删除。所有目标媒体强制进入新 namespace `/assets/docs/<sha256-prefix>/<slugified-name>.<ext>`，相同 hash 可去重；迁移脚本在目标路径等于旧公开路径或生成兼容副本时失败。带空格文件名和 `%20` 引用必须按新规范改名并同步更新目标内容。当前 3 个 MP4 没有 Markdown 引用，按 orphan 记录；经 PR 审核确认无消费者后不进入新公开输出，删除动作和 hash 证据留在迁移记录。5 个中文独有 PNG 按实际引用保留，不强造英文副本。

### 8.3 Crowdin

Crowdin source glob 只匹配无语言后缀的中文源文件，并显式忽略 `*.en.mdx`、`*.de.mdx`、`*.fr.mdx`，避免译文再次被当作 source。translation 模板先用最小 fixture 做 Crowdin dry-run，确认 `%file_name%`/`%file_extension%` 的实际结果后再批量启用。

de/fr 只有经过审核的页面才进入 meta、sitemap、hreflang 和 Algolia。若产品要求首发完整四语，则必须单列 74 个翻译/审核任务并重新估时。

### 8.4 现有验证脚本

以下内容都要随目录模型同步改造并补回归测试：

- `scripts/generate-llms-txt.mjs`
- `scripts/publication-policy.mjs`
- `scripts/check-publication-scope.mjs`
- `scripts/check-screenshots.mjs` 及其单测
- `context7.json`
- `crowdin.yml`
- `AGENTS.md`、repo architecture、repo validation、README、双语 dev-env/docs-product-sync

`check-publication-scope` 不应再因任意 ignored 旧输出目录"存在"就检查它；命令应显式接收当前输出目录或 build manifest，保证本地与 CI 结果可复现。内部内容拒绝清单由版本化的 `publication-policy.mjs` 统一输出给 out-tree、sitemap、llms、搜索和 Context7 检查，测试必须覆盖允许例外，不能在多个脚本里维护含义不同的模糊关键词。

现有截图脚本验证的是嵌入资源和 evidence manifest，不等于浏览器视觉回归。v4 额外增加 Playwright 站点级测试，不能用前者替代后者。

## 9. Docpact 与仓库治理

当前 `.docpact/config.yaml` 的 ownership、coverage、routing 和 rules 都写死了 `docs/**`、`i18n/**`、Docusaurus 配置和旧 workflow。对拟新增的 `app/**`、`lib/**`、`content/docs/**` 路由时当前没有受控匹配。

阶段顺序必须是：

```text
P0a 技术兼容性 spike
P0b URL/内容/资产模型定稿
P0c Docpact governance 路由、所有权、coverage 和规则改造
P1 之后才允许搬文件/落完整骨架
```

P0C 属于 governance-maintainer 工作，应通过 `docpact-governance` 选择对应规则/路由维护流程。P5 中的 Docpact 工作只能做最终文档复核、review evidence 和 freshness 检查，不能承担首次接线。

实现阶段至少运行：

```bash
scripts/docpact validate-config --root . --strict
scripts/docpact lint --root . --base origin/main --head HEAD --mode enforce
```

## 10. 分阶段实施与退出条件

唯一阶段编号是 `P0A → P0B → P0C → P1 → P2 → P3 → P4 → P5`。

进入 P0A 前，必须已具名指派 Delivery 与 Platform/DNS owner、确认真实 EdgeOne 控制面访问权限和 Draft PR/Preview 创建权限；任一缺失时任务保持 preflight blocked，不开始 spike。

### P0A：无生产副作用的兼容性 spike（1–2 工程日）

内容：

- 确认 Global/China 控制面、Acceleration Region、ICP 约束和 Preview/Production 分支配置；
- 在最小官方 Next/Fumadocs static 示例上安装全部目标精确版本；
- 启用 `useTypeScriptCli`，运行 `next typegen && tsc --noEmit && next build`；
- 验证四语言静态参数、VideoEmbed、媒体、OG、robots、sitemap、llms 和搜索记录；
- 在真实 EdgeOne Preview 打印并核对 Node、pnpm 和 Git commit；
- 验证 `out/`、trailing slash、404、Preview noindex 和构建 commit 标记。

P0A 在一个已跟踪 Issue 对应的短期 Draft PR/feature branch 上进行，允许放置最小 spike scaffold 和临时验证 workflow，但不把它当生产骨架合并。EdgeOne Preview 连接该分支；版本、日志、最小复现和结论作为 PR artifact/Issue comment 保存。P1 才建立正式目录和 required workflow。

退出条件：本地、Draft PR Actions、真实 Preview 三端全绿并保存版本/日志证据。TypeScript 7 在最小示例或目标 spike 任一处失败时，先用另一处定位是框架兼容还是项目配置；经时间盒诊断仍不能全链路通过，则 P0A blocked，停止 P0B 之后的实施并提交复现和待用户决策，不静默回退 TS6。

若 Node 24.18.0 或 pnpm 11.22.0 与真实控制面不符，依次验证官方支持的显式安装方式；仍无法满足精确目标时，停止并由 Delivery/Platform owner 请求用户选择"更换控制面/安装方式"或"批准新的精确版本"。实施者不得自行降版。

### P0B：基线、契约与决策登记（0.5–1 工程日）

- 生成 74 个源正文、10 组分类语义、全部媒体、`site-routes.json` 新站 manifest，以及只做负向检查的 `greenfield-deny.json`；
- 固定 page×locale 发布矩阵：zh/en 37 页，de/fr 至少各有审核过的 landing page，其余仅列真实翻译；
- 固定 Preview 使用本地静态搜索；
- 固定根语言入口、`/{lang}/` landing、`/{lang}/docs/...`、分类页和系统端点的 canonical/slash 规则及精确数量；
- 指派 §6.5 的其余具名 owner，关闭控制面、区域、权威 DNS/CAA、tag release、RTO/timeout 采集方法等决策；
- 增加内部内容负向测试。

退出条件：新站 manifest 可重复生成且无歧义，所有 route/content 二选一都已形成 durable decision。

### P0C：Docpact 治理接线（0.5–1 工程日）

- 通过 `docpact-governance` 更新 `app/**`、`lib/**`、`content/docs/**`、新配置和 workflow 的 ownership、coverage、routing 和 rules；
- 更新 AGENTS、架构、验证和发布范围文档；
- 严格验证 config，并用代表 diff 证明新旧路径都能正确路由。

退出条件：所有未来路径被 Docpact 正确路由，governance lint 全绿；之后才允许进入 P1 搬文件。

### P1：骨架、lockfile 与质量门禁（2–3 工程日）

- 落 Next/Fumadocs 静态骨架、精确依赖和干净生成的 `pnpm-lock.yaml`；
- 删除 main/tag workflow 中全部旧托管部署 job、凭据引用和文案，只保留验证与新的 EdgeOne/reconciliation 职责；
- 完成 locale/route/metadata/404/SEO 骨架；
- 加 code lint、route 检查和 Playwright 基线；
- 先迁移少量代表页验证导航、媒体和 MDX。

退出条件：代表性内容在本地和 EdgeOne Preview 全绿，且无服务器依赖。

### P2：内容、导航和媒体迁移（1–3 工程日）

- 迁移 37 zh + 37 en；
- 由具名 Docs Content owner 编写、由语言 reviewer 审核 de/fr landing page；两页是 P2 必选交付，不代表其余 37 页已翻译；
- 生成并核对 10 个分类首页；
- 处理 heading ID、iframe、空格文件名、127/122 PNG 和 3/3 MP4；
- 修复 README/站内坏链；
- 更新 llms、publication-scope、截图和 Context7 范围。

退出条件：content-check、site-routes manifest、build、链接、视觉和公开范围全部通过。

### P3：搜索与 post-deploy reconciliation（1–2 工程日）

- 生成带 commit 的搜索记录；
- 在 EdgeOne Preview/candidate origin 上建立新索引与受限密钥；
- 实现 Fumadocs sync/`replaceAllObjects`、wait、release artifact、locale filter、metadata 和 smoke test；
- 实现首次切换与日常发布两套 reconciliation 状态机，但 DNS 尚不切换。

退出条件：Preview/candidate origin、候选索引和 Issue 证据是同一 feature commit；pre-swap、unknown、post-swap 三类失败均通过恢复演练。此阶段不轮询尚未指向 Makers 的 canonical 域，也不把 feature commit 当最终切换 commit。

### P4：EdgeOne Preview 与生产演练（1–2 工程日）

- 完整跑一次 Preview；
- 验证 Preview noindex、生产变量隔离和系统/自定义域；
- 演练 EdgeOne 构建失败、搜索三类失败、Context7 失败、superseded main push，以及"旧运行 superseded + 后继部署失败"组合分支；
- 演练正常 SHA guard 与 recovery CAS 的 `F → F-1 → R` 全链路，证明临时回滚、搜索恢复和最终 main/live/index 再收敛；
- 填写 §6.5 的 timeout、阈值、owner、RTO/RPO 和最大搜索滞后；
- 删除 main 与 tag 旧托管发布路径和 secrets；
- 所有站点、workflow、runbook 与治理变更获批后，先合并 launch-ready main commit `F-1`，由 EdgeOne 部署并做全量验收；保存其固定 commit/config/artifact 和搜索 artifact，并演练超出平台历史保留窗口后的重建；
- 通过受审的最终发布记录/必要修复形成 main commit `F`，再次完整部署和验收，并从 `F` 重建候选索引后冻结 main。`F-1` 与 `F` 都必须满足同一新路由/搜索契约；`F` 之后任何 docs commit 都使候选失效，必须重跑 P3/P4 链路。

退出条件：runbook 中每个失败分支都有可执行恢复动作和 durable status；首次切换/日常发布状态机、`F-1` rollback、索引 restore 都已演练并记录实际 RTO；最终 commit `F` 的 candidate、索引和证据全绿，go/no-go 表无 TBD。

### P5：切换、跨仓集成与观察期（1–2 工程日 + 观察期）

- 切 `docs` CNAME；
- 生产 smoke、搜索、SEO、llms 和 Context7 回读；
- de/fr landing page 发布并通过 smoke 后，在 `tiangong-lca-next` 的独立必选 PR 开启对应文档入口；
- docs 子仓合并后，在 workspace 单独更新 submodule 指针并完成集成；
- 观察期通过后清理已废弃的托管配置、未引用搜索资源和迁移临时 artifact；保留最近一个已验证的新站 deployment 作为常规回滚点。

退出条件：生产域、Algolia metadata、最终 docs commit 和 workspace gitlink 全部相等；de/fr 产品入口已合并并部署；Context7 refresh/freshness、durable Issue/PR/Project、观察指标和 root integration 均达到终态；清理有批准和销毁证据。

不含完整 de/fr 人工翻译时，各阶段串行合计约 **8–16 个工程日 + 3–7 天观察期**。多人并行只能在 P1 之后缩短日历时间，不能跳过 P0A/P0B/P0C、P4 或 DNS 观察关键路径。完成 P0C 后用真实数据、团队人数和外部权限等待重新估算。

## 11. 验收矩阵

| 维度 | 必须通过的证据 |
| --- | --- |
| 工具链 | 三端 Node/pnpm/TS 实际版本；frozen install；typegen/tsc/build 日志 |
| 内容 | 37+37 source-to-target content-check；de/fr landing；10 组分类语义；媒体 hash/引用 manifest |
| 路由 | `site-routes.json` 全量生成；canonical 唯一；locale 隔离；greenfield deny 中旧页面/媒体 404 且无 `Location`；无旧路径副本/anchor alias；`/agents/**` 不存在 |
| i18n | locale mapping；真实翻译覆盖；无 fallback 伪装；语言切换 |
| SEO | canonical、hreflang、sitemap、robots；Preview noindex |
| 搜索 | schema、commit、count、tag filter、无停机替换、已发布语言 smoke、上一 artifact restore |
| AI 发布 | llms commit；Context7 范围和刷新状态；拒绝片段扫描 |
| UI | 桌面/移动、亮/暗色、键盘、搜索、404、代表页视觉回归 |
| 发布 | required checks；EdgeOne commit；release generation；durable pending/complete/blocked/superseded/rolled-back |
| 回滚 | 新站 `F-1`/上一 deployment 恢复、DNS/证书风险确认、搜索 artifact restore、RTO 演练 |

## 12. 切换与回滚 Runbook

### 12.1 切换前

1. 在 EdgeOne 部署并完整验证新站 rollback candidate `F-1`，记录 deployment ID、可重建 artifact 和搜索 artifact；其路由、locale、内部范围和搜索契约必须与最终 candidate 相同。
2. 确认 EdgeOne Acceleration Region；若包含中国大陆，确认 ICP 备案满足要求。
3. 在 Makers 添加生产自定义域并完成所有权/HTTPS 验证；先用平台域/临时自定义域完成候选全量验收和 v4 搜索索引预填。
4. 至少提前一个当前 TTL 周期降低 `docs` DNS TTL，记录当前记录、CAA/证书状态和变更权限；权威 DNS 平台本身的迁移不属于本 docs runbook。
5. 冻结 `site-routes.json` 与 page×locale manifest；检查 74 个源正文、de/fr landing、分类页、媒体、llms、robots、sitemap、搜索和 Context7。
6. 确认 main required checks、禁止直推、全局 release lock 已生效，main/tag 旧托管部署 job 和 secrets 已删除。
7. 证明最终 eligible main commit `F` 等于 EdgeOne candidate 与候选索引 commit，冻结 main，完成 §6.4 `go-no-go` 的具名审批；未填 timeout/RTO/owner 时不得继续。

### 12.2 切换

1. 在当前权威 DNS 中只把 `docs.tiangong.earth` 的目标记录改为 Makers 提供的值；不在本任务中改整个域名 NS。
2. 等待 DNS/证书生效，回读 EdgeOne 生产 commit。
3. 运行全部新站 route、所有已发布 locale、资源、llms、robots、sitemap 和安全 header smoke test。header 期望来自版本化 policy，至少覆盖 content type、referrer、permissions 和经 Preview report-only 验证的 CSP；不得在切换时临时手写。
4. 验证预填 v4 Algolia 索引仍对应 live SHA，完成 Context7 refresh 后才标记发布完成并解除 main 冻结。

### 12.3 失败处置

| 失败 | 行为 |
| --- | --- |
| 首次候选构建/部署失败 | 不切 DNS、不 promote 搜索；Issue phase 标 blocked |
| 日常 EdgeOne 构建/部署失败 | 保持上一 EdgeOne Production 和索引在线，不改 DNS；Issue phase 标 blocked |
| 首次切流后 live SHA、关键页、内部范围、搜索、llms、sitemap 或 robots 任一应用级验收失败 | 按 recovery CAS 临时恢复 `F-1` deployment/搜索，DNS 保持指向 Makers；随后生成回滚/修复 commit `R` 恢复 SHA 等式，状态 rolled-back，修复后重新生成两个连续全绿 candidate |
| 日常线上 commit 不匹配 | 停止所有 post-deploy 副作用，按 release generation 判定 blocked 或 superseded；不自动改 DNS |
| Algolia 提交前/状态不明/替换后 smoke 失败 | 分别保持当前 verified 索引、等待同一任务、或从上一 release artifact 恢复；统一 blocked，禁止盲目重提 |
| 首次证书/DNS/EdgeOne 平台级失败 | 状态 blocked-platform，由 Platform/DNS owner 升级处理；本 EdgeOne-only 方案没有跨托管商 fallback，不伪称可自动恢复 |
| Context7 失败 | 站点和搜索可保留，但顶层 blocked、phase=`refreshing-context7`，只对当前 main 幂等重试 |
| 内部内容泄漏 | 冻结发布；首次切换恢复新站 `F-1`，日常发布恢复上一 verified EdgeOne deployment，并重放对应搜索 artifact、重新刷新/审计 Context7；禁止只依赖缓存 purge |

### 12.4 回滚与清理

- 回滚前冻结 main 和 reconciliation，选择上一已验证 release tuple；首次应用级故障恢复新站 `F-1`，日常故障恢复上一 EdgeOne Production deployment。DNS/TLS/平台级故障没有跨平台回滚，进入 blocked-platform。
- 手工 EdgeOne rollback 必须在全局 lease 下触发 `reconcile --target-sha <target> --rollback-of <failed> --generation <G>`，按 recovery CAS 恢复对应搜索 artifact 并验证临时 live/index target；随后建立受审 revert/fix commit `R`，完成 `main == live == index == R` 后才解除冻结。不能等待不会发生的 main-push 事件。
- 目标 RTO/RPO 在 P4 演练后填入 go/no-go 表；未演练前不承诺固定分钟数。
- 观察期使用 P4 已批准的数据源和阈值：跨地域 live SHA/TLS、关键 URL/5xx/404、资源错误、搜索 commit/count/locale、Context7 freshness 和 blocked age。SEO 排名只长期观察；即时门禁只看 canonical/hreflang/robots/sitemap/抓取配置。
- 达到观察阈值后，清理已废弃的托管配置、未引用搜索资源和迁移临时 artifact，同时保留最近一个 verified 新站 deployment/搜索 artifact 作为日常回滚点。若 3 天时仍不满足则自动延长至 7 天或进入 blocked，不凭主观"看起来稳定"清理。

## 13. 跨仓交付边界

该改造至少包含三条独立交付记录：

1. `tiangong-lca-next-docs`：框架、内容、CI、EdgeOne、搜索和文档治理；
2. `tiangong-lca-next`：de/fr `documentationUrl` 等产品入口；
3. `lca-workspace`：子模块指针和最终集成验证。

每个拥有实现的仓库都需要独立 Issue/PR。docs 子仓 PR 合并只代表仓库级完成；EdgeOne/Algolia/DNS 验证、产品入口更新和 workspace integration 未完成前，整体交付不能标记完成。

整体交付由 workspace coordination Issue/Project item 作为权威父记录。完成时必须证明：

```text
EdgeOne Production sourceCommit
  == Algolia index metadata sourceCommit
  == tiangong-lca-next-docs 最终 eligible commit
  == lca-workspace 中 tiangong-lca-next-docs gitlink
```

还要证明 de/fr landing page 已由具名 reviewer 审核、产品入口 PR 已合并并部署，且目标 canonical 在上述 docs commit 中存在。观察期修复若产生新的 docs commit，必须重新完成 EdgeOne、索引和 root gitlink 等式后才能关闭父记录。

## 14. 官方依据

- [EdgeOne Makers Build Guide](https://pages.edgeone.ai/document/build-guide)
- [edgeone.json 配置](https://pages.edgeone.ai/document/edgeone-json)
- [EdgeOne Makers Next.js 指南](https://pages.edgeone.ai/document/framework-nextjs)
- [EdgeOne Makers 部署通知](https://pages.edgeone.ai/document/notification)
- [EdgeOne Makers Preview/Production 管理](https://pages.edgeone.ai/document/project-management)
- [EdgeOne Makers 部署记录管理](https://pages.edgeone.ai/document/manage-deploys)
- [EdgeOne Makers 缓存配置](https://pages.edgeone.ai/document/configuring-cache)
- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)
- [Fumadocs 静态构建](https://www.fumadocs.dev/docs/deploying/static)
- [Fumadocs i18n 配置](https://www.fumadocs.dev/docs/headless/internationalization/config)
- [Fumadocs Algolia 集成](https://www.fumadocs.dev/docs/headless/search/algolia)
- [Algolia replaceAllObjects](https://www.algolia.com/doc/libraries/sdk/methods/search/replace-all-objects)
- [Algolia PoweredBy 适用范围](https://www.algolia.com/doc/api-reference/widgets/powered-by/react)
