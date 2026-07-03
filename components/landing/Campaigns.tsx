'use client';

import { useT } from '@/lib/i18n/LanguageProvider';
import { CATEGORY_TRANSLATIONS } from '@/lib/i18n/dictionaries';

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
  const { t, tr, locale } = useT();
  const translations = CATEGORY_TRANSLATIONS[locale];

  return (
    <section id="campaigns" className="section-campaigns">
      <div className="section-inner">
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.campaigns.label}</p>
          <h2 className="section-title">{t.campaigns.title1}{t.campaigns.title2 && (<><br />{t.campaigns.title2}</>)}</h2>
        </div>
        <div className="campaigns-grid">
          {categories.map((c) => {
            // 우선순위: 관리자 번역(override) > 코드 번역 > DB 원본
            const codeTr = translations?.[c.slug];
            const name = tr(`category.${c.id}.name`, codeTr?.name ?? c.name);
            const description = tr(`category.${c.id}.description`, codeTr?.description ?? c.description ?? '');
            return (
              <div
                key={c.id}
                className={`camp-card ${c.size === 'tall' ? 'tall' : ''} ${c.image_url ? 'has-image' : ''}`}
                style={c.image_url ? ({ ['--card-bg' as any]: `url(${c.image_url})` } as React.CSSProperties) : undefined}
              >
                <span className="camp-icon">{c.icon}</span>
                <div className="camp-content">
                  <div className="camp-title">{name}</div>
                  {description && <p className="camp-desc">{description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
