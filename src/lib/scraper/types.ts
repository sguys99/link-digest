import type { ContentType } from "@/types";

/** 스크레이퍼 추출 결과 */
export type ScrapedContent = {
  title: string | null;
  /** 본문 텍스트 (LLM에 전달) */
  body: string | null;
  thumbnailUrl: string | null;
  contentType: ContentType;
};

/** OG 메타태그 추출 결과 */
export type MetaData = {
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
};
