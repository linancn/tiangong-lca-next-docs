import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

type Language = 'zh' | 'en' | 'de' | 'fr';

interface GuideStep {
  code: string;
  title: string;
  description: string;
  outcome: string;
  slug: string;
}

interface RecoveryLink {
  title: string;
  description: string;
  slug: string;
}

interface QuickStartCopy {
  eyebrow: string;
  title: string;
  description: string;
  openApp: string;
  prerequisitesTitle: string;
  prerequisites: [string, string, string];
  sampleLabel: string;
  sampleTitle: string;
  sampleDescription: string;
  sampleAction: string;
  routeAriaLabel: string;
  outcomeLabel: string;
  openStep: string;
  steps: [GuideStep, GuideStep, GuideStep, GuideStep, GuideStep];
  completionTitle: string;
  completionDescription: string;
  completion: [string, string, string];
  recoveryTitle: string;
  recoveryDescription: string;
  recovery: [RecoveryLink, RecoveryLink, RecoveryLink];
  videoLabel: string;
  videoDescription: string;
}

const copy: Record<Language, QuickStartCopy> = {
  zh: {
    eyebrow: '第一次使用 · 约 10–15 分钟',
    title: '第一次使用：查看一个公开过程的环境影响结果',
    description:
      '你不需要第一次就创建数据。按顺序完成五步：登录、了解示例来源、找到一个过程、查看它按什么数量计算，再查看生命周期影响评价（LCIA）结果。LCIA 用来把资源使用和排放换算成气候变化等潜在环境影响指标。',
    openApp: '打开 TianGong LCA',
    prerequisitesTitle: '开始前准备',
    prerequisites: ['一个可登录的 TianGong LCA 账号', '约 10–15 分钟连续时间', '允许使用任一可见的开放过程；没有完全同名结果时无需中断'],
    sampleLabel: '示例说明',
    sampleTitle: '甲醇生产文献示例',
    sampleDescription: '论文是示例的参考来源；平台中的过程数据可以与其他过程连接成产品系统，再用于计算环境影响。这个示例不复现论文结论，也不提供可直接导入的数据包。',
    sampleAction: '查看示例说明',
    routeAriaLabel: 'TianGong LCA 十到十五分钟入门步骤：登录、了解示例来源、查找过程、查看过程的计算数量、查看生命周期影响评价结果。',
    outcomeLabel: '本步完成标志',
    openStep: '查看操作说明',
    steps: [
      { code: '01', title: '登录平台', description: '注册、验证邮箱，或用已有账号进入平台首页。', outcome: '能看到平台首页和数据入口', slug: 'quick-start/first-login' },
      { code: '02', title: '查看示例来源', description: '打开甲醇示例，区分参考论文、演示步骤和平台中实际存在的数据。', outcome: '能说出示例来源，并知道本示例不复现论文结论', slug: 'quick-start/demonstrations' },
      { code: '03', title: '找到一个开放过程', description: '进入开放数据的过程列表，搜索“methanol”；没有精确结果时选择任一可见过程。', outcome: '已打开一个过程详情页', slug: 'user-guide/data' },
      { code: '04', title: '查看这个过程按什么数量计算', description: '找到基准流、基准数量和投入产出。基准流是该过程的主要产品或服务；它不等于整项研究用来比较的功能单位。', outcome: '能指出该过程的基准流和基准数量', slug: 'user-guide/data-use' },
      { code: '05', title: '查看生命周期影响评价（LCIA）结果', description: '打开一个可用结果，记录所用方法和覆盖状态。缺失因子表示有些流尚未计算，不表示环境影响为零。', outcome: '能记录一条结果、所用方法和覆盖状态', slug: 'user-guide/lcia' },
    ],
    completionTitle: '完成标准',
    completionDescription: '满足以下三点，即完成快速开始；创建、评审和发布数据属于后续任务。',
    completion: ['打开并识别了一个过程数据集', '区分了过程基准流与研究功能单位', '查看结果时同时检查了 LCIA 方法与覆盖状态'],
    recoveryTitle: '遇到问题怎么办',
    recoveryDescription: '先解决当前一步，再继续下一步，不需要重新开始。',
    recovery: [
      { title: '无法登录', description: '检查邮箱验证、账号设置和浏览器会话。', slug: 'user-guide/account-profile' },
      { title: '找不到 methanol', description: '清除筛选或选择任一可见开放过程继续。', slug: 'user-guide/search' },
      { title: '没有可查看的 LCIA', description: '换一个有结果的过程，并用 LCIA 指南核对方法和覆盖状态。', slug: 'faq' },
    ],
    videoLabel: '可选视频',
    videoDescription: '视频只是书面步骤的补充；没有播放条件也能完成全部步骤。',
  },
  en: {
    eyebrow: 'First use · about 10–15 minutes',
    title: 'First use: view the environmental-impact results of one open process',
    description: 'You do not need to create data in your first session. Complete five steps in order: sign in, review the example source, find a process, see what quantity it represents, and view life cycle impact assessment (LCIA) results. LCIA converts resource use and emissions into indicators for potential impacts such as climate change.',
    openApp: 'Open TianGong LCA',
    prerequisitesTitle: 'Before you start',
    prerequisites: ['A TianGong LCA account that can sign in', 'About 10–15 uninterrupted minutes', 'Permission to use any visible open process; an exact sample-name match is not required'],
    sampleLabel: 'Example explained', sampleTitle: 'Methanol-production literature example',
    sampleDescription: 'The paper is the reference source for the example. Process data in the platform can be linked to other processes to form a product system and calculate environmental impacts. The example does not reproduce the paper’s conclusions or provide an import-ready package.',
    sampleAction: 'Review the example notes',
    routeAriaLabel: 'TianGong LCA first-use steps: sign in, review the example source, find a process, see what quantity the process represents, and view life cycle impact assessment results.',
    outcomeLabel: 'Done when', openStep: 'Open instructions',
    steps: [
      { code: '01', title: 'Sign in', description: 'Register and verify your email, or enter with an existing account.', outcome: 'You can see the platform home and data entry points', slug: 'quick-start/first-login' },
      { code: '02', title: 'Review the example source', description: 'Open the methanol example and distinguish the reference paper, demonstration steps, and data that actually exists in the platform.', outcome: 'You can name the source and explain that the example does not reproduce its conclusions', slug: 'quick-start/demonstrations' },
      { code: '03', title: 'Find one open process', description: 'Open the Process list in Open Data and search for “methanol”; if there is no exact match, choose any visible process.', outcome: 'One process detail page is open', slug: 'user-guide/data' },
      { code: '04', title: 'See what quantity the process represents', description: 'Find the reference flow, reference quantity, inputs, and outputs. The reference flow is the process’s main product or service; it is not the functional unit used to compare a whole study.', outcome: 'You can identify the process reference flow and quantity', slug: 'user-guide/data-use' },
      { code: '05', title: 'View life cycle impact assessment (LCIA) results', description: 'Open one available result and record its method and coverage state. A missing factor means some flows were not calculated; it does not mean zero impact.', outcome: 'You recorded one result, its method, and its coverage state', slug: 'user-guide/lcia' },
    ],
    completionTitle: 'Completion criteria',
    completionDescription: 'You have completed Quick Start when all three are true. Creating, reviewing, and publishing data are later tasks.',
    completion: ['You opened and identified one process dataset', 'You distinguished its reference flow from a study functional unit', 'You checked the LCIA method and coverage alongside the result'],
    recoveryTitle: 'If something goes wrong', recoveryDescription: 'Resolve the current step, then continue with the next number. You do not need to start over.',
    recovery: [
      { title: 'Cannot sign in', description: 'Check email verification, account settings, and the browser session.', slug: 'user-guide/account-profile' },
      { title: 'No methanol result', description: 'Clear filters or choose any visible open process and continue.', slug: 'user-guide/search' },
      { title: 'No LCIA to inspect', description: 'Choose a process with results and use the LCIA guide to check the method and coverage state.', slug: 'faq' },
    ],
    videoLabel: 'Optional video', videoDescription: 'The video supplements the written steps; playback is not required to complete them.',
  },
  de: {
    eyebrow: 'Erste Nutzung · etwa 10–15 Minuten', title: 'Erste Nutzung: Umweltwirkungsergebnisse eines offenen Prozesses ansehen',
    description: 'In der ersten Sitzung müssen Sie keine Daten erstellen. Folgen Sie fünf Schritten: anmelden, Beispielquelle ansehen, Prozess finden, Bezugsmenge verstehen und Ergebnisse der Wirkungsabschätzung (LCIA) ansehen. Die LCIA rechnet Ressourcennutzung und Emissionen in Indikatoren für potenzielle Wirkungen wie den Klimawandel um.',
    openApp: 'TianGong LCA öffnen', prerequisitesTitle: 'Vor dem Start',
    prerequisites: ['Ein nutzbares TianGong-LCA-Konto', 'Etwa 10–15 ungestörte Minuten', 'Ein beliebiger sichtbarer offener Prozess genügt; ein exakter Beispieltreffer ist nicht nötig'],
    sampleLabel: 'Beispiel erklärt', sampleTitle: 'Literaturbeispiel Methanolproduktion',
    sampleDescription: 'Die Veröffentlichung ist die Referenzquelle des Beispiels. Prozessdaten in der Plattform lassen sich zu einem Produktsystem verbinden und für die Berechnung von Umweltwirkungen verwenden. Das Beispiel reproduziert weder die Schlussfolgerungen der Veröffentlichung noch liefert es ein importfertiges Paket.',
    sampleAction: 'Hinweise zum Beispiel lesen',
    routeAriaLabel: 'TianGong-LCA-Einstieg: anmelden, Beispielquelle ansehen, Prozess finden, Bezugsmenge verstehen und Ergebnisse der Wirkungsabschätzung ansehen.',
    outcomeLabel: 'Abgeschlossen, wenn', openStep: 'Anleitung öffnen',
    steps: [
      { code: '01', title: 'Anmelden', description: 'Registrieren und E-Mail bestätigen oder mit vorhandenem Konto anmelden.', outcome: 'Plattformstart und Dateneinstiege sind sichtbar', slug: 'quick-start/first-login' },
      { code: '02', title: 'Quelle des Beispiels ansehen', description: 'Das Methanolbeispiel öffnen und Referenzpublikation, Demonstrationsschritte und tatsächlich vorhandene Plattformdaten unterscheiden.', outcome: 'Quelle und Grenzen des Beispiels können erklärt werden', slug: 'quick-start/demonstrations' },
      { code: '03', title: 'Einen offenen Prozess finden', description: 'In Offene Daten nach „methanol“ suchen; ohne exakten Treffer einen sichtbaren Prozess wählen.', outcome: 'Eine Prozessdetailseite ist geöffnet', slug: 'user-guide/data' },
      { code: '04', title: 'Verstehen, für welche Menge der Prozess gilt', description: 'Referenzfluss, Referenzmenge, Inputs und Outputs finden. Der Referenzfluss ist das Hauptprodukt oder die Dienstleistung des Prozesses; er ist nicht die funktionelle Einheit zum Vergleich einer ganzen Studie.', outcome: 'Referenzfluss und Referenzmenge können gezeigt werden', slug: 'user-guide/data-use' },
      { code: '05', title: 'Ergebnisse der Wirkungsabschätzung (LCIA) ansehen', description: 'Ein verfügbares Ergebnis öffnen und Methode und Abdeckung notieren. Fehlende Faktoren bedeuten, dass einige Flüsse nicht berechnet wurden, nicht dass die Wirkung null ist.', outcome: 'Ein Ergebnis mit Methode und Abdeckung ist notiert', slug: 'user-guide/lcia' },
    ],
    completionTitle: 'Abschlusskriterien', completionDescription: 'Sind alle drei Punkte erfüllt, ist der Schnellstart abgeschlossen. Daten erstellen, prüfen und veröffentlichen sind spätere Aufgaben.',
    completion: ['Ein Prozessdatensatz wurde geöffnet und erkannt', 'Referenzfluss und funktionelle Einheit wurden unterschieden', 'Methode und Abdeckung wurden zusammen mit dem LCIA-Ergebnis geprüft'],
    recoveryTitle: 'Wenn etwas nicht funktioniert', recoveryDescription: 'Lösen Sie zuerst den aktuellen Schritt und fahren Sie dann mit der nächsten Nummer fort. Sie müssen nicht von vorne beginnen.',
    recovery: [
      { title: 'Anmeldung scheitert', description: 'E-Mail-Bestätigung, Kontoeinstellungen und Browsersitzung prüfen.', slug: 'user-guide/account-profile' },
      { title: 'Kein Methanol-Treffer', description: 'Filter löschen oder einen anderen sichtbaren offenen Prozess wählen.', slug: 'user-guide/search' },
      { title: 'Keine LCIA sichtbar', description: 'Einen Prozess mit Ergebnis wählen und Methode und Abdeckung im LCIA-Guide prüfen.', slug: 'faq' },
    ],
    videoLabel: 'Optionales Video', videoDescription: 'Das Video ergänzt die schriftlichen Schritte; Wiedergabe ist für den Abschluss nicht erforderlich.',
  },
  fr: {
    eyebrow: 'Première utilisation · environ 10–15 minutes', title: 'Première utilisation : voir les résultats environnementaux d’un procédé ouvert',
    description: 'Vous n’avez pas besoin de créer des données dès la première session. Suivez cinq étapes : connexion, lecture de la source de l’exemple, recherche d’un procédé, compréhension de sa quantité de référence et consultation des résultats de l’évaluation de l’impact du cycle de vie (ACVI). L’ACVI convertit les ressources et émissions en indicateurs d’impacts potentiels tels que le changement climatique.',
    openApp: 'Ouvrir TianGong LCA', prerequisitesTitle: 'Avant de commencer',
    prerequisites: ['Un compte TianGong LCA permettant la connexion', 'Environ 10–15 minutes sans interruption', 'Tout procédé ouvert visible convient ; une correspondance exacte avec l’exemple n’est pas requise'],
    sampleLabel: 'Exemple expliqué', sampleTitle: 'Exemple bibliographique de production de méthanol',
    sampleDescription: 'La publication est la source de référence de l’exemple. Les données de procédé de la plateforme peuvent être reliées dans un système de produit, puis servir au calcul des impacts environnementaux. L’exemple ne reproduit pas les conclusions de l’article et ne fournit pas de paquet prêt à importer.',
    sampleAction: 'Lire les notes de l’exemple',
    routeAriaLabel: 'Premiers pas dans TianGong LCA : connexion, lecture de la source, recherche du procédé, compréhension de sa quantité de référence et consultation des résultats ACVI.',
    outcomeLabel: 'Étape terminée lorsque', openStep: 'Ouvrir les instructions',
    steps: [
      { code: '01', title: 'Se connecter', description: 'Créer et vérifier un compte, ou se connecter avec un compte existant.', outcome: 'L’accueil et les entrées de données sont visibles', slug: 'quick-start/first-login' },
      { code: '02', title: 'Consulter la source de l’exemple', description: 'Ouvrir l’exemple méthanol et distinguer la publication de référence, les étapes de démonstration et les données réellement présentes dans la plateforme.', outcome: 'Vous pouvez citer la source et expliquer les limites de l’exemple', slug: 'quick-start/demonstrations' },
      { code: '03', title: 'Trouver un procédé ouvert', description: 'Dans Données ouvertes, chercher « methanol » ; sans résultat exact, choisir tout procédé visible.', outcome: 'La page de détail d’un procédé est ouverte', slug: 'user-guide/data' },
      { code: '04', title: 'Voir quelle quantité le procédé représente', description: 'Repérer le flux de référence, la quantité de référence, les entrées et les sorties. Le flux de référence est le produit ou service principal du procédé ; il ne remplace pas l’unité fonctionnelle utilisée pour comparer une étude complète.', outcome: 'Vous pouvez montrer le flux et la quantité de référence', slug: 'user-guide/data-use' },
      { code: '05', title: 'Voir les résultats d’évaluation de l’impact (ACVI)', description: 'Ouvrir un résultat disponible et noter sa méthode et sa couverture. Un facteur absent signifie que certains flux n’ont pas été calculés, et non que l’impact est nul.', outcome: 'Un résultat, sa méthode et sa couverture sont notés', slug: 'user-guide/lcia' },
    ],
    completionTitle: 'Critères de fin', completionDescription: 'Le démarrage est terminé lorsque les trois points sont vrais. Créer, revoir et publier des données sont des tâches ultérieures.',
    completion: ['Un jeu de données de procédé a été ouvert et identifié', 'Flux de référence et unité fonctionnelle ont été distingués', 'Méthode et couverture ont été vérifiées avec le résultat ACVI'],
    recoveryTitle: 'En cas de problème', recoveryDescription: 'Résolvez d’abord l’étape en cours, puis continuez avec le numéro suivant. Il n’est pas nécessaire de recommencer.',
    recovery: [
      { title: 'Connexion impossible', description: 'Vérifier e-mail, réglages du compte et session du navigateur.', slug: 'user-guide/account-profile' },
      { title: 'Aucun résultat méthanol', description: 'Effacer les filtres ou choisir un autre procédé ouvert visible.', slug: 'user-guide/search' },
      { title: 'Aucune ACVI visible', description: 'Choisir un procédé avec résultat et vérifier la méthode et la couverture dans le guide ACVI.', slug: 'faq' },
    ],
    videoLabel: 'Vidéo facultative', videoDescription: 'La vidéo complète les étapes écrites ; sa lecture n’est pas nécessaire pour terminer.',
  },
};

function Arrow() {
  return (
    <svg aria-hidden="true" height="16" viewBox="0 0 20 20" width="16">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function routeHref(language: Language, slug: string) {
  return `/${language}/docs/${slug}/`;
}

export function QuickStartGuide({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];

  return (
    <div className="not-prose mt-8 grid gap-10 pb-3" data-quick-start-guide="first-session-route">
      <section aria-labelledby="quick-start-route">
        <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 max-[40rem]:grid-cols-1 max-[40rem]:items-stretch">
          <div className="grid max-w-[48rem] gap-2">
            <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.eyebrow}</p>
            <h2 className="m-0 text-2xl leading-tight font-semibold tracking-[-0.025em]" id="quick-start-route">{content.title}</h2>
            <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.description}</p>
          </div>
          <Link className={`${buttonVariants({ variant: 'primary' })} min-h-11 shrink-0 rounded-[2px] px-4 text-sm font-medium max-[40rem]:w-full`} data-quick-start-primary href="https://lca.tiangong.earth/" rel="noreferrer" target="_blank">
            {content.openApp}<Arrow />
          </Link>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[48rem]:grid-cols-1">
          <aside className="bg-fd-background p-4" data-quick-start-prerequisites>
            <h3 className="m-0 text-sm font-semibold">{content.prerequisitesTitle}</h3>
            <ul className="mt-3 mb-0 grid gap-2 pl-5 text-sm leading-6 text-fd-muted-foreground">
              {content.prerequisites.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
          <aside className="grid content-between gap-4 bg-fd-background p-4" data-quick-start-sample>
            <div className="grid gap-1.5">
              <p className="m-0 text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">{content.sampleLabel}</p>
              <h3 className="m-0 text-sm font-semibold">{content.sampleTitle}</h3>
              <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.sampleDescription}</p>
            </div>
            <Link className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary" href={routeHref(language, 'quick-start/demonstrations')}>{content.sampleAction}<Arrow /></Link>
          </aside>
        </div>

        <ol aria-label={content.routeAriaLabel} className="m-0 grid list-none gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border p-0" data-quick-start-map="three-stage-onboarding" data-quick-start-map-v2="golden-path">
          {content.steps.map((step) => (
            <li className="m-0 bg-fd-background p-0" key={step.code}>
              <Link className="group grid min-h-32 grid-cols-[3rem_minmax(0,1fr)_minmax(12rem,auto)] items-center gap-4 p-4 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent max-[48rem]:grid-cols-[3rem_minmax(0,1fr)] max-[48rem]:items-start" href={routeHref(language, step.slug)}>
                <span className="self-start pt-0.5 text-sm font-semibold text-fd-primary">{step.code}</span>
                <span className="grid gap-1.5">
                  <strong className="text-base leading-snug font-semibold">{step.title}</strong>
                  <span className="text-sm leading-6 text-fd-muted-foreground">{step.description}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-fd-primary">{content.openStep}<Arrow /></span>
                </span>
                <span className="grid gap-1 border-l border-fd-border pl-4 max-[48rem]:col-start-2 max-[48rem]:border-t max-[48rem]:border-l-0 max-[48rem]:pt-3 max-[48rem]:pl-0">
                  <span className="text-xs font-semibold tracking-[0.04em] text-fd-muted-foreground uppercase">{content.outcomeLabel}</span>
                  <strong className="text-sm leading-5 font-medium">{step.outcome}</strong>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="quick-start-completion" className="rounded-[2px] border border-fd-primary/35 bg-fd-primary/5 p-5">
        <h2 className="m-0 text-xl font-semibold" id="quick-start-completion">{content.completionTitle}</h2>
        <p className="mt-2 mb-0 text-sm leading-6 text-fd-muted-foreground">{content.completionDescription}</p>
        <ul className="mt-4 mb-0 grid gap-2 pl-5 text-sm leading-6">{content.completion.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section aria-labelledby="quick-start-recovery" className="border-t border-fd-border pt-5" data-quick-start-recovery>
        <div className="mb-4 grid max-w-[43rem] gap-2">
          <h2 className="m-0 text-xl leading-tight font-semibold tracking-[-0.02em]" id="quick-start-recovery">{content.recoveryTitle}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.recoveryDescription}</p>
        </div>
        <div className="grid grid-cols-3 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[46rem]:grid-cols-1">
          {content.recovery.map((item) => (
            <Link className="group grid min-h-24 content-between gap-3 bg-fd-background p-3.5 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent" href={routeHref(language, item.slug)} key={item.slug}>
              <strong className="flex items-center justify-between gap-2 text-sm font-semibold">{item.title}<Arrow /></strong>
              <span className="text-xs leading-5 text-fd-muted-foreground">{item.description}</span>
            </Link>
          ))}
        </div>
        <Link className="mt-4 grid max-w-[43rem] gap-1 text-fd-foreground no-underline" href={routeHref(language, 'quick-start/demonstrations')}>
          <span className="text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">{content.videoLabel}</span>
          <span className="text-sm leading-6 text-fd-muted-foreground">{content.videoDescription}</span>
        </Link>
      </section>
    </div>
  );
}
