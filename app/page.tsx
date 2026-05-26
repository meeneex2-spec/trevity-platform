import { createClient } from '@/lib/supabase/server';
import LandingShell from '@/components/landing/LandingShell';
import type { Locale } from '@/lib/i18n/dictionaries';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [countriesRes, categoriesRes, faqsRes, reelsRes, ctaRes] = await Promise.all([
    supabase.from('countries').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('campaign_categories').select('*').order('sort_order'),
    supabase.from('faqs').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('reels').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('cta_links').select('locale, url'),
  ]);

  const ctaUrls: Partial<Record<Locale, string>> = {};
  for (const row of ctaRes.data ?? []) {
    ctaUrls[row.locale as Locale] = row.url;
  }

  return (
    <LandingShell
      countries={countriesRes.data ?? []}
      categories={categoriesRes.data ?? []}
      faqs={faqsRes.data ?? []}
      reels={reelsRes.data ?? []}
      ctaUrls={ctaUrls}
    />
  );
}
