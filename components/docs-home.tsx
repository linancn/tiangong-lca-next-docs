import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { LcaConceptMap, type ConceptMapCopy } from '@/components/lca-concept-map';
import { baseOptions } from '@/lib/layout.shared';

type Language = 'zh' | 'en' | 'de' | 'fr';

interface HomePath {
  title: string;
  description: string;
  slug: string;
}

interface HomeCopy {
  eyebrow: string;
  title: string;
  titleLines?: readonly [string, string];
  description: string;
  primary: string;
  secondary: string;
  pathsEyebrow: string;
  pathsTitle: string;
  pathsDescription: string;
  openGuide: string;
  paths: HomePath[];
  technicalLabel: string;
  technicalPaths: HomePath[];
  platformAction: string;
  conceptMap: ConceptMapCopy;
}

const copy: Record<Language, HomeCopy> = {
  zh: {
    eyebrow: 'TianGong LCA · 开源生命周期评价平台',
    title: '从数据到模型，完成生命周期评价',
    titleLines: ['从数据到模型，', '完成生命周期评价'],
    description:
      'TianGong LCA 将标准化数据、过程建模、LCIA 计算与团队评审串联起来。文档按真实任务组织，帮助你从查找数据、建立模型一路到理解结果。',
    primary: '从快速入门开始',
    secondary: '浏览任务指南',
    pathsEyebrow: '任务指南',
    pathsTitle: '从要完成的工作开始',
    pathsDescription: '选择一个任务，直接进入对应步骤、界面说明和结果检查。',
    openGuide: '打开指南',
    paths: [
      { title: '查找和使用数据', description: '搜索数据空间，查看数据集，并引用或复制所需记录。', slug: 'user-guide/data' },
      { title: '创建数据与模型', description: '建立流和过程，连接交换，准备可计算的模型。', slug: 'user-guide/create-my-data' },
      { title: '计算和解读 LCIA', description: '运行影响评价，查看过程或模型的结果。', slug: 'user-guide/lcia' },
      { title: '评审与团队协作', description: '提交数据、处理反馈，并在团队数据空间协作。', slug: 'user-guide/data-review' },
    ],
    technicalLabel: '开发与运维指南',
    technicalPaths: [
      {
        title: '将平台接入外部工具',
        description: '了解 AI 助手、命令行工具和其他应用如何连接平台，以及 MCP、CLI、OpenAPI 各自的用途。',
        slug: 'integration',
      },
      {
        title: '私有部署与参与开发',
        description: '了解部署方式、本地开发环境和贡献流程。',
        slug: 'deploy-and-dev',
      },
    ],
    platformAction: '打开 TianGong LCA',
    conceptMap: {
      ariaLabel: '生命周期评价概念图：参考数据连接过程关系，形成产品系统并生成 LCIA 结果。',
      title: '生命周期评价概念图',
      referenceLabel: '参考数据',
      referenceItems: ['过程数据', '基本流', '影响方法'],
      relationsLabel: '过程关系',
      relationItems: ['材料', '电力', '制造'],
      productSystemLabel: '产品系统',
      resultsLabel: 'LCIA 结果',
      impactLabels: ['气候变化', '资源使用'],
    },
  },
  en: {
    eyebrow: 'TianGong LCA · Open life cycle assessment platform',
    title: 'Find data, build models, and complete an LCA',
    description:
      'TianGong LCA brings standardised data, process modelling, LCIA, and team review into one workspace. Follow the documentation by task, from finding data to interpreting results.',
    primary: 'Complete the first steps',
    secondary: 'Browse task guides',
    pathsEyebrow: 'Task guides',
    pathsTitle: 'Start with the task you need to complete',
    pathsDescription: 'Choose a task to open the relevant steps, interface guidance, and result checks.',
    openGuide: 'Open guide',
    paths: [
      { title: 'Find and use data', description: 'Search data spaces, inspect datasets, and reference or copy the records you need.', slug: 'user-guide/data' },
      { title: 'Create data and models', description: 'Build flows and processes, connect exchanges, and prepare a model for assessment.', slug: 'user-guide/create-my-data' },
      { title: 'Calculate and interpret LCIA', description: 'Run impact assessment and read results for processes and models.', slug: 'user-guide/lcia' },
      { title: 'Review and collaborate', description: 'Submit contributions for review, address feedback, and work in team data spaces.', slug: 'user-guide/data-review' },
    ],
    technicalLabel: 'Developer and operations guides',
    technicalPaths: [
      {
        title: 'Connect the platform to external tools',
        description: 'Learn how AI assistants, command-line tools, and other apps connect through MCP, CLI, or OpenAPI.',
        slug: 'integration',
      },
      {
        title: 'Self-host and contribute',
        description: 'Explore self-hosting, local development, and how to contribute.',
        slug: 'deploy-and-dev',
      },
    ],
    platformAction: 'Open TianGong LCA',
    conceptMap: {
      ariaLabel: 'Life cycle assessment concept map: reference data connects process relationships to a product system and LCIA results.',
      title: 'Life cycle assessment concept map',
      referenceLabel: 'Reference data',
      referenceItems: ['Process data', 'Elementary flows', 'Impact methods'],
      relationsLabel: 'Process relations',
      relationItems: ['Material', 'Electricity', 'Manufacturing'],
      productSystemLabel: 'Product system',
      resultsLabel: 'LCIA results',
      impactLabels: ['Climate change', 'Resource use'],
    },
  },
  de: {
    eyebrow: 'TianGong LCA · Offene Plattform für Ökobilanzen',
    title: 'Daten finden, Modelle erstellen und eine Ökobilanz durchführen',
    description:
      'TianGong LCA vereint standardisierte Daten, Prozessmodellierung, Wirkungsabschätzung und Teamprüfung in einem Arbeitsbereich. Folgen Sie der Dokumentation nach Aufgabe – von der Datensuche bis zur Interpretation der Ergebnisse.',
    primary: 'Erste Schritte durchführen',
    secondary: 'Aufgabenguides ansehen',
    pathsEyebrow: 'Aufgabenguides',
    pathsTitle: 'Beginnen Sie mit Ihrer aktuellen Aufgabe',
    pathsDescription: 'Wählen Sie eine Aufgabe, um direkt die passenden Schritte, Bedienhinweise und Ergebniskontrollen zu öffnen.',
    openGuide: 'Guide öffnen',
    paths: [
      { title: 'Daten finden und verwenden', description: 'Datenräume durchsuchen, Datensätze prüfen und benötigte Einträge referenzieren oder kopieren.', slug: 'user-guide/data' },
      { title: 'Daten und Modelle erstellen', description: 'Flüsse und Prozesse anlegen, Austausche verknüpfen und ein berechenbares Modell vorbereiten.', slug: 'user-guide/create-my-data' },
      { title: 'LCIA berechnen und auswerten', description: 'Wirkungsabschätzungen durchführen und Ergebnisse für Prozesse oder Modelle auswerten.', slug: 'user-guide/lcia' },
      { title: 'Prüfen und zusammenarbeiten', description: 'Daten zur Prüfung einreichen, Rückmeldungen bearbeiten und in Team-Datenräumen arbeiten.', slug: 'user-guide/data-review' },
    ],
    technicalLabel: 'Für Entwicklung und Betrieb',
    technicalPaths: [
      {
        title: 'Plattform mit externen Werkzeugen verbinden',
        description: 'Erfahren Sie, wie sich KI-Assistenten, Kommandozeilenwerkzeuge und andere Anwendungen über MCP, CLI oder OpenAPI anbinden lassen.',
        slug: 'integration',
      },
      {
        title: 'Selbst hosten und mitentwickeln',
        description: 'Erfahren Sie mehr über Bereitstellung, lokale Entwicklung und Beiträge.',
        slug: 'deploy-and-dev',
      },
    ],
    platformAction: 'TianGong LCA öffnen',
    conceptMap: {
      ariaLabel: 'Konzeptkarte der Ökobilanz: Referenzdaten verbinden Prozessbeziehungen mit dem Produktsystem und den LCIA-Ergebnissen.',
      title: 'Konzeptkarte der Ökobilanz',
      referenceLabel: 'Referenzdaten',
      referenceItems: ['Prozessdaten', 'Elementarflüsse', 'Wirkungsmethoden'],
      relationsLabel: 'Prozessbeziehungen',
      relationItems: ['Material', 'Strom', 'Herstellung'],
      productSystemLabel: 'Produktsystem',
      resultsLabel: 'LCIA-Ergebnisse',
      impactLabels: ['Klimawandel', 'Ressourcennutzung'],
    },
  },
  fr: {
    eyebrow: 'TianGong LCA · Plateforme ouverte d’analyse du cycle de vie',
    title: 'Trouvez des données, construisez des modèles et réalisez une ACV',
    description:
      'TianGong LCA réunit données normalisées, modélisation de procédés, évaluation des impacts et revue en équipe dans un même espace de travail. Suivez la documentation par tâche, de la recherche de données à l’interprétation des résultats.',
    primary: 'Effectuer les premières étapes',
    secondary: 'Parcourir les guides',
    pathsEyebrow: 'Guides par tâche',
    pathsTitle: 'Commencez par la tâche à accomplir',
    pathsDescription: 'Choisissez une tâche pour accéder directement aux étapes, aux repères d’interface et aux contrôles de résultat.',
    openGuide: 'Ouvrir le guide',
    paths: [
      { title: 'Trouver et utiliser des données', description: 'Recherchez dans les espaces de données, examinez les jeux de données et référencez ou copiez les enregistrements utiles.', slug: 'user-guide/data' },
      { title: 'Créer des données et des modèles', description: 'Créez des flux et des procédés, reliez les échanges et préparez un modèle calculable.', slug: 'user-guide/create-my-data' },
      { title: 'Calculer et interpréter l’ACVI', description: 'Lancez l’évaluation des impacts et interprétez les résultats d’un procédé ou d’un modèle.', slug: 'user-guide/lcia' },
      { title: 'Réviser et collaborer', description: 'Soumettez des données à révision, traitez les retours et travaillez dans les espaces d’équipe.', slug: 'user-guide/data-review' },
    ],
    technicalLabel: 'Guides pour le développement et l’exploitation',
    technicalPaths: [
      {
        title: 'Connecter la plateforme à des outils externes',
        description: 'Découvrez comment connecter des assistants IA, des outils en ligne de commande et d’autres applications via MCP, CLI ou OpenAPI.',
        slug: 'integration',
      },
      {
        title: 'Auto-héberger la plateforme et contribuer',
        description: 'Découvrez le déploiement, le développement local et la façon de contribuer.',
        slug: 'deploy-and-dev',
      },
    ],
    platformAction: 'Ouvrir TianGong LCA',
    conceptMap: {
      ariaLabel: 'Carte conceptuelle de l’ACV : les données de référence relient les relations entre procédés au système de produit et aux résultats d’ACVI.',
      title: 'Carte conceptuelle de l’ACV',
      referenceLabel: 'Données de référence',
      referenceItems: ['Données de procédé', 'Flux élémentaires', 'Méthodes d’impact'],
      relationsLabel: 'Relations de procédé',
      relationItems: ['Matière', 'Électricité', 'Fabrication'],
      productSystemLabel: 'Système de produit',
      resultsLabel: 'Résultats ACVI',
      impactLabels: ['Changement climatique', 'Ressources'],
    },
  },
};

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
      <path d="M8 5H5.75A1.75 1.75 0 0 0 4 6.75v7.5A1.75 1.75 0 0 0 5.75 16h7.5A1.75 1.75 0 0 0 15 14.25V12M11 4h5v5m0-5-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocsHome({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];
  const sharedLayoutOptions = baseOptions(language);
  const homeLayoutOptions = {
    ...sharedLayoutOptions,
    links: [
      ...(sharedLayoutOptions.links ?? []),
      {
        type: 'button' as const,
        text: (
          <span className="inline-flex items-center gap-1.5">
            {content.platformAction}
            <ExternalLinkIcon />
          </span>
        ),
        url: 'https://lca.tiangong.earth/',
        secondary: true,
        external: true,
        active: 'none' as const,
      },
    ],
  };

  return (
    <HomeLayout {...homeLayoutOptions}>
      <div className="min-w-0 max-w-full flex-1 overflow-clip text-fd-foreground">
        <section className="border-b border-fd-border bg-fd-background" data-hero-signature="lca-concept-map">
          <div className="atlas-shell grid min-h-[40rem] grid-cols-[minmax(0,1fr)_minmax(28rem,1fr)] items-center gap-[clamp(2rem,4vw,4rem)] py-[clamp(4.5rem,8vw,7rem)] max-[68rem]:grid-cols-1 max-[40rem]:min-h-0 max-[40rem]:gap-12 max-[40rem]:py-12">
            <div className="min-w-0 max-w-[38rem] max-[68rem]:max-w-[48rem]" data-hero-copy>
              <p className="docs-eyebrow">{content.eyebrow}</p>
              <h1 className="m-0 max-w-[14ch] text-[clamp(2.5rem,4.2vw,4rem)] leading-[1.08] font-[560] tracking-[-0.045em] text-balance max-[40rem]:max-w-full max-[40rem]:text-[clamp(2.2rem,10vw,2.8rem)] max-[40rem]:tracking-[-0.04em]" data-controlled-title>
                {content.titleLines
                  ? content.titleLines.map((line) => <span className="block whitespace-nowrap" data-title-line key={line}>{line}</span>)
                  : content.title}
              </h1>
              <p className="mt-6 mb-0 max-w-[39rem] text-[clamp(1rem,1.35vw,1.125rem)] leading-[1.7] text-fd-muted-foreground">
                {content.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2 max-[40rem]:flex-col max-[40rem]:items-stretch">
                <Link
                  className={`${buttonVariants({ variant: 'primary' })} min-h-12 min-w-[11.5rem] justify-between rounded-[2px] px-4 py-3 text-sm font-medium transition-colors duration-100 hover:bg-[#481c53] active:bg-[#35123e] dark:hover:bg-[#dabdff] dark:active:bg-[#eadbff] max-[40rem]:w-full`}
                  data-primary-action
                  href={`/${language}/docs/quick-start/`}
                >
                  {content.primary}
                  <Arrow />
                </Link>
                <Link
                  className={`${buttonVariants({ variant: 'outline' })} min-h-12 min-w-[11.5rem] justify-between rounded-[2px] border-fd-border bg-transparent px-4 py-3 text-sm font-medium transition-colors duration-100 max-[40rem]:w-full`}
                  href={`/${language}/docs/user-guide/`}
                >
                  {content.secondary}
                </Link>
              </div>
            </div>

            <LcaConceptMap copy={content.conceptMap} />
          </div>
        </section>

        <section className="bg-fd-background pt-[clamp(3.5rem,5.5vw,5rem)] pb-[clamp(4.5rem,8vw,7rem)]">
          <div className="atlas-shell">
            <div className="mb-10 grid max-w-[48rem] gap-2.5">
              <p className="docs-eyebrow">{content.pathsEyebrow}</p>
              <h2 className="m-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.12] font-[520] tracking-[-0.035em] text-balance">
                {content.pathsTitle}
              </h2>
              <p className="m-0 text-base leading-[1.65] text-fd-muted-foreground">{content.pathsDescription}</p>
            </div>
            <Cards className="grid-cols-4 gap-3 max-[68rem]:grid-cols-2 max-[40rem]:grid-cols-1">
              {content.paths.map((path) => (
                <Card
                  className="grid min-h-56 grid-rows-[auto_1fr_auto] content-start gap-2.5 rounded-[2px] border-fd-border bg-fd-card p-5 text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent max-[40rem]:min-h-48 [&_h3]:m-0 [&_h3]:text-lg [&_h3]:leading-[1.35] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_p]:m-0! [&_p]:text-sm [&_p]:leading-[1.6] [&_p]:text-fd-muted-foreground"
                  description={path.description}
                  href={`/${language}/docs/${path.slug}/`}
                  key={path.slug}
                  title={path.title}
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-fd-primary">
                    {content.openGuide}
                    <Arrow />
                  </span>
                </Card>
              ))}
            </Cards>

            <section
              aria-labelledby="technical-guides-title"
              className="mt-8 border-t border-fd-border pt-4"
              data-home-technical
            >
              <h2
                className="m-0 mb-3 text-base leading-6 font-semibold tracking-[-0.01em] text-fd-foreground"
                id="technical-guides-title"
              >
                {content.technicalLabel}
              </h2>
              <Cards className="grid-cols-2 gap-3 max-[40rem]:grid-cols-1 max-[40rem]:auto-rows-fr">
                {content.technicalPaths.map((path) => (
                  <Card
                    className="grid min-h-32 grid-rows-[auto_1fr_auto] content-start gap-2 rounded-[2px] border-fd-border bg-fd-card p-4 text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent max-[40rem]:min-h-0 [&_h3]:m-0 [&_h3]:text-base [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_h3]:tracking-[-0.015em] [&_p]:m-0! [&_p]:text-sm [&_p]:leading-[1.55] [&_p]:text-fd-muted-foreground"
                    data-home-technical-link
                    description={path.description}
                    href={`/${language}/docs/${path.slug}/`}
                    key={path.slug}
                    title={path.title}
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-fd-primary">
                      {content.openGuide}
                      <Arrow />
                    </span>
                  </Card>
                ))}
              </Cards>
            </section>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
