import type { ContentType } from "@/types";

const YOUTUBE_HOSTNAMES = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "m.youtube.com",
]);

/** URL이 유튜브 링크인지 판별 */
export function isYoutubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return YOUTUBE_HOSTNAMES.has(parsed.hostname);
  } catch {
    return false;
  }
}

/** URL 기반으로 content_type 결정 */
export function detectContentType(url: string): ContentType {
  return isYoutubeUrl(url) ? "youtube" : "article";
}
