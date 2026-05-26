import { createClient } from '@/lib/supabase/server';
import CountriesEditor from '@/components/admin/CountriesEditor';

export const dynamic = 'force-dynamic';

export default async function CountriesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('countries').select('*').order('sort_order');
  return <CountriesEditor initial={data ?? []} />;
}
