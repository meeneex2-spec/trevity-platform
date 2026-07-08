'use client';

import { useT } from '@/lib/i18n/LanguageProvider';

type SnsLink = { name: string; url: string };

/** override 맵에서 sns.{n}.name / sns.{n}.url 항목을 목록으로 변환 */
function parseSns(map?: Record<string, string>): SnsLink[] {
  if (!map) return [];
  const byIndex = new Map<number, Partial<SnsLink>>();
  for (const [key, value] of Object.entries(map)) {
    const m = key.match(/^sns\.(\d+)\.(name|url)$/);
    if (!m || !value?.trim()) continue;
    const idx = Number(m[1]);
    const cur = byIndex.get(idx) ?? {};
    cur[m[2] as 'name' | 'url'] = value;
    byIndex.set(idx, cur);
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)
    .filter((v): v is SnsLink => !!v.name && !!v.url);
}

export default function Footer() {
  const { t, locale, overrides } = useT();

  // 현재 언어의 SNS → 없으면 한국어 설정 → 그것도 없으면 표시 안 함
  const sns = (() => {
    const own = parseSns(overrides[locale]);
    if (own.length) return own;
    return parseSns(overrides.ko);
  })();

  return (
    <footer className="trv-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo-white.png" alt="trevity" />
          </div>
          <div className="footer-tagline">{t.footer.tagline}</div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">{t.footer.copy}</span>
        {sns.length > 0 && (
          <div className="footer-social">
            {sns.map((s, i) => (
              <a key={`${s.name}-${i}`} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
