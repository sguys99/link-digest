import { LoginButton } from '@/components/auth/login-button'
import { MockupPhoneFrame } from './mockup-phone-frame'
import { MockupCards } from './mockup-card'

export function HeroSection() {
  return (
    <section className="bg-background flex min-h-[calc(100svh-3.5rem)] items-center pt-14">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-16 md:px-8">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          {/* 텍스트 */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            {/* 무채색 텍스트 라벨 (Badge 대체 — 배지 유채색 금지 원칙) */}
            <p className="text-muted-foreground text-[13px] font-semibold tracking-tight">
              AI 링크 큐레이션
            </p>

            <h1 className="text-[2.125rem] font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              링크를 저장하면,
              <br />
              AI가 정리합니다.
            </h1>

            <p className="text-muted-foreground mx-auto max-w-md text-[17px] leading-[1.47] md:mx-0">
              모바일 공유 한 번이면 저장완료.
              <br />
              AI로 핵심을 요약하고, 뉴스레터로 복습하세요.
            </p>

            <div className="mx-auto max-w-xs space-y-3 md:mx-0">
              <LoginButton />
              <p className="text-muted-foreground text-xs">
                무료로 시작 · Google 계정으로 10초 만에
              </p>
            </div>
          </div>

          {/* 폰 목업 */}
          <div className="flex-shrink-0 rotate-2 md:rotate-3">
            <MockupPhoneFrame>
              <MockupCards count={3} />
            </MockupPhoneFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
