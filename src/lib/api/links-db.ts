import type { Link, LinkStatus, PaginatedResponse } from '@/types'
import { toLinkResponse } from '@/lib/api/mappers'
import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

type ListLinksParams = {
  cursor?: string
  limit?: number
  status?: LinkStatus
  isRead?: boolean
}

/**
 * 사용자의 링크 목록을 조회한다 (cursor 페이지네이션).
 *
 * `GET /api/links`와 서버 컴포넌트의 prefetch가 동일한 쿼리·응답 shape를
 * 공유하도록 추출한 헬퍼. 인증은 호출자가 이미 마친 상태의(=RLS 세션이 실린)
 * supabase 클라이언트를 넘겨야 한다. `.eq('user_id', userId)`는 RLS 위의 방어.
 */
export async function listLinksForUser(
  supabase: SupabaseServerClient,
  userId: string,
  { cursor, limit = 20, status, isRead }: ListLinksParams = {},
): Promise<PaginatedResponse<Link>> {
  let query = supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit + 1) // hasMore 판단용

  if (status) {
    query = query.eq('status', status)
  }
  if (isRead !== undefined) {
    query = query.eq('is_read', isRead)
  }
  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) {
    throw new Error('링크 목록 조회에 실패했습니다.')
  }

  const hasMore = data.length > limit
  const items = hasMore ? data.slice(0, limit) : data
  const nextCursor = hasMore
    ? (items[items.length - 1]?.created_at ?? null)
    : null

  return {
    data: items.map(toLinkResponse),
    nextCursor,
    hasMore,
  }
}
