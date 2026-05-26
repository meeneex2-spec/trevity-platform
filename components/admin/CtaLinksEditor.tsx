'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { LOCALE_META, LOCALES } from '@/lib/i18n/dictionaries';

type CtaLink = { locale: string; url: string; updated_at: string };

export default function CtaLinksEditor({ initial }: { initial: CtaLink[] }) {
  const router = useRouter();

  // 누락된 언어는 빈 row 로 보강 (어드민에서 빠진 언어도 보이도록)
  const initialMap = new Map(initial.map((r) => [r.locale, r]));
  const fullRows = LOCALES.map((locale) => initialMap.get(locale) ?? { locale, url: '', updated_at: '' });

  const [rows, setRows] = useState(fullRows);
  const [saving, setSaving] = useState<string | null>(null);

  const update = (locale: string, url: string) =>
    setRows(rows.map((r) => (r.locale === locale ? { ...r, url } : r)));

  const save = async (row: CtaLink) => {
    setSaving(row.locale);
    const supabase = createClient();
    const { error } = await supabase
      .from('cta_links')
      .upsert({ locale: row.locale, url: row.url }, { onConflict: 'locale' });
    setSaving(null);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success(`${row.locale.toUpperCase()} 링크가 저장되었습니다`);
    router.refresh();
  };

  const saveAll = async () => {
    setSaving('all');
    const supabase = createClient();
    const { error } = await supabase
      .from('cta_links')
      .upsert(rows.map((r) => ({ locale: r.locale, url: r.url })), { onConflict: 'locale' });
    setSaving(null);
    if (error) { toast.error(`일괄 저장 실패: ${error.message}`); return; }
    toast.success('모든 링크가 저장되었습니다');
    router.refresh();
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>언어별 CTA 외부 링크</h3>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            랜딩의 「인플루언서 시작하기」 버튼이 현재 언어에 맞는 외부 URL 로 연결됩니다. 빈 값이면 한국어/영어 fallback.
          </p>
        </div>
        <button className="admin-btn" onClick={saveAll} disabled={!!saving}>
          {saving === 'all' ? '저장 중...' : '전체 일괄 저장'}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>국기</th>
            <th style={{ width: 80 }}>언어</th>
            <th style={{ width: 140 }}>표시 이름</th>
            <th>외부 URL</th>
            <th style={{ width: 100 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const meta = LOCALE_META[r.locale as keyof typeof LOCALE_META];
            return (
              <tr key={r.locale}>
                <td style={{ fontSize: 24 }}>{meta?.flag ?? ''}</td>
                <td style={{ fontWeight: 600, textTransform: 'uppercase' }}>{r.locale}</td>
                <td>{meta?.native ?? r.locale}</td>
                <td>
                  <input
                    className="admin-input"
                    value={r.url}
                    onChange={(e) => update(r.locale, e.target.value)}
                    placeholder="https://kr.trevity.com"
                  />
                </td>
                <td>
                  <button
                    className="admin-btn"
                    style={{ fontSize: 12, padding: '6px 10px' }}
                    onClick={() => save(r)}
                    disabled={saving === r.locale}
                  >
                    {saving === r.locale ? '저장 중...' : '저장'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
