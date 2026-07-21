import { LOCALES, type Locale } from '@/lib/i18n/dictionaries';

/**
 * 대표 도메인 — non-www + https (SEO 원칙).
 * 로컬/미설정 값이 프로덕션 canonical·hreflang 에 새는 것을 막기 위해
 * https:// 로 시작하는 실제 도메인일 때만 환경변수를 신뢰한다.
 */
const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim();
export const SITE_URL = (
  ENV_SITE_URL && /^https:\/\//.test(ENV_SITE_URL) && !/localhost|127\.0\.0\.1/.test(ENV_SITE_URL)
    ? ENV_SITE_URL
    : 'https://trevity.com'
).replace(/\/$/, '');

/**
 * hreflang 값 — 언어(ISO 639) + 지역(ISO 3166).
 * 주의: 'kr' 은 국가코드라 hreflang 에서 무효. 한국어는 'ko' / 'ko-KR'.
 * en 은 특정 국가에 묶지 않는 글로벌판이라 지역 없이 사용.
 */
export const HREFLANG: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en',
  ja: 'ja-JP',
  zh: 'zh-CN',
  vi: 'vi-VN',
  th: 'th-TH',
  my: 'my-MM',
};

/** 언어가 매칭되지 않는 방문자에게 보여줄 기본판 */
export const X_DEFAULT_LOCALE: Locale = 'en';

/** 검색결과·AI 인용에 쓰이는 언어별 메타 (본문 카피와 별개로 SEO 전용 문구) */
export const SEO: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '트래비티 | 글로벌 인플루언서 트렌드 체험 플랫폼',
    description:
      '트래비티는 글로벌 브랜드와 인플루언서를 연결하는 트렌드 체험 플랫폼입니다. 호텔·맛집·팝업 같은 플레이스 체험부터 뷰티·F&B·테크 신제품 체험까지, 9개국 캠페인에 무료로 참여하세요.',
  },
  en: {
    title: 'Trevity | Global Influencer Trend Experience Platform',
    description:
      'Trevity connects global brands with influencers through trend experiences — from hotels, restaurants and pop-ups to new beauty, F&B and tech products. Join campaigns across 9 countries, free to sign up.',
  },
  ja: {
    title: 'Trevity | グローバル・インフルエンサー トレンド体験プラットフォーム',
    description:
      'Trevityはグローバルブランドとインフルエンサーをつなぐトレンド体験プラットフォーム。ホテル・グルメ・ポップアップから新作コスメ・フード・ガジェットまで、9カ国のキャンペーンに無料で参加できます。',
  },
  zh: {
    title: 'Trevity | 全球达人潮流体验平台',
    description:
      'Trevity 是连接全球品牌与达人的潮流体验平台。涵盖酒店、餐饮、快闪店等空间体验，以及美妆、食品、数码新品体验，9 个国家的活动免费参与。',
  },
  vi: {
    title: 'Trevity | Nền tảng trải nghiệm xu hướng cho Influencer toàn cầu',
    description:
      'Trevity kết nối thương hiệu toàn cầu với influencer qua các chiến dịch trải nghiệm xu hướng — từ khách sạn, nhà hàng, pop-up đến sản phẩm mới về beauty, F&B và công nghệ. Tham gia miễn phí tại 9 quốc gia.',
  },
  th: {
    title: 'Trevity | แพลตฟอร์มประสบการณ์เทรนด์สำหรับ Influencer ระดับโลก',
    description:
      'Trevity เชื่อมแบรนด์ระดับโลกกับ Influencer ผ่านแคมเปญเทรนด์ — โรงแรม ร้านอาหาร ป๊อปอัพ ไปจนถึงสินค้าใหม่สายบิวตี้ อาหาร และแกดเจ็ต สมัครฟรี ร่วมแคมเปญใน 9 ประเทศ',
  },
  my: {
    title: 'Trevity | ကမ္ဘာလုံးဆိုင်ရာ Influencer Trend အတွေ့အကြုံ ပလက်ဖောင်း',
    description:
      'Trevity သည် ကမ္ဘာ့အဆင့်မီ Brand များနှင့် Influencer များကို ချိတ်ဆက်ပေးသော Trend အတွေ့အကြုံ Platform ဖြစ်သည်။ ဟိုတယ်၊ စားသောက်ဆိုင်မှသည် Beauty၊ F&B၊ Tech ထုတ်ကုန်အသစ်များအထိ နိုင်ငံ ၉ နိုင်ငံရှိ Campaign များတွင် အခမဲ့ ပါဝင်နိုင်ပါသည်။',
  },
};

/** 언어별 대체 URL 맵 (hreflang) — path 는 '' 또는 '/blog' 같은 하위 경로 */
export function languageAlternates(path = ''): Record<string, string> {
  const clean = path && !path.startsWith('/') ? `/${path}` : path;
  const map: Record<string, string> = {};

  for (const l of LOCALES) {
    map[HREFLANG[l]] = `${SITE_URL}/${l}${clean}`;
  }
  map['x-default'] = `${SITE_URL}/${X_DEFAULT_LOCALE}${clean}`;

  return map;
}

/** Accept-Language 헤더 → 지원 locale 추론 */
export function detectLocale(acceptLanguage?: string | null): Locale {
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(',')) {
      const base = part.trim().split(';')[0].toLowerCase().split('-')[0];
      if ((LOCALES as readonly string[]).includes(base)) {
        return base as Locale;
      }
    }
  }

  return X_DEFAULT_LOCALE;
}

/**
 * Organization 구조화 데이터 — 전 도메인에 동일 적용해 하나의 엔티티로 묶는다.
 * sameAs 에 서비스 서브도메인·SNS 를 모두 넣는 것이 AEO/GEO 의 핵심.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Trevity',
    alternateName: '트래비티',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SEO.en.description,
    sameAs: [
      'https://kr.trevity.com',
      'https://vn.trevity.com',
      'https://cn.trevity.com',
      'https://mm.trevity.com',
      'https://www.instagram.com/trevity__/',
      'https://www.threads.com/@trevity__',
    ],
    areaServed: ['KR', 'VN', 'CN', 'MM', 'TH', 'JP', 'TW', 'HK', 'SG', 'PH'],
  };
}
