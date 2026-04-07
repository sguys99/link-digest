import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { toLinkResponse } from "@/lib/api/mappers";
import { renderNewsletterHtml } from "@/lib/email/templates/newsletter";

/** 인증된 사용자의 최근 7일 링크로 뉴스레터 미리보기 HTML을 반환한다. */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const supabase = await createClient();

  // 사용자 정보 조회
  const { data: user } = await supabase
    .from("users")
    .select("display_name, email")
    .eq("id", auth.userId)
    .single();

  // 최근 7일 완료된 링크 조회
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: rows } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", auth.userId)
    .eq("status", "completed")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  const links = (rows ?? []).map((row) =>
    toLinkResponse(row as Record<string, unknown>),
  );

  const now = new Date();
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const html = renderNewsletterHtml({
    userName: user?.display_name ?? user?.email ?? "사용자",
    links,
    dateRange: {
      from: formatDate(from),
      to: formatDate(now),
    },
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
