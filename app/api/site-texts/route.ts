import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_TEXTS_PATH, getTextOverrides } from '@/lib/siteTexts';
import { LOCALES } from '@/lib/i18n/dictionaries';

/**
 * 사이트 문구/콘텐츠 번역 override 조회 (관리자 전용 — 번역 편집 모달에서 사용).
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  return NextResponse.json(await getTextOverrides());
}

/**
 * 사이트 문구 override 저장 (storage JSON — DB 테이블/SQL 불필요).
 * body: { locale: 'ko', entries: { "hero.title1": "새 문구", "hero.desc": null } }
 * key 형식: "hero.title1"(사이트 문구) 또는 "faq.12.question"(DB 콘텐츠 번역).
 * value 가 null/빈문자면 해당 override 삭제(코드 기본값으로 복귀).
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  let body: { locale?: string; entries?: Record<string, string | null> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const locale = body.locale;
  const entries = body.entries;
  if (!locale || !(LOCALES as readonly string[]).includes(locale) || !entries || typeof entries !== 'object') {
    return NextResponse.json({ error: 'locale 또는 entries 가 올바르지 않습니다.' }, { status: 400 });
  }

  const overrides = await getTextOverrides();
  const map: Record<string, string> = { ...(overrides as Record<string, Record<string, string>>)[locale] };
  for (const [key, value] of Object.entries(entries)) {
    if (typeof key !== 'string' || !/^[a-zA-Z]+\.[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)?$/.test(key)) continue;
    if (value == null || value === '') delete map[key];
    else if (typeof value === 'string') map[key] = value;
  }
  const next = { ...overrides, [locale]: map } as Record<string, Record<string, string>>;
  if (Object.keys(map).length === 0) delete next[locale];

  const admin = createAdminClient();
  const blob = new Blob([JSON.stringify(next, null, 2)], { type: 'application/json' });
  const { error } = await admin.storage
    .from('campaign-images')
    .upload(SITE_TEXTS_PATH, blob, { contentType: 'application/json', cacheControl: '0', upsert: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, locale, count: Object.keys(map).length });
}
