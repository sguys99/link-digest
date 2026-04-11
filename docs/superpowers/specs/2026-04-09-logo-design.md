# LinkDigest 로고 디자인 스펙

## 개요

LinkDigest에 시각적 브랜드 아이덴티티를 부여하기 위한 로고 디자인.
현재 텍스트만으로 브랜드를 표시하고 있어 차별화가 부족한 상태를 개선한다.

## 디자인 결정 사항

| 항목 | 결정 |
|------|------|
| 컨셉 | 전문적 & 신뢰감 (Stripe, Vercel 스타일) |
| 컬러 | 모노크롬 (흑백). 라이트: 검정 배경 + 흰색 아이콘, 다크: 흰색 배경 + 검정 아이콘 |
| 모티프 | 클래식 링크/체인 심볼 (두 개의 체인 링크가 대각선으로 연결) |
| 컨테이너 | 원형 (circle) |
| 버전 | 2가지 — 헤더용(아이콘+텍스트), 파비콘용(아이콘만) |

## SVG 로고 사양

### 아이콘 (원형 컨테이너 + 체인 링크)

viewBox: `0 0 48 48`

구성 요소:
- 원형 배경: `cx="24" cy="24" r="24"`
- 상단 링크: 둥근 끝(stroke-linecap: round), stroke-width 2.5
- 하단 링크: 동일 스타일, 대각선 아래 배치
- 연결선: 두 링크를 잇는 대각선 (22,26 → 26,22)

라이트 모드: fill="#0a0a0a" (배경), stroke="white" (아이콘)
다크 모드: fill="#ffffff" (배경), stroke="#0a0a0a" (아이콘)

### 사이즈별 조정

| 용도 | 크기 | stroke-width | 비고 |
|------|------|-------------|------|
| 헤더 로고 | 36px | 2.5 | 텍스트와 조합 |
| PWA 아이콘 | 192px, 512px | 2.5 | manifest.json 등록 |
| Apple Touch Icon | 180px | 2.5 | iOS 홈 화면 |
| 파비콘 | 32px, 16px | 3~4 | 작은 크기에서 가독성 확보를 위해 두껍게 |

## 적용 위치 및 수정 파일

### 1. SVG 로고 컴포넌트 생성

**파일**: `src/components/logo.tsx`

- `LinkDigestLogo` 컴포넌트 (아이콘만 렌더링하는 SVG)
- props: `size` (기본 36), `className`
- 다크모드: CSS `dark:` 클래스로 fill/stroke 반전

### 2. 랜딩 헤더 수정

**파일**: `src/components/landing/landing-header.tsx` (35번 줄)

변경 전:
```tsx
<span className="text-lg font-bold tracking-tight">LinkDigest</span>
```

변경 후:
```tsx
<div className="flex items-center gap-2">
  <LinkDigestLogo size={28} />
  <span className="text-lg font-bold tracking-tight">LinkDigest</span>
</div>
```

### 3. 랜딩 푸터 수정

**파일**: `src/components/landing/landing-footer.tsx` (8번 줄)

변경 전:
```tsx
<span className="text-sm font-bold tracking-tight">LinkDigest</span>
```

변경 후:
```tsx
<div className="flex items-center gap-1.5">
  <LinkDigestLogo size={20} />
  <span className="text-sm font-bold tracking-tight">LinkDigest</span>
</div>
```

### 4. 파비콘 교체

**파일**: `src/app/favicon.ico`

- 현재 기존 favicon.ico를 새 로고 기반 ICO로 교체
- SVG를 16x16, 32x32 크기로 변환

### 5. PWA 아이콘 교체

**파일**: `public/icons/icon-192x192.png`, `public/icons/icon-512x512.png`, `public/icons/apple-touch-icon.png`

- SVG를 각 사이즈의 PNG로 변환하여 교체
- manifest.json은 이미 올바른 경로를 참조하므로 수정 불필요

### 6. 메타데이터 업데이트

**파일**: `src/app/layout.tsx`

- `metadata.icons`에 favicon 및 다양한 사이즈 아이콘 명시

## 구현 방식

PNG/ICO 생성 방법: `sharp` 패키지를 devDependency로 설치하여 SVG → PNG/ICO 변환 스크립트를 작성하거나, 수동으로 SVG 기반 아이콘 파일을 생성한다.

## 검증 방법

1. `npm run dev`로 개발 서버 실행
2. 랜딩 페이지에서 헤더 좌측에 로고 아이콘 + "LinkDigest" 텍스트 확인
3. 푸터에서 로고 아이콘 + "LinkDigest" 텍스트 확인
4. 브라우저 탭에서 파비콘 표시 확인
5. 다크모드 전환 시 로고 색상 반전 확인
6. 모바일 뷰포트(390px)에서 레이아웃 깨짐 없는지 확인
