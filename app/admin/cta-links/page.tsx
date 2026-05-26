import { createClient } from '@/lib/supabase/server';
import CtaLinksEditor from '@/components/admin/CtaLinksEditor';

export const dynamic = 'force-dynamic';

export default async function CtaLinksPage() {
  const supabase = createClient();
  const { data } = await supabase.from('cta_links').select('*').order('locale');
  return <CtaLinksEditor initial={data ?? []} />;
}
