import { createHash } from 'node:crypto';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

const SCHEMA_VERSION = 1;

/**
 * v4 §7.1/§7.2：构建产物搜索记录。
 * 构建期生成、携带 sourceCommit/digest，post-deploy reconciliation 以此为
 * Algolia replaceAllObjects 的唯一数据源；构建过程不访问 Algolia。
 */
export function GET() {
  const records: Array<Record<string, unknown>> = [];
  const countsByLocale: Record<string, number> = {};

  for (const lang of i18n.languages) {
    const pages = source.getPages(lang);
    countsByLocale[lang] = pages.length;

    for (const page of pages) {
      records.push({
        _id: page.url,
        title: page.data.title,
        description: page.data.description ?? null,
        structured: page.data.structuredData,
        url: page.url,
        tag: lang,
        locale: lang,
        extra_data: {
          sourceCommit: process.env.SOURCE_COMMIT ?? null,
        },
      });
    }
  }

  const digest = createHash('sha256').update(JSON.stringify(records)).digest('hex');
  const epoch = Number(process.env.SOURCE_DATE_EPOCH ?? 0);

  return Response.json(
    {
      schemaVersion: SCHEMA_VERSION,
      sourceCommit: process.env.SOURCE_COMMIT ?? null,
      generatedAt: epoch > 0 ? new Date(epoch * 1000).toISOString() : null,
      count: records.length,
      countsByLocale,
      digest: `sha256:${digest}`,
      records,
    },
    { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
  );
}
