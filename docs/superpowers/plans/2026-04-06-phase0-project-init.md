# Phase 0: 프로젝트 초기화 & 개발 인프라 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `npm run dev`로 빈 Next.js 15 앱이 로컬에서 실행되고, shadcn/ui 컴포넌트를 사용할 수 있으며, 핵심 의존성이 설치된 개발 준비 상태를 만든다.

**Architecture:** `create-next-app`으로 Next.js 15 App Router 프로젝트를 생성하고, shadcn/ui(New York 스타일)를 초기화한 뒤, Supabase/TanStack Query/react-hook-form+zod/resend 의존성을 설치한다. 환경변수 템플릿과 기본 타입 파일을 구성하여 Phase 1 진입 준비를 완료한다.

**Tech Stack:** Next.js 15, TypeScript (strict), TailwindCSS v4, shadcn/ui (New York), Node.js 24

**현재 상태:** 프로젝트 루트에 `docs/`, `.env.example`, `CLAUDE.md`, `.gitignore`만 존재. `package.json`, `src/` 없음. Node.js v24.14.1, npm v11.11.0 사용 가능.

---

## 파일 구조 (Phase 0 완료 후)

```
link-digest/
  package.json              # Next.js 15 + 핵심 의존성
  tsconfig.json             # strict 모드, paths alias
  next.config.ts            # Next.js 설정
  components.json           # shadcn/ui 설정
  .env.local                # 로컬 환경변수 (.env.example 기반)
  src/
    app/
      layout.tsx            # 루트 레이아웃 (lang="ko", 다크모드)
      page.tsx              # 임시 랜딩 페이지
      globals.css           # TailwindCSS v4 + shadcn/ui CSS 변수
    components/
      ui/
        button.tsx          # shadcn/ui Button (동작 검증용)
    lib/
      utils.ts              # cn() 유틸리티 (shadcn 자동 생성)
    types/
      index.ts              # 공통 타입 정의 (Database, User, Link)
```

---

### Task 1: Next.js 15 프로젝트 생성

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**주의:** `create-next-app`은 현재 디렉토리에 이미 파일이 있으므로 임시 디렉토리에 생성 후 필요한 파일만 복사한다.

- [ ] **Step 1: 임시 디렉토리에 Next.js 프로젝트 생성**

```bash
cd /tmp && npx create-next-app@latest link-digest-init \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --yes
```

Expected: `/tmp/link-digest-init/` 디렉토리에 Next.js 15 프로젝트 생성 완료

- [ ] **Step 2: 생성된 프로젝트 파일을 현재 디렉토리로 복사**

```bash
cd /Users/kmyu/Desktop/project/link-digest

# 핵심 파일 복사 (기존 파일 덮어쓰지 않도록 주의)
cp /tmp/link-digest-init/package.json .
cp /tmp/link-digest-init/tsconfig.json .
cp /tmp/link-digest-init/next.config.ts .
cp -r /tmp/link-digest-init/src .
cp /tmp/link-digest-init/eslint.config.mjs .
cp /tmp/link-digest-init/postcss.config.mjs .

# 임시 디렉토리 정리
rm -rf /tmp/link-digest-init
```

- [ ] **Step 3: 의존성 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm install
```

Expected: `node_modules/` 생성, `package-lock.json` 생성

- [ ] **Step 4: tsconfig.json strict 모드 확인**

`tsconfig.json`을 읽고 `"strict": true`가 설정되어 있는지 확인한다.
`create-next-app`이 기본적으로 strict를 켜지만, 누락 시 추가한다.

```jsonc
// tsconfig.json에 이 설정이 있어야 함
{
  "compilerOptions": {
    "strict": true
  }
}
```

- [ ] **Step 5: 개발 서버 실행 테스트**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run dev &
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: HTTP 200 응답

- [ ] **Step 6: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs src/
git commit -m ":tada: Next.js 15 프로젝트 초기 생성 (App Router, TypeScript, TailwindCSS v4)"
```

---

### Task 2: 루트 레이아웃 및 랜딩 페이지 커스터마이징

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 루트 레이아웃 수정**

`src/app/layout.tsx`를 다음과 같이 수정한다:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkDigest",
  description: "AI 링크 요약 & 주간 뉴스레터 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

핵심 변경: `lang="ko"`, `title`을 "LinkDigest"로, `description`을 한국어로, `suppressHydrationWarning` 추가 (다크모드 대비)

- [ ] **Step 2: 임시 랜딩 페이지 작성**

`src/app/page.tsx`를 다음으로 교체한다:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">LinkDigest</h1>
    </main>
  );
}
```

- [ ] **Step 3: 빌드 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run build
```

Expected: 빌드 성공, 에러 없음

- [ ] **Step 4: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add src/app/layout.tsx src/app/page.tsx
git commit -m ":lipstick: 루트 레이아웃 한국어 설정 및 임시 랜딩 페이지 작성"
```

---

### Task 3: shadcn/ui 초기화

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `src/app/globals.css` (shadcn/ui CSS 변수 추가)

- [ ] **Step 1: shadcn/ui 초기화**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npx shadcn@latest init -d
```

초기화 시 선택 사항:
- Style: New York
- Base color: Neutral
- CSS variables: Yes

`-d` 플래그는 기본값 사용. 만약 인터랙티브 프롬프트가 뜨면 위 설정으로 선택한다.

Expected: `components.json` 생성, `src/lib/utils.ts` 생성 (cn 함수 포함), `src/app/globals.css`에 CSS 변수 추가

- [ ] **Step 2: components.json 설정 확인**

`components.json`을 읽고 다음 설정이 올바른지 확인한다:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 3: cn() 유틸리티 함수 확인**

`src/lib/utils.ts`가 생성되었는지 확인하고, `cn` 함수가 존재하는지 확인:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add components.json src/lib/utils.ts src/app/globals.css
# package.json, package-lock.json이 변경되었다면 함께 추가
git add package.json package-lock.json
git commit -m ":sparkles: shadcn/ui 초기화 (New York 스타일, CSS variables)"
```

---

### Task 4: shadcn/ui Button 컴포넌트로 동작 검증

**Files:**
- Create: `src/components/ui/button.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Button 컴포넌트 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npx shadcn@latest add button -y
```

Expected: `src/components/ui/button.tsx` 생성

- [ ] **Step 2: 랜딩 페이지에 Button 추가하여 검증**

`src/app/page.tsx`를 다음으로 수정한다:

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">LinkDigest</h1>
      <p className="text-muted-foreground">
        AI 링크 요약 & 주간 뉴스레터 서비스
      </p>
      <Button>시작하기</Button>
    </main>
  );
}
```

- [ ] **Step 3: 빌드 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run build
```

Expected: 빌드 성공 — shadcn/ui Button이 정상적으로 렌더링 가능한 상태

- [ ] **Step 4: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add src/components/ui/button.tsx src/app/page.tsx package.json package-lock.json
git commit -m ":sparkles: shadcn/ui Button 컴포넌트 추가 및 동작 검증"
```

---

### Task 5: 핵심 의존성 설치

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Supabase 클라이언트 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: TanStack Query 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm install @tanstack/react-query
```

- [ ] **Step 3: 폼 처리 라이브러리 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm install react-hook-form zod @hookform/resolvers
```

- [ ] **Step 4: 이메일 발송 라이브러리 설치**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm install resend
```

- [ ] **Step 5: 빌드 확인 (의존성 충돌 없는지)**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run build
```

Expected: 빌드 성공, 의존성 충돌 없음

- [ ] **Step 6: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add package.json package-lock.json
git commit -m ":heavy_plus_sign: 핵심 의존성 설치 (Supabase, TanStack Query, react-hook-form, zod, Resend)"
```

---

### Task 6: 환경변수 설정

**Files:**
- Create: `.env.local`

- [ ] **Step 1: .env.example 기반으로 .env.local 생성**

`.env.example` 내용을 기반으로 `.env.local`을 생성한다:

```bash
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# LLM API (사용자가 Settings에서 provider별 키를 직접 입력)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Resend (이메일 발송)
RESEND_API_KEY=

# Vercel Cron Secret
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**주의:** `.env.local`은 `.gitignore`에 포함되어 있으므로 커밋하지 않는다.

- [ ] **Step 2: 환경변수가 gitignore에 포함되는지 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && git status
```

Expected: `.env.local`이 untracked files에 나타나지 않음 (`.gitignore`에 `.env*.local` 패턴이 있으므로)

---

### Task 7: 공통 타입 정의

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 타입 정의 파일 작성**

`src/types/index.ts`를 다음과 같이 작성한다 (PRD 5.1, 5.2 스키마 기반):

```ts
// --- User ---

export type LlmProvider = "openai" | "anthropic" | "google";

export type LlmSettings = {
  provider: LlmProvider;
  model: string;
  apiKey: string;
};

export type NewsletterDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type NewsletterSettings = {
  enabled: boolean;
  day: NewsletterDay;
  time: string; // "HH:mm" 형식
};

export type NotificationChannel = "slack" | "telegram";

export type NotificationSettings = {
  enabled: boolean;
  channel: NotificationChannel | null;
  webhookUrl: string;
  digestEnabled: boolean;
};

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  llmSettings: LlmSettings;
  newsletterSettings: NewsletterSettings;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
};

// --- Link ---

export type LinkStatus = "pending" | "processing" | "completed" | "failed";

export type ContentType = "article" | "video" | "pdf" | "other";

export type Link = {
  id: string;
  userId: string;
  url: string;
  title: string | null;
  thumbnailUrl: string | null;
  contentType: ContentType;
  oneLineSummary: string | null;
  keyPoints: string[] | null;
  estimatedReadTime: number | null;
  status: LinkStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};
```

- [ ] **Step 2: 타입 import 테스트 (빌드 확인)**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run build
```

Expected: 빌드 성공 (사용되지 않는 타입이라도 빌드에 영향 없음)

- [ ] **Step 3: 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add src/types/index.ts
git commit -m ":label: 공통 타입 정의 (User, Link, Settings)"
```

---

### Task 8: ESLint 설정 확인

**Files:**
- Modify: `eslint.config.mjs` (필요 시)

- [ ] **Step 1: ESLint 실행**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run lint
```

Expected: 에러 없음 (경고는 허용)

- [ ] **Step 2: lint 에러가 있다면 수정**

에러가 있다면 해당 파일을 수정하여 lint를 통과시킨다.

- [ ] **Step 3: 변경사항이 있다면 커밋**

```bash
cd /Users/kmyu/Desktop/project/link-digest
git add -A && git diff --cached --quiet || git commit -m ":wrench: ESLint 설정 및 lint 에러 수정"
```

---

### Task 9: 최종 검증

- [ ] **Step 1: 전체 빌드 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run build
```

Expected: 빌드 성공

- [ ] **Step 2: 개발 서버 실행 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm run dev &
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: HTTP 200

- [ ] **Step 3: 설치된 의존성 요약 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && npm ls --depth=0
```

Expected: 다음 패키지가 설치되어 있어야 함:
- `next` (15.x)
- `react`, `react-dom` (19.x)
- `typescript`
- `@supabase/supabase-js`, `@supabase/ssr`
- `@tanstack/react-query`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `resend`
- `tailwindcss` (v4.x)
- shadcn 관련: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`

- [ ] **Step 4: 파일 구조 확인**

```bash
cd /Users/kmyu/Desktop/project/link-digest && find src -type f | sort
```

Expected:
```
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/ui/button.tsx
src/lib/utils.ts
src/types/index.ts
```

Phase 0 완료. Phase 1 (Supabase + Google OAuth 인증) 진입 준비 완료.
