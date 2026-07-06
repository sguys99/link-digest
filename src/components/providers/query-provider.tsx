'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query/get-query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState로 감싸지 않는다 — getQueryClient가 서버=요청별/브라우저=싱글턴을 보장.
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
