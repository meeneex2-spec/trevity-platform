# Trevity Platform

글로벌 인플루언서 여행 체험 플랫폼.
랜딩 페이지 + haoz 스타일 어드민 (콘텐츠 관리 + 문의함).

## 스택

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres + Auth + Storage)
- **react-quill** (어드민 본문 에디터 — haoz 동일)
- **sonner** (토스트 알림 — "정상적으로 추가되었습니다" 패턴)
- **Tailwind CSS**

## 폴더 구조

```
trevity-platform/
├── app/
│   ├── page.tsx                       # 랜딩
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/inquiries/route.ts         # 문의 제출 (public)
│   └── admin/
│       ├── layout.tsx                 # 어드민 shell
│       ├── login/page.tsx             # 로그인
│       ├── dashboard/page.tsx         # 대시보드 (통계 + 최근 문의)
│       ├── campaigns/                 # 캠페인 CRUD (Quill)
│       ├── countries/                 # 국가 인라인 편집
│       ├── categories/                # 카테고리 인라인 편집
│       ├── faqs/                      # FAQ 인라인 편집
│       ├── reels/                     # Reels 인라인 편집
│       └── inquiries/                 # 문의함 (상태 관리, CSV 내보내기)
├── components/
│   ├── landing/                       # 9개 섹션 + 문의 모달
│   └── admin/                         # AdminShell, 각 Editor
├── lib/supabase/
│   ├── client.ts                      # 브라우저용
│   ├── server.ts                      # Server Component 용
│   └── admin.ts                       # service_role (서버 전용)
├── middleware.ts                      # /admin/* 인증 가드
└── supabase/
    ├── schema.sql                     # 전체 DDL + RLS + 시드
    └── SETUP.md                       # Supabase 세팅 가이드
```

## 로컬 개발 시작

### 1) Supabase 세팅

`supabase/SETUP.md` 를 그대로 따라가시면 됩니다.
요약:

1. supabase.com 에서 새 프로젝트 생성 (Seoul 리전)
2. API URL/anon key/service_role key 복사 → `.env.local`
3. SQL Editor 에서 `supabase/schema.sql` 통째로 실행
4. Storage 에 `campaign-images` Public 버킷 생성
5. Authentication 에서 첫 어드민 계정 생성 후 `admin_users` 테이블에 등록

### 2) 의존성 설치 & 실행

```bash
cd C:\Users\felix\Desktop\trevity-platform
npm install
cp .env.example .env.local   # 값 채워넣기
npm run dev
```

- 랜딩: http://localhost:3000
- 어드민: http://localhost:3000/admin/login

## Vercel 배포

1. https://vercel.com 접속 → **Add New Project**
2. 이 폴더를 git 저장소로 푸시 후 import (또는 Vercel CLI: `npx vercel`)
3. **Environment Variables** 에 `.env.local` 4개 항목 그대로 추가
4. **Deploy**

이후 도메인 연결은 Vercel **Domains** 에서 가능합니다.

## haoz 어드민 UX 매핑

| haoz 어드민 | 이 프로젝트 |
|---|---|
| `/haoadmin/login` (이메일+비번, 캡차X) | `/admin/login` |
| 좌측 사이드바 + 상단 헤더 | `AdminShell` |
| `/article/manage/new`, `manage/edit/{id}` | `/admin/campaigns/new`, `edit/[id]` |
| jstree 카테고리 트리 | `<select>` (8국가 규모에서 트리 위젯 불필요) |
| Quill 본문 에디터 | `react-quill` |
| "정상적으로 추가되었습니다" 토스트 | `sonner` 토스트 |
| 카테고리 ID 직접 set 핵심 | `category_id` foreign key |

## 다음 단계 후보 (이번 MVP 에선 제외)

- [ ] 인플루언서 회원가입/로그인 (Supabase Auth, public)
- [ ] 캠페인 상세 페이지 (`/campaigns/[slug]`) 및 지원 워크플로우
- [ ] 브랜드 어드민 분리 (`brand_users` 테이블 + 역할 분리)
- [ ] 이메일 알림 (새 문의 도착 시 Resend/SendGrid)
- [ ] 어드민 다국어 (영문 어드민)
- [ ] Google Analytics / Plausible 연동

## 운영 메모

- 랜딩은 60초 ISR. 어드민에서 콘텐츠 수정해도 최대 1분 지연 후 반영. 즉시 반영이 필요하면 `revalidate = 0` 으로 변경.
- service_role 키는 **절대 클라이언트 컴포넌트에서 import 금지**. 서버 API/Server Action 에서만 사용.
- 첫 어드민 계정은 Supabase Authentication 패널에서만 만들 수 있음 (회원가입 라우트는 의도적으로 미구현).
