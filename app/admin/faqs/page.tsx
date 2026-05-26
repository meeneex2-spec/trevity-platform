import { createClient } from '@/lib/supabase/server';
import FaqsEditor from '@/components/admin/FaqsEditor';

export const dynamic = 'force-dynamic';

export default async function FaqsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('faqs').select('*').order('sort_order');
  return <FaqsEditor initial={data ?? []} />;
}
