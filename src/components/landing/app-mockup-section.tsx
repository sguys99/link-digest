import { MockupCards } from './mockup-card'

export function AppMockupSection() {
  return (
    // 다크 타일(tile-1) — 라이트/다크 모드 공통, 색 전환 자체가 섹션 구분자
    <section className="bg-tile-1 py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            깔끔하게 정리되는 내 링크
          </h2>
          <p className="mt-3 text-base text-white/70">
            저장한 링크를 한눈에. AI 요약으로 빠르게 핵심 파악.
          </p>
        </div>

        {/* 브라우저 프레임 목업 — 시스템 유일 그림자 shadow-product */}
        <div className="shadow-product mx-auto mt-12 max-w-[85%] overflow-hidden rounded-2xl border md:max-w-xl">
          {/* 브라우저 상단 바 (신호등은 무채색 처리 — 유채색 금지) */}
          <div className="bg-muted flex h-9 items-center gap-1.5 px-4">
            <div className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
            <div className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
            <div className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
            <div className="bg-background ml-3 flex-1 rounded-md px-3 py-1">
              <span className="text-muted-foreground text-[11px]">
                linkdigest.app/dashboard
              </span>
            </div>
          </div>

          {/* 대시보드 콘텐츠 */}
          <div className="relative bg-background p-4 md:p-6">
            {/* 미니 헤더 */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight">
                LinkDigest
              </span>
              <div className="h-6 w-6 rounded-full bg-muted" />
            </div>

            {/* 필터 탭 */}
            <div className="mb-4 flex gap-2">
              <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-[11px] font-semibold">
                전체
              </span>
              <span className="text-muted-foreground text-[11px] px-2.5 py-1">
                안 읽음
              </span>
              <span className="text-muted-foreground text-[11px] px-2.5 py-1">
                읽음
              </span>
            </div>

            {/* 카드 목록 */}
            <MockupCards count={3} />

            {/* 하단 페이드 */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
