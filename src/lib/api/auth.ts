import { createClient } from "@/lib/supabase/server";

type AuthResult =
  | { success: true; userId: string; email: string }
  | { success: false; response: Response };

type RequireAuthOptions = {
  /**
   * true면 getUser()로 Auth 서버에 재검증 요청을 보내 세션 폐기(밴/로그아웃/삭제)를
   * 즉시 반영한다. service-role 쓰기·비밀값 저장·비용 유발 등 최고권한/민감 경로에 사용.
   * 기본(false)은 getClaims()로 JWT 서명을 검증한다(asymmetric 키면 로컬 검증으로 빠름,
   * 없으면 내부적으로 getUser 폴백). 서명은 항상 검증되므로 위조는 불가하나,
   * 이미 발급된 토큰은 만료(기본 ~1h) 전까지 통과한다.
   */
  strict?: boolean;
};

function unauthorized(): AuthResult {
  return {
    success: false,
    response: Response.json(
      { error: { code: "UNAUTHORIZED", message: "인증이 필요합니다." } },
      { status: 401 }
    ),
  };
}

export async function requireAuth(
  { strict = false }: RequireAuthOptions = {}
): Promise<AuthResult> {
  const supabase = await createClient();

  if (strict) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return unauthorized();
    return { success: true, userId: user.id, email: user.email ?? "" };
  }

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return unauthorized();
  return {
    success: true,
    userId: claims.sub as string,
    email: (claims.email as string) ?? "",
  };
}
