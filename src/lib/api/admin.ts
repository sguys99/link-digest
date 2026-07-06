import { requireAuth } from "@/lib/api/auth";

type AdminResult =
  | { success: true; userId: string; email: string }
  | { success: false; response: Response };

export async function requireAdmin(): Promise<AdminResult> {
  // 공지 쓰기/삭제는 이후 createAdminClient(service-role, RLS 우회)로 이어지는
  // 최고권한 경로 — 세션 폐기 즉시 반영을 위해 strict(getUser) 재검증.
  const auth = await requireAuth({ strict: true });
  if (!auth.success) return auth;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || auth.email !== adminEmail) {
    return {
      success: false,
      response: Response.json(
        { error: { code: "FORBIDDEN", message: "관리자 권한이 필요합니다." } },
        { status: 403 },
      ),
    };
  }

  return auth;
}
