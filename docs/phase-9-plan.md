# Phase 9: 통합 테스트 & 배포 — 상세 작업 계획

## 목표
전체 기능(Phase 0~8)이 Vercel 프로덕션 환경에서 정상 동작하며, 성능/보안 기준을 충족하는 상태로 배포 완료

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

## Step 2: 환경변수 정리 & `.env.example` 업데이트

**목적:** 프로덕션 배포에 필요한 모든 환경변수가 문서화되어 있는지 확인

- [ ] 코드베이스에서 `process.env` 사용처 전수 조사
- [ ] `.env.example`에 누락된 환경변수 키 추가
- [ ] 각 환경변수에 용도 주석 보완 (특히 Phase 7~8에서 추가된 것)
- [ ] 클라이언트 노출 변수(`NEXT_PUBLIC_*`)와 서버 전용 변수 구분 확인
- [ ] Slack/Telegram 관련 환경변수가 `.env.example`에 반영되었는지 확인

**완료 기준:** `.env.example`만 보고 모든 환경변수를 설정할 수 있는 상태

---

## Step 3: Vercel 배포 설정

**목적:** Vercel 프로젝트를 생성하고 프로덕션 배포 인프라 구성

### 3-1. Vercel 프로젝트 연결
- [ ] Vercel 대시보드에서 프로젝트 생성 (GitHub repo 연동)
- [ ] Framework Preset: Next.js 자동 감지 확인
- [ ] Root Directory 설정 확인 (프로젝트 루트)
- [ ] Node.js 버전 확인 (24 LTS)

### 3-2. 환경변수 설정
- [ ] Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] Cron: `CRON_SECRET`
- [ ] App URL: `NEXT_PUBLIC_APP_URL` → 프로덕션 도메인으로 설정
- [ ] LLM 키: 서버사이드 전용 확인 (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY`)
- [ ] 환경별 분리 (Preview vs Production) 필요 여부 판단

### 3-3. Cron Jobs 설정
- [ ] `vercel.json`의 cron 스케줄 최종 확인 (현재: 매시간 → 주간으로 변경 필요 여부 검토)
- [ ] `CRON_SECRET` 인증이 cron route에 적용되어 있는지 확인

### 3-4. 도메인 & OAuth 설정
- [ ] 프로덕션 도메인 설정 (커스텀 도메인 또는 `.vercel.app`)
- [ ] Supabase > Authentication > URL Configuration > Redirect URLs에 프로덕션 도메인 추가
- [ ] `NEXT_PUBLIC_APP_URL`을 프로덕션 도메인으로 업데이트

**완료 기준:** Preview 배포가 성공적으로 완료되고 접속 가능

---

## Step 4: E2E 수동 테스트 (Preview 환경)

**목적:** Preview 배포 환경에서 전체 사용자 시나리오 검증

### 4-1. 인증 플로우
- [ ] **시나리오 1:** 신규 사용자 Google 로그인 → `users` 테이블에 row 생성 확인
- [ ] **시나리오 1-1:** 로그아웃 → 랜딩 페이지 리다이렉트 확인
- [ ] **시나리오 1-2:** 재로그인 → 기존 데이터 유지 확인

### 4-2. 설정
- [ ] **시나리오 2:** Settings에서 LLM provider 선택 + API 키 입력 → 저장 → 새로고침 후 유지 확인
- [ ] **시나리오 2-1:** 뉴스레터 설정 (수신 이메일, 발송 요일) 저장 확인
- [ ] **시나리오 2-2:** 알림 설정 (Slack webhook / Telegram bot token) 저장 확인

### 4-3. 링크 저장 & 요약
- [ ] **시나리오 3:** 일반 URL 공유 → 링크 저장 → 크롤링 + AI 요약 완료 (30초 이내)
- [ ] **시나리오 3-1:** YouTube URL → 트랜스크립트 기반 요약 확인
- [ ] **시나리오 3-2:** 크롤링 실패 케이스 (차단 사이트) → 에러 핸들링 확인

### 4-4. 대시보드
- [ ] **시나리오 4:** 대시보드에서 링크 목록 렌더링 확인
- [ ] **시나리오 4-1:** 읽음/안읽음 토글 동작 확인
- [ ] **시나리오 4-2:** 링크 삭제 → 목록에서 제거 확인
- [ ] **시나리오 4-3:** 무한 스크롤 동작 확인 (10개 이상 링크 필요)
- [ ] **시나리오 4-4:** 필터 (전체/읽음/안읽음) 동작 확인

### 4-5. 뉴스레터
- [ ] **시나리오 5:** `/api/cron/newsletter` 수동 호출 → 이메일 수신 확인
- [ ] **시나리오 5-1:** 뉴스레터 미리보기(`/api/newsletter/preview`) 정상 렌더링 확인

### 4-6. 알림
- [ ] **시나리오 6:** 링크 저장 후 Slack 알림 수신 확인
- [ ] **시나리오 6-1:** 링크 저장 후 Telegram 알림 수신 확인

### 4-7. PWA
- [ ] **시나리오 7:** 모바일 Chrome에서 PWA 설치
- [ ] **시나리오 7-1:** 모바일 공유 시트에서 LinkDigest 선택 → 링크 저장
- [ ] **시나리오 7-2:** 오프라인 상태에서 대시보드 캐시 표시 확인

**완료 기준:** 모든 시나리오 통과 (실패 시 해당 Phase 코드 수정 후 재배포 → 재테스트)

---

## Step 5: 성능 점검

**목적:** MVP 성능 기준 충족 확인

- [ ] Chrome DevTools > Performance > 모바일 시뮬레이션으로 FCP 측정 (목표: 1.5초 이내)
- [ ] Chrome Lighthouse 실행 → PWA 점수 90+ 확인
- [ ] Lighthouse Performance 점수 확인 (LCP, CLS, TBT)
- [ ] 이미지 최적화 확인 (next/image 사용 여부)
- [ ] JavaScript 번들 사이즈 확인 (`next build` 출력의 route별 사이즈)
- [ ] 불필요한 클라이언트 번들 포함 여부 점검 (서버 전용 코드가 클라이언트에 포함되지 않는지)

**완료 기준:** FCP ≤ 1.5s (모바일), Lighthouse PWA ≥ 90

---

## Step 6: 보안 점검

**목적:** 데이터 접근 제어 및 API 보안 확인

### 6-1. RLS 정책 검증
- [ ] Supabase 대시보드에서 `links` 테이블 RLS 정책 확인
- [ ] 다른 사용자의 링크 데이터 접근 불가 테스트 (Supabase SQL Editor에서 직접 쿼리)
- [ ] `users` 테이블 RLS 정책 확인 (자기 데이터만 조회/수정 가능)

### 6-2. API 보안
- [ ] API Rate Limiting 적용 확인 (링크 저장 50개/일 제한)
- [ ] Cron 엔드포인트에 `CRON_SECRET` 인증 확인 (외부 호출 차단)
- [ ] LLM API 키가 클라이언트 번들에 노출되지 않는지 확인
  - `next build` 후 `.next/static` 폴더에서 API 키 문자열 검색
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트에 노출되지 않는지 확인

### 6-3. 인증 보안
- [ ] 미인증 사용자가 `/dashboard`, `/settings` 접근 시 리다이렉트 확인
- [ ] API Routes에 인증 미들웨어 적용 확인 (인증 없이 호출 시 401 응답)

**완료 기준:** 모든 보안 항목 통과

---

## Step 7: 프로덕션 배포

**목적:** 최종 프로덕션 배포 및 프로덕션 환경 검증

- [ ] Preview 환경 테스트 모두 통과 확인
- [ ] Vercel에서 Production 배포 실행
- [ ] 프로덕션 URL로 Step 4의 핵심 시나리오 재검증 (시나리오 1, 3, 4, 5)
- [ ] Cron Job이 Vercel 대시보드에서 정상 등록되었는지 확인
- [ ] 에러 모니터링 확인 (Vercel Functions 로그)

**완료 기준:** 프로덕션 URL에서 핵심 기능 정상 동작

---

## Step 8: 문서 정리

**목적:** 프로젝트 문서를 최신 상태로 업데이트

- [ ] `README.md` 업데이트
  - 프로젝트 소개 및 주요 기능
  - 로컬 개발 환경 설정 가이드 (환경변수, Supabase 설정)
  - 배포 가이드
- [ ] `CLAUDE.md` 업데이트
  - 최종 디렉토리 구조 반영
  - 추가된 명령어/스크립트 반영
- [ ] `.env.example` 최종 확인 (Step 2에서 이미 완료, 최종 검토)
- [ ] `docs/3.task-plan.md`에서 Phase 9 체크박스 완료 처리

**완료 기준:** 새로운 개발자가 README만 보고 로컬 환경을 구성하고 배포할 수 있는 상태

---

## 작업 순서 요약

```
Step 1 (빌드 검증)
  │
  └── Step 2 (환경변수 정리)
        │
        └── Step 3 (Vercel 배포 설정)
              │
              └── Step 4 (E2E 수동 테스트)
                    │
                    ├── Step 5 (성능 점검)    ← 병렬 가능
                    └── Step 6 (보안 점검)    ← 병렬 가능
                          │
                          └── Step 7 (프로덕션 배포)
                                │
                                └── Step 8 (문서 정리)
```

## 참고사항

- Step 4에서 발견된 버그는 즉시 수정 후 재배포 → 재테스트 사이클
- Step 5, 6은 서로 독립적이므로 병렬 진행 가능
- Vercel 대시보드 작업(프로젝트 생성, 환경변수 설정, 도메인 연결)은 수동으로 진행
- Supabase 대시보드 작업(OAuth redirect URL 업데이트)도 수동으로 진행
