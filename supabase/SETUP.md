# Supabase 세팅 가이드

## 1. 프로젝트 생성

1. https://supabase.com 접속 → 로그인 (Github 계정 추천)
2. **New project** 클릭
3. 입력:
   - **Name**: `trevity-platform`
   - **Database Password**: 강한 비번 생성 후 **반드시 안전한 곳에 저장** (DB 직접 접근 시 사용)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: Free
4. **Create new project** → 약 2분 대기

## 2. API Key 복사 → .env.local

프로젝트 생성 완료 후 좌측 **Project Settings** (톱니바퀴) → **API**:

| Supabase 항목 | .env.local 키 |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Project API Keys → `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Project API Keys → `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

프로젝트 루트의 `.env.example` 을 `.env.local` 로 복사하고 값을 채워주세요.

⚠️ **service_role 키는 절대 클라이언트에 노출되면 안 됨**. `.env.local` 은 git 에 안 올라가도록 `.gitignore` 에 이미 등록되어 있습니다.

## 3. 스키마 생성

좌측 **SQL Editor** → **New query**

`supabase/schema.sql` 파일 내용을 **통째로 복사 → 붙여넣기 → Run** (Ctrl+Enter).

성공하면 좌측 **Table Editor** 에 다음 테이블이 보입니다:

- `countries` (8개 행 시드됨)
- `campaign_categories` (6개 행 시드됨)
- `campaigns` (빈 테이블)
- `faqs` (4개 행 시드됨)
- `reels` (6개 행 시드됨)
- `inquiries` (빈 테이블)
- `admin_users` (빈 테이블)

## 4. Storage 버킷 생성

좌측 **Storage** → **New bucket**

- **Name**: `campaign-images`
- **Public bucket**: ON ✅
- **Allowed MIME types**: `image/*`
- **File size limit**: `5 MB`

→ **Save**

## 5. 첫 어드민 계정 만들기

좌측 **Authentication** → **Users** → **Add user** → **Create new user**:

- **Email**: 본인 이메일
- **Password**: 강한 비번
- **Auto Confirm User**: ✅ (체크)

→ **Create user**

그 다음 좌측 **SQL Editor** 에서:

```sql
-- 방금 만든 어드민 계정을 admin_users 테이블에 등록
insert into public.admin_users (id, email, display_name, role)
select id, email, '관리자', 'admin'
from auth.users
where email = '본인이메일@example.com';
```

→ **Run**

이제 `/admin/login` 에서 그 이메일+비번으로 로그인 가능.

## 6. 로컬 실행

```bash
cd C:\Users\felix\Desktop\trevity-platform
npm install
npm run dev
```

→ http://localhost:3000 (랜딩)
→ http://localhost:3000/admin/login (어드민)
