-- ===================================================================
-- Migration: 국가 카드에 미얀마 추가 (2026-07-02 프로덕션 DB 반영 완료)
-- 이미지: 쉐다곤 파고다 야경 (Unsplash), 링크: mm.trevity.com
-- 재구축 시에만 실행하면 됨.
-- ===================================================================

insert into public.countries (slug, flag, name_en, name_ko, city, image_url, target_url, sort_order, is_active)
values (
  'myanmar', '🇲🇲', 'Myanmar', '미얀마', 'Yangon',
  'https://images.unsplash.com/photo-1523131992001-c485ccc0d326?w=800&q=80&auto=format&fit=crop',
  'https://mm.trevity.com',
  9, true
)
on conflict (slug) do update set
  image_url  = excluded.image_url,
  target_url = excluded.target_url,
  is_active  = true;
