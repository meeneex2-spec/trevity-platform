-- ===================================================================
-- Migration: 트렌드 체험 확장 (2026-07-06 프로덕션 DB 반영 완료)
-- Travel+Activity → Trend+Activity 리포지셔닝에 따른 데이터 추가.
-- 재구축 시에만 실행하면 됨. (문구/번역은 코드 dictionaries.ts 에서 변경)
-- ===================================================================

-- 제품 체험 카테고리 4종
insert into public.campaign_categories (slug, icon, name, description, size, sort_order) values
  ('new-beauty', '🧴', '신제품 뷰티',  '신상 화장품·스킨케어를 가장 먼저 체험', 'normal', 7),
  ('fnb',        '🥤', 'F&B 신제품',   '음료·스낵 등 신제품 시식 체험',        'normal', 8),
  ('tech',       '📱', '테크·가젯',    '전자기기·가젯 신제품 리뷰',            'normal', 9),
  ('popup',      '🛍️', '팝업·전시',    '팝업스토어·전시·이벤트 방문 체험',     'normal', 10)
on conflict (slug) do nothing;

-- 제품 체험 FAQ
insert into public.faqs (question, answer, sort_order)
select '제품 체험 캠페인은 어떻게 진행되나요?',
       '캠페인에 선정되면 브랜드가 제품을 배송해 드립니다. 제품을 체험한 뒤 가이드에 따라 SNS 콘텐츠를 업로드하면 됩니다. 여행 없이 어디서든 참여할 수 있습니다.',
       5
where not exists (select 1 from public.faqs where question = '제품 체험 캠페인은 어떻게 진행되나요?');
