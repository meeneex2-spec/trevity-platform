'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function WhatIsTrevity() {
  const { t } = useT();
  const features = [
    { icon: '🌍', title: t.what.f1Title, desc: t.what.f1Desc },
    { icon: '📈', title: t.what.f2Title, desc: t.what.f2Desc },
    { icon: '⚡', title: t.what.f3Title, desc: t.what.f3Desc },
    { icon: '✈️', title: t.what.f4Title, desc: t.what.f4Desc },
  ];

  return (
    <section id="what" className="section-what">
      <div className="section-inner">
        <div className="section-header">
          <p className="section-label">{t.what.label}</p>
          <h2 className="section-title">{t.what.title1}<br />{t.what.title2}</h2>
          <p className="section-desc">{t.what.desc}</p>
        </div>
        <div className="cards-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="card-icon">{f.icon}</div>
              <div className="card-title">{f.title}</div>
              <p className="card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
