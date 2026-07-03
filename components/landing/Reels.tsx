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
  const { t, tr } = useT();
  return (
    <section id="content" className="section-content">
      <div className="section-inner">
        <div className="section-header" style={{ maxWidth: 500 }}>
          <p className="section-label">{t.content.label}</p>
          <h2 className="section-title">{t.content.title1}{t.content.title2 && (<><br />{t.content.title2}</>)}</h2>
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
                  <span className="reel-play-big" aria-hidden>
                    {/* YouTube 스타일 재생 버튼 */}
                    <svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000" />
                      <path d="M45 24 27 14v20" fill="#FFFFFF" />
                    </svg>
                  </span>
                  {platformLabel && <span className="reel-platform-tag">{platformLabel}</span>}
                </div>
                <div className="reel-meta">
                  <div className="reel-location">{tr(`reel.${r.id}.location`, r.location)}</div>
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
