'use client';

import { liteClient } from 'algoliasearch/lite';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import AlgoliaSearchDialog from 'fumadocs-ui/components/dialog/search-algolia';
import {
  SearchDialog as SearchDialogPrimitive,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

/**
 * v4 §6.2/§7.2：SEARCH_MODE 构建期烘焙。
 * - static（ci/preview）：浏览器本地静态搜索（staticClient 抓 /api/search 静态索引）
 * - algolia（production）：AlgoliaSearchDialog + tag=locale 过滤 + Powered by Algolia
 */
const SEARCH_MODE = process.env.NEXT_PUBLIC_SEARCH_MODE ?? 'static';

function StaticSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    client: staticClient({ locale }),
  });

  return (
    <SearchDialogPrimitive
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data === 'empty' ? [] : query.data} />
      </SearchDialogContent>
    </SearchDialogPrimitive>
  );
}

export default function SearchDialog(props: SharedProps) {
  const { locale } = useI18n();

  if (SEARCH_MODE === 'algolia') {
    return (
      <AlgoliaSearchDialog
        {...props}
        showAlgolia
        searchOptions={{
          indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'tiangong-lca-docs',
          client: liteClient(
            process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
            process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '',
          ),
          // v4 §7.2：locale 不自动形成 Algolia filter，必须用 tag
          tag: locale,
        }}
      />
    );
  }

  return <StaticSearchDialog {...props} />;
}
