import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = [{ code: 'zh', suffix: '' }, { code: 'en', suffix: '.en' }, { code: 'de', suffix: '.de' }, { code: 'fr', suffix: '.fr' }];
const sections = {
  cli: ['index', 'getting-started', 'queries', 'data-quality', 'authentication', 'automation', 'publishing', 'maintenance'],
  skills: ['index', 'getting-started', 'first-task', 'catalog', 'safe-workflows', 'troubleshooting'],
  tidas: ['index', 'installation', 'first-package', 'reference'],
};
const read = (relative) => readFileSync(path.join(root, relative), 'utf8');
const page = (section, slug, suffix) => `content/docs/integration/${section}/${slug}${suffix}.mdx`;

test('tool guides have complete, explicitly ordered four-locale sections', () => {
  for (const locale of locales) {
    const integration = JSON.parse(read(`content/docs/integration/meta${locale.suffix}.json`));
    assert.deepEqual(integration.pages.slice(0, 4), ['index', 'cli', 'skills', 'tidas']);
    for (const [section, slugs] of Object.entries(sections)) {
      const meta = JSON.parse(read(`content/docs/integration/${section}/meta${locale.suffix}.json`));
      assert.deepEqual(meta.pages, slugs);
      for (const slug of slugs) {
        const relative = page(section, slug, locale.suffix);
        assert.ok(existsSync(path.join(root, relative)), `missing reader guide: ${relative}`);
        const text = read(relative);
        assert.match(text, /^title: ".+"$/mu, relative);
        assert.match(text, /^description: ".+"$/mu, relative);
        assert.doesNotMatch(text, /\[To be written\]|\bTODO\b|\bTBD\b/u, relative);
      }
      assert.ok(read(page(section, 'index', locale.suffix)).includes(`<CategoryDirectory lang="${locale.code}" category="integration/${section}" />`));
    }
    assert.equal(existsSync(path.join(root, `content/docs/integration/cli${locale.suffix}.mdx`)), false, 'CLI URL has one source, not a compatibility copy');
  }
});

test('CLI first task uses a published login and bounded read with explicit modified-at ordering', () => {
  for (const locale of locales) {
    const text = read(page('cli', 'getting-started', locale.suffix));
    assert.match(text, /@tiangong-lca\/cli@0\.1\.8/u);
    assert.match(text, /tiangong-lca auth status --json/u);
    assert.match(text, /tiangong-lca auth login/u);
    assert.match(text, /tiangong-lca auth doctor-auth --json/u);
    assert.match(text, /process list --state-code 100 --order modified_at\.desc,id\.asc,version\.asc --limit 3 --json/u);
    assert.match(text, /listed_remote_processes/u);
    assert.match(text, /login-required/u);
    assert.doesNotMatch(text, /--commit|--apply|TIANGONG_LCA_OAUTH_CLIENT_ID=/u);
  }
});

test('Skills introduction installs one proven package and distinguishes Codex/OpenClaw paths', () => {
  for (const locale of locales) {
    const setup = read(page('skills', 'getting-started', locale.suffix));
    assert.match(setup, /skills@1\.5\.23 add tiangong-lca\/skills --skill flow-hybrid-search --agent codex --copy --yes/u);
    assert.match(setup, /--agent openclaw --copy --yes/u);
    assert.match(setup, /\.agents\/skills\/flow-hybrid-search/u);
    assert.match(setup, /skills\/flow-hybrid-search/u);
    assert.doesNotMatch(setup, /--all|--global/u);
    const tutorial = read(page('skills', 'first-task', locale.suffix));
    assert.match(tutorial, /run-flow-hybrid-search\.mjs/u);
    assert.match(tutorial, /--dry-run/u);
    assert.match(tutorial, /--json/u);
  }
});

test('local tidas examples use the published native version and do not require platform auth', () => {
  for (const locale of locales) {
    const install = read(page('tidas', 'installation', locale.suffix));
    assert.match(install, /releases\/download\/v0\.2\.1\/install\.sh/u);
    assert.match(install, /install\.sh --version 0\.2\.1/u);
    assert.match(install, /install\.ps1 -Version 0\.2\.1/u);
    for (const target of ['x86_64-unknown-linux-gnu.tar.gz', 'aarch64-unknown-linux-gnu.tar.gz', 'aarch64-apple-darwin.tar.gz', 'x86_64-pc-windows-msvc.zip']) {
      assert.ok(install.includes(target), `${locale.code}: missing supported archive ${target}`);
    }
    assert.doesNotMatch(install, /x86_64-apple-darwin|darwin-x64/u);
    assert.match(install, /Intel/u);
    assert.match(install, /musl/u);
    for (const slug of sections.tidas) assert.doesNotMatch(read(page('tidas', slug, locale.suffix)), /0\.2\.0/u);
    const tutorial = read(page('tidas', 'first-package', locale.suffix));
    assert.match(tutorial, /tidas validate sample --input-format tidas-json/u);
    assert.match(tutorial, /tidas convert sample --output \.\/converted --to ilcd/u);
    assert.match(tutorial, /tidas validate converted\/data --input-format ilcd-xml/u);
    assert.doesNotMatch(tutorial, /auth login|TIDAS_DATABASE_URL|--schema-only/u);
  }
});

test('tutorial JSON examples are parseable and complete shared input assets exist', () => {
  for (const locale of locales) {
    for (const [section, slugs] of Object.entries(sections)) {
      for (const slug of slugs) {
        const relative = page(section, slug, locale.suffix);
        for (const [, block] of read(relative).matchAll(/```json\n([\s\S]*?)```/gu)) {
          assert.doesNotThrow(() => JSON.parse(block), `${relative}: invalid JSON example`);
        }
      }
    }
  }
  const request = JSON.parse(read('public/assets/docs/tool-guides-v1/flow-search.request.json'));
  assert.equal(typeof request.query, 'string');
  assert.ok(request.query.trim());
  const sample = JSON.parse(read('public/assets/docs/tool-guides-v1/demo-flow.json'));
  assert.ok(sample.flowDataSet);
});

test('substantive tool-guide entries remain available to public search and AI discovery', async () => {
  const { isCategoryIndex } = await import('../lib/ia.ts');
  for (const section of Object.keys(sections)) {
    assert.equal(isCategoryIndex(['integration', section]), false, section);
  }
  const verifier = read('scripts/verify-out.mjs');
  assert.doesNotMatch(verifier, /const expectedCounts = \{ zh: 38|llmsEntries !== 152|sitemapCount !== 197/u);
  assert.match(verifier, /tool.guide|toolGuide/iu);
});

test('reader recovery explains immediate exit checks, stderr, and the installed content checkpoint', () => {
  for (const locale of locales) {
    const first = read(page('cli', 'getting-started', locale.suffix));
    assert.ok(first.includes('echo $?'));
    assert.ok(first.includes('$LASTEXITCODE'));
    assert.match(first, /process-errors\.txt/u);
    assert.match(first, /https:\/\/lca\.tiangong\.earth\//u);
    const skills = read(page('skills', 'getting-started', locale.suffix));
    assert.match(skills, /skills\.flow-hybrid-search\.computedHash/u);
    assert.match(skills, /3f682fcb97616cf20b97ee7f70120616e58f9ff2bf65bead54d9728d94da4c59/u);
    const native = read(page('tidas', 'first-package', locale.suffix));
    assert.match(native, /mkdir tidas-practice\ncd tidas-practice/u);
    assert.ok(native.includes('$LASTEXITCODE'));
    assert.doesNotMatch(read(page('cli', 'publishing', locale.suffix)), /tiangong-lca review --help/u);
  }
});

test('German and French search and navigation controls do not silently fall back to English', () => {
  const source = read('lib/layout.shared.tsx');
  for (const [locale, search, open, copy] of [['de', 'Suchen', 'Suche öffnen', 'Text kopieren'], ['fr', 'Rechercher', 'Ouvrir la recherche', 'Copier le texte']]) {
    const block = source.match(new RegExp(`    ${locale}: \\{([\\s\\S]*?)\\n    \\}`))?.[1];
    assert.ok(block, locale);
    assert.ok(block.includes(`'Search(search trigger)': '${search}'`));
    assert.ok(block.includes(`'Search(search dialog)': '${search}'`));
    assert.ok(block.includes(`'Open Search(search trigger)(aria-label)': '${open}'`));
    assert.ok(block.includes(`'Copy Text(code block)(aria-label)': '${copy}'`));
  }
});

test('flow search does not promise output-only filtering from asInput false', () => {
  for (const locale of locales) {
    const query = read(page('cli', 'queries', locale.suffix));
    assert.match(query, /asInput: false/u);
    assert.doesNotMatch(query, /输出方向，不是输入资源|output direction rather than input resources|Ausgaberichtung statt eingehender Ressourcen|direction de sortie, plutôt que les ressources entrantes/u);
  }
});
