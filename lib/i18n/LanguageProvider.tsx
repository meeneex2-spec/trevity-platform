'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyOverrides, LOCALES, type Dictionary, type Locale, type TextOverrides } from './dictionaries';

type CtaUrls = Partial<Record<Locale, string>>;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  ctaUrl: string;          // 현재 locale 의 CTA URL (없으면 fallback 또는 '#')
  ctaUrls: CtaUrls;        // 전체 매핑 (어드민 변경 후 새로고침 없이 반영하려면 별도 처리 필요)
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'trevity-locale';
const FALLBACK_LOCALE: Locale = 'en';   // 지원 안 되는 브라우저 언어 → 영어

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

function isValidLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/**
 * 브라우저 언어 (navigator.languages, navigator.language) 기반으로
 * 지원되는 locale 중 가장 적합한 걸 반환. 매칭 안 되면 영어.
 */
function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return FALLBACK_LOCALE;
  const candidates: string[] = [];
  if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
  if (navigator.language) candidates.push(navigator.language);

  for (const lang of candidates) {
    const base = lang.toLowerCase().split('-')[0];
    // zh-TW, zh-HK 등 중국어 변종은 모두 'zh' 로
    if (isValidLocale(base)) return base;
  }
  return FALLBACK_LOCALE;
}

export function LanguageProvider({
  children,
  initialLocale,
  ctaUrls,
  textOverrides,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  ctaUrls: CtaUrls;
  textOverrides?: TextOverrides;
}) {
  // 서버 SSR 단계에서는 'ko' 로 일단 렌더 (FOUC 최소화 — 한국 사용자 다수 가정).
  // 클라이언트 마운트 직후 localStorage > 브라우저 언어 순으로 정확한 locale 적용.
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'ko');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isValidLocale(saved)) {
        if (saved !== locale) setLocaleState(saved);
        return;   // 사용자가 직접 선택한 게 우선
      }
    } catch {}
    // localStorage 에 없으면 브라우저 언어 자동 감지
    const detected = detectBrowserLocale();
    if (detected !== locale) setLocaleState(detected);
    // first-mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    // <html lang> 도 함께 갱신
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l;
    }
  };

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale,
    t: applyOverrides(locale, textOverrides?.[locale]),
    // DB 값이 없거나 placeholder('#')면 언어별 기본 사이트로
    ctaUrl: (ctaUrls[locale] && ctaUrls[locale] !== '#') ? ctaUrls[locale]! : DEFAULT_CTA_URLS[locale],
    ctaUrls,
  }), [locale, ctaUrls, textOverrides]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useT must be used inside <LanguageProvider>');
  return ctx;
}
