'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

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

export default function ReelsEditor({ initial }: { initial: Reel[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Reel[]>(initial);
  const [newRow, setNewRow] = useState({ thumb_url: '', location: '', views_text: '', likes_text: '', link_url: '', sort_order: 99, is_active: true });

  const update = (id: number, patch: Partial<Reel>) => setRows(rows.map((r) => r.id === id ? { ...r, ...patch } : r));

  const handleUpload = async (id: number | 'new', file: File) => {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `reels/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('campaign-images').upload(path, file);
    if (error) { toast.error(`업로드 실패: ${error.message}`); return; }
    const { data } = supabase.storage.from('campaign-images').getPublicUrl(path);
    if (id === 'new') {
      setNewRow({ ...newRow, thumb_url: data.publicUrl });
    } else {
      update(id, { thumb_url: data.publicUrl });
    }
    toast.success('업로드 완료');
  };

  const save = async (row: Reel) => {
    const supabase = createClient();
    const { error } = await supabase.from('reels').update({
      thumb_url: row.thumb_url, location: row.location, views_text: row.views_text,
      likes_text: row.likes_text, link_url: row.link_url, sort_order: row.sort_order, is_active: row.is_active,
    }).eq('id', row.id);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success('정상적으로 수정되었습니다');
    router.refresh();
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
    const supabase = createClient();
    const { error } = await supabase.from('reels').insert(newRow);
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
            💡 YouTube · TikTok 링크는 썸네일이 자동 추출됩니다. Instagram(또는 자동 추출 실패 시)은 &apos;파일 선택&apos;으로 썸네일을 직접 올려주세요.
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
                <td><input className="admin-input" value={r.location} onChange={(e) => update(r.id, { location: e.target.value })} /></td>
                <td><input className="admin-input" style={{ width: 80 }} value={r.views_text ?? ''} onChange={(e) => update(r.id, { views_text: e.target.value })} /></td>
                <td><input className="admin-input" style={{ width: 80 }} value={r.likes_text ?? ''} onChange={(e) => update(r.id, { likes_text: e.target.value })} /></td>
                <td><input className="admin-input" value={r.link_url ?? ''} onChange={(e) => update(r.id, { link_url: e.target.value })} placeholder="YouTube / Instagram / TikTok URL" /></td>
                <td><input type="checkbox" checked={r.is_active} onChange={(e) => update(r.id, { is_active: e.target.checked })} /></td>
                <td>
                  <button className="admin-btn" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => save(r)}>저장</button>
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
          <input className="admin-input" placeholder="🇰🇷 Seoul" value={newRow.location} onChange={(e) => setNewRow({ ...newRow, location: e.target.value })} />
          <input className="admin-input" placeholder="조회수" value={newRow.views_text} onChange={(e) => setNewRow({ ...newRow, views_text: e.target.value })} />
          <input className="admin-input" placeholder="좋아요" value={newRow.likes_text} onChange={(e) => setNewRow({ ...newRow, likes_text: e.target.value })} />
          <input className="admin-input" placeholder="영상 URL (YouTube/Instagram/TikTok)" value={newRow.link_url} onChange={(e) => setNewRow({ ...newRow, link_url: e.target.value })} />
          <button className="admin-btn" onClick={add}>추가</button>
        </div>
      </div>
    </>
  );
}
