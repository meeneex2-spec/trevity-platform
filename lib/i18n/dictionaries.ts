/**
 * 랜딩 UI 다국어 문구 (6개 언어).
 * DB 콘텐츠(국가명, 캠페인 제목, FAQ 등)는 한국어 데이터 그대로 사용.
 * 추후 컬럼별 다국어 필요 시 _en/_ja/... 컬럼 추가 또는 별도 translations 테이블.
 *
 * 번역 품질 노트:
 * - en/ja 는 자연스러운 마케팅 카피
 * - zh-CN(간체)/vi/th 는 기본 번역. 운영 시 원어민 검토 권장.
 */

export const LOCALES = ['ko', 'en', 'ja', 'zh', 'vi', 'th'] as const;
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
  campaigns: { label: string; title1: string; title2: string };
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

export const dictionaries: Record<Locale, Dictionary> = {
  ko: {
    nav: { campaigns: '캠페인', regions: '국가', creators: '크리에이터', faq: 'FAQ', cta: '인플루언서 시작하기' },
    hero: {
      badge: '✈️  글로벌 크리에이터 플랫폼',
      title1: '여행하고,', title2: '콘텐츠 만들고,', title3: '성장하세요',
      desc: '트래비티는 글로벌 브랜드와 인플루언서를 연결하는 여행 체험 플랫폼입니다. 호텔, 마사지, 맛집, 액티비티 등 다양한 여행 캠페인을 경험하고 콘텐츠를 만들어보세요.',
      ctaPrimary: '인플루언서 시작하기 →', ctaSecondary: '캠페인 둘러보기',
      regions: '한국 · 베트남 · 일본 · 태국 · 대만 · 홍콩 · 싱가포르',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '새 캠페인 승인!', phoneNotifSub: 'Bangkok Hotel — 시작 준비 완료',
      phoneTag: '✓ 캠페인 참여 중', phoneSub: '이 호텔을 경험하고\n콘텐츠를 만들어보세요',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 캠페인 지원 가능',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: '여행 경험이', title2: '콘텐츠가 되는 곳',
      desc: '트래비티는 브랜드와 인플루언서를 연결해 새로운 여행 경험과 콘텐츠 기회를 제공합니다. 단순한 광고가 아닌, 실제 경험을 기반으로 콘텐츠를 만듭니다.',
      f1Title: '글로벌 캠페인', f1Desc: '호텔, 마사지, 레스토랑, 액티비티 등 다양한 여행 캠페인 참여 가능',
      f2Title: '콘텐츠 성장', f2Desc: '브랜드 협업을 통해 SNS 콘텐츠와 영향력을 성장시키세요',
      f3Title: '간편한 참여', f3Desc: '회원가입 후 원하는 캠페인에 쉽게 지원할 수 있습니다',
      f4Title: '다양한 국가 경험', f4Desc: '아시아 여러 국가의 캠페인을 경험할 수 있습니다',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: '아시아 글로벌 캠페인을', title2: '만나보세요',
      desc: '트래비티는 다양한 국가의 브랜드와 인플루언서를 연결하고 있습니다.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '다양한 여행 캠페인을', title2: '경험해보세요',
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
      desc: '트래비티와 함께라면 여행하면서 더 크게 성장할 수 있습니다.', cta: '지금 시작하기 →',
      b1: '무료 체험 기회', b2: '글로벌 브랜드 협업', b3: 'SNS 성장',
      b4: '여행 콘텐츠 제작', b5: '새로운 국가 경험', b6: '포트폴리오 강화',
    },
    content: {
      label: 'CREATOR CONTENT', title1: '실제 크리에이터', title2: '콘텐츠',
      desc: '트래비티 크리에이터들의 실제 여행 콘텐츠를 만나보세요',
    },
    faq: { label: 'FAQ', title: '자주 묻는 질문' },
    finalCta: {
      title1: '지금 글로벌 여행 캠페인을', title2: '시작해보세요',
      desc: '트래비티와 함께 새로운 여행 경험과 콘텐츠를 만들어보세요',
      cta: '인플루언서 시작하기 →',
      check1: '무료 가입', check2: '8개국 캠페인', check3: '글로벌 브랜드 협업',
    },
    footer: {
      tagline: '글로벌 인플루언서 여행 체험 플랫폼',
      l1: '이용약관', l2: '개인정보처리방침', l3: '크리에이터 센터', l4: '문의하기',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '언어' },
  },

  en: {
    nav: { campaigns: 'Campaigns', regions: 'Regions', creators: 'Creators', faq: 'FAQ', cta: 'Start as Influencer' },
    hero: {
      badge: '✈️  Global Creator Platform',
      title1: 'Travel,', title2: 'create content,', title3: 'grow your influence',
      desc: 'Trevity connects global brands with influencers through inspiring travel experiences — from luxury hotels and spas to trending restaurants and unique activities.',
      ctaPrimary: 'Start as Influencer →', ctaSecondary: 'Explore Campaigns',
      regions: 'Korea · Vietnam · Japan · Thailand · Taiwan · Hong Kong · Singapore',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'Campaign approved!', phoneNotifSub: 'Bangkok Hotel — ready to start',
      phoneTag: '✓ Active campaign', phoneSub: 'Experience this hotel\nand create content',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 Apply to campaigns',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'Where travel turns into', title2: 'content worth sharing',
      desc: 'Trevity brings brands and influencers together through real travel experiences that inspire genuine, engaging content.',
      f1Title: 'Global Campaigns', f1Desc: 'Hotels, spas, restaurants, activities and more across Asia',
      f2Title: 'Content Growth', f2Desc: 'Grow your SNS reach through real brand collaborations',
      f3Title: 'Easy to Join', f3Desc: 'Sign up and apply to campaigns you love in minutes',
      f4Title: 'Experience New Countries', f4Desc: 'Get matched with campaigns across multiple countries',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'Explore our Asia-wide', title2: 'campaign network',
      desc: 'Trevity connects brands and influencers through campaigns across multiple countries in Asia.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'Discover unique', title2: 'travel experiences',
    },
    how: {
      label: 'HOW IT WORKS', title1: 'Simple, fast', title2: 'to get started',
      s1Title: 'Sign up', s1Desc: 'Join as a Trevity creator',
      s2Title: 'Apply', s2Desc: 'Apply to campaigns you want',
      s3Title: 'Experience & Create', s3Desc: 'Visit the brand and create content',
      s4Title: 'Grow', s4Desc: 'Unlock new brands and bigger opportunities',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'Created for travelers', title2: 'who create',
      desc: 'Turn every trip into new content and new opportunities with Trevity.', cta: 'Get Started →',
      b1: 'Free experiences', b2: 'Global brand collabs', b3: 'SNS growth',
      b4: 'Travel content', b5: 'New countries', b6: 'Portfolio boost',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'Real creator', title2: 'content',
      desc: 'Discover real travel content made by Trevity creators',
    },
    faq: { label: 'FAQ', title: 'Frequently Asked Questions' },
    finalCta: {
      title1: 'Start a global travel', title2: 'campaign today',
      desc: 'Create new travel experiences and content with Trevity',
      cta: 'Start as Influencer →',
      check1: 'Free to join', check2: '8 countries', check3: 'Global brand collabs',
    },
    footer: {
      tagline: 'Global influencer travel platform',
      l1: 'Terms', l2: 'Privacy', l3: 'Creator Center', l4: 'Contact',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'Language' },
  },

  ja: {
    nav: { campaigns: 'キャンペーン', regions: '国・地域', creators: 'クリエイター', faq: 'FAQ', cta: 'インフルエンサー登録' },
    hero: {
      badge: '✈️  グローバル・クリエイタープラットフォーム',
      title1: '旅して、', title2: 'コンテンツを作り、', title3: '成長しよう',
      desc: 'Trevityはグローバルブランドとインフルエンサーをつなぐ旅行体験プラットフォームです。ホテル、スパ、レストラン、アクティビティなど、多彩なキャンペーンを体験してコンテンツを制作できます。',
      ctaPrimary: 'インフルエンサー登録 →', ctaSecondary: 'キャンペーンを見る',
      regions: '韓国 · ベトナム · 日本 · タイ · 台湾 · 香港 · シンガポール',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '新しいキャンペーン承認!', phoneNotifSub: 'Bangkok Hotel — 開始準備完了',
      phoneTag: '✓ 参加中', phoneSub: 'このホテルを体験し\nコンテンツを作ろう',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 キャンペーン応募可能',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: '旅の体験が', title2: 'コンテンツになる',
      desc: 'Trevityはブランドとインフルエンサーをつなぎ、新しい旅行体験とコンテンツの機会を提供します。単なる広告ではなく、実体験ベースのコンテンツです。',
      f1Title: 'グローバルキャンペーン', f1Desc: 'ホテル・スパ・レストラン・アクティビティなど多様な参加機会',
      f2Title: 'コンテンツ成長', f2Desc: 'ブランドコラボでSNSと影響力を成長',
      f3Title: '簡単参加', f3Desc: '登録後すぐにお好みのキャンペーンに応募できます',
      f4Title: '各国を体験', f4Desc: 'アジア各国のキャンペーンを体験',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'アジア各国の', title2: 'キャンペーンに出会う',
      desc: 'Trevityは多様な国のブランドとインフルエンサーを繋いでいます。',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '多彩な旅行キャンペーン', title2: 'を体験しよう',
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
      desc: 'Trevityなら旅をしながらさらに大きく成長できます。', cta: '今すぐ始める →',
      b1: '無料体験機会', b2: 'グローバルブランド協業', b3: 'SNS成長',
      b4: '旅行コンテンツ制作', b5: '新しい国の体験', b6: 'ポートフォリオ強化',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'リアルクリエイター', title2: 'コンテンツ',
      desc: 'Trevityクリエイターの実際の旅行コンテンツをご覧ください',
    },
    faq: { label: 'FAQ', title: 'よくある質問' },
    finalCta: {
      title1: 'グローバル旅行キャンペーンを', title2: '今すぐ始めよう',
      desc: 'Trevityと一緒に新しい旅体験とコンテンツを',
      cta: 'インフルエンサー登録 →',
      check1: '登録無料', check2: '8カ国対応', check3: 'グローバルブランド協業',
    },
    footer: {
      tagline: 'グローバル・インフルエンサー旅行体験プラットフォーム',
      l1: '利用規約', l2: 'プライバシー', l3: 'クリエイターセンター', l4: 'お問い合わせ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '言語' },
  },

  zh: {
    nav: { campaigns: '活动', regions: '国家', creators: '创作者', faq: 'FAQ', cta: '成为达人' },
    hero: {
      badge: '✈️  全球创作者平台',
      title1: '去旅行,', title2: '创作内容,', title3: '与品牌共同成长',
      desc: 'Trevity 是连接全球品牌与达人的旅行体验平台。酒店、按摩、餐厅、活动 — 体验多元化的旅行活动并创作内容。',
      ctaPrimary: '成为达人 →', ctaSecondary: '浏览活动',
      regions: '韩国 · 越南 · 日本 · 泰国 · 台湾 · 香港 · 新加坡',
      scrollHint: 'SCROLL',
      phoneNotifTitle: '新活动通过!', phoneNotifSub: 'Bangkok Hotel — 准备开始',
      phoneTag: '✓ 活动进行中', phoneSub: '体验这家酒店\n并创作内容',
      phoneSec1: '📊 15K 粉丝+', phoneSec2: '🎯 可申请活动',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: '让旅行体验', title2: '变成精彩内容',
      desc: 'Trevity 连接品牌与达人,提供全新的旅行体验与内容机会。不是简单的广告,而是基于真实体验的内容。',
      f1Title: '全球活动', f1Desc: '酒店、按摩、餐厅、活动等多元化旅行活动',
      f2Title: '内容增长', f2Desc: '通过品牌合作提升 SNS 内容与影响力',
      f3Title: '轻松参与', f3Desc: '注册后可立即申请喜欢的活动',
      f4Title: '体验多国文化', f4Desc: '体验亚洲多国活动',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: '邂逅亚洲全球', title2: '活动网络',
      desc: 'Trevity 连接多个国家的品牌与达人。',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: '体验丰富多样的', title2: '旅行活动',
    },
    how: {
      label: 'HOW IT WORKS', title1: '简单快速', title2: '即刻开始',
      s1Title: '注册', s1Desc: '成为 Trevity 创作者',
      s2Title: '申请活动', s2Desc: '申请你想要的活动',
      s3Title: '体验与创作', s3Desc: '体验品牌并创作内容',
      s4Title: '成长', s4Desc: '解锁新品牌与更多机会',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: '为创作者打造的', title2: '多元化福利',
      desc: '与 Trevity 同行,边旅行边成长。', cta: '立即开始 →',
      b1: '免费体验机会', b2: '全球品牌合作', b3: 'SNS 成长',
      b4: '旅行内容制作', b5: '体验新国家', b6: '作品集升级',
    },
    content: {
      label: 'CREATOR CONTENT', title1: '真实创作者', title2: '内容',
      desc: '查看 Trevity 创作者的真实旅行内容',
    },
    faq: { label: 'FAQ', title: '常见问题' },
    finalCta: {
      title1: '立即开启', title2: '全球旅行活动',
      desc: '与 Trevity 一起创造全新的旅行体验与内容',
      cta: '成为达人 →',
      check1: '免费注册', check2: '8国活动', check3: '全球品牌合作',
    },
    footer: {
      tagline: '全球达人旅行体验平台',
      l1: '使用条款', l2: '隐私政策', l3: '创作者中心', l4: '联系我们',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: '语言' },
  },

  vi: {
    nav: { campaigns: 'Chiến dịch', regions: 'Quốc gia', creators: 'Creator', faq: 'FAQ', cta: 'Bắt đầu làm Influencer' },
    hero: {
      badge: '✈️  Nền tảng Creator toàn cầu',
      title1: 'Du lịch,', title2: 'sáng tạo nội dung,', title3: 'lan toả sức ảnh hưởng',
      desc: 'Trevity mở ra cầu nối giữa thương hiệu và influencer qua những chiến dịch trải nghiệm đa dạng — khách sạn, spa, nhà hàng, du lịch và nhiều hoạt động đặc biệt khác trên toàn cầu.',
      ctaPrimary: 'Bắt đầu làm Influencer →', ctaSecondary: 'Khám phá chiến dịch',
      regions: 'Hàn Quốc · Việt Nam · Nhật · Thái Lan · Đài Loan · Hong Kong · Singapore',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'Chiến dịch được duyệt!', phoneNotifSub: 'Bangkok Hotel — sẵn sàng bắt đầu',
      phoneTag: '✓ Đang tham gia', phoneSub: 'Trải nghiệm khách sạn này\nvà tạo nội dung',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 Có thể ứng tuyển',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'Trải nghiệm thực tế,', title2: 'nội dung chân thật',
      desc: 'Trevity kết nối thương hiệu và influencer thông qua các trải nghiệm thực tế, nơi mỗi chuyến đi, dịch vụ hay khoảnh khắc đều có thể trở thành nội dung đầy cảm hứng.',
      f1Title: 'Chiến dịch toàn cầu', f1Desc: 'Khách sạn, spa, nhà hàng và trải nghiệm nổi bật khắp châu Á',
      f2Title: 'Nâng tầm nội dung', f2Desc: 'Mở rộng sức ảnh hưởng SNS cùng các thương hiệu toàn cầu',
      f3Title: 'Đăng ký dễ dàng', f3Desc: 'Tham gia chiến dịch nhanh chóng chỉ với vài bước',
      f4Title: 'Cơ hội đa quốc gia', f4Desc: 'Mở rộng hoạt động influencer trên nhiều thị trường khác nhau',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'Mạng lưới chiến dịch', title2: 'khắp châu Á',
      desc: 'Trevity kết nối thương hiệu và influencer tại nhiều quốc gia.',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'Khám phá nhiều', title2: 'chiến dịch du lịch',
    },
    how: {
      label: 'HOW IT WORKS', title1: 'Đơn giản, nhanh chóng', title2: 'bắt đầu cùng Trevity',
      s1Title: 'Đăng ký', s1Desc: 'Trở thành Trevity Creator',
      s2Title: 'Ứng tuyển', s2Desc: 'Chọn tham gia chiến dịch bạn yêu thích',
      s3Title: 'Trải nghiệm & sáng tạo', s3Desc: 'Khám phá thương hiệu và tạo nội dung chân thực',
      s4Title: 'Phát triển', s4Desc: 'Mở rộng cơ hội hợp tác cùng nhiều thương hiệu hơn',
    },
    benefits: {
      label: 'CREATOR BENEFITS', title1: 'Quyền lợi hấp dẫn', title2: 'dành cho Creator',
      desc: 'Biến mỗi chuyến đi thành cơ hội phát triển cùng Trevity.', cta: 'Bắt đầu ngay →',
      b1: 'Trải nghiệm miễn phí', b2: 'Hợp tác thương hiệu toàn cầu', b3: 'Tăng trưởng SNS',
      b4: 'Sáng tạo nội dung du lịch', b5: 'Khám phá quốc gia mới', b6: 'Nâng cấp portfolio',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'Nội dung thực', title2: 'từ creator',
      desc: 'Khám phá nội dung du lịch thực tế từ các Trevity Creator',
    },
    faq: { label: 'FAQ', title: 'Câu hỏi thường gặp' },
    finalCta: {
      title1: 'Bắt đầu chiến dịch', title2: 'du lịch toàn cầu ngay',
      desc: 'Cùng Trevity tạo trải nghiệm và nội dung du lịch mới',
      cta: 'Bắt đầu làm Influencer →',
      check1: 'Đăng ký miễn phí', check2: 'Chiến dịch tại 8 quốc gia', check3: 'Hợp tác thương hiệu toàn cầu',
    },
    footer: {
      tagline: 'Nền tảng trải nghiệm du lịch cho influencer toàn cầu',
      l1: 'Điều khoản', l2: 'Quyền riêng tư', l3: 'Trung tâm Creator', l4: 'Liên hệ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'Ngôn ngữ' },
  },

  th: {
    nav: { campaigns: 'แคมเปญ', regions: 'ประเทศ', creators: 'ครีเอเตอร์', faq: 'FAQ', cta: 'เริ่มเป็น Influencer' },
    hero: {
      badge: '✈️  แพลตฟอร์มครีเอเตอร์ระดับโลก',
      title1: 'เดินทาง,', title2: 'สร้างคอนเทนต์,', title3: 'เติบโตไปด้วยกัน',
      desc: 'Trevity เชื่อมแบรนด์ระดับโลกกับ Influencer ผ่านแคมเปญท่องเที่ยว — โรงแรม สปา ร้านอาหาร กิจกรรม และอื่นๆ',
      ctaPrimary: 'เริ่มเป็น Influencer →', ctaSecondary: 'ดูแคมเปญ',
      regions: 'เกาหลี · เวียดนาม · ญี่ปุ่น · ไทย · ไต้หวัน · ฮ่องกง · สิงคโปร์',
      scrollHint: 'SCROLL',
      phoneNotifTitle: 'อนุมัติแคมเปญใหม่!', phoneNotifSub: 'Bangkok Hotel — พร้อมเริ่ม',
      phoneTag: '✓ กำลังร่วมแคมเปญ', phoneSub: 'สัมผัสประสบการณ์โรงแรมนี้\nและสร้างคอนเทนต์',
      phoneSec1: '📊 15K followers+', phoneSec2: '🎯 สมัครแคมเปญได้',
    },
    what: {
      label: 'WHAT IS TREVITY', title1: 'ที่ที่ประสบการณ์ท่องเที่ยว', title2: 'กลายเป็นคอนเทนต์',
      desc: 'Trevity เชื่อมแบรนด์และ Influencer เพื่อสร้างประสบการณ์และโอกาสด้านคอนเทนต์ใหม่ๆ ไม่ใช่แค่โฆษณา แต่เป็นคอนเทนต์ที่มาจากประสบการณ์จริง',
      f1Title: 'แคมเปญระดับโลก', f1Desc: 'โรงแรม สปา ร้านอาหาร กิจกรรมหลากหลายทั่วเอเชีย',
      f2Title: 'เติบโตทางคอนเทนต์', f2Desc: 'เพิ่ม Reach SNS ผ่านการร่วมงานกับแบรนด์',
      f3Title: 'เข้าร่วมง่าย', f3Desc: 'สมัครและร่วมแคมเปญที่คุณชอบได้ทันที',
      f4Title: 'สัมผัสหลายประเทศ', f4Desc: 'ร่วมแคมเปญในหลายประเทศของเอเชีย',
    },
    regions: {
      label: 'GLOBAL REGIONS', title1: 'พบเครือข่ายแคมเปญ', title2: 'ทั่วเอเชีย',
      desc: 'Trevity เชื่อมแบรนด์และ Influencer ในหลายประเทศ',
    },
    campaigns: {
      label: 'CAMPAIGNS', title1: 'สัมผัสแคมเปญท่องเที่ยว', title2: 'หลากหลายรูปแบบ',
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
      desc: 'กับ Trevity คุณสามารถเติบโตไปพร้อมกับการเดินทาง', cta: 'เริ่มเลย →',
      b1: 'ประสบการณ์ฟรี', b2: 'ร่วมงานแบรนด์ระดับโลก', b3: 'เติบโตบน SNS',
      b4: 'คอนเทนต์ท่องเที่ยว', b5: 'ประเทศใหม่ๆ', b6: 'เสริมพอร์ตโฟลิโอ',
    },
    content: {
      label: 'CREATOR CONTENT', title1: 'คอนเทนต์', title2: 'จากครีเอเตอร์จริง',
      desc: 'ชมคอนเทนต์การเดินทางจาก Trevity Creator',
    },
    faq: { label: 'FAQ', title: 'คำถามที่พบบ่อย' },
    finalCta: {
      title1: 'เริ่มแคมเปญท่องเที่ยว', title2: 'ระดับโลกวันนี้',
      desc: 'สร้างประสบการณ์และคอนเทนต์ใหม่ๆ กับ Trevity',
      cta: 'เริ่มเป็น Influencer →',
      check1: 'สมัครฟรี', check2: 'แคมเปญ 8 ประเทศ', check3: 'ร่วมงานแบรนด์ระดับโลก',
    },
    footer: {
      tagline: 'แพลตฟอร์มประสบการณ์ท่องเที่ยวสำหรับ Influencer',
      l1: 'ข้อกำหนด', l2: 'นโยบายความเป็นส่วนตัว', l3: 'ศูนย์ครีเอเตอร์', l4: 'ติดต่อ',
      copy: '© 2026 Trevity. All rights reserved.',
    },
    common: { languageLabel: 'ภาษา' },
  },
};

export const LOCALE_META: Record<Locale, { label: string; native: string; flag: string }> = {
  ko: { label: 'Korean',     native: '한국어',       flag: '🇰🇷' },
  en: { label: 'English',    native: 'English',      flag: '🇺🇸' },
  ja: { label: 'Japanese',   native: '日本語',        flag: '🇯🇵' },
  zh: { label: 'Chinese',    native: '中文',          flag: '🇨🇳' },
  vi: { label: 'Vietnamese', native: 'Tiếng Việt',   flag: '🇻🇳' },
  th: { label: 'Thai',       native: 'ภาษาไทย',     flag: '🇹🇭' },
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
    restaurants: { name: 'Restaurants',    description: 'Trendy restaurants and authentic local dining' },
    cafes:       { name: 'Cafes',          description: 'Stylish cafes and must-visit dessert spots' },
    beauty:      { name: 'Beauty',         description: 'Beauty and lifestyle brands' },
    activities:  { name: 'Activities',     description: 'Tours, activities, and experience groups' },
  },
  vi: {
    hotels:      { name: 'Khách sạn',      description: 'Từ khách sạn sang trọng đến không gian lưu trú đầy cảm hứng' },
    massage:     { name: 'Massage & Spa',  description: 'Trải nghiệm massage và spa được yêu thích tại địa phương' },
    restaurants: { name: 'Restaurants',    description: 'Khám phá nhà hàng xu hướng và ẩm thực bản địa đặc sắc' },
    cafes:       { name: 'Cafes',          description: 'Những quán cafe mang phong cách riêng cùng tráng miệng hấp dẫn' },
    beauty:      { name: 'Beauty',         description: 'Các thương hiệu beauty và lifestyle được quan tâm' },
    activities:  { name: 'Activities',     description: 'Tour, hoạt động trải nghiệm và nội dung khám phá đa dạng' },
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
      answer: 'Participation requirements may vary by campaign. In general, anyone with an SNS channel can apply, creators are selected based on factors such as follower count, content quality, and campaign fit.',
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
  ],
};
