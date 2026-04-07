import { YoutubeTranscript } from "youtube-transcript";
import type { ScrapedContent } from "./types";

const MAX_BODY_LENGTH = 6_000;

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
};

/** YouTube oEmbed API로 제목/썸네일 가져오기 */
async function fetchOEmbed(
  url: string,
): Promise<{ title: string | null; thumbnailUrl: string | null }> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!res.ok) return { title: null, thumbnailUrl: null };

    const data = (await res.json()) as OEmbedResponse;
    return {
      title: data.title ?? null,
      thumbnailUrl: data.thumbnail_url ?? null,
    };
  } catch {
    return { title: null, thumbnailUrl: null };
  }
}

/** YouTube 자막 추출 + oEmbed 메타데이터 */
export async function scrapeYoutube(url: string): Promise<ScrapedContent> {
  const oembed = await fetchOEmbed(url);

  let body: string | null = null;
  try {
    const segments = await YoutubeTranscript.fetchTranscript(url);
    const fullText = segments.map((s) => s.text).join(" ");
    body =
      fullText.length > MAX_BODY_LENGTH
        ? fullText.slice(0, MAX_BODY_LENGTH)
        : fullText;
  } catch {
    // 자막 비활성화 / 비공개 영상 등 — body 없이 진행
  }

  return {
    title: oembed.title,
    body,
    thumbnailUrl: oembed.thumbnailUrl,
    contentType: "youtube",
  };
}
