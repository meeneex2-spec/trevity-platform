import { getTextOverrides } from '@/lib/siteTexts';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';

export const dynamic = 'force-dynamic';

export default async function SiteTextsPage() {
  // storage JSON 기반 — DB 테이블/SQL 불필요
  const overrides = await getTextOverrides();
  const rows = Object.entries(overrides).flatMap(([locale, map]) =>
    Object.entries(map ?? {}).map(([key, value]) => ({ locale, key, value }))
  );

  return <SiteTextsEditor initial={rows} />;
}
