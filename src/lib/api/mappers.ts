import type {
  Announcement,
  Link,
  ContentType,
  LinkStatus,
  LlmProvider,
  LlmSettings,
  NewsletterSettings,
  NotificationSettings,
  SettingsResponse,
} from "@/types";

// --- 비밀값 마스킹 ---

/** 비밀 값을 마스킹 (앞3자 + ... + 뒤4자, 8자 미만이면 ****) */
export function maskSecret(value: string | null | undefined): string | null {
  if (!value || value.length === 0) return null;
  if (value.length < 8) return "****";
  return `${value.slice(0, 3)}...${value.slice(-4)}`;
}

/** 마스킹된 값인지 판별 (... 포함 여부) */
export function isMaskedValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return value === "****" || value.includes("...");
}

// --- Settings 매퍼 ---

/** DB row → SettingsResponse (마스킹 적용) */
export function toSettingsResponse(
  row: Record<string, unknown>,
  isUsingFreeAi: boolean,
): SettingsResponse {
  const llm = (row.llm_settings ?? {}) as Record<string, unknown>;
  const newsletter = (row.newsletter_settings ?? {}) as Record<string, unknown>;
  const notification = (row.notification_settings ?? {}) as Record<
    string,
    unknown
  >;

  const slack = (notification.slack ?? {}) as Record<string, unknown>;
  const telegram = (notification.telegram ?? {}) as Record<string, unknown>;

  return {
    llmSettings: {
      provider: (llm.provider as LlmProvider) ?? null,
      apiKey: maskSecret(llm.api_key as string | null),
      model: (llm.model as string) ?? null,
    },
    newsletterSettings: {
      enabled: (newsletter.enabled as boolean) ?? true,
      email: (newsletter.email as string) ?? null,
      dayOfWeek: (newsletter.day_of_week as number) ?? 1,
      hour: (newsletter.hour as number) ?? 8,
      timezone: (newsletter.timezone as string) ?? "Asia/Seoul",
    },
    notificationSettings: {
      slack: {
        enabled: (slack.enabled as boolean) ?? false,
        webhookUrl: maskSecret(slack.webhook_url as string | null),
      },
      telegram: {
        enabled: (telegram.enabled as boolean) ?? false,
        botToken: maskSecret(telegram.bot_token as string | null),
        chatId: (telegram.chat_id as string) ?? null,
      },
    },
    isUsingFreeAi,
  };
}

/** 클라이언트 입력 + 현재 DB 값 → DB UPDATE 페이로드 */
export function toSettingsDbPayload(
  input: {
    llmSettings?: LlmSettings;
    newsletterSettings?: NewsletterSettings;
    notificationSettings?: NotificationSettings;
  },
  current: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (input.llmSettings) {
    const curLlm = (current.llm_settings ?? {}) as Record<string, unknown>;
    payload.llm_settings = {
      provider: input.llmSettings.provider,
      api_key: isMaskedValue(input.llmSettings.apiKey)
        ? curLlm.api_key
        : input.llmSettings.apiKey,
      model: input.llmSettings.model,
    };
  }

  if (input.newsletterSettings) {
    payload.newsletter_settings = {
      enabled: input.newsletterSettings.enabled,
      email: input.newsletterSettings.email,
      day_of_week: input.newsletterSettings.dayOfWeek,
      hour: input.newsletterSettings.hour,
      timezone: input.newsletterSettings.timezone,
    };
  }

  if (input.notificationSettings) {
    const curNotif = (current.notification_settings ?? {}) as Record<
      string,
      unknown
    >;
    const curSlack = (curNotif.slack ?? {}) as Record<string, unknown>;
    const curTelegram = (curNotif.telegram ?? {}) as Record<string, unknown>;

    payload.notification_settings = {
      slack: {
        enabled: input.notificationSettings.slack.enabled,
        webhook_url: isMaskedValue(input.notificationSettings.slack.webhookUrl)
          ? curSlack.webhook_url
          : input.notificationSettings.slack.webhookUrl,
      },
      telegram: {
        enabled: input.notificationSettings.telegram.enabled,
        bot_token: isMaskedValue(input.notificationSettings.telegram.botToken)
          ? curTelegram.bot_token
          : input.notificationSettings.telegram.botToken,
        chat_id: input.notificationSettings.telegram.chatId,
      },
    };
  }

  return payload;
}

// --- Link 매퍼 ---

// --- Announcement 매퍼 ---

/** Supabase 응답(snake_case)을 Announcement 타입(camelCase)으로 변환 */
export function toAnnouncementResponse(
  row: Record<string, unknown>,
): Announcement {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    isPublished: row.is_published as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// --- Link 매퍼 ---

/** Supabase 응답(snake_case)을 Link 타입(camelCase)으로 변환 */
export function toLinkResponse(row: Record<string, unknown>): Link {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    url: row.url as string,
    title: (row.title as string) ?? null,
    thumbnailUrl: (row.thumbnail_url as string) ?? null,
    contentType: row.content_type as ContentType,
    oneLineSummary: (row.one_line_summary as string) ?? null,
    keyPoints: (row.key_points as string[]) ?? null,
    estimatedReadTime: (row.estimated_read_time as number) ?? null,
    status: row.status as LinkStatus,
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
