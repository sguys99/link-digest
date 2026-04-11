# LLM 미설정 시 룰 기반 기본 요약 폴백

## 배경

LinkDigest는 링크 추가 시 백그라운드에서 크롤링 → LLM 요약 파이프라인을 실행한다.
LLM API가 설정되지 않으면 크롤링으로 제목/썸네일은 확보되지만 요약(oneLineSummary, keyPoints, estimatedReadTime)이 비어있어 카드가 "URL + 제목" 수준에 머문다.

## 목표

LLM 없이도 크롤링 결과에서 룰 기반으로 기본 요약을 추출하여, 서비스 첫 인상과 기본 유용성을 확보한다.

## 설계

### 1. 룰 기반 요약 함수 (`src/lib/summarize/basic.ts` 신규)

```typescript
type BasicSummary = {
  oneLineSummary: string | null;
  estimatedReadTime: number | null;
};

export function extractBasicSummary(scraped: ScrapedContent): BasicSummary;
```

**oneLineSummary 추출 로직:**
1. `scraped.body`에서 첫 번째 의미 있는 문장 추출 (마침표/물음표/느낌표 기준)
2. 50자 초과 시 truncate + "..."
3. body가 없으면 null (OG description은 스크래핑 단계에서 body에 이미 폴백됨 - `article.ts` 58-64줄)

**estimatedReadTime 계산:**
- 한글 평균 읽기 속도 ~500자/분 기준
- `Math.max(1, Math.round(bodyLength / 500))`
- body가 6000자로 잘려있으므로 최소값이 실제와 더 가까울 수 있지만, "약 N분" 표시라 충분
- body가 없으면 null

**keyPoints:** null 유지 (룰 기반 품질 보장 불가, LLM과 차별점)

### 2. 파이프라인 변경 (`src/lib/summarize/pipeline.ts`)

**LLM 미설정 분기 (67-81줄):**
```
기존: title + thumbnail → status: "summary_pending"
변경: title + thumbnail + extractBasicSummary(scraped) → status: "basic_summary"
```

**LLM 요약 실패 분기 (87-109줄):**
```
기존: title + thumbnail → status: "summary_pending"
변경: title + thumbnail + extractBasicSummary(scraped) → status: "summary_pending" (유지)
```

### 3. 타입 변경 (`src/types/index.ts`)

`LinkStatus`에 `"basic_summary"` 추가:
```typescript
type LinkStatus = "pending" | "completed" | "basic_summary" | "summary_pending" | "crawl_failed";
```

**상태 의미:**
| status | 의미 |
|--------|------|
| `pending` | 파이프라인 실행 전 |
| `basic_summary` | 크롤링 성공 + 룰 기반 기본 요약 (LLM 미설정) |
| `summary_pending` | 크롤링 성공 + LLM 요약 실패 (재시도 가능) |
| `completed` | LLM 요약 완료 |
| `crawl_failed` | 크롤링 실패 |

### 4. UI 변경 (`src/components/dashboard/link-card.tsx`)

- `statusLabel()` 함수에 `basic_summary` → "기본 요약" 추가
- `summary_pending` 라벨을 "AI 요약 대기"로 변경
- oneLineSummary, estimatedReadTime은 이미 조건부 렌더링이므로 추가 변경 불필요
- LLM 설정 유도는 기존 대시보드 상단 배너 활용 (카드 내 유도 UI 없음)

### 5. 기존 데이터 처리

기존 `summary_pending` 링크는 그대로 유지. 새로 추가되는 링크부터 적용.

## 변경 대상 파일

| 파일 | 변경 유형 |
|------|----------|
| `src/lib/summarize/basic.ts` | 신규 생성 |
| `src/lib/summarize/pipeline.ts` | LLM 미설정/실패 분기에 폴백 추가 |
| `src/types/index.ts` | LinkStatus에 basic_summary 추가 |
| `src/components/dashboard/link-card.tsx` | statusLabel 업데이트 |

## 검증 방법

1. LLM 설정 없이 링크 추가 → status가 `basic_summary`인지 확인
2. 카드에 oneLineSummary와 estimatedReadTime이 표시되는지 확인
3. "기본 요약" 배지가 정상 표시되는지 확인
4. LLM 설정 후 링크 추가 → 기존 `completed` 흐름이 정상 동작하는지 확인
5. `npm run build` 통과 확인
