import { createClient } from '@/lib/supabase/server';
import CampaignForm from '@/components/admin/CampaignForm';

export const dynamic = 'force-dynamic';

export default async function NewCampaignPage() {
  const supabase = createClient();
  const [{ data: categories }, { data: countries }] = await Promise.all([
    supabase.from('campaign_categories').select('id, name').order('sort_order'),
    supabase.from('countries').select('id, name_en, flag').order('sort_order'),
  ]);

  return (
    <CampaignForm
      mode="new"
      categories={categories ?? []}
      countries={countries ?? []}
    />
  );
}
