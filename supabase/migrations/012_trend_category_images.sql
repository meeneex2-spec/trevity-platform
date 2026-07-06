-- ===================================================================
-- Migration: 트렌드 카테고리 4종 대표 이미지 (2026-07-06 프로덕션 반영 완료)
-- 재구축 시에만 실행하면 됨.
-- ===================================================================

update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop' where slug = 'new-beauty'; -- 화장품 플랫레이
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&q=80&auto=format&fit=crop' where slug = 'fnb';        -- 과일 음료
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80&auto=format&fit=crop' where slug = 'tech';       -- 네온 배경 스마트폰
update public.campaign_categories set image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&auto=format&fit=crop' where slug = 'popup';      -- 편집숍/스토어
