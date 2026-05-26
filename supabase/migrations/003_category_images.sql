-- ===================================================================
-- Migration: campaign_categories 테이블에 image_url 컬럼 추가
-- 6개 카테고리별 대표 이미지 시드 (Unsplash 무료 라이선스)
-- Supabase SQL Editor 에 통째로 붙여넣고 Run.
-- ===================================================================

alter table public.campaign_categories
  add column if not exists image_url text;

update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80&auto=format&fit=crop' where slug = 'hotels';
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop' where slug = 'massage';
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop' where slug = 'restaurants';
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop' where slug = 'cafes';
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop' where slug = 'beauty';
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80&auto=format&fit=crop' where slug = 'activities';
