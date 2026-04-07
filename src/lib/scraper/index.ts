import { isYoutubeUrl } from "@/lib/utils/url";
import { scrapeArticle } from "./article";
import { scrapeYoutube } from "./youtube";
import type { ScrapedContent } from "./types";

export type { ScrapedContent } from "./types";

/** URL 타입에 따라 적절한 스크레이퍼를 호출 */
export async function scrape(url: string): Promise<ScrapedContent> {
  if (isYoutubeUrl(url)) {
    return scrapeYoutube(url);
  }
  return scrapeArticle(url);
}
