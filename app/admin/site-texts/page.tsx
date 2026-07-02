import { createClient } from '@/lib/supabase/server';
import SiteTextsEditor from '@/components/admin/SiteTextsEditor';

export const dynamic = 'force-dynamic';

export default async function SiteTextsPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from('site_texts').select('locale, key, value');

  // 테이블이 아직 없으면(마이그레이션 미실행) 안내만 노출
  const tableMissing = !!error;

  return <SiteTextsEditor initial={data ?? []} tableMissing={tableMissing} />;
}
