import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/**
 * 현재 요청의 인증 클레임을 반환한다.
 *
 * React cache()로 감싸 같은 RSC 렌더 패스 안에서 layout·page·HeaderProfile이
 * 여러 번 호출해도 실제 검증은 1회만 수행된다(요청 스코프 dedupe).
 *
 * getClaims()는 JWT 서명을 실제로 검증한다. 프로젝트가 asymmetric 서명키
 * (ES256/RS256)를 쓰면 WebCrypto 로컬 검증으로 네트워크 왕복이 없고,
 * legacy HS256이면 내부적으로 getUser()로 폴백해 서버에서 검증한다
 * (안전하며 동작 동일, 성능 이득만 없음).
 *
 * 세션이 없으면 null을 반환한다.
 */
export const getAuthClaims = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  return data?.claims ?? null
})
