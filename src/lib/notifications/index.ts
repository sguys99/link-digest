// 알림 디스패처 — 사용자 설정에 따라 활성화된 채널로 알림 발송

import type { NotificationSettings } from "@/types";
import { sendSlackNotification } from "./slack";
import { sendTelegramNotification } from "./telegram";
import type { NotificationPayload, NotifyResult, NotifySendResult } from "./types";

/** DB의 snake_case notification_settings JSONB → NotificationSettings 변환 */
export function parseNotificationSettings(
  raw: Record<string, unknown> | null | undefined,
): NotificationSettings | null {
  if (!raw) return null;

  const slack = (raw.slack ?? {}) as Record<string, unknown>;
  const telegram = (raw.telegram ?? {}) as Record<string, unknown>;

  return {
    slack: {
      enabled: (slack.enabled as boolean) ?? false,
      webhookUrl: (slack.webhook_url as string) ?? null,
    },
    telegram: {
      enabled: (telegram.enabled as boolean) ?? false,
      botToken: (telegram.bot_token as string) ?? null,
      chatId: (telegram.chat_id as string) ?? null,
    },
  };
}

/** 활성화된 모든 채널로 알림 발송 (실패해도 throw하지 않음) */
export async function sendNotification(
  settings: NotificationSettings,
  payload: NotificationPayload,
): Promise<NotifyResult> {
  const [slackResult, telegramResult] = await Promise.allSettled([
    sendSlackNotification(settings.slack, payload),
    sendTelegramNotification(settings.telegram, payload),
  ]);

  const toResult = (settled: PromiseSettledResult<NotifySendResult>): NotifySendResult => {
    if (settled.status === "fulfilled") return settled.value;
    const error = settled.reason instanceof Error ? settled.reason.message : String(settled.reason);
    return { status: "failed", error };
  };

  const result: NotifyResult = {
    slack: toResult(slackResult),
    telegram: toResult(telegramResult),
  };

  // 실패 로그
  if (result.slack.status === "failed") {
    console.error("[Notification] Slack 발송 실패:", result.slack.error);
  }
  if (result.telegram.status === "failed") {
    console.error("[Notification] Telegram 발송 실패:", result.telegram.error);
  }

  return result;
}
