# LinkDigest PRD v1.0

**AI 링크 요약 & 주간 뉴스레터 서비스**

---

| 항목 | 내용 |
|---|---|
| 문서 버전 | v1.0 |
| 작성일 | 2026년 04월 05일 |
| 대상 독자 | 솔로 개발자 (본인) |

---

## 1. 프로젝트 개요

### 1.1 프로젝트 이름 및 한줄 설명

**LinkDigest** — 모바일에서 공유한 링크를 AI로 자동 요약하고, 주간 뉴스레터로 복습 기회를 제공하는 개인 생산성 서비스

### 1.2 해결하려는 문제

| 문제 | 현재 상황 | 결과 |
|---|---|---|
| 링크 사장(死藏) | "나중에 읽으려고" 저장한 링크가 쌓이기만 함 | 저장한 콘텐츠의 90% 이상을 다시 보지 않음 |
| 요약 부재 | 링크를 열어 전체 글을 읽어야 핵심을 파악 가능 | 시간 부족으로 읽기를 미루게 됨 |
| 복습 기회 없음 | 저장 후 재노출 메커니즘이 없음 | 유용한 정보가 기억에서 사라짐 |

### 1.3 핵심 가치 제안

- **즉시 요약**: 링크 저장 즉시 AI가 핵심을 3줄로 요약 — 전체 글을 읽지 않아도 핵심 파악 가능
- **자동 복습**: 주간 뉴스레터로 저장된 링크를 재노출 — "저장만 하고 안 보는" 문제 해결
- **제로 마찰 저장**: 모바일 공유 시트에서 한 번의 탭으로 링크 저장 — 별도 앱 전환 불필요

### 1.4 기술 스택

| 구분 | 기술 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 15 (App Router) | 프론트 + API Routes 통합, Vercel 배포 |
| UI | TailwindCSS v4 + shadcn/ui (New York) | 디자인 시스템 |
| 폼/검증 | react-hook-form + zod | Settings 페이지 폼 처리 + 런타임 검증 |
| 서버 상태 | TanStack Query (React Query) | 링크 목록 캐싱, 낙관적 업데이트 |
| 인증 | Supabase Auth + Google OAuth | 구글 소셜 로그인 |
| DB | Supabase (PostgreSQL) | 링크, 요약 데이터 저장, RLS 필수 적용 |
| AI 요약 | LLM API (사용자가 Settings에서 provider 선택) | OpenAI / Anthropic / Google |
| 크롤링 | Cheerio / Readability.js | 서버사이드 본문 추출 |
| 유튜브 | youtube-transcript + YouTube oEmbed API | 자막 추출 및 제목/썸네일 수집 |
| 이메일 | Resend | 주간 뉴스레터 발송 (무료 3,000건/월) |
| PWA | serwist | Share Target으로 모바일 공유 시트 연동 |
| 스케줄링 | Vercel Cron Jobs | 주간 뉴스레터 발송 트리거 |
| 알림 | Slack Webhook + Telegram Bot API | 즉시 요약 알림 + 주간 다이제스트 알림 |
| 배포 | Vercel | push = 자동 배포 |

---

## 2. 사용자 정의

### 2.1 주요 사용자 페르소나

| 항목 | 내용 |
|---|---|
| 역할 | 학습 의욕이 높은 지식 근로자 / 개발자 |
| 행동 패턴 | 매일 5~10개 이상의 기술 블로그, 뉴스, 유튜브 링크를 접함 |
| 핵심 니즈 | 저장한 콘텐츠를 빠르게 파악하고, 잊지 않고 복습하고 싶음 |
| 제약 | 바쁜 일정으로 전체 글을 읽을 시간이 부족 |
| 기기 | 주로 스마트폰에서 콘텐츠를 발견하고 저장 |

### 2.2 핵심 사용 시나리오

1. **회원가입 & 설정**: Google OAuth 로그인 → 이메일 발송 설정, LLM API 키 입력, 알림 채널 설정 → 서비스 작동 시작
2. **링크 저장**: 스마트폰 브라우저/앱에서 공유 버튼 → "LinkDigest" 선택 → 링크 즉시 저장
3. **자동 요약**: 저장 즉시 백그라운드에서 크롤링 + AI 요약 → 제목, 한 줄 요약, 핵심 포인트 3가지, 예상 읽기 시간 생성
4. **대시보드 관리**: 저장된 링크 목록 확인, 읽음/안읽음 토글, 삭제
5. **주간 뉴스레터**: 매주 설정된 요일/시간에 지난 7일간 링크 요약본이 이메일로 발송

---

## 3. 핵심 기능 (MVP 범위)

### Must Have 기능 목록 및 우선순위

| 우선순위 | 기능 | 의존성 |
|:---:|---|---|
| 1 | 3.6 Google OAuth 인증 | — |
| 2 | 3.1 PWA Share Target 링크 저장 | 인증 |
| 3 | 3.2 AI 자동 요약 | 링크 저장 |
| 4 | 3.3 링크 대시보드 | 인증, 링크 저장 |
| 5 | 3.4 주간 뉴스레터 이메일 발송 | AI 요약 |
| 6 | 3.5 알림 연동 (Slack / Telegram) | AI 요약 |

---

### 3.1 PWA Share Target을 통한 링크 저장

**설명**: 사용자가 모바일 공유 시트에서 LinkDigest를 선택하면 링크가 자동 저장된다.

**동작 흐름**:
1. 사용자가 홈 화면에 PWA 추가 (설치 온보딩 배너 제공)
2. 브라우저/앱에서 공유 버튼 → iOS/Android 공유 시트에 "LinkDigest" 항목 노출
3. 선택 시 `/share` 페이지로 URL 전달 → API 호출로 링크 저장
4. "저장 중 → 요약 완료" 상태 전환 토스트 표시

**입력**: 공유된 URL (+ 선택적으로 title, text)

**출력**: links 테이블에 새 레코드 생성 (status: `pending`)

**에러 처리**:
- 중복 URL: 기존 링크가 있으면 토스트로 안내, 중복 저장 방지
- 유효하지 않은 URL: 형식 검증 실패 시 에러 토스트

---

### 3.2 AI 자동 요약

**설명**: 링크 저장 즉시 백그라운드에서 본문을 추출하고 LLM API로 요약을 생성한다.

**링크 유형 자동 감지**:
- `youtube.com` / `youtu.be` 도메인 → 유튜브 처리 파이프라인
- 그 외 → 일반 링크 처리 파이프라인

**일반 링크 처리**:
1. Cheerio / Readability.js로 본문 추출
2. LLM API로 요약 생성: 제목, 한 줄 요약, 핵심 포인트 3가지, 예상 읽기 시간

**유튜브 링크 처리**:
1. youtube-transcript로 자막 추출
2. 자막이 있으면 → LLM API로 요약 생성
3. 자막이 없으면 → YouTube oEmbed API로 제목 + 썸네일 수집, "자막 없음" 표시

**크롤링 실패 처리** (timeout 10초, HTTP 4xx/5xx, 빈 콘텐츠, JS-only 사이트):
- Fallback 1: URL의 meta 태그 (og:title, og:description)에서 최소 정보 추출
- Fallback 2: "본문을 가져올 수 없습니다" 상태로 저장, 사용자에게 수동 확인 유도

**요약 실패 처리**: LLM API 에러 시 1회 재시도 → 실패 시 `summary_pending` 상태로 저장

**출력 필드**:

| 필드 | 설명 |
|---|---|
| `title` | 콘텐츠 제목 |
| `one_line_summary` | 한 줄 요약 (50자 이내) |
| `key_points` | 핵심 포인트 3가지 (JSON 배열) |
| `estimated_read_time` | 예상 읽기 시간 (분) |
| `content_type` | `article` / `youtube` |
| `thumbnail_url` | 썸네일 이미지 URL (유튜브 또는 og:image) |

---

### 3.3 링크 대시보드

**설명**: 저장된 링크 목록을 확인하고 읽음 상태를 관리하는 메인 페이지.

**기능 목록**:
- 링크 카드 목록 (제목, 한 줄 요약, 저장일, 읽음 상태 배지)
- 읽음/안읽음 토글 (카드 탭 시 낙관적 업데이트)
- 링크 삭제 (스와이프 또는 삭제 버튼)
- 필터: 전체 / 안 읽음 / 읽음
- 정렬: 최신순 (기본값)
- 무한 스크롤 (페이지네이션)

**상태 표시**:
- `pending`: 요약 진행 중 (Skeleton UI)
- `completed`: 요약 완료 (정상 카드)
- `summary_pending`: 요약 실패, 재시도 대기
- `crawl_failed`: 크롤링 실패, 수동 확인 필요

---

### 3.4 주간 뉴스레터 이메일 발송

**설명**: 매주 설정된 시간에 지난 7일간 저장된 링크의 요약본을 이메일로 발송한다.

**스케줄링**:
- Vercel Cron Jobs로 트리거 (`vercel.json` crons 설정)
- API Route: `POST /api/cron/newsletter`
- CRON_SECRET 환경변수로 엔드포인트 검증
- 기본값: 매주 월요일 오전 8시 KST (사용자 설정 가능)

**이메일 내용**:
- 지난 7일간 저장된 링크 요약본
- 읽은 것 / 안 읽은 것 구분 표시
- 각 링크별: 제목, 한 줄 요약, 핵심 포인트 3가지
- 원본 링크 바로가기 버튼

**발송 조건**:
- 해당 기간에 저장된 링크가 0개이면 발송하지 않음
- Resend API로 이메일 발송 (무료 3,000건/월)

---

### 3.5 알림 연동 (Slack / Telegram)

**설명**: 링크 요약 결과를 Slack/Telegram으로 즉시 알림하고, 주간 다이제스트도 메시지로 발송한다.

**즉시 알림** (링크 저장 시):
- 요약 완료 즉시 설정된 채널로 메시지 전송
- 메시지 내용: 제목, 한 줄 요약, 원본 링크

**주간 다이제스트 알림** (뉴스레터와 동시):
- 이메일 뉴스레터와 동일한 내용을 메시지로도 발송

**설정**:
- Settings 페이지에서 채널별 ON/OFF 토글
- Slack: Webhook URL 입력
- Telegram: Bot Token + Chat ID 입력

---

### 3.6 Google OAuth 인증

**설명**: Supabase Auth를 통한 Google 소셜 로그인.

**동작 흐름**:
1. 랜딩 페이지에서 "Google로 시작하기" 버튼 클릭
2. Google OAuth 플로우 → Supabase Auth가 세션 관리
3. 최초 로그인 시 `users` 테이블에 프로필 자동 생성
4. 인증 완료 후 `/dashboard`로 리다이렉트

**보안**:
- Supabase Auth가 JWT 토큰 및 세션 관리
- 모든 API Route에서 인증 미들웨어로 세션 검증
- RLS 정책으로 데이터 접근 제어

---

## 4. 시스템 아키텍처

### 4.1 전체 데이터 흐름

```
[모바일 공유 시트]
       │
       ▼
[PWA Share Target] ──→ [/share 페이지]
       │
       ▼
[POST /api/links] ──→ [Supabase: links 테이블에 저장 (status: pending)]
       │
       ▼
[백그라운드 요약 처리]
  ├─ 일반 링크: Cheerio/Readability.js → 본문 추출
  ├─ 유튜브: youtube-transcript → 자막 추출
  └─ Fallback: meta 태그 추출
       │
       ▼
[LLM API 요약 생성] ──→ [Supabase: links 테이블 업데이트 (status: completed)]
       │
       ├──→ [알림 발송: Slack / Telegram] (즉시)
       │
       ▼
[대시보드 표시] ←── TanStack Query (캐시 무효화)
       │
       ▼
[Vercel Cron: 매주] ──→ [POST /api/cron/newsletter]
       │
       ├──→ [Resend: 이메일 발송]
       └──→ [알림 발송: Slack / Telegram] (주간 다이제스트)
```

### 4.2 API Routes 구성

Next.js App Router의 Route Handlers로 구성. 모든 API는 `/api/` 하위에 위치한다.

| 그룹 | 역할 |
|---|---|
| `/api/links/*` | 링크 CRUD + 요약 트리거 |
| `/api/settings/*` | 사용자 설정 조회/수정 |
| `/api/cron/*` | 스케줄 작업 (뉴스레터 발송) |
| `/api/auth/*` | Supabase Auth 콜백 처리 |

### 4.3 PWA Share Target 처리 흐름

```
[공유 시트에서 LinkDigest 선택]
       │
       ▼
[GET /share?url=...&title=...&text=...]
       │
       ▼
[/share 페이지: URL 파싱 및 검증]
       │
       ├─ 인증됨 → POST /api/links → 저장 완료 토스트 → /dashboard로 이동
       └─ 미인증 → 로그인 페이지로 리다이렉트 (URL을 세션에 임시 저장)
```

### 4.4 뉴스레터 스케줄링 구조

- `vercel.json`에 cron 표현식으로 스케줄 등록
- 매 시간 실행하여 해당 시간에 발송 예정인 사용자를 조회
- `POST /api/cron/newsletter` 엔드포인트에서 `CRON_SECRET` 헤더 검증
- 사용자별 설정된 발송 요일/시간에 맞춰 이메일 발송

---

## 5. 데이터 모델

### 5.1 users 테이블

Supabase Auth의 `auth.users`를 확장하는 public 테이블.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,

  -- LLM 설정
  llm_settings JSONB NOT NULL DEFAULT '{
    "provider": null,
    "api_key": null
  }'::jsonb,

  -- 뉴스레터 설정
  newsletter_settings JSONB NOT NULL DEFAULT '{
    "enabled": true,
    "email": null,
    "day_of_week": 1,
    "hour": 8,
    "timezone": "Asia/Seoul"
  }'::jsonb,

  -- 알림 설정
  notification_settings JSONB NOT NULL DEFAULT '{
    "slack": { "enabled": false, "webhook_url": null },
    "telegram": { "enabled": false, "bot_token": null, "chat_id": null }
  }'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_users_email ON public.users(email);
```

### 5.2 links 테이블

```sql
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,

  -- 메타데이터
  title TEXT,
  thumbnail_url TEXT,
  content_type TEXT NOT NULL DEFAULT 'article'
    CHECK (content_type IN ('article', 'youtube')),

  -- AI 요약 결과
  one_line_summary TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  estimated_read_time INTEGER,

  -- 상태 관리
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'summary_pending', 'crawl_failed')),
  is_read BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_user_created ON public.links(user_id, created_at DESC);
CREATE INDEX idx_links_user_status ON public.links(user_id, status);
CREATE UNIQUE INDEX idx_links_user_url ON public.links(user_id, url);
```

### 5.3 RLS 정책

```sql
-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- users: 본인 데이터만 접근
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- links: 소유자만 CRUD
CREATE POLICY "links_select_own" ON public.links
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "links_insert_own" ON public.links
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "links_update_own" ON public.links
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "links_delete_own" ON public.links
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. API 설계

### 6.1 엔드포인트 목록

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| POST | `/api/links` | 링크 저장 + 요약 트리거 | 필수 |
| GET | `/api/links` | 링크 목록 조회 (페이지네이션, 필터) | 필수 |
| PATCH | `/api/links/[id]` | 링크 수정 (읽음 토글 등) | 필수 |
| DELETE | `/api/links/[id]` | 링크 삭제 | 필수 |
| GET | `/api/settings` | 사용자 설정 조회 | 필수 |
| PUT | `/api/settings` | 사용자 설정 수정 | 필수 |
| POST | `/api/cron/newsletter` | 주간 뉴스레터 발송 | CRON_SECRET |
| GET | `/api/auth/callback` | Supabase OAuth 콜백 | — |

### 6.2 인증 미들웨어

- Supabase 서버 클라이언트로 세션 검증
- `createServerClient`를 사용하여 쿠키 기반 세션 관리
- 인증 실패 시 401 응답

### 6.3 에러 처리 패턴

모든 API는 일관된 에러 응답 구조를 사용한다:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효하지 않은 URL 형식입니다."
  }
}
```

에러 코드: `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `RATE_LIMITED`, `INTERNAL_ERROR`

### 6.4 Rate Limiting

| 항목 | 한도 | 비고 |
|---|---|---|
| 링크 저장 | 50개/일 | 사용자당 |
| AI 요약 요청 | 50회/일 | 링크 저장과 1:1 대응 |

### 6.5 AI API 비용 관리

- 요약당 예상 토큰: 입력 ~2,000 토큰, 출력 ~300 토큰
- 사용자가 본인의 API 키를 사용하므로 서비스 측 비용 없음
- Settings 페이지에서 provider별 API 키 입력 및 관리

---

## 7. 프론트엔드 설계

### 7.1 디자인 시스템

- **스택**: TailwindCSS v4 + shadcn/ui (New York 스타일)
- **컬러**: 라이트/다크 모드 CSS 변수 (shadcn 기본 테마)
- **타이포그래피**: shadcn 기본 폰트 스케일
- **공통 컴포넌트**: Button, Card, Badge, Toast, Skeleton, Input, Select, Switch, Dialog

### 7.2 App Router 페이지 구조

| 경로 | 페이지 | 설명 |
|---|---|---|
| `/` | 랜딩 / 로그인 | Google OAuth 로그인 버튼, 서비스 소개 |
| `/dashboard` | 링크 목록 대시보드 | 메인 페이지, 링크 카드 목록 |
| `/share` | Share Target 수신 | PWA 공유 시 URL 파라미터 수신 → 저장 처리 |
| `/settings` | 설정 | 뉴스레터, LLM API 키, 알림 채널 설정 |

### 7.3 페이지별 컴포넌트 구조

**공통 레이아웃**:
- Header: 로고 + 사용자 아바타 드롭다운
- BottomNav: 모바일 하단 고정 네비게이션 (Dashboard, Settings)

**`/dashboard` 페이지**:
- FilterTabs: 전체 / 안 읽음 / 읽음 필터
- LinkCardList: 링크 카드 무한 스크롤 목록
- LinkCard: 제목, 한 줄 요약, 저장일, 읽음 배지, 삭제 버튼
- EmptyState: 저장된 링크가 없을 때 안내 UI

**`/settings` 페이지**:
- LLMSettingsForm: provider 선택 + API 키 입력
- NewsletterSettingsForm: 발송 요일/시간/이메일 설정
- NotificationSettingsForm: Slack/Telegram 설정
- NewsletterPreview: 샘플 이메일 미리보기

**`/share` 페이지**:
- 최소한의 UI — URL 수신 → API 호출 → 결과 토스트 → 리다이렉트

### 7.4 모바일 퍼스트 레이아웃

- **기준 뷰포트**: 390px (iPhone 14 기준)
- **하단 고정 네비게이션 바**: 모바일에서 항상 표시
- **카드형 링크 목록**: 세로 스크롤, 스와이프 삭제 고려
- **터치 타겟**: 최소 44px 준수
- **데스크탑 대응**: 최대 너비 제한 (640px), 중앙 정렬

### 7.5 핵심 UI 플로우

- **PWA 설치 온보딩**: 최초 방문 시 앱 추가 유도 배너 → 공유 시트 사용법 안내 이미지
- **링크 저장 피드백**: 공유 직후 "저장 중..." → "요약 완료!" 상태 전환 토스트
- **읽음 처리**: 카드 탭 시 읽음 표시 토글 (낙관적 업데이트로 즉각 반영)
- **뉴스레터 미리보기**: Settings에서 샘플 이메일 미리보기 가능

### 7.6 상태 관리

| 구분 | 기술 | 용도 |
|---|---|---|
| 서버 상태 | TanStack Query | 링크 목록 fetching, 캐싱, 낙관적 업데이트 |
| 클라이언트 상태 | React useState / useOptimistic | 읽음 토글, UI 상태 |
| 폼 상태 | react-hook-form + zod | Settings 페이지 폼 검증 |

전역 상태 라이브러리(Zustand, Redux 등)는 사용하지 않는다.

---

## 8. PWA 설정 상세

### 8.1 manifest.json share_target 설정

```json
{
  "name": "LinkDigest",
  "short_name": "LinkDigest",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "GET",
    "params": {
      "url": "url",
      "title": "title",
      "text": "text"
    }
  }
}
```

### 8.2 iOS / Android 대응 차이점

| 항목 | Android | iOS |
|---|---|---|
| PWA 설치 | Chrome 설치 프롬프트 지원 | Safari "홈 화면에 추가" 수동 |
| Share Target | 완전 지원 | Safari 16.4+ 부분 지원 |
| 푸시 알림 | 지원 | 제한적 지원 |

- iOS의 Share Target 제한을 고려하여, 대안으로 북마클릿(bookmarklet) 또는 단축어(Shortcuts) 안내 제공

### 8.3 오프라인 대응 범위

- 오프라인 시 캐시된 대시보드 화면만 표시 (읽기 전용)
- 오프라인에서의 링크 저장은 MVP 범위에서 제외

### 8.4 Service Worker (serwist 기반)

- serwist로 Service Worker 생성 및 관리
- 정적 에셋 프리캐싱 (App Shell)
- API 응답은 네트워크 우선(Network First) 전략

---

## 9. MVP 제외 사항

### 향후 버전에서 고려할 기능

- 카카오톡 오픈빌더 봇 알림 연동 (채널 개설 심사 필요)
- HubSpot / Notion 연동
- AI 기반 자동 태깅 및 링크 간 연관 추천
- 팟캐스트 음성 요약
- 소셜 공유 기능 (요약 결과를 SNS에 공유)
- 브라우저 확장 프로그램 (Chrome Extension)

### 의도적으로 제외한 기능과 이유

| 기능 | 제외 이유 |
|---|---|
| 태그/폴더 분류 | MVP에서는 시간순 목록으로 충분, 복잡도 증가 |
| 다국어 요약 | 사용자의 LLM API 프롬프트로 개인 해결 가능 |
| 팀 공유 기능 | 개인 생산성 도구에 집중 |
| 오프라인 저장 | Service Worker 큐잉 복잡도 대비 사용 빈도 낮음 |
| 커스텀 요약 프롬프트 | MVP 후 사용자 피드백에 따라 추가 검토 |

---

## 10. 성공 지표

### MVP 완료 기준

- [ ] 모바일 공유 시트에서 링크 저장 가능 (PWA Share Target)
- [ ] 저장된 링크에 대해 AI 요약이 30초 이내 완료
- [ ] 대시보드에서 링크 목록 조회, 읽음 토글, 삭제 가능
- [ ] 주간 뉴스레터가 설정된 시간에 자동 발송
- [ ] Slack/Telegram 알림이 정상 작동
- [ ] Google OAuth 로그인/로그아웃 정상 작동

### 측정 가능한 목표

| 지표 | 목표 |
|---|---|
| AI 요약 처리 시간 | 링크 저장 후 30초 이내 요약 완료 |
| 크롤링 성공률 | 일반 링크 90% 이상 본문 추출 성공 |
| 뉴스레터 발송 성공률 | 99% 이상 |
| 페이지 로딩 속도 | FCP 1.5초 이내 (모바일) |
| PWA Lighthouse 점수 | 90점 이상 |
