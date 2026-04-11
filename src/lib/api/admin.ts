import { requireAuth } from "@/lib/api/auth";

type AdminResult =
  | { success: true; userId: string; email: string }
  | { success: false; response: Response };

export async function requireAdmin(): Promise<AdminResult> {
  const auth = await requireAuth();
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
