import type { SettingsResponse } from '@/types'
import { toSettingsResponse } from '@/lib/api/mappers'
import { isUsingEnvFallback } from '@/lib/llm/config'
import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * 사용자의 설정을 조회한다(비밀값 마스킹 포함).
 *
 * `GET /api/settings`와 서버 컴포넌트의 prefetch가 동일한 쿼리·응답 shape를
 * 공유하도록 추출한 헬퍼. 인증은 호출자가 이미 마친 supabase 클라이언트를 넘긴다.
 */
export async function getSettingsForUser(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<SettingsResponse> {
  const { data, error } = await supabase
    .from('users')
    .select('llm_settings, newsletter_settings, notification_settings')
    .eq('id', userId)
    .single()

  if (error || !data) {
    throw new Error('설정 조회에 실패했습니다.')
  }

  const isFree = isUsingEnvFallback(
    (data.llm_settings as Record<string, unknown>) ?? null,
  )
  return toSettingsResponse(data, isFree)
}
