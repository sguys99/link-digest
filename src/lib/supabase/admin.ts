import { createClient } from "@supabase/supabase-js";

/**
 * Service Role Key 기반 Supabase 클라이언트.
 * RLS를 우회하므로 서버사이드 백그라운드 작업(after 콜백 등)에서만 사용할 것.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
