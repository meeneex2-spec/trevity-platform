import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * 관리자 이미지 업로드. 로그인 확인 후 service_role 로 campaign-images 버킷에 저장.
 * (클라이언트에서 직접 storage 업로드 시 RLS 정책이 필요하지만, 서버 service_role 은 우회)
 */
export async function POST(request: Request) {
  // 로그인한 관리자만 허용
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  const folderRaw = form.get('folder');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  const folder =
    typeof folderRaw === 'string' && /^[a-z0-9_-]+$/.test(folderRaw) ? folderRaw : 'misc';
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from('campaign-images').upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = admin.storage.from('campaign-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
