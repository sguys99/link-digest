import { type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ShareIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 15l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function AiIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.6 5.6l2.15 2.15M16.25 16.25l2.15 2.15M5.6 18.4l2.15-2.15M16.25 7.75l2.15-2.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DigestIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="15" r="2" fill="currentColor" />
    </svg>
  )
}

const features: { icon: () => ReactNode; title: string; description: string }[] = [
  {
    icon: ShareIcon,
    title: '모바일 공유 한 번',
    description: '브라우저의 공유 버튼에서 바로 저장.\n앱을 열 필요도 없습니다.',
  },
  {
    icon: AiIcon,
    title: 'AI가 핵심만 요약',
    description: '한 줄 요약과 핵심 포인트 3가지.\nOpenAI, Anthropic, Google 지원.',
  },
  {
    icon: DigestIcon,
    title: '주간 뉴스레터',
    description: '매주 정해진 요일에 이메일로 정리.\nSlack/Telegram 알림도 가능.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          왜 LinkDigest인가요?
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="gap-1.5 py-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <CardHeader className="px-6">
                <div className="flex items-center gap-3">
                  <div className="text-foreground shrink-0">
                    <feature.icon />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
