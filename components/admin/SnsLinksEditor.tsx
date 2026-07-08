'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LOCALES, type Locale } from '@/lib/i18n/dictionaries';

/**
 * 국가(언어)별 푸터 SNS 링크 관리.
 * 저장 위치: storage JSON(/api/site-texts) — key 형식 sns.{n}.name / sns.{n}.url
 * 해당 언어에 설정이 없으면 사이트는 한국어 설정을 대신 표시.
 */

type Row = { name: string; url: string };

const LOCALE_LABELS: Record<Locale, string> = {
  ko: '🇰🇷 한국어',
  en: '🇺🇸 English',
  ja: '🇯🇵 日本語',
  zh: '🇨🇳 中文',
  vi: '🇻🇳 Tiếng Việt',
  th: '🇹🇭 ไทย',
  my: '🇲🇲 မြန်မာ',
};

const SNS_PRESETS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Twitter)', 'Threads'];

function parseRows(map?: Record<string, string>): Row[] {
  if (!map) return [];
  const byIndex = new Map<number, Partial<Row>>();
  for (const [key, value] of Object.entries(map)) {
    const m = key.match(/^sns\.(\d+)\.(name|url)$/);
    if (!m) continue;
    const idx = Number(m[1]);
    const cur = byIndex.get(idx) ?? {};
    cur[m[2] as 'name' | 'url'] = value;
    byIndex.set(idx, cur);
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => ({ name: v.name ?? '', url: v.url ?? '' }));
}

export default function SnsLinksEditor() {
  const [locale, setLocale] = useState<Locale>('ko');
  const [rowsByLocale, setRowsByLocale] = useState<Record<string, Row[]>>({});
  const [maxSaved, setMaxSaved] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/site-texts');
        const data = res.ok ? await res.json() : {};
        const rows: Record<string, Row[]> = {};
        const max: Record<string, number> = {};
        for (const l of LOCALES) {
          rows[l] = parseRows(data?.[l]);
          max[l] = rows[l].length;
        }
        setRowsByLocale(rows);
        setMaxSaved(max);
      } catch {
        toast.error('SNS 설정을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = rowsByLocale[locale] ?? [];
  const setRows = (next: Row[]) => setRowsByLocale((prev) => ({ ...prev, [locale]: next }));

  const save = async () => {
    setSaving(true);
    try {
      const valid = rows.filter((r) => r.name.trim() && r.url.trim());
      const entries: Record<string, string | null> = {};
      const count = Math.max(valid.length, maxSaved[locale] ?? 0);
      for (let i = 1; i <= count; i++) {
        const row = valid[i - 1];
        entries[`sns.${i}.name`] = row ? row.name.trim() : null;
        entries[`sns.${i}.url`] = row ? row.url.trim() : null;
      }
      const res = await fetch('/api/site-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, entries }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `저장 실패 (${res.status})`);
      setRows(valid);
      setMaxSaved((prev) => ({ ...prev, [locale]: valid.length }));
      toast.success(`${LOCALE_LABELS[locale]} SNS 링크가 저장되었습니다. 사이트에는 1분 내 반영됩니다.`);
    } catch (err: any) {
      toast.error(err.message ?? '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-card" style={{ borderLeft: '4px solid #2563EB' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🔗 푸터 SNS 링크 (국가별)</div>
        <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
          언어 탭을 선택해 그 나라 방문자에게 보여줄 SNS 채널을 관리하세요.
          해당 언어에 설정이 없으면 <b>한국어 설정</b>이 대신 표시되고, 한국어에도 없으면 SNS 영역이 숨겨집니다.
        </p>
      </div>

      <div className="admin-card" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`admin-btn ${l === locale ? '' : 'admin-btn-secondary'}`}
            style={{ fontSize: 13, padding: '6px 12px' }}
          >
            {LOCALE_LABELS[l]}
            {(rowsByLocale[l]?.length ?? 0) > 0 && (
              <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.8 }}>({rowsByLocale[l].length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ fontSize: 13, color: '#64748B' }}>불러오는 중...</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr><th style={{ width: 220 }}>SNS 이름</th><th>링크 URL</th><th style={{ width: 80 }}></th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="admin-input"
                        list="sns-presets"
                        placeholder="Instagram"
                        value={r.name}
                        onChange={(e) => setRows(rows.map((row, j) => j === i ? { ...row, name: e.target.value } : row))}
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input"
                        placeholder="https://instagram.com/trevity_kr"
                        value={r.url}
                        onChange={(e) => setRows(rows.map((row, j) => j === i ? { ...row, url: e.target.value } : row))}
                      />
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ fontSize: 12, padding: '6px 10px' }}
                        onClick={() => setRows(rows.filter((_, j) => j !== i))}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={3} style={{ color: '#94A3B8', fontSize: 13, padding: '16px 8px' }}>
                    등록된 SNS 가 없습니다. 아래 버튼으로 추가하세요.
                  </td></tr>
                )}
              </tbody>
            </table>
            <datalist id="sns-presets">
              {SNS_PRESETS.map((p) => <option key={p} value={p} />)}
            </datalist>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setRows([...rows, { name: '', url: '' }])}
              >
                + SNS 추가
              </button>
              <button className="admin-btn" disabled={saving} onClick={save}>
                {saving ? '저장 중...' : `${LOCALE_LABELS[locale]} 저장`}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
