-- ===================================================================
-- Migration: countries.target_url 컬럼 추가 + 8개 시드
-- 국가 카드 클릭 시 이동할 외부 URL (kr.trevity.com 등)
-- ===================================================================

alter table public.countries
  add column if not exists target_url text;

update public.countries set target_url = 'https://kr.trevity.com' where slug = 'korea';
update public.countries set target_url = 'https://vn.trevity.com' where slug = 'vietnam';
update public.countries set target_url = 'https://jp.trevity.com' where slug = 'japan';
update public.countries set target_url = 'https://th.trevity.com' where slug = 'thailand';
update public.countries set target_url = 'https://tw.trevity.com' where slug = 'taiwan';
update public.countries set target_url = 'https://hk.trevity.com' where slug = 'hongkong';
update public.countries set target_url = 'https://sg.trevity.com' where slug = 'singapore';
update public.countries set target_url = 'https://ph.trevity.com' where slug = 'philippines';
