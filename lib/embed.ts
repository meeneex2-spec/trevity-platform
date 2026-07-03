/**
 * SNS URL 을 받아 임베드 가능한 iframe URL 로 변환.
 * 지원: YouTube (watch / shorts / youtu.be), Instagram (p / reel / tv), TikTok (@user/video/id).
 */
export type EmbedType = 'youtube' | 'instagram' | 'tiktok' | 'other';

export type EmbedInfo = {
  type: EmbedType;
  embedUrl: string | null;
  thumbUrl: string | null;        // 자동 추출 가능한 썸네일 (YouTube 만)
};

export function parseEmbed(url: string | null | undefined): EmbedInfo {
  if (!url) return { type: 'other', embedUrl: null, thumbUrl: null };

  // YouTube (watch?v=ID, shorts/ID, youtu.be/ID, embed/ID)
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`,
      thumbUrl: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
    };
  }

  // Instagram (p / reel / tv)
  const ig = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (ig) return { type: 'instagram', embedUrl: `https://www.instagram.com/p/${ig[1]}/embed/?cr=1&v=14`, thumbUrl: null };

  // TikTok (영상 video / 사진 photo 게시물 모두)
  const tt = url.match(/tiktok\.com\/(?:@[\w.\-]+\/(?:video|photo)\/|embed\/v2\/|v\/)(\d+)/);
  if (tt) return { type: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tt[1]}`, thumbUrl: null };

  return { type: 'other', embedUrl: null, thumbUrl: null };
}

/**
 * TikTok 공개 oEmbed 로 썸네일 URL 을 조회 (서버 전용, 토큰 불필요).
 * 실패하거나 TikTok 링크가 아니면 null. 결과는 1시간 캐시.
 */
export async function fetchTikTokThumb(url: string | null | undefined): Promise<string | null> {
  if (!url || !/tiktok\.com/.test(url)) return null;
  // 추적 쿼리스트링 제거 (oEmbed 가 원본 URL 만 인식).
  // 사진 게시물(/photo/)은 oEmbed 가 400 을 주지만 /video/ 로 바꿔 부르면 동작한다.
  const clean = url.split('?')[0].replace('/photo/', '/video/');
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(clean)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: unknown };
    return typeof data.thumbnail_url === 'string' ? data.thumbnail_url : null;
  } catch {
    return null;
  }
}
