import { createClient } from "@supabase/supabase-js";

/**
 * Service Role Key 기반 Supabase 클라이언트.
 * RLS를 우회하므로 서버사이드 백그라운드 작업(after 콜백 등)에서만 사용할 것.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다.",
    );
  }
  return createClient(url, key);
}
