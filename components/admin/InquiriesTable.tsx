'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type Inquiry = {
  id: number;
  name: string;
  email: string;
  sns_platform: string | null;
  sns_handle: string | null;
  follower_count: string | null;
  country_interest: string | null;
  message: string | null;
  status: string;
  admin_memo: string | null;
  source: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: '신규', contacted: '연락중', done: '완료', spam: '스팸',
};
const STATUS_BADGE: Record<string, string> = {
  new: 'admin-badge-new', contacted: 'admin-badge-contacted', done: 'admin-badge-done', spam: 'admin-badge-contacted',
};

export default function InquiriesTable({ initial, currentFilter }: { initial: Inquiry[]; currentFilter: string }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const opened = initial.find((i) => i.id === openId);
  const [memo, setMemo] = useState('');

  const openDetail = (i: Inquiry) => {
    setOpenId(i.id);
    setMemo(i.admin_memo ?? '');
  };
  const closeDetail = () => setOpenId(null);

  const updateStatus = async (id: number, status: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) { toast.error(`상태 변경 실패: ${error.message}`); return; }
    toast.success(`상태를 "${STATUS_LABELS[status] ?? status}" 로 변경했습니다`);
    router.refresh();
  };

  const saveMemo = async () => {
    if (openId == null) return;
    const supabase = createClient();
    const { error } = await supabase.from('inquiries').update({ admin_memo: memo }).eq('id', openId);
    if (error) { toast.error(`메모 저장 실패: ${error.message}`); return; }
    toast.success('메모가 저장되었습니다');
    router.refresh();
  };

  const exportCsv = () => {
    const headers = ['ID', '이름', '이메일', 'SNS플랫폼', 'SNS계정', '팔로워', '관심국가', '메시지', '상태', '접수일'];
    const rows = initial.map((i) => [
      i.id, i.name, i.email, i.sns_platform ?? '', i.sns_handle ?? '',
      i.follower_count ?? '', i.country_interest ?? '', (i.message ?? '').replace(/\n/g, ' '),
      STATUS_LABELS[i.status] ?? i.status, new Date(i.created_at).toLocaleString('ko-KR'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trevity-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'new', 'contacted', 'done', 'spam'].map((s) => (
              <Link
                key={s}
                href={s === 'all' ? '/admin/inquiries' : `/admin/inquiries?status=${s}`}
                className={`admin-btn ${currentFilter === s ? '' : 'admin-btn-secondary'}`}
                style={{ fontSize: 13, padding: '6px 14px' }}
              >
                {s === 'all' ? '전체' : STATUS_LABELS[s]}
              </Link>
            ))}
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={exportCsv}>CSV 내보내기</button>
        </div>

        {initial.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: 14 }}>해당 조건의 문의가 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th><th>이메일</th><th>SNS</th><th>팔로워</th><th>관심국가</th><th>상태</th><th>접수일</th><th></th>
              </tr>
            </thead>
            <tbody>
              {initial.map((i) => (
                <tr key={i.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(i)}>
                  <td style={{ fontWeight: 600 }}>{i.name}</td>
                  <td>{i.email}</td>
                  <td>{i.sns_platform ? `${i.sns_platform} ${i.sns_handle ?? ''}` : '—'}</td>
                  <td>{i.follower_count ?? '—'}</td>
                  <td>{i.country_interest ?? '—'}</td>
                  <td><span className={`admin-badge ${STATUS_BADGE[i.status] ?? 'admin-badge-new'}`}>{STATUS_LABELS[i.status] ?? i.status}</span></td>
                  <td>{new Date(i.created_at).toLocaleString('ko-KR')}</td>
                  <td><span style={{ fontSize: 13, color: '#2563EB' }}>상세 →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {opened && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <button type="button" className="modal-close" onClick={closeDetail} aria-label="닫기">×</button>
            <h3 className="modal-title">문의 #{opened.id}</h3>
            <p className="modal-desc">접수: {new Date(opened.created_at).toLocaleString('ko-KR')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, fontSize: 14, marginBottom: 20 }}>
              <strong>이름</strong><span>{opened.name}</span>
              <strong>이메일</strong><span>{opened.email}</span>
              <strong>SNS</strong><span>{opened.sns_platform} {opened.sns_handle}</span>
              <strong>팔로워</strong><span>{opened.follower_count ?? '—'}</span>
              <strong>관심국가</strong><span>{opened.country_interest ?? '—'}</span>
              <strong>메시지</strong><span style={{ whiteSpace: 'pre-wrap' }}>{opened.message || '(없음)'}</span>
              <strong>출처</strong><span>{opened.source ?? 'landing_cta'}</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">상태 변경</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`admin-btn ${opened.status === key ? '' : 'admin-btn-secondary'}`}
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => updateStatus(opened.id, key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">관리자 메모</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="연락 결과, 후속 조치 등 메모"
              />
              <button className="admin-btn" style={{ marginTop: 8 }} onClick={saveMemo}>메모 저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
