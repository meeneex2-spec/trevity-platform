import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchReelStats, formatCount } from '@/lib/stats';

/**
 * 영상 링크의 조회수·좋아요 자동 조회 (관리자 전용).
 * GET /api/reel-stats?url=https://www.youtube.com/watch?v=...
 * → { views, likes, views_text, likes_text }  (조회 불가 항목은 null)
 */
export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get('url');
  if (!url || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: 'url 파라미터가 올바르지 않습니다.' }, { status: 400 });
  }

  const stats = await fetchReelStats(url);
  return NextResponse.json({
    views: stats.views,
    likes: stats.likes,
    views_text: stats.views != null ? formatCount(stats.views) : null,
    likes_text: stats.likes != null ? formatCount(stats.likes) : null,
  });
}
