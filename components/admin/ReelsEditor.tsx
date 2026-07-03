'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/upload';

type Reel = {
  id: number;
  thumb_url: string | null;
  location: string;
  views_text: string | null;
  likes_text: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type CountryOpt = { flag: string; name_ko: string };

/** location("🇻🇳 Hochiminh") → 국기 + 도시명 분리 */
function splitLocation(loc: string | null | undefined): { flag: string; city: string } {
  const m = (loc ?? '').match(/^(\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF])\s*(.*)$/);
  return m ? { flag: m[1], city: m[2] } : { flag: '', city: (loc ?? '').trim() };
}

/** 국기 + 도시명 → location 문자열 */
const joinLocation = (flag: string, city: string) => `${flag} ${city}`.trim();

/** 영상 링크에서 조회수·좋아요 자동 조회 (YouTube/TikTok — 실패 시 null) */
async function fetchStats(url: string): Promise<{ views_text: string | null; likes_text: string | null }> {
  try {
    const res = await fetch(`/api/reel-stats?url=${encodeURIComponent(url)}`);
    if (!res.ok) return { views_text: null, likes_text: null };
    const data = await res.json();
    return { views_text: data.views_text ?? null, likes_text: data.likes_text ?? null };
  } catch {
    return { views_text: null, likes_text: null };
  }
}

export default function ReelsEditor({ initial, countries }: { initial: Reel[]; countries: CountryOpt[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Reel[]>(initial);
  const [statsLoading, setStatsLoading] = useState<number | null>(null);
  const [newRow, setNewRow] = useState({ thumb_url: '', location: '', views_text: '', likes_text: '', link_url: '', sort_order: 99, is_active: true });

  const update = (id: number, patch: Partial<Reel>) => setRows(rows.map((r) => r.id === id ? { ...r, ...patch } : r));

  const handleUpload = async (id: number | 'new', file: File) => {
    try {
      const publicUrl = await uploadImage(file, 'reels');
      if (id === 'new') {
        setNewRow({ ...newRow, thumb_url: publicUrl });
        toast.success('업로드 완료 — 아래 [추가] 버튼을 눌러 저장하세요');
      } else {
        update(id, { thumb_url: publicUrl });
        // 업로드 즉시 DB 반영 (별도 저장 버튼 없이도 적용)
        const supabase = createClient();
        const { error: saveErr } = await supabase.from('reels').update({ thumb_url: publicUrl }).eq('id', id);
        if (saveErr) { toast.error(`저장 실패: ${saveErr.message}`); return; }
        toast.success('썸네일 업로드 및 저장 완료');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message ?? '업로드 실패');
    }
  };

  const save = async (row: Reel) => {
    // 링크가 있고 조회수/좋아요가 비어 있으면 자동 조회해서 채움
    let { views_text, likes_text } = row;
    if (row.link_url && (!views_text || !likes_text)) {
      const stats = await fetchStats(row.link_url);
      views_text = views_text || stats.views_text;
      likes_text = likes_text || stats.likes_text;
      if (stats.views_text || stats.likes_text) update(row.id, { views_text, likes_text });
    }

    const supabase = createClient();
    const { error } = await supabase.from('reels').update({
      thumb_url: row.thumb_url, location: row.location, views_text,
      likes_text, link_url: row.link_url, sort_order: row.sort_order, is_active: row.is_active,
    }).eq('id', row.id);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success('정상적으로 수정되었습니다');
    router.refresh();
  };

  /** ↻ 버튼: 링크에서 조회수·좋아요를 새로 가져와 바로 저장 */
  const refreshStats = async (row: Reel) => {
    if (!row.link_url) { toast.error('영상 링크를 먼저 입력하세요.'); return; }
    setStatsLoading(row.id);
    try {
      const stats = await fetchStats(row.link_url);
      if (!stats.views_text && !stats.likes_text) {
        toast.error('이 링크에서는 통계를 가져올 수 없습니다. (Instagram 은 수동 입력)');
        return;
      }
      const patch = {
        views_text: stats.views_text ?? row.views_text,
        likes_text: stats.likes_text ?? row.likes_text,
      };
      update(row.id, patch);
      const supabase = createClient();
      const { error } = await supabase.from('reels').update(patch).eq('id', row.id);
      if (error) { toast.error(`저장 실패: ${error.message}`); return; }
      toast.success(`자동 등록 완료 — 조회수 ${patch.views_text ?? '—'} · 좋아요 ${patch.likes_text ?? '—'}`);
      router.refresh();
    } finally {
      setStatsLoading(null);
    }
  };

  const del = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('reels').delete().eq('id', id);
    if (error) { toast.error(`삭제 실패: ${error.message}`); return; }
    toast.success('삭제되었습니다');
    router.refresh();
  };

  const add = async () => {
    if (!newRow.location) { toast.error('위치는 필수입니다.'); return; }

    // 링크가 있고 조회수/좋아요가 비어 있으면 자동 조회해서 채움
    const toInsert = { ...newRow };
    if (toInsert.link_url && (!toInsert.views_text || !toInsert.likes_text)) {
      const stats = await fetchStats(toInsert.link_url);
      toInsert.views_text = toInsert.views_text || (stats.views_text ?? '');
      toInsert.likes_text = toInsert.likes_text || (stats.likes_text ?? '');
    }

    const supabase = createClient();
    const { error } = await supabase.from('reels').insert(toInsert);
    if (error) { toast.error(`추가 실패: ${error.message}`); return; }
    toast.success('정상적으로 추가되었습니다');
    setNewRow({ thumb_url: '', location: '', views_text: '', likes_text: '', link_url: '', sort_order: 99, is_active: true });
    router.refresh();
  };

  return (
    <>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Reels 목록</h3>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            💡 YouTube · TikTok 링크(영상·사진 모두)는 <b>썸네일 + 조회수·좋아요가 자동 등록</b>됩니다 (저장 시 빈 칸 자동 채움, ↻ 버튼으로 최신값 갱신).
            Instagram 은 수동 입력해 주세요.
          </span>
        </div>
        <table className="admin-table">
          <thead><tr><th>순서</th><th>썸네일</th><th>위치</th><th>조회수</th><th>좋아요</th><th>영상 링크</th><th>활성</th><th style={{ width: 200 }}></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><input className="admin-input" style={{ width: 60 }} type="number" value={r.sort_order} onChange={(e) => update(r.id, { sort_order: Number(e.target.value) })} /></td>
                <td>
                  {r.thumb_url ? <img src={r.thumb_url} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="" /> : <span style={{ color: '#94A3B8' }}>—</span>}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(r.id, e.target.files[0])} style={{ fontSize: 10, width: 80 }} />
                </td>
                <td>
                  {(() => {
                    const { flag, city } = splitLocation(r.location);
                    return (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <select
                          className="admin-input"
                          style={{ width: 110, flex: 'none' }}
                          value={flag}
                          onChange={(e) => update(r.id, { location: joinLocation(e.target.value, city) })}
                        >
                          <option value="">국가 선택</option>
                          {flag && !countries.some((c) => c.flag === flag) && (
                            <option value={flag}>{flag} (기존값)</option>
                          )}
                          {countries.map((c, i) => (
                            <option key={`${c.flag}-${i}`} value={c.flag}>{c.flag} {c.name_ko}</option>
                          ))}
                        </select>
                        <input
                          className="admin-input"
                          style={{ minWidth: 90 }}
                          value={city}
                          placeholder="도시명"
                          onChange={(e) => update(r.id, { location: joinLocation(flag, e.target.value) })}
                        />
                      </div>
                    );
                  })()}
                </td>
                <td><input className="admin-input" style={{ width: 80 }} value={r.views_text ?? ''} onChange={(e) => update(r.id, { views_text: e.target.value })} /></td>
                <td><input className="admin-input" style={{ width: 80 }} value={r.likes_text ?? ''} onChange={(e) => update(r.id, { likes_text: e.target.value })} /></td>
                <td><input className="admin-input" value={r.link_url ?? ''} onChange={(e) => update(r.id, { link_url: e.target.value })} placeholder="YouTube / Instagram / TikTok URL" /></td>
                <td><input type="checkbox" checked={r.is_active} onChange={(e) => update(r.id, { is_active: e.target.checked })} /></td>
                <td>
                  <button className="admin-btn" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => save(r)}>저장</button>
                  &nbsp;
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: 12, padding: '6px 10px' }}
                    title="링크에서 조회수·좋아요 자동 등록"
                    disabled={statsLoading === r.id}
                    onClick={() => refreshStats(r)}
                  >
                    {statsLoading === r.id ? '…' : '↻'}
                  </button>
                  &nbsp;
                  <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => del(r.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>+ 새 Reel 추가</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr 100px 100px 1fr 100px', gap: 8, alignItems: 'center' }}>
          <input className="admin-input" type="number" placeholder="순서" value={newRow.sort_order} onChange={(e) => setNewRow({ ...newRow, sort_order: Number(e.target.value) })} />
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload('new', e.target.files[0])} />
          <div style={{ display: 'flex', gap: 4 }}>
            <select
              className="admin-input"
              style={{ width: 110, flex: 'none' }}
              value={splitLocation(newRow.location).flag}
              onChange={(e) => setNewRow({ ...newRow, location: joinLocation(e.target.value, splitLocation(newRow.location).city) })}
            >
              <option value="">국가 선택</option>
              {countries.map((c, i) => (
                <option key={`${c.flag}-${i}`} value={c.flag}>{c.flag} {c.name_ko}</option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="도시명 (예: Seoul)"
              value={splitLocation(newRow.location).city}
              onChange={(e) => setNewRow({ ...newRow, location: joinLocation(splitLocation(newRow.location).flag, e.target.value) })}
            />
          </div>
          <input className="admin-input" placeholder="조회수" value={newRow.views_text} onChange={(e) => setNewRow({ ...newRow, views_text: e.target.value })} />
          <input className="admin-input" placeholder="좋아요" value={newRow.likes_text} onChange={(e) => setNewRow({ ...newRow, likes_text: e.target.value })} />
          <input className="admin-input" placeholder="영상 URL (YouTube/Instagram/TikTok)" value={newRow.link_url} onChange={(e) => setNewRow({ ...newRow, link_url: e.target.value })} />
          <button className="admin-btn" onClick={add}>추가</button>
        </div>
      </div>
    </>
  );
}
