import type { Link } from "@/types";
import { getResendClient, getFromEmail } from "./resend";
import {
  renderNewsletterHtml,
  renderNewsletterText,
  type NewsletterData,
} from "./templates/newsletter";

export type SendResult =
  | { status: "sent"; emailId: string }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

type SendNewsletterParams = {
  email: string;
  userName: string;
  links: Link[];
};

/** 특정 사용자에게 주간 뉴스레터를 발송한다. 링크 0개면 스킵. */
export async function sendNewsletter(
  params: SendNewsletterParams,
): Promise<SendResult> {
  const { email, userName, links } = params;

  if (links.length === 0) {
    return { status: "skipped", reason: "링크 없음" };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const data: NewsletterData = {
    userName,
    links,
    dateRange: {
      from: formatDate(sevenDaysAgo),
      to: formatDate(now),
    },
  };

  const html = renderNewsletterHtml(data);
  const text = renderNewsletterText(data);

  try {
    const resend = getResendClient();
    const { data: result, error } = await resend.emails.send({
      from: `LinkDigest <${getFromEmail()}>`,
      to: email,
      subject: `📬 LinkDigest 주간 다이제스트 (${data.dateRange.from} ~ ${data.dateRange.to})`,
      html,
      text,
    });

    if (error) {
      return { status: "failed", error: error.message };
    }

    return { status: "sent", emailId: result?.id ?? "unknown" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "failed", error: message };
  }
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
