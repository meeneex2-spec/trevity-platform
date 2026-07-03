'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useT } from '@/lib/i18n/LanguageProvider';
import { dictionaries, flattenDictionary, type Locale } from '@/lib/i18n/dictionaries';

/**
 * 사이트에서 바로 수정 모드 (?edit=1).
 * 렌더된 문구 텍스트 노드를 찾아 점선 오버레이를 씌우고,
 * 클릭하면 그 자리에서 수정 → /api/site-texts 로 저장.
 * React 가 관리하는 DOM 구조는 건드리지 않고(텍스트 값만 교체) 오버레이는 별도 레이어에 그린다.
 */

type Target = {
  key: string;
  node: Text;
  top: number;
  left: number;
  width: number;
  height: number;
};

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

export default function InlineEditor() {
  const { locale, setLocale, t } = useT();
  const [enabled, setEnabled] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [editing, setEditing] = useState<{ key: string; node: Text; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 편집 모드 진입 판정 (?edit=1 + 로그인) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') !== '1') return;

    const lang = params.get('lang');
    if (lang && lang !== locale && lang in dictionaries) setLocale(lang as Locale);

    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/admin/login?redirect=${redirect}`;
        return;
      }
      setEnabled(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 문구 텍스트 노드 스캔 → 오버레이 좌표 계산 ──
  const scan = useCallback(() => {
    if (!enabled) return;
    const flat = flattenDictionary(t);

    // 같은 문구가 여러 key 에 쓰이면 어느 key 인지 알 수 없으므로 제외 (관리자 폼에서 수정)
    const valueToKey = new Map<string, string | null>();
    for (const [key, value] of Object.entries(flat)) {
      const v = norm(value);
      if (v.length < 2) continue;
      valueToKey.set(v, valueToKey.has(v) ? null : key);
    }

    const found: Target[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        if (el.closest('[data-trv-editor]')) return NodeFilter.FILTER_REJECT;
        const tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let n: Node | null;
    while ((n = walker.nextNode())) {
      const text = n as Text;
      const key = valueToKey.get(norm(text.nodeValue ?? ''));
      if (!key) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      const rect = range.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue; // display:none 등
      found.push({
        key,
        node: text,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
    setTargets(found);
  }, [enabled, t]);

  const scheduleScan = useCallback(() => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(scan, 200);
  }, [scan]);

  useEffect(() => {
    if (!enabled) return;
    scan();

    const onResize = () => scheduleScan();
    window.addEventListener('resize', onResize);

    // React 리렌더(언어 전환 등)로 텍스트 노드가 교체되면 다시 스캔
    const observer = new MutationObserver((mutations) => {
      const overlay = overlayRef.current;
      if (mutations.every((m) => overlay && overlay.contains(m.target))) return;
      scheduleScan();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // 폰트 로딩/이미지 로딩으로 레이아웃이 늦게 잡히는 경우 대비
    const late = setTimeout(scan, 1200);
    return () => {
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      clearTimeout(late);
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, [enabled, scan, scheduleScan]);

  // ── 저장 ──
  const save = async () => {
    if (!editing || saving) return;
    const newValue = editing.value;
    const defaults = flattenDictionary(dictionaries[locale]);
    // 기본값과 같아지면 override 삭제(null)
    const entryValue = norm(newValue) === norm(defaults[editing.key] ?? '') ? null : newValue;

    setSaving(true);
    try {
      const res = await fetch('/api/site-texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, entries: { [editing.key]: entryValue } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `저장 실패 (${res.status})`);

      // 화면에 즉시 반영 (텍스트 값만 교체 — React 구조는 그대로)
      if (editing.node.isConnected) editing.node.nodeValue = newValue;
      toast.success('저장되었습니다. 방문자에게는 1분 내 반영됩니다.');
      setEditing(null);
      scheduleScan();
    } catch (err: any) {
      toast.error(err.message ?? '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  if (!enabled) return null;

  return (
    <div data-trv-editor ref={overlayRef}>
      {/* 점선 오버레이 */}
      {targets.map((target, i) => (
        <button
          key={`${target.key}-${i}`}
          type="button"
          className="trv-edit-spot"
          style={{ top: target.top - 3, left: target.left - 5, width: target.width + 10, height: target.height + 6 }}
          title={`문구 수정: ${target.key}`}
          onClick={() =>
            setEditing({ key: target.key, node: target.node, value: target.node.nodeValue ?? '' })
          }
        />
      ))}

      {/* 수정 패널 */}
      {editing && (
        <div className="trv-edit-backdrop" onClick={() => !saving && setEditing(null)}>
          <div className="trv-edit-panel" onClick={(e) => e.stopPropagation()}>
            <div className="trv-edit-panel-head">
              <b>문구 수정</b>
              <code>{editing.key}</code>
            </div>
            <textarea
              autoFocus
              rows={Math.min(6, Math.max(2, Math.ceil(editing.value.length / 30)))}
              value={editing.value}
              onChange={(e) => setEditing({ ...editing, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
                if (e.key === 'Escape') setEditing(null);
              }}
            />
            <div className="trv-edit-panel-actions">
              <button
                type="button"
                className="trv-btn-ghost"
                disabled={saving}
                onClick={() => setEditing({ ...editing, value: flattenDictionary(dictionaries[locale])[editing.key] ?? '' })}
              >
                ↩ 기본값
              </button>
              <div style={{ flex: 1 }} />
              <button type="button" className="trv-btn-ghost" disabled={saving} onClick={() => setEditing(null)}>
                취소
              </button>
              <button type="button" className="trv-btn-save" disabled={saving} onClick={save}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 편집 모드 바 */}
      <div className="trv-edit-bar">
        <span>
          ✏️ <b>편집 모드</b> — 점선 문구를 클릭해 수정하세요
          <span className="trv-edit-count">{targets.length}곳 수정 가능</span>
        </span>
        <a href="/" className="trv-btn-exit">편집 종료</a>
      </div>
    </div>
  );
}
