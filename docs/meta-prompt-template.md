# PRD 작성 메타 프롬프트: LinkDigest — AI 링크 요약 & 주간 뉴스레터 서비스

## 프롬프트 사용법

아래 프롬프트를 Claude Code에 입력하여 PRD 문서를 생성하세요.

---

## 메타 프롬프트

```
당신은 솔로 개발자를 위한 PRD 전문가입니다.
아래 프로젝트 정보를 바탕으로 실용적이고 개발 가능한 PRD 문서를 작성해주세요.

## 프로젝트 개요

**프로젝트명**: LinkDigest — AI 링크 요약 & 주간 뉴스레터 서비스

**핵심 목표**:
LinkDigest는 사용자가 모바일에서 공유한 링크를 자동으로 수집·요약하고, 매주 주간 뉴스레터 형태로 복습 기회를 제공하는 개인 생산성 서비스다.
"나중에 읽으려고 저장했다가 영영 안 보는" 문제를 해결하기 위해, 저장 즉시 AI가 핵심을 3줄로 요약하고, 주간 뉴스레터로 재노출한다.


**사용자 시나리오**:
0. 사용자가 LinkDigest에 회원 가입 후 기본 적인 설정 저장
   - 회원정보 입력
   - 이메일 발송 설정(시간, 이메일 주소, 발송 방식 등)
   - LLM API 키 설정
   - 확인 버튼을 누르면 LinkDigest 작동 시작
1. 사용자가 스마트폰에서 앱·브라우저의 공유하기 버튼을 눌러 LinkDigest로 링크를 전송
   - PWA(Progressive Web App) Share Target으로 구현
   - 홈화면에 앱 추가 후, iOS/Android 공유 시트에 "LinkDigest" 항목 노출

2. 링크가 저장되는 즉시 백그라운드에서 크롤링 + AI 요약 처리
   - 제목, 한 줄 요약, 핵심 포인트 3가지, 예상 읽기 시간 자동 생성

3. 사용자가 대시보드에서 저장된 링크 목록을 확인하고 읽음 상태를 관리

4. 매주 월요일 오전 8시, 지난 7일간 저장된 링크 요약본이 이메일로 발송(시간, 전송 방식 설정 가능) 
   - 읽은 것 / 안 읽은 것 구분
   - 링크별 AI 요약 포함


## 기술 스택 (고정)
| 구분 | 기술 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router) | 프론트 + API Routes 통합, Vercel 배포 |
| UI | TailwindCSS v4 + shadcn/ui (New York) | 디자인 시스템 |
| 인증 | Supabase Auth + Google OAuth | 구글 소셜 로그인 |
| DB | Supabase (PostgreSQL) | 링크, 요약 데이터 저장 |
| AI 요약 | OpenAI GPT-4o / Claude Sonnet / Gemini 선택적 사용 | 링크 본문 요약 |
| 크롤링 | Cheerio / Readability.js | 서버사이드 본문 추출 |
| 유튜브 | youtube-transcript + YouTube oEmbed API | 자막 추출 및 제목/썸네일 수집 |
| 이메일 | Resend | 주간 뉴스레터 발송 (무료 3,000건/월) |
| PWA | next-pwa | Share Target으로 모바일 공유 시트 연동 |
| 알림 | Slack Webhook + Telegram Bot API | 즉시 요약 알림 + 주간 다이제스트 알림 |
| 배포 | Vercel | push = 자동 배포 |


## PRD 작성 요구사항

### 1. 문서 구조
다음 섹션을 포함하여 작성:

1. **프로젝트 개요**
   - 프로젝트 이름 및 한줄 설명
   - 해결하려는 문제
   - 핵심 가치 제안

2. **사용자 정의**
   - 주요 사용자 페르소나
   - 사용자의 니즈와 목표
   - 핵심 사용 시나리오

3. **핵심 기능 (MVP 범위)**
   - 필수 기능 목록 (Must Have)
   - 우선순위 및 의존성
   - 각 기능별 상세 요구사항:
     - 3.1 PWA Share Target을 통한 링크 저장
     - 3.2 AI 자동 요약 (Claude API)
       - 일반 링크: Cheerio / Readability.js로 본문 추출 → Claude API 요약
       - 유튜브 링크: youtube-transcript로 자막 추출 → Claude API 요약
       - 유튜브 자막 없을 경우 fallback: YouTube oEmbed API로 제목 + 썸네일 수집, "자막 없음" 표시
       - 링크 유형 자동 감지 (youtube.com / youtu.be 도메인 판별)
     - 3.3 링크 대시보드 (목록, 읽음/안읽음, 삭제)
     - 3.4 주간 뉴스레터 이메일 발송 (Resend)
     - 3.5 알림 연동 (Slack / Telegram)
       - 링크 저장 즉시: 요약 결과를 메시지로 전송
       - 매주 월요일: 주간 다이제스트를 이메일과 동일하게 메시지로도 발송
       - 사용자가 settings에서 채널별 ON/OFF 및 Webhook URL / Bot Token 설정
     - 3.6 Google OAuth 인증

4. **시스템 아키텍처**
   - 전체 데이터 흐름도 (링크 공유 → 저장 → 요약 → 뉴스레터)
   - API Routes 구성
   - PWA Share Target 처리 흐름
   - 뉴스레터 발송 스케줄링 구조

5. **데이터 모델**
   - Supabase 테이블 스키마 (users, links)
   - 각 필드 타입, 제약조건, 인덱스 설계

6. **API 설계**
   - Next.js API Routes 목록 및 요청/응답 구조
   - 인증 미들웨어 처리 방식
   - 에러 처리 패턴

7. **프론트엔드 설계**
 
   7.1 디자인 시스템
   - 스택: TailwindCSS v4 + shadcn/ui (New York 스타일)
   - 컬러 토큰: 라이트/다크 모드 CSS 변수 정의
   - 타이포그래피: 폰트 스케일 (heading, body, caption)
   - 공통 컴포넌트 목록 (Button, Card, Badge, Toast, Skeleton 등)
 
   7.2 App Router 페이지 구조 (최대 4페이지)
   - `/` — 랜딩 / 로그인 페이지
   - `/dashboard` — 링크 목록 대시보드 (메인)
   - `/share` — PWA Share Target 수신 처리 페이지
   - `/settings` — 뉴스레터 설정 (이메일, 발송 요일/시간)
 
   7.3 페이지별 컴포넌트 구조
   - 각 페이지의 레이아웃, 주요 컴포넌트, 상태(state) 정의
   - 공통 레이아웃 컴포넌트 (Header, BottomNav 등)
   - 로딩/에러/빈 상태(Empty State) UI 처리
 
   7.4 모바일 퍼스트 레이아웃
   - 기준 뷰포트: 390px (iPhone 14 기준)
   - 하단 고정 네비게이션 바 (모바일)
   - 카드형 링크 목록 UI (스와이프 삭제 고려)
   - 터치 타겟 최소 44px 준수
 
   7.5 핵심 UI 플로우 상세
   - PWA 설치 온보딩: 앱 추가 유도 배너 → 공유 시트 사용법 안내
   - 링크 저장 피드백: 공유 직후 "저장 중 → 요약 완료" 상태 전환 토스트
   - 읽음 처리: 카드 탭 시 읽음 표시 토글 (낙관적 업데이트)
   - 뉴스레터 미리보기: settings 페이지에서 샘플 이메일 확인 가능
 
   7.6 상태 관리
   - 서버 상태: Next.js Server Components + Route Handlers
   - 클라이언트 상태: React useState / useOptimistic (읽음 토글 등)
   - 전역 상태 라이브러리 미사용 (MVP 단계)

8. **PWA 설정 상세**
   - manifest.json share_target 설정
   - iOS / Android 대응 차이점 및 주의사항
   - 오프라인 대응 범위
 
9. **MVP 제외 사항**
   - 향후 버전에서 고려할 기능:
     - 카카오톡 오픈빌더 봇 알림 연동 (채널 개설 심사 필요)
     - HubSpot / Notion 연동
     - AI 기반 자동 태깅 및 링크 간 연관 추천
     - 팟캐스트 / 유튜브 자막 요약
   - 의도적으로 제외한 기능과 이유
 
10. **성공 지표**
    - MVP 완료 기준
    - 측정 가능한 목표 (요약 처리 시간, 뉴스레터 오픈율 등)

### 2. 작성 원칙

- **구체적으로**: 모호한 표현 대신 명확한 요구사항 기술
- **개발자 친화적**: 바로 구현 가능한 수준의 상세도 (코드 예시 포함)
- **MVP 집중**: 최소 기능에 집중, 과도한 기능 배제
- **실용적**: 1인 개발자가 4주 내 구현 가능한 범위
- **모바일 우선**: Share Target UX가 핵심이므로 모바일 관점에서 설계


### 3. 출력 형식

- 파일명: `docs/PRD.md`
- 형식: 마크다운
- 언어: 한국어
- 코드 예시 포함 (타입 정의, manifest.json 설정, API 응답 구조, Supabase 스키마 등)


## 추가 컨텍스트 (선택적으로 제공)

아래 정보가 있다면 함께 제공해주세요:
- 참고하고 싶은 뉴스레터/링크 저장 서비스 레퍼런스 (Pocket, Readwise, Matter 등)
- 원하는 디자인 무드 (미니멀, 다크모드 등)
- 뉴스레터 이메일 템플릿 참고 예시

---

위 요구사항을 바탕으로 PRD 문서를 작성해주세요.
```

---

## 예상 PRD 구조

생성될 PRD는 다음과 같은 구조를 가집니다:

```
docs/PRD.md
├── 1. 프로젝트 개요
├── 2. 사용자 정의
├── 3. 핵심 기능 (MVP)
│   ├── 3.1 PWA Share Target 링크 저장
│   ├── 3.2 AI 자동 요약 (Claude API)
│   ├── 3.3 링크 대시보드
│   ├── 3.4 주간 뉴스레터 발송
│   ├── 3.5 알림 연동 (Slack / Telegram)
│   └── 3.6 Google OAuth 인증
├── 4. 시스템 아키텍처
├── 5. 데이터 모델
├── 6. API 설계
├── 7. 프론트엔드 설계
│   ├── 7.1 디자인 시스템 (TailwindCSS v4 + shadcn/ui)
│   ├── 7.2 App Router 페이지 구조
│   ├── 7.3 페이지별 컴포넌트 구조
│   ├── 7.4 모바일 퍼스트 레이아웃
│   ├── 7.5 핵심 UI 플로우 상세
│   └── 7.6 상태 관리
├── 8. PWA 설정 상세
├── 9. MVP 제외 사항
└── 10. 성공 지표
```

