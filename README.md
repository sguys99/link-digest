# LinkDigest

AI 링크 요약 & 주간 뉴스레터 서비스

모바일에서 공유한 링크를 자동으로 수집, AI 요약하고 매주 뉴스레터로 복습 기회를 제공합니다.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **UI**: TailwindCSS v4 + shadcn/ui
- **Auth**: Supabase Auth + Google OAuth
- **DB**: Supabase (PostgreSQL + RLS)
- **AI**: LLM API (OpenAI / Anthropic / Google)
- **Email**: Resend
- **PWA**: serwist (Share Target)
- **Deploy**: Vercel

## 시작하기

```bash
npm install
cp .env.example .env.local
# .env.local에 환경변수 설정
npm run dev
```

## 문서

- [PRD](docs/PRD.md)
