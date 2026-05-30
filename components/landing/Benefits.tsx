'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function Benefits() {
  const { t, ctaUrl } = useT();
  const benefits = [
    { icon: '🎁', title: t.benefits.b1 },
    { icon: '🌐', title: t.benefits.b2 },
    { icon: '📊', title: t.benefits.b3 },
    { icon: '🎬', title: t.benefits.b4 },
    { icon: '✈️', title: t.benefits.b5 },
    { icon: '💼', title: t.benefits.b6 },
  ];

  return (
    <section id="benefits" className="section-benefits">
      <div className="benefits-inner">
        <div className="benefits-left">
          <p className="section-label">{t.benefits.label}</p>
          <h2 className="section-title">{t.benefits.title1}{t.benefits.title2 && (<><br />{t.benefits.title2}</>)}</h2>
          <p className="section-desc">{t.benefits.desc}</p>
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t.benefits.cta}
          </a>
        </div>
        <div className="benefits-grid">
          {benefits.map((b) => (
            <div key={b.title} className="benefit-card">
              <span className="benefit-icon">{b.icon}</span>
              <div className="benefit-title">{b.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
