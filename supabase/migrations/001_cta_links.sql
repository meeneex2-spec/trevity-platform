-- ===================================================================
-- Migration: cta_links 테이블 추가 (언어별 CTA 외부 링크)
-- Supabase SQL Editor 에 통째로 붙여넣고 Run.
-- 이미 메인 schema.sql 을 실행한 프로젝트에 추가 적용용.
-- ===================================================================

create table if not exists public.cta_links (
  locale     text primary key,
  url        text not null default '#',
  updated_at timestamptz not null default now()
);

-- 시드 (6개 언어 — 기본값은 trevity.com, 추후 어드민에서 수정)
insert into public.cta_links (locale, url) values
  ('ko', 'https://kr.trevity.com'),
  ('en', 'https://trevity.com'),
  ('ja', 'https://jp.trevity.com'),
  ('zh', 'https://cn.trevity.com'),
  ('vi', 'https://vn.trevity.com'),
  ('th', 'https://th.trevity.com')
on conflict (locale) do nothing;

-- updated_at 자동 갱신
drop trigger if exists trg_cta_links_updated on public.cta_links;
create trigger trg_cta_links_updated before update on public.cta_links
  for each row execute function public.set_updated_at();

-- RLS
alter table public.cta_links enable row level security;
create policy "public read cta_links" on public.cta_links for select using (true);
create policy "auth all cta_links"    on public.cta_links for all to authenticated using (true) with check (true);
