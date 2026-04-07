// Slack Incoming Webhook 알림 발송 모듈

import type { Link, SlackSettings } from "@/types";
import type {
  DigestNotificationPayload,
  NotificationPayload,
  NotifySendResult,
} from "./types";

/** 요약 완료 알림용 Block Kit 블록 */
function formatSummaryBlocks(link: Link): unknown[] {
  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🔗 새 링크 요약 완료",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*<${link.url}|${link.title ?? "제목 없음"}>*\n${link.oneLineSummary ?? "요약 없음"}`,
      },
    },
  ];

  if (link.keyPoints && link.keyPoints.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: link.keyPoints.map((p) => `• ${p}`).join("\n"),
      },
    });
  }

  if (link.estimatedReadTime) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `⏱ 읽기 시간: 약 ${link.estimatedReadTime}분`,
        },
      ],
    });
  }

  return blocks;
}

/** 주간 다이제스트용 Block Kit 블록 */
function formatDigestBlocks(payload: DigestNotificationPayload): unknown[] {
  const { userName, links, dateRange } = payload;
  const MAX_LINKS = 10;

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📬 ${userName}님의 주간 링크 다이제스트`,
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `${dateRange.from} ~ ${dateRange.to} | ${links.length}개 링크`,
        },
      ],
    },
    { type: "divider" },
  ];

  const displayed = links.slice(0, MAX_LINKS);
  for (const link of displayed) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*<${link.url}|${link.title ?? "제목 없음"}>*\n${link.oneLineSummary ?? ""}`,
      },
    });
  }

  if (links.length > MAX_LINKS) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `...외 ${links.length - MAX_LINKS}개 링크`,
        },
      ],
    });
  }

  return blocks;
}

/** Slack Incoming Webhook으로 알림 발송 */
export async function sendSlackNotification(
  settings: SlackSettings,
  payload: NotificationPayload,
): Promise<NotifySendResult> {
  if (!settings.enabled || !settings.webhookUrl) {
    return { status: "skipped", reason: "Slack 알림 비활성화 또는 webhook URL 미설정" };
  }

  try {
    const blocks =
      payload.kind === "summary"
        ? formatSummaryBlocks(payload.link)
        : formatDigestBlocks(payload);

    const response = await fetch(settings.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { status: "failed", error: `Slack webhook 실패 (${response.status}): ${text}` };
    }

    return { status: "sent" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "failed", error: `Slack 발송 오류: ${message}` };
  }
}
