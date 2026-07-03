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
                    {/* 재생 버튼: 어두운 반투명 원 + 흰 삼각형 */}
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.62)" />
                      <path d="M26 20.5v23L44.5 32z" fill="#FFFFFF" />
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
