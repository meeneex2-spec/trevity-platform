'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { uploadImage as uploadToServer } from '@/lib/upload';

// Quill 은 SSR 비호환 → 클라이언트 사이드만
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div style={{ padding: 40, color: '#64748B' }}>에디터 로딩 중...</div> });

type Category = { id: number; name: string };
type Country = { id: number; name_en: string; flag: string };

type Props = {
  mode: 'new' | 'edit';
  initial?: any;
  categories: Category[];
  countries: Country[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export default function CampaignForm({ mode, initial, categories, countries }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const [form, setForm] = useState({
    title:         initial?.title ?? '',
    slug:          initial?.slug ?? '',
    category_id:   initial?.category_id ?? (categories[0]?.id ?? ''),
    country_id:    initial?.country_id ?? (countries[0]?.id ?? ''),
    thumbnail_url: initial?.thumbnail_url ?? '',
    summary:       initial?.summary ?? '',
    content_html:  initial?.content_html ?? '',
    status:        initial?.status ?? 'draft',
    is_featured:   initial?.is_featured ?? false,
  });

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const publicUrl = await uploadToServer(file, 'campaigns');
      setForm((f) => ({ ...f, thumbnail_url: publicUrl }));
      toast.success('썸네일 업로드 완료');
    } catch (err: any) {
      toast.error(`업로드 실패: ${err.message ?? err}`);
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('제목은 필수입니다.');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload: any = {
      title: form.title,
      slug: form.slug || slugify(form.title) || `campaign-${Date.now()}`,
      category_id: form.category_id || null,
      country_id: form.country_id || null,
      thumbnail_url: form.thumbnail_url || null,
      summary: form.summary || null,
      content_html: form.content_html || null,
      status: form.status,
      is_featured: form.is_featured,
    };
    if (form.status === 'published' && !initial?.published_at) {
      payload.published_at = new Date().toISOString();
    }

    let error: any;
    if (mode === 'new') {
      ({ error } = await supabase.from('campaigns').insert(payload));
    } else {
      ({ error } = await supabase.from('campaigns').update(payload).eq('id', initial.id));
    }

    if (error) {
      toast.error(`저장 실패: ${error.message}`);
      setSaving(false);
      return;
    }
    toast.success(mode === 'new' ? '정상적으로 추가되었습니다' : '정상적으로 수정되었습니다');
    router.push('/admin/campaigns');
    router.refresh();
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>
          {mode === 'new' ? '새 캠페인 작성' : `캠페인 편집 #${initial.id}`}
        </h3>
        <Link href="/admin/campaigns" className="admin-btn admin-btn-secondary">← 목록</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="admin-field">
            <label className="admin-label">제목 *</label>
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">슬러그 (URL, 비워두면 자동 생성)</label>
            <input
              className="admin-input"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="bangkok-luxury-hotel"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="admin-field">
            <label className="admin-label">카테고리</label>
            <select
              className="admin-select"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label">국가</label>
            <select
              className="admin-select"
              value={form.country_id}
              onChange={(e) => setForm({ ...form, country_id: Number(e.target.value) })}
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name_en}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label">상태</label>
            <select
              className="admin-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">임시저장</option>
              <option value="published">발행</option>
              <option value="closed">종료</option>
            </select>
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">썸네일</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbUpload}
            disabled={uploadingThumb}
          />
          {form.thumbnail_url && (
            <div style={{ marginTop: 12 }}>
              <img src={form.thumbnail_url} alt="썸네일" style={{ maxWidth: 200, borderRadius: 8 }} />
            </div>
          )}
        </div>

        <div className="admin-field">
          <label className="admin-label">요약 (목록 카드에 노출)</label>
          <textarea
            className="admin-textarea"
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="짧은 한 줄 소개"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">본문 (Quill 에디터)</label>
          <ReactQuill
            theme="snow"
            value={form.content_html}
            onChange={(v) => setForm({ ...form, content_html: v })}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'blockquote'],
                ['clean'],
              ],
            }}
          />
        </div>

        <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="is_featured"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          <label htmlFor="is_featured" style={{ fontSize: 14, color: '#334155' }}>주요 캠페인 (랜딩 상단 노출)</label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? '저장 중...' : (mode === 'new' ? '캠페인 등록' : '변경사항 저장')}
          </button>
          <Link href="/admin/campaigns" className="admin-btn admin-btn-secondary">취소</Link>
        </div>
      </form>
    </div>
  );
}
