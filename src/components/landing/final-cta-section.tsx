import { LoginButton } from '@/components/auth/login-button'

export function FinalCtaSection() {
  return (
    <section className="bg-muted/50 py-24 text-center md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          지금 바로 시작하세요
        </h2>
        <p className="text-muted-foreground mt-3 text-base">
          링크 저장부터 AI 요약, 주간 뉴스레터까지.
        </p>
        <div className="mx-auto mt-8 max-w-xs">
          <LoginButton />
        </div>
      </div>
    </section>
  )
}
