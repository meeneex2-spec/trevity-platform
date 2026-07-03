import { createAdminClient } from '@/lib/supabase/admin';
import type { TextOverrides } from '@/lib/i18n/dictionaries';

/**
 * 사이트 문구 override 저장소 (Supabase Storage JSON).
 * DB 테이블(site_texts) 없이도 동작하도록 storage 파일 하나에 저장한다.
 * 구조: { [locale]: { "section.field": "값", ... } }
 */
export const SITE_TEXTS_PATH = 'site-texts/overrides.json';

export async function getTextOverrides(): Promise<TextOverrides> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from('campaign-images')
      .download(SITE_TEXTS_PATH);
    if (error || !data) return {};
    const parsed = JSON.parse(await data.text());
    return typeof parsed === 'object' && parsed !== null ? (parsed as TextOverrides) : {};
  } catch {
    return {};
  }
}
