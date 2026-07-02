/**
 * 관리자 이미지 업로드 헬퍼 (클라이언트 → /api/upload 서버 route).
 * 서버가 service_role 로 저장하므로 storage RLS 정책 없이도 동작.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* noop */
  }
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? `업로드 실패 (${res.status})`);
  }
  return data.url;
}
