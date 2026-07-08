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
      <Link href="/" className="nav-logo">
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
          {open && (
            <ul className="lang-dropdown" role="listbox">
              {LOCALES.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => { setLocale(l); setOpen(false); }}
                    className={`lang-option ${l === locale ? 'active' : ''}`}
                    role="option"
                    aria-selected={l === locale}
                  >
                    <span style={{ fontSize: 18 }}>{LOCALE_META[l].flag}</span>
                    <span>{LOCALE_META[l].native}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="nav-cta">
          {t.nav.cta}
        </a>
      </div>
    </nav>
  );
}
