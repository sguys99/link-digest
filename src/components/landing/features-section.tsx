import { Share2, Sparkles, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Share2,
    title: '모바일 공유 한 번',
    description:
      '브라우저의 공유 버튼에서 바로 저장. 앱을 열 필요도 없습니다.',
  },
  {
    icon: Sparkles,
    title: 'AI가 핵심만 요약',
    description:
      '한 줄 요약과 핵심 포인트 3가지. OpenAI, Anthropic, Google 지원.',
  },
  {
    icon: Mail,
    title: '주간 뉴스레터',
    description:
      '매주 정해진 요일에 이메일로 정리. Slack/Telegram 알림도 가능.',
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
              className="gap-4 py-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <CardHeader className="px-6">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-base font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
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
