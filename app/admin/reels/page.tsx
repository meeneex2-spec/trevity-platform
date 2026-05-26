import { createClient } from '@/lib/supabase/server';
import ReelsEditor from '@/components/admin/ReelsEditor';

export const dynamic = 'force-dynamic';

export default async function ReelsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('reels').select('*').order('sort_order');
  return <ReelsEditor initial={data ?? []} />;
}
