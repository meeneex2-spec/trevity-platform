import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/dictionaries';
import { HREFLANG, SITE_URL, X_DEFAULT_LOCALE } from '@/lib/seo';

/**
 * 언어별 URL 을 모두 등록하고, 각 항목에 상호 hreflang(alternates)을 붙인다.
 * → 구글이 7개 언어판을 "같은 페이지의 다른 언어"로 인식.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG[l]] = `${SITE_URL}/${l}`;
  }
  languages['x-default'] = `${SITE_URL}/${X_DEFAULT_LOCALE}`;

  return LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: l === 'ko' ? 1 : 0.9,
    alternates: { languages },
  }));
}
