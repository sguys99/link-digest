import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api/admin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createAnnouncementSchema,
  listAnnouncementsQuerySchema,
} from "@/lib/validators/announcement";
import { toAnnouncementResponse } from "@/lib/api/mappers";

// GET /api/announcements — 공지사항 목록 조회 (공개)
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = listAnnouncementsQuerySchema.safeParse(params);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message:
            parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        },
      },
      { status: 400 },
    );
  }

  const { cursor, limit } = parsed.data;

  const supabase = await createClient();
  let query = supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "공지사항 목록 조회에 실패했습니다.",
        },
      },
      { status: 500 },
    );
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore
    ? (items[items.length - 1]?.created_at ?? null)
    : null;

  return Response.json({
    data: items.map(toAnnouncementResponse),
    nextCursor,
    hasMore,
  });
}

// POST /api/announcements — 공지사항 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.success) return admin.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "잘못된 요청 형식입니다.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = createAnnouncementSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message:
            parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        },
      },
      { status: 400 },
    );
  }

  const { title, content } = parsed.data;
  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase
    .from("announcements")
    .insert({ title, content })
    .select()
    .single();

  if (error) {
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "공지사항 생성에 실패했습니다.",
        },
      },
      { status: 500 },
    );
  }

  return Response.json(toAnnouncementResponse(data), { status: 201 });
}
