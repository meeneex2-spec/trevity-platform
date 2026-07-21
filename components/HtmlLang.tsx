'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALES } from '@/lib/i18n/dictionaries';

/**
 * <html lang> 을 현재 언어 경로에 맞춰 교정.
 * (루트 레이아웃은 route param 을 받을 수 없어 클라이언트에서 보정한다.
 *  hreflang·canonical 등 핵심 SEO 신호는 서버에서 이미 정확히 출력됨.)
 */
export default function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const seg = pathname.split('/')[1];
    if ((LOCALES as readonly string[]).includes(seg)) {
      document.documentElement.lang = seg;
    }
  }, [pathname]);

  return null;
}
