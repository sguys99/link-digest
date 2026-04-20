const steps = [
  {
    number: 1,
    title: '링크 공유',
    description: '브라우저에서 공유 버튼을 누르고 LinkDigest를 선택하세요.',
  },
  {
    number: 2,
    title: 'AI 요약',
    description: '저장 즉시 AI가 내용을 읽고 핵심을 추출합니다.',
  },
  {
    number: 3,
    title: '뉴스레터 수신',
    description: '매주 정리된 다이제스트를 이메일로 받으세요.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-muted/50 py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          3단계로 시작하세요
        </h2>

        {/* 데스크톱: 수평 배치 */}
        <div className="relative mt-16 hidden md:flex md:items-start md:justify-between">
          {/* 점선 커넥터 */}
          <div className="border-muted-foreground/30 absolute top-6 right-[calc(16.67%+1rem)] left-[calc(16.67%+1rem)] border-t border-dashed" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex-1 text-center">
              <div className="bg-primary text-primary-foreground mx-auto flex h-10 w-10 items-center justify-center rounded-full text-base font-bold">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-[200px] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* 모바일: 수직 배치 */}
        <div className="mt-12 space-y-8 md:hidden">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                {step.number}
              </div>
              <div className="pt-1">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
