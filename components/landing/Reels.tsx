'use client';

import { useT } from '@/lib/i18n/LanguageProvider';
import { parseEmbed } from '@/lib/embed';

type Reel = {
  id: number;
  thumb_url: string | null;
  location: string;
  views_text: string | null;
  likes_text: string | null;
  link_url: string | null;
};

export default function Reels({ reels }: { reels: Reel[] }) {
  const { t } = useT();
  return (
    <section id="content" className="section-content">
      <div className="section-inner">
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.content.label}</p>
          <h2 className="section-title">{t.content.title1}<br />{t.content.title2}</h2>
          <p className="section-desc">{t.content.desc}</p>
        </div>
        <div className="reels-grid-v2">
          {reels.map((r) => {
            const embed = parseEmbed(r.link_url);
            // 썸네일 우선순위: reels.thumb_url > YouTube 자동 썸네일
            const thumb = r.thumb_url || embed.thumbUrl;
            const platformLabel = embed.type === 'youtube' ? 'YouTube'
              : embed.type === 'instagram' ? 'Instagram'
              : embed.type === 'tiktok' ? 'TikTok' : '';

            const inner = (
              <>
                <div
                  className={`reel-frame ${thumb ? '' : 'reel-frame-empty'}`}
                  style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                >
                  <span className="reel-play-big">▶</span>
                  {platformLabel && <span className="reel-platform-tag">{platformLabel}</span>}
                </div>
                <div className="reel-meta">
                  <div className="reel-location">{r.location}</div>
                  <div className="reel-stats">
                    👁 {r.views_text ?? '—'} &nbsp;❤️ {r.likes_text ?? '—'}
                  </div>
                </div>
              </>
            );

            return r.link_url ? (
              <a
                key={r.id}
                href={r.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="reel-card-v2"
              >
                {inner}
              </a>
            ) : (
              <div key={r.id} className="reel-card-v2">{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
