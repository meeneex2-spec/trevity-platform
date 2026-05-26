import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const [campaignsCount, inquiriesNew, inquiriesTotal, recentInquiries] = await Promise.all([
    supabase.from('campaigns').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id, name, email, sns_handle, created_at, status').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: '발행된 캠페인', value: campaignsCount.count ?? 0, href: '/admin/campaigns' },
    { label: '신규 문의',     value: inquiriesNew.count ?? 0,  href: '/admin/inquiries?status=new' },
    { label: '누적 문의',     value: inquiriesTotal.count ?? 0, href: '/admin/inquiries' },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="admin-card" style={{ margin: 0, cursor: 'pointer' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>최근 문의</h3>
          <Link href="/admin/inquiries" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>
            전체 보기 →
          </Link>
        </div>
        {(recentInquiries.data ?? []).length === 0 ? (
          <p style={{ color: '#64748B', fontSize: 14 }}>아직 문의가 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>SNS</th>
                <th>상태</th>
                <th>접수일</th>
              </tr>
            </thead>
            <tbody>
              {(recentInquiries.data ?? []).map((i: any) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.email}</td>
                  <td>{i.sns_handle ?? '—'}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${i.status === 'new' ? 'new' : i.status === 'done' ? 'done' : 'contacted'}`}>
                      {i.status === 'new' ? '신규' : i.status === 'contacted' ? '연락중' : i.status === 'done' ? '완료' : i.status}
                    </span>
                  </td>
                  <td>{new Date(i.created_at).toLocaleString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
