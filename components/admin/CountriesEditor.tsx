'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { uploadImage as uploadToServer } from '@/lib/upload';

type Country = {
  id: number;
  slug: string;
  flag: string;
  name_en: string;
  name_ko: string;
  city: string;
  image_url: string | null;
  target_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export default function CountriesEditor({ initial }: { initial: Country[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Country[]>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | 'new' | null>(null);
  const [newRow, setNewRow] = useState({
    slug: '', flag: '', name_en: '', name_ko: '', city: '', image_url: '', target_url: '', sort_order: 99,
  });

  const updateRow = (id: number, patch: Partial<Country>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const uploadImage = async (id: number | 'new', file: File) => {
    setUploading(id);
    try {
      const publicUrl = await uploadToServer(file, 'countries');
      if (id === 'new') {
        setNewRow({ ...newRow, image_url: publicUrl });
      } else {
        updateRow(id, { image_url: publicUrl });
      }
      toast.success('이미지 업로드 완료');
    } catch (err: any) {
      toast.error(`업로드 실패: ${err.message ?? err}`);
    } finally {
      setUploading(null);
    }
  };

  const saveRow = async (row: Country) => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('countries').update({
      slug: row.slug, flag: row.flag, name_en: row.name_en, name_ko: row.name_ko,
      city: row.city, image_url: row.image_url || null, target_url: row.target_url || null,
      sort_order: row.sort_order, is_active: row.is_active,
    }).eq('id', row.id);
    setSaving(false);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success('정상적으로 수정되었습니다');
    router.refresh();
  };

  const deleteRow = async (id: number) => {
    if (!confirm('이 국가를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('countries').delete().eq('id', id);
    if (error) { toast.error(`삭제 실패: ${error.message}`); return; }
    toast.success('삭제되었습니다');
    router.refresh();
  };

  const addRow = async () => {
    if (!newRow.slug || !newRow.name_en) { toast.error('slug 와 name_en 은 필수입니다.'); return; }
    const supabase = createClient();
    const { error } = await supabase.from('countries').insert({
      ...newRow,
      image_url: newRow.image_url || null,
      target_url: newRow.target_url || null,
    });
    if (error) { toast.error(`추가 실패: ${error.message}`); return; }
    toast.success('정상적으로 추가되었습니다');
    setNewRow({ slug: '', flag: '', name_en: '', name_ko: '', city: '', image_url: '', target_url: '', sort_order: 99 });
    router.refresh();
  };

  return (
    <>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>국가 목록</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>순서</th>
              <th style={{ width: 60 }}>국기</th>
              <th style={{ width: 110 }}>slug</th>
              <th>영문명</th>
              <th>한글명</th>
              <th>도시</th>
              <th style={{ width: 200 }}>대표 이미지</th>
              <th style={{ width: 180 }}>클릭 시 이동 URL</th>
              <th style={{ width: 60 }}>활성</th>
              <th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><input className="admin-input" style={{ width: 60 }} type="number" value={r.sort_order} onChange={(e) => updateRow(r.id, { sort_order: Number(e.target.value) })} /></td>
                <td><input className="admin-input" style={{ width: 60 }} value={r.flag} onChange={(e) => updateRow(r.id, { flag: e.target.value })} /></td>
                <td><input className="admin-input" style={{ width: 110 }} value={r.slug} onChange={(e) => updateRow(r.id, { slug: e.target.value })} /></td>
                <td><input className="admin-input" value={r.name_en} onChange={(e) => updateRow(r.id, { name_en: e.target.value })} /></td>
                <td><input className="admin-input" value={r.name_ko} onChange={(e) => updateRow(r.id, { name_ko: e.target.value })} /></td>
                <td><input className="admin-input" value={r.city} onChange={(e) => updateRow(r.id, { city: e.target.value })} /></td>
                <td>
                  {r.image_url && (
                    <img src={r.image_url} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4, marginBottom: 4, display: 'block' }} />
                  )}
                  <input
                    className="admin-input"
                    style={{ fontSize: 11, padding: '4px 6px', marginBottom: 4 }}
                    placeholder="URL 직접 입력"
                    value={r.image_url ?? ''}
                    onChange={(e) => updateRow(r.id, { image_url: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ fontSize: 10, width: 180 }}
                    disabled={uploading === r.id}
                    onChange={(e) => e.target.files?.[0] && uploadImage(r.id, e.target.files[0])}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    style={{ fontSize: 12, padding: '6px 8px' }}
                    placeholder="https://kr.trevity.com"
                    value={r.target_url ?? ''}
                    onChange={(e) => updateRow(r.id, { target_url: e.target.value })}
                  />
                </td>
                <td><input type="checkbox" checked={r.is_active} onChange={(e) => updateRow(r.id, { is_active: e.target.checked })} /></td>
                <td>
                  <button className="admin-btn" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => saveRow(r)} disabled={saving}>저장</button>
                  &nbsp;
                  <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => deleteRow(r.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>+ 새 국가 추가</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 1fr 1fr 1fr 200px 180px 100px', gap: 8, alignItems: 'center' }}>
          <input className="admin-input" placeholder="순서" type="number" value={newRow.sort_order} onChange={(e) => setNewRow({ ...newRow, sort_order: Number(e.target.value) })} />
          <input className="admin-input" placeholder="🇰🇷" value={newRow.flag} onChange={(e) => setNewRow({ ...newRow, flag: e.target.value })} />
          <input className="admin-input" placeholder="slug" value={newRow.slug} onChange={(e) => setNewRow({ ...newRow, slug: e.target.value })} />
          <input className="admin-input" placeholder="영문명" value={newRow.name_en} onChange={(e) => setNewRow({ ...newRow, name_en: e.target.value })} />
          <input className="admin-input" placeholder="한글명" value={newRow.name_ko} onChange={(e) => setNewRow({ ...newRow, name_ko: e.target.value })} />
          <input className="admin-input" placeholder="도시" value={newRow.city} onChange={(e) => setNewRow({ ...newRow, city: e.target.value })} />
          <div>
            <input
              className="admin-input"
              style={{ fontSize: 11, padding: '4px 6px', marginBottom: 4 }}
              placeholder="이미지 URL 또는 업로드"
              value={newRow.image_url}
              onChange={(e) => setNewRow({ ...newRow, image_url: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              style={{ fontSize: 10, width: 180 }}
              disabled={uploading === 'new'}
              onChange={(e) => e.target.files?.[0] && uploadImage('new', e.target.files[0])}
            />
          </div>
          <input className="admin-input" placeholder="https://kr.trevity.com" value={newRow.target_url} onChange={(e) => setNewRow({ ...newRow, target_url: e.target.value })} />
          <button className="admin-btn" onClick={addRow}>추가</button>
        </div>
      </div>
    </>
  );
}
