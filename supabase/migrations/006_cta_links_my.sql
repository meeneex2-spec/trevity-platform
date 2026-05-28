-- ===================================================================
-- Migration: cta_links 에 미얀마어(my) row 추가
-- ===================================================================

insert into public.cta_links (locale, url) values
  ('my', 'https://mm.trevity.com')
on conflict (locale) do nothing;
