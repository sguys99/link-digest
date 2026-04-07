import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { extractMeta } from "./meta";
import type { ScrapedContent } from "./types";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_LENGTH = 6_000;

/** 일반 웹 기사 본문 추출 (Cheerio + Readability) */
export async function scrapeArticle(url: string): Promise<ScrapedContent> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LinkDigestBot/1.0; +https://linkdigest.app)",
    },
  });

  if (!res.ok) {
    // HTTP 에러 시 meta fallback
    const meta = await extractMeta(url).catch(() => null);
    return {
      title: meta?.title ?? null,
      body: null,
      thumbnailUrl: meta?.thumbnailUrl ?? null,
      contentType: "article",
    };
  }

  const html = await res.text();

  // Readability로 본문 추출
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();

  if (article?.textContent) {
    const body =
      article.textContent.length > MAX_BODY_LENGTH
        ? article.textContent.slice(0, MAX_BODY_LENGTH)
        : article.textContent;

    // Readability에서 제목/이미지가 없으면 meta fallback
    let thumbnailUrl: string | null = null;
    if (!article.title) {
      const meta = await extractMeta(url).catch(() => null);
      thumbnailUrl = meta?.thumbnailUrl ?? null;
    }

    return {
      title: article.title || null,
      body: body.trim(),
      thumbnailUrl,
      contentType: "article",
    };
  }

  // Readability 실패 → meta fallback
  const meta = await extractMeta(url).catch(() => null);
  return {
    title: meta?.title ?? null,
    body: meta?.description ?? null,
    thumbnailUrl: meta?.thumbnailUrl ?? null,
    contentType: "article",
  };
}
