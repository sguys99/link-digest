'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { parseClipboardUrl } from '@/lib/utils/clipboard'
import { useLinks } from '@/hooks/use-links'

const DISMISS_SESSION_KEY = 'clipboard-dismissed-urls'

function getDismissedUrls(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = sessionStorage.getItem(DISMISS_SESSION_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(
      Array.isArray(arr) ? arr.filter((v) => typeof v === 'string') : [],
    )
  } catch {
    return new Set()
  }
}

function saveDismissedUrl(url: string) {
  if (typeof window === 'undefined') return
  try {
    const current = getDismissedUrls()
    current.add(url)
    sessionStorage.setItem(
      DISMISS_SESSION_KEY,
      JSON.stringify(Array.from(current)),
    )
  } catch {
    // sessionStorage 접근 실패는 조용히 무시
  }
}

function detectSupport(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    !!navigator.clipboard &&
    typeof navigator.clipboard.readText === 'function'
  )
}

type UseClipboardUrlResult = {
  url: string | null
  isDuplicate: boolean
  supported: boolean
  dismiss: () => void
}

export function useClipboardUrl(): UseClipboardUrlResult {
  const [supported] = useState(detectSupport)
  const [url, setUrl] = useState<string | null>(null)
  const { data } = useLinks({})

  const checkClipboard = useCallback(async () => {
    if (!supported) return
    try {
      const raw = await navigator.clipboard.readText()
      const parsed = parseClipboardUrl(raw)
      if (!parsed.ok) {
        setUrl(null)
        return
      }
      if (getDismissedUrls().has(parsed.url)) {
        setUrl(null)
        return
      }
      setUrl(parsed.url)
    } catch {
      // NotAllowedError / 권한 거부 / 미지원 — 조용히 무시
      setUrl(null)
    }
  }, [supported])

  useEffect(() => {
    if (!supported) return
    let cancelled = false
    const run = () => {
      if (!cancelled) void checkClipboard()
    }
    run()
    const onFocus = () => run()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') run()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [supported, checkClipboard])

  const isDuplicate = useMemo(() => {
    if (!url || !data) return false
    return data.pages.some((page) =>
      page.data.some((link) => link.url === url),
    )
  }, [url, data])

  const dismiss = useCallback(() => {
    setUrl((current) => {
      if (current) saveDismissedUrl(current)
      return null
    })
  }, [])

  return { url, isDuplicate, supported, dismiss }
}

export function markClipboardUrlHandled(url: string) {
  saveDismissedUrl(url)
}
