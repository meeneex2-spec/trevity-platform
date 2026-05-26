import { createClient } from '@/lib/supabase/server';
import CategoriesEditor from '@/components/admin/CategoriesEditor';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('campaign_categories').select('*').order('sort_order');
  return <CategoriesEditor initial={data ?? []} />;
}
