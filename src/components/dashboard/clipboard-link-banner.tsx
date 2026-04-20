'use client'

import { ClipboardList, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAddLink } from '@/hooks/use-links'
import {
  markClipboardUrlHandled,
  useClipboardUrl,
} from '@/hooks/use-clipboard-url'

export function ClipboardLinkBanner() {
  const { url, isDuplicate, supported, dismiss } = useClipboardUrl()
  const addLink = useAddLink()

  if (!supported || !url) return null

  const handleSave = () => {
    if (addLink.isPending) return
    const target = url
    addLink.mutate(
      { url: target },
      {
        onSuccess: () => {
          markClipboardUrlHandled(target)
          dismiss()
        },
        onError: () => {
          // 409 중복 등 서버가 거부한 케이스도 재노출 방지
          markClipboardUrlHandled(target)
          dismiss()
        },
      },
    )
  }

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-start gap-3">
        <ClipboardList className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            클립보드에 링크가 있어요
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{url}</p>
          {isDuplicate && (
            <Badge variant="secondary" className="mt-2">
              이미 저장된 링크
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isDuplicate || addLink.isPending}
            className="rounded-full"
          >
            {addLink.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              '저장'
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismiss}
            disabled={addLink.isPending}
          >
            무시
          </Button>
        </div>
      </div>
    </div>
  )
}
