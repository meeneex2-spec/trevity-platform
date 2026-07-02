'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function Hero() {
  const { t, ctaUrl } = useT();

  return (
    <section id="hero" className="trv-hero">
      <div className="hero-glow-right" />
      <div className="hero-glow-left" />
      <div className="hero-inner">
        <div className="hero-left">
          <span className="hero-badge">{t.hero.badge}</span>
          <h1 className="hero-title">
            {t.hero.title1}
            {t.hero.title2 && (<><br />{t.hero.title2}</>)}
            {t.hero.title3 && (<><br />{t.hero.title3}</>)}
          </h1>
          <p className="hero-desc">{t.hero.desc}</p>
          <div className="hero-cta-group">
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">{t.hero.ctaPrimary}</a>
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t.hero.ctaSecondary}</a>
          </div>
          <p className="hero-regions">{t.hero.regions}</p>
        </div>

        <div className="phone-area">
          <div className="phone-notification">
            <div className="notif-icon">🎉</div>
            <div>
              <div className="notif-title">{t.hero.phoneNotifTitle}</div>
              <div className="notif-sub">{t.hero.phoneNotifSub}</div>
            </div>
          </div>
          <div className="phone-main">
            <div className="phone-screen">
              <div className="phone-statusbar">
                <span className="sb-time">9:41</span>
                <span className="sb-icons">
                  {/* 안테나 */}
                  <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
                    <rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" />
                  </svg>
                  {/* 배터리 */}
                  <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                    <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
                    <rect x="22.7" y="3.8" width="1.8" height="4.4" rx="0.9" fill="currentColor" opacity="0.4" />
                  </svg>
                </span>
              </div>
              <img src="/hero/main.png" alt="트래비티 앱 캠페인 목록 화면" className="phone-screen-img" />
            </div>
            <div className="phone-island" />
          </div>
          <div className="phone-secondary">
            <div className="phone-screen">
              <div className="phone-statusbar">
                <span className="sb-time">9:41</span>
                <span className="sb-icons">
                  <svg width="14" height="9" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
                    <rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" />
                  </svg>
                  <svg width="20" height="10" viewBox="0 0 25 12" aria-hidden>
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
                    <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
                    <rect x="22.7" y="3.8" width="1.8" height="4.4" rx="0.9" fill="currentColor" opacity="0.4" />
                  </svg>
                </span>
              </div>
              <img src="/hero/small.png" alt="트래비티 앱 캠페인 상세 화면" className="phone-screen-img" />
            </div>
            <div className="phone-island" />
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">{t.hero.scrollHint}</span>
      </div>
    </section>
  );
}
