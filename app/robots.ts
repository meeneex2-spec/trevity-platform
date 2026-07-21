import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // 스테이징 배포: 크롤은 허용하되(페이지의 noindex 를 읽어야 하므로) 사이트맵은 제공하지 않는다.
  if (!INDEXABLE) {
    return {
      rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
