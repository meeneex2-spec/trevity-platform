-- ===================================================================
-- Migration: site_texts 테이블 추가 (랜딩 문구 override)
-- 코드(dictionaries.ts)의 기본 문구 위에 DB 값을 덮어써서
-- 관리자에서 코드 수정 없이 사이트 문구를 편집할 수 있게 함.
--
-- key 형식: "section.field"  (예: hero.title1, content.desc, footer.tagline)
-- value 가 없으면(행이 없으면) 코드 기본값이 그대로 표시됨.
-- 관리자에서 기본값과 동일하게 되돌리면 해당 행은 삭제되어 코드 기본값으로 복귀.
--
-- Supabase SQL Editor 에 통째로 붙여넣고 Run.
-- ===================================================================

create table if not exists public.site_texts (
  locale     text not null,
  key        text not null,
  value      text not null default '',
  updated_at timestamptz not null default now(),
  primary key (locale, key)
);

-- updated_at 자동 갱신 (set_updated_at 함수는 메인 schema.sql 에서 생성됨)
drop trigger if exists trg_site_texts_updated on public.site_texts;
create trigger trg_site_texts_updated before update on public.site_texts
  for each row execute function public.set_updated_at();

-- RLS: 누구나 읽기(랜딩 표시용), 로그인 관리자만 쓰기
alter table public.site_texts enable row level security;
create policy "public read site_texts" on public.site_texts for select using (true);
create policy "auth all site_texts"    on public.site_texts for all to authenticated using (true) with check (true);
