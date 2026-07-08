/**
 * 랜딩 UI 다국어 문구 (6개 언어).
 * DB 콘텐츠(국가명, 캠페인 제목, FAQ 등)는 한국어 데이터 그대로 사용.
 * 추후 컬럼별 다국어 필요 시 _en/_ja/... 컬럼 추가 또는 별도 translations 테이블.
 *
 * 번역 품질 노트:
 * - en/ja 는 자연스러운 마케팅 카피
 * - zh-CN(간체)/vi/th 는 기본 번역. 운영 시 원어민 검토 권장.
 */

export const LOCALES = ['ko', 'en', 'ja', 'zh', 'vi', 'th', 'my'] as const;
export type Locale = (typeof LOCALES)[number];

export type Dictionary = {
  nav: { campaigns: string; regions: string; creators: string; faq: string; cta: string };
  hero: {
    badge: string; title1: string; title2: string; title3: string; desc: string;
    ctaPrimary: string; ctaSecondary: string; regions: string; scrollHint: string;
    phoneNotifTitle: string; phoneNotifSub: string; phoneTag: string; phoneSub: string;
    phoneSec1: string; phoneSec2: string;
  };
  what: {
    label: string; title1: string; title2: string; desc: string;
    f1Title: string; f1Desc: string; f2Title: string; f2Desc: string;
    f3Title: string; f3Desc: string; f4Title: string; f4Desc: string;
  };
  regions: { label: string; title1: string; title2: string; desc: string };
  campaigns: {
    label: string; title1: string; title2: string;
    filterAll: string; filterPlace: string; filterProduct: string;
  };
  how: {
    label: string; title1: string; title2: string;
    s1Title: string; s1Desc: string; s2Title: string; s2Desc: string;
    s3Title: string; s3Desc: string; s4Title: string; s4Desc: string;
  };
  benefits: {
    label: string; title1: string; title2: string; desc: string; cta: string;
    b1: string; b2: string; b3: string; b4: string; b5: string; b6: string;
  };
  content: { label: string; title1: string; title2: string; desc: string };
  faq: { label: string; title: string };
  finalCta: {
    title1: string; title2: string; desc: string; cta: string;
    check1: string; check2: string; check3: string;
  };
  footer: { tagline: string; l1: string; l2: string; l3: string; l4: string; copy: string };
  common: { languageLabel: string };
};

/** locale 별 문구 override. key = "section.field" (예: "hero.title1"). */
export type TextOverrides = Partial<Record<Locale, Record<string, string>>>;

/** Dictionary 를 { "section.field": value } 평면 맵으로 변환 (관리자 편집 화면용). */
export function flattenDictionary(d: Dictionary): Record<string, string> {
  const out: Record<string, string> = {};
  for (const section of Object.keys(d) as (keyof Dictionary)[]) {
    const obj = d[section] as Record<string, string>;
    for (const field of Object.keys(obj)) {
      out[`${section}.${field}`] = obj[field];
    }
  }
  return out;
}

/**
 * 코드 기본 dictionary 위에 DB override 를 덮어써서 최종 Dictionary 반환.
 * 알 수 없는 key / 빈 값은 무시하고 기본값 유지.
 */
export function applyOverrides(locale: Locale, overrides?: Record<string, string>): Dictionary {
  const base: Dictionary = JSON.parse(JSON.stringify(dictionaries[locale]));
  if (!overrides) return base;
  for (const [key, value] of Object.entries(overrides)) {
    if (value == null || value === '') continue;
    const [section, field] = key.split('.');
    const obj = (base as unknown as Record<string, Record<string, string>>)[section];
    if (obj && typeof obj === 'object' && field in obj) {
      obj[field] = value;
    }
  }
  return base;
}

export const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    nav: { campaigns: '캠페인', regions: '국가', creators: '크리에이터', faq: 'FAQ', cta: '인플루언서 시작하기' },
    hero: {
      badge: '✨  글로벌 크리에이터 플랫폼',
      title1: '트렌드를 경험하고,', title2: '콘텐츠 만들고,', title3: '성장하세요',
      desc: '트래비티는 글로벌 브랜드와 인플루언서를 연결하는\n트렌드 체험 플랫폼입니다.\n호텔·맛집·팝업 같은 플레이스 체험부터\n뷰티·F&B·테크 신제품 프로덕트 체험까지,\n지금 뜨는 캠페인을 경험하고 콘텐츠를 만들어보세요.',
      ctaPrimary: '인플루언서 시작하기 →', ctaSecondary: '캠페인 둘러보기',
      regions: '한국 · 베트남 · 일본 · 태국 · 대만 · 홍콩 · 싱가포르',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '새 캠페인 승인!', phoneNotifSub: 'Bangkok Hotel — 시작 준비 완료',
      phoneTag: '✓ 캠페인 참여 중', phoneSub: '이 호텔을 경험하고\n콘텐츠를 만들어보세요',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 캠페인 지원 가능',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: '트렌드 경험이', title2: '콘텐츠가 되는 곳',
      desc: '트래비티는 브랜드와 인플루언서를 연결해 새로운 트렌드 경험과 콘텐츠 기회를 제공합니다.\n여행지 체험부터 신제품 체험까지, 단순한 광고가 아닌 실제 경험을 기반으로\n콘텐츠를 만듭니다.',
      f1Title: '글로벌 캠페인', f1Desc: '호텔, 레스토랑, 액티비티 등\n여행 캠페인부터 신제품 체험\n캠페인까지 참여 가능',
      f2Title: '콘텐츠 성장', f2Desc: '브랜드 협업을 통해 SNS 콘텐츠와\n영향력을 성장시키세요',
      f3Title: '간편한 참여', f3Desc: '회원가입 후 원하는 캠페인에 쉽게\n지원할 수 있습니다',
      f4Title: '다양한 국가 경험', f4Desc: '아시아 여러 국가의 캠페인을 경험할 수 있습니다',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: '아시아 글로벌 캠페인을', title2: '만나보세요',
      desc: '트래비티는 다양한 국가의 브랜드와 인플루언서를 연결하고 있습니다.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '다양한 트렌드', title2: '캠페인을 경험해보세요',
      filterAll: '전체', filterPlace: '플레이스', filterProduct: '프로덕트',
    },
    how: {
      label: 'HOW IT WORKS', title1: '쉽고 빠르게', title2: '시작하세요',
      s1Title: '회원가입', s1Desc: '트래비티 크리에이터로 시작하세요',
      s2Title: '캠페인 지원', s2Desc: '원하는 캠페인에 지원하세요',
      s3Title: '체험 및 콘텐츠 제작', s3Desc: '브랜드를 경험하고 콘텐츠를 제작하세요',
      s4Title: '성장하기', s4Desc: '새로운 브랜드와 더 많은 기회를 만나보세요',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: '크리에이터를 위한', title2: '다양한 혜택',
      desc: '트래비티와 함께라면 트렌드를 경험하며 더 크게 성장할 수 있습니다.', cta: '지금 시작하기 →',
      b1: '무료 체험 기회', b2: '글로벌 브랜드 협업', b3: 'SNS 성장',
      b4: '트렌드 콘텐츠 제작', b5: '신제품 얼리 액세스', b6: '포트폴리오 강화',
    },
    content: {
      label: 'CREATOR CONTENT', title1: '실제 크리에이터', title2: '콘텐츠',
      desc: '트래비티 크리에이터들의 실제 트렌드 콘텐츠를 만나보세요',
    },
    faq: { label: 'FAQ', title: '자주 묻는 질문' },
    finalCta: {
      title1: '지금 글로벌 트렌드 캠페인을', title2: '시작해보세요',
      desc: '트래비티와 함께 새로운 트렌드 경험과 콘텐츠를 만들어보세요',
      cta: '인플루언서 시작하기 →',
      check1: '무료 가입', check2: '9개국 캠페인', check3: '글로벌 브랜드 협업',
    },
    footer: {
      tagline: '글로벌 인플루언서 트렌드 체험 플랫폼',
      l1: '이용약관', l2: '개인정보처리방침', l3: '크리에이터 센터', l4: '문의하기',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '언어' },
  },

  en: {
    nav: { campaigns: 'Campaigns', regions: 'Regions', creators: 'Creators', faq: 'FAQ', cta: 'Start as Influencer' },
    hero: {
      badge: '✨  Global Creator Platform',
      title1: 'Experience trends,', title2: 'create content,', title3: 'grow your influence',
      desc: 'Trevity connects global brands with influencers through trending experiences — Places like hotels, restaurants and pop-ups, and Products like new beauty, F&B and tech drops.',
      ctaPrimary: 'Start as Influencer →', ctaSecondary: 'Explore Campaigns',
      regions: 'Korea · Vietnam · Japan · Thailand · Taiwan · Hong Kong · Singapore',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'Campaign approved!', phoneNotifSub: 'Bangkok Hotel — ready to start',
      phoneTag: '✓ Active campaign', phoneSub: 'Experience this hotel\nand create content',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 Apply to campaigns',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'Where trends turn into', title2: 'content worth sharing',
      desc: 'Trevity brings brands and influencers together through real trend experiences — from travel to new products — that inspire genuine, engaging content.',
      f1Title: 'Global Campaigns', f1Desc: 'Hotels, restaurants, activities and new product drops across Asia',
      f2Title: 'Content Growth', f2Desc: 'Grow your SNS reach through real brand collaborations',
      f3Title: 'Easy to Join', f3Desc: 'Sign up and apply to campaigns you love in minutes',
      f4Title: 'Experience New Countries', f4Desc: 'Get matched with campaigns across multiple countries',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'Explore our Asia-wide', title2: 'campaign network',
      desc: 'Trevity connects brands and influencers through campaigns\nacross multiple countries in Asia.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'Discover trending', title2: 'campaigns & experiences',
      filterAll: 'All', filterPlace: 'Places', filterProduct: 'Products',
    },
    how: {
      label: 'HOW IT WORKS', title1: 'Simple, fast', title2: 'to get started',
      s1Title: 'Sign up', s1Desc: 'Join as a Trevity creator',
      s2Title: 'Apply', s2Desc: 'Apply to campaigns you want',
      s3Title: 'Experience & Create', s3Desc: 'Visit the brand and create content',
      s4Title: 'Grow', s4Desc: 'Unlock new brands\nand bigger opportunities',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'Made for creators', title2: 'who set trends',
      desc: 'Turn every trend — trips, places and products — into new content and opportunities with Trevity.', cta: 'Get Started →',
      b1: 'Free experiences', b2: 'Global brand collabs', b3: 'SNS growth',
      b4: 'Trend content', b5: 'Early product access', b6: 'Portfolio boost',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'Real creator', title2: 'content',
      desc: 'Discover real trend content made by Trevity creators',
    },
    faq: { label: 'FAQ', title: 'Frequently Asked Questions' },
    finalCta: {
      title1: 'Start a global trend', title2: 'campaign today',
      desc: 'Create new trend experiences and content with Trevity',
      cta: 'Start as Influencer →',
      check1: 'Free to join', check2: '9 countries', check3: 'Global brand collabs',
    },
    footer: {
      tagline: 'Global influencer trend platform',
      l1: 'Terms', l2: 'Privacy', l3: 'Creator Center', l4: 'Contact',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'Language' },
  },

  ja: {
    nav: { campaigns: 'キャンペーン', regions: '国・地域', creators: 'クリエイター', faq: 'FAQ', cta: 'インフルエンサー登録' },
    hero: {
      badge: '✨  グローバル・クリエイタープラットフォーム',
      title1: 'トレンドを体験し、', title2: 'コンテンツを作り、', title3: '成長しよう',
      desc: 'Trevityはグローバルブランドとインフルエンサーをつなぐトレンド体験プラットフォームです。ホテルやグルメなどのプレイス体験から、新作コスメ・フード・ガジェットのプロダクト体験まで、話題のキャンペーンでコンテンツを制作できます。',
      ctaPrimary: 'インフルエンサー登録 →', ctaSecondary: 'キャンペーンを見る',
      regions: '韓国 · ベトナム · 日本 · タイ · 台湾 · 香港 · シンガポール',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '新しいキャンペーン承認!', phoneNotifSub: 'Bangkok Hotel — 開始準備完了',
      phoneTag: '✓ 参加中', phoneSub: 'このホテルを体験し\nコンテンツを作ろう',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 キャンペーン応募可能',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'トレンド体験が', title2: 'コンテンツになる',
      desc: 'Trevityはブランドとインフルエンサーをつなぎ、旅行から新製品まで新しいトレンド体験とコンテンツの機会を提供します。単なる広告ではなく、実体験ベースのコンテンツです。',
      f1Title: 'グローバルキャンペーン', f1Desc: 'ホテル・レストラン・アクティビティから新製品体験まで多様な参加機会',
      f2Title: 'コンテンツ成長', f2Desc: 'ブランドコラボでSNSと影響力を成長',
      f3Title: '簡単参加', f3Desc: '登録後すぐにお好みのキャンペーンに応募できます',
      f4Title: '各国を体験', f4Desc: 'アジア各国のキャンペーンを体験',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'アジア各国の', title2: 'キャンペーンに出会う',
      desc: 'Trevityは多様な国のブランドとインフルエンサーを繋いでいます。',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '多彩なトレンドキャンペーン', title2: 'を体験しよう',
      filterAll: 'すべて', filterPlace: 'プレイス', filterProduct: 'プロダクト',
    },
    how: {
      label: 'HOW IT WORKS', title1: '簡単・スピーディに', title2: 'スタート',
      s1Title: '会員登録', s1Desc: 'Trevityクリエイターとして始める',
      s2Title: 'キャンペーン応募', s2Desc: 'お好きなキャンペーンに応募',
      s3Title: '体験・制作', s3Desc: 'ブランドを体験しコンテンツ制作',
      s4Title: '成長する', s4Desc: '新しいブランドとより多くの機会へ',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'クリエイターのための', title2: '多彩な特典',
      desc: 'Trevityならトレンドを体験しながらさらに大きく成長できます。', cta: '今すぐ始める →',
      b1: '無料体験機会', b2: 'グローバルブランド協業', b3: 'SNS成長',
      b4: 'トレンドコンテンツ制作', b5: '新製品を先行体験', b6: 'ポートフォリオ強化',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'リアルクリエイター', title2: 'コンテンツ',
      desc: 'Trevityクリエイターの実際のトレンドコンテンツをご覧ください',
    },
    faq: { label: 'FAQ', title: 'よくある質問' },
    finalCta: {
      title1: 'グローバルトレンドキャンペーンを', title2: '今すぐ始めよう',
      desc: 'Trevityと一緒に新しいトレンド体験とコンテンツを',
      cta: 'インフルエンサー登録 →',
      check1: '登録無料', check2: '9カ国対応', check3: 'グローバルブランド協業',
    },
    footer: {
      tagline: 'グローバル・インフルエンサー トレンド体験プラットフォーム',
      l1: '利用規約', l2: 'プライバシー', l3: 'クリエイターセンター', l4: 'お問い合わせ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '言語' },
  },

  zh: {
    nav: { campaigns: '活动', regions: '国家', creators: '创作者', faq: 'FAQ', cta: '成为达人' },
    hero: {
      badge: '✨  全球创作者平台',
      title1: '体验潮流，', title2: '创作内容，', title3: '与品牌携手发展',
      desc: 'Trevity 是连接全球品牌与达人的潮流体验平台，覆盖酒店、餐饮、快闪店等空间体验，以及美妆、食品、数码等新品体验。于潮流之中萃取灵感，创作精品内容。',
      ctaPrimary: '成为达人 →', ctaSecondary: '浏览活动',
      regions: '韩国 · 越南 · 日本 · 泰国 · 台湾 · 香港 · 新加坡',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '新活动通过!', phoneNotifSub: 'Bangkok Hotel — 准备开始',
      phoneTag: '✓ 活动进行中', phoneSub: '体验这家酒店\n并创作内容',
      phoneSec1: '📊 15K 粉丝+', phoneSec2: '🎯 可申请活动',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: '让潮流体验', title2: '变成精彩内容',
      desc: 'Trevity 联动品牌与达人，从旅行体验到新品试用，解锁全新体验与创作机会，拒绝传统广告，只做真实体验分享。',
      f1Title: '全球活动', f1Desc: '酒店·餐厅·活动与新品体验等多元化活动',
      f2Title: '内容增长', f2Desc: '通过品牌合作提升 SNS 内容与影响力',
      f3Title: '轻松参与', f3Desc: '注册后可立即申请喜欢的活动',
      f4Title: '体验多国文化', f4Desc: '体验亚洲多国活动',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: '邂逅亚洲全球', title2: '活动网络',
      desc: 'Trevity 搭建品牌与创意达人共赢平台',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '体验丰富多样的', title2: '潮流活动',
      filterAll: '全部', filterPlace: '空间体验', filterProduct: '产品体验',
    },
    how: {
      label: 'HOW IT WORKS', title1: '简单入驻，', title2: '立刻参与',
      s1Title: '注册', s1Desc: '成为 Trevity 创作者',
      s2Title: '申请活动', s2Desc: '申请你想要的活动',
      s3Title: '体验与创作', s3Desc: '体验品牌并创作内容',
      s4Title: '成长', s4Desc: '解锁新品牌与更多机会',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: '为创作者打造的', title2: '多元化福利',
      desc: '与 Trevity 同行,边体验潮流边成长。', cta: '立即开始 →',
      b1: '免费体验机会', b2: '全球品牌合作', b3: 'SNS 成长',
      b4: '潮流内容制作', b5: '新品抢先体验', b6: '作品集升级',
    },
    content: {
      label: 'CREATOR CONTENT', title1: '真实创作者', title2: '内容',
      desc: '查看 Trevity 创作者的真实潮流内容',
    },
    faq: { label: 'FAQ', title: '常见问题' },
    finalCta: {
      title1: '立即开启', title2: '全球潮流活动',
      desc: '与 Trevity 一起创造全新的潮流体验与内容',
      cta: '成为达人 →',
      check1: '免费注册', check2: '9国活动', check3: '全球品牌合作',
    },
    footer: {
      tagline: '全球达人潮流体验平台',
      l1: '使用条款', l2: '隐私政策', l3: '创作者中心', l4: '联系我们',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '语言' },
  },

  vi: {
    nav: { campaigns: 'Chiến dịch', regions: 'Quốc gia', creators: 'Creator', faq: 'FAQ', cta: 'Bắt đầu làm Influencer' },
    hero: {
      badge: '✨  Nền tảng Creator toàn cầu',
      title1: 'Trải nghiệm trend,\nsáng tạo\nnội dung,\nlan toả\nsức ảnh hưởng', title2: '', title3: '',
      desc: 'Trevity mở ra cầu nối giữa thương hiệu và influencer qua những chiến dịch trải nghiệm xu hướng —\ntừ khách sạn, nhà hàng, điểm đến hot\nđến sản phẩm mới về beauty, F&B và công nghệ.',
      ctaPrimary: 'Bắt đầu làm Influencer →', ctaSecondary: 'Khám phá chiến dịch',
      regions: 'Hàn Quốc · Việt Nam · Nhật · Thái Lan · Đài Loan · Hong Kong · Singapore',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'Chiến dịch được duyệt!', phoneNotifSub: 'Bangkok Hotel — sẵn sàng bắt đầu',
      phoneTag: '✓ Đang tham gia', phoneSub: 'Trải nghiệm khách sạn này\nvà tạo nội dung',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 Có thể ứng tuyển',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'Trải nghiệm thực tế,', title2: 'nội dung chân thật',
      desc: 'Trevity kết nối thương hiệu và influencer thông qua các trải nghiệm thực tế,\nnơi mỗi chuyến đi, sản phẩm mới hay khoảnh khắc đều có thể trở thành\nnội dung đầy cảm hứng.',
      f1Title: 'Chiến dịch toàn cầu', f1Desc: 'Khách sạn, nhà hàng, hoạt động và\nsản phẩm mới khắp châu Á',
      f2Title: 'Nâng tầm nội dung', f2Desc: 'Mở rộng sức ảnh hưởng SNS cùng các thương hiệu toàn cầu',
      f3Title: 'Đăng ký dễ dàng', f3Desc: 'Tham gia chiến dịch nhanh chóng chỉ với vài bước',
      f4Title: 'Cơ hội đa quốc gia', f4Desc: 'Mở rộng hoạt động influencer trên nhiều thị trường khác nhau',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'Mạng lưới chiến dịch', title2: 'khắp châu Á',
      desc: 'Trevity kết nối thương hiệu và influencer tại nhiều quốc gia.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'Khám phá nhiều', title2: 'chiến dịch xu hướng',
      filterAll: 'Tất cả', filterPlace: 'Địa điểm', filterProduct: 'Sản phẩm',
    },
    how: {
      label: 'HOW IT WORKS', title1: 'Đơn giản,\nnhanh chóng\ncùng Trevity', title2: '',
      s1Title: 'Đăng ký', s1Desc: 'Trở thành Trevity Creator',
      s2Title: 'Ứng tuyển', s2Desc: 'Chọn tham gia chiến dịch bạn yêu thích',
      s3Title: 'Trải nghiệm & sáng tạo', s3Desc: 'Khám phá thương hiệu\nvà tạo nội dung chân thực',
      s4Title: 'Phát triển', s4Desc: 'Mở rộng cơ hội hợp tác\ncùng nhiều thương hiệu hơn',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'Quyền lợi hấp dẫn', title2: 'dành cho Creator',
      desc: 'Biến mỗi trải nghiệm xu hướng thành cơ hội phát triển cùng Trevity.', cta: 'Bắt đầu ngay →',
      b1: 'Trải nghiệm miễn phí', b2: 'Hợp tác thương hiệu toàn cầu', b3: 'Tăng trưởng SNS',
      b4: 'Sáng tạo nội dung trend', b5: 'Trải nghiệm sớm sản phẩm mới', b6: 'Nâng cấp portfolio',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'Nội dung thực', title2: 'từ creator',
      desc: 'Khám phá nội dung xu hướng thực tế từ các Trevity Creator',
    },
    faq: { label: 'FAQ', title: 'Câu hỏi thường gặp' },
    finalCta: {
      title1: 'Bắt đầu chiến dịch', title2: 'xu hướng toàn cầu ngay',
      desc: 'Cùng Trevity tạo trải nghiệm và nội dung xu hướng mới',
      cta: 'Bắt đầu làm Influencer →',
      check1: 'Đăng ký miễn phí', check2: 'Chiến dịch tại 9 quốc gia', check3: 'Hợp tác thương hiệu toàn cầu',
    },
    footer: {
      tagline: 'Nền tảng trải nghiệm xu hướng cho influencer toàn cầu',
      l1: 'Điều khoản', l2: 'Quyền riêng tư', l3: 'Trung tâm Creator', l4: 'Liên hệ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'Ngôn ngữ' },
  },

  th: {
    nav: { campaigns: 'แคมเปญ', regions: 'ประเทศ', creators: 'ครีเอเตอร์', faq: 'FAQ', cta: 'เริ่มเป็น Influencer' },
    hero: {
      badge: '✨  แพลตฟอร์มครีเอเตอร์ระดับโลก',
      title1: 'สัมผัสเทรนด์,', title2: 'สร้างคอนเทนต์,', title3: 'เติบโตไปด้วยกัน',
      desc: 'Trevity เชื่อมแบรนด์ระดับโลกกับ Influencer ผ่านแคมเปญเทรนด์ — โรงแรม ร้านอาหาร ที่เที่ยวฮิต ไปจนถึงสินค้าใหม่สายบิวตี้ อาหาร และแกดเจ็ต',
      ctaPrimary: 'เริ่มเป็น Influencer →', ctaSecondary: 'ดูแคมเปญ',
      regions: 'เกาหลี · เวียดนาม · ญี่ปุ่น · ไทย · ไต้หวัน · ฮ่องกง · สิงคโปร์',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'อนุมัติแคมเปญใหม่!', phoneNotifSub: 'Bangkok Hotel — พร้อมเริ่ม',
      phoneTag: '✓ กำลังร่วมแคมเปญ', phoneSub: 'สัมผัสประสบการณ์โรงแรมนี้\nและสร้างคอนเทนต์',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 สมัครแคมเปญได้',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'ที่ที่ประสบการณ์เทรนด์', title2: 'กลายเป็นคอนเทนต์',
      desc: 'Trevity เชื่อมแบรนด์และ Influencer เพื่อสร้างประสบการณ์และโอกาสด้านคอนเทนต์ใหม่ๆ ตั้งแต่การเดินทางไปจนถึงสินค้าใหม่ ไม่ใช่แค่โฆษณา แต่เป็นคอนเทนต์ที่มาจากประสบการณ์จริง',
      f1Title: 'แคมเปญระดับโลก', f1Desc: 'โรงแรม ร้านอาหาร กิจกรรม และสินค้าใหม่หลากหลายทั่วเอเชีย',
      f2Title: 'เติบโตทางคอนเทนต์', f2Desc: 'เพิ่ม Reach SNS ผ่านการร่วมงานกับแบรนด์',
      f3Title: 'เข้าร่วมง่าย', f3Desc: 'สมัครและร่วมแคมเปญที่คุณชอบได้ทันที',
      f4Title: 'สัมผัสหลายประเทศ', f4Desc: 'ร่วมแคมเปญในหลายประเทศของเอเชีย',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'พบเครือข่ายแคมเปญ', title2: 'ทั่วเอเชีย',
      desc: 'Trevity เชื่อมแบรนด์และ Influencer ในหลายประเทศ',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'สัมผัสแคมเปญเทรนด์', title2: 'หลากหลายรูปแบบ',
      filterAll: 'ทั้งหมด', filterPlace: 'สถานที่', filterProduct: 'สินค้า',
    },
    how: {
      label: 'HOW IT WORKS', title1: 'ง่ายและรวดเร็ว', title2: 'พร้อมเริ่มทันที',
      s1Title: 'สมัครสมาชิก', s1Desc: 'เริ่มต้นเป็น Trevity Creator',
      s2Title: 'สมัครแคมเปญ', s2Desc: 'สมัครแคมเปญที่คุณสนใจ',
      s3Title: 'สัมผัส & สร้าง', s3Desc: 'สัมผัสแบรนด์และสร้างคอนเทนต์',
      s4Title: 'เติบโต', s4Desc: 'ปลดล็อกแบรนด์ใหม่และโอกาสที่ใหญ่กว่า',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'สิทธิประโยชน์หลากหลาย', title2: 'สำหรับครีเอเตอร์',
      desc: 'กับ Trevity คุณสามารถเติบโตไปพร้อมกับทุกเทรนด์', cta: 'เริ่มเลย →',
      b1: 'ประสบการณ์ฟรี', b2: 'ร่วมงานแบรนด์ระดับโลก', b3: 'เติบโตบน SNS',
      b4: 'คอนเทนต์เทรนด์', b5: 'ลองสินค้าใหม่ก่อนใคร', b6: 'เสริมพอร์ตโฟลิโอ',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'คอนเทนต์', title2: 'จากครีเอเตอร์จริง',
      desc: 'ชมคอนเทนต์เทรนด์จาก Trevity Creator',
    },
    faq: { label: 'FAQ', title: 'คำถามที่พบบ่อย' },
    finalCta: {
      title1: 'เริ่มแคมเปญเทรนด์', title2: 'ระดับโลกวันนี้',
      desc: 'สร้างประสบการณ์และคอนเทนต์ใหม่ๆ กับ Trevity',
      cta: 'เริ่มเป็น Influencer →',
      check1: 'สมัครฟรี', check2: 'แคมเปญ 9 ประเทศ', check3: 'ร่วมงานแบรนด์ระดับโลก',
    },
    footer: {
      tagline: 'แพลตฟอร์มประสบการณ์เทรนด์สำหรับ Influencer',
      l1: 'ข้อกำหนด', l2: 'นโยบายความเป็นส่วนตัว', l3: 'ศูนย์ครีเอเตอร์', l4: 'ติดต่อ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'ภาษา' },
  },

  my: {
    nav: { campaigns: 'Campaign', regions: 'နိုင်ငံများ', creators: 'Creator', faq: 'FAQ', cta: 'Influencer အဖြစ် စတင်ရန်' },
    hero: {
      badge: '✨  ကမ္ဘာလုံးဆိုင်ရာ Creator Platform',
      title1: 'Trend တွေကို ခံစားရင်း Content ဖန်တီးပြီး\nအောင်မြင်မှုအသစ်တွေကို ရယူလိုက်ပါ။',
      title2: '', title3: '',
      desc: 'Trevity သည် ကမ္ဘာ့အဆင့်မီ Brand တွေနဲ့ Influencer တွေကို ချိတ်ဆက်ပေးတဲ့ Trend အတွေ့အကြုံမျှဝေရာ Platform တစ်ခု ဖြစ်ပါတယ်။ ဟိုတယ်၊ စားသောက်ဆိုင် စတဲ့ ခရီးသွားအတွေ့အကြုံတွေအပြင် Beauty၊ အစားအသောက်နဲ့ Gadget ထုတ်ကုန်အသစ်တွေကိုပါ စမ်းသပ်ခံစားနိုင်ပါတယ်။',
      ctaPrimary: 'Influencer အဖြစ် စတင်ရန် →', ctaSecondary: 'Campaign များကို လေ့လာကြည့်ရှုရန်',
      regions: 'ကိုရီးယား · ဗီယက်နမ် · ဂျပန် · ထိုင်း · ထိုင်ဝမ် · ဟောင်ကောင် · စင်ကာပူ',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'Campaign အသစ် အတည်ပြုပြီး!', phoneNotifSub: 'Bangkok Hotel — စတင်ရန် အသင့်',
      phoneTag: '✓ ပါဝင်နေသည်', phoneSub: 'ဒီဟိုတယ်ကို ကိုယ်တိုင်ခံစားကြည့်ရှုပြီး\nContent ဖန်တီးလိုက်ပါ',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 Campaign လျှောက်နိုင်သည်',
    },
    what: {
      label: 'WHAT IS TREVITY',
      title1: 'Trend အတွေ့အကြုံတွေကနေ\nContent ဖြစ်လာမယ့်နေရာ', title2: '',
      desc: 'Trevity သည် Brand တွေနဲ့ Influencer တွေကို ချိတ်ဆက်ပေးပြီး ခရီးသွားမှသည် ထုတ်ကုန်အသစ်အထိ Trend အတွေ့အကြုံသစ်တွေနဲ့ Content ဖန်တီးနိုင်မယ့် အခွင့်အလမ်းတွေကို ပေးစွမ်းနေပါသည်။ ရိုးရိုးကြော်ငြာရုံတင်မဟုတ်ဘဲ ကိုယ်တိုင်ကြုံတွေ့ရတဲ့ အတွေ့အကြုံတွေအပေါ် အခြေခံပြီး Content ဖန်တီးပေးပါသည်။',
      f1Title: 'Global Campaign', f1Desc: 'ဟိုတယ်၊ စားသောက်ဆိုင်၊ Activity အပြင် ထုတ်ကုန်အသစ် Campaign တွေမှာပါ ပါဝင်နိုင်ခြင်း',
      f2Title: 'Content ပိုင်း တိုးတက်လာခြင်း', f2Desc: 'Brand တွေနဲ့ လက်တွဲပြီး မိမိရဲ့ SNS Content နဲ့ Influence ကို မြှင့်တင်လိုက်ပါ',
      f3Title: 'လွယ်ကူစွာ ပါဝင်နိုင်ခြင်း', f3Desc: 'Sign up လုပ်ပြီးတာနဲ့ မိမိစိတ်ဝင်စားတဲ့ Campaign တွေကို အလွယ်တကူ လျှောက်ထားနိုင်ပါတယ်',
      f4Title: 'နိုင်ငံပေါင်းစုံမှ အတွေ့အကြုံများ', f4Desc: 'အာရှနိုင်ငံအသီးသီးရဲ့ Campaign တွေကို လေ့လာကြုံတွေ့နိုင်မှာ ဖြစ်ပါတယ်',
    },
    regions: {
      label: 'GLOBAL REGIONS',
      title1: 'အာရှတစ်ဝန်းက Global Campaign တွေကို\nလေ့လာကြည့်လိုက်ပါ။', title2: '',
      desc: 'Trevity သည် နိုင်ငံပေါင်းစုံက Brand တွေနဲ့ Influencer တွေကို ချိတ်ဆက်ပေးနေပါသည်။',
    },
    campaigns: {
      label: 'CAMPAIGNS',
      title1: 'စုံလင်လှတဲ့ Trend Campaign တွေကို\nတွေ့ကြုံခံစားနိုင်ပါသည်။', title2: '',
      filterAll: 'အားလုံး', filterPlace: 'Place', filterProduct: 'Product',
    },
    how: {
      label: 'HOW IT WORKS',
      title1: 'လွယ်ကူမြန်ဆန်စွာ စတင်လိုက်ပါ', title2: '',
      s1Title: 'Sign up လုပ်ခြင်း', s1Desc: 'Trevity ရဲ့ Creator တစ်ယောက်အနေနဲ့ စတင်လိုက်ပါ',
      s2Title: 'Campaign လျှောက်ထားခြင်း', s2Desc: 'မိမိနှစ်သက်တဲ့ Campaign ကို လျှောက်ထားပါ',
      s3Title: 'အတွေ့အကြုံနှင့် Content ဖန်တီးခြင်း', s3Desc: 'Brand ကို ကိုယ်တိုင်ကြုံတွေ့ခံစားပြီး Content ဖန်တီးနိုင်ပါသည်။',
      s4Title: 'ပိုမိုတိုးတက်အောင်မြင်ခြင်း', s4Desc: 'Brand အသစ်တွေနဲ့အတူ အခွင့်အလမ်းကောင်းများစွာကို ဆုံတွေ့နိုင်ပါသည်။',
    },
    benefits: {
      label: 'CREATOR BENEFITS',
      title1: 'Creator များအတွက်\nရရှိနိုင်မယ့် အကျိုးခံစားခွင့်မျိုးစုံ', title2: '',
      desc: 'Trevity နဲ့အတူဆိုရင် Trend တွေကို ခံစားရင်း ပိုမိုတိုးတက်အောင်မြင်နိုင်ပါသည်။', cta: 'ယခု စတင် →',
      b1: 'အခမဲ့ အတွေ့အကြုံရရှိမည့် အခွင့်အရေး', b2: 'ကမ္ဘာ့အဆင့်မီ Brand တွေနဲ့ လက်တွဲလုပ်ဆောင်ခွင့်', b3: 'SNS ပိုင်း တိုးတက်အောင်မြင်လာခြင်း',
      b4: 'Trend Content များ ဖန်တီးနိုင်ခြင်း', b5: 'ထုတ်ကုန်အသစ်တွေကို အရင်ဆုံး စမ်းသပ်ခွင့်', b6: 'Portfolio ကို ပိုမိုတိုးတက်ကောင်းမွန်လာခြင်း',
    },
    content: {
      label: 'CREATOR CONTENT',
      title1: 'တကယ့် Creator တွေရဲ့\nContent များ', title2: '',
      desc: 'Trevity Creator တွေရဲ့ စစ်မှန်တဲ့ Trend Content တွေကို လေ့လာကြည့်ရှုလိုက်ပါ။',
    },
    faq: { label: 'FAQ', title: 'မေးခွန်းများ' },
    finalCta: {
      title1: 'အခုပဲ ကမ္ဘာလုံးဆိုင်ရာ Trend Campaign ကို စတင်လိုက်ပါ', title2: '',
      desc: 'Trevity နဲ့အတူ Trend အတွေ့အကြုံသစ်တွေနဲ့ Content တွေကို ဖန်တီးလိုက်ပါ။',
      cta: 'Influencer အဖြစ် စတင်ရန် →',
      check1: 'အခမဲ့ စာရင်းသွင်း', check2: 'နိုင်ငံ ၉ နိုင်ငံရဲ့ Campaign များ', check3: 'ကမ္ဘာ့အဆင့်မီ Brand တွေနဲ့ လက်တွဲလုပ်ဆောင်ခွင့်',
    },
    footer: {
      tagline: 'ကမ္ဘာလုံးဆိုင်ရာ Influencer Trend အတွေ့အကြုံ ပလက်ဖောင်း',
      l1: 'စည်းကမ်းချက်', l2: 'ကိုယ်ရေးအချက်အလက် ထိန်းသိမ်းမှု မူဝါဒ', l3: 'Creator Center', l4: 'ဆက်သွယ်ရန်',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'ဘာသာစကား' },
  },
};

export const LOCALE_META: Record<Locale, { label: string; native: string; flag: string }> = {
  ko: { label: 'Korean',     native: '한국어',       flag: '🇰🇷' },
  en: { label: 'English',    native: 'English',      flag: '🇺🇸' },
  ja: { label: 'Japanese',   native: '日本語',        flag: '🇯🇵' },
  zh: { label: 'Chinese',    native: '中文',          flag: '🇨🇳' },
  vi: { label: 'Vietnamese', native: 'Tiếng Việt',   flag: '🇻🇳' },
  th: { label: 'Thai',       native: 'ภาษาไทย',     flag: '🇹🇭' },
  my: { label: 'Burmese',    native: 'မြန်မာ',       flag: '🇲🇲' },
};

/**
 * 캠페인 카테고리의 locale 별 이름/설명 매핑.
 * DB 의 campaign_categories.name / description 은 한국어 데이터.
 * 다른 언어로 렌더링 시 여기 매핑이 있으면 우선 사용, 없으면 DB 값 그대로.
 * 키는 campaign_categories.slug.
 */
export const CATEGORY_TRANSLATIONS: Partial<Record<Locale, Record<string, { name: string; description: string }>>> = {
  en: {
    hotels:      { name: 'Hotels',         description: 'From luxury hotels to charming stays' },
    massage:     { name: 'Massage & Spa',  description: 'Experience popular local massages and spas' },
    restaurants: { name: 'Restaurants',    description: 'Trendy restaurants\nand authentic local dining' },
    cafes:       { name: 'Cafes',          description: 'Stylish cafes\nand must-visit dessert spots' },
    beauty:      { name: 'Beauty',         description: 'Beauty and lifestyle brands' },
    activities:  { name: 'Activities',     description: 'Tours, activities,\nand experience groups' },
    'new-beauty': { name: 'New Beauty',       description: 'Be first to try new beauty & skincare drops' },
    fnb:          { name: 'F&B Launches',     description: 'Taste-test new drinks, snacks and foods' },
    tech:         { name: 'Tech & Gadgets',   description: 'Review the latest devices and gadgets' },
    popup:        { name: 'Pop-ups & Exhibits', description: 'Visit pop-up stores, exhibitions and events' },
  },
  vi: {
    hotels:      { name: 'Khách sạn',      description: 'Từ khách sạn sang trọng\nđến không gian lưu trú đầy cảm hứng' },
    massage:     { name: 'Massage & Spa',  description: 'Trải nghiệm massage và spa được yêu thích tại địa phương' },
    restaurants: { name: 'Nhà hàng',       description: 'Khám phá nhà hàng xu hướng\nvà ẩm thực bản địa đặc sắc' },
    cafes:       { name: 'Cafes',          description: 'Những quán cafe mang phong cách riêng cùng tráng miệng hấp dẫn' },
    beauty:      { name: 'Beauty',         description: 'Các thương hiệu beauty\nvà lifestyle được quan tâm' },
    activities:  { name: 'Activities',     description: 'Tour, hoạt động trải nghiệm\nvà nội dung khám phá đa dạng' },
    'new-beauty': { name: 'Beauty mới',       description: 'Trải nghiệm sớm mỹ phẩm, skincare mới ra mắt' },
    fnb:          { name: 'F&B mới',          description: 'Thử món mới: đồ uống, snack và ẩm thực' },
    tech:         { name: 'Tech & Gadget',    description: 'Review thiết bị và phụ kiện công nghệ mới' },
    popup:        { name: 'Pop-up & Triển lãm', description: 'Check-in pop-up store, triển lãm và sự kiện' },
  },
  ja: {
    hotels:      { name: 'ホテル',           description: '高級ホテルから感性あふれる宿泊まで' },
    massage:     { name: 'マッサージ & スパ', description: '現地で人気のマッサージとスパ体験' },
    restaurants: { name: 'レストラン',       description: 'トレンドのお店とローカルレストラン' },
    cafes:       { name: 'カフェ',           description: '感性カフェとデザートスポット' },
    beauty:      { name: 'ビューティー',     description: 'ビューティー & ライフスタイルブランド' },
    activities:  { name: 'アクティビティ',   description: 'ツアー、アクティビティ、体験コンテンツ' },
    'new-beauty': { name: '新作ビューティー',   description: '新作コスメ・スキンケアをいち早く体験' },
    fnb:          { name: 'F&B新商品',          description: 'ドリンクやスナックなど新商品を試食体験' },
    tech:         { name: 'テック・ガジェット', description: '最新デバイス・ガジェットをレビュー' },
    popup:        { name: 'ポップアップ・展示', description: 'ポップアップストアや展示・イベントを訪問' },
  },
  zh: {
    hotels:      { name: '酒店',             description: '从豪华酒店到精品民宿' },
    massage:     { name: '按摩与水疗',       description: '当地热门按摩与水疗体验' },
    restaurants: { name: '餐厅',             description: '时尚餐厅与地道本地美食' },
    cafes:       { name: '咖啡馆',           description: '风格咖啡馆与必访甜品' },
    beauty:      { name: '美妆',             description: '美妆与生活方式品牌' },
    activities:  { name: '活动',             description: '旅行、活动、体验内容' },
    'new-beauty': { name: '新品美妆',         description: '抢先体验新品彩妆与护肤' },
    fnb:          { name: '新品餐饮',         description: '试吃试饮全新饮品与零食' },
    tech:         { name: '数码好物',         description: '评测最新电子产品与配件' },
    popup:        { name: '快闪与展览',       description: '打卡快闪店、展览与活动' },
  },
  th: {
    hotels:      { name: 'โรงแรม',           description: 'ตั้งแต่โรงแรมหรูถึงที่พักสไตล์อบอุ่น' },
    massage:     { name: 'นวดและสปา',         description: 'สัมผัสนวดและสปายอดนิยมในท้องถิ่น' },
    restaurants: { name: 'ร้านอาหาร',         description: 'ร้านอาหารทันสมัยและอาหารท้องถิ่นแท้ๆ' },
    cafes:       { name: 'คาเฟ่',             description: 'คาเฟ่สไตล์เก๋และของหวานต้องลอง' },
    beauty:      { name: 'บิวตี้',            description: 'แบรนด์บิวตี้และไลฟ์สไตล์' },
    activities:  { name: 'กิจกรรม',           description: 'ทัวร์, กิจกรรม, คอนเทนต์ประสบการณ์' },
    'new-beauty': { name: 'บิวตี้ใหม่',        description: 'ลองสินค้าบิวตี้และสกินแคร์ใหม่ก่อนใคร' },
    fnb:          { name: 'F&B ใหม่',          description: 'ชิมเครื่องดื่มและขนมใหม่ล่าสุด' },
    tech:         { name: 'เทค & แกดเจ็ต',     description: 'รีวิวอุปกรณ์และแกดเจ็ตรุ่นใหม่' },
    popup:        { name: 'ป๊อปอัพ & นิทรรศการ', description: 'เช็คอินป๊อปอัพสโตร์ นิทรรศการ และอีเวนต์' },
  },
  my: {
    hotels:      { name: 'ဟိုတယ်များ',      description: 'ဇိမ်ခံဟိုတယ်တွေကနေ စိတ်ကူးယဉ်ဆန်တဲ့ တည်းခိုခန်းတွေအထိ' },
    massage:     { name: 'Massage & Spa',   description: 'ဒေသခံများ နှစ်သက်သော massage နှင့် spa အတွေ့အကြုံ' },
    restaurants: { name: 'Restaurants',     description: 'ခေတ်စားနေသော စားသောက်ဆိုင်များနှင့် ဒေသခံ အစားအသောက်' },
    cafes:       { name: 'Cafes',           description: 'လှပတဲ့ ကဖေးတွေနဲ့ အချိုပွဲစားလို့ကောင်းတဲ့ နေရာများ' },
    beauty:      { name: 'Beauty',          description: 'Beauty နှင့် lifestyle brand များ' },
    activities:  { name: 'Activity များ',   description: 'Tour များ၊ Activity များနှင့် အတွေ့အကြုံယူနိုင်မယ့် Content များ' },
    'new-beauty': { name: 'Beauty အသစ်',    description: 'အသစ်ထွက် beauty နဲ့ skincare တွေကို အရင်ဆုံး စမ်းသပ်ကြည့်ပါ' },
    fnb:          { name: 'F&B အသစ်',       description: 'သောက်စရာ၊ စားစရာ ထုတ်ကုန်အသစ်တွေကို မြည်းစမ်းကြည့်ခြင်း' },
    tech:         { name: 'Tech & Gadget',  description: 'နောက်ဆုံးထွက် Device နဲ့ Gadget တွေကို Review လုပ်ခြင်း' },
    popup:        { name: 'Pop-up & ပြပွဲ', description: 'Pop-up Store၊ ပြပွဲနဲ့ Event တွေကို သွားရောက်လည်ပတ်ခြင်း' },
  },
};

/**
 * FAQ 의 locale 별 질문/답변 매핑.
 * DB 의 faqs 는 한국어 데이터. 렌더링 시 sort_order 순서로 정렬 후 동일 인덱스 매칭.
 * 다른 언어 매핑이 있으면 우선 사용.
 */
export const FAQ_TRANSLATIONS: Partial<Record<Locale, { question: string; answer: string }[]>> = {
  en: [
    {
      question: 'Can anyone join?',
      answer: 'Participation requirements may vary by campaign. In general, anyone with an SNS channel\ncan apply, creators are selected based on factors such as follower count, content quality,\nand campaign fit.',
    },
    {
      question: 'Which platforms can I use?',
      answer: 'You can participate using various platforms including Instagram, TikTok, YouTube, and more.',
    },
    {
      question: 'Can foreigners join?',
      answer: 'Yes. Influencers from different countries are actively participating on Trevity.',
    },
    {
      question: 'Is there any cost to join?',
      answer: 'Joining Trevity is completely free. Applying for campaigns also does not require any additional fees.',
    },
    {
      question: 'How do product campaigns work?',
      answer: 'Once selected, the brand ships the product to you. Try it out and upload your SNS content following the campaign guide — no travel required, join from anywhere.',
    },
  ],
  vi: [
    {
      question: 'Ai cũng có thể tham gia không?',
      answer: 'Điều kiện tham gia có thể khác nhau tùy từng chiến dịch. Thông thường, chỉ cần sở hữu kênh SNS là bạn đã có thể ứng tuyển. Việc lựa chọn creator sẽ dựa trên follower, chất lượng nội dung và mức độ phù hợp với chiến dịch.',
    },
    {
      question: 'Có thể sử dụng nền tảng nào?',
      answer: 'Bạn có thể tham gia bằng nhiều nền tảng như Instagram, TikTok, YouTube và nhiều kênh khác.',
    },
    {
      question: 'Người nước ngoài có thể tham gia không?',
      answer: 'Có. Hiện nhiều influencer từ các quốc gia khác nhau đang tham gia cùng Trevity.',
    },
    {
      question: 'Có phát sinh chi phí không?',
      answer: 'Đăng ký Trevity hoàn toàn miễn phí. Việc tham gia và ứng tuyển chiến dịch cũng không mất thêm chi phí.',
    },
    {
      question: 'Chiến dịch trải nghiệm sản phẩm diễn ra thế nào?',
      answer: 'Khi được chọn, thương hiệu sẽ gửi sản phẩm đến bạn. Hãy trải nghiệm và đăng nội dung SNS theo hướng dẫn của chiến dịch — không cần di chuyển, tham gia ở bất cứ đâu.',
    },
  ],
  ja: [
    {
      question: '誰でも参加できますか?',
      answer: '参加条件はキャンペーンによって異なります。一般的にSNSチャンネルをお持ちの方なら応募可能で、フォロワー数、コンテンツの質、キャンペーンとの適合性などに基づいてクリエイターが選ばれます。',
    },
    {
      question: 'どのプラットフォームを使えますか?',
      answer: 'Instagram、TikTok、YouTubeなど、さまざまなプラットフォームでご参加いただけます。',
    },
    {
      question: '外国の方でも参加できますか?',
      answer: 'はい。さまざまな国のインフルエンサーがTrevityで活発に活動しています。',
    },
    {
      question: '費用はかかりますか?',
      answer: 'Trevityへのご登録は完全無料です。キャンペーンへの応募にも追加料金はかかりません。',
    },
    {
      question: '製品体験キャンペーンはどのように進みますか?',
      answer: '選ばれると、ブランドから製品が届きます。体験後、ガイドに沿ってSNSコンテンツをアップロードするだけ。旅行なしでどこからでも参加できます。',
    },
  ],
  zh: [
    {
      question: '任何人都可以参加吗?',
      answer: '参加条件因活动而异。一般来说,只要拥有SNS渠道即可申请,我们将根据粉丝数、内容质量、与活动的契合度等因素选择创作者。',
    },
    {
      question: '可以使用哪些平台?',
      answer: '您可以使用 Instagram、TikTok、YouTube 等多种平台参与。',
    },
    {
      question: '外国人可以参加吗?',
      answer: '可以。来自不同国家的达人正活跃地在 Trevity 上参与。',
    },
    {
      question: '是否需要费用?',
      answer: '注册 Trevity 完全免费。申请活动也无需额外费用。',
    },
    {
      question: '产品体验活动如何进行?',
      answer: '入选后，品牌会将产品寄送给您。体验后按照活动指南上传SNS内容即可 — 无需出行，随时随地参与。',
    },
  ],
  th: [
    {
      question: 'ใครก็เข้าร่วมได้หรือไม่?',
      answer: 'ข้อกำหนดในการเข้าร่วมอาจแตกต่างกันไปตามแคมเปญ โดยทั่วไปผู้ที่มีช่อง SNS สามารถสมัครได้ ครีเอเตอร์จะถูกเลือกจากปัจจัยต่างๆ เช่น จำนวนผู้ติดตาม คุณภาพคอนเทนต์ และความเข้ากันได้ของแคมเปญ',
    },
    {
      question: 'ใช้แพลตฟอร์มใดได้บ้าง?',
      answer: 'คุณสามารถเข้าร่วมได้บนหลายแพลตฟอร์ม เช่น Instagram, TikTok, YouTube และอื่นๆ',
    },
    {
      question: 'ชาวต่างชาติเข้าร่วมได้หรือไม่?',
      answer: 'ได้ Influencer จากหลายประเทศกำลังเข้าร่วม Trevity อย่างคึกคัก',
    },
    {
      question: 'มีค่าใช้จ่ายหรือไม่?',
      answer: 'การลงทะเบียน Trevity ฟรีทั้งหมด การสมัครแคมเปญก็ไม่มีค่าใช้จ่ายเพิ่มเติม',
    },
    {
      question: 'แคมเปญทดลองสินค้าเป็นอย่างไร?',
      answer: 'เมื่อได้รับเลือก แบรนด์จะจัดส่งสินค้าให้คุณ ทดลองใช้แล้วอัปโหลดคอนเทนต์ SNS ตามไกด์ของแคมเปญ — ไม่ต้องเดินทาง เข้าร่วมได้จากทุกที่',
    },
  ],
  my: [
    {
      question: 'ဘယ်သူမဆို ပါဝင်လို့ရပါသလား?',
      answer: 'Campaign အလိုက် ပါဝင်ခွင့်သတ်မှတ်ချက်တွေ ကွာခြားနိုင်ပါတယ်။ ယေဘုယျအားဖြင့်တော့ ကိုယ်ပိုင် SNS Channel ရှိထားရင် လျှောက်ထားနိုင်ပြီး၊ Follower အရေအတွက်နဲ့ Content အရည်အသွေး စတာတွေကို အခြေခံပြီး Campaign တစ်ခုချင်းစီအလိုက် ရွေးချယ်ပေးသွားမှာ ဖြစ်ပါတယ်။',
    },
    {
      question: 'ဘယ်လို SNS မျိုးတွေကို အသုံးပြုလို့ရပါသလဲ?',
      answer: 'Instagram, TikTok, YouTube စတဲ့ Platform မျိုးစုံနဲ့ ပါဝင်နိုင်ပါသည်။',
    },
    {
      question: 'နိုင်ငံခြားသားတွေကော ပါဝင်လို့ရပါသလား?',
      answer: 'ပါဝင်နိုင်ပါသည်။ နိုင်ငံပေါင်းစုံက Influencer တွေလည်း ပါဝင်နေပါသည်။',
    },
    {
      question: 'ကုန်ကျစရိတ် ရှိပါသလား?',
      answer: 'Trevity မှာ Member ဝင်တာကတော့ အခမဲ့ ဖြစ်ပါသည်။ Campaign လျှောက်ထားခြင်းကိုလည်း သီးသန့် ကုန်ကျစရိတ်မရှိဘဲ အသုံးပြုနိုင်ပါသည်။',
    },
    {
      question: 'ထုတ်ကုန်စမ်းသပ် Campaign က ဘယ်လို လုပ်ဆောင်ရပါသလဲ?',
      answer: 'ရွေးချယ်ခံရပါက Brand က ထုတ်ကုန်ကို အိမ်အရောက် ပို့ပေးပါမယ်။ စမ်းသပ်အသုံးပြုပြီး Campaign လမ်းညွှန်အတိုင်း SNS Content တင်ရုံပါပဲ။ ခရီးမသွားဘဲ ဘယ်နေရာကနေမဆို ပါဝင်နိုင်ပါတယ်။',
    },
  ],
};
