-- ===================================================================
-- Migration: 6개 Reel 카드에 임의의 인기 여행 YouTube 영상 연결
-- 운영 시점에 실제 트래비티 크리에이터 콘텐츠로 교체 권장.
-- ===================================================================

update public.reels set link_url = 'https://www.youtube.com/watch?v=MY3Qy6vAbZQ' where location = '🇹🇭 Bangkok';   -- Mark Wiens × Nat Geo: 24 Hour Thai Street Food Challenge
update public.reels set link_url = 'https://www.youtube.com/watch?v=WARr0Vxu6rY' where location = '🇯🇵 Tokyo';     -- Abroad in Japan: Opened My Own Bar in Tokyo
update public.reels set link_url = 'https://www.youtube.com/watch?v=unTGXgUBbuQ' where location = '🇻🇳 Hanoi';     -- Best Ever Food Review Show: Hanoi Old Quarter Street Food
update public.reels set link_url = 'https://www.youtube.com/watch?v=_YgVQIVlfyU' where location = '🇰🇷 Seoul';     -- 6 Days in Seoul: Shopping, Cafes, Food
update public.reels set link_url = 'https://www.youtube.com/watch?v=HoanLffeA64' where location = '🇸🇬 Singapore'; -- Singapore Made Me Feel Like This
update public.reels set link_url = 'https://www.youtube.com/watch?v=5M-aDAZwYfo' where location = '🇹🇼 Taipei';    -- 2 Days in Taipei: Best Restaurants & Night Markets
