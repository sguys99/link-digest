import type { SupabaseClient } from "@supabase/supabase-js";
import { scrape } from "@/lib/scraper";
import { summarize } from "@/lib/llm";
import { resolveLlmConfig } from "@/lib/llm/config";
import { extractBasicSummary } from "@/lib/summarize/basic";
import { parseNotificationSettings, sendNotification } from "@/lib/notifications";
import type { Link } from "@/types";

/**
 * 링크 요약 파이프라인: 크롤링 → LLM 요약 → DB 업데이트.
 * after() 콜백에서 호출되며, 모든 에러를 내부적으로 처리한다.
 */
export async function runSummaryPipeline(
  linkId: string,
  userId: string,
  url: string,
  supabase: SupabaseClient,
): Promise<void> {
  try {
    await executePipeline(linkId, userId, url, supabase);
  } catch (error: unknown) {
    // 최종 안전망: 예기치 않은 에러 시 crawl_failed로 업데이트
    console.error(
      `[SummaryPipeline] 예기치 않은 오류 (linkId: ${linkId}):`,
      error,
    );
    try {
      await supabase
        .from("links")
        .update({ status: "crawl_failed" })
        .eq("id", linkId);
    } catch {
      // DB 업데이트 실패도 무시
    }
  }
}

async function executePipeline(
  linkId: string,
  userId: string,
  url: string,
  supabase: SupabaseClient,
): Promise<void> {
  // 1. 크롤링
  let scraped;
  try {
    scraped = await scrape(url);
  } catch (error: unknown) {
    console.error(`[SummaryPipeline] 크롤링 실패 (linkId: ${linkId}):`, error);
    await supabase
      .from("links")
      .update({ status: "crawl_failed" })
      .eq("id", linkId);
    return;
  }

  // 2. LLM 설정 조회
  const { data: user } = await supabase
    .from("users")
    .select("llm_settings, notification_settings")
    .eq("id", userId)
    .single();

  const llmConfig = resolveLlmConfig(
    (user?.llm_settings as Record<string, unknown>) ?? null,
  );

  if (!llmConfig) {
    // LLM 키 없음 — 룰 기반 기본 요약으로 폴백
    console.warn(
      `[SummaryPipeline] LLM 설정 없음 (userId: ${userId}), basic_summary로 전환`,
    );
    const basic = extractBasicSummary(scraped);
    await supabase
      .from("links")
      .update({
        title: scraped.title,
        thumbnail_url: scraped.thumbnailUrl,
        one_line_summary: basic.oneLineSummary,
        estimated_read_time: basic.estimatedReadTime,
        status: "basic_summary",
      })
      .eq("id", linkId);
    return;
  }

  // 3. LLM 요약 (1회 재시도)
  let summaryResult;
  try {
    summaryResult = await summarize(scraped, url, llmConfig);
  } catch (firstError: unknown) {
    console.warn(
      `[SummaryPipeline] LLM 1차 시도 실패 (linkId: ${linkId}), 재시도 중:`,
      firstError,
    );
    try {
      summaryResult = await summarize(scraped, url, llmConfig);
    } catch (secondError: unknown) {
      console.error(
        `[SummaryPipeline] LLM 재시도 실패 (linkId: ${linkId}):`,
        secondError,
      );
      // 룰 기반 기본 요약으로 폴백, LLM 재시도 가능성 표시
      const basic = extractBasicSummary(scraped);
      await supabase
        .from("links")
        .update({
          title: scraped.title,
          thumbnail_url: scraped.thumbnailUrl,
          one_line_summary: basic.oneLineSummary,
          estimated_read_time: basic.estimatedReadTime,
          status: "summary_pending",
        })
        .eq("id", linkId);
      return;
    }
  }

  // 4. DB 업데이트: completed
  await supabase
    .from("links")
    .update({
      title: summaryResult.title,
      thumbnail_url: scraped.thumbnailUrl,
      one_line_summary: summaryResult.oneLineSummary,
      key_points: summaryResult.keyPoints,
      estimated_read_time: summaryResult.estimatedReadTime,
      status: "completed",
    })
    .eq("id", linkId);

  // 5. 알림 발송
  const notificationSettings = parseNotificationSettings(
    user?.notification_settings as Record<string, unknown> | null,
  );

  if (notificationSettings) {
    const linkPayload: Link = {
      id: linkId,
      userId,
      url,
      title: summaryResult.title,
      thumbnailUrl: scraped.thumbnailUrl,
      contentType: "article",
      oneLineSummary: summaryResult.oneLineSummary,
      keyPoints: summaryResult.keyPoints,
      estimatedReadTime: summaryResult.estimatedReadTime,
      status: "completed",
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const notifyResult = await sendNotification(notificationSettings, {
      kind: "summary",
      link: linkPayload,
    });
    console.log(`[SummaryPipeline] 알림 발송 결과 (linkId: ${linkId}):`, notifyResult);
  }
}
