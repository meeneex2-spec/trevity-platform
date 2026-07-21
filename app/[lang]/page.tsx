import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import LandingShell from '@/components/landing/LandingShell';
import { fetchTikTokThumb } from '@/lib/embed';
import { getTextOverrides } from '@/lib/siteTexts';
import { LOCALES, type Locale, type TextOverrides } from '@/lib/i18n/dictionaries';
import { SEO, SITE_URL, languageAlternates, organizationSchema } from '@/lib/seo';

export const revalidate = 60;

/** 7개 언어를 모두 정적 생성 — 크롤러가 언어별 URL 을 실제로 볼 수 있게 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const seo = SEO[lang];

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      siteName: 'Trevity',
      url: `${SITE_URL}/${lang}`,
      title: seo.title,
      description: seo.description,
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function LandingPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;

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

  // storage JSON override (관리자 '사이트 문구') — 테이블 값보다 우선
  const jsonOverrides = await getTextOverrides();
  for (const [locale, map] of Object.entries(jsonOverrides)) {
    textOverrides[locale as Locale] = { ...textOverrides[locale as Locale], ...map };
  }

  // 썸네일 미지정 TikTok Reel 은 oEmbed 로 보강 (YouTube 는 클라이언트에서 자동 처리)
  const reels = await Promise.all(
    (reelsRes.data ?? []).map(async (r) => {
      if (r.thumb_url) return r;
      const thumb = await fetchTikTokThumb(r.link_url);
      return thumb ? { ...r, thumb_url: thumb } : r;
    })
  );

  const faqs = faqsRes.data ?? [];

  // FAQPage 스키마 — AI 답변엔진 인용률에 직접 작용
  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: textOverrides[lang]?.[`faq.${f.id}.question`] ?? f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: textOverrides[lang]?.[`faq.${f.id}.answer`] ?? f.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <LandingShell
        lang={lang}
        countries={countriesRes.data ?? []}
        categories={categoriesRes.data ?? []}
        faqs={faqs}
        reels={reels}
        ctaUrls={ctaUrls}
        textOverrides={textOverrides}
      />
    </>
  );
}
