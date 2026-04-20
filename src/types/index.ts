// --- User ---

export type LlmProvider = "openai" | "anthropic" | "google";

export type LlmSettings = {
  provider: LlmProvider | null;
  apiKey: string | null;
  model: string | null;
};

export type NewsletterSettings = {
  enabled: boolean;
  email: string | null;
  dayOfWeek: number; // 1(월) ~ 7(일)
  hour: number; // 0 ~ 23
  timezone: string;
};

export type SlackSettings = {
  enabled: boolean;
  webhookUrl: string | null;
};

export type TelegramSettings = {
  enabled: boolean;
  botToken: string | null;
  chatId: string | null;
};

export type NotificationSettings = {
  slack: SlackSettings;
  telegram: TelegramSettings;
};

export type SettingsResponse = {
  llmSettings: LlmSettings;
  newsletterSettings: NewsletterSettings;
  notificationSettings: NotificationSettings;
  // 본인 키 미설정 상태에서 환경변수 fallback(예: 무료 Gemini)으로 AI 요약이 동작 중인지 여부
  isUsingFreeAi: boolean;
};

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  llmSettings: LlmSettings;
  newsletterSettings: NewsletterSettings;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
};

// --- Link ---

export type LinkStatus =
  | "pending"
  | "completed"
  | "basic_summary"
  | "summary_pending"
  | "llm_failed"
  | "crawl_failed";

export type ContentType = "article" | "youtube";

export type Link = {
  id: string;
  userId: string;
  url: string;
  title: string | null;
  thumbnailUrl: string | null;
  contentType: ContentType;
  oneLineSummary: string | null;
  keyPoints: string[] | null;
  estimatedReadTime: number | null;
  status: LinkStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

// --- Announcement ---

export type Announcement = {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

// --- API Response ---

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "DUPLICATE_URL"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export type ApiError = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
};
