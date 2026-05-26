import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CampaignForm from '@/components/admin/CampaignForm';

export const dynamic = 'force-dynamic';

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const id = Number(params.id);

  const [{ data: campaign }, { data: categories }, { data: countries }] = await Promise.all([
    supabase.from('campaigns').select('*').eq('id', id).single(),
    supabase.from('campaign_categories').select('id, name').order('sort_order'),
    supabase.from('countries').select('id, name_en, flag').order('sort_order'),
  ]);

  if (!campaign) notFound();

  return (
    <CampaignForm
      mode="edit"
      initial={campaign}
      categories={categories ?? []}
      countries={countries ?? []}
    />
  );
}
