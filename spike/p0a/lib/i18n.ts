import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en', 'de', 'fr'],
  hideLocale: 'never',
  fallbackLanguage: null,
});

export const languageNames: Record<string, string> = {
  zh: '中文',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
};

/** v4 §5.1：URL 段 `zh` 对应 html lang `zh-CN` */
export function toHtmlLang(lang: string): string {
  return lang === 'zh' ? 'zh-CN' : lang;
}
