'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(`로그인 실패: ${error.message}`);
      setSubmitting(false);
      return;
    }
    toast.success('로그인 성공');
    // 미들웨어가 인증 체크하므로 router refresh + push
    router.refresh();
    router.push(redirect);
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div style={{ fontSize: 26, fontWeight: 800, color: '#2563EB', textAlign: 'center', marginBottom: 4 }}>
          trevity
        </div>
        <h1 className="admin-login-title">관리자 로그인</h1>
        <p className="admin-login-sub">이메일과 비밀번호로 로그인하세요</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label">이메일</label>
            <input
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">비밀번호</label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="admin-btn"
            style={{ width: '100%', padding: '12px', fontSize: 15 }}
            disabled={submitting}
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
