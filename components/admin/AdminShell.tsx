'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const NAV = [
  { section: 'OVERVIEW', items: [
    { label: '대시보드', href: '/admin/dashboard', icon: '◆' },
  ]},
  { section: '콘텐츠', items: [
    { label: '사이트 문구', href: '/admin/site-texts', icon: '✏️' },
    { label: '캠페인', href: '/admin/campaigns', icon: '📋' },
    { label: '국가',   href: '/admin/countries', icon: '🌐' },
    { label: '카테고리', href: '/admin/categories', icon: '🏷' },
    { label: 'FAQ',    href: '/admin/faqs', icon: '❓' },
    { label: 'Reels',  href: '/admin/reels', icon: '🎬' },
  ]},
  { section: '운영', items: [
    { label: '문의함',    href: '/admin/inquiries', icon: '✉️' },
    { label: 'CTA 링크', href: '/admin/cta-links', icon: '🔗' },
  ]},
];

export default function AdminShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // 로그인 페이지는 shell 없이 그냥 children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('로그아웃되었습니다.');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">trevity admin</div>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="admin-sidebar-section">{group.section}</div>
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span style={{ width: 18, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, padding: '0 24px', display: 'grid', gap: 8 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ width: '100%', fontSize: 13, padding: '8px 12px', textAlign: 'center', textDecoration: 'none' }}
          >
            🏠 홈페이지 바로가기 ↗
          </a>
          <button
            onClick={handleLogout}
            className="admin-btn admin-btn-secondary"
            style={{ width: '100%', fontSize: 13, padding: '8px 12px' }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-title">
            {pathname === '/admin/dashboard' && '대시보드'}
            {pathname.startsWith('/admin/site-texts') && '사이트 문구'}
            {pathname.startsWith('/admin/campaigns') && '캠페인 관리'}
            {pathname.startsWith('/admin/countries') && '국가 관리'}
            {pathname.startsWith('/admin/categories') && '카테고리 관리'}
            {pathname.startsWith('/admin/faqs') && 'FAQ 관리'}
            {pathname.startsWith('/admin/reels') && 'Reels 관리'}
            {pathname.startsWith('/admin/inquiries') && '문의함'}
            {pathname.startsWith('/admin/cta-links') && 'CTA 링크'}
          </div>
          {user && (
            <div className="admin-user-chip">
              <span>👤</span>
              <span>{user.email}</span>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
