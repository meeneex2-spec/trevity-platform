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
            {t.hero.title1}<br />{t.hero.title2}<br />{t.hero.title3}
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
            <div className="phone-main-img-area">
              <span className="phone-main-title">🏨 Bangkok Luxury Hotel</span>
            </div>
            <div className="phone-main-content">
              <div className="phone-stats">
                <span>❤️ 4.9</span>
                <span>📍 Thailand</span>
                <span>🎬 2.1M views</span>
              </div>
              <span className="phone-campaign-tag">{t.hero.phoneTag}</span>
              <p className="phone-sub-text" style={{ whiteSpace: 'pre-line' }}>{t.hero.phoneSub}</p>
            </div>
          </div>
          <div className="phone-secondary">
            <div className="phone-secondary-img">
              <span className="phone-secondary-title">🌴 Bali Experience</span>
            </div>
            <div className="phone-secondary-content">
              {t.hero.phoneSec1}<br />
              {t.hero.phoneSec2}
            </div>
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
