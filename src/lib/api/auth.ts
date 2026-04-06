import { createClient } from "@/lib/supabase/server";

type AuthResult =
  | { success: true; userId: string }
  | { success: false; response: Response };

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false,
      response: Response.json(
        { error: { code: "UNAUTHORIZED", message: "인증이 필요합니다." } },
        { status: 401 }
      ),
    };
  }

  return { success: true, userId: user.id };
}
