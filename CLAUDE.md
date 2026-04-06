# CLAUDE.md — LinkDigest 프로젝트 컨벤션

## 프로젝트 개요
LinkDigest: AI 링크 요약 & 주간 뉴스레터 서비스 (Next.js 16 풀스택)

## 기술 스택
- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4 + shadcn/ui (New York)
- Supabase (Auth + PostgreSQL + RLS)
- TanStack Query (서버 상태), react-hook-form + zod (폼)
- Resend (이메일), serwist (PWA), Vercel Cron Jobs

## 코딩 컨벤션

### 언어
- 코드: 영어 (변수명, 함수명, 타입명)
- 주석/문서: 한국어
- 커밋 메시지: 이모지 + 한국어 본문

### TypeScript
- strict 모드 필수
- `any` 타입 사용 금지, unknown + 타입 가드 사용
- 인터페이스보다 type alias 선호 (단, 확장 필요 시 interface)

### Next.js
- App Router 사용 (pages 디렉토리 사용 금지)
- 서버 컴포넌트 기본, 클라이언트 컴포넌트는 'use client' 명시
- API Routes: Route Handler 패턴 (GET/POST/PUT/DELETE export)
- 환경변수: 클라이언트용은 NEXT_PUBLIC_ 접두사 필수

### 스타일링
- TailwindCSS v4 유틸리티 클래스 사용
- shadcn/ui 컴포넌트 우선 활용 (커스텀 컴포넌트 최소화)
- 모바일 퍼스트 (기준 뷰포트: 390px)
- 다크모드 지원 (CSS 변수 기반)

### Supabase
- RLS 정책 필수 적용 (모든 테이블)
- 서버 컴포넌트: createServerClient 사용
- 클라이언트 컴포넌트: createBrowserClient 사용
- Service Role Key는 서버사이드 전용

## 디렉토리 구조
```
src/
  app/              # App Router 페이지
    (auth)/          # 인증 관련 라우트 그룹
    dashboard/       # 링크 대시보드
    share/           # PWA Share Target
    settings/        # 설정 페이지
    api/             # API Routes
  components/
    ui/              # shadcn/ui 컴포넌트
  lib/
    supabase/        # Supabase 클라이언트 설정
    utils.ts         # 공통 유틸리티 (cn 등)
  types/             # 타입 정의
public/
  manifest.json      # PWA manifest
docs/                # 프로젝트 문서
```

## 주요 명령어
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
```
