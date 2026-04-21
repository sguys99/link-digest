'use client'

import { Lightbulb } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const androidSteps = [
  {
    number: 1,
    title: 'Chrome에서 접속',
    description: 'linkdigest.app 을 Chrome으로 열어주세요.',
  },
  {
    number: 2,
    title: '"홈 화면에 추가" 선택',
    description: '메뉴(⋮) → "홈 화면에 추가" 또는 설치 배너를 탭하세요.',
  },
  {
    number: 3,
    title: '공유 메뉴에서 바로 저장',
    description:
      '어떤 앱에서든 공유 → LinkDigest로 링크가 바로 저장돼요.',
  },
]

const iosSteps = [
  {
    number: 1,
    title: 'Safari 또는 Chrome에서 접속',
    description: 'linkdigest.app 을 열어주세요.',
  },
  {
    number: 2,
    title: '공유 버튼 탭',
    description:
      'Safari는 하단, Chrome은 상단의 공유 아이콘을 눌러주세요.',
  },
  {
    number: 3,
    title: '"홈 화면에 추가" 선택',
    description: '목록에서 "홈 화면에 추가"를 찾아 탭하세요.',
  },
]

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-4">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function InstallGuideSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            앱처럼 사용하기
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            홈 화면에 추가하면
            <br />
            더 빠르게
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            설치 없이, 앱스토어 없이 바로 사용할 수 있어요
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-sm">
          <Tabs defaultValue="android">
            <TabsList className="w-full">
              <TabsTrigger value="android">Android</TabsTrigger>
              <TabsTrigger value="ios">iOS</TabsTrigger>
            </TabsList>

            <TabsContent value="android" className="mt-4 space-y-3">
              {androidSteps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </TabsContent>

            <TabsContent value="ios" className="mt-4 space-y-3">
              {iosSteps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
              <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  iOS에서는 앱 안에서 직접 링크를 붙여넣거나, + 버튼으로
                  추가할 수 있어요.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
