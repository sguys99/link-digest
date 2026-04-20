import type { SupabaseClient } from "@supabase/supabase-js";

// 링크 저장 일일 한도 (rolling 24시간 window 기준)
export const DAILY_LINK_LIMIT = 50;
// 본인 키 없이 환경변수 무료 fallback(예: 무료 Gemini)으로 동작 중인 사용자 한도 — 쿼터 보호용
export const DAILY_LINK_LIMIT_FREE = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
};

/**
 * 최근 24시간 동안 사용자가 저장한 링크 수를 조회해 한도 초과 여부를 반환.
 * 타임존 독립적이며 자정 직후 연속 저장으로 한도를 우회할 수 없음.
 */
export async function checkDailyLinkLimit(
  supabase: SupabaseClient,
  userId: string,
  limit: number = DAILY_LINK_LIMIT,
): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("links")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    throw new Error(`rate-limit 카운트 조회 실패: ${error.message}`);
  }

  const current = count ?? 0;
  return {
    allowed: current < limit,
    count: current,
    limit,
  };
}
