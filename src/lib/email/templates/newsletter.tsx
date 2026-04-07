import type { Link } from "@/types";

// --- 템플릿 데이터 타입 ---

export type NewsletterData = {
  userName: string;
  links: Link[];
  dateRange: { from: string; to: string };
};

// --- 색상 상수 ---

const COLORS = {
  bg: "#ffffff",
  text: "#1a1a1a",
  muted: "#6b7280",
  border: "#e5e7eb",
  accent: "#2563eb",
  accentLight: "#eff6ff",
  badgeBg: "#f3f4f6",
  unreadBorder: "#2563eb",
  readBorder: "#e5e7eb",
} as const;

// --- 개별 링크 렌더링 ---

function renderLinkHtml(link: Link): string {
  const isUnread = !link.isRead;
  const borderColor = isUnread ? COLORS.unreadBorder : COLORS.readBorder;
  const opacity = isUnread ? "1" : "0.7";
  const badge = isUnread
    ? `<span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:${COLORS.accent};background:${COLORS.accentLight};border-radius:9999px;">안 읽음</span>`
    : `<span style="display:inline-block;padding:2px 8px;font-size:11px;color:${COLORS.muted};background:${COLORS.badgeBg};border-radius:9999px;">읽음</span>`;

  const contentTypeBadge =
    link.contentType === "youtube"
      ? `<span style="display:inline-block;padding:2px 8px;font-size:11px;color:#dc2626;background:#fef2f2;border-radius:9999px;margin-left:4px;">YouTube</span>`
      : "";

  const title = link.title ?? link.url;
  const summary = link.oneLineSummary ?? "";
  const readTime = link.estimatedReadTime
    ? `<span style="font-size:12px;color:${COLORS.muted};">📖 약 ${link.estimatedReadTime}분</span>`
    : "";

  const keyPointsHtml =
    link.keyPoints && link.keyPoints.length > 0
      ? `<ul style="margin:8px 0 0 0;padding-left:20px;color:${COLORS.text};font-size:13px;line-height:1.6;">
          ${link.keyPoints.map((point) => `<li style="margin-bottom:4px;">${escapeHtml(point)}</li>`).join("")}
        </ul>`
      : "";

  return `
    <div style="border:1px solid ${borderColor};border-left:3px solid ${borderColor};border-radius:8px;padding:16px;margin-bottom:12px;opacity:${opacity};">
      <div style="margin-bottom:8px;">
        ${badge}${contentTypeBadge}
        ${readTime ? `<span style="float:right;">${readTime}</span>` : ""}
      </div>
      <a href="${escapeHtml(link.url)}" style="font-size:15px;font-weight:600;color:${COLORS.text};text-decoration:none;line-height:1.4;" target="_blank">
        ${escapeHtml(title)}
      </a>
      ${summary ? `<p style="margin:8px 0 0 0;font-size:13px;color:${COLORS.muted};line-height:1.5;">${escapeHtml(summary)}</p>` : ""}
      ${keyPointsHtml}
      <div style="margin-top:12px;">
        <a href="${escapeHtml(link.url)}" style="display:inline-block;padding:6px 16px;font-size:13px;font-weight:500;color:${COLORS.accent};border:1px solid ${COLORS.accent};border-radius:6px;text-decoration:none;" target="_blank">
          원문 보기 →
        </a>
      </div>
    </div>`;
}

// --- 메인 HTML 렌더링 ---

export function renderNewsletterHtml(data: NewsletterData): string {
  const { userName, links, dateRange } = data;

  const unreadCount = links.filter((l) => !l.isRead).length;
  const readCount = links.length - unreadCount;

  const statsHtml = `
    <div style="background:${COLORS.accentLight};border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:${COLORS.text};">
      총 <strong>${links.length}</strong>개 링크 · 안 읽음 <strong>${unreadCount}</strong>개 · 읽음 <strong>${readCount}</strong>개
    </div>`;

  const linksHtml = links.map(renderLinkHtml).join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LinkDigest 주간 뉴스레터</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.badgeBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
    <!-- 헤더 -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-size:22px;font-weight:700;color:${COLORS.text};margin:0;">📬 LinkDigest</h1>
      <p style="font-size:13px;color:${COLORS.muted};margin:8px 0 0 0;">
        ${escapeHtml(dateRange.from)} ~ ${escapeHtml(dateRange.to)} 주간 다이제스트
      </p>
    </div>

    <!-- 본문 카드 -->
    <div style="background:${COLORS.bg};border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <p style="font-size:14px;color:${COLORS.text};margin:0 0 16px 0;">
        안녕하세요, <strong>${escapeHtml(userName)}</strong>님! 지난 한 주간 저장한 링크 요약입니다.
      </p>

      ${statsHtml}
      ${linksHtml}
    </div>

    <!-- 푸터 -->
    <div style="text-align:center;margin-top:24px;font-size:11px;color:${COLORS.muted};">
      <p style="margin:0;">이 이메일은 LinkDigest 뉴스레터 설정에 의해 발송되었습니다.</p>
      <p style="margin:4px 0 0 0;">설정 변경은 LinkDigest 앱의 설정 페이지에서 가능합니다.</p>
    </div>
  </div>
</body>
</html>`;
}

// --- 플레인 텍스트 렌더링 ---

export function renderNewsletterText(data: NewsletterData): string {
  const { userName, links, dateRange } = data;
  const unreadCount = links.filter((l) => !l.isRead).length;

  const lines: string[] = [
    `📬 LinkDigest 주간 다이제스트`,
    `${dateRange.from} ~ ${dateRange.to}`,
    ``,
    `안녕하세요, ${userName}님!`,
    `지난 한 주간 저장한 링크 ${links.length}개 (안 읽음 ${unreadCount}개) 요약입니다.`,
    ``,
    `---`,
  ];

  for (const link of links) {
    const status = link.isRead ? "[읽음]" : "[안 읽음]";
    const title = link.title ?? link.url;
    lines.push(``, `${status} ${title}`);
    lines.push(`  URL: ${link.url}`);
    if (link.oneLineSummary) {
      lines.push(`  요약: ${link.oneLineSummary}`);
    }
    if (link.keyPoints && link.keyPoints.length > 0) {
      for (const point of link.keyPoints) {
        lines.push(`  • ${point}`);
      }
    }
    if (link.estimatedReadTime) {
      lines.push(`  읽기 시간: 약 ${link.estimatedReadTime}분`);
    }
  }

  lines.push(``, `---`, `LinkDigest 뉴스레터 설정에 의해 발송되었습니다.`);

  return lines.join("\n");
}

// --- 유틸리티 ---

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
