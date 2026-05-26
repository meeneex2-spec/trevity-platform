'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function HowItWorks() {
  const { t } = useT();
  const steps = [
    { num: '01', icon: '👤', title: t.how.s1Title, desc: t.how.s1Desc },
    { num: '02', icon: '📋', title: t.how.s2Title, desc: t.how.s2Desc },
    { num: '03', icon: '🎬', title: t.how.s3Title, desc: t.how.s3Desc },
    { num: '04', icon: '🚀', title: t.how.s4Title, desc: t.how.s4Desc },
  ];

  return (
    <section id="how" className="section-how">
      <div className="how-glow" />
      <div className="section-inner" style={{ position: 'relative' }}>
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.how.label}</p>
          <h2 className="section-title">{t.how.title1}<br />{t.how.title2}</h2>
        </div>
        <div className="steps-grid">
          <span className="step-arrow step-arrow-1">→</span>
          <span className="step-arrow step-arrow-2">→</span>
          <span className="step-arrow step-arrow-3">→</span>
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <span className="step-icon">{s.icon}</span>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
