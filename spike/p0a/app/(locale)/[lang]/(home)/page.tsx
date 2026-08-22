import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

const hero: Record<string, { title: string; description: string; cta: string }> = {
  zh: {
    title: 'TianGong LCA 文档',
    description: '生命周期评价（LCA）平台文档站点，P0A 兼容性 spike 内容。',
    cta: '进入文档',
  },
  en: {
    title: 'TianGong LCA Documentation',
    description: 'Documentation for the TianGong LCA platform. P0A compatibility spike content.',
    cta: 'Open documentation',
  },
  de: {
    title: 'TianGong LCA Dokumentation',
    description:
      'Dokumentation der TianGong LCA Plattform. Landing-Seite des P0A-Spikes (weitere Seiten folgen nach Übersetzung).',
    cta: 'Dokumentation öffnen',
  },
  fr: {
    title: 'Documentation TianGong LCA',
    description:
      'Documentation de la plateforme TianGong LCA. Page d’accueil du spike P0A (les autres pages suivront après traduction).',
    cta: 'Ouvrir la documentation',
  },
};

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const content = hero[lang] ?? hero.en;

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="container flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight">{content.title}</h1>
        <p className="max-w-2xl text-fd-muted-foreground">{content.description}</p>
        <Link
          href={`/${lang}/docs/`}
          className="rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          {content.cta}
        </Link>
      </div>
    </HomeLayout>
  );
}
