'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

type Category = {
  id: number;
  slug: string;
  icon: string;
  name: string;
  description: string | null;
  image_url?: string | null;
  size: string;
};

export default function Campaigns({ categories }: { categories: Category[] }) {
  const { t } = useT();
  return (
    <section id="campaigns" className="section-campaigns">
      <div className="section-inner">
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.campaigns.label}</p>
          <h2 className="section-title">{t.campaigns.title1}<br />{t.campaigns.title2}</h2>
        </div>
        <div className="campaigns-grid">
          {categories.map((c) => (
            <div
              key={c.id}
              className={`camp-card ${c.size === 'tall' ? 'tall' : ''} ${c.image_url ? 'has-image' : ''}`}
              style={c.image_url ? ({ ['--card-bg' as any]: `url(${c.image_url})` } as React.CSSProperties) : undefined}
            >
              <span className="camp-icon">{c.icon}</span>
              <div className="camp-content">
                <div className="camp-title">{c.name}</div>
                {c.description && <p className="camp-desc">{c.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
