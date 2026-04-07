import type { ScrapedContent } from "@/lib/scraper/types";

const SYSTEM_PROMPT = `You are a content summarizer. Given the content of a web page or video transcript, produce a structured summary in Korean.

Rules:
- title: The original content title (keep the original language if it's already Korean, otherwise translate to Korean)
- oneLineSummary: A concise one-line summary in Korean (50 characters or less)
- keyPoints: Exactly 3 key takeaways in Korean, each a single sentence
- estimatedReadTime: Estimated reading time in minutes for the original content

Output must be valid JSON matching the requested schema.`;

/** 스크래핑된 콘텐츠로 LLM 프롬프트 생성 */
export function buildSummaryPrompt(
  content: ScrapedContent,
  url: string,
): { system: string; user: string } {
  const contentLabel =
    content.contentType === "youtube" ? "YouTube 영상 자막" : "웹 기사 본문";

  let user: string;

  if (content.body) {
    user = `다음은 ${contentLabel}입니다. 요약해주세요.

URL: ${url}
${content.title ? `제목: ${content.title}` : ""}

--- 본문 시작 ---
${content.body}
--- 본문 끝 ---`;
  } else {
    // body가 없는 경우 (크롤링 부분 실패)
    user = `다음 URL의 콘텐츠를 제목과 URL 정보만으로 요약해주세요.

URL: ${url}
${content.title ? `제목: ${content.title}` : "제목: 알 수 없음"}

본문을 가져올 수 없었으므로, 제목과 URL에서 유추할 수 있는 정보로 요약을 생성해주세요.`;
  }

  return { system: SYSTEM_PROMPT, user };
}
