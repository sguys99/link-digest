import type { ScrapedContent } from "@/lib/scraper/types";

type BasicSummary = {
  oneLineSummary: string | null;
  estimatedReadTime: number | null;
};

const MAX_SUMMARY_LENGTH = 50;
const CHARS_PER_MINUTE = 500;

/** 스크래핑된 콘텐츠에서 룰 기반 기본 요약을 추출한다 (LLM 폴백용). */
export function extractBasicSummary(scraped: ScrapedContent): BasicSummary {
  if (!scraped.body) {
    return { oneLineSummary: null, estimatedReadTime: null };
  }

  return {
    oneLineSummary: extractFirstSentence(scraped.body),
    estimatedReadTime: Math.max(1, Math.round(scraped.body.length / CHARS_PER_MINUTE)),
  };
}

/** 본문에서 첫 번째 의미 있는 문장을 추출한다. */
function extractFirstSentence(body: string): string | null {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(.+?[.?!。])\s/);
  const sentence = match ? match[1].trim() : trimmed;

  if (sentence.length <= MAX_SUMMARY_LENGTH) {
    return sentence;
  }

  return sentence.slice(0, MAX_SUMMARY_LENGTH - 3) + "...";
}
