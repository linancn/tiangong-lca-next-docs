import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  const commit = process.env.SOURCE_COMMIT ?? 'unknown';
  // v4 §3.3：llms.txt 必须暴露当前构建 commit，供 post-deploy 回读验证
  return new Response(`# Source Commit: ${commit}\n\n${llms(source).index()}`);
}
