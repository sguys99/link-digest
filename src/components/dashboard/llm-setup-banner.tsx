'use client'

import Link from 'next/link'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'

export function LlmSetupBanner() {
  const { data: settings, isLoading, isError } = useSettings()

  if (isLoading || isError) return null

  const { provider, apiKey } = settings?.llmSettings ?? {}
  if (provider && apiKey) return null

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Wand2 className="h-5 w-5 text-primary" />
        </div>
        <p className="flex-1 text-sm text-foreground">
          <span className="font-semibold">AI 요약 기능</span>을 사용하려면 LLM API를 설정해주세요.
        </p>
        <Button asChild size="sm" className="rounded-full">
          <Link href="/settings">설정하기</Link>
        </Button>
      </div>
    </div>
  )
}
