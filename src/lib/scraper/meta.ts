import * as cheerio from "cheerio";
import type { MetaData } from "./types";

const FETCH_TIMEOUT_MS = 10_000;

/** OG 메타태그 추출 (fallback용) */
export async function extractMeta(url: string): Promise<MetaData> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LinkDigestBot/1.0; +https://linkdigest.app)",
    },
  });

  if (!res.ok) {
    return { title: null, description: null, thumbnailUrl: null };
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const ogTitle =
    $('meta[property="og:title"]').attr("content") ?? null;
  const ogDescription =
    $('meta[property="og:description"]').attr("content") ?? null;
  const ogImage =
    $('meta[property="og:image"]').attr("content") ?? null;

  const title = ogTitle || $("title").text().trim() || null;
  const description =
    ogDescription ||
    $('meta[name="description"]').attr("content") ||
    null;

  return { title, description, thumbnailUrl: ogImage };
}
