#!/usr/bin/env node
/**
 * P0A spike out/ 结构验证：v4 §3.3/§5.2 契约的机器检查。
 * 用法：DEPLOY_ENV=ci SOURCE_COMMIT=<sha> node scripts/verify-out.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(process.cwd(), 'out');
const errors = [];
const passed = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

if (!fs.existsSync(root)) {
  console.error('[verify-out] FAIL out/ does not exist; run the build first');
  process.exit(1);
}

// 1. 根入口 + 四语言 landing（trailing slash → dir/index.html）
for (const p of ['index.html', 'zh/index.html', 'en/index.html', 'de/index.html', 'fr/index.html']) {
  if (exists(p)) passed.push(`page ${p}`);
  else errors.push(`missing ${p}`);
}

// 2. docs 页面：zh/en 全量 spike 页；de/fr 仅 index（fallbackLanguage: null）
const expectDocs = [
  'zh/docs/index.html',
  'zh/docs/quick-start/index.html',
  'zh/docs/quick-start/install/index.html',
  'zh/docs/video-demo/index.html',
  'en/docs/index.html',
  'en/docs/quick-start/index.html',
  'en/docs/quick-start/install/index.html',
  'en/docs/video-demo/index.html',
  'de/docs/index.html',
  'fr/docs/index.html',
];
for (const p of expectDocs) {
  if (exists(p)) passed.push(`docs ${p}`);
  else errors.push(`missing ${p}`);
}

// 3. de/fr 深层路由必须不存在（fallback 关闭的负向验证）
const mustAbsent = [
  'de/docs/video-demo/index.html',
  'de/docs/quick-start/index.html',
  'de/docs/quick-start/install/index.html',
  'fr/docs/video-demo/index.html',
  'fr/docs/quick-start/index.html',
  'fr/docs/quick-start/install/index.html',
];
for (const p of mustAbsent) {
  if (!exists(p)) passed.push(`absent ${p}`);
  else errors.push(`unexpected fallback page ${p}`);
}

// 4. 根文件端点（plain files，无尾斜杠/目录形态）
for (const p of ['llms.txt', 'robots.txt', 'sitemap.xml', 'search-records.json', 'api/search']) {
  if (exists(p) && fs.statSync(path.join(root, p)).isFile()) passed.push(`endpoint ${p}`);
  else errors.push(`missing file endpoint ${p}`);
}
if (fs.existsSync(path.join(root, 'api/search/index.html'))) {
  errors.push('api/search must not be emitted as a page route');
}

// 5. 404
if (exists('404.html')) passed.push('404.html');
else errors.push('missing 404.html');

// 6. html lang（v4 §5.1：zh → zh-CN）
if (exists('zh/index.html') && read('zh/index.html').includes('lang="zh-CN"')) {
  passed.push('html lang zh-CN');
} else {
  errors.push('zh html lang is not zh-CN');
}
if (exists('de/index.html') && read('de/index.html').includes('lang="de"')) {
  passed.push('html lang de');
} else {
  errors.push('de html lang is not de');
}

// 7. llms.txt 暴露构建 commit
const commit = process.env.SOURCE_COMMIT;
if (commit) {
  if (exists('llms.txt') && read('llms.txt').includes(commit)) passed.push('llms commit');
  else errors.push('llms.txt does not expose SOURCE_COMMIT');
}

// 8. search-records.json 契约（v4 §7.1/§7.2）
if (exists('search-records.json')) {
  const sr = JSON.parse(read('search-records.json'));
  if (sr.sourceCommit !== (commit ?? null)) {
    errors.push(`search-records sourceCommit ${sr.sourceCommit} != ${commit ?? null}`);
  }
  const recomputed = createHash('sha256').update(JSON.stringify(sr.records)).digest('hex');
  if (sr.digest !== `sha256:${recomputed}`) errors.push('search-records digest mismatch');
  if (sr.count !== sr.records.length) errors.push('search-records count mismatch');
  const expectedCounts = { zh: 4, en: 4, de: 1, fr: 1 };
  for (const [lang, count] of Object.entries(expectedCounts)) {
    if (sr.countsByLocale?.[lang] !== count) {
      errors.push(`countsByLocale.${lang} = ${sr.countsByLocale?.[lang]}, expected ${count}`);
    }
  }
  for (const record of sr.records) {
    if (record.tag !== String(record.url).split('/')[1]) {
      errors.push(`record tag/locale mismatch: ${record._id}`);
      break;
    }
  }
  passed.push(`search-records count=${sr.count} counts=${JSON.stringify(sr.countsByLocale)}`);
}

// 9. robots 按环境
const deployEnv = process.env.DEPLOY_ENV ?? 'ci';
if (exists('robots.txt')) {
  const robots = read('robots.txt');
  if (deployEnv !== 'production') {
    if (robots.includes('Disallow: /')) passed.push('robots disallow (non-prod)');
    else errors.push('non-production robots.txt must disallow all');
  } else if (robots.includes('https://docs.tiangong.earth/sitemap.xml')) {
    passed.push('robots sitemap (prod)');
  } else {
    errors.push('production robots.txt missing absolute sitemap URL');
  }
}

// 10. sitemap locale 隔离（不含未发布的 de/fr 深层路由）
if (exists('sitemap.xml')) {
  const sitemap = read('sitemap.xml');
  if (sitemap.includes('/zh/docs/')) passed.push('sitemap zh docs');
  else errors.push('sitemap missing zh docs');
  if (sitemap.includes('/de/docs/video-demo') || sitemap.includes('/de/docs/quick-start')) {
    errors.push('sitemap contains unpublished de routes');
  } else {
    passed.push('sitemap locale isolation');
  }
}

// 11. 非生产 noindex
if (deployEnv !== 'production') {
  const hasNoindex =
    (exists('zh/index.html') && read('zh/index.html').includes('noindex')) ||
    (exists('zh/docs/index.html') && read('zh/docs/index.html').includes('noindex'));
  if (hasNoindex) passed.push('noindex (non-prod)');
  else errors.push('non-production pages missing noindex');
}

// 12. OG 图（10 个文档页 → ≥10 个产物）
if (fs.existsSync(path.join(root, 'og'))) {
  let ogCount = 0;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && !entry.name.endsWith('.html')) ogCount += 1;
    }
  };
  walk(path.join(root, 'og'));
  if (ogCount >= 10) passed.push(`og images (${ogCount})`);
  else errors.push(`expected >=10 OG images, found ${ogCount}`);
} else {
  errors.push('missing og/ output');
}

// 13. 内部路径不得出现（v4 §2：/agents/** 等治理材料禁止进入公开产物）
let leakedAgents = null;
const walkAll = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name.includes('agents')) {
      leakedAgents = path.relative(root, full);
      return;
    }
    if (entry.isDirectory()) walkAll(full);
  }
};
walkAll(root);
if (!leakedAgents) passed.push('no /agents/ leak');
else errors.push(`internal path leaked into out/: ${leakedAgents}`);

// --- summary ---
console.log(`\n[verify-out] ${passed.length} checks passed:`);
for (const p of passed) console.log(`  ✓ ${p}`);
if (errors.length > 0) {
  console.error(`\n[verify-out] ${errors.length} FAILURES:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n[verify-out] ALL GREEN');
