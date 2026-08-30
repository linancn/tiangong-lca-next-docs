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
  anchor: 'journey-lca-study' | 'journey-data-production';
}

interface HomeCopy {
  eyebrow: string;
  title: string | readonly [string, string];
  description: string;
  primary: string;
  secondary: string;
  pathsEyebrow: string;
  pathsTitle: string;
  pathsDescription: string;
  openGuide: string;
  paths: HomePath[];
  technicalLabel: string;
  integrationAction: string;
  deploymentAction: string;
  conceptMap: ConceptMapCopy;
}

const copy: Record<Language, HomeCopy> = {
  zh: {
    eyebrow: 'TianGong LCA · 开源生命周期评价平台',
    title: ['查找数据、建立模型并', '计算产品的环境影响'],
    description:
      'TianGong LCA 是一个生命周期评价（LCA）平台。你可以查找过程数据，把生产环节连接成产品系统，并计算气候变化等潜在环境影响。平台帮助组织计算和评审；研究目的、系统边界和最终结论仍需由使用者确定。',
    primary: '完成 10–15 分钟快速开始',
    secondary: '查看全部文档',
    pathsEyebrow: '两类常见任务',
    pathsTitle: '你现在想完成什么？',
    pathsDescription: '选择最接近你当前工作的任务，再按步骤查看需要的方法说明和平台操作。',
    openGuide: '查看操作步骤',
    paths: [
      { title: '分析一个产品的环境影响', description: '说明为什么计算和计算到哪里，准备数据、连接生产环节，再计算和解释结果。', anchor: 'journey-lca-study' },
      { title: '整理并发布一份 LCA 数据', description: '记录数据来源，按 TIDAS 格式整理，检查后提交评审、发布和交换。', anchor: 'journey-data-production' },
    ],
    technicalLabel: '面向开发者与运维',
    integrationAction: '连接 MCP、CLI 与 OpenAPI',
    deploymentAction: '查看私有部署与开发',
    conceptMap: {
      ariaLabel: '生命周期评价概念图：参考数据连接生产过程，形成产品系统并计算环境影响结果。',
      title: '生命周期评价概念图',
      referenceLabel: '参考数据',
      referenceItems: ['过程数据', '基本流', '影响方法'],
      relationsLabel: '过程关系',
      relationItems: ['材料', '电力', '制造'],
      productSystemLabel: '产品系统',
      resultsLabel: '环境影响结果',
      impactLabels: ['气候变化', '资源使用'],
    },
  },
  en: {
    eyebrow: 'TianGong LCA · Open life cycle assessment platform',
    title: 'Find data, build models, and calculate product impacts',
    description:
      'TianGong LCA is a life cycle assessment (LCA) platform. Use it to find process data, connect production activities into a product system, and calculate potential impacts such as climate change. The platform organises calculations and review; practitioners still define the study goal, system boundary, and final conclusions.',
    primary: 'Complete the 10–15 minute Quick Start',
    secondary: 'Browse all documentation',
    pathsEyebrow: 'Two common tasks',
    pathsTitle: 'What do you want to do?',
    pathsDescription: 'Choose the task closest to your work, then follow the method guidance and platform steps.',
    openGuide: 'View the steps',
    paths: [
      { title: 'Assess a product’s environmental impacts', description: 'Define why and how far to calculate, prepare data, connect production activities, then calculate and interpret results.', anchor: 'journey-lca-study' },
      { title: 'Organise and publish LCA data', description: 'Record sources, structure the data in TIDAS, check it, then submit it for review, publication, and exchange.', anchor: 'journey-data-production' },
    ],
    technicalLabel: 'For developers and operators',
    integrationAction: 'Connect MCP, CLI, and OpenAPI',
    deploymentAction: 'View self-hosting and development',
    conceptMap: {
      ariaLabel: 'Life cycle assessment concept map: reference data connects production processes to a product system and environmental-impact results.',
      title: 'Life cycle assessment concept map',
      referenceLabel: 'Reference data',
      referenceItems: ['Process data', 'Elementary flows', 'Impact methods'],
      relationsLabel: 'Process relations',
      relationItems: ['Material', 'Electricity', 'Manufacturing'],
      productSystemLabel: 'Product system',
      resultsLabel: 'Impact results',
      impactLabels: ['Climate change', 'Resource use'],
    },
  },
  de: {
    eyebrow: 'TianGong LCA · Offene Plattform für Ökobilanzen',
    title: 'Daten finden, Modelle erstellen und Umweltwirkungen berechnen',
    description:
      'TianGong LCA ist eine Plattform für Lebenszyklusanalysen (LCA). Sie können Prozessdaten finden, Produktionsschritte zu einem Produktsystem verbinden und potenzielle Umweltwirkungen wie den Klimawandel berechnen. Die Plattform strukturiert Berechnung und Prüfung; Untersuchungsziel, Systemgrenze und Schlussfolgerungen bleiben Aufgabe der Fachperson.',
    primary: 'Schnellstart in 10–15 Minuten',
    secondary: 'Alle Dokumente ansehen',
    pathsEyebrow: 'Zwei häufige Aufgaben',
    pathsTitle: 'Was möchten Sie tun?',
    pathsDescription: 'Wählen Sie die passende Aufgabe und folgen Sie den methodischen Hinweisen und den Schritten in der Plattform.',
    openGuide: 'Schritte ansehen',
    paths: [
      { title: 'Umweltwirkungen eines Produkts untersuchen', description: 'Zweck und Grenzen festlegen, Daten vorbereiten, Produktionsschritte verbinden und Ergebnisse berechnen und auswerten.', anchor: 'journey-lca-study' },
      { title: 'LCA-Daten strukturieren und veröffentlichen', description: 'Quellen festhalten, Daten im TIDAS-Format strukturieren, prüfen und anschließend zur Prüfung und Veröffentlichung einreichen.', anchor: 'journey-data-production' },
    ],
    technicalLabel: 'Für Entwicklung und Betrieb',
    integrationAction: 'MCP, CLI und OpenAPI anbinden',
    deploymentAction: 'Self-Hosting und Entwicklung ansehen',
    conceptMap: {
      ariaLabel: 'Konzeptkarte der Ökobilanz: Referenzdaten verbinden Produktionsprozesse mit dem Produktsystem und den Umweltwirkungsergebnissen.',
      title: 'Konzeptkarte der Ökobilanz',
      referenceLabel: 'Referenzdaten',
      referenceItems: ['Prozessdaten', 'Elementarflüsse', 'Wirkungsmethoden'],
      relationsLabel: 'Prozessbeziehungen',
      relationItems: ['Material', 'Strom', 'Herstellung'],
      productSystemLabel: 'Produktsystem',
      resultsLabel: 'Wirkungsergebnisse',
      impactLabels: ['Klimawandel', 'Ressourcennutzung'],
    },
  },
  fr: {
    eyebrow: 'TianGong LCA · Plateforme ouverte d’analyse du cycle de vie',
    title: 'Trouver des données, construire un modèle et calculer les impacts',
    description:
      'TianGong LCA est une plateforme d’analyse du cycle de vie (ACV). Elle permet de trouver des données de procédé, de relier les étapes de production dans un système de produit et de calculer des impacts potentiels tels que le changement climatique. La plateforme organise le calcul et la revue ; l’objectif, la frontière du système et les conclusions restent à la charge du praticien.',
    primary: 'Démarrage rapide en 10–15 minutes',
    secondary: 'Voir toute la documentation',
    pathsEyebrow: 'Deux tâches courantes',
    pathsTitle: 'Que souhaitez-vous faire ?',
    pathsDescription: 'Choisissez la tâche la plus proche de votre travail, puis suivez les indications méthodologiques et les étapes dans la plateforme.',
    openGuide: 'Voir les étapes',
    paths: [
      { title: 'Évaluer les impacts environnementaux d’un produit', description: 'Définir le but et les limites, préparer les données, relier les étapes de production, puis calculer et interpréter les résultats.', anchor: 'journey-lca-study' },
      { title: 'Structurer et publier des données ACV', description: 'Consigner les sources, structurer les données au format TIDAS, les contrôler, puis les soumettre pour revue et publication.', anchor: 'journey-data-production' },
    ],
    technicalLabel: 'Pour les équipes techniques',
    integrationAction: 'Connecter MCP, la CLI et OpenAPI',
    deploymentAction: 'Voir l’auto-hébergement et le développement',
    conceptMap: {
      ariaLabel: 'Carte conceptuelle de l’ACV : les données de référence relient les procédés de production au système de produit et aux résultats environnementaux.',
      title: 'Carte conceptuelle de l’ACV',
      referenceLabel: 'Données de référence',
      referenceItems: ['Données de procédé', 'Flux élémentaires', 'Méthodes d’impact'],
      relationsLabel: 'Relations de procédé',
      relationItems: ['Matière', 'Électricité', 'Fabrication'],
      productSystemLabel: 'Système de produit',
      resultsLabel: 'Résultats d’impact',
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

export function DocsHome({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];

  return (
    <HomeLayout {...baseOptions(language)}>
      <div className="min-w-0 max-w-full flex-1 overflow-clip text-fd-foreground">
        <section className="border-b border-fd-border bg-fd-background" data-hero-signature="lca-concept-map">
          <div className="atlas-shell grid min-h-[40rem] grid-cols-[minmax(0,1fr)_minmax(28rem,1fr)] items-center gap-[clamp(2rem,4vw,4rem)] py-[clamp(4.5rem,8vw,7rem)] max-[68rem]:grid-cols-1 max-[40rem]:min-h-0 max-[40rem]:gap-12 max-[40rem]:py-12">
            <div className="min-w-0 max-w-[38rem] max-[68rem]:max-w-[48rem]" data-hero-copy>
              <p className="docs-eyebrow">{content.eyebrow}</p>
              <h1 className="m-0 max-w-[14ch] text-[clamp(2.5rem,4.2vw,4rem)] leading-[1.08] font-[560] tracking-[-0.045em] text-balance max-[40rem]:max-w-full max-[40rem]:text-[clamp(2.2rem,10vw,2.8rem)] max-[40rem]:tracking-[-0.04em]" data-controlled-title>
                {Array.isArray(content.title)
                  ? content.title.map((line) => <span className="block" data-title-line key={line}>{line}</span>)
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
                  href={`/${language}/docs/`}
                >
                  {content.secondary}
                </Link>
              </div>
            </div>

            <LcaConceptMap copy={content.conceptMap} />
          </div>
        </section>

        <section className="bg-fd-background py-[clamp(4.5rem,8vw,7rem)]">
          <div className="atlas-shell">
            <div className="mb-10 grid max-w-[48rem] gap-2.5">
              <p className="docs-eyebrow">{content.pathsEyebrow}</p>
              <h2 className="m-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.12] font-[520] tracking-[-0.035em] text-balance">
                {content.pathsTitle}
              </h2>
              <p className="m-0 text-base leading-[1.65] text-fd-muted-foreground">{content.pathsDescription}</p>
            </div>
            <Cards className="grid-cols-2 gap-3 max-[40rem]:grid-cols-1">
              {content.paths.map((path) => (
                <Card
                  className="grid min-h-56 content-start gap-2.5 rounded-[2px] border-fd-border bg-fd-card p-5 text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent max-[40rem]:min-h-48 [&>div:last-child]:self-end [&_h3]:m-0 [&_h3]:text-lg [&_h3]:leading-[1.35] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_p]:m-0! [&_p]:text-sm [&_p]:leading-[1.6] [&_p]:text-fd-muted-foreground"
                  description={path.description}
                  href={`/${language}/docs/#${path.anchor}`}
                  key={path.anchor}
                  title={path.title}
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-fd-primary">
                    {content.openGuide}
                    <Arrow />
                  </span>
                </Card>
              ))}
            </Cards>

            <div className="mt-12 grid grid-cols-[minmax(11rem,1fr)_minmax(0,3fr)] items-start gap-6 border-t border-fd-border pt-5 max-[40rem]:grid-cols-1">
              <p className="m-0 text-xs font-semibold tracking-[0.04em] text-fd-muted-foreground uppercase">{content.technicalLabel}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <Link className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary" href={`/${language}/docs/integration/`}>
                  {content.integrationAction}
                  <Arrow />
                </Link>
                <Link className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary" href={`/${language}/docs/deploy-and-dev/`}>
                  {content.deploymentAction}
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
