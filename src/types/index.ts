// --- User ---

export type LlmProvider = "openai" | "anthropic" | "google";

export type LlmSettings = {
  provider: LlmProvider;
  model: string;
  apiKey: string;
};

export type NewsletterDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type NewsletterSettings = {
  enabled: boolean;
  day: NewsletterDay;
  time: string; // "HH:mm" 형식
};

export type NotificationChannel = "slack" | "telegram";

export type NotificationSettings = {
  enabled: boolean;
  channel: NotificationChannel | null;
  webhookUrl: string;
  digestEnabled: boolean;
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

export type LinkStatus = "pending" | "processing" | "completed" | "failed";

export type ContentType = "article" | "video" | "pdf" | "other";

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
