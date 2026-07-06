'use client';

import { useState } from 'react';
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

/**
 * 체험단 2분류: 플레이스(방문형) / 프로덕트(배송형).
 * 카테고리 slug 기준 매핑 — 목록에 없는 새 slug 는 플레이스로 간주.
 */
type ExpType = 'place' | 'product';
const EXP_TYPE: Record<string, ExpType> = {
  hotels: 'place', massage: 'place', restaurants: 'place', cafes: 'place',
  beauty: 'place', activities: 'place', popup: 'place',
  'new-beauty': 'product', fnb: 'product', tech: 'product',
};
const typeOf = (slug: string): ExpType => EXP_TYPE[slug] ?? 'place';

export default function Campaigns({ categories }: { categories: Category[] }) {
  const { t, tr, locale } = useT();
  const translations = CATEGORY_TRANSLATIONS[locale];
  const [filter, setFilter] = useState<'all' | ExpType>('all');

  const visible = categories.filter((c) => filter === 'all' || typeOf(c.slug) === filter);
  const filterLabel = (f: 'all' | ExpType) =>
    f === 'all' ? t.campaigns.filterAll
    : f === 'place' ? `🏬 ${t.campaigns.filterPlace}`
    : `📦 ${t.campaigns.filterProduct}`;

  return (
    <section id="campaigns" className="section-campaigns">
      <div className="section-inner">
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.campaigns.label}</p>
          <h2 className="section-title">{t.campaigns.title1}{t.campaigns.title2 && (<><br />{t.campaigns.title2}</>)}</h2>
        </div>
        <div className="camp-filter">
          {(['all', 'place', 'product'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`camp-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
        <div className="campaigns-grid">
          {visible.map((c) => {
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
                <span className="camp-type-badge">
                  {typeOf(c.slug) === 'place'
                    ? `🏬 ${t.campaigns.filterPlace}`
                    : `📦 ${t.campaigns.filterProduct}`}
                </span>
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
