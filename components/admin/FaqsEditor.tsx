'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type Faq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

export default function FaqsEditor({ initial }: { initial: Faq[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Faq[]>(initial);
  const [newRow, setNewRow] = useState({ question: '', answer: '', sort_order: 99, is_active: true });

  const update = (id: number, patch: Partial<Faq>) => setRows(rows.map((r) => r.id === id ? { ...r, ...patch } : r));

  const save = async (row: Faq) => {
    const supabase = createClient();
    const { error } = await supabase.from('faqs').update({
      question: row.question, answer: row.answer, sort_order: row.sort_order, is_active: row.is_active,
    }).eq('id', row.id);
    if (error) { toast.error(`저장 실패: ${error.message}`); return; }
    toast.success('정상적으로 수정되었습니다');
    router.refresh();
  };

  const del = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) { toast.error(`삭제 실패: ${error.message}`); return; }
    toast.success('삭제되었습니다');
    router.refresh();
  };

  const add = async () => {
    if (!newRow.question || !newRow.answer) { toast.error('질문과 답변은 필수입니다.'); return; }
    const supabase = createClient();
    const { error } = await supabase.from('faqs').insert(newRow);
    if (error) { toast.error(`추가 실패: ${error.message}`); return; }
    toast.success('정상적으로 추가되었습니다');
    setNewRow({ question: '', answer: '', sort_order: 99, is_active: true });
    router.refresh();
  };

  return (
    <>
      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>FAQ 목록</h3>
        {rows.map((r) => (
          <div key={r.id} style={{ borderBottom: '1px solid #E2E8F0', padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 60px 200px', gap: 12, alignItems: 'start' }}>
              <input className="admin-input" type="number" value={r.sort_order} onChange={(e) => update(r.id, { sort_order: Number(e.target.value) })} />
              <div>
                <input className="admin-input" style={{ marginBottom: 8, fontWeight: 600 }} value={r.question} onChange={(e) => update(r.id, { question: e.target.value })} />
                <textarea className="admin-textarea" rows={2} value={r.answer} onChange={(e) => update(r.id, { answer: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <input type="checkbox" checked={r.is_active} onChange={(e) => update(r.id, { is_active: e.target.checked })} /> 활성
              </label>
              <div>
                <button className="admin-btn" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => save(r)}>저장</button>
                &nbsp;
                <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => del(r.id)}>삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>+ 새 FAQ 추가</h3>
        <div className="admin-field">
          <label className="admin-label">질문</label>
          <input className="admin-input" value={newRow.question} onChange={(e) => setNewRow({ ...newRow, question: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">답변</label>
          <textarea className="admin-textarea" rows={3} value={newRow.answer} onChange={(e) => setNewRow({ ...newRow, answer: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">정렬 순서</label>
          <input className="admin-input" type="number" style={{ width: 100 }} value={newRow.sort_order} onChange={(e) => setNewRow({ ...newRow, sort_order: Number(e.target.value) })} />
        </div>
        <button className="admin-btn" onClick={add}>추가</button>
      </div>
    </>
  );
}
