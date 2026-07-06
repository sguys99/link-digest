# LinkDigest UI 전면 개편 실행 계획

> 기준 문서: 루트 [`DESIGN.md`](../DESIGN.md) (Apple 웹 디자인 시스템 분석)
> 작성일: 2026-07-06 · 브랜치: `feat/re-design`
>
> 진행 방법: 각 Phase의 체크박스(`- [ ]`)를 완료할 때마다 체크(`- [x]`)로 갱신한다.
> 각 Phase는 독립적으로 완료 가능하며, Phase 종료 시점에 빌드가 깨지지 않아야 한다.
> Phase 완료 시 이모지 + 한국어 컨벤션으로 커밋을 남긴다.

---

## 1. 개요 & 디자인 방향 (확정 결정사항)

| 항목 | 결정 |
|---|---|
| 디자인 언어 | DESIGN.md의 Apple 문법 — 타일 교차 리듬, pill CTA, 17px 본문, 네거티브 letter-spacing 헤드라인, 무그림자 원칙 |
| 액센트 전략 | **모노크롬 잉크 + 최소 블루**: 주요 CTA는 잉크(#1d1d1f) pill 버튼. 블루는 인라인 텍스트 링크(#0066cc, 다크 #2997ff)와 포커스 링(#0071e3)에만 허용. 배지/탭/아이콘/배너는 전부 무채색 |
| 한글 폰트 | **Pretendard** (Inter 기반 한글 폰트 — DESIGN.md의 Inter 대체 권장과 부합). npm `pretendard` 패키지 + dynamic-subset CSS import |
| 다크모드 | next-themes ThemeProvider 배선(시스템 연동) + 설정 페이지 토글. 다크 팔레트는 DESIGN.md 다크 타일 톤(#1d1d1f/#272729/#2a2a2c/#252527) 기반 |
| 개편 범위 | 웹 화면 전체(랜딩/대시보드/설정/공지/share/offline + 공통 셸) + 뉴스레터 이메일 템플릿 + PWA 매니페스트/테마 색 |
| 구현 규칙 | 화면 구현 Phase(5~8) 시작 시 **`/frontend-design` 스킬을 먼저 로드**한 뒤 작업 시작 |

### 모던 번안 포인트

- white ↔ parchment(#f5f5f7) ↔ near-black 타일 교차 — **색 전환 자체가 섹션 구분자** (테두리/그림자 없음)
- 헤드라인 웨이트 600 + 네거티브 tracking, 웨이트 500 사용 금지 (300/400/600/700 사다리)
- 카드/버튼 그림자 금지 — 그림자는 목업 이미지 전용 `shadow-product` 단 하나
- `active:scale-[0.97]` 마이크로 인터랙션을 모든 버튼에 적용
- 헤더/바텀내비는 백드롭 블러(frosted glass) 문법

---

## 2. 토큰 매핑 표 (DESIGN.md → `src/app/globals.css`)

### 2-1. 시맨틱 토큰 재정의 (`:root` / `.dark`)

| shadcn 변수 | DESIGN.md 소스 | Light | Dark |
|---|---|---|---|
| `--background` | canvas / ink | `#ffffff` | `#1d1d1f` |
| `--foreground` | ink / body-on-dark | `#1d1d1f` | `#f5f5f7` |
| `--card` | canvas / surface-tile-1 | `#ffffff` | `#272729` |
| `--card-foreground` | ink | `#1d1d1f` | `#f5f5f7` |
| `--popover` | canvas / surface-tile-2 | `#ffffff` | `#2a2a2c` |
| `--primary` | ink (CTA = 잉크 pill) | `#1d1d1f` | `#f5f5f7` (반전 pill) |
| `--primary-foreground` | — | `#f5f5f7` | `#1d1d1f` |
| `--secondary` | canvas-parchment / tile-2 | `#f5f5f7` | `#2a2a2c` |
| `--muted` | canvas-parchment / tile-3 | `#f5f5f7` | `#252527` |
| `--muted-foreground` | ink-muted 계열 | `#6e6e73` (AA 대비 확보) | `#a1a1a6` |
| `--accent` | surface-pearl / tile-2 | `#f5f5f7` | `#2a2a2c` |
| `--border` | hairline | `#e0e0e0` | `rgba(255,255,255,0.12)` |
| `--input` | hairline | `#e0e0e0` | `rgba(255,255,255,0.16)` |
| `--ring` | primary-focus / sky-link | `#0071e3` | `#2997ff` |
| `--destructive` | (현행 유지) | 유지 | 유지 |
| `--radius` | rounded 스케일 | `0.625rem` **유지** | 동일 |

> `--radius` 유지 근거: 파생 스케일 `--radius-md`(×0.8)=8px, `--radius-2xl`(×1.8)=18px가
> DESIGN.md의 `rounded.sm`(8px)/`rounded.lg`(18px)와 이미 정렬되어 있다. 토큰은 그대로 두고
> 컴포넌트 클래스만 조정한다.

### 2-2. 신규 커스텀 토큰 (`@theme inline`에 등록)

| 신규 변수 | 값 (Light / Dark) | 용도 |
|---|---|---|
| `--color-link` | `#0066cc` / `#2997ff` | 인라인 텍스트 링크 전용 — **시스템에서 유일한 블루** |
| `--color-parchment` | `#f5f5f7` / `#252527` | 교차 타일·푸터 배경 (`bg-parchment`) |
| `--color-tile-1` | `#272729` (모드 불변) | 랜딩 다크 타일 (라이트 모드에서도 다크 타일) |
| `--color-tile-2` | `#2a2a2c` (모드 불변) | 다크 타일 인접 시 미세 분리 |
| `--color-tile-3` | `#252527` (모드 불변) | 스택 하단/프레임 |
| `--color-ink` | `#1d1d1f` (모드 불변) | 잉크 타일, 다크 타일 위 CTA |
| `--shadow-product` | `3px 5px 30px rgb(0 0 0 / 0.22)` | 목업 이미지 전용 — 시스템 유일 그림자 |

### 2-3. 타이포그래피 번안 (모바일 퍼스트, 390px 기준)

| DESIGN 토큰 | 원본 | LinkDigest 번안 |
|---|---|---|
| hero-display | 56px/600/-0.28px | `text-[2.125rem] md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1]` |
| display-lg (섹션 헤드) | 40px/600 | `text-[1.75rem] md:text-4xl font-semibold tracking-[-0.015em]` |
| body (랜딩 리드문/본문) | 17px/400/1.47 | `text-[17px] leading-[1.47]` |
| 앱 내부 카드 본문 | — | 14~15px 유지 (모바일 밀도 우선 — 의도적 이탈) |
| caption | 14px/400 | `text-sm` 유지 |
| 웨이트 원칙 | 300/400/600/700 | 헤드라인 `font-semibold`(600), **500 금지**, `font-bold`(700) 남용 금지 |

---

## 3. 프리미티브 수정 vs 토큰 수정 구분 원칙

| 해결 위치 | 항목 |
|---|---|
| **globals.css 토큰만으로 해결** | 전체 색상 팔레트(라이트/다크), 링크 블루, 포커스 링, parchment/타일 서피스, product shadow, 폰트 스택 |
| **shadcn 프리미티브 직접 수정** | `button.tsx`(pill radius, active scale, outline shadow 제거), `card.tsx`(18px radius, shadow 제거), `tabs.tsx`(pill variant 추가) |
| **오버레이 예외 (그림자 유지)** | dialog / sheet / dropdown-menu / select / sonner — 떠 있는 레이어는 실용상 그림자 필요. "카드/버튼 그림자 금지" 규칙의 **명시적 예외** |
| **화면 컴포넌트 수정** | 랜딩 섹션, 대시보드, 설정, 공지, 공통 셸 — Phase 5~8 |

---

## Phase 1: 폰트 파운데이션 — Pretendard 도입

**목적:** Geist + Noto Sans KR(`subsets: ["latin"]`만 지정된 버그로 한글이 폴백 렌더링됨)을 Pretendard로 교체한다.

**도입 방식:** npm `pretendard` 패키지 + **dynamic-subset CSS import** (권장안)
- unicode-range 서브셋 분할로 실사용 글리프만 다운로드 → 모바일 퍼스트에 유리
- 셀프 호스팅 → 외부 CDN 무의존, PWA/serwist 오프라인 폰트 캐싱과 정합
- 가변폰트 단일 파일(~2MB) 방식과 CDN 방식은 배제

### 태스크

- [x] `npm install pretendard`
- [x] `src/app/layout.tsx` — `import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"` 추가, `Geist`/`Geist_Mono`/`Noto_Sans_KR` next/font 로더와 body의 폰트 변수 클래스 제거
- [x] `src/app/globals.css` — `@theme inline`의 `--font-sans`를 `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`로 교체, `--font-mono`는 `ui-monospace, SFMono-Regular, monospace`로 단순화
- [x] 웨이트 사용 원칙 주석 추가 (300/400/600/700 — 500 금지)

**수정 파일:** `src/app/layout.tsx`, `src/app/globals.css`, `package.json`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [ ] dev 서버에서 한글/영문/숫자가 모두 Pretendard로 렌더링 (DevTools → Rendered Fonts에서 "Pretendard Variable" 확인) — 코드 반영 완료, 브라우저 수동 확인 필요
- [ ] 네트워크 탭에서 woff2 서브셋 분할 로드 확인 — 코드 반영 완료, 브라우저 수동 확인 필요

---

## Phase 2: 컬러/그림자 토큰 재정의

**목적:** §2 매핑 표대로 globals.css 팔레트를 전면 교체한다. 기존 팔레트가 이미 무채색이라 이 단계만으로 화면이 깨지지 않고 톤이 이동한다.

### 태스크

- [x] `src/app/globals.css` `:root` — §2-1 Light 열 값으로 교체
- [x] `.dark` 블록 — §2-1 Dark 열 값으로 교체 (미사용 sidebar/chart 토큰은 배경·카드 톤에 맞춰 일괄 정리)
- [x] `@theme inline`에 §2-2 신규 토큰 등록 (`--color-link`, `--color-parchment`, `--color-tile-1/2/3`, `--color-ink`, `--shadow-product`)
- [x] `--radius: 0.625rem` 유지 확인 (파생 스케일 정렬 근거를 주석으로 명기)
- [x] 전역 포커스 스타일 확인 — 새 `--ring` 블루가 유일한 포커스 신호로 동작 (globals `outline-ring/50` + input `ring-ring/50`, 하드코딩 블루 0건)

**수정 파일:** `src/app/globals.css`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [x] 라이트 모드: CTA 버튼 잉크(#1d1d1f), muted 배경 parchment(#f5f5f7) — 빌드 CSS에서 `--primary:#1d1d1f`/`--muted:#f5f5f7` 확인
- [x] DevTools에서 `<html class="dark">` 수동 부여 시 배경 #1d1d1f / 카드 #272729 확인 (배선은 Phase 3) — 빌드 CSS 토큰값 확인
- [x] 입력 포커스 시 링이 #0071e3 블루 — `--ring:#0071e3` 확인

---

## Phase 3: 다크모드 배선 (next-themes)

**목적:** 이미 설치된 next-themes를 ThemeProvider로 배선하고 설정 페이지에 토글을 추가한다.

### 태스크

- [x] `src/components/providers/theme-provider.tsx` 신규 — next-themes ThemeProvider 래퍼 (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`)
- [x] `src/app/layout.tsx` — body 직하에 ThemeProvider 래핑 (`<html suppressHydrationWarning>`은 이미 있음)
- [x] `src/components/settings/appearance-settings.tsx` 신규 — "화면 설정" Card: 시스템/라이트/다크 3-세그먼트(무채색 pill), `useTheme` + 하이드레이션 가드(useSyncExternalStore — react-hooks set-state-in-effect 규칙 정합)
- [x] `src/components/settings/settings-content.tsx` — 화면 설정 Card를 최상단에 추가
- [x] `src/app/layout.tsx` viewport — `themeColor` dark 값을 `#1d1d1f`로 변경 (media 기반이라 수동 토글과 OS 설정이 다르면 상태바 색 불일치 — 알려진 제약으로 주석 명기)
- [x] `src/components/ui/sonner.tsx` — useTheme가 실제 값을 받는지 확인 (이미 next-themes useTheme 사용 → ThemeProvider 배선으로 실제 값 수신, 코드 변경 불필요)

**수정 파일:** `src/components/providers/theme-provider.tsx`(신규), `src/components/settings/appearance-settings.tsx`(신규), `src/app/layout.tsx`, `src/components/settings/settings-content.tsx`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [ ] 설정에서 다크 선택 → 전 화면 즉시 전환 + 새로고침 후 유지, 시스템 선택 → OS 설정 추종 — 코드 반영 완료, 브라우저 수동 확인 필요
- [ ] 하이드레이션 경고 없음 (콘솔 확인) — suppressHydrationWarning + mounted 가드로 대응, 브라우저 수동 확인 필요

---

## Phase 4: shadcn 프리미티브 정비

**목적:** pill 버튼 문법과 무그림자 원칙을 프리미티브 레벨에 심는다. **전 화면에 파급되므로 화면별 Phase보다 먼저 단독 수행한다.**

### 태스크

- [x] `src/components/ui/button.tsx` —
  - base cva: `rounded-md` → `rounded-full`(pill), `active:scale-[0.97]` 추가, `transition-all` 유지
  - `xs`/`icon-xs` 사이즈만 compact utility 문법(8px) 유지 — 계획 본문의 `rounded-lg`(10px)는 부록 B 허용 radius(8px/18px/pill) 위반이므로 `rounded-md`(8px)로 정정. sm/lg는 개별 `rounded-md` 제거 → pill 상속
  - `outline` variant의 `shadow-xs` 제거
- [x] `src/components/ui/card.tsx` — `rounded-xl shadow-sm` → `rounded-2xl`(18px) + 그림자 제거, hairline `border` 유지
- [x] `src/components/ui/input.tsx` — radius 8px(`rounded-md`) 확인, 포커스 링 `--ring`(#0071e3) 정상 확인. 추가로 `shadow-xs` 제거(무그림자 원칙 정합)
- [x] `src/components/ui/tabs.tsx` — `pill` variant 추가: `group-data-[variant=pill]/tabs-list` 스코프로 trigger `rounded-full` + `data-[state=active]:bg-foreground data-[state=active]:text-background` (특이성이 기본 활성 스타일보다 높아 안정적). FilterTabs 인라인 오버라이드 제거하고 `variant="pill"`로 흡수
- [x] `src/components/ui/badge.tsx` — 변경 없음 확인 (전 variant 토큰 기반 자동 무채색화, destructive 빨강만 예외)
- [x] dialog/sheet/dropdown-menu/select/alert-dialog — 오버레이 content 그림자 **유지** 결정을 주석으로 명기. select **trigger**의 `shadow-xs`는 비-부유 컨트롤이므로 제거(input과 정합)
- [x] 전 화면 스모크 테스트 (아래 목록화) → 해당 화면 Phase에서 처리

**Phase 4-7 스모크 결과 (base `rounded-full` 파급으로 화면 Phase 점검 대상):**
- `link-card.tsx` `size="icon"` 더보기 버튼 → 원형화. 카드 액션 아이콘 버튼 원형 허용 여부를 **Phase 7**에서 시각 확인
- `share-target-hint.tsx` `size="icon"` 닫기(X) → 원형화. **Phase 7**
- `add-link-fab.tsx` `size="icon"` size-12 FAB → 원형 + `shadow-lg`. FAB 그림자 결정을 **Phase 7**에서 처리
- `add-link-form.tsx` `size="icon-xs"` → `rounded-md`(8px) 유지, 원형 아님 → 문제 없음
- 텍스트 버튼 전반(outline/ghost/secondary) pill화 → 밀도 높은 카드/폼 내 어색 여부는 각 화면 Phase(6~8)에서 확인

**수정 파일:** `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/tabs.tsx`, `src/components/ui/input.tsx`, `src/components/ui/select.tsx`, (주석만) `dialog.tsx`/`sheet.tsx`/`dropdown-menu.tsx`/`alert-dialog.tsx`, `src/components/dashboard/filter-tabs.tsx`, (확인만) `badge.tsx`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [x] 랜딩 CTA(sm/lg) pill + `active:scale-[0.97]` 렌더 확인(curl 검증), FAB/폼 버튼 pill은 Phase 7에서 시각 확인
- [x] 카드 그림자 없음, 18px 라운드(`--radius-2xl`=×1.8=18px) 확인 · pill variant CSS 7개 규칙 컴파일 확인

---

## Phase 5: 공통 셸 개편

> **시작 전 `/frontend-design` 스킬 로드 필수.**

**목적:** 헤더/바텀내비를 frosted glass 문법으로 재작업하고 공지 화면의 셸 불일치를 해소한다.

### 태스크

- [x] `src/components/layout/header.tsx` — `border-b bg-background` → `bg-background/80 backdrop-blur-xl border-b border-border/60` (frosted sub-nav 번안), 타이틀 `font-semibold tracking-tight`
- [x] `src/components/layout/bottom-nav.tsx` — `bg-background/85 backdrop-blur-xl`, 활성 탭은 잉크 강조(상단 2px 인디케이터 또는 아이콘 fill — 블루 금지)
- [x] `src/components/layout/site-header.tsx` 신규 — 비인증 공용 헤더(로고 + 우측 링크). `announcements/page.tsx`·`announcements/[id]/page.tsx`의 인라인 헤더를 이것으로 교체 (셸 불일치 해소 — (auth) 그룹 이동은 비인증 접근 요건 때문에 하지 않음)
- [x] `src/app/(auth)/layout.tsx` — main 패딩/최대폭 유지 확인(`pt-14 pb-16`이 헤더 h-14·바텀내비 h-16과 정합), 배경 전역 body `bg-background` 상속 확인 — 변경 불필요
- [x] `src/components/landing/landing-header.tsx` — 스크롤 시 `bg-background/80 backdrop-blur-xl`로 통일, CTA pill 확인

**수정 파일:** `src/components/layout/header.tsx`, `src/components/layout/bottom-nav.tsx`, `src/components/layout/site-header.tsx`(신규), `src/app/announcements/page.tsx`, `src/app/announcements/[id]/page.tsx`, `src/components/landing/landing-header.tsx`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [ ] 390px에서 스크롤 시 헤더/바텀내비 블러 투과 확인 (라이트/다크 모두) — 코드 반영 완료, 브라우저 수동 확인 필요
- [x] 공지 페이지 헤더가 랜딩과 동일한 룩 (SiteHeader frosted glass 공용화)

---

## Phase 6: 랜딩 페이지 개편 (타일 리듬)

> **시작 전 `/frontend-design` 스킬 로드 필수.**

**목적:** Apple의 교차 타일 리듬을 랜딩에 번안한다.
섹션 배경 시퀀스: hero(white) → features(parchment) → how-it-works(white) → app-mockup(**다크 타일 tile-1**, 모드 불변) → install-guide(parchment) → final-cta(**잉크 타일** + 흰 pill CTA) → footer(parchment)

### 태스크

- [x] `src/app/page.tsx` — 섹션 순서 조정(app-mockup을 install-guide 앞으로) + 타일 배경 시퀀스 적용
- [x] `hero-section.tsx` — h1 `font-semibold tracking-[-0.02em]`, 리드문 17px/1.47, Badge를 무채색 텍스트 라벨로 대체, 폰 목업에만 `shadow-product`(프레임 파일에서 적용)
- [x] `features-section.tsx` — parchment 타일(`bg-parchment`), 카드 hover translate 제거 → 그림자 없는 hairline 카드, 헤드라인 600
- [x] `how-it-works-section.tsx` — white 타일, 번호 뱃지 무채색(잉크 원형) 확인
- [x] `app-mockup-section.tsx` — 다크 타일(`bg-tile-1`, 라이트/다크 모드 공통) + 흰 텍스트, 브라우저 프레임에 `shadow-product`, 신호등 무채색화 (내부 실제 인라인 링크 없음 — #2997ff 규칙 대상 부재)
- [x] `install-guide-section.tsx` — **iOS 팁 박스의 `blue-*` 하드코딩 제거** → `bg-muted` + `text-muted-foreground` 무채색 안내 박스, 탭은 무채색 pill
- [x] `final-cta-section.tsx` — 잉크 타일(`bg-ink`) + 흰색 pill CTA (LoginButton variant/className 개방)
- [x] `landing-footer.tsx` — `bg-parchment`, fine-print 12px `text-muted-foreground`
- [x] `mockup-phone-frame.tsx`(shadow-2xl→shadow-product) / `mockup-card.tsx`(font-medium→font-semibold) — 새 토큰 정합(내부 카드 무채색) 확인

**수정 파일:** `src/app/page.tsx`, `src/components/landing/*.tsx`(9개), `src/components/auth/login-button.tsx`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [ ] 390px/1280px에서 타일 리듬(색 전환 = 섹션 구분자) 확인 — 코드 반영 완료, 브라우저 수동 확인 필요 (그림자는 `shadow-product` 목업 2곳만 grep 확인됨)
- [x] `grep -rn "blue-" src/components/landing/` 결과 0건

---

## Phase 7: 대시보드 & share/offline 개편

> **시작 전 `/frontend-design` 스킬 로드 필수.**

### 태스크

- [x] `src/app/(auth)/dashboard/page.tsx` — 페이지 타이틀 `text-[1.375rem] font-semibold tracking-tight`
- [x] `link-card.tsx` — 18px 카드/무그림자 상속 확인, 배지 3종 전부 무채색(안읽음 = 잉크 default 배지, 상태 = outline, YouTube = secondary), 읽음 opacity 유지. CardTitle `font-medium`→`font-semibold`(500 금지 정합)
- [x] `filter-tabs.tsx` — Phase 4의 tabs `pill` variant로 교체 완료 확인(인라인 오버라이드 없음, `variant="pill"` 흡수됨)
- [x] `llm-setup-banner.tsx` / `clipboard-link-banner.tsx` / `share-target-hint.tsx` — `rounded-2xl`(18px, 부록 B 정합) + `bg-muted` parchment 무채색 배너로 통일, 액션은 잉크 default pill(base pill이라 중복 `rounded-full` 제거), 배너 제목 `font-medium`→`font-semibold`(500 금지)
- [x] `add-link-form.tsx` — inline URL 입력을 pill search-input(`h-11 rounded-full pl-5 pr-11`, paste 버튼 자리 확보 위해 px 대신 pl/pr 분리로 충돌 회피), 제출 버튼은 입력과 정렬되는 44px 잉크 원형(`size-11`, base pill 상속)
- [x] `add-link-fab.tsx` — 잉크 원형 FAB: `shadow-lg` 제거(무그림자 원칙) + 엣지 정의용 hairline `border border-border`. 잉크/캔버스(다크 반전) 대비가 강해 축소판 그림자 불필요로 결정. Sheet content는 `rounded-t-2xl`(18px)+토큰 자동 상속 확인(변경 불필요)
- [x] `empty-state.tsx`(`text-muted-foreground`), `link-card-skeleton.tsx`(Skeleton `bg-accent`) — 둘 다 토큰 기반으로 새 muted 톤 자동 적응 확인(accent #f5f5f7/#2a2a2c). 코드 변경 불필요
- [x] `src/app/(auth)/share/page.tsx`, `src/app/offline/page.tsx` — share 스피너를 얇은 stroke(`border-2` + `border-muted-foreground/20` 트랙)로 정제, offline "다시 시도"는 화면 주 액션이라 outline→잉크 default pill 승격(base pill 상속). 타이포는 토큰 기반 정합 확인
- [ ] 라이트/다크 각각 무한스크롤·드롭다운 메뉴·삭제 다이얼로그 동작 확인

**수정 파일:** `src/components/dashboard/*.tsx`(10개), `src/app/(auth)/share/page.tsx`, `src/app/offline/page.tsx`

### 완료 기준

- [x] `npm run lint && npm run build` 0 error
- [ ] 390px 다크모드에서 카드 #272729 / 배경 #1d1d1f 계층 확인, 배지에 유채색 없음 — 코드 반영 완료(토큰 기반), 브라우저 수동 확인 필요

---

## Phase 8: 설정 & 공지 화면 개편

> **시작 전 `/frontend-design` 스킬 로드 필수.**

### 태스크

- [x] `settings-content.tsx` — Card 타이틀 위계(`text-base tracking-tight`, CardTitle 기본 `font-semibold` 상속) 네 카드(화면/LLM/뉴스레터/알림) 통일, `space-y-6` 여백 리듬 유지. appearance-settings 타이틀도 동일 정합
- [x] `llm-settings-form.tsx` / `newsletter-settings-form.tsx` / `notification-settings-form.tsx` — 저장 버튼 default 잉크 pill(base 상속) 확인, Switch/Select/Input 토큰 기반+8px radius 확인. notification 폼 소제목 `font-medium`→`font-semibold`(500 금지 정합). LLM 초기화는 destructive 예외 유지
- [x] `newsletter-preview.tsx` — iframe을 `overflow-hidden rounded-2xl border` 래퍼로 감싸 18px radius + hairline border(iframe 자체 radius가 내용 클리핑 안 되는 문제 회피). 다크 다이얼로그 위 흰 프레임이 hairline으로 분리, iframe 내부는 이메일 라이트 고정(Phase 9 정합)
- [ ] `settings-skeleton.tsx` — 새 muted 톤
- [ ] `announcements/*` 화면 + `announcement-card/detail/form/list.tsx` — 카드/타이포 새 문법 적용, 관리자 폼 버튼 pill
- [ ] 다크모드에서 설정 카드 전체(화면 설정 포함) 확인

**수정 파일:** `src/components/settings/*.tsx`(6개), `src/components/announcements/*.tsx`(4개), `src/app/announcements/page.tsx`, `src/app/announcements/[id]/page.tsx`

### 완료 기준

- [ ] `npm run lint && npm run build` 0 error
- [ ] 설정 화면에서 폼 제출(저장 토스트) 정상, 뉴스레터 미리보기 렌더 정상

---

## Phase 9: 이메일 템플릿 & PWA 메타 정합

**목적:** 이메일과 PWA 크롬 색을 새 시스템에 정렬한다. 이메일은 **인라인 스타일 + 라이트 고정** 제약을 유지한다.

### 태스크

- [ ] `src/lib/email/templates/newsletter.tsx` COLORS 재정의:
  - `text: "#1d1d1f"`, `muted: "#6e6e73"`, `border: "#e0e0e0"`, `badgeBg: "#f5f5f7"`
  - `accent: "#0066cc"` — **인라인 텍스트 링크에만** 사용
  - 안읽음 배지 = 잉크 배경(#1d1d1f) + 흰 글자, `unreadBorder: "#1d1d1f"`
  - YouTube 배지 빨강 제거 → `#f5f5f7` / `#6e6e73` 무채색
  - "원문 보기" 버튼 = 잉크 pill (`background:#1d1d1f; color:#fff; border-radius:9999px`)
- [ ] 헤더/푸터 영역 parchment(#f5f5f7), 본문 폰트 스택 `Pretendard, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif` (이메일은 웹폰트 로드 불가 → 시스템 폴백 전제)
- [ ] `/api/newsletter/preview`로 렌더 확인 (설정 화면 미리보기 경유)
- [ ] `public/manifest.json` — `theme_color: "#ffffff"`(라이트 셸 기준), `background_color: "#ffffff"` 유지
- [ ] `src/app/layout.tsx` viewport themeColor 최종값 확인 (light `#ffffff` / dark `#1d1d1f`)

**수정 파일:** `src/lib/email/templates/newsletter.tsx`, `public/manifest.json`, `src/app/layout.tsx`

### 완료 기준

- [ ] `npm run lint && npm run build` 0 error
- [ ] 뉴스레터 미리보기에서 블루가 인라인 링크 외에 없음
- [ ] Android Chrome에서 설치 배너/스플래시 색 확인 (수동)

---

## Phase 10: 최종 QA & 정합성 감사

### 태스크

- [ ] **블루 감사**: `grep -rn "blue-\|#2563eb\|#3b82f6" src/` → 0건. `#0066cc|#2997ff|#0071e3`는 globals.css·이메일 템플릿에만 존재
- [ ] **그림자 감사**: `grep -rn "shadow-" src/components src/app --include="*.tsx"` → 오버레이(dialog/sheet/dropdown/select/sonner)와 `shadow-product` 외 0건
- [ ] **웨이트 감사**: `grep -rn "font-bold\|font-medium" src/` 검토 — 헤드라인 `font-semibold` 통일 (버튼/캡션의 `font-medium` 허용 범위는 결정 후 본 문서에 기록)
- [ ] 전 화면 × 라이트/다크 × 390px/768px/1280px 매트릭스 점검 (부록 A)
- [ ] 접근성: 포커스 링 가시성(키보드 탭 순회), `muted-foreground` 대비 AA(4.5:1) 스팟 체크, 터치 타깃 44px
- [ ] PWA: 오프라인 페이지, share target 플로우, 설치 후 상태바 색
- [ ] `npm run lint && npm run build` 최종 0 error
- [ ] CLAUDE.md 스타일링 섹션에 새 규칙 1줄 추가 ("액센트: 모노크롬 잉크 + 링크/포커스 블루만")

### 완료 기준

- [ ] 감사 grep 3종 통과 + 매트릭스 점검표 전 항목 체크 + 빌드 클린

---

## 부록 A: 화면 확인 체크포인트 (매 Phase 공통)

아래 경로를 라이트/다크 각각, **390px 우선**으로 확인한다.

| 경로 | 확인 포인트 |
|---|---|
| `/` | 타일 리듬, 히어로 타이포, 목업 그림자, 헤더 블러 |
| `/dashboard` | 카드 계층, 배지 무채색, 필터 pill, FAB, 배너 |
| `/settings` | 카드 위계, 폼/토글, 화면 설정(테마), 뉴스레터 미리보기 |
| `/announcements`, `/announcements/[id]` | 공용 셸 일관성, 카드 문법 |
| `/share?url=...` | 스피너/타이포 |
| `/offline` | 타이포/버튼 |

## 부록 B: 금지 패턴

- `text-blue-*` / `bg-blue-*` / `border-blue-*` Tailwind 유틸리티 (블루는 `--color-link`·`--ring` 토큰만)
- 배지·탭·아이콘·배너의 유채색 (destructive 빨강은 삭제/에러 한정 예외)
- 카드·버튼·텍스트에 그림자 (오버레이·`shadow-product`만 예외)
- 헤드라인에 `font-medium`(500) — 웨이트 사다리는 300/400/600/700
- 데코 그라디언트 배경 (페이드 마스크 `from-background to-transparent`는 허용)
- radius 문법 혼용 — 8px(compact utility) / 18px(카드) / pill(액션) 외 값 사용 금지
- `--color-link` 다크 변형(#2997ff)을 라이트 서피스에 사용
