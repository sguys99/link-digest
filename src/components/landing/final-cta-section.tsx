import { LoginButton } from '@/components/auth/login-button'

export function FinalCtaSection() {
  return (
    // 잉크 타일 — 랜딩 마지막 강조 섹션, 흰 pill CTA로 대비 극대화
    <section className="bg-ink py-24 text-center md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          지금 바로 시작하세요
        </h2>
        <p className="mt-3 text-base text-white/70">
          링크 저장부터 AI 요약, 주간 뉴스레터까지.
        </p>
        <div className="mx-auto mt-8 max-w-xs">
          {/* 잉크 타일 위 흰색 pill CTA */}
          <LoginButton
            variant="default"
            className="bg-white text-ink hover:bg-white/90"
          />
        </div>
      </div>
    </section>
  )
}
