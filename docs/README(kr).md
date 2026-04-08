[English](../README.md) | 한국어

# LinkDigest

![Version](https://img.shields.io/badge/version-v0.1.0-blue)
![License](https://img.shields.io/badge/license-Apache%202.0-green)

**LinkDigest**는 저장한 링크를 AI가 즉시 요약하고, 매주 뉴스레터 다이제스트로 정리해주는 AI 링크 큐레이션 서비스입니다. 모바일에서 링크를 공유하면 — AI가 나머지를 정리합니다.

<p align="center">
  <img src="../img/hero.png" alt="LinkDigest Hero" width="700">
</p>

## 주요 기능

- **PWA Share Target** — 모바일 브라우저의 공유 메뉴에서 바로 링크를 저장, 별도 앱 설치 불필요
- **AI 요약** — OpenAI, Anthropic, Google LLM을 활용한 한 줄 요약 및 핵심 포인트 자동 추출 (아티클 + YouTube 지원)
- **주간 뉴스레터** — 매주 저장한 링크를 정리한 큐레이션 다이제스트를 이메일로 수신
- **링크 대시보드** — 저장한 링크를 검색, 필터링, 읽음/안읽음 상태 관리
- **알림** — Slack 또는 Telegram 웹훅 연동으로 실시간 알림
- **Google OAuth** — Google 계정으로 10초 만에 시작, 별도 회원가입 불필요

## 기술 스택

- **프레임워크** — Next.js 16 (App Router) + TypeScript strict 모드
- **스타일링** — TailwindCSS v4 + shadcn/ui (New York), 모바일 퍼스트 디자인
- **인증 & DB** — Supabase (Google OAuth + PostgreSQL + Row Level Security)
- **AI** — 멀티 프로바이더 LLM 지원 (OpenAI / Anthropic / Google)
- **이메일** — Resend (트랜잭셔널 + 뉴스레터)
- **PWA** — serwist (오프라인 지원 + Share Target)
- **배포** — Vercel + Cron Jobs

## 시작하기

사전 요구사항: Node.js 20+, Supabase 프로젝트, LLM 프로바이더 API 키

```bash
git clone https://github.com/sguys99/link-digest.git
cd link-digest
npm install
cp .env.example .env.local
# .env.local에 환경변수 설정
npm run dev
```

개발 서버가 `http://localhost:3000`에서 시작됩니다.


## 라이선스

이 프로젝트는 [Apache License 2.0](../LICENSE)을 따릅니다.
