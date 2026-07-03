'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { uploadImage as uploadToServer } from '@/lib/upload';
import TranslationModal from '@/components/admin/TranslationModal';

type Cat = {
  id: number;
  slug: string;
  icon: string;
  name: string;
  description: string | null;
  image_url: string | null;
  size: string;
  sort_order: number;
};

export default function CategoriesEditor({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Cat[]>(initial);
  const [uploading, setUploading] = useState<number | 'new' | null>(null);
  const [translating, setTranslating] = useState<Cat | null>(null);
  const [newRow, setNewRow] = useState({
    slug: '', icon: '', name: '', description: '', image_url: '', size: 'normal', sort_order: 99,
  });

  const update = (id: number, patch: Partial<Cat>) => setRows(rows.map((r) => r.id === id ? { ...r, ...patch } : r));

  const uploadImage = async (id: number | 'new', file: File) => {
    setUploading(id);
    try {
      const publicUrl = await uploadToServer(file, 'categories');
      if (id === 'new') {
        setNewRow({ ...newRow, image_url: publicUrl });
      } else {
        update(id, { image_url: publicUrl });
      }
      toast.success('이미지 업로드 완료');
    } catch (err: any) {
      toast.error(`업로드 실패: ${err.message ?? err}`);
    } finally {
      setUploading(null);
    }
  };

  const save = async (row: Cat) => {
    const supabase = createClient();
    const { error } = await supabase.from('campaign_categories').update({
      slug: row.slug, icon: row.icon, name: row.name, description: row.description,
      image_url: row.image_url || null, size: row.size, sort_order: row.sort_order,
    }).eq('id', row.id);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success('정상적으로 수정되었습니다');
    router.refresh();
  };

  const del = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('campaign_categories').delete().eq('id', id);
    if (error) { toast.error(`삭제 실패: ${error.message}`); return; }
    toast.success('삭제되었습니다');
    router.refresh();
  };

  const add = async () => {
    if (!newRow.slug || !newRow.name) { toast.error('slug 와 name 은 필수입니다.'); return; }
    const supabase = createClient();
    const { error } = await supabase.from('campaign_categories').insert({ ...newRow, image_url: newRow.image_url || null });
    if (error) { toast.error(`추가 실패: ${error.message}`); return; }
    toast.success('정상적으로 추가되었습니다');
    setNewRow({ slug: '', icon: '', name: '', description: '', image_url: '', size: 'normal', sort_order: 99 });
    router.refresh();
  };

  return (
    <>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>카테고리 목록</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>순서</th><th>아이콘</th><th>slug</th><th>이름</th><th>설명</th>
              <th style={{ width: 200 }}>대표 이미지</th><th>크기</th><th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><input className="admin-input" style={{ width: 60 }} type="number" value={r.sort_order} onChange={(e) => update(r.id, { sort_order: Number(e.target.value) })} /></td>
                <td><input className="admin-input" style={{ width: 60 }} value={r.icon} onChange={(e) => update(r.id, { icon: e.target.value })} /></td>
                <td><input className="admin-input" style={{ width: 110 }} value={r.slug} onChange={(e) => update(r.id, { slug: e.target.value })} /></td>
                <td><input className="admin-input" value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} /></td>
                <td><input className="admin-input" value={r.description ?? ''} onChange={(e) => update(r.id, { description: e.target.value })} /></td>
                <td>
                  {r.image_url && (
                    <img src={r.image_url} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4, marginBottom: 4, display: 'block' }} />
                  )}
                  <input
                    className="admin-input"
                    style={{ fontSize: 11, padding: '4px 6px', marginBottom: 4 }}
                    placeholder="URL 직접 입력"
                    value={r.image_url ?? ''}
                    onChange={(e) => update(r.id, { image_url: e.target.value })}
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
                  <select className="admin-select" value={r.size} onChange={(e) => update(r.id, { size: e.target.value })}>
                    <option value="normal">normal</option>
                    <option value="tall">tall</option>
                  </select>
                </td>
                <td>
                  <button className="admin-btn" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => save(r)}>저장</button>
                  &nbsp;
                  <button className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 10px' }} title="언어별 번역 수정" onClick={() => setTranslating(r)}>🌐</button>
                  &nbsp;
                  <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => del(r.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>+ 새 카테고리</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 1fr 2fr 200px 100px 100px', gap: 8 }}>
          <input className="admin-input" type="number" placeholder="순서" value={newRow.sort_order} onChange={(e) => setNewRow({ ...newRow, sort_order: Number(e.target.value) })} />
          <input className="admin-input" placeholder="🏨" value={newRow.icon} onChange={(e) => setNewRow({ ...newRow, icon: e.target.value })} />
          <input className="admin-input" placeholder="slug" value={newRow.slug} onChange={(e) => setNewRow({ ...newRow, slug: e.target.value })} />
          <input className="admin-input" placeholder="이름" value={newRow.name} onChange={(e) => setNewRow({ ...newRow, name: e.target.value })} />
          <input className="admin-input" placeholder="설명" value={newRow.description} onChange={(e) => setNewRow({ ...newRow, description: e.target.value })} />
          <div>
            <input
              className="admin-input"
              style={{ fontSize: 11, padding: '4px 6px', marginBottom: 4 }}
              placeholder="이미지 URL"
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
          <select className="admin-select" value={newRow.size} onChange={(e) => setNewRow({ ...newRow, size: e.target.value })}><option value="normal">normal</option><option value="tall">tall</option></select>
          <button className="admin-btn" onClick={add}>추가</button>
        </div>
      </div>

      {translating && (
        <TranslationModal
          title={`카테고리 · ${translating.name}`}
          fields={[
            { key: `category.${translating.id}.name`, label: '이름', base: translating.name },
            { key: `category.${translating.id}.description`, label: '설명', base: translating.description ?? '' },
          ]}
          onClose={() => setTranslating(null)}
        />
      )}
    </>
  );
}
