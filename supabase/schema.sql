-- ===================================================================
-- Trevity Platform — Supabase Schema
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run.
-- ===================================================================

-- ------------------------------------------------------------------
-- 1. countries (랜딩의 "Global Regions" 섹션)
-- ------------------------------------------------------------------
create table if not exists public.countries (
  id          bigserial primary key,
  slug        text unique not null,
  flag        text not null,                -- 🇰🇷 같은 이모지
  name_en     text not null,                -- Korea
  name_ko     text not null,                -- 한국
  city        text not null,                -- Seoul
  image_url   text,                          -- 대표 이미지 (랜드마크/도시 사진)
  target_url  text,                          -- 카드 클릭 시 이동할 외부 URL (kr.trevity.com 등)
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 시드 (랜딩 HTML 기준)
insert into public.countries (slug, flag, name_en, name_ko, city, sort_order) values
  ('korea',       '🇰🇷', 'Korea',       '한국',       'Seoul',       1),
  ('vietnam',     '🇻🇳', 'Vietnam',     '베트남',     'Ho Chi Minh', 2),
  ('japan',       '🇯🇵', 'Japan',       '일본',       'Tokyo',       3),
  ('thailand',    '🇹🇭', 'Thailand',    '태국',       'Bangkok',     4),
  ('taiwan',      '🇹🇼', 'Taiwan',      '대만',       'Taipei',      5),
  ('hongkong',    '🇭🇰', 'Hong Kong',   '홍콩',       'HK Island',   6),
  ('singapore',   '🇸🇬', 'Singapore',   '싱가포르',   'Marina Bay',  7),
  ('philippines', '🇵🇭', 'Philippines', '필리핀',     'Manila',      8)
on conflict (slug) do nothing;

-- ------------------------------------------------------------------
-- 2. campaign_categories (호텔/스파/식당 등)
-- ------------------------------------------------------------------
create table if not exists public.campaign_categories (
  id          bigserial primary key,
  slug        text unique not null,
  icon        text not null,        -- 🏨
  name        text not null,        -- Hotels
  description text,                  -- 럭셔리 호텔부터 감성 숙소까지
  image_url   text,                  -- 대표 이미지 (랜딩 카드 배경)
  size        text not null default 'normal',  -- 'tall' / 'normal' (랜딩 그리드 변형)
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

insert into public.campaign_categories (slug, icon, name, description, size, sort_order) values
  ('hotels',      '🏨', 'Hotels',         '럭셔리 호텔부터 감성 숙소까지',   'tall',   1),
  ('massage',     '💆', 'Massage & Spa',  '현지 인기 마사지와 스파 체험',     'normal', 2),
  ('restaurants', '🍽️', 'Restaurants',    '트렌디한 맛집과 로컬 레스토랑',   'tall',   3),
  ('cafes',       '☕', 'Cafes',           '감성 카페와 디저트 스팟',         'normal', 4),
  ('beauty',      '💄', 'Beauty',         '뷰티 및 라이프스타일 브랜드',     'normal', 5),
  ('activities',  '🏄', 'Activities',     '투어, 액티비티, 체험 콘텐츠',     'normal', 6)
on conflict (slug) do nothing;

-- ------------------------------------------------------------------
-- 3. campaigns (실제 캠페인 항목 — 어드민이 발행)
-- ------------------------------------------------------------------
create table if not exists public.campaigns (
  id            bigserial primary key,
  slug          text unique not null,
  title         text not null,
  category_id   bigint references public.campaign_categories(id) on delete set null,
  country_id    bigint references public.countries(id) on delete set null,
  thumbnail_url text,
  summary       text,
  content_html  text,                -- Quill 결과물
  status        text not null default 'draft',  -- draft / published / closed
  is_featured   boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_country on public.campaigns(country_id);

-- ------------------------------------------------------------------
-- 4. faqs
-- ------------------------------------------------------------------
create table if not exists public.faqs (
  id          bigserial primary key,
  question    text not null,
  answer      text not null,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.faqs (question, answer, sort_order) values
  ('누구나 참여 가능한가요?',
   '캠페인에 따라 참여 조건이 다를 수 있습니다. 일반적으로 SNS 채널을 보유하고 있다면 지원이 가능하며, 팔로워 수나 콘텐츠 퀄리티 등을 기준으로 캠페인별 선발이 이루어집니다.', 1),
  ('어떤 SNS를 사용할 수 있나요?',
   'Instagram, TikTok, YouTube 등 다양한 플랫폼 참여가 가능합니다.', 2),
  ('외국인도 참여 가능한가요?',
   '네, 다양한 국가의 인플루언서가 참여하고 있습니다.', 3),
  ('비용이 발생하나요?',
   '트래비티 가입은 무료입니다. 캠페인 지원도 별도 비용 없이 이용할 수 있습니다.', 4);

-- ------------------------------------------------------------------
-- 5. reels (랜딩의 Creator Content)
-- ------------------------------------------------------------------
create table if not exists public.reels (
  id          bigserial primary key,
  thumb_url   text,
  location    text not null,        -- 🇹🇭 Bangkok
  views_text  text,                  -- '2.1M'
  likes_text  text,                  -- '142K'
  link_url    text,                  -- 외부 인스타/틱톡 링크 (선택)
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.reels (location, views_text, likes_text, sort_order) values
  ('🇹🇭 Bangkok',   '2.1M', '142K', 1),
  ('🇯🇵 Tokyo',     '890K', '67K',  2),
  ('🇻🇳 Hanoi',     '1.4M', '98K',  3),
  ('🇰🇷 Seoul',     '3.2M', '210K', 4),
  ('🇸🇬 Singapore', '560K', '41K',  5),
  ('🇹🇼 Taipei',    '1.1M', '85K',  6);

-- ------------------------------------------------------------------
-- 6. inquiries (랜딩 CTA → 인플루언서 신청 문의)
-- ------------------------------------------------------------------
create table if not exists public.inquiries (
  id              bigserial primary key,
  name            text not null,
  email           text not null,
  sns_platform    text,                -- instagram / tiktok / youtube
  sns_handle      text,                -- @handle
  follower_count  text,                -- '10K-50K' 같은 범위
  country_interest text,                -- 관심 국가 (자유입력 또는 country slug)
  message         text,
  status          text not null default 'new',  -- new / contacted / done / spam
  admin_memo      text,
  source          text default 'landing_cta',   -- 어디서 들어왔는지
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_inquiries_created on public.inquiries(created_at desc);

-- ------------------------------------------------------------------
-- 6.5 cta_links (언어별 "인플루언서 시작하기" 외부 링크)
-- ------------------------------------------------------------------
create table if not exists public.cta_links (
  locale     text primary key,
  url        text not null default '#',
  updated_at timestamptz not null default now()
);

insert into public.cta_links (locale, url) values
  ('ko', 'https://kr.trevity.com'),
  ('en', 'https://trevity.com'),
  ('ja', 'https://jp.trevity.com'),
  ('zh', 'https://cn.trevity.com'),
  ('vi', 'https://vn.trevity.com'),
  ('th', 'https://th.trevity.com')
on conflict (locale) do nothing;

-- ------------------------------------------------------------------
-- 7. admin_users (Supabase auth.users 와 연결, 추가 권한 정보)
-- ------------------------------------------------------------------
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  role        text not null default 'admin',  -- admin / editor
  created_at  timestamptz not null default now()
);

-- ===================================================================
-- updated_at 자동 갱신 트리거
-- ===================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_campaigns_updated on public.campaigns;
create trigger trg_campaigns_updated before update on public.campaigns
  for each row execute function public.set_updated_at();

drop trigger if exists trg_inquiries_updated on public.inquiries;
create trigger trg_inquiries_updated before update on public.inquiries
  for each row execute function public.set_updated_at();

drop trigger if exists trg_cta_links_updated on public.cta_links;
create trigger trg_cta_links_updated before update on public.cta_links
  for each row execute function public.set_updated_at();

-- ===================================================================
-- RLS (Row Level Security) 정책
-- ===================================================================
alter table public.countries           enable row level security;
alter table public.campaign_categories enable row level security;
alter table public.campaigns           enable row level security;
alter table public.faqs                enable row level security;
alter table public.reels               enable row level security;
alter table public.inquiries           enable row level security;
alter table public.admin_users         enable row level security;
alter table public.cta_links           enable row level security;

-- 공개 읽기 (랜딩에서 익명도 조회 가능)
create policy "public read countries"     on public.countries           for select using (is_active = true);
create policy "public read categories"    on public.campaign_categories for select using (true);
create policy "public read campaigns"     on public.campaigns           for select using (status = 'published');
create policy "public read faqs"          on public.faqs                for select using (is_active = true);
create policy "public read reels"         on public.reels               for select using (is_active = true);

-- 문의는 누구나 쓸 수 있음 (랜딩의 익명 사용자)
create policy "public insert inquiries"   on public.inquiries           for insert with check (true);

-- 어드민(로그인 사용자)은 전체 가능 (RLS 우회는 service_role 사용)
-- 클라이언트에서 직접 어드민 작업하지 않고 서버 액션에서 service_role 로 처리하는 게 안전.
create policy "auth read all countries"   on public.countries           for select to authenticated using (true);
create policy "auth all countries"        on public.countries           for all    to authenticated using (true) with check (true);

create policy "auth all categories"       on public.campaign_categories for all    to authenticated using (true) with check (true);

create policy "auth read all campaigns"   on public.campaigns           for select to authenticated using (true);
create policy "auth all campaigns"        on public.campaigns           for all    to authenticated using (true) with check (true);

create policy "auth all faqs"             on public.faqs                for all    to authenticated using (true) with check (true);
create policy "auth all reels"            on public.reels               for all    to authenticated using (true) with check (true);
create policy "auth all inquiries"        on public.inquiries           for all    to authenticated using (true) with check (true);
create policy "auth all admin_users"      on public.admin_users         for all    to authenticated using (true) with check (true);

create policy "public read cta_links"     on public.cta_links           for select using (true);
create policy "auth all cta_links"        on public.cta_links           for all    to authenticated using (true) with check (true);

-- ===================================================================
-- Storage 버킷 (캠페인 썸네일, Reels 썸네일용)
-- 대시보드 > Storage 에서 수동으로 'campaign-images' 버킷 생성 (Public)
-- ===================================================================
