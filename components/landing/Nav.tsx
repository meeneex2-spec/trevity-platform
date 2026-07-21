'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useT } from '@/lib/i18n/LanguageProvider';
import { LOCALES, LOCALE_META, type Locale } from '@/lib/i18n/dictionaries';

export default function Nav() {
  const { t, ctaUrl, locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="trv-nav">
      <Link href={`/${locale}`} className="nav-logo">
        <img src="/logo.png" alt="trevity" />
      </Link>
      <ul className="nav-links">
        <li><a href="#campaigns">{t.nav.campaigns}</a></li>
        <li><a href="#regions">{t.nav.regions}</a></li>
        <li><a href="#benefits">{t.nav.creators}</a></li>
        <li><a href="#faq">{t.nav.faq}</a></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* 언어 드롭다운 */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lang-toggle"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span style={{ fontSize: 18 }}>{LOCALE_META[locale].flag}</span>
            <span style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase' }}>{locale}</span>
            <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
          </button>
          {/* 항상 DOM 에 렌더(닫힘 상태는 CSS 로 숨김) — 크롤러가 7개 언어 URL 을 발견할 수 있어야 함 */}
          <ul className="lang-dropdown" role="listbox" style={open ? undefined : { display: 'none' }}>
            {LOCALES.map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l}`}
                    hrefLang={l}
                    onClick={() => setOpen(false)}
                    className={`lang-option ${l === locale ? 'active' : ''}`}
                    aria-current={l === locale ? 'true' : undefined}
                  >
                    <span style={{ fontSize: 18 }}>{LOCALE_META[l].flag}</span>
                    <span>{LOCALE_META[l].native}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="nav-cta">
          {t.nav.cta}
        </a>
      </div>
    </nav>
  );
}
