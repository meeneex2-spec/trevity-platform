import { createClient } from '@/lib/supabase/server';
import LandingShell from '@/components/landing/LandingShell';
import type { Locale, TextOverrides } from '@/lib/i18n/dictionaries';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [countriesRes, categoriesRes, faqsRes, reelsRes, ctaRes, textsRes] = await Promise.all([
    supabase.from('countries').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('campaign_categories').select('*').order('sort_order'),
    supabase.from('faqs').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('reels').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('cta_links').select('locale, url'),
    supabase.from('site_texts').select('locale, key, value'),
  ]);

  const ctaUrls: Partial<Record<Locale, string>> = {};
  for (const row of ctaRes.data ?? []) {
    ctaUrls[row.locale as Locale] = row.url;
  }

  // site_texts 테이블이 아직 없으면 textsRes.data 는 null → override 없이 코드 기본값 사용
  const textOverrides: TextOverrides = {};
  for (const row of textsRes.data ?? []) {
    (textOverrides[row.locale as Locale] ??= {})[row.key] = row.value;
  }

  return (
    <LandingShell
      countries={countriesRes.data ?? []}
      categories={categoriesRes.data ?? []}
      faqs={faqsRes.data ?? []}
      reels={reelsRes.data ?? []}
      ctaUrls={ctaUrls}
      textOverrides={textOverrides}
    />
  );
}
