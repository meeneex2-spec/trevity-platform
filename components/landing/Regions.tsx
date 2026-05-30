'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

type Country = {
  id: number;
  slug: string;
  flag: string;
  name_en: string;
  city: string;
  image_url?: string | null;
  target_url?: string | null;
};

export default function Regions({ countries }: { countries: Country[] }) {
  const { t } = useT();
  return (
    <section id="regions" className="section-regions">
      <div className="section-inner">
        <div className="section-header">
          <p className="section-label">{t.regions.label}</p>
          <h2 className="section-title">{t.regions.title1}{t.regions.title2 && (<><br />{t.regions.title2}</>)}</h2>
          <p className="section-desc">{t.regions.desc}</p>
        </div>
        <div className="countries-grid">
          {countries.map((c) => {
            const className = `country-card ${c.image_url ? 'has-image' : ''}`;
            const styleObj = c.image_url
              ? ({ ['--card-bg' as any]: `url(${c.image_url})` } as React.CSSProperties)
              : undefined;
            const inner = (
              <>
                <div className="country-content">
                  <span className="country-flag">{c.flag}</span>
                  <div className="country-name">{c.name_en}</div>
                  <div className="country-city">{c.city}</div>
                </div>
                <span className="country-arrow">→</span>
              </>
            );

            return c.target_url ? (
              <a
                key={c.id}
                href={c.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={styleObj}
              >
                {inner}
              </a>
            ) : (
              <div key={c.id} className={className} style={styleObj}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
