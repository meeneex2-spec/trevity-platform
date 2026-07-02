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
            <a href="#campaigns" className="btn-secondary">{t.hero.ctaSecondary}</a>
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
            <img src="/hero/main.png" alt="트래비티 앱 캠페인 목록 화면" className="phone-screen-img" />
          </div>
          <div className="phone-secondary">
            <img src="/hero/small.png" alt="트래비티 앱 캠페인 상세 화면" className="phone-screen-img" />
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
