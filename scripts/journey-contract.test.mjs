import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

test('docs hub exposes both task paths and sends beginners to locale-aligned TIDAS overviews', () => {
  const source = read('components/docs-portal.tsx');

  assert.match(source, /data-docs-portal-map-v2="two-lca-journeys"/);
  assert.match(source, /'lca-study'/);
  assert.match(source, /'data-production'/);
  assert.doesNotMatch(source, /core-modules\/schema\/tidas-schema-(?:intro|validation)/);

  for (const language of ['zh', 'en', 'de', 'fr']) {
    assert.match(source, new RegExp(`tidasHref\\('${language}', 'core-modules'\\)`));
    assert.match(source, new RegExp(`tidasHref\\('${language}', 'tool'\\)`));
  }
});

test('docs hub uses formal task-navigation headings in every locale', () => {
  const source = read('components/docs-portal.tsx');

  assert.match(source, /eyebrow: '文档导航',\n    title: '常见任务指南'/u);
  assert.match(source, /eyebrow: 'Documentation guide',\n    title: 'Guides for common tasks'/u);
  assert.match(source, /eyebrow: 'Dokumentationsübersicht', title: 'Anleitungen für häufige Aufgaben'/u);
  assert.match(source, /eyebrow: 'Guide de la documentation', title: 'Guides pour les tâches courantes'/u);
  assert.doesNotMatch(source, /你想完成什么？按步骤查看说明|What do you want to do\? Follow the steps|Was möchten Sie tun\? Folgen Sie den Schritten|Que souhaitez-vous faire \? Suivez les étapes/u);
  assert.doesNotMatch(source, /任务路径|task paths|Aufgabenpfade/u);
});

test('beginner entry copy uses task language and explains LCA terms in context', () => {
  const home = read('components/docs-home.tsx');
  const portal = read('components/docs-portal.tsx');
  const quickStart = read('components/quick-start-guide.tsx');
  const entryCopy = [
    home,
    portal,
    quickStart,
    read('content/docs/index.mdx'),
    read('content/docs/index.en.mdx'),
    read('content/docs/index.de.mdx'),
    read('content/docs/index.fr.mdx'),
    read('content/docs/quick-start/index.mdx'),
    read('content/docs/quick-start/index.en.mdx'),
    read('content/docs/quick-start/index.de.mdx'),
    read('content/docs/quick-start/index.fr.mdx'),
    read('content/docs/quick-start/demonstrations.mdx'),
    read('content/docs/quick-start/demonstrations.en.mdx'),
    read('content/docs/quick-start/demonstrations.de.mdx'),
    read('content/docs/quick-start/demonstrations.fr.mdx'),
    read('content/docs/user-guide/overview.mdx'),
    read('content/docs/user-guide/overview.en.mdx'),
    read('content/docs/user-guide/overview.de.mdx'),
    read('content/docs/user-guide/overview.fr.mdx'),
  ].join('\n');

  assert.match(home, /你现在想完成什么？/u);
  assert.match(home, /What do you want to do\?/u);
  assert.match(home, /Was möchten Sie tun\?/u);
  assert.match(home, /Que souhaitez-vous faire \?/u);
  assert.doesNotMatch(home, /className="block whitespace-nowrap" data-title-line/u);
  assert.match(portal, /按 TIDAS 格式整理数据/u);
  assert.match(portal, /Organise data in the TIDAS format/u);
  assert.match(portal, /Daten im TIDAS-Format strukturieren/u);
  assert.match(portal, /Structurer les données au format TIDAS/u);
  assert.match(quickStart, /生命周期影响评价（LCIA）/u);
  assert.match(quickStart, /life cycle impact assessment \(LCIA\)/u);

  assert.doesNotMatch(
    entryCopy,
    /先选旅程|两条用户旅程|TIDAS 表达|样例语境|书面观察路线|因子证据|检查定量基础|可解释的 LCIA 证据|数据生产旅程|失败恢复|路线不分叉|Two user journeys|Choose a journey|Recommended journey|data-production journey|TIDAS expression|Written observation route|factor evidence|Failure recovery|route does not branch|Zwei Nutzerreisen|Reise wählen|Datenproduktionsreise|TIDAS-Ausdruck|Schriftliche Beobachtungsroute|Faktornachweise|Deux parcours utilisateurs|Choisissez un parcours|Parcours recommandé|parcours étude|Expression TIDAS|Parcours d'observation écrit|preuves des facteurs/u,
  );

  const glossaryLinks = {
    zh: '[术语与缩写](/zh/docs/overview/glossary/)',
    en: '[Terms and abbreviations](/en/docs/overview/glossary/)',
    de: '[Begriffe und Abkürzungen](/de/docs/overview/glossary/)',
    fr: '[Termes et abréviations](/fr/docs/overview/glossary/)',
  };
  for (const [language, link] of Object.entries(glossaryLinks)) {
    const suffix = language === 'zh' ? '' : `.${language}`;
    assert.match(read(`content/docs/user-guide/overview${suffix}.mdx`), new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u'));
  }
});

test('resource page uses locale-aligned TIDAS documentation links', () => {
  for (const language of ['zh', 'en', 'de', 'fr']) {
    const suffix = language === 'zh' ? '' : `.${language}`;
    const source = read(`content/docs/overview/resources-and-support${suffix}.mdx`);
    assert.match(source, new RegExp(`https://tidas\\.tiangong\\.earth/${language}/docs/`, 'u'));
  }
});

test('all locales publish one central glossary that separates kinds of assurance', () => {
  const variants = [
    ['zh', 'content/docs/overview/glossary.mdx', 'content/docs/overview/meta.json'],
    ['en', 'content/docs/overview/glossary.en.mdx', 'content/docs/overview/meta.en.json'],
    ['de', 'content/docs/overview/glossary.de.mdx', 'content/docs/overview/meta.de.json'],
    ['fr', 'content/docs/overview/glossary.fr.mdx', 'content/docs/overview/meta.fr.json'],
  ];
  const routes = JSON.parse(read('manifests/p0b/site-routes.json')).htmlRoutes;

  for (const [language, glossaryPath, metaPath] of variants) {
    const glossary = read(glossaryPath);
    const meta = JSON.parse(read(metaPath));

    assert.ok(meta.pages.includes('glossary'), `${metaPath} must include glossary`);
    assert.ok(routes.some(({ route }) => route === `/${language}/docs/overview/glossary/`), `${language} glossary must be in the static route contract`);
    assert.match(glossary, /ILCD General Guide/u, glossaryPath);
    assert.match(glossary, /publications\.jrc\.ec\.europa\.eu/u, glossaryPath);
    assert.match(glossary, /TIDAS/u, glossaryPath);
    assert.match(glossary, /LCI/u, glossaryPath);
    assert.match(glossary, /LCIA|ACVI/u, glossaryPath);
    assert.match(glossary, /structure check|Structure check|结构检查|Strukturprüfung|contrôle de structure/u, glossaryPath);
    assert.match(glossary, /review|Review|评审|Prüfung|revue/u, glossaryPath);
    assert.match(glossary, /data quality|Data quality|数据质量|Datenqualität|qualité des données/u, glossaryPath);
    assert.match(glossary, /compliance|Compliance|合规|Konformität|conformité/u, glossaryPath);
  }

  assert.match(read('components/docs-portal.tsx'), /docsHref\('(zh|en|de|fr)', 'overview\/glossary'\)/u);
});

test('quick start is a fixed golden path with prerequisites, sample, completion, and recovery', () => {
  const source = read('components/quick-start-guide.tsx');

  assert.match(source, /data-quick-start-map-v2="golden-path"/);
  assert.match(source, /data-quick-start-prerequisites/);
  assert.match(source, /data-quick-start-sample/);
  assert.match(source, /data-quick-start-recovery/);
  assert.doesNotMatch(source, /data-quick-start-branch/);
  assert.doesNotMatch(source, /choose-first-task/);
  assert.equal((source.match(/code: '0[1-5]'/g) ?? []).length, 20);
});

test('governed copy rejects retired Gate instructions, bare TIDAS origins, and superiority claims', () => {
  const files = [
    ...['zh', 'en', 'de', 'fr'].map((language) =>
      language === 'zh'
        ? 'content/docs/user-guide/create-my-data.mdx'
        : `content/docs/user-guide/create-my-data.${language}.mdx`,
    ),
    ...['zh', 'en', 'de', 'fr'].map((language) =>
      language === 'zh'
        ? 'content/docs/user-guide/search.mdx'
        : `content/docs/user-guide/search.${language}.mdx`,
    ),
    ...['zh', 'en', 'de', 'fr'].map((language) =>
      language === 'zh'
        ? 'content/docs/user-guide/process-analysis.mdx'
        : `content/docs/user-guide/process-analysis.${language}.mdx`,
    ),
    'content/docs/overview/intro.mdx',
    'content/docs/overview/intro.en.mdx',
    'content/docs/overview/intro.de.mdx',
    'content/docs/overview/intro.fr.mdx',
    'content/docs/overview/resources-and-support.mdx',
  ];
  const source = files.map(read).join('\n');

  assert.doesNotMatch(source, /Review submission is queued|提交审核任务已排队|Prüfeinreichung ist in der Warteschlange|soumission en revue est en file|review_submit_job_id|waiting for gate|等待门禁|wartet auf Gate|en attente de contrôle/i);
  assert.doesNotMatch(source, /显著优于|significant advantages|erhebliche Vorteile|avantage significatif/i);
  assert.doesNotMatch(source, /https:\/\/tidas\.tiangong\.earth\/(?:[)#\s]|$)/);
});

test('review guidance keeps synchronous admission separate from the non-blocking diagnostic', () => {
  const variants = [
    ['content/docs/user-guide/data-review.mdx', /直接调用审核提交/u, /不会改变审核状态，也不会阻止/u],
    ['content/docs/user-guide/data-review.en.mdx', /submission directly/u, /do not change review\s+state or block/u],
    ['content/docs/user-guide/data-review.de.mdx', /Prüfeinreichung direkt/u, /ändern den Prüfstatus nicht und blockieren/u],
    ['content/docs/user-guide/data-review.fr.mdx', /commande de revue est appelée directement/u, /ne changent pas l'état de revue et ne bloquent/u],
  ];

  for (const [relativePath, directSubmission, nonBlockingDiagnostic] of variants) {
    const source = read(relativePath);
    assert.match(source, directSubmission, relativePath);
    assert.match(source, nonBlockingDiagnostic, relativePath);
    assert.match(source, /review-admin/u, relativePath);
  }
});
