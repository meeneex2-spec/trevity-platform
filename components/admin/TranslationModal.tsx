'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LOCALES, type Locale } from '@/lib/i18n/dictionaries';

/**
 * DB 콘텐츠(카테고리/FAQ/릴스) 행 하나의 언어별 번역 편집 모달.
 * 번역은 storage JSON(/api/site-texts)에 저장 — 비우면 기본값(코드 번역 또는 한국어)으로 표시.
 */

export type TranslationField = {
  key: string;        // 예: "faq.12.question"
  label: string;      // 예: "질문"
  base: string;       // 한국어 원본 (참고 표시)
  multiline?: boolean;
};

const EDIT_LOCALES = LOCALES.filter((l) => l !== 'ko') as Locale[];

const LOCALE_LABELS: Record<string, string> = {
  en: '🇺🇸 English',
  ja: '🇯🇵 日本語',
  zh: '🇨🇳 中文',
  vi: '🇻🇳 Tiếng Việt',
  th: '🇹🇭 ไทย',
  my: '🇲🇲 မြန်မာ',
};

export default function TranslationModal({
  title,
  fields,
  onClose,
}: {
  title: string;
  fields: TranslationField[];
  onClose: () => void;
}) {
  const [locale, setLocale] = useState<Locale>('en');
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 현재 저장된 번역 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/site-texts');
        const data = res.ok ? await res.json() : {};
        const init: Record<string, Record<string, string>> = {};
        for (const l of EDIT_LOCALES) {
          init[l] = {};
          for (const f of fields) init[l][f.key] = data?.[l]?.[f.key] ?? '';
        }
        setValues(init);
      } catch {
        toast.error('번역 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: v } }));

  const filledCount = (l: Locale) =>
    fields.filter((f) => (values[l]?.[f.key] ?? '').trim()).length;

  const save = async () => {
    setSaving(true);
    try {
      // 언어별로 순차 저장 (같은 JSON 파일이라 병렬 저장 금지)
      for (const l of EDIT_LOCALES) {
        const entries: Record<string, string | null> = {};
        for (const f of fields) {
          const v = (values[l]?.[f.key] ?? '').trim();
          entries[f.key] = v ? values[l][f.key] : null;
        }
        const res = await fetch('/api/site-texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: l, entries }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? `저장 실패 (${LOCALE_LABELS[l]})`);
        }
      }
      toast.success('번역이 저장되었습니다. 사이트에는 1분 내 반영됩니다.');
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trv-edit-backdrop" onClick={() => !saving && onClose()}>
      <div
        className="trv-edit-panel"
        style={{ width: 'min(680px, 100%)', maxHeight: '86vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trv-edit-panel-head">
          <b>🌐 번역 — {title}</b>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {EDIT_LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              className={`admin-btn ${l === locale ? '' : 'admin-btn-secondary'}`}
              style={{ fontSize: 13, padding: '6px 12px' }}
              onClick={() => setLocale(l)}
            >
              {LOCALE_LABELS[l]}
              {filledCount(l) > 0 && (
                <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.8 }}>({filledCount(l)})</span>
              )}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
          비워두면 해당 언어에서는 기본값(기존 번역 또는 한국어)이 표시됩니다. 한국어 원본은 목록 화면에서 직접 수정하세요.
        </p>

        {loading ? (
          <p style={{ fontSize: 13, color: '#64748B' }}>불러오는 중...</p>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {fields.map((f) => (
              <div key={f.key} style={{ display: 'grid', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{f.label}</label>
                <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'pre-line' }}>🇰🇷 {f.base}</div>
                {f.multiline ? (
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={values[locale]?.[f.key] ?? ''}
                    placeholder={`${LOCALE_LABELS[locale]} 번역 입력`}
                    onChange={(e) => setValue(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="admin-input"
                    value={values[locale]?.[f.key] ?? ''}
                    placeholder={`${LOCALE_LABELS[locale]} 번역 입력`}
                    onChange={(e) => setValue(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="trv-edit-panel-actions">
          <div style={{ flex: 1 }} />
          <button type="button" className="trv-btn-ghost" disabled={saving} onClick={onClose}>
            취소
          </button>
          <button type="button" className="trv-btn-save" disabled={saving || loading} onClick={save}>
            {saving ? '저장 중...' : '전체 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
