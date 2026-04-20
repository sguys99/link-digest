import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { updateSettingsSchema } from "@/lib/validators/settings";
import { toSettingsResponse, toSettingsDbPayload } from "@/lib/api/mappers";
import { isUsingEnvFallback } from "@/lib/llm/config";

// GET /api/settings — 현재 설정 조회
export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("llm_settings, newsletter_settings, notification_settings")
    .eq("id", auth.userId)
    .single();

  if (error || !data) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "설정 조회에 실패했습니다." } },
      { status: 500 },
    );
  }

  const isFree = isUsingEnvFallback(
    (data.llm_settings as Record<string, unknown>) ?? null,
  );
  return Response.json(toSettingsResponse(data, isFree));
}

// PUT /api/settings — 설정 업데이트
export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

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

  const parsed = updateSettingsSchema.safeParse(body);
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

  const supabase = await createClient();

  // 현재 DB 값 조회 (비밀값 보존용)
  const { data: current, error: fetchError } = await supabase
    .from("users")
    .select("llm_settings, newsletter_settings, notification_settings")
    .eq("id", auth.userId)
    .single();

  if (fetchError || !current) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "설정 조회에 실패했습니다." } },
      { status: 500 },
    );
  }

  const dbPayload = toSettingsDbPayload(parsed.data, current);

  const { error: updateError } = await supabase
    .from("users")
    .update(dbPayload)
    .eq("id", auth.userId);

  if (updateError) {
    return Response.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "설정 저장에 실패했습니다.",
        },
      },
      { status: 500 },
    );
  }

  // 업데이트된 설정 재조회
  const { data: updated, error: refetchError } = await supabase
    .from("users")
    .select("llm_settings, newsletter_settings, notification_settings")
    .eq("id", auth.userId)
    .single();

  if (refetchError || !updated) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "설정 조회에 실패했습니다." } },
      { status: 500 },
    );
  }

  const isFree = isUsingEnvFallback(
    (updated.llm_settings as Record<string, unknown>) ?? null,
  );
  return Response.json(toSettingsResponse(updated, isFree));
}
