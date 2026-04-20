import { NextRequest, after } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { checkDailyLinkLimit } from "@/lib/api/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLinkSchema, listLinksQuerySchema } from "@/lib/validators/link";
import { detectContentType } from "@/lib/utils/url";
import { toLinkResponse } from "@/lib/api/mappers";
import { runSummaryPipeline } from "@/lib/summarize/pipeline";

// POST /api/links — 링크 저장
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "잘못된 요청 형식입니다." } },
      { status: 400 }
    );
  }

  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        },
      },
      { status: 400 }
    );
  }

  const { url, title } = parsed.data;
  const contentType = detectContentType(url);

  const supabase = await createClient();

  // Rate limit: 최근 24시간 동안 DAILY_LINK_LIMIT 개 초과 시 차단
  // 카운트 조회 실패 시에는 fail-open 으로 저장을 허용한다 (가용성 우선)
  try {
    const rate = await checkDailyLinkLimit(supabase, auth.userId);
    if (!rate.allowed) {
      return Response.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: `하루 저장 한도(${rate.limit}개)를 초과했습니다. 잠시 후 다시 시도해주세요.`,
          },
        },
        { status: 429 },
      );
    }
  } catch (rateError) {
    console.warn("[rate-limit] 카운트 조회 실패, 저장은 허용:", rateError);
  }

  const { data, error } = await supabase
    .from("links")
    .insert({
      user_id: auth.userId,
      url,
      title: title ?? null,
      content_type: contentType,
    })
    .select()
    .single();

  if (error) {
    // unique constraint 위반 (중복 URL)
    if (error.code === "23505") {
      return Response.json(
        { error: { code: "DUPLICATE_URL", message: "이미 저장된 링크입니다." } },
        { status: 409 }
      );
    }
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "링크 저장에 실패했습니다." } },
      { status: 500 }
    );
  }

  // 백그라운드에서 요약 파이프라인 실행
  after(async () => {
    try {
      const adminSupabase = createAdminClient();
      await runSummaryPipeline(data.id, auth.userId, url, adminSupabase);
    } catch (error) {
      console.error(
        `[after] 요약 파이프라인 실행 실패 (linkId: ${data.id}):`,
        error,
      );
      try {
        const fallbackSupabase = await createClient();
        await fallbackSupabase
          .from("links")
          .update({ status: "crawl_failed" })
          .eq("id", data.id);
      } catch {
        // 안전망 업데이트 실패 — 무시
      }
    }
  });

  return Response.json(toLinkResponse(data), { status: 201 });
}

// GET /api/links — 링크 목록 조회 (cursor 페이지네이션)
export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = listLinksQuerySchema.safeParse(params);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        },
      },
      { status: 400 }
    );
  }

  const { cursor, limit, status, isRead } = parsed.data;

  const supabase = await createClient();
  let query = supabase
    .from("links")
    .select("*")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1); // hasMore 판단용

  if (status) {
    query = query.eq("status", status);
  }
  if (isRead !== undefined) {
    query = query.eq("is_read", isRead);
  }
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "링크 목록 조회에 실패했습니다." } },
      { status: 500 }
    );
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1]?.created_at ?? null : null;

  return Response.json({
    data: items.map(toLinkResponse),
    nextCursor,
    hasMore,
  });
}
