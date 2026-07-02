import { redirect } from 'next/navigation';

// /admin 접근 시 대시보드로 (미로그인 시 미들웨어가 /admin/login 으로 보냄)
export default function AdminIndex() {
  redirect('/admin/dashboard');
}
