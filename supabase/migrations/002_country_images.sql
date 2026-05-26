-- ===================================================================
-- Migration: countries 테이블에 image_url 컬럼 추가
-- 8개 국가별 대표 이미지 시드 (Unsplash 무료 라이선스)
-- Supabase SQL Editor 에 통째로 붙여넣고 Run.
-- ===================================================================

alter table public.countries
  add column if not exists image_url text;

-- 각 국가별 대표 이미지 시드
update public.countries set image_url = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80&auto=format&fit=crop' where slug = 'korea';
update public.countries set image_url = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80&auto=format&fit=crop' where slug = 'vietnam';
update public.countries set image_url = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&auto=format&fit=crop' where slug = 'japan';
update public.countries set image_url = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80&auto=format&fit=crop' where slug = 'thailand';
update public.countries set image_url = 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80&auto=format&fit=crop' where slug = 'taiwan';
update public.countries set image_url = 'https://images.unsplash.com/photo-1532455935509-eb76842cee50?w=800&q=80&auto=format&fit=crop' where slug = 'hongkong';
update public.countries set image_url = 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80&auto=format&fit=crop' where slug = 'singapore';
update public.countries set image_url = 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80&auto=format&fit=crop' where slug = 'philippines';
