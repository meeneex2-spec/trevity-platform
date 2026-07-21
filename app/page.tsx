import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { detectLocale } from '@/lib/seo';

/**
 * 루트(/)는 방문자 언어를 감지해 /{lang}/ 으로 보낸다.
 * 실제 콘텐츠는 모두 언어별 URL 에 존재해야 검색엔진·AI 크롤러가 7개 언어를 각각 인식한다.
 */
export const dynamic = 'force-dynamic';

export default function RootPage() {
  const lang = detectLocale(headers().get('accept-language'));
  redirect(`/${lang}`);
}
