import { createClient } from '@/lib/supabase/server';
import LandingShell from '@/components/landing/LandingShell';
import { fetchTikTokThumb } from '@/lib/embed';
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

  // 썸네일 미지정 TikTok Reel 은 oEmbed 로 썸네일 자동 보강 (YouTube 는 클라이언트에서 자동 처리)
  const reels = await Promise.all(
    (reelsRes.data ?? []).map(async (r) => {
      if (r.thumb_url) return r;
      const thumb = await fetchTikTokThumb(r.link_url);
      return thumb ? { ...r, thumb_url: thumb } : r;
    })
  );

  return (
    <LandingShell
      countries={countriesRes.data ?? []}
      categories={categoriesRes.data ?? []}
      faqs={faqsRes.data ?? []}
      reels={reels}
      ctaUrls={ctaUrls}
      textOverrides={textOverrides}
    />
  );
}
