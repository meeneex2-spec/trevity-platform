'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function InquiryModal({
  open,
  onClose,
  countries,
}: {
  open: boolean;
  onClose: () => void;
  countries: { id: number; slug: string; name_en: string; name_ko: string }[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    sns_platform: 'instagram',
    sns_handle: '',
    follower_count: '1K-10K',
    country_interest: '',
    message: '',
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('이름과 이메일은 필수입니다.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '제출에 실패했습니다.');
      toast.success('신청이 접수되었습니다. 빠르게 연락드릴게요!');
      setForm({
        name: '', email: '', sns_platform: 'instagram', sns_handle: '',
        follower_count: '1K-10K', country_interest: '', message: '',
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '제출에 실패했습니다.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">×</button>
        <h3 className="modal-title">인플루언서 신청하기</h3>
        <p className="modal-desc">아래 정보를 남겨주시면 캠페인 매니저가 연락드립니다.</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label">이름 *</label>
            <input
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">이메일 *</label>
            <input
              type="email"
              className="admin-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="admin-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="admin-label">주 활동 SNS</label>
              <select
                className="admin-select"
                value={form.sns_platform}
                onChange={(e) => setForm({ ...form, sns_platform: e.target.value })}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="etc">기타</option>
              </select>
            </div>
            <div>
              <label className="admin-label">팔로워 수</label>
              <select
                className="admin-select"
                value={form.follower_count}
                onChange={(e) => setForm({ ...form, follower_count: e.target.value })}
              >
                <option>1K 미만</option>
                <option>1K-10K</option>
                <option>10K-50K</option>
                <option>50K-100K</option>
                <option>100K 이상</option>
              </select>
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">SNS 계정</label>
            <input
              className="admin-input"
              value={form.sns_handle}
              onChange={(e) => setForm({ ...form, sns_handle: e.target.value })}
              placeholder="@your_handle"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">관심 국가</label>
            <select
              className="admin-select"
              value={form.country_interest}
              onChange={(e) => setForm({ ...form, country_interest: e.target.value })}
            >
              <option value="">선택해주세요</option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name_ko} ({c.name_en})</option>
              ))}
              <option value="any">상관없음</option>
            </select>
          </div>
          <div className="admin-field">
            <label className="admin-label">메시지</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="추가로 전하고 싶은 내용이 있다면 적어주세요."
            />
          </div>

          <button
            type="submit"
            className="admin-btn"
            style={{ width: '100%', padding: '14px', fontSize: 15 }}
            disabled={submitting}
          >
            {submitting ? '제출 중...' : '신청 보내기'}
          </button>
        </form>
      </div>
    </div>
  );
}
