import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateAnnouncementSchema } from "@/lib/validators/announcement";
import { toAnnouncementResponse } from "@/lib/api/mappers";

// PATCH /api/announcements/[id] — 공지사항 수정 (관리자 전용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.success) return admin.response;

  const { id } = await params;

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

  const parsed = updateAnnouncementSchema.safeParse(body);
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

  const updates: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.content !== undefined) updates.content = parsed.data.content;
  if (parsed.data.isPublished !== undefined)
    updates.is_published = parsed.data.isPublished;

  if (Object.keys(updates).length === 0) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "수정할 항목이 없습니다.",
        },
      },
      { status: 400 },
    );
  }

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from("announcements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return Response.json(
      {
        error: { code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." },
      },
      { status: 404 },
    );
  }

  return Response.json(toAnnouncementResponse(data));
}

// DELETE /api/announcements/[id] — 공지사항 삭제 (관리자 전용)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin.success) return admin.response;

  const { id } = await params;

  const adminSupabase = createAdminClient();
  const { error, count } = await adminSupabase
    .from("announcements")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "공지사항 삭제에 실패했습니다.",
        },
      },
      { status: 500 },
    );
  }

  if (count === 0) {
    return Response.json(
      {
        error: { code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." },
      },
      { status: 404 },
    );
  }

  return new Response(null, { status: 204 });
}
