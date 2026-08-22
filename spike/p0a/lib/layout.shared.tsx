import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { zhCN } from '@fumadocs/language/zh-cn';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';

/**
 * v4 §5.1：zh 使用官方语言包；de/fr 无官方包（@fumadocs/language 仅 zh-cn/zh-tw），
 * 先自补核心 UI 词条，P1 扩全并考虑上游 PR。
 */
export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN())
  .add({
    de: {
      'On this page(table of contents)': 'Auf dieser Seite',
      'Next Page(pagination)': 'Nächste Seite',
      'Previous Page(pagination)': 'Vorherige Seite',
      'No results found(search dialog)': 'Keine Ergebnisse gefunden',
      'Choose a language(language switcher)': 'Sprache wählen',
      'Back to Home(404 page)': 'Zurück zur Startseite',
      'Page Not Found(404 page)': 'Seite nicht gefunden',
    },
    fr: {
      'On this page(table of contents)': 'Sur cette page',
      'Next Page(pagination)': 'Page suivante',
      'Previous Page(pagination)': 'Page précédente',
      'No results found(search dialog)': 'Aucun résultat trouvé',
      'Choose a language(language switcher)': 'Choisir une langue',
      'Back to Home(404 page)': "Retour à l'accueil",
      'Page Not Found(404 page)': 'Page introuvable',
    },
  });

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: 'TianGong LCA',
      url: `/${locale}`,
    },
    githubUrl: 'https://github.com/linancn/tiangong-lca-next',
    links: [
      {
        type: 'main',
        text: locale === 'zh' ? '文档' : 'Documentation',
        url: `/${locale}/docs`,
      },
    ],
  };
}
