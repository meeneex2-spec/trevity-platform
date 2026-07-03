/**
 * 영상 링크(YouTube/TikTok)에서 조회수·좋아요 수를 API 키 없이 조회 (서버 전용).
 * - YouTube: Return YouTube Dislike API(조회수+좋아요) → 실패 시 watch 페이지에서 조회수만
 * - TikTok: 영상 페이지 JSON 에서 playCount/diggCount (사진 게시물은 통계 없음)
 * - Instagram: 인증 필요 → 지원 안 함 (null)
 * 실패해도 throw 하지 않고 null 반환 — 관리자가 수동 입력으로 대체.
 */

export type ReelStats = { views: number | null; likes: number | null };

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** 1461068 → '1.5M', 87161 → '87.2K', 950 → '950' */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

async function fetchText(url: string, timeoutMs = 7000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function youtubeStats(videoId: string): Promise<ReelStats> {
  // 1차: RYD API (조회수 + 좋아요)
  const ryd = await fetchText(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
  if (ryd) {
    try {
      const data = JSON.parse(ryd) as { viewCount?: number; likes?: number };
      if (typeof data.viewCount === 'number' && data.viewCount > 0) {
        return {
          views: data.viewCount,
          likes: typeof data.likes === 'number' && data.likes > 0 ? data.likes : null,
        };
      }
    } catch { /* fallthrough */ }
  }
  // 2차: watch 페이지에서 조회수만
  const html = await fetchText(`https://www.youtube.com/watch?v=${videoId}&hl=en`);
  const m = html?.match(/"viewCount":"(\d+)"/);
  return { views: m ? Number(m[1]) : null, likes: null };
}

async function tiktokStats(url: string): Promise<ReelStats> {
  const html = await fetchText(url.split('?')[0]);
  if (!html) return { views: null, likes: null };
  // 해당 게시물의 stats 블록 (첫 번째)
  const block = html.match(/"stats"\s*:\s*\{[^{}]*\}/)?.[0] ?? html;
  const play = block.match(/"playCount"\s*:\s*(\d+)/);
  const digg = block.match(/"diggCount"\s*:\s*(\d+)/);
  return {
    views: play ? Number(play[1]) : null,
    likes: digg ? Number(digg[1]) : null,
  };
}

export async function fetchReelStats(url: string): Promise<ReelStats> {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return youtubeStats(yt[1]);
  if (/tiktok\.com\//.test(url)) return tiktokStats(url);
  return { views: null, likes: null };
}
