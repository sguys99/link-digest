'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePwaInstall } from '@/hooks/use-pwa-install'
import { useLinks } from '@/hooks/use-links'

const DISMISS_KEY = 'share-target-hint-dismissed'

function subscribeNoop() {
  return () => {}
}

function getStoredDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return true
  }
}

function getServerDismissed() {
  return true
}

export function ShareTargetHint() {
  const { isIOS } = usePwaInstall()
  const { data, isSuccess } = useLinks({})
  const storedDismissed = useSyncExternalStore(
    subscribeNoop,
    getStoredDismissed,
    getServerDismissed,
  )
  const [manualDismissed, setManualDismissed] = useState(false)
  const dismissed = storedDismissed || manualDismissed

  const isEmpty = useMemo(() => {
    if (!isSuccess || !data) return false
    return data.pages.every((page) => page.data.length === 0)
  }, [isSuccess, data])

  if (isIOS || dismissed || !isEmpty) return null

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // localStorage 접근 실패는 조용히 무시
    }
    setManualDismissed(true)
  }

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <div className="flex items-start gap-3">
        <Share2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            더 빠르게 저장하는 팁
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            브라우저의 공유 버튼에서 <strong>LinkDigest</strong>를 선택하면 바로 저장돼요.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 rounded-full"
            onClick={handleDismiss}
          >
            알겠어요
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 shrink-0"
          onClick={handleDismiss}
          aria-label="닫기"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
