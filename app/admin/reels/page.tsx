import { createClient } from '@/lib/supabase/server';
import ReelsEditor from '@/components/admin/ReelsEditor';

export const dynamic = 'force-dynamic';

export default async function ReelsPage() {
  const supabase = createClient();
  const [reelsRes, countriesRes] = await Promise.all([
    supabase.from('reels').select('*').order('sort_order'),
    supabase.from('countries').select('flag, name_ko').order('sort_order'),
  ]);
  return <ReelsEditor initial={reelsRes.data ?? []} countries={countriesRes.data ?? []} />;
}
