-- ===================================================================
-- Migration: campaign-images 스토리지 업로드 권한 + site_texts 보장
--
-- 증상: 관리자에서 이미지 '파일 선택' 업로드가 안 됨 (버킷은 public 이지만
--       storage.objects 에 INSERT 정책이 없어 로그인 관리자도 업로드 불가).
-- 조치: 로그인(authenticated) 관리자에게 campaign-images 버킷 업로드/수정/삭제 허용,
--       공개 읽기 정책 명시.
--
-- Supabase → SQL Editor 에 통째로 붙여넣고 Run. (여러 번 실행해도 안전)
-- ===================================================================

-- ---- 1. 스토리지 업로드 권한 (campaign-images) ----
drop policy if exists "public read campaign-images"  on storage.objects;
create policy "public read campaign-images" on storage.objects
  for select using (bucket_id = 'campaign-images');

drop policy if exists "auth upload campaign-images"  on storage.objects;
create policy "auth upload campaign-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'campaign-images');

drop policy if exists "auth update campaign-images"  on storage.objects;
create policy "auth update campaign-images" on storage.objects
  for update to authenticated
  using (bucket_id = 'campaign-images') with check (bucket_id = 'campaign-images');

drop policy if exists "auth delete campaign-images"  on storage.objects;
create policy "auth delete campaign-images" on storage.objects
  for delete to authenticated using (bucket_id = 'campaign-images');

-- ---- 2. site_texts 테이블 보장 (008 미실행 대비, 이미 있으면 무시) ----
create table if not exists public.site_texts (
  locale     text not null,
  key        text not null,
  value      text not null default '',
  updated_at timestamptz not null default now(),
  primary key (locale, key)
);

drop trigger if exists trg_site_texts_updated on public.site_texts;
create trigger trg_site_texts_updated before update on public.site_texts
  for each row execute function public.set_updated_at();

alter table public.site_texts enable row level security;
drop policy if exists "public read site_texts" on public.site_texts;
create policy "public read site_texts" on public.site_texts for select using (true);
drop policy if exists "auth all site_texts" on public.site_texts;
create policy "auth all site_texts" on public.site_texts for all to authenticated using (true) with check (true);
