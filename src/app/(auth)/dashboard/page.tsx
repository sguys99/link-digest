import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Link, PaginatedResponse } from '@/types'
import { getQueryClient } from '@/lib/react-query/get-query-client'
import { getAuthClaims } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'
import { listLinksForUser } from '@/lib/api/links-db'
import { getSettingsForUser } from '@/lib/api/settings-db'
import { LlmSetupBanner } from '@/components/dashboard/llm-setup-banner'
import { LinkCardList } from '@/components/dashboard/link-card-list'
import { AddLinkForm } from '@/components/dashboard/add-link-form'
import { ClipboardLinkBanner } from '@/components/dashboard/clipboard-link-banner'
import { ShareTargetHint } from '@/components/dashboard/share-target-hint'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const claims = await getAuthClaims() // 레이아웃과 cache로 dedupe
  const queryClient = getQueryClient()

  // 링크 목록·설정을 서버에서 미리 채워 dehydrate → 하이드레이션 직후
  // /api/links·/api/settings 재요청 없이 즉시 데이터가 그려진다.
  if (claims) {
    const supabase = await createClient()
    const userId = claims.sub as string
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        // useLinks({ isRead: undefined })와 동일 해시(빈 필터). link-card-list의 'all' 탭.
        queryKey: ['links', {}],
        queryFn: () => listLinksForUser(supabase, userId, { limit: 20 }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: PaginatedResponse<Link>) =>
          lastPage.nextCursor ?? undefined,
      }),
      queryClient.prefetchQuery({
        queryKey: ['settings'],
        queryFn: () => getSettingsForUser(supabase, userId),
      }),
    ])
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6 py-4">
        <h1 className="text-lg font-bold">내 링크</h1>
        <LlmSetupBanner />
        <ClipboardLinkBanner />
        <AddLinkForm variant="inline" />
        <ShareTargetHint />
        <LinkCardList />
        <DashboardClient />
      </div>
    </HydrationBoundary>
  )
}
