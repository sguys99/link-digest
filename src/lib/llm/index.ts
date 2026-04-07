import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { summaryResultSchema, type SummaryResult, type LlmConfig } from "./types";
import { buildSummaryPrompt } from "./prompt";
import type { ScrapedContent } from "@/lib/scraper/types";

/** provider 설정 기반으로 AI SDK 모델 인스턴스 생성 */
function createModel(config: LlmConfig) {
  switch (config.provider) {
    case "openai":
      return createOpenAI({ apiKey: config.apiKey })(config.model);
    case "anthropic":
      return createAnthropic({ apiKey: config.apiKey })(config.model);
    case "google":
      return createGoogleGenerativeAI({ apiKey: config.apiKey })(config.model);
  }
}

/** 스크래핑된 콘텐츠를 LLM으로 요약 */
export async function summarize(
  content: ScrapedContent,
  url: string,
  config: LlmConfig,
): Promise<SummaryResult> {
  const model = createModel(config);
  const prompt = buildSummaryPrompt(content, url);

  const { output } = await generateText({
    model,
    output: Output.object({ schema: summaryResultSchema }),
    system: prompt.system,
    prompt: prompt.user,
  });

  if (!output) {
    throw new Error("LLM이 유효한 구조화 출력을 생성하지 못했습니다.");
  }

  return output;
}
