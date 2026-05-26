'use client';

import { useEffect } from 'react';

/**
 * Windows 에서 국기 이모지가 텍스트(KR, JP)로 보이는 문제 해결.
 * 페이지 마운트 직후 + DOM 변화 감지 시 이모지를 Twitter SVG 로 자동 변환.
 *
 * 주의: parse() 가 새 <img> 노드를 추가하므로 MutationObserver 와 결합 시
 *       무한 루프 발생 → disconnect/observe 토글 + 디바운스로 차단.
 */
export default function TwemojiBoot() {
  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      const twemoji = (await import('twemoji')).default;
      if (cancelled) return;

      const parseAll = () => {
        // observer 를 잠시 끄고 parse, 끝나면 다시 켬 — 자기변경 무한루프 차단
        if (observer) observer.disconnect();
        twemoji.parse(document.body, {
          folder: 'svg',
          ext: '.svg',
          base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/',
          className: 'twemoji',
        });
        if (observer && !cancelled) {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      };

      // 초기 1회
      parseAll();

      // 동적 콘텐츠(모달, FAQ 펼침)도 변환 — 단 디바운스 200ms
      observer = new MutationObserver((mutations) => {
        // 우리가 만든 .twemoji 노드 추가는 무시 (이미 변환됨)
        const hasMeaningful = mutations.some((m) =>
          Array.from(m.addedNodes).some((n) => {
            if (!(n instanceof HTMLElement)) return n.nodeType === Node.TEXT_NODE;
            if (n.classList?.contains('twemoji')) return false;
            return true;
          })
        );
        if (!hasMeaningful) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(parseAll, 200);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    })();

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  return null;
}
