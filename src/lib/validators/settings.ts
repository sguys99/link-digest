import { z } from "zod";

// LLM 설정
export const llmSettingsSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google"]).nullable(),
  apiKey: z.string().nullable(),
  model: z.string().max(100).nullable(),
});

// 뉴스레터 설정
export const newsletterSettingsSchema = z.object({
  enabled: z.boolean(),
  email: z
    .string()
    .email({ message: "유효한 이메일 형식이 아닙니다." })
    .nullable(),
  dayOfWeek: z
    .number()
    .int()
    .min(1, { message: "1(월) ~ 7(일) 범위여야 합니다." })
    .max(7, { message: "1(월) ~ 7(일) 범위여야 합니다." }),
  hour: z
    .number()
    .int()
    .min(0, { message: "0 ~ 23 범위여야 합니다." })
    .max(23, { message: "0 ~ 23 범위여야 합니다." }),
  timezone: z.string().min(1, { message: "타임존을 선택해주세요." }),
});

// Slack 설정
export const slackSettingsSchema = z.object({
  enabled: z.boolean(),
  webhookUrl: z
    .string()
    .url({ message: "유효한 URL 형식이 아닙니다." })
    .nullable(),
});

// Telegram 설정
export const telegramSettingsSchema = z.object({
  enabled: z.boolean(),
  botToken: z.string().nullable(),
  chatId: z.string().nullable(),
});

// 알림 설정 (Slack + Telegram)
export const notificationSettingsSchema = z.object({
  slack: slackSettingsSchema,
  telegram: telegramSettingsSchema,
});

// PUT /api/settings 요청 바디 — 각 섹션 optional
export const updateSettingsSchema = z.object({
  llmSettings: llmSettingsSchema.optional(),
  newsletterSettings: newsletterSettingsSchema.optional(),
  notificationSettings: notificationSettingsSchema.optional(),
});

export type LlmSettingsInput = z.infer<typeof llmSettingsSchema>;
export type NewsletterSettingsInput = z.infer<typeof newsletterSettingsSchema>;
export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
