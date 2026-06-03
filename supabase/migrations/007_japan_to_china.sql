-- ===================================================================
-- Migration: countries 의 'japan' row 를 'china' 로 변경
-- (Japan 제거 + China 추가)
-- ===================================================================

update public.countries
set
  slug       = 'china',
  flag       = '🇨🇳',
  name_en    = 'China',
  name_ko    = '중국',
  city       = 'Shanghai',
  image_url  = 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80&auto=format&fit=crop',
  target_url = 'https://cn.trevity.com'
where slug = 'japan';
