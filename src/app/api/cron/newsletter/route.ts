import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toLinkResponse } from "@/lib/api/mappers";
import { sendNewsletter, type SendResult } from "@/lib/email/send-newsletter";
import { parseNotificationSettings, sendNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron에 의해 매시 정각 호출.
 * 현재 시간에 뉴스레터 발송이 예정된 사용자를 찾아 이메일을 발송한다.
 */
export async function GET(request: Request) {
  // CRON_SECRET 검증
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "유효하지 않은 인증입니다." } },
      { status: 401 },
    );
  }

  const supabase = createAdminClient();

  // 뉴스레터 활성화 + 이메일 설정된 사용자 조회
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, email, display_name, newsletter_settings, notification_settings")
    .filter("newsletter_settings->>enabled", "eq", "true")
    .not("newsletter_settings->>email", "is", null);

  if (usersError) {
    console.error("[newsletter-cron] 사용자 조회 실패:", usersError.message);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: usersError.message } },
      { status: 500 },
    );
  }

  console.log(`[newsletter-cron] 뉴스레터 활성 사용자: ${users?.length ?? 0}명`);

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, failed: 0 });
  }

  // 현재 UTC 시간 기준으로 각 사용자의 타임존 매칭
  const now = new Date();
  const eligible = users.filter((user) => {
    const settings = user.newsletter_settings as {
      enabled: boolean;
      email: string | null;
      day_of_week: number;
      hour: number;
      timezone: string;
    };

    if (!settings.enabled || !settings.email) return false;

    try {
      return isMatchingTime(now, settings.timezone, settings.day_of_week, settings.hour);
    } catch {
      console.warn(
        `[newsletter-cron] 잘못된 타임존 (user=${user.id}): ${settings.timezone}`,
      );
      return false;
    }
  });

  console.log(`[newsletter-cron] 현재 시간: ${now.toISOString()}, 매칭 사용자: ${eligible.length}명`);

  if (eligible.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, failed: 0 });
  }

  // 각 사용자별 링크 조회 + 발송
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const results: SendResult[] = [];

  const tasks = eligible.map(async (user) => {
    const settings = user.newsletter_settings as {
      email: string;
    };

    const { data: rows, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false });

    if (linksError) {
      console.error(
        `[newsletter-cron] 링크 조회 실패 (user=${user.id}):`,
        linksError.message,
      );
      return { status: "failed" as const, error: linksError.message };
    }

    const links = (rows ?? []).map((row) =>
      toLinkResponse(row as Record<string, unknown>),
    );

    const userName = user.display_name ?? user.email ?? "사용자";

    const emailResult = await sendNewsletter({
      email: settings.email,
      userName,
      links,
    });

    // Slack/Telegram 다이제스트 발송
    const notifSettings = parseNotificationSettings(
      user.notification_settings as Record<string, unknown> | null,
    );

    if (notifSettings) {
      const sevenDaysAgoDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const notifyResult = await sendNotification(notifSettings, {
        kind: "digest",
        userName,
        links,
        dateRange: {
          from: sevenDaysAgoDate.toISOString().split("T")[0],
          to: now.toISOString().split("T")[0],
        },
      });
      console.log(`[newsletter-cron] 알림 발송 결과 (user=${user.id}):`, notifyResult);
    }

    return emailResult;
  });

  const settled = await Promise.allSettled(tasks);

  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    } else {
      results.push({
        status: "failed",
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  }

  const counts = {
    sent: results.filter((r) => r.status === "sent").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    failed: results.filter((r) => r.status === "failed").length,
  };

  console.log(`[newsletter-cron] 완료: sent=${counts.sent}, skipped=${counts.skipped}, failed=${counts.failed}`);

  return NextResponse.json(counts);
}

/**
 * 현재 UTC 시간을 지정된 타임존으로 변환한 뒤,
 * 해당 로컬 시간의 요일과 시간이 설정값과 일치하는지 확인.
 *
 * dayOfWeek: 1(월) ~ 7(일) (ISO 형식)
 * hour: 0 ~ 23
 */
function isMatchingTime(
  now: Date,
  timezone: string,
  dayOfWeek: number,
  hour: number,
): boolean {
  const localStr = now.toLocaleString("en-US", { timeZone: timezone });
  const local = new Date(localStr);

  // JS getDay(): 0=일 ~ 6=토 → ISO: 1=월 ~ 7=일
  const jsDay = local.getDay();
  const isoDay = jsDay === 0 ? 7 : jsDay;
  const localHour = local.getHours();

  return isoDay === dayOfWeek && localHour === hour;
}
