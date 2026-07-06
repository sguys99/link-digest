import { getAuthClaims } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/auth/user-menu'

/**
 * 헤더 우측 사용자 메뉴. 프로필(display_name, avatar_url) DB 조회를 수행하는
 * async 서버 컴포넌트로, <Suspense> 경계 안에서 스트리밍되어 레이아웃/페이지
 * 렌더를 블로킹하지 않는다. 인증 클레임은 getAuthClaims(cache)로 레이아웃과
 * dedupe되어 추가 검증 왕복이 없다.
 */
export async function HeaderProfile() {
  const claims = await getAuthClaims()
  if (!claims) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('display_name, avatar_url')
    .eq('id', claims.sub as string)
    .single()

  return (
    <UserMenu
      email={(claims.email as string) ?? ''}
      displayName={profile?.display_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
    />
  )
}
