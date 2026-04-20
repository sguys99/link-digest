'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LinkDigestLogo } from '@/components/logo'
import { useSettings } from '@/hooks/use-settings'

export function LlmSetupBanner() {
  const { data: settings, isLoading, isError } = useSettings()

  if (isLoading || isError) return null

  const { provider, apiKey } = settings?.llmSettings ?? {}
  if (provider && apiKey) return null

  const isUsingFreeAi = settings?.isUsingFreeAi ?? false

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-center gap-3">
        <LinkDigestLogo size={28} className="shrink-0" />
        <p className="flex-1 text-sm text-foreground">
          {isUsingFreeAi ? (
            <>
              <span className="font-semibold">무료 AI 요약</span>이 기본 제공되고 있어요.
              <br />
              LLM API 키를 설정하면 품질을 높일 수 있습니다.
            </>
          ) : (
            <>
              <span className="font-semibold">AI 요약 기능</span>을 사용하려면 LLM API를 설정해주세요.
            </>
          )}
        </p>
        <Button asChild size="sm" className="rounded-full">
          <Link href="/settings">설정하기</Link>
        </Button>
      </div>
    </div>
  )
}
