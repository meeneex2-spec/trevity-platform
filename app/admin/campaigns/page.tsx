import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function CampaignsListPage() {
  const supabase = createClient();
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, slug, title, status, published_at, created_at, campaign_categories(name), countries(name_en, flag)')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>캠페인 목록 ({campaigns?.length ?? 0})</h3>
        <Link href="/admin/campaigns/new" className="admin-btn">+ 새 캠페인</Link>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <p style={{ color: '#64748B', fontSize: 14 }}>등록된 캠페인이 없습니다. 첫 캠페인을 만들어보세요.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>국가</th>
              <th>상태</th>
              <th>등록일</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c: any) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td>{c.campaign_categories?.name ?? '—'}</td>
                <td>{c.countries ? `${c.countries.flag} ${c.countries.name_en}` : '—'}</td>
                <td>
                  <span className={`admin-badge admin-badge-${c.status === 'published' ? 'done' : c.status === 'closed' ? 'contacted' : 'new'}`}>
                    {c.status === 'draft' ? '임시' : c.status === 'published' ? '발행' : '종료'}
                  </span>
                </td>
                <td>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                <td>
                  <Link href={`/admin/campaigns/edit/${c.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 10px' }}>편집</Link>
                  &nbsp;
                  <DeleteButton table="campaigns" id={c.id} confirmText="이 캠페인을 삭제하시겠습니까?" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
