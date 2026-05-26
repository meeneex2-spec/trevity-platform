import { createClient } from '@/lib/supabase/server';
import InquiriesTable from '@/components/admin/InquiriesTable';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createClient();
  let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (searchParams.status) query = query.eq('status', searchParams.status);
  const { data } = await query;

  return <InquiriesTable initial={data ?? []} currentFilter={searchParams.status ?? 'all'} />;
}
