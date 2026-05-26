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

  // TikTok
  const tt = url.match(/tiktok\.com\/(?:@[\w.\-]+\/video\/|embed\/v2\/|v\/)(\d+)/);
  if (tt) return { type: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tt[1]}`, thumbUrl: null };

  return { type: 'other', embedUrl: null, thumbUrl: null };
}
