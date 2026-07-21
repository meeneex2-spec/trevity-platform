'use client';

import { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { applyOverrides, type Dictionary, type Locale, type TextOverrides } from './dictionaries';

type CtaUrls = Partial<Record<Locale, string>>;

type LanguageContextValue = {
  locale: Locale;
  /** 언어 전환 = 해당 언어 URL 로 이동 (클라이언트 상태 전환이 아님) */
  setLocale: (l: Locale) => void;
  t: Dictionary;
  /** DB 콘텐츠(카테고리/FAQ/릴스) 번역 조회: override 있으면 그 값, 없으면 fallback */
  tr: (key: string, fallback: string) => string;
  /** locale 별 raw override 맵 (SNS 링크 등 동적 목록 조회용) */
  overrides: TextOverrides;
  ctaUrl: string;
  ctaUrls: CtaUrls;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * 언어별 트래비티 사이트 기본 URL.
 * DB(cta_links)에 값이 있으면 그 값이 우선, 없으면 이 맵으로 연결.
 */
const DEFAULT_CTA_URLS: Record<Locale, string> = {
  ko: 'https://kr.trevity.com',
  en: 'https://trevity.com',
  ja: 'https://jp.trevity.com',
  zh: 'https://cn.trevity.com',
  vi: 'https://vn.trevity.com',
  th: 'https://th.trevity.com',
  my: 'https://mm.trevity.com',
};

/**
 * locale 은 URL(/[lang]/) 에서 서버가 결정한다.
 * 언어별로 실제 URL 이 존재해야 검색엔진·AI 크롤러가 각 언어판을 인식한다.
 */
export function LanguageProvider({
  children,
  locale,
  ctaUrls,
  textOverrides,
}: {
  children: React.ReactNode;
  locale: Locale;
  ctaUrls: CtaUrls;
  textOverrides?: TextOverrides;
}) {
  const router = useRouter();

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale: (l: Locale) => router.push(`/${l}`),
    t: applyOverrides(locale, textOverrides?.[locale]),
    tr: (key: string, fallback: string) => {
      const v = textOverrides?.[locale]?.[key];
      return v && v.trim() ? v : fallback;
    },
    overrides: textOverrides ?? {},
    // DB 값이 없거나 placeholder('#')면 언어별 기본 사이트로
    ctaUrl: (ctaUrls[locale] && ctaUrls[locale] !== '#') ? ctaUrls[locale]! : DEFAULT_CTA_URLS[locale],
    ctaUrls,
  }), [locale, ctaUrls, textOverrides, router]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useT must be used inside <LanguageProvider>');
  return ctx;
}
