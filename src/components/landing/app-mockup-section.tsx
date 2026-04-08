import { MockupCards } from './mockup-card'

export function AppMockupSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            깔끔하게 정리되는 내 링크
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            저장한 링크를 한눈에. AI 요약으로 빠르게 핵심 파악.
          </p>
        </div>

        {/* 브라우저 프레임 목업 */}
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl border shadow-lg">
          {/* 브라우저 상단 바 */}
          <div className="bg-muted flex h-9 items-center gap-1.5 px-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
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
              <span className="bg-primary text-primary-foreground rounded-md px-2.5 py-1 text-[11px] font-medium">
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
