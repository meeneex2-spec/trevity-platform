'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import {
  dictionaries,
  flattenDictionary,
  LOCALES,
  type Dictionary,
  type Locale,
} from '@/lib/i18n/dictionaries';

type Row = { locale: string; key: string; value: string };

const LOCALE_LABELS: Record<Locale, string> = {
  ko: '🇰🇷 한국어',
  en: '🇺🇸 English',
  ja: '🇯🇵 日本語',
  zh: '🇨🇳 中文',
  vi: '🇻🇳 Tiếng Việt',
  th: '🇹🇭 ไทย',
  my: '🇲🇲 မြန်မာ',
};

const SECTION_LABELS: Record<string, string> = {
  nav: '내비게이션',
  hero: '히어로 (첫 화면)',
  what: 'WHAT IS TREVITY 섹션',
  regions: '국가(Regions) 섹션',
  campaigns: '캠페인 섹션',
  how: '이용 방법 (HOW IT WORKS)',
  benefits: '크리에이터 혜택',
  content: '크리에이터 콘텐츠 (Reels) 섹션',
  faq: 'FAQ 섹션',
  finalCta: '마지막 CTA',
  footer: '푸터',
  common: '공통',
};

// dictionary 구조 순서를 그대로 사용 (섹션 → 필드)
const SECTION_ORDER = Object.keys(dictionaries.ko) as (keyof Dictionary)[];

export default function SiteTextsEditor({
  initial,
  tableMissing,
}: {
  initial: Row[];
  tableMissing: boolean;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('ko');
  const [saving, setSaving] = useState(false);

  // 코드 기본값 (locale 별 평면 맵) — 편집 화면의 기준값
  const defaults = useMemo(() => {
    const map = {} as Record<Locale, Record<string, string>>;
    for (const l of LOCALES) map[l] = flattenDictionary(dictionaries[l]);
    return map;
  }, []);

  // 현재 편집값: override 가 있으면 그 값, 없으면 코드 기본값
  const [values, setValues] = useState<Record<Locale, Record<string, string>>>(() => {
    const map = {} as Record<Locale, Record<string, string>>;
    for (const l of LOCALES) map[l] = { ...defaults[l] };
    for (const row of initial) {
      const l = row.locale as Locale;
      if (map[l] && row.key in map[l]) map[l][row.key] = row.value;
    }
    return map;
  });

  const setValue = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: v } }));

  const resetField = (key: string) => setValue(key, defaults[locale][key]);

  // 현재 locale 에서 기본값과 달라진(=override 대상) 항목 수
  const changedCount = useMemo(
    () =>
      Object.keys(defaults[locale]).filter(
        (k) => (values[locale][k] ?? '') !== defaults[locale][k]
      ).length,
    [values, defaults, locale]
  );

  const save = async () => {
    setSaving(true);
    const supabase = createClient();

    const toUpsert: Row[] = [];
    const toDelete: string[] = [];
    for (const key of Object.keys(defaults[locale])) {
      const v = values[locale][key] ?? '';
      if (v !== defaults[locale][key]) toUpsert.push({ locale, key, value: v });
      else toDelete.push(key); // 기본값과 같으면 override 제거 → 코드 기본값으로 복귀
    }

    if (toUpsert.length) {
      const { error } = await supabase
        .from('site_texts')
        .upsert(toUpsert, { onConflict: 'locale,key' });
      if (error) {
        toast.error(`저장 실패: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    if (toDelete.length) {
      const { error } = await supabase
        .from('site_texts')
        .delete()
        .eq('locale', locale)
        .in('key', toDelete);
      if (error) {
        toast.error(`정리 실패: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    toast.success(`${LOCALE_LABELS[locale]} 문구가 저장되었습니다.`);
    setSaving(false);
    router.refresh();
  };

  return (
    <>
      {tableMissing && (
        <div
          className="admin-card"
          style={{ borderLeft: '4px solid #F59E0B', background: '#FFFBEB' }}
        >
          <b>⚠️ site_texts 테이블이 아직 없습니다.</b>
          <p style={{ marginTop: 8, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
            Supabase → SQL Editor 에서{' '}
            <code>supabase/migrations/008_site_texts.sql</code> 을 실행하세요. 실행 전에는 편집·저장이
            동작하지 않습니다.
          </p>
        </div>
      )}

      <div
        className="admin-card"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`admin-btn ${l === locale ? '' : 'admin-btn-secondary'}`}
              style={{ fontSize: 13, padding: '6px 12px' }}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            변경된 항목 <b style={{ color: '#2563EB' }}>{changedCount}</b>개
          </span>
          <button className="admin-btn" onClick={save} disabled={saving || tableMissing}>
            {saving ? '저장 중...' : `${LOCALE_LABELS[locale]} 저장`}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>
          💡 문구를 수정하고 위 <b>저장</b> 버튼을 누르세요. 기본값으로 되돌리려면 <b>↩ 기본값</b>을
          누르면 됩니다. 저장 후 홈페이지는 최대 1분 내 반영됩니다.
        </p>
      </div>

      {SECTION_ORDER.map((section) => {
        const fields = Object.keys(dictionaries.ko[section] as Record<string, string>);
        return (
          <div className="admin-card" key={section}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
              {SECTION_LABELS[section] ?? section}{' '}
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>({section})</span>
            </h3>
            <div style={{ display: 'grid', gap: 14 }}>
              {fields.map((field) => {
                const key = `${section}.${field}`;
                const isChanged = (values[locale][key] ?? '') !== defaults[locale][key];
                return (
                  <div key={key} style={{ display: 'grid', gap: 4 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <label
                        style={{ fontSize: 12, fontWeight: 600, color: '#334155', fontFamily: 'monospace' }}
                      >
                        {field}
                        {isChanged && (
                          <span style={{ color: '#F59E0B', marginLeft: 6, fontFamily: 'sans-serif' }}>
                            ● 변경됨
                          </span>
                        )}
                      </label>
                      {isChanged && (
                        <button
                          type="button"
                          onClick={() => resetField(key)}
                          style={{
                            fontSize: 11,
                            color: '#64748B',
                            background: 'none',
                            border: '1px solid #E2E8F0',
                            borderRadius: 4,
                            padding: '2px 8px',
                            cursor: 'pointer',
                          }}
                        >
                          ↩ 기본값
                        </button>
                      )}
                    </div>
                    {locale !== 'ko' && (
                      <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'pre-line' }}>
                        🇰🇷 {defaults.ko[key]}
                      </div>
                    )}
                    <textarea
                      className="admin-input"
                      rows={(values[locale][key] ?? '').length > 60 || (values[locale][key] ?? '').includes('\n') ? 3 : 1}
                      value={values[locale][key] ?? ''}
                      onChange={(e) => setValue(key, e.target.value)}
                      style={{ resize: 'vertical', width: '100%', lineHeight: 1.5 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="admin-card" style={{ textAlign: 'right' }}>
        <button className="admin-btn" onClick={save} disabled={saving || tableMissing}>
          {saving ? '저장 중...' : `${LOCALE_LABELS[locale]} 저장`}
        </button>
      </div>
    </>
  );
}
