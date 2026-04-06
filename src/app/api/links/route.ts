import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { createLinkSchema, listLinksQuerySchema } from "@/lib/validators/link";
import { detectContentType } from "@/lib/utils/url";
import { toLinkResponse } from "@/lib/api/mappers";

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
