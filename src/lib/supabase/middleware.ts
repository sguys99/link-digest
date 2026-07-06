import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // getClaims()는 JWT 서명을 검증한다(asymmetric 키면 로컬 검증, 없으면 getUser 폴백).
  // 만료 임박 시 먼저 세션을 리프레시하고, 새 토큰은 위 setAll 콜백으로 응답 쿠키에
  // 기록되므로 토큰 갱신이 그대로 유지된다. proxy는 user의 truthiness만 사용한다.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  const user = claims
    ? { id: claims.sub as string, email: claims.email as string | undefined }
    : null

  return { response: supabaseResponse, user }
}
