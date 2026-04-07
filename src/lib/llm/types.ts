import { z } from "zod";

/** LLM 요약 결과 Zod 스키마 */
export const summaryResultSchema = z.object({
  title: z.string(),
  oneLineSummary: z.string(),
  keyPoints: z.array(z.string()).length(3),
  estimatedReadTime: z.number().int().min(1),
});

export type SummaryResult = z.infer<typeof summaryResultSchema>;

/** LLM 호출에 필요한 설정 */
export type LlmConfig = {
  provider: "openai" | "anthropic" | "google";
  model: string;
  apiKey: string;
};
