// Telegram Bot API 알림 발송 모듈

import type { Link, TelegramSettings } from "@/types";
import type {
  DigestNotificationPayload,
  NotificationPayload,
  NotifySendResult,
} from "./types";

const TELEGRAM_API_BASE = "https://api.telegram.org";

/** Telegram HTML 모드 이스케이프 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 요약 완료 알림 메시지 (HTML 포맷) */
function formatSummaryMessage(link: Link): string {
  const title = escapeHtml(link.title ?? "제목 없음");
  const summary = link.oneLineSummary ? escapeHtml(link.oneLineSummary) : "요약 없음";

  let message = `🔗 <b>새 링크 요약 완료</b>\n\n`;
  message += `<b><a href="${link.url}">${title}</a></b>\n`;
  message += `${summary}\n`;

  if (link.keyPoints && link.keyPoints.length > 0) {
    message += `\n`;
    for (const point of link.keyPoints) {
      message += `• ${escapeHtml(point)}\n`;
    }
  }

  if (link.estimatedReadTime) {
    message += `\n⏱ 읽기 시간: 약 ${link.estimatedReadTime}분`;
  }

  return message;
}

/** 주간 다이제스트 메시지 (HTML 포맷) */
function formatDigestMessage(payload: DigestNotificationPayload): string {
  const { userName, links, dateRange } = payload;
  const MAX_LINKS = 20;

  let message = `📬 <b>${escapeHtml(userName)}님의 주간 링크 다이제스트</b>\n`;
  message += `${dateRange.from} ~ ${dateRange.to} | ${links.length}개 링크\n\n`;

  const displayed = links.slice(0, MAX_LINKS);
  for (let i = 0; i < displayed.length; i++) {
    const link = displayed[i];
    const title = escapeHtml(link.title ?? "제목 없음");
    const summary = link.oneLineSummary ? escapeHtml(link.oneLineSummary) : "";
    message += `${i + 1}. <a href="${link.url}">${title}</a>\n`;
    if (summary) {
      message += `   ${summary}\n`;
    }
  }

  if (links.length > MAX_LINKS) {
    message += `\n...외 ${links.length - MAX_LINKS}개 링크`;
  }

  // Telegram 메시지 길이 제한 (4096자)
  if (message.length > 4096) {
    message = message.slice(0, 4090) + "\n...";
  }

  return message;
}

/** Telegram Bot API로 알림 발송 */
export async function sendTelegramNotification(
  settings: TelegramSettings,
  payload: NotificationPayload,
): Promise<NotifySendResult> {
  if (!settings.enabled || !settings.botToken || !settings.chatId) {
    return { status: "skipped", reason: "Telegram 알림 비활성화 또는 설정 미완료" };
  }

  try {
    const text =
      payload.kind === "summary"
        ? formatSummaryMessage(payload.link)
        : formatDigestMessage(payload);

    const url = `${TELEGRAM_API_BASE}/bot${settings.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      const description = result.description ?? `HTTP ${response.status}`;
      return { status: "failed", error: `Telegram API 실패: ${description}` };
    }

    return { status: "sent" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "failed", error: `Telegram 발송 오류: ${message}` };
  }
}
