# Phase 9: 통합 테스트 & 배포 — 상세 작업 계획

## 목표
전체 기능(Phase 0~8)이 Vercel 프로덕션 환경에서 정상 동작하며, Rate Limiting / 성능 / 보안 기준을 충족하는 상태로 배포 완료.

## 사전 검토 요약 (2026-04-20)
원본 계획 대비 코드베이스 실제 상태 점검 결과 아래 항목이 교정되었다:
- Slack/Telegram 설정은 사용자별 DB 저장 구조이므로 `.env.example` 추가 대상 **아님**
- Rate Limiting(50/일)은 미구현 상태 → **Step 3에서 신규 구현**으로 승격
- Next.js 16에서 `middleware.ts`가 `proxy.ts`로 리네이밍됨. `src/proxy.ts`가 `/dashboard`, `/settings`, `/share`를 보호하고 세션을 갱신 중. API 레벨 가드는 `src/lib/api/auth.ts`의 `requireAuth()`에서 처리
- Cron 스케줄은 **주간 실행**으로 전환 (정확히는 매일 1회 + 요일/타임존 매칭, Step 4 참고)
- 사용자 LLM API 키 평문 저장은 RLS 보호 상태에서 **알려진 이슈로 유지**, 배포 후 개선 백로그

---

## Step 1: 빌드 검증 & 코드 정리

**목적:** 프로덕션 빌드가 에러 없이 통과하는지 확인

- [ ] `npm run build` 실행 → 빌드 에러/경고 전부 수정
- [ ] `npm run lint` 실행 → ESLint 에러 전부 수정
- [ ] TypeScript strict 모드 위반 사항 확인 및 수정
- [ ] 미사용 import, 미사용 변수 정리
- [ ] `console.log` 등 디버깅 코드 제거

**완료 기준:** `npm run build && npm run lint` 모두 0 에러

---

## Step 2: 환경변수 정리 & `.env.example` 검증

**목적:** 프로덕션 배포에 필요한 모든 환경변수가 문서화되어 있는지 확인

- [ ] 코드베이스에서 `process.env` 사용처 전수 조사 → `.env.example`과 1:1 매칭 확인
- [ ] **Slack/Telegram 관련 항목을 `.env.example`에 추가하지 않을 것** — 해당 설정은 사용자별로 `users.notification_settings` JSONB에 저장되며 환경변수가 아님 (`src/lib/notifications/index.ts:20-25` 참고)
- [ ] `NEXT_PUBLIC_*` 클라이언트 노출 변수와 서버 전용 변수 구분 확인
- [ ] `ADMIN_EMAIL`, `*_MODEL` 오버라이드 변수 용도 주석 보완

**완료 기준:** `.env.example`만 보고 모든 환경변수를 설정할 수 있는 상태

---

## Step 3: Rate Limiting 구현 (신규)

**목적:** PRD 성공지표인 "링크 저장 50개/일" 제한을 배포 전 구현. 현재 `RATE_LIMITED` 타입만 정의되어 있고 실제 검증 로직은 부재.

### 3-1. Rate Limit 모듈
- [ ] `src/lib/api/rate-limit.ts` 신규 작성
  - 상수 `DAILY_LINK_LIMIT = 50`
  - 함수 `checkDailyLinkLimit(userId, userTimezone)` — 해당 사용자의 오늘(사용자 타임존 기준) `links` INSERT 카운트 조회
  - 반환: `{ allowed: boolean, count: number, limit: number }`

### 3-2. POST 핸들러 통합
- [ ] `src/app/api/links/route.ts` POST 핸들러
  - `requireAuth()` 직후 `checkDailyLinkLimit()` 호출
  - 초과 시 `429` + `{ code: "RATE_LIMITED", message, count, limit }` 응답

### 3-3. 클라이언트 에러 처리
- [ ] `src/app/(auth)/share/page.tsx` — 429 응답 수신 시 토스트로 "오늘 저장 한도(50개)를 초과했습니다" 안내
- [ ] `src/components/dashboard/` — 대시보드 수동 저장 흐름이 있다면 동일 처리

**완료 기준:** cURL로 51회 연속 POST → 51번째 요청이 429 반환

---

## Step 4: Cron 스케줄 주간 전환

**목적:** 매시간(`0 * * * *`) 실행을 주간 실행으로 전환해 함수 호출 비용 절감.

**배경:** 사용자 발송 설정은 `day_of_week` + `hour` + `timezone` 조합. 순수 `0 0 * * 1` 같은 주 1회 실행은 UTC+9 이상 타임존에서 발송 요일이 밀리므로, **매일 1회 실행 + 기존 isMatchingTime() 매칭 유지**가 안전한 절충안.

- [ ] `vercel.json` — 스케줄을 `"0 0 * * *"` (매일 UTC 자정) 또는 사전 합의된 주간 값으로 변경
- [ ] `src/app/api/cron/newsletter/route.ts` — `isMatchingTime()`이 매일 1회 호출 가정에서도 올바르게 매칭하는지 재검증 (시간 필드 허용 오차 등)
- [ ] 매시간 실행 가정으로 작성된 주석/로그 문구 정리

**완료 기준:** 로컬에서 `curl -H "Authorization: Bearer ${CRON_SECRET}" http://localhost:3000/api/cron/newsletter` 실행 → 오늘 요일/시각과 일치하는 사용자만 `sent`에 포함되는 로그 확인

---

## Step 5: Vercel 배포 설정

**목적:** Vercel 프로젝트를 생성하고 프로덕션 배포 인프라 구성

### 5-1. Vercel 프로젝트 연결
- [ ] Vercel 대시보드에서 프로젝트 생성 (GitHub repo 연동)
- [ ] Framework Preset: Next.js 자동 감지 확인
- [ ] Root Directory 설정 확인 (프로젝트 루트)
- [ ] Node.js 버전 24 LTS 확인 (현재 Vercel 기본값)

### 5-2. 환경변수 설정 (.env.example 기준)
- [ ] Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] LLM 키 + 모델 오버라이드: `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`, `OPENAI_API_KEY`/`OPENAI_MODEL`, `GOOGLE_AI_API_KEY`/`GOOGLE_MODEL`
- [ ] Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] Cron: `CRON_SECRET`
- [ ] App URL: `NEXT_PUBLIC_APP_URL` → 프로덕션 도메인
- [ ] Admin: `ADMIN_EMAIL`
- [ ] LLM 키가 서버 전용(접두사 없음)인지 확인
- [ ] Preview vs Production 환경 분리 필요 여부 판단

### 5-3. 도메인 & OAuth 설정
- [ ] 프로덕션 도메인 설정 (커스텀 도메인 또는 `.vercel.app`)
- [ ] Supabase > Authentication > URL Configuration > Redirect URLs에 `{PROD_DOMAIN}/api/auth/callback` 추가
- [ ] `NEXT_PUBLIC_APP_URL`을 프로덕션 도메인으로 업데이트

### 5-4. Cron Jobs 설정
- [ ] `vercel.json`의 cron 스케줄 최종 값 확인 (Step 4 결과 반영)
- [ ] `CRON_SECRET` Bearer 인증이 `/api/cron/newsletter`에 적용되어 있는지 재확인

**완료 기준:** Preview 배포 성공 + 접속 가능

---

## Step 6: E2E 수동 테스트 (Preview 환경)

**목적:** Preview 배포 환경에서 전체 사용자 시나리오 검증

### 6-1. 인증 플로우
- [ ] **시나리오 1:** 신규 사용자 Google 로그인 → `users` 테이블에 row 생성 확인
- [ ] **시나리오 1-1:** 로그아웃 → 랜딩 페이지 리다이렉트 확인
- [ ] **시나리오 1-2:** 재로그인 → 기존 데이터 유지 확인

### 6-2. 설정
- [ ] **시나리오 2:** Settings에서 LLM provider 선택 + API 키 입력 → 저장 → 새로고침 후 유지 확인
- [ ] **시나리오 2-1:** 뉴스레터 설정(수신 이메일, 발송 요일/시각, 타임존) 저장 확인
- [ ] **시나리오 2-2:** 알림 설정(Slack webhook / Telegram bot token + chat ID) 저장 확인

### 6-3. 링크 저장 & 요약
- [ ] **시나리오 3:** 일반 URL 공유 → 링크 저장 → 크롤링 + AI 요약 완료 (30초 이내)
- [ ] **시나리오 3-1:** YouTube URL → 트랜스크립트 기반 요약 확인
- [ ] **시나리오 3-2:** 크롤링 실패 케이스(차단 사이트) → 에러 핸들링 확인
- [ ] **시나리오 3-3 (신규):** 링크 50개 연속 저장 → 51번째 429 응답 확인 (Rate Limiting 검증)

### 6-4. 대시보드
- [ ] **시나리오 4:** 대시보드에서 링크 목록 렌더링 확인
- [ ] **시나리오 4-1:** 읽음/안읽음 토글 동작 확인 (낙관적 업데이트)
- [ ] **시나리오 4-2:** 링크 삭제 → 목록에서 제거 확인
- [ ] **시나리오 4-3:** 무한 스크롤 동작 확인 (10개 이상 링크 필요)
- [ ] **시나리오 4-4:** 필터(전체/읽음/안읽음) 동작 확인

### 6-5. 뉴스레터
- [ ] **시나리오 5:** `/api/cron/newsletter` 수동 호출 → 발송 대상 필터링 로그 확인 + 이메일 수신 확인
- [ ] **시나리오 5-1:** 뉴스레터 미리보기(`/api/newsletter/preview`) 정상 렌더링 확인
- [ ] **시나리오 5-2 (신규):** 주간 스케줄 전환 후 매칭 로직이 올바르게 타임존 기반 요일을 판별하는지 확인

### 6-6. 알림
- [ ] **시나리오 6:** 링크 저장 → 요약 완료 → Slack 채널에 즉시 알림 수신 확인
- [ ] **시나리오 6-1:** 링크 저장 → 요약 완료 → Telegram 채팅에 즉시 알림 수신 확인
- [ ] **시나리오 6-2:** 뉴스레터 수동 트리거 → Slack/Telegram 주간 다이제스트 수신 확인

### 6-7. PWA
- [ ] **시나리오 7:** 모바일 Chrome에서 PWA 설치
- [ ] **시나리오 7-1:** 모바일 공유 시트에서 LinkDigest 선택 → 링크 저장
- [ ] **시나리오 7-2:** 오프라인 상태에서 대시보드 캐시 표시 확인

**완료 기준:** 모든 시나리오 통과. 실패 시 해당 Phase 코드 수정 후 재배포 → 재테스트.

---

## Step 7: 성능 점검

**목적:** MVP 성능 기준 충족 확인

- [ ] Chrome DevTools > Performance > 모바일 시뮬레이션으로 FCP 측정 (목표: 1.5초 이내)
- [ ] Chrome Lighthouse 실행 → PWA 점수 90+ 확인
- [ ] Lighthouse Performance 점수 확인 (LCP, CLS, TBT)
- [ ] 이미지 최적화 확인 (next/image 사용 여부)
- [ ] JavaScript 번들 사이즈 확인 (`next build` 출력의 route별 사이즈)
- [ ] 서버 전용 코드가 클라이언트 번들에 포함되지 않는지 점검
- [ ] (선택) Vercel Speed Insights / Analytics 연동 여부 판단

**완료 기준:** FCP ≤ 1.5s (모바일), Lighthouse PWA ≥ 90

---

## Step 8: 보안 점검

**목적:** 데이터 접근 제어 및 API 보안 확인

### 8-1. RLS 정책 검증
- [ ] Supabase 대시보드/MCP에서 `links`, `users` 테이블 RLS 정책 확인
- [ ] 다른 사용자의 링크 데이터 접근 불가 테스트 (Supabase SQL Editor에서 직접 쿼리)
- [ ] `users` 테이블은 본인 데이터만 조회/수정 가능한지 확인

### 8-2. API 보안
- [ ] Step 3에서 구현한 Rate Limiting이 Preview/Production에서 동작하는지 실측
- [ ] Cron 엔드포인트에 `CRON_SECRET` Bearer 인증 확인 (토큰 없는 호출 시 401)
- [ ] LLM API 키가 클라이언트 번들에 노출되지 않는지 확인 (`.next/static` 폴더에서 키 prefix grep)
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트에 노출되지 않는지 확인
- [ ] **알려진 이슈(배포 후 개선 백로그):** 사용자 LLM API 키는 `users.llm_settings` JSONB에 평문 저장. RLS로 타 사용자 접근은 차단되지만 Service Role 키 유출 시 전체 노출 리스크 존재. README에 기재.

### 8-3. 인증 가드 검증
- [ ] 미인증 사용자가 `/dashboard`, `/settings`, `/share` 접근 시 `src/proxy.ts`(Next.js 16 미들웨어)가 `/`로 리다이렉트하는지 확인
- [ ] 인증된 사용자가 `/` 접근 시 `src/proxy.ts`가 `/dashboard`로 리다이렉트하는지 확인
- [ ] API Routes가 `src/lib/api/auth.ts`의 `requireAuth()`를 통해 보호되며 미인증 요청에 401 응답하는지 확인
- [ ] `src/proxy.ts` matcher가 `_next/static`, `api/`, `sw.js` 등을 올바르게 제외하는지 확인 (정적 자원/API는 자체 가드 사용)

**완료 기준:** 모든 보안 항목 통과

---

## Step 9: 프로덕션 배포

**목적:** 최종 프로덕션 배포 및 프로덕션 환경 검증

- [ ] Preview 환경 테스트 모두 통과 확인
- [ ] Vercel에서 Production 배포 실행
- [ ] 프로덕션 URL에서 Step 6의 핵심 시나리오(1, 3, 4, 5) 재검증
- [ ] Cron Job이 Vercel 대시보드에서 정상 등록되었는지 확인
- [ ] 에러 모니터링 확인 (Vercel Functions 로그 24시간 관측 → 에러율 < 1%)

**완료 기준:** 프로덕션 URL에서 핵심 기능 정상 동작

---

## Step 10: 문서 정리

**목적:** 프로젝트 문서를 최신 상태로 업데이트

- [ ] `README.md` 업데이트
  - 프로젝트 소개 및 주요 기능
  - 로컬 개발 환경 설정 가이드 (환경변수, Supabase 설정)
  - 배포 가이드
  - Rate Limiting 정책(50/일) 명시
  - **알려진 제약 명시:** 사용자 LLM API 키 평문 저장 (RLS 보호)
- [ ] `CLAUDE.md` 업데이트
  - 최종 디렉토리 구조 반영 (`src/lib/api/rate-limit.ts` 추가 등)
  - 추가된 명령어/스크립트 반영
  - Next.js 16의 `src/proxy.ts`(구 middleware.ts) + API 레벨 `requireAuth()` 이중 가드 구조 명시
- [ ] `.env.example` 최종 확인 (Step 2에서 이미 완료, 최종 검토)
- [ ] `docs/3.task-plan.md`에서 Phase 9 체크박스 완료 처리

**완료 기준:** 새로운 개발자가 README만 보고 로컬 환경을 구성하고 배포할 수 있는 상태

---

## 작업 순서 요약

```
Step 1 (빌드 검증)
  └── Step 2 (환경변수 정리)
        └── Step 3 (Rate Limiting 구현)
              └── Step 4 (Cron 스케줄 주간 전환)
                    └── Step 5 (Vercel 배포 설정)
                          └── Step 6 (E2E 수동 테스트 — Preview)
                                ├── Step 7 (성능 점검)    ← 병렬 가능
                                └── Step 8 (보안 점검)    ← 병렬 가능
                                      └── Step 9 (프로덕션 배포)
                                            └── Step 10 (문서 정리)
```

## 참고사항

- Step 6에서 발견된 버그는 즉시 수정 후 재배포 → 재테스트 사이클
- Step 7, 8은 서로 독립적이므로 병렬 진행 가능
- Vercel 대시보드 작업(프로젝트 생성, 환경변수 설정, 도메인 연결)은 수동 진행
- Supabase 대시보드 작업(OAuth redirect URL 업데이트)도 수동 진행
- 사용자 LLM API 키 암호화는 본 Phase 범위 밖. 배포 후 백로그로 관리.
