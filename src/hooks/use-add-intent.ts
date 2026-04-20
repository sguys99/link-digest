'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useAddIntent(): {
  shouldOpenAddSheet: boolean
  consume: () => void
} {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldOpenAddSheet = searchParams.get('add') === '1'

  const consume = useCallback(() => {
    router.replace('/dashboard', { scroll: false })
  }, [router])

  return { shouldOpenAddSheet, consume }
}
