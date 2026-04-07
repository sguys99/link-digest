// 알림 페이로드 및 결과 타입 정의

import type { Link } from "@/types";

/** 단일 링크 요약 완료 알림 */
export type SummaryNotificationPayload = {
  kind: "summary";
  link: Link;
};

/** 주간 다이제스트 알림 */
export type DigestNotificationPayload = {
  kind: "digest";
  userName: string;
  links: Link[];
  dateRange: { from: string; to: string };
};

/** 알림 페이로드 (discriminated union) */
export type NotificationPayload =
  | SummaryNotificationPayload
  | DigestNotificationPayload;

/** 개별 채널 발송 결과 */
export type NotifySendResult =
  | { status: "sent" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

/** 전체 채널 발송 결과 */
export type NotifyResult = {
  slack: NotifySendResult;
  telegram: NotifySendResult;
};
