import { Badge } from '@/components/ui/badge'
import { LoginButton } from '@/components/auth/login-button'
import { MockupPhoneFrame } from './mockup-phone-frame'
import { MockupCards } from './mockup-card'

export function HeroSection() {
  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] items-center pt-14">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-16 md:px-8">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          {/* 텍스트 */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <Badge variant="secondary" className="text-xs">
              AI 링크 큐레이션
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl">
              링크를 저장하면,
              <br />
              AI가 정리합니다.
            </h1>

            <p className="text-muted-foreground mx-auto max-w-md text-lg md:mx-0">
              모바일 공유 한 번이면 저장 완료. AI가 핵심을 요약하고, 매주
              뉴스레터로 복습하세요.
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
