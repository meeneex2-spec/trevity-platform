'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

export default function FinalCta() {
  const { t, ctaUrl } = useT();
  return (
    <section id="cta-final" className="cta-final-section">
      <div className="cta-glow" />
      <div className="cta-final-inner">
        <h2 className="cta-final-title">{t.finalCta.title1}{t.finalCta.title2 && (<><br />{t.finalCta.title2}</>)}</h2>
        <p className="cta-final-desc">{t.finalCta.desc}</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: 18, padding: '20px 40px', borderRadius: 32 }}
        >
          {t.finalCta.cta}
        </a>
        <div className="cta-final-checks">
          <span className="cta-check">{t.finalCta.check1}</span>
          <span className="cta-check">{t.finalCta.check2}</span>
          <span className="cta-check">{t.finalCta.check3}</span>
        </div>
      </div>
    </section>
  );
}
