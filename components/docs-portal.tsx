import Link from 'next/link';

type Language = 'zh' | 'en' | 'de' | 'fr';
type Boundary = 'method' | 'platform' | 'specification' | 'shared';

interface TaskStep {
  code: string;
  title: string;
  description: string;
  href: string;
  boundary: Boundary;
}

interface TaskPath {
  code: string;
  title: string;
  description: string;
  ariaLabel: string;
  steps: [TaskStep, TaskStep, TaskStep, TaskStep, TaskStep];
}

interface PortalLink {
  code: string;
  title: string;
  description: string;
  href: string;
}

interface PortalCopy {
  eyebrow: string;
  title: string;
  description: string;
  boundaryLabels: Record<Boundary, string>;
  tasks: [TaskPath, TaskPath];
  referenceEyebrow: string;
  referenceTitle: string;
  referenceDescription: string;
  references: [PortalLink, PortalLink, PortalLink, PortalLink];
}

const tidasHref = (language: Language, slug: string) =>
  `https://tidas.tiangong.earth/${language}/docs/${slug}/`;
const docsHref = (language: Language, slug: string) => `/${language}/docs/${slug}/`;

const copy: Record<Language, PortalCopy> = {
  zh: {
    eyebrow: '文档导航',
    title: '常见任务指南',
    description:
      '以下内容按常见任务分类，汇总相关的方法说明、平台操作和详细文档。首次使用可先阅读“快速开始”；具体界面功能见“用户指南”。',
    boundaryLabels: {
      method: '方法要求',
      platform: '平台操作',
      specification: 'TIDAS 数据格式',
      shared: '平台操作 + 人工判断',
    },
    tasks: [
      {
        code: '任务 01',
        title: '分析一个产品的环境影响',
        description:
          '先说明为什么计算、计算什么和计算到哪里，再准备数据、建立产品系统、计算并解释结果。平台提供数据和计算工具，方法选择与结论仍由研究者负责。',
        ariaLabel: '分析产品环境影响的五个步骤：确定目的与范围、收集并检查数据、建立产品系统、计算环境影响、解释结果并报告。',
        steps: [
          { code: '01', title: '确定目的与范围', description: '说明为什么开展研究、结果给谁用，并确定功能单位和系统边界。', href: docsHref('zh', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: '收集并检查数据', description: '查找过程数据，查看来源以及技术、地区和时间代表性。', href: docsHref('zh', 'user-guide/data'), boundary: 'platform' },
          { code: '03', title: '建立产品系统', description: '连接生产过程及其投入产出，核对基准流和数量关系。', href: docsHref('zh', 'user-guide/create-my-data'), boundary: 'platform' },
          { code: '04', title: '计算环境影响', description: '选择生命周期影响评价（LCIA）方法，查看结果并检查缺失因子。', href: docsHref('zh', 'user-guide/lcia'), boundary: 'platform' },
          { code: '05', title: '解释结果并报告', description: '分析主要贡献和敏感性，说明局限，形成结论和报告。', href: docsHref('zh', 'user-guide/process-analysis'), boundary: 'shared' },
        ],
      },
      {
        code: '任务 02',
        title: '整理并发布一份 LCA 数据',
        description:
          '把一项生产或服务活动的来源、投入、产出和适用范围按统一方式记录，检查后提交评审，让其他人能够查找、理解和复用。',
        ariaLabel: '整理并发布 LCA 数据的五个步骤：记录来源和适用范围、按 TIDAS 格式整理数据、检查文件结构和引用、提交评审并发布、导入导出与复用。',
        steps: [
          { code: '01', title: '记录来源和适用范围', description: '记录原始资料、地区、年份、技术、假设和数据质量说明。', href: docsHref('zh', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: '按 TIDAS 格式整理数据', description: '先了解过程、流、单位和来源怎样按统一结构整理；需要逐字段说明时再进入详细规范。', href: tidasHref('zh', 'core-modules'), boundary: 'specification' },
          { code: '03', title: '检查文件结构和引用', description: '了解工具怎样检查必填内容和引用，以及结构检查不能代替哪些专业判断。', href: tidasHref('zh', 'tool'), boundary: 'specification' },
          { code: '04', title: '提交评审并发布', description: '在平台提交，回应意见；是否通过由评审管理员决定。', href: docsHref('zh', 'user-guide/data-review'), boundary: 'platform' },
          { code: '05', title: '导入、导出与复用', description: '用 TIDAS ZIP 文件导入或导出数据，并查看处理进度。', href: docsHref('zh', 'user-guide/tidas-zip-workflows'), boundary: 'platform' },
        ],
      },
    ],
    referenceEyebrow: '进一步了解',
    referenceTitle: '需要时查看这些说明',
    referenceDescription: '第一次操作、专业术语、具体界面和系统连接分别有独立说明。',
    references: [
      { code: '开始', title: '10–15 分钟快速开始', description: '按五个步骤查看一个公开过程的环境影响结果。', href: docsHref('zh', 'quick-start') },
      { code: '术语', title: '术语与缩写', description: '集中解释 LCA、功能单位、系统边界、LCI、LCIA、评审和数据质量。', href: docsHref('zh', 'overview/glossary') },
      { code: '指南', title: '用户指南', description: '按数据、建模、分析、评审与权限查界面操作。', href: docsHref('zh', 'user-guide') },
      { code: '连接', title: '集成与扩展', description: 'MCP、CLI、OpenAPI 与外部工具入口。', href: docsHref('zh', 'integration') },
    ],
  },
  en: {
    eyebrow: 'Documentation guide',
    title: 'Guides for common tasks',
    description:
      'The guidance below is organized by common task and brings together relevant methodology, platform actions, and detailed documentation. New users can begin with Quick Start; the User Guide explains individual screens.',
    boundaryLabels: { method: 'Method choices', platform: 'Platform action', specification: 'TIDAS data format', shared: 'Platform action + professional judgement' },
    tasks: [
      {
        code: 'TASK 01', title: 'Assess a product’s environmental impacts',
        description: 'Start by defining why you are calculating, what is included, and where the study stops. Then prepare data, build a product system, calculate impacts, and interpret the results. The platform supplies data and calculation tools; practitioners remain responsible for method choices and conclusions.',
        ariaLabel: 'Five steps for assessing a product: define goal and scope, collect and check data, build the product system, calculate environmental impacts, interpret and report.',
        steps: [
          { code: '01', title: 'Define goal and scope', description: 'State why the study is being done and who will use it; define the functional unit and system boundary.', href: docsHref('en', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Collect and check data', description: 'Find process data and check its sources and technological, geographical, and time representativeness.', href: docsHref('en', 'user-guide/data'), boundary: 'platform' },
          { code: '03', title: 'Build the product system', description: 'Connect processes and their inputs and outputs; check reference flows and quantities.', href: docsHref('en', 'user-guide/create-my-data'), boundary: 'platform' },
          { code: '04', title: 'Calculate environmental impacts', description: 'Choose a life cycle impact assessment (LCIA) method, inspect the results, and check for missing factors.', href: docsHref('en', 'user-guide/lcia'), boundary: 'platform' },
          { code: '05', title: 'Interpret and report', description: 'Analyse major contributions and sensitivity, state limitations, and form conclusions and a report.', href: docsHref('en', 'user-guide/process-analysis'), boundary: 'shared' },
        ],
      },
      {
        code: 'TASK 02', title: 'Organise and publish LCA data',
        description: 'Record the sources, inputs, outputs, and intended use of a production or service activity in a consistent form. Check it and submit it for review so others can find, understand, and reuse it.',
        ariaLabel: 'Five steps for organising and publishing LCA data: record sources and intended use, organise data in the TIDAS format, check file structure and references, submit for review and publication, import export and reuse.',
        steps: [
          { code: '01', title: 'Record sources and intended use', description: 'Record original sources, region, year, technology, assumptions, and a data-quality description.', href: docsHref('en', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Organise data in the TIDAS format', description: 'First learn how processes, flows, units, and sources fit into one shared structure; open the field-level specification only when needed.', href: tidasHref('en', 'core-modules'), boundary: 'specification' },
          { code: '03', title: 'Check file structure and references', description: 'Learn what the tools check and which professional judgements still require a person.', href: tidasHref('en', 'tool'), boundary: 'specification' },
          { code: '04', title: 'Submit for review and publication', description: 'Submit in the platform and respond to comments; the review administrator makes the final decision.', href: docsHref('en', 'user-guide/data-review'), boundary: 'platform' },
          { code: '05', title: 'Import, export, and reuse', description: 'Use TIDAS ZIP files to import or export data and view processing progress.', href: docsHref('en', 'user-guide/tidas-zip-workflows'), boundary: 'platform' },
        ],
      },
    ],
    referenceEyebrow: 'Learn more', referenceTitle: 'Open these guides when needed',
    referenceDescription: 'First use, terminology, individual screens, and system connections each have a dedicated guide.',
    references: [
      { code: 'START', title: '10–15 minute Quick Start', description: 'Follow five steps to view the environmental-impact results of one open process.', href: docsHref('en', 'quick-start') },
      { code: 'TERMS', title: 'Terms and abbreviations', description: 'Definitions for LCA, functional unit, system boundary, LCI, LCIA, review, and data quality.', href: docsHref('en', 'overview/glossary') },
      { code: 'GUIDE', title: 'User Guide', description: 'Find interface guidance by data, modelling, analysis, review, and access.', href: docsHref('en', 'user-guide') },
      { code: 'CONNECT', title: 'Integrations and extensions', description: 'MCP, CLI, OpenAPI, and external tool entry points.', href: docsHref('en', 'integration') },
    ],
  },
  de: {
    eyebrow: 'Dokumentationsübersicht', title: 'Anleitungen für häufige Aufgaben',
    description: 'Die folgenden Hinweise sind nach häufigen Aufgaben gegliedert und bündeln methodische Erläuterungen, Aktionen in der Plattform und weiterführende Dokumentation. Für die erste Nutzung empfiehlt sich der Schnellstart; einzelne Ansichten erklärt das Benutzerhandbuch.',
    boundaryLabels: { method: 'Methodische Festlegung', platform: 'Aktion in der Plattform', specification: 'TIDAS-Datenformat', shared: 'Plattform + fachliche Beurteilung' },
    tasks: [
      {
        code: 'AUFGABE 01', title: 'Umweltwirkungen eines Produkts untersuchen',
        description: 'Legen Sie zuerst fest, warum gerechnet wird, was einbezogen wird und wo die Untersuchung endet. Danach bereiten Sie Daten vor, erstellen das Produktsystem, berechnen Wirkungen und werten die Ergebnisse aus. Die Plattform stellt Daten und Rechenwerkzeuge bereit; Methodenwahl und Schlussfolgerungen bleiben in fachlicher Verantwortung.',
        ariaLabel: 'Fünf Schritte zur Untersuchung eines Produkts: Ziel und Untersuchungsrahmen festlegen, Daten sammeln und prüfen, Produktsystem erstellen, Umweltwirkungen berechnen, Ergebnisse auswerten und berichten.',
        steps: [
          { code: '01', title: 'Ziel und Untersuchungsrahmen festlegen', description: 'Zweck und Zielgruppe nennen sowie funktionelle Einheit und Systemgrenze bestimmen.', href: docsHref('de', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Daten sammeln und prüfen', description: 'Prozessdaten finden und Quellen sowie technische, geografische und zeitliche Repräsentativität prüfen.', href: docsHref('de', 'user-guide/data'), boundary: 'platform' },
          { code: '03', title: 'Produktsystem erstellen', description: 'Prozesse mit ihren Inputs und Outputs verbinden; Referenzflüsse und Mengen prüfen.', href: docsHref('de', 'user-guide/create-my-data'), boundary: 'platform' },
          { code: '04', title: 'Umweltwirkungen berechnen', description: 'Eine Methode der Wirkungsabschätzung (LCIA) wählen, Ergebnisse ansehen und fehlende Faktoren prüfen.', href: docsHref('de', 'user-guide/lcia'), boundary: 'platform' },
          { code: '05', title: 'Auswerten und berichten', description: 'Wesentliche Beiträge und Sensitivität untersuchen, Grenzen benennen und Schlussfolgerungen berichten.', href: docsHref('de', 'user-guide/process-analysis'), boundary: 'shared' },
        ],
      },
      {
        code: 'AUFGABE 02', title: 'LCA-Daten strukturieren und veröffentlichen',
        description: 'Erfassen Sie Quellen, Inputs, Outputs und den Anwendungsbereich einer Produktions- oder Dienstleistungsaktivität einheitlich. Prüfen Sie die Daten und reichen Sie sie zur fachlichen Prüfung ein, damit andere sie finden, verstehen und wiederverwenden können.',
        ariaLabel: 'Fünf Schritte zum Strukturieren und Veröffentlichen von LCA-Daten: Quellen und Anwendungsbereich festhalten, Daten im TIDAS-Format strukturieren, Dateistruktur und Verweise prüfen, zur Prüfung und Veröffentlichung einreichen, importieren exportieren und wiederverwenden.',
        steps: [
          { code: '01', title: 'Quellen und Anwendungsbereich festhalten', description: 'Originalquellen, Region, Jahr, Technologie, Annahmen und Datenqualität beschreiben.', href: docsHref('de', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Daten im TIDAS-Format strukturieren', description: 'Zuerst verstehen, wie Prozesse, Flüsse, Einheiten und Quellen in einer gemeinsamen Struktur zusammengehören; Feldregeln erst bei Bedarf öffnen.', href: tidasHref('de', 'core-modules'), boundary: 'specification' },
          { code: '03', title: 'Dateistruktur und Verweise prüfen', description: 'Erfahren, was die Werkzeuge prüfen und welche fachlichen Beurteilungen weiterhin Menschen treffen müssen.', href: tidasHref('de', 'tool'), boundary: 'specification' },
          { code: '04', title: 'Zur Prüfung und Veröffentlichung einreichen', description: 'In der Plattform einreichen und Kommentare beantworten; die Prüfadministration entscheidet abschließend.', href: docsHref('de', 'user-guide/data-review'), boundary: 'platform' },
          { code: '05', title: 'Importieren, exportieren und wiederverwenden', description: 'Daten mit TIDAS-ZIP-Dateien importieren oder exportieren und den Fortschritt ansehen.', href: docsHref('de', 'user-guide/tidas-zip-workflows'), boundary: 'platform' },
        ],
      },
    ],
    referenceEyebrow: 'Mehr erfahren', referenceTitle: 'Diese Anleitungen bei Bedarf öffnen',
    referenceDescription: 'Erste Nutzung, Fachbegriffe, einzelne Ansichten und Systemanbindungen sind getrennt erklärt.',
    references: [
      { code: 'START', title: 'Schnellstart in 10–15 Minuten', description: 'In fünf Schritten die Umweltwirkungsergebnisse eines offenen Prozesses ansehen.', href: docsHref('de', 'quick-start') },
      { code: 'BEGRIFFE', title: 'Begriffe und Abkürzungen', description: 'Erklärungen zu LCA, funktioneller Einheit, Systemgrenze, LCI, LCIA, Prüfung und Datenqualität.', href: docsHref('de', 'overview/glossary') },
      { code: 'GUIDE', title: 'Benutzerhandbuch', description: 'Oberflächenhinweise nach Daten, Modellierung, Analyse, Prüfung und Zugriff.', href: docsHref('de', 'user-guide') },
      { code: 'CONNECT', title: 'Integrationen und Erweiterungen', description: 'Einstiege für MCP, CLI, OpenAPI und externe Werkzeuge.', href: docsHref('de', 'integration') },
    ],
  },
  fr: {
    eyebrow: 'Guide de la documentation', title: 'Guides pour les tâches courantes',
    description: 'Les indications ci-dessous sont organisées par tâche courante et regroupent les explications méthodologiques, les opérations dans la plateforme et la documentation détaillée. Les nouveaux utilisateurs peuvent commencer par le démarrage rapide ; le guide utilisateur décrit les différents écrans.',
    boundaryLabels: { method: 'Choix méthodologique', platform: 'Action dans la plateforme', specification: 'Format de données TIDAS', shared: 'Plateforme + jugement professionnel' },
    tasks: [
      {
        code: 'TÂCHE 01', title: 'Évaluer les impacts environnementaux d’un produit',
        description: 'Commencez par préciser pourquoi vous calculez, ce qui est inclus et où s’arrête l’étude. Préparez ensuite les données, construisez le système de produit, calculez les impacts et interprétez les résultats. La plateforme fournit les données et les outils de calcul ; les choix méthodologiques et les conclusions restent sous la responsabilité du praticien.',
        ariaLabel: 'Cinq étapes pour évaluer un produit : définir les objectifs et le champ, collecter et contrôler les données, construire le système de produit, calculer les impacts environnementaux, interpréter et rédiger le rapport.',
        steps: [
          { code: '01', title: 'Définir les objectifs et le champ', description: 'Préciser pourquoi l’étude est menée et pour qui ; définir l’unité fonctionnelle et la frontière du système.', href: docsHref('fr', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Collecter et contrôler les données', description: 'Trouver des données de procédé et contrôler leurs sources ainsi que leur représentativité technologique, géographique et temporelle.', href: docsHref('fr', 'user-guide/data'), boundary: 'platform' },
          { code: '03', title: 'Construire le système de produit', description: 'Relier les procédés et leurs entrées et sorties ; vérifier les flux de référence et les quantités.', href: docsHref('fr', 'user-guide/create-my-data'), boundary: 'platform' },
          { code: '04', title: 'Calculer les impacts environnementaux', description: 'Choisir une méthode d’évaluation de l’impact du cycle de vie (ACVI), lire les résultats et rechercher les facteurs manquants.', href: docsHref('fr', 'user-guide/lcia'), boundary: 'platform' },
          { code: '05', title: 'Interpréter et rendre compte', description: 'Analyser les contributions principales et la sensibilité, indiquer les limites et formuler les conclusions.', href: docsHref('fr', 'user-guide/process-analysis'), boundary: 'shared' },
        ],
      },
      {
        code: 'TÂCHE 02', title: 'Structurer et publier des données ACV',
        description: 'Consignez de manière cohérente les sources, les entrées, les sorties et le domaine d’utilisation d’une activité de production ou de service. Contrôlez les données puis soumettez-les à la revue pour que d’autres puissent les trouver, les comprendre et les réutiliser.',
        ariaLabel: 'Cinq étapes pour structurer et publier des données ACV : consigner les sources et le domaine d’utilisation, structurer les données au format TIDAS, contrôler la structure du fichier et les références, soumettre pour revue et publication, importer exporter et réutiliser.',
        steps: [
          { code: '01', title: 'Consigner les sources et le domaine d’utilisation', description: 'Décrire les sources d’origine, la région, l’année, la technologie, les hypothèses et la qualité des données.', href: docsHref('fr', 'data-collection/data-collection-instructions'), boundary: 'method' },
          { code: '02', title: 'Structurer les données au format TIDAS', description: 'Comprendre d’abord comment procédés, flux, unités et sources s’organisent dans une structure commune ; consulter les règles de champ au besoin.', href: tidasHref('fr', 'core-modules'), boundary: 'specification' },
          { code: '03', title: 'Contrôler la structure et les références', description: 'Comprendre ce que les outils contrôlent et quels jugements professionnels restent humains.', href: tidasHref('fr', 'tool'), boundary: 'specification' },
          { code: '04', title: 'Soumettre pour revue et publication', description: 'Soumettre dans la plateforme et répondre aux commentaires ; l’administrateur de revue prend la décision finale.', href: docsHref('fr', 'user-guide/data-review'), boundary: 'platform' },
          { code: '05', title: 'Importer, exporter et réutiliser', description: 'Importer ou exporter les données avec des fichiers TIDAS ZIP et consulter l’avancement du traitement.', href: docsHref('fr', 'user-guide/tidas-zip-workflows'), boundary: 'platform' },
        ],
      },
    ],
    referenceEyebrow: 'Pour aller plus loin', referenceTitle: 'Ouvrir ces guides selon le besoin',
    referenceDescription: 'La première utilisation, les termes, les écrans et les connexions système sont expliqués séparément.',
    references: [
      { code: 'DÉBUT', title: 'Démarrage rapide en 10–15 minutes', description: 'Suivre cinq étapes pour voir les résultats environnementaux d’un procédé ouvert.', href: docsHref('fr', 'quick-start') },
      { code: 'TERMES', title: 'Termes et abréviations', description: 'Définitions de l’ACV, de l’unité fonctionnelle, de la frontière, de l’ICV, de l’ACVI, de la revue et de la qualité des données.', href: docsHref('fr', 'overview/glossary') },
      { code: 'GUIDE', title: 'Guide utilisateur', description: 'Trouver l’interface par données, modélisation, analyse, revue et accès.', href: docsHref('fr', 'user-guide') },
      { code: 'CONNECT', title: 'Intégrations et extensions', description: 'Entrées MCP, CLI, OpenAPI et outils externes.', href: docsHref('fr', 'integration') },
    ],
  },
};

function Arrow() {
  return (
    <svg aria-hidden="true" height="16" viewBox="0 0 20 20" width="16">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function TaskLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  const external = href.startsWith('https://');
  return <Link className={className} href={href} {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}>{children}</Link>;
}

export function DocsPortal({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];

  return (
    <div className="not-prose mt-8 grid gap-12 pb-3" data-docs-portal="lca-task-hub">
      <section aria-labelledby="docs-portal-journeys" className="grid gap-6" data-docs-portal-map="lca-task-route" data-docs-portal-map-v2="two-lca-journeys">
        <div className="grid max-w-[48rem] gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.eyebrow}</p>
          <h2 className="m-0 text-2xl leading-tight font-semibold tracking-[-0.025em]" id="docs-portal-journeys">{content.title}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.description}</p>
        </div>
        {content.tasks.map((task, taskIndex) => (
          <article className="rounded-[2px] border border-fd-border bg-fd-muted/25 p-5 max-[40rem]:p-4" data-docs-journey={taskIndex === 0 ? 'lca-study' : 'data-production'} id={taskIndex === 0 ? 'journey-lca-study' : 'journey-data-production'} key={task.code}>
            <div className="mb-5 grid max-w-[48rem] gap-2">
              <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{task.code}</p>
              <h3 className="m-0 text-xl leading-tight font-semibold tracking-[-0.02em]">{task.title}</h3>
              <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{task.description}</p>
            </div>
            <ol aria-label={task.ariaLabel} className="m-0 grid list-none grid-cols-5 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border p-0 max-[58rem]:grid-cols-1">
              {task.steps.map((step) => (
                <li className="m-0 min-w-0 bg-fd-background p-0" key={step.code}>
                  <TaskLink className="group grid min-h-48 content-between gap-5 p-3.5 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent max-[58rem]:min-h-0" href={step.href}>
                    <span className="flex items-center justify-between gap-2 text-xs font-semibold text-fd-primary">{step.code}<Arrow /></span>
                    <span className="grid gap-1.5">
                      <span className="w-fit rounded-[2px] border border-fd-border px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.04em] text-fd-muted-foreground uppercase">{content.boundaryLabels[step.boundary]}</span>
                      <strong className="text-sm leading-snug font-semibold">{step.title}</strong>
                      <span className="text-xs leading-5 text-fd-muted-foreground">{step.description}</span>
                    </span>
                  </TaskLink>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      <section aria-labelledby="docs-portal-reference">
        <div className="mb-5 grid max-w-[43rem] gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.referenceEyebrow}</p>
          <h2 className="m-0 text-xl leading-tight font-semibold tracking-[-0.02em]" id="docs-portal-reference">{content.referenceTitle}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.referenceDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[40rem]:grid-cols-1">
          {content.references.map((item) => (
            <TaskLink className="group grid min-h-28 content-between gap-4 bg-fd-background p-4 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent" href={item.href} key={item.code}>
              <span className="flex items-center justify-between gap-3 text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">{item.code}<Arrow /></span>
              <span className="grid gap-1"><strong className="text-sm font-semibold">{item.title}</strong><span className="text-xs leading-5 text-fd-muted-foreground">{item.description}</span></span>
            </TaskLink>
          ))}
        </div>
      </section>
    </div>
  );
}
