import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { updateLinkSchema } from "@/lib/validators/link";
import { toLinkResponse } from "@/lib/api/mappers";

// PATCH /api/links/[id] — 링크 수정 (is_read 토글 등)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "잘못된 요청 형식입니다." } },
      { status: 400 }
    );
  }

  const parsed = updateLinkSchema.safeParse(body);
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

  const updates: Record<string, unknown> = {};
  if (parsed.data.isRead !== undefined) {
    updates.is_read = parsed.data.isRead;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "수정할 항목이 없습니다." } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .eq("user_id", auth.userId)
    .select()
    .single();

  if (error || !data) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "링크를 찾을 수 없습니다." } },
      { status: 404 }
    );
  }

  return Response.json(toLinkResponse(data));
}

// DELETE /api/links/[id] — 링크 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { id } = await params;

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("links")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "링크 삭제에 실패했습니다." } },
      { status: 500 }
    );
  }

  if (count === 0) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "링크를 찾을 수 없습니다." } },
      { status: 404 }
    );
  }

  return new Response(null, { status: 204 });
}
